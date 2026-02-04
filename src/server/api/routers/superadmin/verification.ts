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
          category: z.enum(["PAPER", "RIGID"]).optional(),
          limit: z.number().default(50),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const where: any = {};

      if (input?.status) {
        where.status = input.status;
      }

      if (input?.category === "RIGID") {
        where.reportType = { in: ["BLOW_MOULDING", "INJECTION"] };
      } else if (input?.category === "PAPER") {
        where.reportType = { in: ["PAPER", "PRINTING", "PACKING_ASSEMBLY"] };
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
            status: "APPROVED",
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
      return ctx.db.productionReport.update({
        where: { id: input.id },
        data: {
          status: "APPROVED",
          checkedById: ctx.session.user.id,
          checkedAt: new Date(),
          rejectionNote: null, // Clear any previous rejection note
        },
      });
    }),

  rejectReport: superAdminProcedure
    .input(z.object({ id: z.string(), note: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.productionReport.update({
        where: { id: input.id },
        data: {
          status: "REJECTED",
          rejectionNote: input.note,
          checkedById: ctx.session.user.id,
          checkedAt: new Date(),
        },
      });
    }),
});
