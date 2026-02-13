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

      const reports = await ctx.db.productionReport.findMany({
        where: whereClause,
        select: {
          reportDate: true,
          qtyGood: true,
          qtyReject: true,
          totalDowntime: true,
          downtimeBreakdown: true, // JSON
          rejectBreakdown: true, // JSON
        },
        orderBy: {
          reportDate: "asc",
        },
      });

      // 0. Constants based on User's classification
      // Image 3 (Planned): Tunggu Approval, Tunggu Material, Set Up, Machine Problem, Mencari Tools, Running In, Adj Process, Operator Issue
      // 0. Constants based on User's classification
      const PLANNED_KEYS = [
        "ISTIRAHAT",
        "TROUBLE_PLN",
        "TRIAL",
        "PREVENTIVE_MAINTENANCE",
        "SETUP_CHANGE_OVER" // Moved to Planned based on feedback
      ];

      const UNPLANNED_KEYS = [
        "TUNGGU_APPROVAL",
        "TUNGGU_MATERIAL",
        "MACHINE_PROBLEM",
        "MENCARI_TOOLS",
        "RUNNING_IN",
        "ADJUSTMENT_PROCESS",
        "OPERATOR_ISSUE", 
      ];
      
      // 1. Summary
      let totalGood = 0;
      let totalReject = 0;
      let totalDowntime = 0;
      let totalPlannedDowntime = 0;
      let totalUnplannedDowntime = 0;

      // 2. Daily Production
      const dailyMap = new Map<string, { good: number; reject: number }>();
      const weeklyMap = new Map<string, { good: number; reject: number }>();
      const weeklyPlannedMap = new Map<string, Record<string, number>>();
      const weeklyUnplannedMap = new Map<string, Record<string, number>>();
      const weekDateMap = new Map<string, Date>(); // To store a representative date for the week

      const getYearWeekString = (d: Date) => {
         const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
         const dayNum = date.getUTCDay() || 7;
         date.setUTCDate(date.getUTCDate() + 4 - dayNum);
         const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
         const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
         // Format: YYYY-WW (Sortable)
         return `${date.getUTCFullYear()}-${weekNo.toString().padStart(2, '0')}`;
      };

      // 3. Breakdown Maps
      const downtimeMap = new Map<string, number>();
      const rejectMap = new Map<string, number>();

      for (const r of reports) {
        // Summary
        // handle Decimal to number conversion if necessary
        const good = Number(r.qtyGood);
        const reject = Number(r.qtyReject);
        
        totalGood += good;
        totalReject += reject;
        totalDowntime += r.totalDowntime;

        // Daily
        const dateKey = r.reportDate.toISOString().split("T")[0]!; // YYYY-MM-DD
        const current = dailyMap.get(dateKey) ?? { good: 0, reject: 0 };
        current.good += good;
        current.reject += reject;
        dailyMap.set(dateKey, current);

        // Weekly
        const weekKey = getYearWeekString(r.reportDate);
        const currentWeek = weeklyMap.get(weekKey) ?? { good: 0, reject: 0 };
        currentWeek.good += good;
        currentWeek.reject += reject;
        weeklyMap.set(weekKey, currentWeek);
        // Store the report date as representative if not set or overwrite (doesn't matter much for month if consistent)
        // Better: store the one that generates the week? Or just use current report date.
        // Since we want "Jan Week X", using the actual report date is good.
        if (!weekDateMap.has(weekKey)) {
            weekDateMap.set(weekKey, r.reportDate);
        }

        // Weekly Downtime Breakdown
        if (r.downtimeBreakdown && typeof r.downtimeBreakdown === 'object' && !Array.isArray(r.downtimeBreakdown)) {
            const breakdown = r.downtimeBreakdown as Record<string, number | unknown>;
            
            const currentWeekPlanned = weeklyPlannedMap.get(weekKey) ?? {};
            const currentWeekUnplanned = weeklyUnplannedMap.get(weekKey) ?? {};

            for (const [key, val] of Object.entries(breakdown)) {
                const minutes = Number(val);
                if (!isNaN(minutes)) {
                    if (PLANNED_KEYS.includes(key)) {
                        currentWeekPlanned[key] = (currentWeekPlanned[key] ?? 0) + minutes;
                    } else {
                        // Default to Unplanned for anything else (Unplanned Keys + Unknowns)
                        currentWeekUnplanned[key] = (currentWeekUnplanned[key] ?? 0) + minutes;
                    }
                }
            }
            weeklyPlannedMap.set(weekKey, currentWeekPlanned);
            weeklyUnplannedMap.set(weekKey, currentWeekUnplanned);
        }

        // Downtime Breakdown (Summary)
        if (r.downtimeBreakdown && typeof r.downtimeBreakdown === 'object' && !Array.isArray(r.downtimeBreakdown)) {
          const breakdown = r.downtimeBreakdown as Record<string, number | unknown>;
          for (const [key, val] of Object.entries(breakdown)) {
             const minutes = Number(val);
             if (!isNaN(minutes)) {
                downtimeMap.set(key, (downtimeMap.get(key) ?? 0) + minutes);

                 // Categorize Planned vs Unplanned
                 if (PLANNED_KEYS.includes(key)) {
                     totalPlannedDowntime += minutes;
                 } else {
                     totalUnplannedDowntime += minutes;
                 }
             }
          }
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

      // Convert Maps to Arrays
      const dailyProduction = Array.from(dailyMap.entries()).map(([date, val]) => ({
        date,
        good: val.good,
        reject: val.reject,
      }));

      const formatWeekLabel = (weekKey: string) => {
          const date = weekDateMap.get(weekKey);
          if (!date) return weekKey;
          const month = date.toLocaleDateString("id-ID", { month: "long" }); // Jan, Feb... in ID
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
      })).sort((a, b) => b.minutes - a.minutes); // Descending

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
