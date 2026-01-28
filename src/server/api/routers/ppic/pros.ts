import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Prisma } from "generated/prisma";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

const ppicProcedure = protectedProcedure;

const pad3 = (n: number) => String(n).padStart(3, "0"); // 001..999
const mm = (d: Date) => String(d.getMonth() + 1).padStart(2, "0");
const yy = (d: Date) => String(d.getFullYear()).slice(-2);

const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const getShiftFromTime = (d: Date) => {
  const h = d.getHours();
  if (h >= 16) return 2; // Shift 3
  if (h >= 11) return 1; // Shift 2
  return 0; // Shift 1
};

const getShiftDate = (day: Date, shiftIndex: number) => {
  const d = new Date(day);
  if (shiftIndex === 0) d.setHours(6, 0, 0, 0);
  else if (shiftIndex === 1) d.setHours(11, 0, 0, 0);
  else d.setHours(16, 0, 0, 0);
  d.setMinutes(0, 0, 0);
  return d;
};

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
        expand: z.boolean().default(true).optional(),
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
          },
        });

        // -------------------------------------------------------------
        // AUTOMATIC EXPANSION: 1 Shift = 1 ProStep row
        
        let proStartDate = input.startDate ?? new Date();
        let currentDay = startOfDay(proStartDate);
        let currentShift = getShiftFromTime(proStartDate);

        let globalOrderNo = 1;

        for (const inputStep of input.steps) {
          const std = 1000; // Default if no machine
          const up = inputStep.up || 1;
          const qty = input.qtyPoPcs;
          
          let machineStd = std;
          if (inputStep.machineId) {
             const m = await tx.machine.findUnique({ where: { id: inputStep.machineId }, select: { stdOutputPerShift: true } });
             if (m?.stdOutputPerShift) machineStd = m.stdOutputPerShift;
          }

          const need = input.expand !== false ? Math.max(1, Math.ceil(qty / (up * machineStd))) : 1;

          // Use inputStep's startDate as anchor if provided
          if (inputStep.startDate) {
            currentDay = startOfDay(new Date(inputStep.startDate));
            currentShift = getShiftFromTime(new Date(inputStep.startDate));
          }

          for (let i = 0; i < need; i++) {
            await tx.proStep.create({
              data: {
                proId: created.id,
                orderNo: globalOrderNo++,
                up: inputStep.up,
                machineId: inputStep.machineId ?? null,
                startDate: getShiftDate(currentDay, currentShift),
                materials: {
                  create: (inputStep.materials ?? []).map((m) => ({
                    materialId: m.materialId,
                    qtyReq: new Prisma.Decimal(m.qtyReq),
                  })),
                },
              },
            });

            // Advance cursor if we are expanding OR if no explicit start date on step
            if (input.expand !== false) {
               if (currentShift < 2) currentShift++;
               else { currentShift = 0; currentDay.setDate(currentDay.getDate() + 1); }
            }
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
        expand: z.boolean().default(false).optional(),
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
            qtyPoPcs: true,
            startDate: true,
            steps: {
              select: {
                id: true,
                orderNo: true,
                up: true,
                machineId: true,
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

        // 5. Delete old steps
        await tx.proStep.deleteMany({ where: { proId: input.id } });

        // 6. Recreate steps (EXPANDED)
        const qtyChanged = oldPro.qtyPoPcs !== input.qtyPoPcs;
        
        let currentDay = startOfDay(input.startDate ?? oldPro.startDate ?? new Date());
        let currentShift = getShiftFromTime(input.startDate ?? oldPro.startDate ?? new Date());

        let globalOrderNo = 1;

        for (const inputStep of input.steps) {
           const std = 1000;
           const up = inputStep.up || 1;
           const qty = input.qtyPoPcs;
           
           let machineStd = std;
           if (inputStep.machineId) {
              const m = await tx.machine.findUnique({ where: { id: inputStep.machineId }, select: { stdOutputPerShift: true } });
              if (m?.stdOutputPerShift) machineStd = m.stdOutputPerShift;
           }

           const need = input.expand ? Math.max(1, Math.ceil(qty / (up * machineStd))) : 1;

           // Shift preservation logic logic removed here for simplicity in this specific rewrite 
           // and moved to handle shift-as-step expansion directly.
           
           if (inputStep.startDate) {
              currentDay = startOfDay(new Date(inputStep.startDate));
              currentShift = getShiftFromTime(new Date(inputStep.startDate));
           }

           for (let i = 0; i < need; i++) {
              await tx.proStep.create({
                data: {
                  proId: input.id,
                  orderNo: globalOrderNo++,
                  up: inputStep.up,
                  machineId: inputStep.machineId ?? null,
                  startDate: getShiftDate(currentDay, currentShift),
                  materials: {
                    create: inputStep.materialId ? [{
                      materialId: inputStep.materialId,
                      qtyReq: new Prisma.Decimal(inputStep.qtyReq ?? 0),
                    }] : []
                  }
                }
              });

              if (input.expand) {
                 if (currentShift < 2) currentShift++;
                 else { currentShift = 0; currentDay.setDate(currentDay.getDate() + 1); }
              }
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
