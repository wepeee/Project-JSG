import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Prisma } from "generated/prisma";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

const ppicProcedure = protectedProcedure;

const pad3 = (n: number) => String(n).padStart(3, "0"); // 001..999
const mm = (d: Date) => String(d.getMonth() + 1).padStart(2, "0");
const yy = (d: Date) => String(d.getFullYear()).slice(-2);

export const prosRouter = createTRPCRouter({
  list: ppicProcedure
    .input(
      z.object({
        q: z.string().optional(), // search proNumber / productName
        status: z.enum(["OPEN", "IN_PROGRESS", "DONE", "CANCELLED"]).optional(),
        take: z.number().min(5).max(50).default(20),
        cursor: z.number().int().positive().optional(), // pakai Pro.id
      }),
    )
    .query(async ({ ctx, input }) => {
      const take = input.take ?? 20;
      const q = input.q?.trim();

      const where: any = {};
      if (input.status) where.status = input.status;

      if (q) {
        where.OR = [
          { proNumber: { contains: q } },
          { productName: { contains: q } },
        ];
      }

      const items = await ctx.db.pro.findMany({
        take: take + 1,
        ...(input.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}),
        where,
        orderBy: { id: "desc" },
        select: {
          id: true,
          proNumber: true,
          productName: true,
          qtyPoPcs: true,
          startDate: true,
          status: true,
          createdAt: true,
          steps: {
            orderBy: { orderNo: "asc" },
            select: {
              id: true,
              orderNo: true,
              up: true,
              process: { select: { code: true, name: true } },
              machine: {
                select: {
                  name: true,
                  stdOutputPerHour: true,
                  stdOutputPerShift: true,
                },
              },
              startDate: true, // add this
              materials: {
                select: {
                  qtyReq: true,
                  material: { select: { name: true, uom: true } },
                },
              },
            },
          },
        },
      });

      let nextCursor: number | undefined = undefined;
      if (items.length > take) {
        const next = items.pop()!;
        nextCursor = next.id;
      }

      return { items, nextCursor };
    }),

  create: ppicProcedure
    .input(
      z.object({
        productName: z.string().min(1),
        qtyPoPcs: z.number().int().positive(),
        startDate: z.coerce.date().optional(),
        steps: z
          .array(
            z.object({
              processId: z.number().int().positive(),
              up: z.number().int().min(0).optional(), // ✅ pindah ke step
              machineId: z.number().int().positive().nullable().optional(),
              materials: z
                .array(
                  z.object({
                    materialId: z.number().int().positive(),
                    qtyReq: z.number().positive(),
                  }),
                )
                .default([]),
              startDate: z.coerce.date().optional(), // add this
            }),
          )
          .min(1),
      }),
    )

    .mutation(async ({ ctx, input }) => {
      const baseDate = input.startDate ?? new Date();

      const steps = input.steps;

      if (!steps.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Steps minimal 1",
        });
      }

      const first = steps[0]!;
      const proc = await ctx.db.process.findUnique({
        where: { id: first.processId },
        select: { code: true },
      });
      if (!proc)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Proses pertama tidak valid",
        });

      const prefix = `${proc.code}${mm(baseDate)}${yy(baseDate)}`; // 6 digit

      return ctx.db.$transaction(async (tx) => {
        const seq = await tx.proSequence.upsert({
          where: { prefix },
          update: { last: { increment: 1 } },
          create: { prefix, last: 1 },
          select: { last: true },
        });

        const proNumber = `${prefix}${pad3(seq.last)}`; // 9 digit

        const created = await tx.pro.create({
          data: {
            proNumber,
            productName: input.productName,
            qtyPoPcs: input.qtyPoPcs,
            startDate: input.startDate,
            status: "OPEN",
            steps: {
              create: input.steps.map((s, idx) => ({
                orderNo: idx + 1,
                processId: s.processId,
                up: s.up,
                machineId: s.machineId ?? null,
                startDate: s.startDate ?? (idx === 0 ? input.startDate : undefined), // simple default
                materials: {
                  create: (s.materials ?? []).map((m) => ({
                    materialId: m.materialId,
                    qtyReq: new Prisma.Decimal(m.qtyReq),
                  })),
                },
              })),
            },
          },
        });

        // -------------------------------------------------------------
        // AUTOMATIC SCHEDULING LOGIC (Simple Version)
        // If the PRO has a startDate, we try to schedule the steps sequentially.
        // Step 1 starts at PRO.startDate.
        // Step 2 starts after Step 1 finishes (based on Qty / Output).
        // For now, we just auto-fill 'startDate' if it wasn't provided in the input,
        // staggering them by 1 day as a placeholder if we want.
        // BUT the user said "otomatis yang ngebagi shift per mesin".
        // Let's implement a quick update after creation to set startDate if not present.
        
        if (input.startDate) {
           // We can't easily do it inside the 'create' data object because we need sequential calc.
           // So we fetch the created steps, calculate dates, and update them.
           const createdSteps = await tx.proStep.findMany({
             where: { proId: created.id },
             orderBy: { orderNo: "asc" },
             include: { machine: true }
           });
           
           let currentDate = new Date(input.startDate);
           // round to shift 1 (08:00 or 06:00)? Let's keep time as is.
           
           for (const step of createdSteps) {
             await tx.proStep.update({
               where: { id: step.id },
               data: { startDate: currentDate }
             });
             
             // Calculate duration to advance cursor
             // Shifts needed = ceil(qty / (up * std))
             // std per shift?
             const std = step.machine?.stdOutputPerShift || 1000; // fallback
             const up = step.up || 1;
             const qty = input.qtyPoPcs;
             const shifts = Math.ceil(qty / (up * std));
             
             // 1 day = 3 shifts (approx).
             // advance currentDate by shifts * 8 hours? or days?
             // Simple logic: add (shifts / 3) days.
             const daysToAdd = Math.max(0, shifts / 3);
             
             // Add milliseconds
             currentDate = new Date(currentDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
           }
        }
        // -------------------------------------------------------------

        return created;
      });
    }),

  getById: ppicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const pro = await ctx.db.pro.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          proNumber: true,
          productName: true,
          qtyPoPcs: true,
          startDate: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          steps: {
            orderBy: { orderNo: "asc" },
            select: {
              id: true,
              orderNo: true,
              processId: true,
              up: true,
              machineId: true,
              startDate: true,
              process: { select: { code: true, name: true } },
              machine: {
                select: {
                  id: true,
                  name: true,
                  stdOutputPerShift: true,
                },
              },
              materials: {
                select: {
                  materialId: true,
                  qtyReq: true,
                  material: { select: { name: true, uom: true } },
                },
              },
              shifts: {
                orderBy: { shiftIndex: "asc" },
                select: {
                  id: true,
                  shiftIndex: true,
                  scheduledDate: true,
                },
              },
            },
          },
        },
      });

      if (!pro) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "PRO tidak ditemukan",
        });
      }

      return pro;
    }),
  update: ppicProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        productName: z.string().min(1),
        qtyPoPcs: z.number().int().positive(),
        startDate: z.coerce.date().optional(),
        status: z.enum(["OPEN", "IN_PROGRESS", "DONE", "CANCELLED"]).optional(),
        steps: z
          .array(
            z.object({
              orderNo: z.number().int().positive(),
              processId: z.number().int().positive(),
              up: z.number().int().min(0),
              machineId: z.number().int().positive().nullable().optional(),
              materialId: z.number().int().positive().nullable().optional(),
              qtyReq: z.number().positive().optional(),
              startDate: z.coerce.date().optional(), // add this
            }),
          )
          .min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (tx) => {
        // update header
        await tx.pro.update({
          where: { id: input.id },
          data: {
            productName: input.productName,
            qtyPoPcs: input.qtyPoPcs,
            startDate: input.startDate,
            ...(input.status ? { status: input.status } : {}),
          },
        });

        // hapus semua steps lama (cascade akan hapus proStepMaterial kalau relasinya onDelete Cascade)
        await tx.proStep.deleteMany({ where: { proId: input.id } });

        // create ulang
        await tx.proStep.createMany({
          data: input.steps.map((s) => ({
            proId: input.id,
            orderNo: s.orderNo,
            processId: s.processId,
            up: s.up,
            machineId: s.machineId ?? null,
            startDate: s.startDate,
          })),
        });

        // Ambil step baru untuk mapping material (butuh id)
        const newSteps = await tx.proStep.findMany({
          where: { proId: input.id },
          select: { id: true, orderNo: true },
        });

        const stepIdByOrder = new Map(newSteps.map((s) => [s.orderNo, s.id]));

        const mats = input.steps
          .filter((s) => s.materialId)
          .map((s) => {
            const stepId = stepIdByOrder.get(s.orderNo);
            if (!stepId)
              throw new Error(`StepId not found for orderNo=${s.orderNo}`);

            return {
              stepId,
              materialId: s.materialId!,
              qtyReq: s.qtyReq ?? 0,
            };
          });

        if (mats.length) {
          await tx.proStepMaterial.createMany({ data: mats });
        }

        return tx.pro.findUnique({
          where: { id: input.id },
          select: { id: true, proNumber: true },
        });
      });
    }),

  delete: ppicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const exists = await ctx.db.pro.findUnique({
        where: { id: input.id },
        select: { id: true },
      });
      if (!exists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "PRO tidak ditemukan",
        });
      }

      await ctx.db.pro.delete({ where: { id: input.id } });
      return { ok: true };
    }),

  reschedule: ppicProcedure
    .input(z.object({ id: z.number(), startDate: z.coerce.date() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.pro.update({
        where: { id: input.id },
        data: { startDate: input.startDate },
      });
    }),

  rescheduleStep: ppicProcedure
    .input(z.object({ stepId: z.number(), startDate: z.coerce.date() }))
    .mutation(async ({ ctx, input }) => {
      // Logic: Update startDate of specific step
      return ctx.db.proStep.update({
        where: { id: input.stepId },
        data: { startDate: input.startDate },
      });
    }),

  rescheduleShift: ppicProcedure
    .input(
      z.object({
        stepId: z.number(),
        shiftIndex: z.number().int().min(0),
        scheduledDate: z.coerce.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Upsert: create if doesn't exist, update if exists
      return ctx.db.proStepShift.upsert({
        where: {
          stepId_shiftIndex: {
            stepId: input.stepId,
            shiftIndex: input.shiftIndex,
          },
        },
        create: {
          stepId: input.stepId,
          shiftIndex: input.shiftIndex,
          scheduledDate: input.scheduledDate,
        },
        update: {
          scheduledDate: input.scheduledDate,
        },
      });
    }),

  getSchedule: ppicProcedure
    .input(
      z.object({
        start: z.coerce.date(),
        end: z.coerce.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.pro.findMany({
        where: {
          startDate: {
            gte: input.start,
            lte: input.end,
          },
        },
        select: {
          id: true,
          proNumber: true,
          productName: true,
          qtyPoPcs: true,
          startDate: true,
          status: true,
          steps: {
            orderBy: { orderNo: "asc" },
            select: {
              id: true,
              orderNo: true,
              up: true,
              machine: {
                select: { id: true, name: true, stdOutputPerShift: true },
              },
              process: { select: { name: true, code: true } },
              startDate: true, // add this
              shifts: {
                orderBy: { shiftIndex: "asc" },
                select: {
                  id: true,
                  shiftIndex: true,
                  scheduledDate: true,
                },
              },
            },
          },
        },
        orderBy: { startDate: "asc" },
      });
      return items;
    }),
});
