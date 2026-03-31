import { z } from "zod";
import {
  adminOrSuperAdminProcedure,
  createTRPCRouter,
  superAdminProcedure,
} from "../../trpc";

const stdOutputReportTypeEnum = z.enum([
  "PAPER",
  "INJECTION",
  "BLOW_MOULDING",
  "PRINTING",
  "PACKING_ASSEMBLY",
]);

const HOURS_PER_DAY_PAPER = 24;
const HOURS_PER_DAY_RIGID = 7;
const DAYS_PER_WEEK = 6;

type StdOutputReportType =
  | "PAPER"
  | "INJECTION"
  | "BLOW_MOULDING"
  | "PRINTING"
  | "PACKING_ASSEMBLY";

function calcStdOutputPerHourFromReport(input: {
  reportType: StdOutputReportType;
  cycleTimeStd: number | null;
  cavityStd: number | null;
  metaData: unknown;
}): number | null {
  const meta = (input.metaData as Record<string, unknown> | null) ?? {};
  const manualPerHour = Number(meta.productManualStdSpeed ?? 0);
  const legacyPerMinute = Number(meta.stdSpeed ?? 0);

  if (input.reportType === "PAPER") {
    if (manualPerHour > 0) return manualPerHour;
    if (legacyPerMinute > 0) return legacyPerMinute * 60;
    return null;
  }

  const ct = input.cycleTimeStd ?? 0;
  if (ct <= 0) return null;

  if (
    input.reportType === "INJECTION" ||
    input.reportType === "BLOW_MOULDING"
  ) {
    const cav = input.cavityStd ?? 0;
    if (cav <= 0) return null;
    return (3600 / ct) * cav;
  }

  // PRINTING / PACKING_ASSEMBLY use efficiency factor 0.8 (same as archive page)
  return (3600 / ct) * 0.8;
}

