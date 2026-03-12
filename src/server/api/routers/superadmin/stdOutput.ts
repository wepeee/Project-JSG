import { z } from "zod";
import {
  adminOrSuperAdminProcedure,
  createTRPCRouter,
  superAdminProcedure,
} from "../../trpc";

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
      };

      // Department filter
      if (input?.department === "PAPER") {
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
          shift: true,
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
              machineName: string | null;
              reports: {
                id: string;
                reportDate: Date;
                shift: number;
                startTime: Date;
                endTime: Date;
                totalOutput: number;
                leadtimeHours: number;
                speed: number; // output/hour
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
            machineName: r.proses.machine?.name ?? null,
            reports: [],
            avgSpeed: 0,
          });
        }

        const proEntry = productGroup.proEntries.get(proNumber)!;
        proEntry.reports.push({
          id: r.id,
          reportDate: r.reportDate,
          shift: r.shift,
          startTime: r.startTime,
          endTime: r.endTime,
          totalOutput,
          leadtimeHours,
          speed,
        });

        // Update machine name if not set
        if (!proEntry.machineName && r.proses.machine?.name) {
          proEntry.machineName = r.proses.machine.name;
        }
      }

      // Calculate averages
      const result: {
        productName: string;
        avgSpeed: number;
        manualSpeed: number | null;
        proEntries: {
          proNumber: string;
          proId: number;
          machineName: string | null;
          avgSpeed: number;
          totalOutput: number;
          totalLeadtimeHours: number;
          reportCount: number;
        }[];
      }[] = [];

      for (const [, product] of productMap) {
        let productTotalOutput = 0;
        let productTotalLeadtime = 0;

        const proEntries: typeof result[number]["proEntries"] = [];

        for (const [, pro] of product.proEntries) {
          let proTotalOutput = 0;
          let proTotalLeadtime = 0;

          for (const report of pro.reports) {
            proTotalOutput += report.totalOutput;
            proTotalLeadtime += report.leadtimeHours;
          }

          const proAvgSpeed =
            proTotalLeadtime > 0 ? proTotalOutput / proTotalLeadtime : 0;

          proEntries.push({
            proNumber: pro.proNumber,
            proId: pro.proId,
            machineName: pro.machineName,
            avgSpeed: proAvgSpeed,
            totalOutput: proTotalOutput,
            totalLeadtimeHours: proTotalLeadtime,
            reportCount: pro.reports.length,
          });

          productTotalOutput += proTotalOutput;
          productTotalLeadtime += proTotalLeadtime;
        }

        // Sort PRO entries by proNumber
        proEntries.sort((a, b) => a.proNumber.localeCompare(b.proNumber));

        const productAvgSpeed =
          productTotalLeadtime > 0
            ? productTotalOutput / productTotalLeadtime
            : 0;

        result.push({
          productName: product.productName,
          avgSpeed: productAvgSpeed,
          manualSpeed: product.manualSpeed,
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
        month: z.number().int().min(1).max(12).optional(),
        year: z.number().int().min(2020).max(2100).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const where: any = {
        proses: {
          pro: {
            productName: input.productName,
          },
        },
      };

      if (input.department === "PAPER") {
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

  /**
   * Auto-compute Std Speed for a product and save to each report's metaData.stdSpeed.
   * This is the value used in the verification/reports list columns.
   * Speed = Total Output / Total Leadtime (in minutes, to match verification.ts convention)
   */
  computeAndSaveStdSpeed: superAdminProcedure
    .input(
      z.object({
        productName: z.string(),
        month: z.number().int().min(1).max(12).optional(),
        year: z.number().int().min(2020).max(2100).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Fetch reports with valid startTime & endTime for this product (+ optional month filter)
      const monthWhere: any = {
        startTime: { not: null },
        endTime: { not: null },
        proses: { pro: { productName: input.productName } },
      };
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
        proses: { pro: { productName: input.productName } },
      };
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

