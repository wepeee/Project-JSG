import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Prisma, Role, ProStatus } from "../../../../../generated/prisma";
import {
  createTRPCRouter,
  ppicProcedure,
  protectedProcedure,
} from "../../trpc";
import { inferItemKindFromPnCode } from "~/utils/normalize";
import { calculateProStepShiftAndTarget } from "~/lib/pro-calculation";

const pad3 = (n: number) => String(n).padStart(3, "0"); // 001..999
const mm = (d: Date) => String(d.getMonth() + 1).padStart(2, "0");
const yy = (d: Date) => String(d.getFullYear()).slice(-2);
const normalizeItemCode = (value: string) =>
  value.trim().toUpperCase().replace(/\s+/g, "_");
const PRO_TX_TIMEOUT_MS = 30000;
const PRO_TX_MAX_WAIT_MS = 10000;

type ItemLookupTx = Pick<Prisma.TransactionClient, "item">;

/** Resolve partNumber string to Item.id (auto-registers missing items as DRAFT) */
const createItemIdResolver = (tx: ItemLookupTx, userId?: string) => {
  const cache = new Map<string, number>();

  return async (
    partNumber?: string | null,
    defaultKind: "FG" | "WIP" = "FG",
    fallbackName?: string,
  ) => {
    if (!partNumber?.trim()) return null;
    const raw = partNumber.trim();
    const code = normalizeItemCode(raw);
    const cached = cache.get(code);
    if (cached) return cached;

    const item = await tx.item.findUnique({
      where: { code },
      select: { id: true },
    });
    if (item) {
      cache.set(code, item.id);
      return item.id;
    }

    // Auto-register unregistered Part Numbers
    const inferredKind = inferItemKindFromPnCode(code);
    const finalKind = inferredKind ?? defaultKind;
    const newItem = await tx.item.create({
      data: {
        code,
        name: fallbackName?.trim() || raw,
        kind: finalKind,
        status: "DRAFT",
        createdFrom: "PRO_AUTO",
        ...(userId ? { createdById: userId } : {}),
      },
      select: { id: true },
    });
    cache.set(code, newItem.id);
    return newItem.id;
  };
};

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
              startDate: true,
            },
          },
        },
      });

      let nextCursor: number | undefined = undefined;
      if (items.length > take) {
        const next = items.pop()!;
        nextCursor = next.id;
      }

      const lastStepIds = items
        .map((pro) => pro.proses[pro.proses.length - 1]?.id)
        .filter((id): id is number => !!id);

      const reportGroups =
        lastStepIds.length > 0
          ? await ctx.db.productionReport.groupBy({
              by: ["prosesId"],
              where: {
                prosesId: { in: lastStepIds },
                status: "APPROVED",
              },
              _sum: { qtyPassOn: true },
            })
          : [];

      const outputByProsesId = new Map<number, number>();
      for (const g of reportGroups) {
        outputByProsesId.set(g.prosesId, Number(g._sum.qtyPassOn ?? 0));
      }

      const enrichedItems = items.map((pro) => {
        const lastStepId = pro.proses[pro.proses.length - 1]?.id;
        return {
          ...pro,
          currentOutput: lastStepId
            ? (outputByProsesId.get(lastStepId) ?? 0)
            : 0,
        };
      });

      return { items: enrichedItems, nextCursor };
    }),

  targetGapList: protectedProcedure
    .input(
      z
        .object({
          q: z.string().optional(),
          status: z
            .enum(["OPEN", "IN_PROGRESS", "COMPLETE", "CLOSED", "CANCELLED"])
            .optional(),
          type: z.enum(["PAPER", "RIGID", "OTHER"]).optional(),
          onlyOpen: z.boolean().optional().default(true),
          take: z.number().min(10).max(500).default(200),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const role = ctx.session.user.role;
      if (
        role !== Role.MASTER &&
        role !== Role.PPIC &&
        role !== Role.SUPERADMIN
      ) {
        throw new TRPCError({ code: "FORBIDDEN", message: "MASTER only" });
      }

      const q = input?.q?.trim();
      const where: Prisma.ProWhereInput = {};

      if (input?.status) {
        where.status = input.status;
      } else if (input?.onlyOpen ?? true) {
        where.status = {
          notIn: [ProStatus.CLOSED, ProStatus.CANCELLED],
        };
      }
      if (input?.type) where.type = input.type;
      if (q) {
        where.OR = [
          { proNumber: { contains: q } },
          { productName: { contains: q } },
          { partNumber: { contains: q } },
        ];
      }

      const pros = await ctx.db.pro.findMany({
        where,
        take: input?.take ?? 200,
        orderBy: [{ startDate: "asc" }, { id: "desc" }],
        select: {
          id: true,
          proNumber: true,
          productName: true,
          partNumber: true,
          qtyPoPcs: true,
          startDate: true,
          status: true,
          type: true,
          createdAt: true,
          proPrefix: { select: { code: true, name: true } },
          proses: {
            orderBy: { orderNo: "asc" },
            select: { id: true, orderNo: true, startDate: true },
          },
        },
      });

      const lastStepIds = pros
        .map((pro) => pro.proses[pro.proses.length - 1]?.id)
        .filter((id): id is number => !!id);

      const reportGroups =
        lastStepIds.length > 0
          ? await ctx.db.productionReport.groupBy({
              by: ["prosesId"],
              where: {
                prosesId: { in: lastStepIds },
                status: "APPROVED",
              },
              _sum: { qtyPassOn: true },
            })
          : [];

      const outputByProsesId = new Map<number, number>();
      for (const g of reportGroups) {
        outputByProsesId.set(g.prosesId, Number(g._sum.qtyPassOn ?? 0));
      }

      const rows = pros.map((pro) => {
        const lastStep = pro.proses[pro.proses.length - 1];
        const output = lastStep?.id
          ? (outputByProsesId.get(lastStep.id) ?? 0)
          : 0;
        const target = Number(pro.qtyPoPcs ?? 0);
        const gap = Math.max(target - output, 0);
        const progressPct =
          target > 0 ? Math.min((output / target) * 100, 100) : 0;
        return {
          ...pro,
          currentOutput: output,
          qtyGap: gap,
          progressPct,
          stepCount: pro.proses.length,
          lastStepStartDate: lastStep?.startDate ?? null,
        };
      });

      rows.sort((a, b) => {
        if (b.qtyGap !== a.qtyGap) return b.qtyGap - a.qtyGap;
        const tA = new Date(a.startDate ?? a.createdAt).getTime();
        const tB = new Date(b.startDate ?? b.createdAt).getTime();
        return tA - tB;
      });

      return rows;
    }),

  dashboardSummary: ppicProcedure
    .input(
      z.object({
        start: z.coerce.date(),
        end: z.coerce.date(),
        type: z.enum(["PAPER", "RIGID", "OTHER"]).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where: Prisma.ProWhereInput = {
        OR: [
          { startDate: { gte: input.start, lte: input.end } },
          {
            AND: [
              { startDate: null },
              { createdAt: { gte: input.start, lte: input.end } },
            ],
          },
        ],
      };

      if (input.type) where.type = input.type;

      const grouped = await ctx.db.pro.groupBy({
        by: ["status"],
        where,
        _count: { _all: true },
        _sum: { qtyPoPcs: true },
      });

      const statusOrder: Array<ProStatus> = [
        ProStatus.OPEN,
        ProStatus.IN_PROGRESS,
        ProStatus.COMPLETE,
        ProStatus.CLOSED,
        ProStatus.CANCELLED,
      ];

      const byStatus = statusOrder.map((status) => {
        const found = grouped.find((g) => g.status === status);
        return {
          status,
          totalPro: found?._count._all ?? 0,
          totalQtyPo: Number(found?._sum.qtyPoPcs ?? 0),
        };
      });

      const totalPro = byStatus.reduce((acc, item) => acc + item.totalPro, 0);
      const totalQtyPo = byStatus.reduce(
        (acc, item) => acc + item.totalQtyPo,
        0,
      );
      const doneQtyPo = byStatus
        .filter(
          (item) =>
            item.status === ProStatus.COMPLETE ||
            item.status === ProStatus.CLOSED,
        )
        .reduce((acc, item) => acc + item.totalQtyPo, 0);
      const activeQtyPo = byStatus
        .filter(
          (item) =>
            item.status === ProStatus.OPEN ||
            item.status === ProStatus.IN_PROGRESS,
        )
        .reduce((acc, item) => acc + item.totalQtyPo, 0);
      const cancelledQtyPo = byStatus
        .filter((item) => item.status === ProStatus.CANCELLED)
        .reduce((acc, item) => acc + item.totalQtyPo, 0);

      const donePct = totalQtyPo > 0 ? (doneQtyPo / totalQtyPo) * 100 : 0;

      return {
        range: {
          start: input.start,
          end: input.end,
        },
        totalPro,
        totalQtyPo,
        doneQtyPo,
        activeQtyPo,
        cancelledQtyPo,
        donePct,
        byStatus,
      };
    }),

  dashboardQuantityByPro: ppicProcedure
    .input(
      z.object({
        start: z.coerce.date(),
        end: z.coerce.date(),
        type: z.enum(["PAPER", "RIGID", "OTHER"]).optional(),
        take: z.number().min(10).max(500).default(200),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where: Prisma.ProWhereInput = {
        OR: [
          { startDate: { gte: input.start, lte: input.end } },
          {
            AND: [
              { startDate: null },
              { createdAt: { gte: input.start, lte: input.end } },
            ],
          },
        ],
      };

      if (input.type) where.type = input.type;

      const pros = await ctx.db.pro.findMany({
        where,
        take: input.take,
        orderBy: [{ startDate: "asc" }, { id: "desc" }],
        select: {
          id: true,
          proNumber: true,
          productName: true,
          qtyPoPcs: true,
          status: true,
          type: true,
          startDate: true,
          createdAt: true,
          proses: {
            orderBy: { orderNo: "asc" },
            select: { id: true },
          },
        },
      });

      const lastStepIds = pros
        .map((pro) => pro.proses[pro.proses.length - 1]?.id)
        .filter((id): id is number => !!id);

      const reportGroups =
        lastStepIds.length > 0
          ? await ctx.db.productionReport.groupBy({
              by: ["prosesId"],
              where: {
                prosesId: { in: lastStepIds },
                status: "APPROVED",
              },
              _sum: { qtyPassOn: true },
            })
          : [];

      const outputByProsesId = new Map<number, number>();
      for (const g of reportGroups) {
        outputByProsesId.set(g.prosesId, Number(g._sum.qtyPassOn ?? 0));
      }

      return pros.map((pro) => {
        const lastStepId = pro.proses[pro.proses.length - 1]?.id;
        const targetQty = Number(pro.qtyPoPcs ?? 0);
        const outputQty = lastStepId
          ? (outputByProsesId.get(lastStepId) ?? 0)
          : 0;
        const gapQty = Math.max(targetQty - outputQty, 0);
        const progressPct =
          targetQty > 0 ? Math.min((outputQty / targetQty) * 100, 100) : 0;

        return {
          id: pro.id,
          proNumber: pro.proNumber,
          productName: pro.productName,
          status: pro.status,
          type: pro.type,
          startDate: pro.startDate,
          createdAt: pro.createdAt,
          targetQty,
          outputQty,
          gapQty,
          progressPct,
        };
      });
    }),

  getStepTemplateByPartNumber: ppicProcedure
    .input(
      z.object({
        partNumber: z.string().min(1),
        type: z.enum(["PAPER", "RIGID", "OTHER"]).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const normalizedCode = normalizeItemCode(input.partNumber);
      if (!normalizedCode) {
        return {
          normalizedCode: "",
          itemFound: false,
          template: null,
        };
      }

      const item = await ctx.db.item.findUnique({
        where: { code: normalizedCode },
        select: { id: true, code: true },
      });

      if (!item) {
        return {
          normalizedCode,
          itemFound: false,
          template: null,
        };
      }

      const where: Prisma.ProsesWhereInput = {
        OR: [
          { outputItemId: item.id },
          {
            partNumber: {
              equals: normalizedCode,
              mode: "insensitive",
            },
          },
        ],
        ...(input.type ? { pro: { type: input.type } } : {}),
      };

      const latestStep = await ctx.db.proses.findFirst({
        where,
        orderBy: { id: "desc" },
        select: {
          id: true,
          up: true,
          machineId: true,
          materials: {
            orderBy: { id: "asc" },
            select: {
              itemMasterId: true,
              qtyReq: true,
            },
          },
        },
      });

      if (!latestStep) {
        return {
          normalizedCode: item.code,
          itemFound: true,
          template: null,
        };
      }

      return {
        normalizedCode: item.code,
        itemFound: true,
        template: {
          stepId: latestStep.id,
          up: latestStep.up,
          machineId: latestStep.machineId,
          materials: latestStep.materials.map((m) => ({
            materialId: m.itemMasterId,
            qtyReq: Number(m.qtyReq),
          })),
        },
      };
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

      return ctx.db.$transaction(
        async (tx) => {
          const resolveItemId = createItemIdResolver(tx, ctx.session?.user?.id);
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

          const fgItemId = await resolveItemId(
            input.partNumber,
            "FG",
            input.productName,
          );

          const machineIds = Array.from(
            new Set(
              input.proses
                .map((s) => s.machineId)
                .filter((id): id is number => !!id),
            ),
          );
          const machineRows =
            machineIds.length > 0
              ? await tx.machine.findMany({
                  where: { id: { in: machineIds } },
                  select: {
                    id: true,
                    name: true,
                    stdOutputPerShift: true,
                    uom: true,
                  },
                })
              : [];
          const machineById = new Map(machineRows.map((m) => [m.id, m]));

          const created = await tx.pro.create({
            data: {
              proNumber,
              proPrefix: { connect: { id: input.proPrefixId } },
              productName: input.productName,
              partNumber: input.partNumber, // Legacy snapshot
              ...(fgItemId ? { fgItem: { connect: { id: fgItemId } } } : {}),
              qtyPoPcs: input.qtyPoPcs,
              startDate: firstStepDate,
              status: "OPEN",
              type: input.type,
              autoShiftExpansion: input.autoShiftExpansion ?? false,
              createdBy: { connect: { id: ctx.session.user.id } },
              updatedBy: { connect: { id: ctx.session.user.id } },
            },
          });

          // -------------------------------------------------------------
          // AUTOMATIC EXPANSION logic (Unchanged mostly)

          let proStartDate = input.startDate ?? new Date();
          let currentDay = startOfDay(proStartDate);
          let currentShift = getShiftFromTime(proStartDate);

          let globalOrderNo = 1;

          for (const inputStep of input.proses) {
            let machineName = "";
            const machineMeta = inputStep.machineId
              ? machineById.get(inputStep.machineId)
              : undefined;
            if (machineMeta?.name) machineName = machineMeta.name;

            const calc = calculateProStepShiftAndTarget({
              machineUom: machineMeta?.uom,
              machineStdOutputPerShift: machineMeta?.stdOutputPerShift,
              upCav: inputStep.up ?? null,
              qtyPoPcs: input.qtyPoPcs,
            });

            const need = input.expand === false ? 1 : calc.shiftCount;

            if (inputStep.startDate) {
              currentDay = startOfDay(new Date(inputStep.startDate));
              currentShift = getShiftFromTime(new Date(inputStep.startDate));
            }

            const shiftSheets =
              need === calc.shiftCount
                ? calc.shiftSheetLoads
                : [calc.totalPlannedSheets];
            const totalPlannedSheets = shiftSheets.reduce(
              (acc, val) => acc + val,
              0,
            );
            const totalTargetPcs = calc.plannedQtyPcsTotal;
            const shiftTargetPcs = distributeIntegerByWeights(
              totalTargetPcs,
              shiftSheets.map((s) =>
                totalPlannedSheets > 0 ? s / totalPlannedSheets : 1,
              ),
            );

            for (let i = 0; i < need; i++) {
              const sheetsInThisShift = shiftSheets[i] ?? 0;
              const portion =
                totalPlannedSheets > 0
                  ? sheetsInThisShift / totalPlannedSheets
                  : need > 0
                    ? 1 / need
                    : 1;

              if (sheetsInThisShift > 0 && inputStep.machineId) {
                await checkCapacity(
                  tx,
                  inputStep.machineId,
                  getShiftDate(currentDay, currentShift),
                  sheetsInThisShift,
                  machineById,
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
                  outputItemId: await resolveItemId(
                    inputStep.partNumber,
                    "WIP",
                    `${machineName} ${input.productName}`.trim(),
                  ),
                  materials: {
                    create: (inputStep.materials ?? []).map((m) => ({
                      itemMasterId: m.materialId,
                      qtyReq: new Prisma.Decimal(m.qtyReq * portion),
                    })),
                  },
                  estimatedShifts: calc.shiftCount,
                  plannedQtyPcs: shiftTargetPcs[i] ?? 0,
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
        },
        { timeout: PRO_TX_TIMEOUT_MS, maxWait: PRO_TX_MAX_WAIT_MS },
      );
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
                  itemMasterId: true,
                  qtyReq: true,
                  itemMaster: {
                    select: { id: true, name: true, baseUom: true, code: true },
                  },
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
      return db.$transaction(
        async (tx) => {
          const resolveItemId = createItemIdResolver(tx, ctx.session.user.id);
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

          const nextFgItemId =
            input.partNumber !== undefined
              ? await resolveItemId(input.partNumber, "FG")
              : undefined;

          // 2. Update header
          await tx.pro.update({
            where: { id: input.id },
            data: {
              ...(newProNumber ? { proNumber: newProNumber } : {}),
              proPrefix: { connect: { id: input.proPrefixId } },
              productName: input.productName,
              ...(input.partNumber !== undefined
                ? {
                    partNumber: input.partNumber,
                    fgItem: nextFgItemId
                      ? { connect: { id: nextFgItemId } }
                      : { disconnect: true },
                  }
                : {}),
              qtyPoPcs: input.qtyPoPcs,
              startDate: input.startDate,
              ...(input.status ? { status: input.status } : {}),
              ...(input.type ? { type: input.type } : {}),
              updatedBy: { connect: { id: ctx.session.user.id } },
            },
          });

          // 3. Diff Steps (Update, Create, Delete)
          const existingProses = await tx.proses.findMany({
            where: { proId: input.id },
            select: { id: true },
          });

          const existingStepIds = input.proses
            .map((s) => s.id)
            .filter((id): id is number => !!id);
          const lockedRows =
            existingStepIds.length > 0
              ? await tx.inventoryTxn.findMany({
                  where: { prosesId: { in: existingStepIds } },
                  select: { prosesId: true },
                  distinct: ["prosesId"],
                })
              : [];
          const lockedProsesIds = new Set(
            lockedRows
              .map((row) => row.prosesId)
              .filter((id): id is number => id !== null),
          );

          const machineIds = Array.from(
            new Set(
              input.proses
                .map((s) => s.machineId)
                .filter((id): id is number => !!id),
            ),
          );
          const machineRows =
            machineIds.length > 0
              ? await tx.machine.findMany({
                  where: { id: { in: machineIds } },
                  select: {
                    id: true,
                    name: true,
                    uom: true,
                    stdOutputPerShift: true,
                  },
                })
              : [];
          const machineNameById = new Map(
            machineRows.map((m) => [m.id, m.name]),
          );
          const machineById = new Map(machineRows.map((m) => [m.id, m]));

          const inputIds = new Set(
            input.proses.map((s) => s.id).filter((id): id is number => !!id),
          );
          const existingIds = new Set(existingProses.map((s) => s.id));

          const toDelete = existingProses.filter((s) => !inputIds.has(s.id));
          const toDeleteIds = toDelete.map((s) => s.id);
          if (toDeleteIds.length > 0) {
            const hasApprovedReports = await tx.productionReport.findFirst({
              where: {
                prosesId: { in: toDeleteIds },
                status: "APPROVED",
              },
              select: { prosesId: true },
            });

            if (hasApprovedReports?.prosesId) {
              throw new TRPCError({
                code: "PRECONDITION_FAILED",
                message: `Step ID ${hasApprovedReports.prosesId} memiliki laporan APPROVED. Tidak bisa dihapus.`,
              });
            }
          }

          for (const step of toDelete) {
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
            const machineMeta = s.machineId
              ? machineById.get(s.machineId)
              : undefined;
            const calc = calculateProStepShiftAndTarget({
              machineUom: machineMeta?.uom,
              machineStdOutputPerShift: machineMeta?.stdOutputPerShift,
              upCav: s.up ?? null,
              qtyPoPcs: input.qtyPoPcs,
            });
            const stepPlannedQtyPcs = calc.plannedQtyPcsTotal;

            if (s.startDate) {
              currentDay = startOfDay(new Date(s.startDate));
              currentShift = getShiftFromTime(new Date(s.startDate));
            }

            const stepDate = getShiftDate(currentDay, currentShift);
            const needs = calc.shiftCount;

            const recreateMaterials = async (prosesId: number) => {
              // MATERIAL LOCK GUARD: reject material changes if inventory txns exist
              if (lockedProsesIds.has(prosesId)) {
                throw new TRPCError({
                  code: "PRECONDITION_FAILED",
                  message: `Tidak bisa mengubah material proses (ID: ${prosesId}) karena sudah ada transaksi inventory.`,
                });
              }

              await tx.prosesMaterial.deleteMany({ where: { prosesId } });
              if (matMaterials.length > 0) {
                await tx.prosesMaterial.createMany({
                  data: matMaterials.map((m) => ({
                    prosesId,
                    itemMasterId: m.materialId,
                    qtyReq: new Prisma.Decimal(m.qtyReq),
                  })),
                });
              }
            };

            // Resolve machine name for item fallback
            const stepMachineName = s.machineId
              ? (machineNameById.get(s.machineId) ?? "")
              : "";

            if (s.id && existingIds.has(s.id)) {
              await tx.proses.update({
                where: { id: s.id },
                data: {
                  orderNo: globalOrderNo++,
                  up: s.up,
                  machineId: s.machineId ?? null,
                  partNumber: s.partNumber,
                  batchNo: s.batchNo,
                  outputItemId: await resolveItemId(
                    s.partNumber,
                    "WIP",
                    `${stepMachineName} ${input.productName}`.trim(),
                  ),
                  startDate: stepDate,
                  estimatedShifts: needs,
                  plannedQtyPcs: stepPlannedQtyPcs,
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
                  outputItemId: await resolveItemId(
                    s.partNumber,
                    "WIP",
                    `${stepMachineName} ${input.productName}`.trim(),
                  ),
                  estimatedShifts: needs,
                  plannedQtyPcs: stepPlannedQtyPcs,
                  materials: {
                    create: matMaterials.map((m) => ({
                      itemMasterId: m.materialId,
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
        },
        { timeout: PRO_TX_TIMEOUT_MS, maxWait: PRO_TX_MAX_WAIT_MS },
      );
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
        data: {
          startDate: input.startDate,
          updatedBy: { connect: { id: ctx.session.user.id } },
        },
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
        machineIds: z.array(z.number().int()).optional(), // filter per operator
      }),
    )
    .query(async ({ ctx, input }) => {
      const machineFilter = input.machineIds?.length
        ? { machineId: { in: input.machineIds } }
        : {};

      const items = await ctx.db.pro.findMany({
        where: {
          status: { not: ProStatus.CANCELLED },
          proses: {
            some: {
              startDate: { gte: input.start, lte: input.end },
              ...machineFilter,
            },
          },
        },
        select: {
          id: true,
          proNumber: true,
          productName: true,
          partNumber: true,
          qtyPoPcs: true,
          startDate: true,
          status: true,
          type: true,
          autoShiftExpansion: true,
          proPrefix: { select: { name: true, code: true } },
          proses: {
            where: {
              startDate: { gte: input.start, lte: input.end },
              ...machineFilter,
            },
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
                  uom: true,
                },
              },
              startDate: true,
              partNumber: true,
              batchNo: true,
              estimatedShifts: true,
              plannedQtyPcs: true,
              materials: {
                select: {
                  itemMasterId: true,
                  itemMaster: {
                    select: { id: true, name: true, baseUom: true },
                  },
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
      // Hapus PRO yang tidak punya proses setelah filter (edge case)
      return items.filter((p) => p.proses.length > 0);
    }),
});

function distributeIntegerByWeights(
  total: number,
  weights: number[],
): number[] {
  const count = weights.length;
  if (count === 0) return [];

  const safeTotal = Math.max(0, Math.round(total));
  const normalized = weights.map((w) => (Number.isFinite(w) && w > 0 ? w : 0));
  const sumWeight = normalized.reduce((acc, w) => acc + w, 0);

  if (sumWeight <= 0) {
    const base = Math.floor(safeTotal / count);
    const out = Array.from({ length: count }, () => base);
    for (let i = 0; i < safeTotal - base * count; i++) {
      out[i % count]! += 1;
    }
    return out;
  }

  const draft = normalized.map((w, idx) => {
    const raw = (safeTotal * w) / sumWeight;
    const floorVal = Math.floor(raw);
    return {
      idx,
      floorVal,
      frac: raw - floorVal,
    };
  });

  const out = Array.from({ length: count }, (_, idx) => draft[idx]!.floorVal);
  let remaining = safeTotal - out.reduce((acc, v) => acc + v, 0);

  draft.sort((a, b) => {
    if (b.frac !== a.frac) return b.frac - a.frac;
    return a.idx - b.idx;
  });

  let k = 0;
  while (remaining > 0 && count > 0) {
    const pick = draft[k % count];
    out[pick!.idx]! += 1;
    remaining--;
    k++;
  }

  return out;
}

async function checkCapacity(
  tx: Prisma.TransactionClient,
  machineId: number | null,
  slotDate: Date,
  newLoadSheets: number,
  machineMetaCache?: Map<
    number,
    {
      id: number;
      name: string;
      uom: string;
      stdOutputPerShift: number;
    }
  >,
) {
  if (!machineId) return;

  let machine = machineMetaCache?.get(machineId);
  if (!machine) {
    const dbMachine = await tx.machine.findUnique({
      where: { id: machineId },
      select: { id: true, name: true, uom: true, stdOutputPerShift: true },
    });
    if (!dbMachine) return;
    machine = {
      id: dbMachine.id,
      name: dbMachine.name,
      uom: dbMachine.uom,
      stdOutputPerShift: dbMachine.stdOutputPerShift ?? 0,
    };
    machineMetaCache?.set(machineId, machine);
  }
  if (!machine || machine.uom !== "sheet" || !machine.stdOutputPerShift) return;

  const shiftIndex = getShiftFromTime(slotDate);
  const shiftStart = startOfDay(slotDate);
  const shiftEnd = startOfDay(slotDate);
  if (shiftIndex === 0) {
    shiftStart.setHours(0, 0, 0, 0);
    shiftEnd.setHours(11, 0, 0, 0);
  } else if (shiftIndex === 1) {
    shiftStart.setHours(11, 0, 0, 0);
    shiftEnd.setHours(16, 0, 0, 0);
  } else {
    shiftStart.setHours(16, 0, 0, 0);
    shiftEnd.setDate(shiftEnd.getDate() + 1);
    shiftEnd.setHours(0, 0, 0, 0);
  }

  const max = machine.stdOutputPerShift;

  const currentLoadAgg = await tx.prosesMaterial.aggregate({
    where: {
      proses: {
        machineId,
        startDate: { gte: shiftStart, lt: shiftEnd },
        pro: { status: { notIn: [ProStatus.CLOSED, ProStatus.CANCELLED] } },
      },
      itemMaster: {
        baseUom: {
          equals: "sheet",
          mode: "insensitive",
        },
      },
    },
    _sum: { qtyReq: true },
  });

  const currentLoad = Number(currentLoadAgg._sum.qtyReq ?? 0);

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