export const stdOutputRouter = createTRPCRouter({
  /**
   * Get all production reports grouped by product name.
   * For each product, calculate average speed across all its PROs.
   * Speed = Total Output / Leadtime (hours)
   * Leadtime = endTime - startTime
   */
  getStdOutput: adminOrSuperAdminProcedure
    .input(
      z
        .object({
          department: z.enum(["PAPER", "RIGID"]).optional(),
          reportType: stdOutputReportTypeEnum.optional(),
          search: z.string().optional(),
          month: z.number().int().min(1).max(12).optional(), // 1-12
          year: z.number().int().min(2020).max(2100).optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      // Build where clause
      const where: any = {
        startTime: { not: null },
        endTime: { not: null },
        status: "APPROVED",
      };

      // Report type / Department filter
      if (input?.reportType) {
        where.reportType = input.reportType;
      } else if (input?.department === "PAPER") {
        where.reportType = "PAPER";
      } else if (input?.department === "RIGID") {
        where.reportType = { not: "PAPER" };
      }

      // Month/Year filter
      if (input?.month && input?.year) {
        const start = new Date(input.year, input.month - 1, 1);
        const end = new Date(input.year, input.month, 0, 23, 59, 59, 999);
        where.reportDate = { gte: start, lte: end };
      }

      // Search filter
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

      const reports = await ctx.db.productionReport.findMany({
        where,
        orderBy: { reportDate: "desc" },
        select: {
          id: true,
          reportDate: true,
          startTime: true,
          endTime: true,
          qtyPassOn: true,
          qtyWip: true,
          qtyHold: true,
          qtyReject: true,
          reportType: true,
          shift: true,
          manPowerStd: true,
          manPowerAct: true,
          cavityStd: true,
          cycleTimeStd: true,
          metaData: true,
          proses: {
            select: {
              id: true,
              orderNo: true,
              pro: {
                select: {
                  id: true,
                  proNumber: true,
                  productName: true,
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
      });

      // Group by productName
      const productMap = new Map<
        string,
        {
          productName: string;
          manualSpeed: number | null;
          proEntries: Map<
            string,
            {
              proNumber: string;
              proId: number;
              reportType: StdOutputReportType;
              machineName: string | null;
              reports: {
                id: string;
                reportDate: Date;
                shift: number;
                startTime: Date;
                endTime: Date;
                reportType: StdOutputReportType;
                totalOutput: number;
                leadtimeHours: number;
                speed: number; // output/hour
                cycleTimeStd: number | null;
                cavityStd: number | null;
                manPowerStd: number | null;
                manPowerAct: number | null;
                stdOutputPerHourCalc: number | null;
              }[];
              avgSpeed: number;
            }
          >;
          avgSpeed: number;
        }
      >();

      for (const r of reports) {
        if (!r.startTime || !r.endTime) continue;

        const productName = r.proses.pro.productName;
        const proNumber = r.proses.pro.proNumber;
        const proId = r.proses.pro.id;

        const start = r.startTime.getTime();
        const end = r.endTime.getTime();
        const leadtimeHours = (end - start) / (1000 * 60 * 60);

        if (leadtimeHours <= 0) continue;

        const totalOutput =
          Number(r.qtyPassOn || 0) +
          Number(r.qtyWip || 0) +
          Number(r.qtyHold || 0);

        const speed = totalOutput / leadtimeHours;

        // Get or create product group
        if (!productMap.has(productName)) {
          // Check if any report has manualStdSpeed for this product
          const meta = (r.metaData as any) ?? {};
          productMap.set(productName, {
            productName,
            manualSpeed: meta.productManualStdSpeed
              ? Number(meta.productManualStdSpeed)
              : null,
            proEntries: new Map(),
            avgSpeed: 0,
          });
        }

        const productGroup = productMap.get(productName)!;

        // Update manualSpeed from first report that has it
        if (productGroup.manualSpeed === null) {
          const meta = (r.metaData as any) ?? {};
          if (meta.productManualStdSpeed) {
            productGroup.manualSpeed = Number(meta.productManualStdSpeed);
          }
        }

        // Get or create PRO entry
        if (!productGroup.proEntries.has(proNumber)) {
          productGroup.proEntries.set(proNumber, {
            proNumber,
            proId,
            reportType: r.reportType,
            machineName: r.proses.machine?.name ?? null,
            reports: [],
            avgSpeed: 0,
          });
        }

        const proEntry = productGroup.proEntries.get(proNumber)!;
        const cycleTimeStd = r.cycleTimeStd ? Number(r.cycleTimeStd) : null;
        const cavityStd = r.cavityStd ? Number(r.cavityStd) : null;
        const manPowerStd = r.manPowerStd ? Number(r.manPowerStd) : null;
        const manPowerAct = r.manPowerAct ? Number(r.manPowerAct) : null;
        const stdOutputPerHourCalc = calcStdOutputPerHourFromReport({
          reportType: r.reportType,
          cycleTimeStd,
          cavityStd,
          metaData: r.metaData,
        });

        proEntry.reports.push({
          id: r.id,
          reportDate: r.reportDate,
          shift: r.shift,
          startTime: r.startTime,
          endTime: r.endTime,
          reportType: r.reportType,
          totalOutput,
          leadtimeHours,
          speed,
          cycleTimeStd,
          cavityStd,
          manPowerStd,
          manPowerAct,
          stdOutputPerHourCalc,
        });

        // Update machine name if not set
        if (!proEntry.machineName && r.proses.machine?.name) {
          proEntry.machineName = r.proses.machine.name;
        }
      }

      // Calculate averages
      const result: {
        productName: string;
        reportType: StdOutputReportType | null;
        avgSpeed: number;
        manualSpeed: number | null;
        avgCycleTimeStd: number | null;
        avgCavityStd: number | null;
        avgManPowerStd: number | null;
        avgManPowerAct: number | null;
        calculatedStdPerHour: number | null;
        calculatedStdPerDay: number | null;
        calculatedStdPerWeek: number | null;
        proEntries: {
          proNumber: string;
          proId: number;
          reportType: StdOutputReportType;
          machineName: string | null;
          avgSpeed: number;
          totalOutput: number;
          totalLeadtimeHours: number;
          reportCount: number;
          avgCycleTimeStd: number | null;
          avgCavityStd: number | null;
          avgManPowerStd: number | null;
          avgManPowerAct: number | null;
          calculatedStdPerHour: number | null;
          calculatedStdPerDay: number | null;
          calculatedStdPerWeek: number | null;
        }[];
      }[] = [];

      for (const [, product] of productMap) {
        let productTotalOutput = 0;
        let productTotalLeadtime = 0;
        let productCtSum = 0;
        let productCtCount = 0;
        let productCavitySum = 0;
        let productCavityCount = 0;
        let productMpStdSum = 0;
        let productMpStdCount = 0;
        let productMpActSum = 0;
        let productMpActCount = 0;
        let productCalcStdSum = 0;
        let productCalcStdCount = 0;
        let productReportType: StdOutputReportType | null = null;

        const proEntries: typeof result[number]["proEntries"] = [];

        for (const [, pro] of product.proEntries) {
          let proTotalOutput = 0;
          let proTotalLeadtime = 0;
          let proCtSum = 0;
          let proCtCount = 0;
          let proCavitySum = 0;
          let proCavityCount = 0;
          let proMpStdSum = 0;
          let proMpStdCount = 0;
          let proMpActSum = 0;
          let proMpActCount = 0;
          let proCalcStdSum = 0;
          let proCalcStdCount = 0;

          for (const report of pro.reports) {
            proTotalOutput += report.totalOutput;
            proTotalLeadtime += report.leadtimeHours;

            if (report.cycleTimeStd && report.cycleTimeStd > 0) {
              proCtSum += report.cycleTimeStd;
              proCtCount += 1;
            }
            if (report.cavityStd && report.cavityStd > 0) {
              proCavitySum += report.cavityStd;
              proCavityCount += 1;
            }
            if (report.manPowerStd && report.manPowerStd > 0) {
              proMpStdSum += report.manPowerStd;
              proMpStdCount += 1;
            }
            if (report.manPowerAct && report.manPowerAct > 0) {
              proMpActSum += report.manPowerAct;
              proMpActCount += 1;
            }
            if (report.stdOutputPerHourCalc && report.stdOutputPerHourCalc > 0) {
              proCalcStdSum += report.stdOutputPerHourCalc;
              proCalcStdCount += 1;
            }
          }

          const proAvgSpeed =
            proTotalLeadtime > 0 ? proTotalOutput / proTotalLeadtime : 0;
          const proAvgCtStd = proCtCount > 0 ? proCtSum / proCtCount : null;
          const proAvgCavityStd =
            proCavityCount > 0 ? proCavitySum / proCavityCount : null;
          const proAvgMpStd = proMpStdCount > 0 ? proMpStdSum / proMpStdCount : null;
          const proAvgMpAct = proMpActCount > 0 ? proMpActSum / proMpActCount : null;
          const proCalcStdPerHour =
            proCalcStdCount > 0 ? proCalcStdSum / proCalcStdCount : null;

          const hoursPerDayPro = pro.reportType === "PAPER" ? HOURS_PER_DAY_PAPER : HOURS_PER_DAY_RIGID;

          proEntries.push({
            proNumber: pro.proNumber,
            proId: pro.proId,
            reportType: pro.reportType,
            machineName: pro.machineName,
            avgSpeed: proAvgSpeed,
            totalOutput: proTotalOutput,
            totalLeadtimeHours: proTotalLeadtime,
            reportCount: pro.reports.length,
            avgCycleTimeStd: proAvgCtStd,
            avgCavityStd: proAvgCavityStd,
            avgManPowerStd: proAvgMpStd,
            avgManPowerAct: proAvgMpAct,
            calculatedStdPerHour: proCalcStdPerHour,
            calculatedStdPerDay:
              proCalcStdPerHour !== null ? proCalcStdPerHour * hoursPerDayPro : null,
            calculatedStdPerWeek:
              proCalcStdPerHour !== null
                ? proCalcStdPerHour * hoursPerDayPro * DAYS_PER_WEEK
                : null,
          });

          productTotalOutput += proTotalOutput;
          productTotalLeadtime += proTotalLeadtime;
          productCtSum += proCtSum;
          productCtCount += proCtCount;
          productCavitySum += proCavitySum;
          productCavityCount += proCavityCount;
          productMpStdSum += proMpStdSum;
          productMpStdCount += proMpStdCount;
          productMpActSum += proMpActSum;
          productMpActCount += proMpActCount;
          productCalcStdSum += proCalcStdSum;
          productCalcStdCount += proCalcStdCount;
          if (!productReportType) productReportType = pro.reportType;
        }

        // Sort PRO entries by proNumber
        proEntries.sort((a, b) => a.proNumber.localeCompare(b.proNumber));

        const productAvgSpeed =
          productTotalLeadtime > 0
            ? productTotalOutput / productTotalLeadtime
            : 0;
        const productAvgCtStd =
          productCtCount > 0 ? productCtSum / productCtCount : null;
        const productAvgCavityStd =
          productCavityCount > 0 ? productCavitySum / productCavityCount : null;
        const productAvgMpStd =
          productMpStdCount > 0 ? productMpStdSum / productMpStdCount : null;
        const productAvgMpAct =
          productMpActCount > 0 ? productMpActSum / productMpActCount : null;
        const productCalcStdPerHour =
          productCalcStdCount > 0 ? productCalcStdSum / productCalcStdCount : null;

        const hoursPerDay = productReportType === "PAPER" ? HOURS_PER_DAY_PAPER : HOURS_PER_DAY_RIGID;

        result.push({
          productName: product.productName,
          reportType: productReportType,
          avgSpeed: productAvgSpeed,
          manualSpeed: product.manualSpeed,
          avgCycleTimeStd: productAvgCtStd,
          avgCavityStd: productAvgCavityStd,
          avgManPowerStd: productAvgMpStd,
          avgManPowerAct: productAvgMpAct,
          calculatedStdPerHour: productCalcStdPerHour,
          calculatedStdPerDay:
            productCalcStdPerHour !== null
              ? productCalcStdPerHour * hoursPerDay
              : null,
          calculatedStdPerWeek:
            productCalcStdPerHour !== null
              ? productCalcStdPerHour * hoursPerDay * DAYS_PER_WEEK
              : null,
          proEntries,
        });
      }

      // Sort by product name
      result.sort((a, b) => a.productName.localeCompare(b.productName));

      return result;
    }),

  /**
   * Update manual speed for a PRODUCT (by product name)
   * Saves to metaData.productManualStdSpeed scoped by filters (department/month/year when provided)
   */
  setManualSpeed: superAdminProcedure
    .input(
      z.object({
        productName: z.string(),
        manualSpeed: z.number().nullable(),
        department: z.enum(["PAPER", "RIGID"]).optional(),
        reportType: stdOutputReportTypeEnum.optional(),
        month: z.number().int().min(1).max(12).optional(),
        year: z.number().int().min(2020).max(2100).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const where: any = {
        status: "APPROVED",
        proses: {
          pro: {
            productName: input.productName,
          },
        },
      };

      if (input.reportType) {
        where.reportType = input.reportType;
      } else if (input.department === "PAPER") {
        where.reportType = "PAPER";
      } else if (input.department === "RIGID") {
        where.reportType = { not: "PAPER" };
      }

      if (input.month && input.year) {
        const start = new Date(input.year, input.month - 1, 1);
        const end = new Date(input.year, input.month, 0, 23, 59, 59, 999);
        where.reportDate = { gte: start, lte: end };
      }

      // Find all reports for this product name
      const reports = await ctx.db.productionReport.findMany({
        where,
        select: { id: true, metaData: true },
      });

      // Update metaData on each report
      for (const report of reports) {
        const existingMeta = (report.metaData as any) ?? {};
        const newMeta = {
          ...existingMeta,
          productManualStdSpeed: input.manualSpeed,
          // Also update stdSpeed (per-minute) for the archive list
          stdSpeed: input.manualSpeed !== null ? input.manualSpeed / 60 : null,
        };

        await ctx.db.productionReport.update({
          where: { id: report.id },
          data: { metaData: newMeta },
        });
      }

      return { success: true, updatedCount: reports.length };
    }),

  setProductStandards: superAdminProcedure
    .input(
      z.object({
        productName: z.string(),
        reportType: stdOutputReportTypeEnum,
        month: z.number().int().min(1).max(12).optional(),
        year: z.number().int().min(2020).max(2100).optional(),
        manPowerStd: z.number().positive().nullable().optional(),
        cavityStd: z.number().int().positive().nullable().optional(),
        cycleTimeStd: z.number().positive().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const where: any = {
        status: "APPROVED",
        reportType: input.reportType,
        proses: {
          pro: {
            productName: input.productName,
          },
        },
      };

      if (input.month && input.year) {
        const start = new Date(input.year, input.month - 1, 1);
        const end = new Date(input.year, input.month, 0, 23, 59, 59, 999);
        where.reportDate = { gte: start, lte: end };
      }

      const data: Record<string, unknown> = {};
      if (input.manPowerStd !== undefined) data.manPowerStd = input.manPowerStd;
      if (input.cavityStd !== undefined) data.cavityStd = input.cavityStd;
      if (input.cycleTimeStd !== undefined) data.cycleTimeStd = input.cycleTimeStd;

      if (Object.keys(data).length === 0) {
        return { success: false, updatedCount: 0 };
      }

      const result = await ctx.db.productionReport.updateMany({
        where,
        data,
      });

      return { success: true, updatedCount: result.count };
    }),

  setProStandards: superAdminProcedure
    .input(
      z.object({
        proId: z.number().int().positive(),
        reportType: stdOutputReportTypeEnum,
        month: z.number().int().min(1).max(12).optional(),
        year: z.number().int().min(2020).max(2100).optional(),
        manPowerStd: z.number().positive().nullable().optional(),
        cavityStd: z.number().int().positive().nullable().optional(),
        cycleTimeStd: z.number().positive().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const where: any = {
        status: "APPROVED",
        reportType: input.reportType,
        proses: {
          proId: input.proId,
        },
      };

      if (input.month && input.year) {
        const start = new Date(input.year, input.month - 1, 1);
        const end = new Date(input.year, input.month, 0, 23, 59, 59, 999);
        where.reportDate = { gte: start, lte: end };
      }

      const data: Record<string, unknown> = {};
      if (input.manPowerStd !== undefined) data.manPowerStd = input.manPowerStd;
      if (input.cavityStd !== undefined) data.cavityStd = input.cavityStd;
      if (input.cycleTimeStd !== undefined) data.cycleTimeStd = input.cycleTimeStd;

      if (Object.keys(data).length === 0) {
        return { success: false, updatedCount: 0 };
      }

      const targetReports = await ctx.db.productionReport.findMany({
        where,
        select: { id: true },
      });
      if (targetReports.length === 0) {
        return { success: false, updatedCount: 0 };
      }

      const result = await ctx.db.productionReport.updateMany({
        where: { id: { in: targetReports.map((r) => r.id) } },
        data,
      });

      return { success: true, updatedCount: result.count };
    }),

  /**
   * Auto-compute Std Speed for a product and save to each report's metaData.stdSpeed.
   * This is the value used in the verification/reports list columns.
   * Speed = Total Output / Total Leadtime (in minutes, to match verification.ts convention)
   */
  computeAndSaveStdSpeed: superAdminProcedure
    .input(
      z.object({
        productName: z.string(),
        reportType: stdOutputReportTypeEnum.optional(),
        month: z.number().int().min(1).max(12).optional(),
        year: z.number().int().min(2020).max(2100).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Fetch reports with valid startTime & endTime for this product (+ optional month filter)
      const monthWhere: any = {
        startTime: { not: null },
        endTime: { not: null },
        status: "APPROVED",
        proses: { pro: { productName: input.productName } },
      };
      if (input.reportType) {
        monthWhere.reportType = input.reportType;
      }
      if (input.month && input.year) {
        const start = new Date(input.year, input.month - 1, 1);
        const end = new Date(input.year, input.month, 0, 23, 59, 59, 999);
        monthWhere.reportDate = { gte: start, lte: end };
      }

      const allReports = await ctx.db.productionReport.findMany({
        where: monthWhere,
        select: {
          id: true,
          metaData: true,
          qtyPassOn: true,
          qtyWip: true,
          qtyHold: true,
          startTime: true,
          endTime: true,
        },
      });

      if (allReports.length === 0) {
        return { success: false, updatedCount: 0, stdSpeed: null };
      }

      // 2. Compute Std Speed (output / minutes — matches verification.ts convention)
      let totalOutput = 0;
      let totalDurationMinutes = 0;

      for (const r of allReports) {
        if (!r.startTime || !r.endTime) continue;
        const output =
          Number(r.qtyPassOn || 0) +
          Number(r.qtyWip || 0) +
          Number(r.qtyHold || 0);
        const mins =
          (r.endTime.getTime() - r.startTime.getTime()) / (1000 * 60);
        if (mins > 0) {
          totalOutput += output;
          totalDurationMinutes += mins;
        }
      }

      if (totalDurationMinutes <= 0) {
        return { success: false, updatedCount: 0, stdSpeed: null };
      }

      const stdSpeed = totalOutput / totalDurationMinutes;
      const manualSpeedPerHour = stdSpeed * 60;

      // 3. Save stdSpeed and productManualStdSpeed to reports for this product (same month scope)
      const saveWhere: any = {
        status: "APPROVED",
        proses: { pro: { productName: input.productName } },
      };
      if (input.reportType) {
        saveWhere.reportType = input.reportType;
      }
      if (input.month && input.year) {
        const start = new Date(input.year, input.month - 1, 1);
        const end = new Date(input.year, input.month, 0, 23, 59, 59, 999);
        saveWhere.reportDate = { gte: start, lte: end };
      }

      const allProductReports = await ctx.db.productionReport.findMany({
        where: saveWhere,
        select: { id: true, metaData: true },
      });

      for (const report of allProductReports) {
        const existingMeta = (report.metaData as any) ?? {};
        const newMeta = {
          ...existingMeta,
          stdSpeed,
          productManualStdSpeed: manualSpeedPerHour,
        };
        await ctx.db.productionReport.update({
          where: { id: report.id },
          data: { metaData: newMeta },
        });
      }

      return {
        success: true,
        updatedCount: allProductReports.length,
        stdSpeed: manualSpeedPerHour, // Return per-hour for the UI alert
      };
    }),
});

