import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

// Durasi 1 shift = 7 jam produksi (420 menit), asumsi umum
const SHIFT_MINUTES = 420;
type OeeProType = "PAPER" | "RIGID" | "ALL";

function buildProTypeWhere(proType: OeeProType | undefined) {
  if (proType === "RIGID") return { type: "RIGID" as const };
  if (proType === "ALL") return {};
  return { type: "PAPER" as const };
}

export const oeeRouter = createTRPCRouter({
  getMachineOee: protectedProcedure
    .input(
      z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        machineId: z.number().optional(),
        groupBy: z.enum(["day", "week", "month"]).default("week"),
        proType: z.enum(["PAPER", "RIGID", "ALL"]).default("PAPER"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const endDate = input.endDate ?? new Date();
      const startDate =
        input.startDate ??
        new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      const proWhere = buildProTypeWhere(input.proType);

      const reports = await ctx.db.productionReport.findMany({
        where: {
          status: "APPROVED",
          reportDate: { gte: startDate, lte: endDate },
          proses: {
            pro: proWhere,
            ...(input.machineId ? { machineId: input.machineId } : {}),
          },
        },
        include: {
          proses: {
            include: {
              machine: {
                select: {
                  id: true,
                  name: true,
                  stdOutputPerShift: true,
                },
              },
            },
          },
        },
        orderBy: { reportDate: "asc" },
      });

      // OEE per mesin
      const machineMap = new Map<
        number,
        {
          machineId: number;
          machineName: string;
          stdOutputPerShift: number;
          reports: typeof reports;
        }
      >();

      for (const r of reports) {
        const machine = r.proses.machine;
        if (!machine) continue;
        if (!machineMap.has(machine.id)) {
          machineMap.set(machine.id, {
            machineId: machine.id,
            machineName: machine.name,
            stdOutputPerShift: machine.stdOutputPerShift,
            reports: [],
          });
        }
        machineMap.get(machine.id)!.reports.push(r);
      }

      const machineOee = Array.from(machineMap.values()).map((m) => {
        let totalPlannedMinutes = 0;
        let totalDowntimeMinutes = 0;
        let totalOutput = 0;
        let totalGoodOutput = 0;
        let totalStdOutput = 0;

        for (const r of m.reports) {
          let plannedMinutes = SHIFT_MINUTES;
          if (r.startTime && r.endTime) {
            plannedMinutes = (r.endTime.getTime() - r.startTime.getTime()) / 60000;
          }
          const downtime = Number(r.totalDowntime ?? 0);
          totalPlannedMinutes += plannedMinutes;
          totalDowntimeMinutes += downtime;

          const passOn = Number(r.qtyPassOn ?? 0);
          const hold = Number(r.qtyHold ?? 0);
          const reject = Number(r.qtyReject ?? 0);
          const totalThisReport = passOn + hold + reject;

          totalOutput += totalThisReport;
          totalGoodOutput += passOn;

          const operatingMinutes = Math.max(0, plannedMinutes - downtime);
          const stdForThisReport = (m.stdOutputPerShift / SHIFT_MINUTES) * operatingMinutes;
          totalStdOutput += stdForThisReport;
        }

        const availability = totalPlannedMinutes > 0
          ? Math.max(0, (totalPlannedMinutes - totalDowntimeMinutes) / totalPlannedMinutes) : 0;
        const performance = totalStdOutput > 0 ? Math.min(1, totalOutput / totalStdOutput) : 0;
        const quality = totalOutput > 0 ? totalGoodOutput / totalOutput : 0;
        const oee = availability * performance * quality;

        return {
          machineId: m.machineId,
          machineName: m.machineName,
          availability: Math.round(availability * 10000) / 100,
          performance: Math.round(performance * 10000) / 100,
          quality: Math.round(quality * 10000) / 100,
          oee: Math.round(oee * 10000) / 100,
          totalReports: m.reports.length,
          totalOutput,
          totalGoodOutput,
          totalDowntimeMinutes,
          totalPlannedMinutes,
        };
      });

      // Trend
      const trendMap = new Map<string, {
        plannedMinutes: number; downtimeMinutes: number;
        output: number; goodOutput: number; stdOutput: number; reportCount: number;
      }>();

      for (const r of reports) {
        const machine = r.proses.machine;
        if (!machine) continue;
        const d = r.reportDate;
        let label: string;
        if (input.groupBy === "day") {
          label = d.toISOString().slice(0, 10);
        } else if (input.groupBy === "week") {
          const day = d.getDay() === 0 ? 7 : d.getDay();
          const monday = new Date(d);
          monday.setDate(d.getDate() - day + 1);
          label = `W${monday.toISOString().slice(0, 10)}`;
        } else {
          label = d.toISOString().slice(0, 7);
        }

        if (!trendMap.has(label)) {
          trendMap.set(label, { plannedMinutes: 0, downtimeMinutes: 0, output: 0, goodOutput: 0, stdOutput: 0, reportCount: 0 });
        }
        const bucket = trendMap.get(label)!;

        let plannedMinutes = SHIFT_MINUTES;
        if (r.startTime && r.endTime) plannedMinutes = (r.endTime.getTime() - r.startTime.getTime()) / 60000;
        const downtime = Number(r.totalDowntime ?? 0);
        const passOn = Number(r.qtyPassOn ?? 0);
        const hold = Number(r.qtyHold ?? 0);
        const reject = Number(r.qtyReject ?? 0);
        const total = passOn + hold + reject;
        const operatingMinutes = Math.max(0, plannedMinutes - downtime);
        const stdForReport = (machine.stdOutputPerShift / SHIFT_MINUTES) * operatingMinutes;

        bucket.plannedMinutes += plannedMinutes;
        bucket.downtimeMinutes += downtime;
        bucket.output += total;
        bucket.goodOutput += passOn;
        bucket.stdOutput += stdForReport;
        bucket.reportCount += 1;
      }

      const trend = Array.from(trendMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([label, b]) => {
          const avail = b.plannedMinutes > 0 ? Math.max(0, (b.plannedMinutes - b.downtimeMinutes) / b.plannedMinutes) : 0;
          const perf = b.stdOutput > 0 ? Math.min(1, b.output / b.stdOutput) : 0;
          const qual = b.output > 0 ? b.goodOutput / b.output : 0;
          const oee = avail * perf * qual;

          let displayLabel = label;
          if (input.groupBy === "week") {
            const dateStr = label.slice(1);
            const dt = new Date(dateStr);
            displayLabel = `${String(dt.getDate()).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(2, "0")}`;
          } else if (input.groupBy === "day") {
            const dt = new Date(label);
            displayLabel = `${String(dt.getDate()).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(2, "0")}`;
          } else {
            const [yr, mo] = label.split("-");
            const moNames = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
            displayLabel = `${moNames[Number(mo) - 1]} ${yr?.slice(2)}`;
          }

          return {
            label: displayLabel,
            availability: Math.round(avail * 10000) / 100,
            performance: Math.round(perf * 10000) / 100,
            quality: Math.round(qual * 10000) / 100,
            oee: Math.round(oee * 10000) / 100,
            reportCount: b.reportCount,
          };
        });

      // Summary keseluruhan
      let sumPlanned = 0, sumDown = 0, sumOut = 0, sumGood = 0, sumStd = 0;
      for (const r of reports) {
        const machine = r.proses.machine;
        if (!machine) continue;
        let pm = SHIFT_MINUTES;
        if (r.startTime && r.endTime) pm = (r.endTime.getTime() - r.startTime.getTime()) / 60000;
        const dt = Number(r.totalDowntime ?? 0);
        const po = Number(r.qtyPassOn ?? 0);
        const ho = Number(r.qtyHold ?? 0);
        const re = Number(r.qtyReject ?? 0);
        const tot = po + ho + re;
        const op = Math.max(0, pm - dt);
        sumPlanned += pm; sumDown += dt; sumOut += tot; sumGood += po;
        sumStd += (machine.stdOutputPerShift / SHIFT_MINUTES) * op;
      }
      const sA = sumPlanned > 0 ? Math.max(0, (sumPlanned - sumDown) / sumPlanned) : 0;
      const sP = sumStd > 0 ? Math.min(1, sumOut / sumStd) : 0;
      const sQ = sumOut > 0 ? sumGood / sumOut : 0;

      return {
        summary: {
          availability: Math.round(sA * 10000) / 100,
          performance: Math.round(sP * 10000) / 100,
          quality: Math.round(sQ * 10000) / 100,
          oee: Math.round(sA * sP * sQ * 10000) / 100,
          totalReports: reports.length,
          totalGoodOutput: sumGood,
          totalDowntimeMinutes: sumDown,
        },
        machineOee,
        trend,
      };
    }),

  getRejectBreakdown: protectedProcedure
    .input(z.object({
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      machineId: z.number().optional(),
      proType: z.enum(["PAPER", "RIGID", "ALL"]).default("PAPER"),
    }))
    .query(async ({ ctx, input }) => {
      const endDate = input.endDate ?? new Date();
      const startDate = input.startDate ?? new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      const proWhere = buildProTypeWhere(input.proType);

      const reports = await ctx.db.productionReport.findMany({
        where: {
          status: "APPROVED",
          reportDate: { gte: startDate, lte: endDate },
          proses: {
            pro: proWhere,
            ...(input.machineId ? { machineId: input.machineId } : {}),
          },
        },
        select: { rejectBreakdown: true, qtyReject: true },
      });

      const rejectMap = new Map<string, number>();
      let totalReject = 0;
      for (const r of reports) {
        totalReject += Number(r.qtyReject ?? 0);
        if (r.rejectBreakdown && typeof r.rejectBreakdown === "object") {
          for (const [key, val] of Object.entries(r.rejectBreakdown as Record<string, number>)) {
            rejectMap.set(key, (rejectMap.get(key) ?? 0) + Number(val ?? 0));
          }
        }
      }

      return {
        breakdown: Array.from(rejectMap.entries())
          .map(([reason, qty]) => ({ reason, qty }))
          .sort((a, b) => b.qty - a.qty)
          .slice(0, 10),
        totalReject,
      };
    }),

  getDowntimeBreakdown: protectedProcedure
    .input(z.object({
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      machineId: z.number().optional(),
      proType: z.enum(["PAPER", "RIGID", "ALL"]).default("PAPER"),
    }))
    .query(async ({ ctx, input }) => {
      const endDate = input.endDate ?? new Date();
      const startDate = input.startDate ?? new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      const proWhere = buildProTypeWhere(input.proType);

      const reports = await ctx.db.productionReport.findMany({
        where: {
          status: "APPROVED",
          reportDate: { gte: startDate, lte: endDate },
          proses: {
            pro: proWhere,
            ...(input.machineId ? { machineId: input.machineId } : {}),
          },
        },
        select: { downtimeBreakdown: true, totalDowntime: true },
      });

      const dtMap = new Map<string, number>();
      let totalDowntime = 0;
      for (const r of reports) {
        totalDowntime += Number(r.totalDowntime ?? 0);
        if (r.downtimeBreakdown && typeof r.downtimeBreakdown === "object") {
          for (const [key, val] of Object.entries(r.downtimeBreakdown as Record<string, number>)) {
            dtMap.set(key, (dtMap.get(key) ?? 0) + Number(val ?? 0));
          }
        }
      }

      return {
        breakdown: Array.from(dtMap.entries())
          .map(([reason, minutes]) => ({ reason, minutes }))
          .sort((a, b) => b.minutes - a.minutes)
          .slice(0, 10),
        totalDowntime,
      };
    }),
});
