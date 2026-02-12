import { z } from "zod";
import { createTRPCRouter, superAdminProcedure } from "../../trpc";

// Ensure this path matches where Prisma enums are generated/exported
import { ReportStatus } from "../../../../../generated/prisma";

export const verificationRouter = createTRPCRouter({
  getReports: superAdminProcedure
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
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const where: any = {};

      // 1. Status Filter
      if (input?.status) {
        where.status = input.status;
      }

      // 2. Department Restriction (Security)
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
          step: {
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

      // Calculate Std Speed for PAPER reports (based on Product Name)
      const reportsWithSpeed = await Promise.all(
        reports.map(async (rpt) => {
          // Only calculate for PAPER or if needed. For now, doing it generally or check type.
          // User asked for PAPER context specifically, but logic is general.
          const productName = rpt.step.pro.productName;

          // Optimization: This performs N queries. Ideally we cache or group,
          // but for <50 items it's acceptable for now.
          // Better: Calculate unique products first.

          return {
            ...rpt,
            stdSpeed: 0, // Placeholder, will fill below to avoid async map issues if we refactor
          };
        }),
      );

      // Unique products to fetch stats for
      const uniqueProducts = [
        ...new Set(reports.map((r) => r.step.pro.productName)),
      ];
      const speedMap = new Map<string, number>();

      for (const product of uniqueProducts) {
        // Fetch all approved reports for this product to calculate averages
        const history = await ctx.db.productionReport.findMany({
          where: {
            status: ReportStatus.APPROVED,
            step: {
              pro: {
                productName: product,
              },
            },
            // Ensuring valid times
            startTime: { not: null },
            endTime: { not: null },
          },
          select: {
            qtyGood: true,
            qtyPassOn: true,
            qtyWip: true,
            qtyHold: true,
            startTime: true,
            endTime: true,
          },
        });

        if (history.length > 0) {
          let totalOutputSum = 0;
          let totalDurationMinutesSum = 0;

          history.forEach((h) => {
            const output =
              Number(h.qtyGood || 0) +
              Number(h.qtyPassOn || 0) +
              Number(h.qtyWip || 0) +
              Number(h.qtyHold || 0);

            if (h.startTime && h.endTime) {
              const start = h.startTime.getTime();
              const end = h.endTime.getTime();
              const mins = (end - start) / (1000 * 60);
              if (mins > 0) {
                totalOutputSum += output;
                totalDurationMinutesSum += mins;
              }
            }
          });

          // Avg Output = SumOutput / Count
          // Avg Duration = SumDuration / Count
          // Std Speed = Avg Output / Avg Duration = SumOutput / SumDuration

          if (totalDurationMinutesSum > 0) {
            const stdSpeed = totalOutputSum / totalDurationMinutesSum;
            speedMap.set(product, stdSpeed);
          }
        }
      }

      return reports.map((r) => ({
        ...r,
        stdSpeed: speedMap.get(r.step.pro.productName) ?? null,
      }));
    }),

  approveReport: superAdminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify user exists before setting foreign key
      const userExists = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { id: true },
      });

      const report = await ctx.db.productionReport.update({
        where: { id: input.id },
        data: {
          status: ReportStatus.APPROVED,
          checkedById: userExists ? ctx.session.user.id : null,
          checkedAt: new Date(),
          rejectionNote: null, // Clear any previous rejection note
        },
        select: {
          proStepId: true,
          step: {
            select: {
              pro: {
                select: {
                  id: true,
                  status: true,
                  steps: {
                    select: {
                      id: true,
                      productionReports: {
                        select: {
                          status: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Update PRO status based on all reports
      if (report.step.pro) {
        const pro = report.step.pro;
        const totalSteps = pro.steps.length;
        let stepsWithApprovedReport = 0;
        let stepsWithAnyReport = 0;

        for (const s of pro.steps) {
          const hasAnyReport = s.productionReports.length > 0;
          const hasApprovedReport = s.productionReports.some(
            (r) => r.status === ReportStatus.APPROVED,
          );

          if (hasAnyReport) stepsWithAnyReport++;
          if (hasApprovedReport) stepsWithApprovedReport++;
        }

        let newStatus = pro.status;

        if (totalSteps > 0 && stepsWithApprovedReport >= totalSteps) {
          newStatus = "CLOSED" as any;
        } else if (stepsWithAnyReport > 0) {
          newStatus = "IN_PROGRESS" as any;
        } else {
          newStatus = "OPEN" as any;
        }

        if (newStatus !== pro.status && pro.status !== "CANCELLED") {
          await ctx.db.pro.update({
            where: { id: pro.id },
            data: { status: newStatus },
          });
        }
      }

      return report;
    }),

  rejectReport: superAdminProcedure
    .input(z.object({ id: z.string(), note: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
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
        select: {
          proStepId: true,
          step: {
            select: {
              pro: {
                select: {
                  id: true,
                  status: true,
                  steps: {
                    select: {
                      id: true,
                      productionReports: {
                        select: {
                          status: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Update PRO status based on all reports
      if (report.step.pro) {
        const pro = report.step.pro;
        const totalSteps = pro.steps.length;
        let stepsWithApprovedReport = 0;
        let stepsWithAnyReport = 0;

        for (const s of pro.steps) {
          const hasAnyReport = s.productionReports.length > 0;
          const hasApprovedReport = s.productionReports.some(
            (r) => r.status === ReportStatus.APPROVED,
          );

          if (hasAnyReport) stepsWithAnyReport++;
          if (hasApprovedReport) stepsWithApprovedReport++;
        }

        let newStatus = pro.status;

        if (totalSteps > 0 && stepsWithApprovedReport >= totalSteps) {
          newStatus = "CLOSED" as any;
        } else if (stepsWithAnyReport > 0) {
          newStatus = "IN_PROGRESS" as any;
        } else {
          newStatus = "OPEN" as any;
        }

        if (newStatus !== pro.status && pro.status !== "CANCELLED") {
          await ctx.db.pro.update({
            where: { id: pro.id },
            data: { status: newStatus },
          });
        }
      }

      return report;
    }),

  updateAdminNote: superAdminProcedure
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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.productionReport.update({
        where: { id: input.id },
        data: {
          cavityStd: input.cavityStd,
          cycleTimeStd: input.cycleTimeStd,
          manPowerStd: input.mpStd,
        },
      });
    }),
});
