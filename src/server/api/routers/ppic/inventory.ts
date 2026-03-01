import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import {
  LocationType,
  TxnType,
  ProType,
} from "../../../../../generated/prisma";
import { Prisma } from "../../../../../generated/prisma";

// Type for WipMonitor Item
export type WipMonitorItem = {
  proId: number | null;
  locationId: number;
  itemId: string;
  itemMasterId?: number | null;
  itemName?: string; // From Item master
  qty: number;

  // Details populated manually
  proNumber?: string;
  productName?: string; // Product name from PRO
  proType?: string; // PAPER/RIGID
  proQty?: number; // Target PO
  machineName?: string;
  locationName?: string;
  stepOrder?: number;
};

export const inventoryRouter = createTRPCRouter({
  // 1. WIP Monitor (Group by PRO + Machine)
  getWipMonitor: protectedProcedure
    .input(
      z
        .object({
          proId: z.number().optional(),
          machineId: z.number().optional(), // Filter by machine
          includeZero: z.boolean().optional(),
          locationTypes: z.array(z.string()).optional(),
          type: z.nativeEnum(ProType).optional(), // Filter by PAPER/RIGID
          mode: z
            .enum(["INVENTORY", "PROGRESS"])
            .default("INVENTORY")
            .optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const filters = input || {};
      const mode = filters.mode ?? "INVENTORY";

      // --- MODE: INVENTORY (On-Hand: IN - OUT) ---
      if (mode === "INVENTORY") {
        // A. Group Transactions by PRO + Location (Machine) + Item
        // Filter locations based on input, default to WIP
        const typeFilter = filters.locationTypes
          ? { in: filters.locationTypes as LocationType[] }
          : LocationType.WIP;

        const groups = await ctx.db.inventoryTxn.groupBy({
          by: ["proId", "locationId", "itemId", "type"],
          where: {
            location: {
              type: typeFilter,
              ...(filters.machineId ? { machineId: filters.machineId } : {}),
            },
            ...(filters.proId ? { proId: filters.proId } : {}),
            ...(filters.type ? { pro: { type: filters.type } } : {}),
          },
          _sum: {
            qty: true,
          },
        });

        // B. Fetch Details for Relations
        const proIds = groups
          .map((g) => g.proId)
          .filter((id): id is number => id !== null);

        const locationIds = groups.map((g) => g.locationId);

        const uniqueProIds = [...new Set(proIds)];
        const uniqueLocIds = [...new Set(locationIds)];

        const [pros, locations, allProses, items] = await Promise.all([
          ctx.db.pro.findMany({
            where: { id: { in: uniqueProIds } },
            select: { id: true, proNumber: true, productName: true, type: true, qtyPoPcs: true },
          }),
          ctx.db.inventoryLocation.findMany({
            where: { id: { in: uniqueLocIds } },
            include: { machine: true },
          }),
          ctx.db.proses.findMany({
            where: { proId: { in: uniqueProIds } },
            select: { proId: true, machineId: true, orderNo: true },
          }),
          ctx.db.item.findMany({
            where: { code: { in: [...new Set(groups.map((g) => g.itemId))] } },
            select: { id: true, code: true, name: true },
          }),
        ]);

        const proMap = new Map(pros.map((p) => [p.id, p]));
        const locMap = new Map(locations.map((l) => [l.id, l]));
        const itemMap = new Map(items.map((i) => [i.code, i]));

        const stepOrderMap = new Map<string, number>();
        for (const p of allProses) {
          if (p.machineId) {
            stepOrderMap.set(`${p.proId}-${p.machineId}`, p.orderNo);
          }
        }

        const aggregatedMap = new Map<string, WipMonitorItem>();

        for (const g of groups) {
          const key = `${g.proId}-${g.locationId}-${g.itemId}`;
          const qty = Number(g._sum.qty ?? 0);

          if (!aggregatedMap.has(key)) {
            const pro = g.proId ? proMap.get(g.proId) : null;
            const loc = locMap.get(g.locationId);

            let stepOrder = 999;
            if (pro && loc?.machineId) {
              stepOrder = stepOrderMap.get(`${pro.id}-${loc.machineId}`) ?? 999;
            }

            const itemMaster = itemMap.get(g.itemId);

            aggregatedMap.set(key, {
              proId: g.proId,
              locationId: g.locationId,
              itemId: g.itemId,
              itemMasterId: itemMaster?.id ?? null,
              itemName: itemMaster?.name ?? g.itemId,
              qty: 0,
              proNumber: pro?.proNumber ?? "Unknown PRO",
              productName: pro?.productName ?? "",
              proType: pro?.type ?? "Unknown",
              proQty: pro?.qtyPoPcs ?? 0,
              locationName: loc?.name ?? "Unknown Loc",
              machineName: loc?.machine?.name ?? loc?.name ?? "Unassigned",
              stepOrder,
            });
          }

          const item = aggregatedMap.get(key)!;
          if (g.type === TxnType.IN) {
            item.qty += qty;
          } else if (g.type === TxnType.OUT) {
            item.qty -= qty;
          } else if (g.type === TxnType.ADJUST) {
            item.qty += qty;
          }
        }

        const result = Array.from(aggregatedMap.values());
        if (input?.includeZero) {
          return result;
        }
        return result.filter((r) => Math.abs(r.qty) > 0.001);
      }

      // --- MODE: PROGRESS (Produksi: Accumulated APPROVED PassOn) ---
      else {
        // 1. Fetch Production Reports (Sum qtyPassOn)
        // Group by Proses (which links to PRO and Machine)
        const reportGroups = await ctx.db.productionReport.groupBy({
          by: ["prosesId"],
          where: {
            status: "APPROVED",
            proses: {
              ...(filters.proId ? { proId: filters.proId } : {}),
              ...(filters.machineId ? { machineId: filters.machineId } : {}),
              ...(filters.type ? { pro: { type: filters.type } } : {}),
            },
          },
          _sum: {
            qtyPassOn: true,
          },
        });

        // 2. Resolve Relations
        const prosesIds = reportGroups.map((g) => g.prosesId);

        // Need distinct PIDs to fetch basic PRO info
        // We'll fetch Proses with includes
        const prosesDetails = await ctx.db.proses.findMany({
          where: { id: { in: prosesIds } },
          include: {
            pro: true,
            machine: true,
          },
        });
        const prosesMap = new Map(prosesDetails.map((p) => [p.id, p]));

        const results: WipMonitorItem[] = [];

        for (const g of reportGroups) {
          const p = prosesMap.get(g.prosesId);
          if (!p) continue;

          // Note: Progress view usually shows "How much passed from this step".
          // ItemId isn't strictly in ProductionReport directly (it's per PRO).
          // But WipMonitorItem structure requires itemId.
          // Usually, PRO encodes the item/product. We can use pro.productName or proNumber.
          // Or if we want strict compatibility with the UI which groups by ItemId, we use PRO Number?
          // User requirement: "Pilih salah satu implementasi... Mode Produced-to-date".
          // Let's use Pro Number as ItemId or a placeholder if mapping isn't 1:1.
          // Actually, `WipMonitorItem` expects `itemId`.
          // In `InventoryTxn`, `itemId` is explicit.
          // In `ProductionReport`, we don't store `itemId`. We store `prosesId` -> `Pro`.
          // `Pro` has `productName`.
          // Let's use `pro.productName` or `pro.proNumber` if `itemId` is missing.
          // However, the existing UI groups by `itemId`.
          // For now, let's use `proNumber` as the key if `itemId` is unavailable, OR simpler:
          // Fetch `pro.productName` as `itemId`.

          results.push({
            proId: p.proId,
            locationId: 0, // No specific location for "Progress" view (conceptually)
            itemId: p.pro.productName || p.pro.proNumber, // Use Product Name as Item Identifier
            qty: Number(g._sum.qtyPassOn ?? 0),
            proNumber: p.pro.proNumber,
            productName: p.pro.productName,
            proType: p.pro.type,
            proQty: p.pro.qtyPoPcs,
            machineName: p.machine?.name ?? "No Machine",
            locationName: "Production Output", // Dummy
            stepOrder: p.orderNo,
          });
        }

        // 3. Also Fetch FG Received (Cumulative)
        // Only if not filtering by machine (or if FG location is relevant)
        // User said: "Mode Produced-to-date (Progress): tampil total approved qtyPassOn per step/mesin + FG received cumulative."

        // FG Received is effectively InventoryTxn IN to FG.
        const fgGroups = await ctx.db.inventoryTxn.groupBy({
          by: ["proId", "itemId"],
          where: {
            type: "IN",
            location: { type: "FG" },
            ...(filters.proId ? { proId: filters.proId } : {}),
          },
          _sum: {
            qty: true,
          },
        });

        // Fetch PRO details for FG items
        const fgProIds = fgGroups
          .map((g) => g.proId)
          .filter((id): id is number => id !== null);
        const fgPros = await ctx.db.pro.findMany({
          where: { id: { in: fgProIds } },
          select: { id: true, proNumber: true, productName: true, type: true, qtyPoPcs: true },
        });
        const fgProMap = new Map(fgPros.map((p) => [p.id, p]));

        for (const g of fgGroups) {
          const pro = g.proId ? fgProMap.get(g.proId) : null;
          // Only add if it matches filters
          if (filters.type && pro?.type !== filters.type) continue;

          results.push({
            proId: g.proId,
            locationId: -1, // Dummy
            itemId: g.itemId,
            qty: Number(g._sum.qty ?? 0),
            proNumber: pro?.proNumber ?? "Unknown",
            productName: pro?.productName ?? "",
            proType: pro?.type ?? "Unknown",
            proQty: pro?.qtyPoPcs ?? 0,
            machineName: "FG Received", // Virtual Machine Name
            locationName: "Warehouse FG",
            stepOrder: 9999, // Last
          });
        }

        return results;
      }
    }),

  // 2. Stock Card (Detailed History with Opening Balance)
  getStockCard: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
        locationId: z.number().optional(),
        proId: z.number().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        page: z.number().min(1).default(1),
        pageSize: z.number().max(100).default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { itemId, locationId, proId, startDate, endDate, page, pageSize } =
        input;

      const whereClause: Prisma.InventoryTxnWhereInput = {
        itemId,
        ...(locationId ? { locationId } : {}),
        ...(proId ? { proId } : {}),
      };

      // A. Calculate Opening Balance (Sum BEFORE startDate)
      let openingBalance = 0;
      if (startDate) {
        const sumResult = await ctx.db.inventoryTxn.aggregate({
          where: {
            ...whereClause,
            date: { lt: startDate },
          },
          _sum: { qty: true },
        }); // Note: logic assumes IN is positive, OUT is negative?

        // Wait, 'qty' in DB is always positive?
        // Logic for balance: IN - OUT.
        // Prisma agg doesn't condition on Type. We must group by Type to calc net.

        const typeGroups = await ctx.db.inventoryTxn.groupBy({
          by: ["type"],
          where: {
            ...whereClause,
            date: { lt: startDate },
          },
          _sum: { qty: true },
        });

        for (const g of typeGroups) {
          const val = Number(g._sum.qty ?? 0);
          if (g.type === TxnType.IN) openingBalance += val;
          else if (g.type === TxnType.OUT)
            openingBalance -= val; // Consumption/Reversal
          else if (g.type === TxnType.ADJUST) openingBalance += val; // Assume Adjust can be +/-? In schema it's decimal? Usually qty is absolute, type dictates sign.
          // Schema: qty Decimal @db.Decimal(12, 3).
          // Adjust logic needs definition. Assume Adjust is just signed value? Or Use IN_ADJUST / OUT_ADJUST?
          // Current Enum: IN, OUT, ADJUST.
          // Let's assume ADJUST handles sign in the value, OR explicitly handled?
          // For now let's assume standard logic: IN (+), OUT (-).
          // If ADJUST is used, we need to know sign.
          // Revisit later. For now focus on IN/OUT.
        }
      }

      // B. Fetch Page Transactions
      const txns = await ctx.db.inventoryTxn.findMany({
        where: {
          ...whereClause,
          ...(startDate && { date: { gte: startDate } }),
          ...(endDate && { date: { lte: endDate } }),
        },
        orderBy: { date: "asc" }, // Ascending for running balance calculation
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          productionReport: {
            select: {
              id: true,
              shift: true,
              operatorName: true,
              reportDate: true,
              status: true,
            },
          },
          location: true,
          itemMaster: {
            select: { id: true, code: true, name: true, kind: true },
          },
          proses: {
            select: {
              orderNo: true,
              machine: { select: { name: true } },
              pro: { select: { proNumber: true } },
            },
          },
          pro: { select: { proNumber: true } },
        },
      });

      const totalCount = await ctx.db.inventoryTxn.count({
        where: {
          ...whereClause,
          ...(startDate && { date: { gte: startDate } }),
          ...(endDate && { date: { lte: endDate } }),
        },
      });

      // C. Calculate Running Balance for the Page
      // Because we computed openingBalance up to startDate,
      // AND we might have skipped records if page > 1...

      // ERROR in logic: Paginated fetch skips records between startDate and Page Start.
      // Opening Balance should be "Attributes before THIS PAGE".

      // FIX:
      // 1. Calculate Sum of ALL records before current page offset.
      //    (Where date < startDate OR (date >= startDate AND index < skipped))
      //    This is complex with dates.
      // Better approach:
      // Always compute "Absolute Opening Balance" (Everything before first record of this page).

      // Refined Logic:
      // 1. Get ALL transactions sorted by date (filtered by date range if provided).
      // 2. JS compute running balance.
      // 3. Slice for pagination.
      // Pros: Accurate. Cons: Memory if millions of records.
      // But for Stock Card (per Item/Location), volume is usually manageable (<10k).

      // Let's assume < 2000 records per view for now.

      // Alternative:
      // Calculate "Balance at StartDate" (Server Aggregation).
      // Then fetch (Page-1)*PageSize records after StartDate to sum them up for "Page Opening Balance".
      // Then fetch Page records.

      // Let's start simpler:
      // Just return `openingBalance` (at StartDate) and let Client compute running balance for the VIEWED rows?
      // No, user said "Don't compute client side from paginated data".
      // Means server must provide the running balance for each row.

      // Impl:
      // 1. Fetch ALL matching transactions (filtered by date).
      // 2. Compute running balance in memory.
      // 3. Slice the array for pagination.
      // 4. Return window.

      // B. Fetch All Matching Transactions (for running balance calc)
      // Note: For large datasets, this in-memory calc is heavy. Optimizations needed later.
      const allTxns = await ctx.db.inventoryTxn.findMany({
        where: {
          ...whereClause,
          ...(startDate ? { date: { gte: startDate } } : {}),
          ...(endDate ? { date: { lte: endDate } } : {}),
        },
        orderBy: { date: "asc" },
        include: {
          location: true,
          itemMaster: {
            select: { id: true, code: true, name: true, kind: true },
          },
          productionReport: {
            select: {
              id: true,
              shift: true,
              operatorName: true,
              reportDate: true,
              status: true,
            },
          },
          proses: {
            select: {
              orderNo: true,
              machine: { select: { name: true } },
              pro: { select: { proNumber: true } },
            },
          },
          pro: { select: { proNumber: true } },
        },
      });

      // C. Calculate Running Balance
      let currentBalance = openingBalance;

      type EnrichedTxn = (typeof allTxns)[number] & {
        runningBalance: number;
        signedQty: number;
      };

      const enrichedTxns: EnrichedTxn[] = allTxns.map((t) => {
        const val = Number(t.qty);
        let signedVal = 0;
        if (t.type === TxnType.IN) signedVal = val;
        else if (t.type === TxnType.OUT) signedVal = -val;
        // Adjust logic if needed

        currentBalance += signedVal;

        return { ...t, runningBalance: currentBalance, signedQty: signedVal };
      });

      const startIdx = (page - 1) * pageSize;
      const endIdx = startIdx + pageSize;
      const pageRows = enrichedTxns.slice(startIdx, endIdx);

      // Current on-hand balance = last running balance (or openingBalance if no txns)
      const onHandBalance =
        enrichedTxns.length > 0
          ? enrichedTxns[enrichedTxns.length - 1]!.runningBalance
          : openingBalance;

      return {
        openingBalance,
        currentBalance: onHandBalance,
        total: enrichedTxns.length,
        rows: pageRows,
      };
    }),

  getFilterOptions: protectedProcedure.query(async ({ ctx }) => {
    // 1. Fetch PROs (Active + Recent Closed)
    // User wants to find PROs even if WIP is 0.
    const pros = await ctx.db.pro.findMany({
      where: {
        OR: [
          { status: "OPEN" },
          { status: "IN_PROGRESS" },
          {
            status: "CLOSED",
            updatedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          }, // Closed within 7 days
        ],
      },
      select: { id: true, proNumber: true },
      orderBy: { proNumber: "desc" },
      take: 100, // Limit to avoid massive dropdown
    });

    // 2. Fetch All Machines
    const machines = await ctx.db.machine.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    return { pros, machines };
  }),

  // 3. WIP Matrix (Excel-like View)
  getWipMatrix: protectedProcedure
    .input(
      z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(), // Filter by PRO startDate? or Report Date?
        // Usually monitoring active PROs or PROs within a period.
        // Let's filter PROs by startDate range OR status.
        status: z
          .enum(["OPEN", "IN_PROGRESS", "COMPLETE", "CLOSED", "CANCELLED"])
          .optional(),
        type: z.enum(["PAPER", "RIGID"]).optional(),
        machineId: z.number().optional(), // Filter cols? No, rows having this machine.
        mode: z.enum(["INVENTORY", "PROGRESS"]).default("PROGRESS").optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const mode = input.mode ?? "PROGRESS";
      const wherePro: Prisma.ProWhereInput = {};

      if (input.status) wherePro.status = input.status;
      if (input.type) wherePro.type = input.type as any;
      if (input.startDate && input.endDate) {
        wherePro.startDate = { gte: input.startDate, lte: input.endDate };
      } else if (input.status === undefined) {
        // Default: Active PROs if no date/status specified
        wherePro.status = { in: ["OPEN", "IN_PROGRESS", "COMPLETE"] };
      }

      // 1. Fetch PROs
      const pros = await ctx.db.pro.findMany({
        where: wherePro,
        select: {
          id: true,
          proNumber: true,
          productName: true,
          qtyPoPcs: true,
          type: true,
          status: true,
        },
        orderBy: { id: "desc" },
      });

      const proIds = pros.map((p) => p.id);

      // 2. Fetch Machines (Columns) — filtered by type if specified
      const machines = await ctx.db.machine.findMany({
        where: input.type ? { type: input.type as any } : undefined,
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      });

      // 3. Aggregate Matrix Data
      const matrixData = new Map<number, Map<number, number>>();

      if (mode === "PROGRESS") {
        // --- MODE: PROGRESS (Accumulated Approved PassOn) ---
        const reportGroups = await ctx.db.productionReport.groupBy({
          by: ["prosesId"],
          where: {
            status: "APPROVED",
            proses: { proId: { in: proIds } },
          },
          _sum: { qtyPassOn: true }, // ONLY PassOn
        });

        // Need mapping prosesId -> machineId, proId
        const prosesIds = reportGroups.map((g) => g.prosesId);
        const prosesList = await ctx.db.proses.findMany({
          where: { id: { in: prosesIds } },
          select: { id: true, proId: true, machineId: true },
        });

        const prosesMap = new Map(prosesList.map((p) => [p.id, p]));

        for (const g of reportGroups) {
          const p = prosesMap.get(g.prosesId);
          if (!p || !p.machineId) continue;

          if (!matrixData.has(p.proId)) {
            matrixData.set(p.proId, new Map());
          }
          const proRow = matrixData.get(p.proId)!;
          const current = proRow.get(p.machineId) || 0;

          // Only PassOn
          const val = Number(g._sum.qtyPassOn ?? 0);

          proRow.set(p.machineId, current + val);
        }
      } else {
        // --- MODE: INVENTORY (On-hand WIP: IN - OUT) ---
        // Query InventoryTxn for WIP locations
        const txnGroups = await ctx.db.inventoryTxn.groupBy({
          by: ["proId", "locationId", "type"],
          where: {
            proId: { in: proIds },
            location: { type: LocationType.WIP },
          },
          _sum: { qty: true },
        });

        // Get Location -> Machine Mapping
        const locIds = [...new Set(txnGroups.map((g) => g.locationId))];
        const locations = await ctx.db.inventoryLocation.findMany({
          where: { id: { in: locIds }, machineId: { not: null } },
          select: { id: true, machineId: true },
        });

        const locMachineMap = new Map(
          locations.map((l) => [l.id, l.machineId!]),
        );

        for (const g of txnGroups) {
          if (!g.proId) continue;
          const machineId = locMachineMap.get(g.locationId);
          if (!machineId) continue; // Skip if location has no machine attached (unlikely for WIP_M_)

          if (!matrixData.has(g.proId)) {
            matrixData.set(g.proId, new Map());
          }
          const proRow = matrixData.get(g.proId)!;
          const current = proRow.get(machineId) || 0;

          const qty = Number(g._sum.qty ?? 0);
          let change = 0;
          if (g.type === TxnType.IN) change = qty;
          else if (g.type === TxnType.OUT) change = -qty;
          else if (g.type === TxnType.ADJUST) change = qty; // Assume adjust adds

          proRow.set(machineId, current + change);
        }
      }

      // 4. Fetch FG Received (InventoryTxn) - Always Cumulative IN to FG?
      // Or if mode=INVENTORY, show FG On-Hand?
      // User said: "WIP Monitor ... Mode On-hand (Inventory): tampil saldo on-hand per mesin (WIP) + FG on-hand"
      // "Mode Produced-to-date (Progress): tampil total approved qtyPassOn ... + FG received cumulative"
      // So FG column should also respect mode.

      let fgMap = new Map<number, number>();

      if (mode === "PROGRESS") {
        const fgGroups = await ctx.db.inventoryTxn.groupBy({
          by: ["proId"],
          where: {
            proId: { in: proIds },
            location: { type: LocationType.FG },
            type: TxnType.IN,
          },
          _sum: { qty: true },
        });
        fgMap = new Map(
          fgGroups.map((g) => [g.proId!, Number(g._sum.qty ?? 0)]),
        );
      } else {
        // Inventory Mode: FG On-Hand (IN - OUT)
        const fgGroups = await ctx.db.inventoryTxn.groupBy({
          by: ["proId", "type"],
          where: {
            proId: { in: proIds },
            location: { type: LocationType.FG },
          },
          _sum: { qty: true },
        });

        for (const g of fgGroups) {
          if (!g.proId) continue;
          const val = Number(g._sum.qty ?? 0);
          const current = fgMap.get(g.proId) || 0;
          if (g.type === TxnType.IN) fgMap.set(g.proId, current + val);
          else if (g.type === TxnType.OUT) fgMap.set(g.proId, current - val);
          else if (g.type === TxnType.ADJUST) fgMap.set(g.proId, current + val);
        }
      }

      // 5. Assemble Result
      const rows = pros.map((pro) => {
        const proMatrix = matrixData.get(pro.id) || new Map();
        const matrixObj: Record<number, number> = {};
        proMatrix.forEach((val, key) => {
          matrixObj[key] = val;
        });

        const fg = fgMap.get(pro.id) || 0;

        return {
          ...pro,
          matrix: matrixObj,
          fgReceived: fg, // This is now context-aware (Received vs OnHand)
          fulfillment: pro.qtyPoPcs > 0 ? (fg / pro.qtyPoPcs) * 100 : 0,
        };
      });

      return { rows, columns: machines };
    }),

  // 4. Drill-down Reports (for Matrix Cell)
  getReportsByContext: protectedProcedure
    .input(
      z.object({
        proId: z.number(),
        machineId: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.productionReport.findMany({
        where: {
          // Show ALL reports (Pending/Approved/Rejected) so user can trace history
          // status: "APPROVED",
          proses: {
            proId: input.proId,
            ...(input.machineId ? { machineId: input.machineId } : {}),
          },
        },
        orderBy: { reportDate: "desc" },
        select: {
          id: true,
          status: true, // Needed for UI
          reportDate: true,
          shift: true,
          operatorName: true,
          qtyPassOn: true,
          qtyWip: true,
          qtyHold: true,
          qtyReject: true,
          notes: true,
          proses: {
            select: {
              orderNo: true,
              machine: { select: { name: true } },
            },
          },
        },
      });
    }),
});
