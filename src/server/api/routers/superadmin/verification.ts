import { z } from "zod";
import {
  adminOrSuperAdminProcedure,
  createTRPCRouter,
  superAdminProcedure,
} from "../../trpc";
import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";

// Ensure this path matches where Prisma enums are generated/exported
import {
  ReportStatus,
  LocationType,
  TxnType,
} from "../../../../../generated/prisma";

const VERIFY_TX_TIMEOUT_MS = 30000;
const VERIFY_TX_MAX_WAIT_MS = 10000;

export const verificationRouter = createTRPCRouter({
  getReports: adminOrSuperAdminProcedure
    .input(
      z
        .object({
          status: z.nativeEnum(ReportStatus).optional(),
          category: z
            .enum([
              "PAPER",
              "INJECTION",
              "BLOW_MOULDING",
              "PRINTING",
              "PACKING_ASSEMBLY",
            ])
            .optional(),
          limit: z.number().default(50),
          search: z.string().optional(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const where: any = {};

      // 1. Status Filter
      if (input?.status) {
        where.status = input.status;
      }

      // 2. Date Range Filter
      if (input?.startDate || input?.endDate) {
        where.reportDate = {};
        if (input.startDate) where.reportDate.gte = input.startDate;
        if (input.endDate) {
          // Include the full end day
          const endOfDay = new Date(input.endDate);
          endOfDay.setHours(23, 59, 59, 999);
          where.reportDate.lte = endOfDay;
        }
      }

      // 3. Search Filter (PRO or Product)
      if (input?.search) {
        where.proses = {
          pro: {
            OR: [
              { proNumber: { contains: input.search } },
              { productName: { contains: input.search } },
            ],
          },
        };
      }

      // 3. Department Restriction (Security)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const userDept = (ctx.session.user as any).department as
        | string
        | undefined;

      if (userDept === "PAPER") {
        // If user is PAPER and requests something else, return empty
        if (input?.category && input.category !== "PAPER") {
          return [];
        }
        where.reportType = "PAPER";
      } else if (userDept === "RIGID") {
        // If user is RIGID and requests PAPER, return empty
        if (input?.category === "PAPER") {
          return [];
        }
        // If specific rigid category requested, use it
        if (input?.category) {
          where.reportType = input.category;
        } else {
          // Otherwise show all rigid (non-PAPER)
          where.reportType = { not: "PAPER" };
        }
      } else {
        // No department restriction (Superadmin Global)
        if (input?.category) {
          where.reportType = input.category;
        }
      }

      const reports = await ctx.db.productionReport.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: input?.limit,
        include: {
          proses: {
            include: {
              pro: true,
              machine: true,
            },
          },
          checkedBy: {
            select: { username: true },
          },
        },
      });

      // Calculate fallback Std Speed per PRO (minute-based), aligned with Std Output concept.
      const uniqueProIds = [...new Set(reports.map((r) => r.proses.pro.id))];
      const proSpeedMap = new Map<number, number>();

      if (uniqueProIds.length > 0) {
        const history = await ctx.db.productionReport.findMany({
          where: {
            status: ReportStatus.APPROVED,
            startTime: { not: null },
            endTime: { not: null },
            proses: {
              proId: { in: uniqueProIds },
            },
          },
          select: {
            qtyPassOn: true,
            qtyWip: true,
            qtyHold: true,
            startTime: true,
            endTime: true,
            proses: {
              select: {
                proId: true,
              },
            },
          },
        });

        const acc = new Map<number, { out: number; mins: number }>();
        for (const h of history) {
          if (!h.startTime || !h.endTime) continue;
          const mins = (h.endTime.getTime() - h.startTime.getTime()) / (1000 * 60);
          if (mins <= 0) continue;
          const output =
            Number(h.qtyPassOn || 0) +
            Number(h.qtyWip || 0) +
            Number(h.qtyHold || 0);
          const key = h.proses.proId;
          const cur = acc.get(key) ?? { out: 0, mins: 0 };
          cur.out += output;
          cur.mins += mins;
          acc.set(key, cur);
        }

        for (const [proId, v] of acc) {
          if (v.mins > 0) {
            proSpeedMap.set(proId, v.out / v.mins);
          }
        }
      }

      return reports.map((r) => {
        const meta = (r.metaData as any) ?? {};
        const savedStdSpeed = meta.stdSpeed ? Number(meta.stdSpeed) : null; // per minute
        const manualSpeedPerHour = meta.productManualStdSpeed
          ? Number(meta.productManualStdSpeed)
          : null; // per hour from Std Output page
        const computedStdSpeed = proSpeedMap.get(r.proses.pro.id) ?? null; // per minute
        const finalStdSpeed =
          savedStdSpeed ??
          (manualSpeedPerHour !== null ? manualSpeedPerHour / 60 : null) ??
          computedStdSpeed;

        return {
          ...r,
          stdSpeed: finalStdSpeed,
          stdSpeedPerHour: finalStdSpeed !== null ? finalStdSpeed * 60 : null,
          manualStdSpeedPerHour: manualSpeedPerHour,
          savedStdSpeed,
          computedStdSpeed,
        };
      });
    }),

  approveReport: adminOrSuperAdminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // 1. Fetch Report with full context
      const report = await ctx.db.productionReport.findUnique({
        where: { id: input.id },
        include: {
          proses: {
            include: {
              machine: true,
              pro: {
                include: {
                  proses: {
                    orderBy: { orderNo: "asc" },
                    include: { machine: true },
                  },
                },
              },
            },
          },
        },
      });

      if (!report) {
        throw new Error("Report not found");
      }

      if (report.status === ReportStatus.APPROVED || report.stockPostedAt) {
        throw new Error("Report already approved/posted");
      }

      // Verify user for checkedBy
      const userExists = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { id: true },
      });

      // 2. Prepare Inventory Data
      const { proses } = report;
      const { pro } = proses;
      const allSteps = pro.proses;
      const currentStepIdx = allSteps.findIndex((s) => s.id === proses.id);

      const isLastStep = currentStepIdx === allSteps.length - 1;
      const isFirstStep = currentStepIdx === 0;

      const prevStep = isFirstStep ? null : allSteps[currentStepIdx - 1];

      // Item Codes — partNumber is REQUIRED for inventory posting
      if (!proses.partNumber) {
        throw new Error(
          "Part Number belum diisi pada proses ini. PPIC harus mengisi Part Number sebelum approve.",
        );
      }
      const currentOutputItem = proses.partNumber;
      const fgItem = pro.partNumber || currentOutputItem;
      const prevOutputItem = prevStep?.partNumber;

      // Quantities
      // Fix Decimal conversion: force toString() before Number()
      const qtyPassOn = Number(report.qtyPassOn?.toString() ?? "0");
      const qtyHold = Number(report.qtyHold?.toString() ?? "0");
      const qtyWip = Number(report.qtyWip?.toString() ?? "0");
      const qtyReject = Number(report.qtyReject?.toString() ?? "0");
      const inputWipQty = Number(report.inputWipQty?.toString() ?? "0");

      // 3. Execute Transaction
      return await ctx.db.$transaction(async (tx) => {
        // A. Re-fetch Report INSIDE transaction to ensure freshness & lock check
        // Although Prisma query may not lock row for read without explicit raw sql,
        // the atomic conditional update at the end serves as the final guard.

        // B. Helper to get/create location
        const ensureLocation = async (
          code: string,
          type: "WIP" | "FG" | "RAW" | "HOLD" | "SCRAP",
          name: string,
          machineId?: number | null,
        ) => {
          return await tx.inventoryLocation.upsert({
            where: { code },
            update: {},
            create: { code, type: type as LocationType, name, machineId },
            select: { id: true },
          });
        };

        // B2. Helper: resolve Item master ID (strict lookup, no auto-create)
        const itemMasterIdCache = new Map<string, number>();
        const resolveItemMasterId = async (
          itemCode: string,
        ): Promise<number> => {
          // Normalize: trim, uppercase, collapse whitespace
          const normalized = itemCode.trim().replace(/\s+/g, "_").toUpperCase();
          const cached = itemMasterIdCache.get(normalized);
          if (cached !== undefined) return cached;

          const item = await tx.item.findFirst({
            where: {
              OR: [
                { code: normalized },
                { code: itemCode }, // Fallback: exact match for legacy data
              ],
            },
            select: { id: true },
          });

          if (!item) {
            throw new TRPCError({
              code: "PRECONDITION_FAILED",
              message: `Item master tidak ditemukan untuk kode "${normalized}". PPIC harus membuat Item terlebih dahulu melalui form PRO (autocomplete Part Number).`,
            });
          }

          itemMasterIdCache.set(normalized, item.id);
          return item.id;
        };

        const now = new Date();
        const groupId = crypto.randomUUID(); // Atomic Group ID for this report approval

        // Deterministic Step Ordering
        const sortedSteps = pro.proses.sort((a, b) => a.orderNo - b.orderNo);
        const currentStepIdx = sortedSteps.findIndex((s) => s.id === proses.id);
        const isLastStep = currentStepIdx === sortedSteps.length - 1;
        const isFirstStep = currentStepIdx === 0;
        const isPaperFlow = pro.type === "PAPER";
        const hasMultipleSteps = sortedSteps.length > 1;
        const isPenultimateStep =
          hasMultipleSteps && currentStepIdx === sortedSteps.length - 2;
        const applyPaperLastTwoFlow = isPaperFlow && hasMultipleSteps;

        // C. Generate Transactions (IN ONLY for now)

        const nextStep = isLastStep ? null : sortedSteps[currentStepIdx + 1];

        // Pre-req for locations
        const machineId = proses.machineId;

        // === PHASE 2: TRANSFER LOGIC (OUT + IN) ===

        // === PHASE 2: TRANSFER LOGIC (OUT + IN) ===

        const currentItem = proses.partNumber ?? "UNKNOWN_ITEM";

        // Material requirements configured by PPIC on this step
        const materials = await tx.prosesMaterial.findMany({
          where: { prosesId: proses.id },
          include: { itemMaster: true },
        });

        const wipMaterials = materials.filter(
          (m) => m.itemMaster.kind === "WIP",
        );

        // Correction: For consumption (OUT), we use the INPUT item (Previous Step's Output).
        // For Step 1, Input = Output (Auto-Refill context).
        const consumptionItem = isFirstStep
          ? currentItem
          : (prevStep?.partNumber ?? "UNKNOWN_ITEM");

        const fgItem = pro.partNumber ?? currentItem;

        // Paper-only staging for last-two-process flow:
        // - Penultimate step pass-on goes here (ready for final process)
        // - Final step consumes previous-step item from this pool only
        const usePassOnReadyPoolForOutput =
          applyPaperLastTwoFlow && isPenultimateStep;
        const consumeFromPassOnReadyPool =
          applyPaperLastTwoFlow && isLastStep && !isFirstStep;

        const passOnReadyLocCode = "WIP_PASSON_READY";
        const passOnReadyLoc = usePassOnReadyPoolForOutput || consumeFromPassOnReadyPool
          ? await ensureLocation(
              passOnReadyLocCode,
              "WIP",
              "WIP Pass On Ready (Paper Last-2 Process)",
            )
          : null;

        const passOnReadyItemMasterId = consumeFromPassOnReadyPool
          ? await resolveItemMasterId(consumptionItem)
          : null;

        // === DRAFT FLAG DETECTION ===
        const involvedItemCodes = Array.from(
          new Set([
            consumptionItem,
            currentItem,
            fgItem,
            ...wipMaterials.map((m) => m.itemMaster.code),
          ]),
        ).filter(Boolean);
        const draftItems = await tx.item.findMany({
          where: {
            code: { in: involvedItemCodes },
            status: "DRAFT",
          },
        });
        const isDraft = draftItems.length > 0;

        const qtyWip = report.qtyWip ? Number(report.qtyWip.toString()) : 0;
        const totalOut = qtyPassOn + qtyHold + qtyReject;

        // Ensure Source Location (Current Machine)
        const currentLocCode = machineId
          ? `WIP_M_${machineId}`
          : `WIP_UNASSIGNED`;
        const currentLocName = machineId
          ? `WIP Bin - ${proses.machine?.name ?? "Machine " + machineId}`
          : `WIP Unassigned`;
        const currentLoc = await ensureLocation(
          currentLocCode,
          "WIP",
          currentLocName,
          machineId || null,
        );

        // 1. Step 1 Special Handling: Auto-Produce Input Stock (legacy fallback path only)
        // Logic: For the first process, we assume input material is "Produced" into WIP first.
        // Qty Created = Ending WIP + Total Output (PassOn + Hold + Reject)
        if (isFirstStep && wipMaterials.length === 0) {
          const totalProduced = qtyWip + totalOut;
          if (totalProduced > 0) {
            const refillMasterId = await resolveItemMasterId(consumptionItem);
            await tx.inventoryTxn.create({
              data: {
                groupId,
                date: now,
                type: TxnType.IN,
                itemId: consumptionItem, // Refilled Item
                itemMasterId: refillMasterId,
                qty: totalProduced,
                locationId: currentLoc.id,
                proId: pro.id,
                prosesId: proses.id,
                productionReportId: report.id,
                notes: "Production Entry (Step 1 Auto-Refill)",
              },
            });
          }
        }

        // 2. MATERIAL CONSUMPTION (OUT)
        // If PPIC configured WIP materials on this step, consume those materials with FIFO.
        // Otherwise fallback to legacy single-input consumption logic.
        if (totalOut > 0) {
          const consumeByFifo = async (params: {
            itemMasterId: number;
            itemCode: string;
            requiredQty: number;
            note: string;
            locationCodes?: string[];
          }) => {
            const requiredQty = Number(params.requiredQty);
            if (!Number.isFinite(requiredQty) || requiredQty <= 0) return;

            const [inTxns, outTxns] = await Promise.all([
              tx.inventoryTxn.findMany({
                where: {
                  // No proId filter: FIFO must search across ALL PROs because
                  // the WIP stock of this item may have been produced by different PROs
                  // (e.g. PRO 991 & PRO 992 both produced PN 111, consumed by PRO 222)
                  type: TxnType.IN,
                  location: params.locationCodes?.length
                    ? { type: LocationType.WIP, code: { in: params.locationCodes } }
                    : { type: LocationType.WIP },
                  OR: [
                    { itemMasterId: params.itemMasterId },
                    { itemMasterId: null, itemId: params.itemCode },
                  ],
                },
                select: {
                  id: true,
                  locationId: true,
                  qty: true,
                  date: true,
                  createdAt: true,
                },
                orderBy: [{ date: "asc" }, { createdAt: "asc" }, { id: "asc" }],
              }),
              tx.inventoryTxn.findMany({
                where: {
                  // No proId filter: must account for all past consumptions of this item
                  // across all PROs to correctly compute remaining stock
                  type: TxnType.OUT,
                  location: params.locationCodes?.length
                    ? { type: LocationType.WIP, code: { in: params.locationCodes } }
                    : { type: LocationType.WIP },
                  OR: [
                    { itemMasterId: params.itemMasterId },
                    { itemMasterId: null, itemId: params.itemCode },
                  ],
                },
                select: {
                  locationId: true,
                  qty: true,
                },
                orderBy: [{ date: "asc" }, { createdAt: "asc" }, { id: "asc" }],
              }),
            ]);

            const inLayersByLoc = new Map<
              number,
              Array<{
                locationId: number;
                remaining: number;
                dateMs: number;
                createdAtMs: number;
                seq: string;
              }>
            >();

            for (const txn of inTxns) {
              const locLayers = inLayersByLoc.get(txn.locationId) ?? [];
              locLayers.push({
                locationId: txn.locationId,
                remaining: Number(txn.qty?.toString() ?? "0"),
                dateMs: txn.date.getTime(),
                createdAtMs: txn.createdAt.getTime(),
                seq: txn.id,
              });
              inLayersByLoc.set(txn.locationId, locLayers);
            }

            for (const outTxn of outTxns) {
              let remainingOut = Number(outTxn.qty?.toString() ?? "0");
              const locLayers = inLayersByLoc.get(outTxn.locationId) ?? [];
              for (const layer of locLayers) {
                if (remainingOut <= 0) break;
                const taken = Math.min(layer.remaining, remainingOut);
                layer.remaining -= taken;
                remainingOut -= taken;
              }
            }

            const fifoLayers = Array.from(inLayersByLoc.values())
              .flat()
              .filter((l) => l.remaining > 0)
              .sort((a, b) => {
                if (a.dateMs !== b.dateMs) return a.dateMs - b.dateMs;
                if (a.createdAtMs !== b.createdAtMs) return a.createdAtMs - b.createdAtMs;
                return a.seq.localeCompare(b.seq);
              });

            const availableQty = fifoLayers.reduce((acc, l) => acc + l.remaining, 0);
            if (availableQty + 1e-9 < requiredQty) {
              throw new TRPCError({
                code: "PRECONDITION_FAILED",
                message: `Stock ${params.itemCode} tidak cukup untuk FIFO. Tersedia: ${availableQty.toFixed(
                  3,
                )}, Butuh: ${requiredQty.toFixed(3)}.`,
              });
            }

            const outPerLocation = new Map<number, number>();
            let remainingNeed = requiredQty;
            for (const layer of fifoLayers) {
              if (remainingNeed <= 0) break;
              const taken = Math.min(layer.remaining, remainingNeed);
              outPerLocation.set(
                layer.locationId,
                (outPerLocation.get(layer.locationId) ?? 0) + taken,
              );
              remainingNeed -= taken;
            }

            for (const [locationId, qty] of outPerLocation) {
              if (qty <= 0) continue;
              await tx.inventoryTxn.create({
                data: {
                  groupId,
                  date: now,
                  type: TxnType.OUT,
                  itemId: params.itemCode,
                  itemMasterId: params.itemMasterId,
                  qty,
                  locationId,
                  proId: pro.id,
                  prosesId: proses.id,
                  productionReportId: report.id,
                  notes: `${params.note} (FIFO)`,
                },
              });
            }
          };

          if (wipMaterials.length > 0) {
            // Base consumption:
            // - Prefer operator's actual input material if filled
            // - fallback to report output amount
            const inputMaterialQty = Number(report.inputMaterialQty?.toString() ?? "0");
            const baseQty = inputMaterialQty > 0 ? inputMaterialQty : totalOut;
            const isPrintingReport = report.reportType === "PRINTING";

            const activeWipMaterials = wipMaterials.filter(
              (m) => Number(m.qtyReq?.toString() ?? "0") > 0,
            );
            const totalReq = activeWipMaterials.reduce(
              (acc, m) => acc + Number(m.qtyReq?.toString() ?? "0"),
              0,
            );

            if (
              isPrintingReport &&
              inputMaterialQty <= 0 &&
              activeWipMaterials.length !== 1
            ) {
              throw new TRPCError({
                code: "PRECONDITION_FAILED",
                message: "Ambiguous WIP input for printing step.",
              });
            }

            const usePrevOutputForPrinting =
              isPrintingReport && !isFirstStep && inputMaterialQty <= 0;

            if (baseQty > 0 && usePrevOutputForPrinting) {
              const prevOutputMasterId = await resolveItemMasterId(consumptionItem);
              const useReadyOnly =
                consumeFromPassOnReadyPool &&
                passOnReadyItemMasterId !== null &&
                prevOutputMasterId === passOnReadyItemMasterId;

              await consumeByFifo({
                itemMasterId: prevOutputMasterId,
                itemCode: consumptionItem,
                requiredQty: Number(baseQty.toFixed(3)),
                note: "Material Consumption",
                locationCodes: useReadyOnly ? [passOnReadyLocCode] : undefined,
              });
            } else if (baseQty > 0 && totalReq > 0) {
              let allocated = 0;
              for (let i = 0; i < activeWipMaterials.length; i++) {
                const mat = activeWipMaterials[i]!;
                const req = Number(mat.qtyReq?.toString() ?? "0");

                const rawQty =
                  i === activeWipMaterials.length - 1
                    ? Math.max(baseQty - allocated, 0)
                    : (baseQty * req) / totalReq;

                const consumeQty = Number(rawQty.toFixed(3));
                allocated += consumeQty;
                const useReadyOnly =
                  consumeFromPassOnReadyPool &&
                  passOnReadyItemMasterId !== null &&
                  mat.itemMasterId === passOnReadyItemMasterId;

                await consumeByFifo({
                  itemMasterId: mat.itemMasterId,
                  itemCode: mat.itemMaster.code,
                  requiredQty: consumeQty,
                  note: "Material Consumption",
                  locationCodes: useReadyOnly ? [passOnReadyLocCode] : undefined,
                });
              }
            } else if (baseQty > 0) {
              throw new TRPCError({
                code: "PRECONDITION_FAILED",
                message:
                  "Material WIP pada step ini belum punya qtyReq yang valid untuk perhitungan konsumsi FIFO.",
              });
            }
          } else {
            // Legacy fallback: consume previous-step output from current machine bin
            let fallbackSourceLocId = currentLoc.id;
            let fallbackSourceName = proses.machine?.name ?? "Mesin";
            let useProScope = true;

            if (consumeFromPassOnReadyPool && passOnReadyLoc) {
              const readyBalanceAgg = await tx.inventoryTxn.groupBy({
                by: ["type"],
                where: {
                  locationId: passOnReadyLoc.id,
                  itemId: consumptionItem,
                },
                _sum: { qty: true },
              });

              let readyStock = 0;
              for (const g of readyBalanceAgg) {
                const qty = Number(g._sum.qty?.toString() ?? "0");
                if (g.type === TxnType.IN) readyStock += qty;
                else if (g.type === TxnType.OUT) readyStock -= qty;
              }

              // Backward compatibility:
              // If READY pool is empty/insufficient (old data flow), use legacy source.
              if (readyStock >= totalOut) {
                fallbackSourceLocId = passOnReadyLoc.id;
                fallbackSourceName = "WIP Pass On Ready";
                useProScope = false;
              }
            }

            if (!isFirstStep) {
              const balanceAgg = await tx.inventoryTxn.groupBy({
                by: ["type"],
                where: {
                  locationId: fallbackSourceLocId,
                  itemId: consumptionItem,
                  ...(useProScope ? { proId: pro.id } : {}),
                },
                _sum: { qty: true },
              });

              let currentStock = 0;
              for (const g of balanceAgg) {
                const qty = Number(g._sum.qty?.toString() ?? "0");
                if (g.type === TxnType.IN) currentStock += qty;
                else if (g.type === TxnType.OUT) currentStock -= qty;
              }

              if (currentStock < totalOut) {
                throw new TRPCError({
                  code: "PRECONDITION_FAILED",
                  message: `Stock tidak cukup di ${
                    fallbackSourceName
                  }. Tersedia: ${currentStock} (${consumptionItem}), Butuh OUT: ${totalOut}. (Harap cek inputan step sebelumnya)`,
                });
              }
            }

            const outMasterId = await resolveItemMasterId(consumptionItem);
            await tx.inventoryTxn.create({
              data: {
                groupId,
                date: now,
                type: TxnType.OUT,
                itemId: consumptionItem,
                itemMasterId: outMasterId,
                qty: totalOut,
                locationId: fallbackSourceLocId,
                proId: pro.id,
                prosesId: proses.id,
                productionReportId: report.id,
                notes:
                  fallbackSourceName === "WIP Pass On Ready"
                    ? "Production Output (Transfer OUT - PASS ON READY)"
                    : "Production Output (Transfer OUT)",
              },
            });
          }
        }

        // 3. POST IN (Destinations)
        // A. Pass On
        if (qtyPassOn > 0) {
          if (nextStep) {
            // IN to Next Machine
            // ItemId remains currentItem (as per instruction "itemId tetap proses.partNumber")
            let nextLoc: { id: number };
            if (usePassOnReadyPoolForOutput && passOnReadyLoc) {
              nextLoc = passOnReadyLoc;
            } else {
              const nextMachineId = nextStep.machineId;
              const nextLocCode = nextMachineId
                ? `WIP_M_${nextMachineId}`
                : `WIP_UNASSIGNED`;
              const nextLocName = nextMachineId
                ? `WIP Bin - ${
                    nextStep.machine?.name ?? "Machine " + nextMachineId
                  }`
                : `WIP Unassigned (Next Step)`;

              nextLoc = await ensureLocation(
                nextLocCode,
                "WIP",
                nextLocName,
                nextMachineId || null,
              );
            }

            const passOnMasterId = await resolveItemMasterId(currentItem);
            await tx.inventoryTxn.create({
              data: {
                groupId,
                date: now,
                type: TxnType.IN,
                itemId: currentItem, // Uses Current Step's PartNumber
                itemMasterId: passOnMasterId,
                qty: qtyPassOn,
                locationId: nextLoc.id,
                proId: pro.id,
                prosesId: proses.id,
                productionReportId: report.id,
                notes: usePassOnReadyPoolForOutput
                  ? `Transfer to PASS ON READY for Step ${nextStep.orderNo}`
                  : `Transfer to Step ${nextStep.orderNo}`,
              },
            });
          } else {
            // Last Step → check item kind:
            // - WIP item → WIP_STAGING (stays in WIP for cross-PRO FIFO consumption)
            // - FG item  → FG_WH (finished good, normal flow)
            const fgItemMaster = await tx.item.findFirst({
              where: {
                OR: [{ code: fgItem }, { code: currentItem }],
              },
              select: { kind: true },
              orderBy: { id: "asc" },
            });

            const outputIsWip = fgItemMaster?.kind === "WIP";

            if (outputIsWip) {
              // WIP output → WIP Staging so cross-PRO FIFO can consume it
              const wipStagingLoc = await ensureLocation(
                "WIP_STAGING",
                "WIP",
                "WIP Staging Area",
              );
              const wipMasterId = await resolveItemMasterId(fgItem);
              await tx.inventoryTxn.create({
                data: {
                  groupId,
                  date: now,
                  type: TxnType.IN,
                  itemId: fgItem,
                  itemMasterId: wipMasterId,
                  qty: qtyPassOn,
                  locationId: wipStagingLoc.id,
                  proId: pro.id,
                  prosesId: proses.id,
                  productionReportId: report.id,
                  notes: "WIP Produced (Staging for cross-PRO FIFO)",
                },
              });
            } else {
              // FG output → Finish Good Warehouse (normal flow)
              const fgLoc = await ensureLocation(
                "FG_WH",
                "FG",
                "Finish Good Warehouse",
              );
              const fgMasterId = await resolveItemMasterId(fgItem);
              await tx.inventoryTxn.create({
                data: {
                  groupId,
                  date: now,
                  type: TxnType.IN,
                  itemId: fgItem,
                  itemMasterId: fgMasterId,
                  qty: qtyPassOn,
                  locationId: fgLoc.id,
                  proId: pro.id,
                  prosesId: proses.id,
                  productionReportId: report.id,
                  notes: "Finished Goods Received",
                },
              });
            }
          }
        }

        // B. Hold
        if (qtyHold > 0) {
          const holdLoc = await ensureLocation(
            "HOLD_QA",
            "HOLD",
            "QA Hold Area",
          );
          // Hold uses current item ID (or FG if last step?) User said: "itemId = proses.partNumber (atau FG PN jika last step)"
          // Let's use currentItem for consistency, unless it IS last step.
          // Logic: "itemId = proses.partNumber (atau FG PN jika last step)" implies condition.
          const itemHold = isLastStep ? fgItem : currentItem;

          const holdMasterId = await resolveItemMasterId(itemHold);
          await tx.inventoryTxn.create({
            data: {
              groupId,
              date: now,
              type: TxnType.IN,
              itemId: itemHold,
              itemMasterId: holdMasterId,
              qty: qtyHold,
              locationId: holdLoc.id,
              proId: pro.id,
              prosesId: proses.id,
              productionReportId: report.id,
              notes: "Production Hold (QA)",
            },
          });
        }

        // C. Reject
        if (qtyReject > 0) {
          const scrapLoc = await ensureLocation(
            "SCRAP_BIN",
            "SCRAP",
            "Scrap Bin",
          );
          const itemReject = isLastStep ? fgItem : currentItem;

          const rejectMasterId = await resolveItemMasterId(itemReject);
          await tx.inventoryTxn.create({
            data: {
              groupId,
              date: now,
              type: TxnType.IN,
              itemId: itemReject,
              itemMasterId: rejectMasterId,
              qty: qtyReject,
              locationId: scrapLoc.id,
              proId: pro.id,
              prosesId: proses.id,
              productionReportId: report.id,
              notes: "Production Reject/Scrap",
            },
          });
        }

        // D. WIP Output (kept at current machine WIP or staging)
        if (qtyWip > 0) {
          const wipLocCode = "WIP_STAGING";
          const wipLocName = "WIP Staging Area";

          const wipLoc = await ensureLocation(
            wipLocCode,
            "WIP",
            wipLocName,
            null
          );
          
          const wipMasterId = await resolveItemMasterId(currentItem);
          await tx.inventoryTxn.create({
            data: {
              groupId,
              date: now,
              type: TxnType.IN,
              itemId: currentItem,
              itemMasterId: wipMasterId,
              qty: qtyWip,
              locationId: wipLoc.id,
              proId: pro.id,
              prosesId: proses.id,
              productionReportId: report.id,
              notes: "Production Output (WIP Kept)",
            },
          });
        }

        // 4. Consumption is posted above (FIFO for PPIC WIP materials, with legacy fallback).

        // E. Update Report Status & PRO Status with ATOMIC CHECK
        // This will throw if record does not exist or stockPostedAt is not null
        // causing the whole transaction (including created InventoryTxns) to rollback.
        await tx.productionReport.update({
          where: {
            id: input.id,
            stockPostedAt: null, // IDEMPOTENCY GUARD
          },
          data: {
            status: ReportStatus.APPROVED,
            checkedById: userExists ? ctx.session.user.id : null,
            checkedAt: now,
            stockPostedAt: now, // Mark as posted
            rejectionNote: null,
          },
        });

        // E. Recalculate PRO Status
        // Re-fetch necessary data including quantities for target check
        const freshPro = await tx.pro.findUnique({
          where: { id: pro.id },
          include: {
            proses: {
              orderBy: { orderNo: "asc" },
              include: {
                productionReports: {
                  // Fetch basic info for status check & output calculation
                  select: {
                    status: true,
                    qtyPassOn: true,
                  },
                },
              },
            },
          },
        });

        if (freshPro) {
          let newStatus = freshPro.status;
          let hasActivity = false;
          let totalOutput = 0;

          // Check activity across all steps
          for (const s of freshPro.proses) {
            if (s.productionReports.length > 0) {
              hasActivity = true;
            }
          }

          // Calculate Total Output from LAST PROCESS (Passed On + Good)
          // Assuming Last Step produces the Finished Good
          if (freshPro.proses.length > 0) {
            const lastStep = freshPro.proses[freshPro.proses.length - 1];
            if (lastStep) {
              // Sum only APPROVED reports
              totalOutput = lastStep.productionReports
                .filter((r) => r.status === ReportStatus.APPROVED)
                .reduce((acc, r) => {
                  return acc + Number(r.qtyPassOn?.toString() ?? "0");
                }, 0);
            }
          }

          // Target Check
          if (totalOutput >= freshPro.qtyPoPcs) {
            // CHANGE REQ: User wants COMPLETE not CLOSED/COMPLETE confusion.
            // Assuming "COMPLETE" is a valid enum status in schema.
            // Current Enum likely: OPEN, IN_PROGRESS, COMPLETE, CLOSED, CANCELLED
            newStatus = "COMPLETE" as any;
          } else if (hasActivity) {
            newStatus = "IN_PROGRESS";
          } else {
            newStatus = "OPEN";
          }

          // Guard: Handle Transitions
          let allowUpdate = true;
          if (freshPro.status === "CANCELLED") allowUpdate = false;
          // Only allow CLOSED -> COMPLETE (Fix correction), otherwise keep CLOSED (Short Close)
          if (freshPro.status === "CLOSED" && newStatus !== "COMPLETE")
            allowUpdate = false;

          // Update if changed
          if (allowUpdate && newStatus !== freshPro.status) {
            await tx.pro.update({
              where: { id: freshPro.id },
              data: { status: newStatus as any },
            });
          }
        }

        return {
          ...report,
          isDraft,
        };
      }, { timeout: VERIFY_TX_TIMEOUT_MS, maxWait: VERIFY_TX_MAX_WAIT_MS });
    }),

  voidReport: superAdminProcedure
    .input(z.object({ id: z.string(), reason: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // 1. Fetch Report
      const report = await ctx.db.productionReport.findUnique({
        where: { id: input.id },
        include: {
          proses: {
            include: {
              pro: {
                include: {
                  proses: {
                    include: {
                      productionReports: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!report) {
        throw new Error("Report not found");
      }

      if (report.status !== ReportStatus.APPROVED) {
        throw new Error("Only APPROVED reports can be VOIDED");
      }

      const userExists = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      const now = new Date();
      const groupId = crypto.randomUUID(); // Void Group ID

      return await ctx.db.$transaction(async (tx) => {
        // 2. Reverse Inventory Transactions if posted
        if (report.stockPostedAt) {
          // Find original transactions
          const originalTxns = await tx.inventoryTxn.findMany({
            where: { productionReportId: report.id },
          });

          for (const txn of originalTxns) {
            // Determine reversal type
            let reversalType: TxnType;
            if (txn.type === TxnType.IN) reversalType = TxnType.OUT;
            else if (txn.type === TxnType.OUT) reversalType = TxnType.IN;
            else continue; // Skip ADJUST or others if any

            // Create Reversal Transaction
            await tx.inventoryTxn.create({
              data: {
                groupId,
                date: now,
                type: reversalType,
                itemId: txn.itemId,
                itemMasterId: txn.itemMasterId, // Copy from original
                qty: txn.qty,
                locationId: txn.locationId,

                // Link to original context
                proId: txn.proId,
                prosesId: txn.prosesId,
                productionReportId: null, // Set to null to avoid unique constraint violation with original txn (e.g. if flipping IN->OUT clashes with existing OUT)

                notes: `VOID Reversal for Report ${report.id}: ${input.reason}`,
              },
            });
          }
        }

        // 3. Update Report Status
        const updatedReport = await tx.productionReport.update({
          where: { id: input.id },
          data: {
            status: ReportStatus.VOID,
            voidedAt: now,
            voidedById: userExists ? ctx.session.user.id : null,
            voidReason: input.reason,
          },
        });

        // 4. Recalculate PRO Status
        // Since this report is now VOID, it contributes 0 to progress.
        // We re-evaluate the PRO based on remaining valid reports.

        const pro = report.proses.pro;
        const freshPro = await tx.pro.findUnique({
          where: { id: pro.id },
          include: {
            proses: {
              orderBy: { orderNo: "asc" },
              include: {
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

        if (freshPro) {
          let newStatus = freshPro.status;
          let hasActivity = false;
          let totalOutput = 0;

          // Check activity
          for (const s of freshPro.proses) {
            // Valid reports only
            const validReports = s.productionReports.filter(
              (r) =>
                r.status !== ReportStatus.VOID &&
                r.status !== ReportStatus.REJECTED,
            );
            if (validReports.length > 0) hasActivity = true;
          }

          // Calculate Total Output from LAST PROCESS
          if (freshPro.proses.length > 0) {
            const lastStep = freshPro.proses[freshPro.proses.length - 1];
            if (lastStep) {
              totalOutput = lastStep.productionReports
                .filter((r) => r.status === ReportStatus.APPROVED)
                .reduce((acc, r) => {
                  return acc + Number(r.qtyPassOn?.toString() ?? "0");
                }, 0);
            }
          }

          // Target Check
          if (totalOutput >= freshPro.qtyPoPcs) {
            // CHANGE REQ: User wants COMPLETE not CLOSED/COMPLETE confusion.
            // Assuming "COMPLETE" is a valid enum status in schema.
            // Current Enum likely: OPEN, IN_PROGRESS, COMPLETE, CLOSED, CANCELLED
            newStatus = "COMPLETE" as any;
          } else if (hasActivity) {
            newStatus = "IN_PROGRESS";
          } else {
            newStatus = "OPEN";
          }

          // Guard: Handle Transitions
          let allowUpdate = true;
          if (freshPro.status === "CANCELLED") allowUpdate = false;
          // Only allow CLOSED -> COMPLETE (Fix correction), otherwise keep CLOSED (Short Close)
          if (freshPro.status === "CLOSED" && newStatus !== "COMPLETE")
            allowUpdate = false;

          if (allowUpdate && newStatus !== freshPro.status) {
            await tx.pro.update({
              where: { id: freshPro.id },
              data: { status: newStatus as any },
            });
          }
        }

        return updatedReport;
      }, { timeout: VERIFY_TX_TIMEOUT_MS, maxWait: VERIFY_TX_MAX_WAIT_MS });
    }),

  rejectReport: adminOrSuperAdminProcedure
    .input(z.object({ id: z.string(), note: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // 1. Check current status
      const existingReport = await ctx.db.productionReport.findUnique({
        where: { id: input.id },
      });

      if (!existingReport) throw new Error("Report not found");

      if (
        existingReport.status === ReportStatus.APPROVED ||
        existingReport.stockPostedAt
      ) {
        throw new Error(
          "Cannot REJECT an already APPROVED/POSTED report. Use VOID instead.",
        );
      }

      // Verify user exists before setting foreign key
      const userExists = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { id: true },
      });

      const report = await ctx.db.productionReport.update({
        where: { id: input.id },
        data: {
          status: ReportStatus.REJECTED,
          rejectionNote: input.note,
          checkedById: userExists ? ctx.session.user.id : null,
          checkedAt: new Date(),
        },
        include: {
          proses: {
            include: {
              pro: {
                include: {
                  proses: {
                    include: {
                      productionReports: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Update PRO status based on all reports
      // Update PRO status based on Phase 2 Logic
      if (report.proses.pro) {
        const pro = report.proses.pro;

        // If manually CLOSED or CANCELLED, do not auto-update
        // EXCEPTION: Allow CLOSED -> COMPLETE correction

        let newStatus = pro.status;
        let hasActivity = false;
        let totalOutput = 0;

        // Check activity
        for (const s of pro.proses) {
          const validReports = s.productionReports.filter(
            (r) =>
              r.status !== ReportStatus.VOID &&
              r.status !== ReportStatus.REJECTED,
          );
          if (validReports.length > 0) hasActivity = true;
        }

        // Calculate Total Output from LAST PROCESS
        if (pro.proses.length > 0) {
          // Sort processes manually
          const sortedSteps = [...pro.proses].sort(
            (a, b) => a.orderNo - b.orderNo,
          );
          const lastStep = sortedSteps[sortedSteps.length - 1];

          if (lastStep) {
            totalOutput = lastStep.productionReports
              .filter((r) => r.status === ReportStatus.APPROVED)
              .reduce((acc, r) => {
                return acc + Number(r.qtyPassOn?.toString() ?? "0");
              }, 0);
          }
        }

        // Target Check
        if (totalOutput >= pro.qtyPoPcs) {
          newStatus = "COMPLETE" as any;
        } else if (hasActivity) {
          newStatus = "IN_PROGRESS" as any;
        } else {
          newStatus = "OPEN" as any;
        }

        // Guard: Handle Transitions
        let allowUpdate = true;
        if (pro.status === "CANCELLED") allowUpdate = false;
        // Only allow CLOSED -> COMPLETE (Fix correction), otherwise keep CLOSED (Short Close)
        if (pro.status === "CLOSED" && newStatus !== "COMPLETE")
          allowUpdate = false;

        if (allowUpdate && newStatus !== pro.status) {
          await ctx.db.pro.update({
            where: { id: pro.id },
            data: { status: newStatus },
          });
        }
      }

      return report;
    }),

  updateAdminNote: adminOrSuperAdminProcedure
    .input(z.object({ id: z.string(), note: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.productionReport.update({
        where: { id: input.id },
        data: { adminNote: input.note },
      });
    }),

  updateReportStandards: superAdminProcedure
    .input(
      z.object({
        id: z.string(),
        cavityStd: z.number().int().positive().optional(),
        cycleTimeStd: z.number().positive().optional(),
        mpStd: z.number().int().positive().optional(),
        stdSpeed: z.number().positive().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updateData: any = {
        cavityStd: input.cavityStd,
        cycleTimeStd: input.cycleTimeStd,
        manPowerStd: input.mpStd,
      };

      // Store stdSpeed in metaData JSON (no schema change needed)
      if (input.stdSpeed !== undefined) {
        const existing = await ctx.db.productionReport.findUnique({
          where: { id: input.id },
          select: { metaData: true },
        });
        const meta = (existing?.metaData as any) ?? {};
        updateData.metaData = { ...meta, stdSpeed: input.stdSpeed };
      }

      return ctx.db.productionReport.update({
        where: { id: input.id },
        data: updateData,
      });
    }),
});
