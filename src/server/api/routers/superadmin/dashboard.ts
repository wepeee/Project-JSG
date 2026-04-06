import { z } from "zod";
import { LphType } from "../../../../../generated/prisma";

import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const dashboardRouter = createTRPCRouter({
  getStats: protectedProcedure
    .input(
      z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        department: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const startDate =
        input.startDate ??
        new Date(new Date().setMonth(new Date().getMonth() - 1));
      const endDate = input.endDate ?? new Date();
      // Ensure the filter covers the whole day
      endDate.setHours(23, 59, 59);

      const whereClause: any = {
        reportDate: {
          gte: startDate,
          lte: endDate,
        },
      };

      if (input.department) {
        if (input.department === "PAPER") {
          whereClause.reportType = LphType.PAPER;
        } else if (input.department === "RIGID") {
          whereClause.reportType = {
            in: [
              LphType.INJECTION,
              LphType.BLOW_MOULDING,
              LphType.PRINTING,
              LphType.PACKING_ASSEMBLY,
            ],
          };
        }
      }

      // 1. Fetch REPORTS (for Rejects & Downtime)
      const reports = await ctx.db.productionReport.findMany({
        where: whereClause,
        select: {
          reportDate: true,
          qtyReject: true,
          totalDowntime: true,
          downtimeBreakdown: true,
          rejectBreakdown: true,
        },
        orderBy: {
          reportDate: "asc",
        },
      });

      // 2. Fetch INVENTORY (for Verified Good Output / FG)
      const invWhere: any = {
        date: {
          gte: startDate,
          lte: endDate,
        },
        type: "IN",
        location: {
          type: "FG",
        },
      };

      if (input.department) {
        if (input.department === "PAPER") {
          invWhere.pro = { type: "PAPER" };
        } else if (input.department === "RIGID") {
          invWhere.pro = { type: { not: "PAPER" } };
        }
      }

      const fgTxns = await ctx.db.inventoryTxn.findMany({
        where: invWhere,
        select: {
          date: true,
          qty: true,
        },
      });

      // 0. Constants
      // ──────────────────────────────────────────────────────────────────
      // Klasifikasi downtime sesuai format laporan perusahaan (Excel)
      // PLANNED: ISTIRAHAT, TROUBLE PLN, TRIAL, PREVENTIVE MAINTENANCE
      // UNPLANNED: Operator Issue, Tunggu Approval, Tunggu Material,
      //            Machine Problem, Set Up/Change Over, Mencari Tools,
      //            Adjustment Process, Machine RunIn, dll.
      // ──────────────────────────────────────────────────────────────────
      const PLANNED_KEYWORDS = [
        "ISTIRAHAT",
        "TROUBLE PLN",
        "TROUBLE_PLN",
        "TROUBLEPLN",
        "TRIAL",
        "PREVENTIVE", // covers "PREVENTIVE MAINTENANCE", "PREVENTIVE_MAINTENANCE"
        "PREV MAINTE", // abbreviasi
      ];

      const UNPLANNED_KEYWORDS = [
        "OPERATOR", // "Operator Issue", "OPERATOR_ISSUE"
        "TUNGGU APPROVAL",
        "TUNGGU_APPROVAL",
        "TUNGGU MATERIAL",
        "TUNGGU_MATERIAL",
        "MACHINE PROBLEM",
        "MACHINE_PROBLEM",
        "SET UP", // "Set Up/Change Over", "SETUP_CHANGE_OVER"
        "SETUP", // "SETUP CHANGE OVER"
        "CHANGE OVER",
        "CHANGE_OVER",
        "MENCARI", // "Mencari Tools", "MENCARI_TOOLS"
        "ADJUSTMENT", // "Adjustment Process", "ADJUSTMENT_PROCESS"
        "RUNNING IN",
        "RUNNING_IN",
        "RUN IN",
        "RUNIN",
        "LAIN", // "Lain-lain"
      ];

      // 1. Summary
      let totalGood = 0;
      let totalReject = 0;
      let totalDowntime = 0;
      let totalPlannedDowntime = 0;
      let totalUnplannedDowntime = 0;

      // 2. Maps
      const dailyMap = new Map<string, { good: number; reject: number }>();
      const weeklyMap = new Map<string, { good: number; reject: number }>();
      const weeklyPlannedMap = new Map<string, Record<string, number>>();
      const weeklyUnplannedMap = new Map<string, Record<string, number>>();
      const weekDateMap = new Map<string, Date>();

      const getYearWeekString = (d: Date) => {
        const date = new Date(
          Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()),
        );
        const dayNum = date.getUTCDay() || 7;
        date.setUTCDate(date.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil(
          ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
        );
        return `${date.getUTCFullYear()}-${weekNo.toString().padStart(2, "0")}`;
      };

      // 3. Breakdown Maps
      const downtimeMap = new Map<string, number>();
      const rejectMap = new Map<string, number>();

      // Process Production Reports (Reject & Downtime)
      for (const r of reports) {
        const reject = Number(r.qtyReject);

        totalReject += reject;
        totalDowntime += r.totalDowntime;

        // Daily
        const dateKey = r.reportDate.toISOString().split("T")[0]!;
        const current = dailyMap.get(dateKey) ?? { good: 0, reject: 0 };
        current.reject += reject;
        dailyMap.set(dateKey, current);

        // Weekly
        const weekKey = getYearWeekString(r.reportDate);
        const currentWeek = weeklyMap.get(weekKey) ?? { good: 0, reject: 0 };
        currentWeek.reject += reject;
        weeklyMap.set(weekKey, currentWeek);

        if (!weekDateMap.has(weekKey)) {
          weekDateMap.set(weekKey, r.reportDate);
        }

        // Downtime Breakdown
        if (
          r.downtimeBreakdown &&
          typeof r.downtimeBreakdown === "object" &&
          !Array.isArray(r.downtimeBreakdown)
        ) {
          const breakdown = r.downtimeBreakdown as Record<
            string,
            number | unknown
          >;

          const currentWeekPlanned = weeklyPlannedMap.get(weekKey) ?? {};
          const currentWeekUnplanned = weeklyUnplannedMap.get(weekKey) ?? {};

          for (const [key, val] of Object.entries(breakdown)) {
            const minutes = Number(val);
            if (!isNaN(minutes) && minutes > 0) {
              downtimeMap.set(key, (downtimeMap.get(key) ?? 0) + minutes);

              // Key bisa berupa: "PLANNED:ISTIRAHAT", "UNPLANNED:TUNGGU APPROVAL",
              // atau tanpa prefix: "ISTIRAHAT", "TUNGGU_APPROVAL"
              const keyUpper = key.toUpperCase();
              const isPlanned =
                keyUpper.startsWith("PLANNED:") ||
                PLANNED_KEYWORDS.some((pk: string) =>
                  keyUpper.includes(pk.toUpperCase()),
                );
              const isUnplanned =
                keyUpper.startsWith("UNPLANNED:") ||
                UNPLANNED_KEYWORDS.some((uk: string) =>
                  keyUpper.includes(uk.toUpperCase()),
                );

              if (isPlanned && !keyUpper.startsWith("UNPLANNED:")) {
                totalPlannedDowntime += minutes;
                currentWeekPlanned[key] =
                  (currentWeekPlanned[key] ?? 0) + minutes;
              } else if (isUnplanned || keyUpper.startsWith("UNPLANNED:")) {
                totalUnplannedDowntime += minutes;
                currentWeekUnplanned[key] =
                  (currentWeekUnplanned[key] ?? 0) + minutes;
              } else {
                // Tidak dikenali → masukkan ke unplanned sebagai fallback
                totalUnplannedDowntime += minutes;
                currentWeekUnplanned[key] =
                  (currentWeekUnplanned[key] ?? 0) + minutes;
              }
            }
          }
          weeklyPlannedMap.set(weekKey, currentWeekPlanned);
          weeklyUnplannedMap.set(weekKey, currentWeekUnplanned);
        }

        // Reject Breakdown
        if (
          r.rejectBreakdown &&
          typeof r.rejectBreakdown === "object" &&
          !Array.isArray(r.rejectBreakdown)
        ) {
          const breakdown = r.rejectBreakdown as Record<
            string,
            number | unknown
          >;
          for (const [key, val] of Object.entries(breakdown)) {
            const qty = Number(val);
            if (!isNaN(qty)) {
              rejectMap.set(key, (rejectMap.get(key) ?? 0) + qty);
            }
          }
        }
      }

      // Process Inventory Txns (Good Qty)
      for (const txn of fgTxns) {
        const good = Number(txn.qty); // Should be positive for IN
        totalGood += good;

        // Daily
        const dateKey = txn.date.toISOString().split("T")[0]!;
        const current = dailyMap.get(dateKey) ?? { good: 0, reject: 0 };
        current.good += good;
        dailyMap.set(dateKey, current);

        // Weekly
        const weekKey = getYearWeekString(txn.date);
        const currentWeek = weeklyMap.get(weekKey) ?? { good: 0, reject: 0 };
        currentWeek.good += good;
        weeklyMap.set(weekKey, currentWeek);

        if (!weekDateMap.has(weekKey)) {
          weekDateMap.set(weekKey, txn.date);
        }
      }

      // Convert Maps to Arrays (Sorting)
      const dailyProduction = Array.from(dailyMap.entries())
        .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
        .map(([date, val]) => ({
          date,
          good: val.good,
          reject: val.reject,
        }));

      const formatWeekLabel = (weekKey: string) => {
        const date = weekDateMap.get(weekKey);
        if (!date) return weekKey;
        const month = date.toLocaleDateString("id-ID", { month: "long" });
        const year = date.getFullYear();
        const weekNum = weekKey.split("-")[1];
        return `${month} Week ${weekNum} ${year}`;
      };

      const weeklyProduction = Array.from(weeklyMap.entries())
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(([week, val]) => ({
          week: formatWeekLabel(week),
          good: val.good,
          reject: val.reject,
        }));

      const downtimeByType = Array.from(downtimeMap.entries())
        .map(([type, minutes]) => ({
          type,
          minutes,
        }))
        .sort((a, b) => b.minutes - a.minutes);

      const rejectByType = Array.from(rejectMap.entries())
        .map(([type, qty]) => ({
          type,
          qty,
        }))
        .sort((a, b) => b.qty - a.qty);

      return {
        summary: {
          totalGood,
          totalReject,
          totalDowntime,
          totalPlannedDowntime,
          totalUnplannedDowntime,
          totalOutput: totalGood + totalReject,
        },
        dailyProduction,
        weeklyProduction,
        downtimeTypes: downtimeByType,
        rejectTypes: rejectByType,
        weeklyPlanned: Array.from(weeklyPlannedMap.entries())
          .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
          .map(([week, breakdown]) => ({
            week: formatWeekLabel(week),
            ...breakdown,
          })),
        weeklyUnplanned: Array.from(weeklyUnplannedMap.entries())
          .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
          .map(([week, breakdown]) => ({
            week: formatWeekLabel(week),
            ...breakdown,
          })),
      };
    }),

  getRigidMetrics: protectedProcedure
    .input(
      z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        periodType: z
          .enum(["daily", "weekly", "monthly", "yearly"])
          .default("weekly"),
        productId: z.number().optional(), // Optional filter by product
        reportType: z
          .enum([
            "INJECTION",
            "BLOW_MOULDING",
            "PRINTING",
            "PACKING_ASSEMBLY",
          ] as const)
          .optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Calculate date range based on periodType
      let startDate = input.startDate;
      let endDate = input.endDate ?? new Date();
      endDate.setHours(23, 59, 59);
      // Add 7 days buffer to include future test data
      endDate.setDate(endDate.getDate() + 7);

      if (!startDate) {
        switch (input.periodType) {
          case "daily":
            startDate = new Date(endDate);
            startDate.setDate(startDate.getDate() - 1); // Last 1 days
            break;
          case "weekly":
            startDate = new Date(endDate);
            startDate.setDate(startDate.getDate() - 7); // Last 7 days
            break;
          case "monthly":
            startDate = new Date(endDate);
            startDate.setMonth(startDate.getMonth() - 1); // Last 1 months
            break;
          case "yearly":
            startDate = new Date(endDate);
            startDate.setFullYear(startDate.getFullYear() - 1); // Last 1 years
            break;
        }
      }
      startDate.setHours(0, 0, 0);

      console.log(
        "getRigidMetrics - Date range:",
        startDate.toISOString().split("T")[0],
        "to",
        endDate.toISOString().split("T")[0],
        "| periodType:",
        input.periodType,
      );

      // Build where clause for ProductionReport
      const whereClause: any = {
        reportDate: {
          gte: startDate,
          lte: endDate,
        },
        reportType: input.reportType
          ? input.reportType
          : {
              in: [
                "INJECTION",
                "BLOW_MOULDING",
                "PRINTING",
                "PACKING_ASSEMBLY",
              ],
            },
        // Filter by APPROVED status to sync with Daftar Laporan archive
        status: "APPROVED",
      };

      console.log("getRigidMetrics whereClause:", whereClause);

      // Fetch production reports with all info needed for table
      const reports = await ctx.db.productionReport.findMany({
        where: whereClause,
        select: {
          id: true,
          reportDate: true,
          reportType: true,
          qtyPassOn: true,
          qtyReject: true,
          shift: true,
          operatorName: true,
          proses: {
            select: {
              pro: {
                select: {
                  id: true,
                  productName: true,
                  type: true,
                  partNumber: true,
                },
              },
              machine: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          reportDate: "asc",
        },
      });

      console.log(
        `getRigidMetrics found ${reports.length} reports, input.reportType: ${input.reportType}`,
      );

      // Debug: Show first 3 reports structure
      if (reports.length > 0) {
        console.log(
          "Sample reports:",
          reports.slice(0, 3).map((r) => ({
            reportDate: r.reportDate,
            productName: r.proses?.pro?.productName,
            productId: r.proses?.pro?.id,
            reportType: r.reportType,
            qtyPassOn: r.qtyPassOn,
            qtyReject: r.qtyReject,
          })),
        );
      }

      // Debug: Fetch ALL reports in date range (not filtered by reportType) to see what's in DB
      const allReports = await ctx.db.productionReport.findMany({
        where: {
          reportDate: {
            gte: startDate,
            lte: endDate,
          },
          status: "APPROVED",
        },
        select: {
          id: true,
          reportDate: true,
          reportType: true,
          proses: {
            select: {
              pro: {
                select: {
                  id: true,
                  productName: true,
                },
              },
            },
          },
        },
        take: 5,
      });
      console.log(
        "ALL reports in DB (first 5):",
        allReports.map((r) => ({
          reportDate: r.reportDate.toISOString().split("T")[0],
          reportType: r.reportType,
          productName: r.proses?.pro?.productName ?? "NO_PROSES_PRO",
        })),
      );

      // Debug: Get count of all rigid reports in date range for troubleshooting
      const allRigidReports = await ctx.db.productionReport.count({
        where: {
          reportDate: {
            gte: startDate,
            lte: endDate,
          },
          reportType: {
            not: "PAPER",
          },
          status: "APPROVED",
        },
      });
      const reportTypeCounts = await ctx.db.productionReport.groupBy({
        by: ["reportType"],
        where: {
          reportDate: {
            gte: startDate,
            lte: endDate,
          },
          status: "APPROVED",
        },
        _count: true,
      });
      console.log(
        "reportTypeCounts:",
        reportTypeCounts,
        "allRigidReports:",
        allRigidReports,
      );
      // Helper function to get period key based on periodType
      const getPeriodKey = (date: Date, type: string): string => {
        const d = new Date(date);
        switch (type) {
          case "daily":
            return d.toISOString().split("T")[0]!;
          case "weekly": {
            const dateUTC = new Date(
              Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()),
            );
            const dayNum = dateUTC.getUTCDay() || 7;
            dateUTC.setUTCDate(dateUTC.getUTCDate() + 4 - dayNum);
            const yearStart = new Date(
              Date.UTC(dateUTC.getUTCFullYear(), 0, 1),
            );
            const weekNo = Math.ceil(
              ((dateUTC.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
            );
            return `${dateUTC.getUTCFullYear()}-W${weekNo.toString().padStart(2, "0")}`;
          }
          case "monthly":
            return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
          case "yearly":
            return d.getFullYear().toString();
          default:
            return d.toISOString().split("T")[0]!;
        }
      };

      // Return reports as array (per report, not aggregated)
      return {
        reports: reports.map((r) => ({
          id: r.id,
          date: r.reportDate,
          reportType: r.reportType,
          productName:
            r.proses?.pro?.productName || `[${r.reportType}] Generic`,
          partNumber: r.proses?.pro?.partNumber || "-",
          machine: r.proses?.machine?.name || "-",
          shift: r.shift || "-",
          passOn: Number(r.qtyPassOn ?? 0),
          reject: Number(r.qtyReject ?? 0),
          operator: r.operatorName || "-",
        })),
        periodType: input.periodType,
      };
    }),

  // Rigid Dashboard: metrics per produk per minggu
  getRigidDashboard: protectedProcedure
    .input(
      z.object({
        dateRange: z.enum(["7D", "14D", "30D", "3M", "6M", "1Y"]).default("3M"),
        interval: z.enum(["DAY", "WEEK", "MONTH", "YEAR"]).default("WEEK"),
        department: z.enum(["PAPER", "RIGID"]).default("RIGID"),
        reportType: z
          .enum([
            "INJECTION",
            "BLOW_MOULDING",
            "PRINTING",
            "PACKING_ASSEMBLY",
          ] as const)
          .optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Calculate date boundary based on dateRange
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      const startDate = new Date();
      if (input.dateRange === "7D") startDate.setDate(startDate.getDate() - 7);
      else if (input.dateRange === "14D") startDate.setDate(startDate.getDate() - 14);
      else if (input.dateRange === "30D") startDate.setDate(startDate.getDate() - 30);
      else if (input.dateRange === "3M") startDate.setMonth(startDate.getMonth() - 3);
      else if (input.dateRange === "6M") startDate.setMonth(startDate.getMonth() - 6);
      else if (input.dateRange === "1Y") startDate.setFullYear(startDate.getFullYear() - 1);
      startDate.setHours(0, 0, 0, 0);

      const whereClause: any = {
        status: "APPROVED",
        reportDate: { gte: startDate, lte: endDate },
        reportType:
          input.department === "PAPER"
            ? "PAPER"
            : input.reportType
              ? input.reportType
              : {
                  in: [
                    "INJECTION",
                    "BLOW_MOULDING",
                    "PRINTING",
                    "PACKING_ASSEMBLY",
                  ],
                },
      };

      const reports = await ctx.db.productionReport.findMany({
        where: whereClause,
        select: {
          id: true,
          reportDate: true,
          reportType: true,
          qtyPassOn: true,
          qtyHold: true,
          qtyWip: true,
          qtyReject: true,
          metaData: true,
          proses: {
            select: {
              pro: {
                select: { id: true, productName: true },
              },
            },
          },
        },
        orderBy: { reportDate: "asc" },
      });

      // Time key helper
      const getTimeKey = (d: Date, interval: string) => {
        if (interval === "DAY") {
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        }
        if (interval === "MONTH") {
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        }
        if (interval === "YEAR") {
          return `${d.getFullYear()}`;
        }
        // WEEK Default
        const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        const dayNum = date.getUTCDay() || 7;
        date.setUTCDate(date.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
        return `${date.getUTCFullYear()}-W${weekNo.toString().padStart(2, "0")}`;
      };

      const formatLabel = (key: string, date: Date, interval: string) => {
        if (interval === "DAY") {
          return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
        }
        if (interval === "MONTH") {
          return date.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
        }
        if (interval === "YEAR") {
          return date.getFullYear().toString();
        }
        // WEEK Default
        const month = date.toLocaleDateString("id-ID", { month: "short" });
        const weekNum = key.split("-W")[1];
        return `W${weekNum} ${month}`;
      };

      // ─── Same formula as Daftar Laporan ─────────────
      const calcMetrics = (r: typeof reports[0]) => {
        const isMoulding =
          r.reportType === "INJECTION" || r.reportType === "BLOW_MOULDING";
        const passOn = Number(r.qtyPassOn ?? 0);
        const hold = Number(r.qtyHold ?? 0);
        const wip = Number(r.qtyWip ?? 0);
        const rawReject = Number(r.qtyReject ?? 0);

        const pw = Number((r.metaData as any)?.productWeight ?? 0);
        const rejectPcs =
          isMoulding && pw > 0 ? Math.round((rawReject * 1000) / pw) : rawReject;

        const output = passOn + hold + wip + rejectPcs;
        return { passOn, rejectPcs, output };
      };

      // Aggregate: per product per time interval
      type Agg = { output: number; passOn: number; reject: number };
      const aggMap = new Map<string, Agg>();
      // Aggregate: per division per time interval
      const divMap = new Map<string, { output: number; reject: number }>();
      // Collect unique intervals for labeling
      const timeLabelMap = new Map<string, Date>();

      for (const r of reports) {
        const productName = r.proses?.pro?.productName ?? "Unknown";
        // Calculate key dynamically
        const timeKey = getTimeKey(r.reportDate, input.interval);
        const { passOn, rejectPcs, output } = calcMetrics(r);

        if (!timeLabelMap.has(timeKey)) timeLabelMap.set(timeKey, r.reportDate);

        const k = `${productName}||${timeKey}`;
        const cur = aggMap.get(k) ?? { output: 0, passOn: 0, reject: 0 };
        cur.output += output;
        cur.passOn += passOn;
        cur.reject += rejectPcs;
        aggMap.set(k, cur);

        const divCur = divMap.get(timeKey) ?? { output: 0, reject: 0 };
        divCur.output += output;
        divCur.reject += rejectPcs;
        divMap.set(timeKey, divCur);
      }

      // Build sorted time list
      const timeIntervals = Array.from(timeLabelMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, date]) => ({
          key,
          label: formatLabel(key, date, input.interval),
        }));

      // Build per-product per-interval table rows
      const productNames = Array.from(new Set(
        reports.map((r) => r.proses?.pro?.productName ?? "Unknown")
      )).sort();

      const productRows = productNames.map((productName) => {
        const timeData = timeIntervals.map(({ key }) => {
          const k = `${productName}||${key}`;
          const d = aggMap.get(k) ?? { output: 0, passOn: 0, reject: 0 };
          const rejectRate = d.output > 0 ? (d.reject / d.output) * 100 : 0;
          return {
            timeKey: key,
            output: d.output,
            passOn: d.passOn,
            rejectPcs: d.reject,
            rejectRate: parseFloat(rejectRate.toFixed(2)),
          };
        });

        const totOutput = timeData.reduce((s, w) => s + w.output, 0);
        const totPassOn = timeData.reduce((s, w) => s + w.passOn, 0);
        const totReject = timeData.reduce((s, w) => s + w.rejectPcs, 0);
        const totRate = totOutput > 0 ? parseFloat(((totReject / totOutput) * 100).toFixed(2)) : 0;

        return {
          productName,
          timeData,
          totals: { output: totOutput, passOn: totPassOn, rejectPcs: totReject, rejectRate: totRate },
        };
      });

      // Reject rate per divisi per interval
      const divisionRows = timeIntervals.map(({ key, label }) => {
        const d = divMap.get(key) ?? { output: 0, reject: 0 };
        const rejectRate = d.output > 0 ? parseFloat(((d.reject / d.output) * 100).toFixed(2)) : 0;
        return { timeKey: key, label, output: d.output, rejectPcs: d.reject, rejectRate };
      });

      return { timeIntervals, productRows, divisionRows };
    }),
});
