import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Prisma } from "generated/prisma";
import {
  createTRPCRouter,
  ppicProcedure,
  protectedProcedure,
} from "../../trpc";

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
        type: z.enum(["PAPER", "RIGID", "OTHER"]).optional(), // Added
        take: z.number().min(5).max(50).default(20),
        cursor: z.number().int().positive().optional(), // pakai Pro.id
      }),
    )
    .query(async ({ ctx, input }) => {
      const take = input.take ?? 20;
      const q = input.q?.trim();

      const where: any = {};
      if (input.status) where.status = input.status;
      if (input.type) where.type = input.type; // Added

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
          type: true, // Added
          autoShiftExpansion: true, // Added flag
          createdAt: true,
          process: { select: { code: true, name: true } }, // Added to header
          steps: {
            orderBy: { orderNo: "asc" },
            select: {
              id: true,
              orderNo: true,
              up: true,
              manPowerStd: true,
              cycleTimeStd: true,
              cavityStd: true,
              machine: {
                select: {
                  name: true,
                  stdOutputPerHour: true,
                  stdOutputPerShift: true,
                  uom: true,
                },
              },
              startDate: true, // add this
              partNumber: true, // Added
              estimatedShifts: true,
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
        type: z.enum(["PAPER", "RIGID", "OTHER"]).default("PAPER"), // Added
        qtyPoPcs: z.number().int().positive(),
        proNumber: z.string().optional(), // Manual PRO override
        startDate: z.coerce.date().optional(),
        expand: z.boolean().default(true).optional(),
        autoShiftExpansion: z.boolean().default(false).optional(), // Flag otomatisasi shift
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
              partNumber: z.string().optional(), // Added to step input
              // Standard Params
              manPowerStd: z.number().int().optional(),
              cycleTimeStd: z.number().optional(),
              cavityStd: z.number().int().optional(),
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
        let proNumber = input.proNumber?.trim();

        if (!proNumber) {
          const seq = await tx.proSequence.upsert({
            where: { prefix },
            update: { last: { increment: 1 } },
            create: { prefix, last: 1 },
            select: { last: true },
          });
          proNumber = `${prefix}${pad3(seq.last)}`; // 9 digit
        } else {
          // Check uniqueness if manual
          const exist = await tx.pro.findUnique({ where: { proNumber } });
          if (exist) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `PRO Number '${proNumber}' sudah ada.`,
            });
          }
        }

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
            type: input.type, // Added
            autoShiftExpansion: input.autoShiftExpansion ?? false, // Save flag
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
          const firstMatQty = inputStep.materials[0]?.qtyReq;
          const qty =
            firstMatQty !== undefined ? Number(firstMatQty) : input.qtyPoPcs;
          const up = firstMatQty !== undefined ? 1 : inputStep.up || 1;

          let machineStd = std;
          let isSheet = false;
          if (inputStep.machineId) {
            const m = await tx.machine.findUnique({
              where: { id: inputStep.machineId },
              select: { stdOutputPerShift: true, uom: true },
            });
            if (m?.stdOutputPerShift) machineStd = m.stdOutputPerShift;
            if (m?.uom === "sheet") isSheet = true;
          }

          const need =
            input.expand !== false && isSheet
              ? Math.max(1, Math.ceil(qty / (up * machineStd)))
              : 1;

          // Use inputStep's startDate as anchor if provided
          if (inputStep.startDate) {
            currentDay = startOfDay(new Date(inputStep.startDate));
            currentShift = getShiftFromTime(new Date(inputStep.startDate));
          }

          const totalSheets = up > 0 ? qty / up : qty;

          for (let i = 0; i < need; i++) {
            const sheetsInThisShift = Math.max(
              0,
              Math.min(totalSheets - i * machineStd, machineStd),
            );
            const portion =
              totalSheets > 0 ? sheetsInThisShift / totalSheets : 1;

            if (sheetsInThisShift > 0 && inputStep.machineId) {
              await checkCapacity(
                tx,
                inputStep.machineId,
                getShiftDate(currentDay, currentShift),
                sheetsInThisShift,
              );
            }

            await tx.proStep.create({
              data: {
                proId: created.id,
                orderNo: globalOrderNo++,
                up: inputStep.up,
                machineId: inputStep.machineId ?? null,
                startDate: getShiftDate(currentDay, currentShift),
                partNumber: inputStep.partNumber, // Added
                // Standard Params
                manPowerStd: inputStep.manPowerStd,
                cycleTimeStd: inputStep.cycleTimeStd
                  ? new Prisma.Decimal(inputStep.cycleTimeStd)
                  : undefined,
                cavityStd: inputStep.cavityStd,
                materials: {
                  create: (inputStep.materials ?? []).map((m) => ({
                    materialId: m.materialId,
                    qtyReq: new Prisma.Decimal(m.qtyReq * portion),
                  })),
                },
                estimatedShifts: need,
              },
            });

            // Advance cursor if we are expanding OR if no explicit start date on step
            if (input.expand !== false) {
              if (currentShift < 2) currentShift++;
              else {
                currentShift = 0;
                currentDay.setDate(currentDay.getDate() + 1);
              }
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
          autoShiftExpansion: true, // Added flag
          processId: true, // Added to header
          process: { select: { code: true, name: true } }, // Added to header
          steps: {
            orderBy: { orderNo: "asc" },
            select: {
              id: true,
              orderNo: true,
              up: true,
              machineId: true,
              manPowerStd: true,
              cycleTimeStd: true,
              cavityStd: true,
              startDate: true,
              partNumber: true, // Added
              estimatedShifts: true,
              machine: {
                select: {
                  id: true,
                  name: true,
                  stdOutputPerShift: true,
                  uom: true,
                },
              },
              materials: {
                select: {
                  materialId: true,
                  qtyReq: true,
                  material: { select: { name: true, uom: true } },
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
        partNumber: z.string().optional(), // Added
        processId: z.number().int().positive(), // Allow changing process
        qtyPoPcs: z.number().int().positive(),
        startDate: z.coerce.date().optional(),
        expand: z.boolean().default(false).optional(),
        status: z.enum(["OPEN", "IN_PROGRESS", "DONE", "CANCELLED"]).optional(),
        type: z.enum(["PAPER", "RIGID", "OTHER"]).optional(), // Added
        steps: z
          .array(
            z.object({
              orderNo: z.number().int().positive(),
              up: z.number().int().min(0),
              machineId: z.number().int().positive().nullable().optional(),
              materials: z
                .array(
                  z.object({
                    materialId: z.number().int().positive(),
                    qtyReq: z.number().positive(),
                  }),
                )
                .optional(),
              startDate: z.coerce.date().optional(),
              partNumber: z.string().optional(), // Added to step input
              // Standard Params
              manPowerStd: z.number().int().optional(),
              cycleTimeStd: z.number().optional(),
              cavityStd: z.number().int().optional(),
            }),
          )
          .min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      return db.$transaction(async (tx) => {
        // 1. Fetch old PRO
        const oldPro = await tx.pro.findUnique({
          where: { id: input.id },
          select: {
            qtyPoPcs: true,
            startDate: true,
          },
        });

        if (!oldPro) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "PRO not found",
          });
        }

        // 2. Update header
        await tx.pro.update({
          where: { id: input.id },
          data: {
            processId: input.processId,
            productName: input.productName,
            ...(input.partNumber !== undefined
              ? { partNumber: input.partNumber }
              : {}), // Update if provided
            qtyPoPcs: input.qtyPoPcs,
            startDate: input.startDate,
            ...(input.status ? { status: input.status } : {}),
            ...(input.type ? { type: input.type } : {}), // Added
          },
        });

        // 3. Delete old steps
        await tx.proStep.deleteMany({ where: { proId: input.id } });

        // 4. Recreate steps (EXPANDED)
        let currentDay = startOfDay(
          input.startDate ?? oldPro.startDate ?? new Date(),
        );
        let currentShift = getShiftFromTime(
          input.startDate ?? oldPro.startDate ?? new Date(),
        );

        let globalOrderNo = 1;

        for (const inputStep of input.steps) {
          const std = 1000;
          const firstMatQty = inputStep.materials?.[0]?.qtyReq;
          const qty =
            firstMatQty !== undefined ? Number(firstMatQty) : input.qtyPoPcs;
          const up = firstMatQty !== undefined ? 1 : inputStep.up || 1;

          let machineStd = std;
          let isSheet = false;
          if (inputStep.machineId) {
            const m = await tx.machine.findUnique({
              where: { id: inputStep.machineId },
              select: { stdOutputPerShift: true, uom: true },
            });
            if (m?.stdOutputPerShift) machineStd = m.stdOutputPerShift;
            if (m?.uom === "sheet") isSheet = true;
          }

          const need =
            input.expand && isSheet
              ? Math.max(1, Math.ceil(qty / (up * machineStd)))
              : 1;

          if (inputStep.startDate) {
            currentDay = startOfDay(new Date(inputStep.startDate));
            currentShift = getShiftFromTime(new Date(inputStep.startDate));
          }

          const totalSheets = up > 0 ? qty / up : qty;

          for (let i = 0; i < need; i++) {
            const sheetsInThisShift = Math.max(
              0,
              Math.min(totalSheets - i * machineStd, machineStd),
            );
            const portion =
              totalSheets > 0 ? sheetsInThisShift / totalSheets : 1;

            if (sheetsInThisShift > 0 && inputStep.machineId) {
              await checkCapacity(
                tx,
                inputStep.machineId,
                getShiftDate(currentDay, currentShift),
                sheetsInThisShift,
              );
            }

            await tx.proStep.create({
              data: {
                proId: input.id,
                orderNo: globalOrderNo++,
                up: inputStep.up,
                machineId: inputStep.machineId ?? null,
                startDate: getShiftDate(currentDay, currentShift),
                partNumber: inputStep.partNumber, // Added
                manPowerStd: inputStep.manPowerStd, // Added
                cycleTimeStd: inputStep.cycleTimeStd
                  ? new Prisma.Decimal(inputStep.cycleTimeStd)
                  : undefined, // Added
                cavityStd: inputStep.cavityStd, // Added
                estimatedShifts: need,
                materials: {
                  create:
                    inputStep.materials?.map((m) => ({
                      materialId: m.materialId,
                      qtyReq: new Prisma.Decimal(m.qtyReq * portion),
                    })) ?? [],
                },
              },
            });

            if (input.expand) {
              if (currentShift < 2) currentShift++;
              else {
                currentShift = 0;
                currentDay.setDate(currentDay.getDate() + 1);
              }
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

  getSchedule: protectedProcedure
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
          ],
        },
        select: {
          id: true,
          proNumber: true,
          productName: true,
          qtyPoPcs: true,
          startDate: true,
          status: true,
          type: true,
          autoShiftExpansion: true, // Added flag
          process: { select: { name: true, code: true } }, // Added to header
          steps: {
            orderBy: { orderNo: "asc" },
            select: {
              id: true,
              orderNo: true,
              up: true,
              manPowerStd: true,
              cycleTimeStd: true,
              cavityStd: true,
              machine: {
                select: { id: true, name: true, stdOutputPerShift: true },
              },
              startDate: true, // add this
              partNumber: true, // Added
              estimatedShifts: true,
              materials: {
                select: {
                  material: { select: { name: true, uom: true } },
                  qtyReq: true,
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

// --- HELPER FUNCTION UNTUK CEK KAPASITAS ---
async function checkCapacity(
  tx: Prisma.TransactionClient,
  machineId: number | null,
  slotDate: Date,
  newLoadSheets: number,
) {
  if (!machineId) return;

  const machine = await tx.machine.findUnique({ where: { id: machineId } });
  if (!machine || machine.uom !== "sheet" || !machine.stdOutputPerShift) return;

  const max = machine.stdOutputPerShift;

  // Cari load existing di tanggal & shift (slotDate) yang sama
  const existingSteps = await tx.proStep.findMany({
    where: {
      machineId,
      startDate: slotDate,
      pro: { status: { notIn: ["DONE", "CANCELLED"] } },
    },
    include: {
      materials: { include: { material: true } },
    },
  });

  let currentLoad = 0;
  for (const s of existingSteps) {
    // Cari material sheet punya step ini
    const sheetMat = s.materials.find((m) => m.material.uom === "sheet");
    if (sheetMat) {
      currentLoad += Number(sheetMat.qtyReq);
    }
  }

  if (currentLoad + newLoadSheets > max) {
    const shiftName =
      getShiftFromTime(slotDate) === 0
        ? "Shift 1"
        : getShiftFromTime(slotDate) === 1
          ? "Shift 2"
          : "Shift 3";

    const dStr = slotDate.toLocaleDateString("id-ID");

    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Mesin ${machine.name} overload di ${dStr} ${shiftName}. Kapasitas: ${max}, Terisi: ${currentLoad}, Request: ${Math.ceil(newLoadSheets)}.`,
    });
  }
}
