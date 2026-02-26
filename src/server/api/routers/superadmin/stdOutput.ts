import { z } from "zod";
import { createTRPCRouter, superAdminProcedure } from "../../trpc";

export const stdOutputRouter = createTRPCRouter({
  /**
   * Get all production reports grouped by product name.
   * For each product, calculate average speed across all its PROs.
   * Speed = Total Output / Leadtime (hours)
   * Leadtime = endTime - startTime
   */
  getStdOutput: superAdminProcedure
    .input(
      z
        .object({
          department: z.enum(["PAPER", "RIGID"]).optional(),
          search: z.string().optional(),
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
              manualSpeed: number | null; // from metaData if set
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
          productMap.set(productName, {
            productName,
            proEntries: new Map(),
            avgSpeed: 0,
          });
        }

        const productGroup = productMap.get(productName)!;

        // Get or create PRO entry
        if (!productGroup.proEntries.has(proNumber)) {
          const meta = (r.metaData as any) ?? {};
          productGroup.proEntries.set(proNumber, {
            proNumber,
            proId,
            machineName: r.proses.machine?.name ?? null,
            reports: [],
            avgSpeed: 0,
            manualSpeed: meta.manualStdSpeed
              ? Number(meta.manualStdSpeed)
              : null,
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
        proEntries: {
          proNumber: string;
          proId: number;
          machineName: string | null;
          avgSpeed: number;
          manualSpeed: number | null;
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
            manualSpeed: pro.manualSpeed,
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
          proEntries,
        });
      }

      // Sort by product name
      result.sort((a, b) => a.productName.localeCompare(b.productName));

      return result;
    }),

  /**
   * Update manual speed for a PRO
   * Saves to metaData.manualStdSpeed on all reports of that PRO
   */
  setManualSpeed: superAdminProcedure
    .input(
      z.object({
        proNumber: z.string(),
        manualSpeed: z.number().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Find all reports for this PRO
      const reports = await ctx.db.productionReport.findMany({
        where: {
          proses: {
            pro: {
              proNumber: input.proNumber,
            },
          },
        },
        select: { id: true, metaData: true },
      });

      // Update metaData on each report
      for (const report of reports) {
        const existingMeta = (report.metaData as any) ?? {};
        const newMeta = {
          ...existingMeta,
          manualStdSpeed: input.manualSpeed,
        };

        await ctx.db.productionReport.update({
          where: { id: report.id },
          data: { metaData: newMeta },
        });
      }

      return { success: true, updatedCount: reports.length };
    }),
});
