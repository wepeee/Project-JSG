import { z } from "zod";
import { LphType } from "../../../../../generated/prisma";

import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const dashboardRouter = createTRPCRouter({
  getStats: protectedProcedure
    .input(
      z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        department: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const startDate = input.startDate ?? new Date(new Date().setMonth(new Date().getMonth() - 1));
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
          whereClause.reportType = { in: [LphType.INJECTION, LphType.BLOW_MOULDING, LphType.PRINTING, LphType.PACKING_ASSEMBLY] };
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
            type: "FG"
        }
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
              qty: true
          }
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
        "PREVENTIVE",   // covers "PREVENTIVE MAINTENANCE", "PREVENTIVE_MAINTENANCE"
        "PREV MAINTE",  // abbreviasi
      ];

      const UNPLANNED_KEYWORDS = [
        "OPERATOR",       // "Operator Issue", "OPERATOR_ISSUE"
        "TUNGGU APPROVAL",
        "TUNGGU_APPROVAL",
        "TUNGGU MATERIAL",
        "TUNGGU_MATERIAL",
        "MACHINE PROBLEM",
        "MACHINE_PROBLEM",
        "SET UP",         // "Set Up/Change Over", "SETUP_CHANGE_OVER"
        "SETUP",          // "SETUP CHANGE OVER"
        "CHANGE OVER",
        "CHANGE_OVER",
        "MENCARI",        // "Mencari Tools", "MENCARI_TOOLS"
        "ADJUSTMENT",     // "Adjustment Process", "ADJUSTMENT_PROCESS"
        "RUNNING IN",
        "RUNNING_IN",
        "RUN IN",
        "RUNIN",
        "LAIN",           // "Lain-lain"
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
         const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
         const dayNum = date.getUTCDay() || 7;
         date.setUTCDate(date.getUTCDate() + 4 - dayNum);
         const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
         const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
         return `${date.getUTCFullYear()}-${weekNo.toString().padStart(2, '0')}`;
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
        if (r.downtimeBreakdown && typeof r.downtimeBreakdown === 'object' && !Array.isArray(r.downtimeBreakdown)) {
            const breakdown = r.downtimeBreakdown as Record<string, number | unknown>;
            
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
                      PLANNED_KEYWORDS.some((pk: string) => keyUpper.includes(pk.toUpperCase()));
                    const isUnplanned =
                      keyUpper.startsWith("UNPLANNED:") ||
                      UNPLANNED_KEYWORDS.some((uk: string) => keyUpper.includes(uk.toUpperCase()));

                    if (isPlanned && !keyUpper.startsWith("UNPLANNED:")) {
                        totalPlannedDowntime += minutes;
                        currentWeekPlanned[key] = (currentWeekPlanned[key] ?? 0) + minutes;
                    } else if (isUnplanned || keyUpper.startsWith("UNPLANNED:")) {
                        totalUnplannedDowntime += minutes;
                        currentWeekUnplanned[key] = (currentWeekUnplanned[key] ?? 0) + minutes;
                    } else {
                        // Tidak dikenali → masukkan ke unplanned sebagai fallback
                        totalUnplannedDowntime += minutes;
                        currentWeekUnplanned[key] = (currentWeekUnplanned[key] ?? 0) + minutes;
                    }
                }
            }
            weeklyPlannedMap.set(weekKey, currentWeekPlanned);
            weeklyUnplannedMap.set(weekKey, currentWeekUnplanned);
        }

        // Reject Breakdown
        if (r.rejectBreakdown && typeof r.rejectBreakdown === 'object' && !Array.isArray(r.rejectBreakdown)) {
            const breakdown = r.rejectBreakdown as Record<string, number | unknown>;
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
          const weekNum = weekKey.split('-')[1];
          return `${month} Week ${weekNum} ${year}`;
      };

      const weeklyProduction = Array.from(weeklyMap.entries())
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(([week, val]) => ({
            week: formatWeekLabel(week), 
            good: val.good,
            reject: val.reject,
        }));

      const downtimeByType = Array.from(downtimeMap.entries()).map(([type, minutes]) => ({
        type,
        minutes,
      })).sort((a, b) => b.minutes - a.minutes); 

      const rejectByType = Array.from(rejectMap.entries()).map(([type, qty]) => ({
        type,
        qty,
      })).sort((a, b) => b.qty - a.qty);

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
                ...breakdown
            })),
        weeklyUnplanned: Array.from(weeklyUnplannedMap.entries())
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
            .map(([week, breakdown]) => ({
                week: formatWeekLabel(week),
                ...breakdown
            })),
      };
    }),
});
