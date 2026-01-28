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
          process: { select: { code: true, name: true } }, // Added to header
          steps: {
            orderBy: { orderNo: "asc" },
            select: {
              id: true,
              orderNo: true,
              up: true,
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
        processId: z.number().int().positive(), // New: header process
        qtyPoPcs: z.number().int().positive(),
        startDate: z.coerce.date().optional(),
        steps: z
          .array(
            z.object({
              up: z.number().int().min(0).optional(),
              machineId: z.number().int().positive().nullable().optional(),
              materials: z
                .array(
                  z.object({
                    materialId: z.number().int().positive(),
                    qtyReq: z.number().positive(),
                  }),
                )
                .default([]),
              startDate: z.coerce.date().optional(),
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

      const proc = await ctx.db.process.findUnique({
        where: { id: input.processId },
        select: { code: true },
      });
      if (!proc)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Proses tidak valid",
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

        // AUTO-SET PRO.startDate from first step's startDate
        const firstStepDate = input.steps[0]?.startDate ?? undefined;

        const created = await tx.pro.create({
          data: {
            proNumber,
            processId: input.processId,
            productName: input.productName,
            qtyPoPcs: input.qtyPoPcs,
            startDate: firstStepDate, // Auto from first step
            status: "OPEN",
            steps: {
              create: input.steps.map((s, idx) => ({
                orderNo: idx + 1,
                up: s.up,
                machineId: s.machineId ?? null,
                startDate: s.startDate ?? undefined,
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
        // AUTOMATIC SCHEDULING LOGIC (Sequential Scheduling)
        // If first step has startDate, auto-schedule remaining steps sequentially.
        
        if (firstStepDate) {
           const createdSteps = await tx.proStep.findMany({
             where: { proId: created.id },
             orderBy: { orderNo: "asc" },
             include: { machine: true }
           });
           
           let currentDate = new Date(firstStepDate);
           
           for (const step of createdSteps) {
             // Only update steps that don't have startDate already
             if (!step.startDate) {
               await tx.proStep.update({
                 where: { id: step.id },
                 data: { startDate: currentDate }
               });
             }
             
             // Calculate duration to advance cursor for next step
             const std = step.machine?.stdOutputPerShift || 1000;
             const up = step.up || 1;
             const qty = input.qtyPoPcs;
             const shifts = Math.ceil(qty / (up * std));
             const daysToAdd = Math.max(0, shifts / 3);
             
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
          processId: true, // Added to header
          process: { select: { code: true, name: true } }, // Added to header
          steps: {
            orderBy: { orderNo: "asc" },
            select: {
              id: true,
              orderNo: true,
              up: true,
              machineId: true,
              startDate: true,
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
        processId: z.number().int().positive(), // Allow changing process
        qtyPoPcs: z.number().int().positive(),
        startDate: z.coerce.date().optional(),
        status: z.enum(["OPEN", "IN_PROGRESS", "DONE", "CANCELLED"]).optional(),
        steps: z
          .array(
            z.object({
              orderNo: z.number().int().positive(),
              up: z.number().int().min(0),
              machineId: z.number().int().positive().nullable().optional(),
              materialId: z.number().int().positive().nullable().optional(),
              qtyReq: z.number().positive().optional(),
              startDate: z.coerce.date().optional(),
            }),
          )
          .min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (tx) => {
        // 1. Fetch old PRO to detect startDate change
        const oldPro = await tx.pro.findUnique({
          where: { id: input.id },
          select: {
            startDate: true,
            steps: {
              select: {
                id: true,
                orderNo: true,
                startDate: true,
                shifts: {
                  select: {
                    shiftIndex: true,
                    scheduledDate: true,
                  },
                },
              },
            },
          },
        });

        if (!oldPro) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "PRO not found",
          });
        }

        // 2. Calculate delta if startDate changed
        let deltaDays = 0;
        const oldStartDate = oldPro.startDate;
        const newStartDate = input.startDate;

        if (oldStartDate && newStartDate) {
          const oldTime = new Date(oldStartDate).getTime();
          const newTime = new Date(newStartDate).getTime();
          deltaDays = Math.round((newTime - oldTime) / (1000 * 60 * 60 * 24));
        }

        // 3. Build adjusted step dates map (orderNo -> adjusted startDate)
        const adjustedStepDates = new Map<number, Date | undefined>();
        const adjustedShifts = new Map<number, Array<{ shiftIndex: number; scheduledDate: Date }>>();

        if (deltaDays !== 0) {
          for (const oldStep of oldPro.steps) {
            // Adjust step startDate
            if (oldStep.startDate) {
              const adjusted = new Date(oldStep.startDate);
              adjusted.setDate(adjusted.getDate() + deltaDays);
              adjustedStepDates.set(oldStep.orderNo, adjusted);
            }

            // Adjust shift scheduledDates
            if (oldStep.shifts.length > 0) {
              const adjustedShiftList = oldStep.shifts.map((shift) => {
                const adjustedDate = new Date(shift.scheduledDate);
                adjustedDate.setDate(adjustedDate.getDate() + deltaDays);
                return {
                  shiftIndex: shift.shiftIndex,
                  scheduledDate: adjustedDate,
                };
              });
              adjustedShifts.set(oldStep.orderNo, adjustedShiftList);
            }
          }
        }

        // 4. Update header
        await tx.pro.update({
          where: { id: input.id },
          data: {
            processId: input.processId,
            productName: input.productName,
            qtyPoPcs: input.qtyPoPcs,
            startDate: input.startDate,
            ...(input.status ? { status: input.status } : {}),
          },
        });

        // 5. Delete old steps (cascade will delete shifts)
        await tx.proStep.deleteMany({ where: { proId: input.id } });

        // 6. Recreate steps with adjusted dates
        await tx.proStep.createMany({
          data: input.steps.map((s) => {
            // Use adjusted date if delta exists, else use input date
            let finalStartDate = s.startDate;
            if (deltaDays !== 0 && adjustedStepDates.has(s.orderNo)) {
              finalStartDate = adjustedStepDates.get(s.orderNo);
            }

            return {
              proId: input.id,
              orderNo: s.orderNo,
              up: s.up,
              machineId: s.machineId ?? null,
              startDate: finalStartDate,
            };
          }),
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

        // 7. Recreate adjusted shifts if any
        if (deltaDays !== 0 && adjustedShifts.size > 0) {
          const shiftsToCreate: Array<{
            stepId: number;
            shiftIndex: number;
            scheduledDate: Date;
          }> = [];

          for (const [orderNo, shiftList] of adjustedShifts.entries()) {
            const stepId = stepIdByOrder.get(orderNo);
            if (stepId) {
              for (const shift of shiftList) {
                shiftsToCreate.push({
                  stepId,
                  shiftIndex: shift.shiftIndex,
                  scheduledDate: shift.scheduledDate,
                });
              }
            }
          }

          if (shiftsToCreate.length > 0) {
            await tx.proStepShift.createMany({ data: shiftsToCreate });
          }
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
          OR: [
            // PRO startDate in range
            {
              startDate: {
                gte: input.start,
                lte: input.end,
              },
            },
            // OR any step startDate in range
            {
              steps: {
                some: {
                  startDate: {
                    gte: input.start,
                    lte: input.end,
                  },
                },
              },
            },
            // OR any shift scheduledDate in range
            {
              steps: {
                some: {
                  shifts: {
                    some: {
                      scheduledDate: {
                        gte: input.start,
                        lte: input.end,
                      },
                    },
                  },
                },
              },
            },
          ],
        },
        select: {
          id: true,
          proNumber: true,
          productName: true,
          qtyPoPcs: true,
          startDate: true,
          status: true,
          process: { select: { name: true, code: true } }, // Added to header
          steps: {
            orderBy: { orderNo: "asc" },
            select: {
              id: true,
              orderNo: true,
              up: true,
              machine: {
                select: { id: true, name: true, stdOutputPerShift: true },
              },
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
