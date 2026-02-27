import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Prisma, ProStatus } from "generated/prisma";
import {
  createTRPCRouter,
  ppicProcedure,
  protectedProcedure,
} from "../../trpc";

const pad3 = (n: number) => String(n).padStart(3, "0"); // 001..999
const mm = (d: Date) => String(d.getMonth() + 1).padStart(2, "0");
const yy = (d: Date) => String(d.getFullYear()).slice(-2);

/** Resolve partNumber string to Item.id (nullable, no throw) */
async function lookupItemId(
  tx: any,
  partNumber: string | null | undefined,
): Promise<number | null> {
  if (!partNumber?.trim()) return null;
  const normalized = partNumber.trim().replace(/\s+/g, "_").toUpperCase();
  const item = await tx.item.findFirst({
    where: { OR: [{ code: normalized }, { code: partNumber }] },
    select: { id: true },
  });
  return item?.id ?? null;
}

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
        status: z
          .enum(["OPEN", "IN_PROGRESS", "COMPLETE", "CLOSED", "CANCELLED"])
          .optional(),
        type: z.enum(["PAPER", "RIGID", "OTHER"]).optional(),
        take: z.number().min(5).max(50).default(20),
        cursor: z.number().int().positive().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const take = input.take ?? 20;
      const q = input.q?.trim();

      const where: any = {};
      if (input.status) where.status = input.status;
      if (input.type) where.type = input.type;

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
          partNumber: true, // FG Part Number
          qtyPoPcs: true,
          startDate: true,
          status: true,
          type: true,
          autoShiftExpansion: true,
          createdAt: true,
          proPrefix: { select: { code: true, name: true } }, // Renamed from Kode_Proses
          proses: {
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
                  uom: true,
                },
              },
              startDate: true,
              partNumber: true, // Step Output Part Number
              estimatedShifts: true,
              materials: {
                select: {
                  qtyReq: true,
                  material: { select: { name: true, uom: true } },
                },
              },
              productionReports: {
                select: {
                  status: true,
                  qtyPassOn: true,
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
        partNumber: z.string().optional(), // Header Part Number (FG)
        proPrefixId: z.number().int().positive(), // Renamed from kode_ProsesId
        type: z.enum(["PAPER", "RIGID", "OTHER"]).default("PAPER"),
        qtyPoPcs: z.number().int().positive(),
        proNumber: z.string().optional(), // Manual PRO override
        startDate: z.coerce.date().optional(),
        expand: z.boolean().default(true).optional(),
        autoShiftExpansion: z.boolean().default(false).optional(),
        proses: z
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
              partNumber: z.string().optional(),
              batchNo: z.string().optional(),
            }),
          )
          .min(1),
      }),
    )

    .mutation(async ({ ctx, input }) => {
      const baseDate = input.startDate ?? new Date();

      const steps = input.proses;

      if (!steps.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Steps minimal 1",
        });
      }

      // Enforce 1 step for RIGID
      if (input.type === "RIGID" && steps.length > 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "RIGID PRO hanya boleh memiliki 1 step proses.",
        });
      }

      // Fetch Prefix using ProPrefix table
      const prefixData = await ctx.db.proPrefix.findUnique({
        where: { id: input.proPrefixId },
        select: { code: true },
      });
      if (!prefixData)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Prefix/Kategori PRO tidak valid",
        });

      // Generate sequence using ProSequence (maintained logic)
      const prefix = `${prefixData.code}${mm(baseDate)}${yy(baseDate)}`; // 6 digit

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
        const firstStepDate = input.proses[0]?.startDate ?? undefined;

        const created = await tx.pro.create({
          data: {
            proNumber,
            proPrefixId: input.proPrefixId, // Renamed
            productName: input.productName,
            partNumber: input.partNumber, // Legacy snapshot
            fgItemId: await lookupItemId(tx, input.partNumber),
            qtyPoPcs: input.qtyPoPcs,
            startDate: firstStepDate,
            status: "OPEN",
            type: input.type,
            autoShiftExpansion: input.autoShiftExpansion ?? false,
          },
        });

        // -------------------------------------------------------------
        // AUTOMATIC EXPANSION logic (Unchanged mostly)

        let proStartDate = input.startDate ?? new Date();
        let currentDay = startOfDay(proStartDate);
        let currentShift = getShiftFromTime(proStartDate);

        let globalOrderNo = 1;

        for (const inputStep of input.proses) {
          const std = 1000;
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

            await tx.proses.create({
              data: {
                proId: created.id,
                orderNo: globalOrderNo++,
                up: inputStep.up,
                machineId: inputStep.machineId ?? null,
                startDate: getShiftDate(currentDay, currentShift),
                partNumber: inputStep.partNumber,
                batchNo: inputStep.batchNo,
                outputItemId: await lookupItemId(tx, inputStep.partNumber),
                materials: {
                  create: (inputStep.materials ?? []).map((m) => ({
                    materialId: m.materialId,
                    qtyReq: new Prisma.Decimal(m.qtyReq * portion),
                  })),
                },
                estimatedShifts: need,
              },
            });

            if (input.expand !== false) {
              if (currentShift < 2) currentShift++;
              else {
                currentShift = 0;
                currentDay.setDate(currentDay.getDate() + 1);
              }
            }
          }
        }
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
          partNumber: true, // Added
          qtyPoPcs: true,
          startDate: true,
          status: true,
          type: true,
          createdAt: true,
          updatedAt: true,
          autoShiftExpansion: true,
          proPrefixId: true, // Renamed
          proPrefix: { select: { code: true, name: true } }, // Renamed
          proses: {
            orderBy: { orderNo: "asc" },
            select: {
              id: true,
              orderNo: true,
              up: true,
              machineId: true,
              startDate: true,
              partNumber: true,
              batchNo: true,
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
              productionReports: {
                select: {
                  status: true,
                  qtyPassOn: true,
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
        partNumber: z.string().optional(), // Header Part Number
        proPrefixId: z.number().int().positive(), // Renamed
        qtyPoPcs: z.number().int().positive(),
        startDate: z.coerce.date().optional(),
        status: z
          .enum(["OPEN", "IN_PROGRESS", "COMPLETE", "CLOSED", "CANCELLED"])
          .optional(),
        type: z.enum(["PAPER", "RIGID", "OTHER"]).optional(),
        proses: z
          .array(
            z.object({
              id: z.number().optional(),
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
              partNumber: z.string().optional(),
              batchNo: z.string().optional(),
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
            proNumber: true,
            proPrefixId: true, // Renamed
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

        // Calculate new PRO Number if prefix changed
        let newProNumber: string | undefined;
        if (input.proPrefixId !== oldPro.proPrefixId) {
          const newPrefix = await tx.proPrefix.findUnique({
            where: { id: input.proPrefixId },
            select: { code: true },
          });

          if (newPrefix && oldPro.proNumber.length >= 2) {
            newProNumber = newPrefix.code + oldPro.proNumber.slice(2);

            // Check conflict
            const conflict = await tx.pro.findUnique({
              where: { proNumber: newProNumber },
            });
            if (conflict) {
              throw new TRPCError({
                code: "CONFLICT",
                message: `Nomor PRO baru '${newProNumber}' sudah digunakan oleh PRO lain. Tidak bisa mengganti proses/prefix.`,
              });
            }
          }
        }

        // 2. Update header
        await tx.pro.update({
          where: { id: input.id },
          data: {
            ...(newProNumber ? { proNumber: newProNumber } : {}),
            proPrefixId: input.proPrefixId, // Renamed
            productName: input.productName,
            ...(input.partNumber !== undefined
              ? {
                  partNumber: input.partNumber,
                  fgItemId: await lookupItemId(tx, input.partNumber),
                }
              : {}),
            qtyPoPcs: input.qtyPoPcs,
            startDate: input.startDate,
            ...(input.status ? { status: input.status } : {}),
            ...(input.type ? { type: input.type } : {}),
          },
        });

        // 3. Diff Steps (Update, Create, Delete)
        const existingProses = await tx.proses.findMany({
          where: { proId: input.id },
          select: { id: true },
        });

        const inputIds = new Set(
          input.proses.map((s) => s.id).filter((id): id is number => !!id),
        );
        const existingIds = new Set(existingProses.map((s) => s.id));

        const toDelete = existingProses.filter((s) => !inputIds.has(s.id));
        for (const step of toDelete) {
          // Check for approved reports
          const hasApprovedReports = await tx.productionReport.findFirst({
            where: { prosesId: step.id, status: "APPROVED" },
          });

          if (hasApprovedReports) {
            throw new TRPCError({
              code: "PRECONDITION_FAILED",
              message: `Step ID ${step.id} memiliki laporan APPROVED. Tidak bisa dihapus.`,
            });
          }

          try {
            await tx.proses.delete({ where: { id: step.id } });
          } catch (e: any) {
            if (e.code === "P2003") {
              throw new TRPCError({
                code: "PRECONDITION_FAILED",
                message: `Tidak dapat menghapus step (ID: ${step.id}) karena sudah memiliki histori laporan produksi.`,
              });
            }
            throw e;
          }
        }

        // UPSERT
        let baseDate = input.startDate ?? oldPro.startDate ?? new Date();
        let currentDay = startOfDay(baseDate);
        let currentShift = getShiftFromTime(baseDate);

        let globalOrderNo = 1;

        for (const s of input.proses) {
          const matMaterials = s.materials ?? [];

          if (s.startDate) {
            currentDay = startOfDay(new Date(s.startDate));
            currentShift = getShiftFromTime(new Date(s.startDate));
          }

          const stepDate = getShiftDate(currentDay, currentShift);
          const needs = 1;

          const recreateMaterials = async (prosesId: number) => {
            await tx.prosesMaterial.deleteMany({ where: { prosesId } });
            if (matMaterials.length > 0) {
              await tx.prosesMaterial.createMany({
                data: matMaterials.map((m) => ({
                  prosesId,
                  materialId: m.materialId,
                  qtyReq: new Prisma.Decimal(m.qtyReq),
                })),
              });
            }
          };

          if (s.id && existingIds.has(s.id)) {
            await tx.proses.update({
              where: { id: s.id },
              data: {
                orderNo: globalOrderNo++,
                up: s.up,
                machineId: s.machineId ?? null,
                partNumber: s.partNumber,
                batchNo: s.batchNo,
                outputItemId: await lookupItemId(tx, s.partNumber),
                startDate: stepDate,
                estimatedShifts: needs,
              },
            });
            await recreateMaterials(s.id);
          } else {
            await tx.proses.create({
              data: {
                proId: input.id,
                orderNo: globalOrderNo++,
                up: s.up,
                machineId: s.machineId ?? null,
                startDate: stepDate,
                partNumber: s.partNumber,
                batchNo: s.batchNo,
                outputItemId: await lookupItemId(tx, s.partNumber),
                estimatedShifts: needs,
                materials: {
                  create: matMaterials.map((m) => ({
                    materialId: m.materialId,
                    qtyReq: new Prisma.Decimal(m.qtyReq),
                  })),
                },
              },
            });
          }

          if (currentShift < 2) {
            currentShift++;
          } else {
            currentShift = 0;
            currentDay.setDate(currentDay.getDate() + 1);
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
      // 1. Check PRO exists and get related data
      const pro = await ctx.db.pro.findUnique({
        where: { id: input.id },
        include: {
          proses: {
            include: {
              productionReports: { select: { id: true, status: true } },
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

      // 2. Block delete if any APPROVED reports exist (data integrity)
      const allReports = pro.proses.flatMap((p) => p.productionReports);
      const hasApproved = allReports.some((r) => r.status === "APPROVED");
      if (hasApproved) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message:
            "Tidak bisa menghapus PRO yang sudah memiliki laporan APPROVED. Void laporan terlebih dahulu.",
        });
      }

      // 3. Cascade delete in correct order within transaction
      await ctx.db.$transaction(async (tx) => {
        const prosesIds = pro.proses.map((p) => p.id);
        const reportIds = allReports.map((r) => r.id);

        // Delete InventoryTxn linked to this PRO or its reports
        if (reportIds.length > 0) {
          await tx.inventoryTxn.deleteMany({
            where: {
              OR: [
                { proId: input.id },
                { prosesId: { in: prosesIds } },
                { productionReportId: { in: reportIds } },
              ],
            },
          });
        } else {
          await tx.inventoryTxn.deleteMany({
            where: {
              OR: [{ proId: input.id }, { prosesId: { in: prosesIds } }],
            },
          });
        }

        // Delete ProductionReports (PENDING/REJECTED only, APPROVED blocked above)
        if (reportIds.length > 0) {
          await tx.productionReport.deleteMany({
            where: { id: { in: reportIds } },
          });
        }

        // Delete PRO (Proses + ProsesMaterial cascade automatically)
        await tx.pro.delete({ where: { id: input.id } });
      });

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

  rescheduleProses: ppicProcedure
    .input(z.object({ prosesId: z.number(), startDate: z.coerce.date() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.proses.update({
        where: { id: input.prosesId },
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
          status: { not: ProStatus.CANCELLED },
          OR: [
            {
              startDate: {
                gte: input.start,
                lte: input.end,
              },
            },
            {
              proses: {
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
          partNumber: true, // Added
          qtyPoPcs: true,
          startDate: true,
          status: true,
          type: true,
          autoShiftExpansion: true,
          proPrefix: { select: { name: true, code: true } }, // Renamed
          proses: {
            orderBy: { orderNo: "asc" },
            select: {
              id: true,
              orderNo: true,
              up: true,
              machineId: true,
              machine: {
                select: {
                  id: true,
                  name: true,
                  stdOutputPerShift: true,
                  stdOutputPerHour: true,
                  cycleTimeSec: true,
                },
              },
              startDate: true,
              partNumber: true,
              batchNo: true,
              estimatedShifts: true,
              materials: {
                select: {
                  material: { select: { name: true, uom: true } },
                  qtyReq: true,
                },
              },
              productionReports: {
                select: {
                  status: true,
                  qtyPassOn: true,
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

  const existingSteps = await tx.proses.findMany({
    where: {
      machineId,
      pro: { status: { notIn: [ProStatus.CLOSED, ProStatus.CANCELLED] } },
    },
    include: {
      materials: { include: { material: true } },
    },
  });

  let currentLoad = 0;
  for (const s of existingSteps) {
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
