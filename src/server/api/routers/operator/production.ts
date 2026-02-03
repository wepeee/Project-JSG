import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { LphType } from "../../../../../generated/prisma";

export const productionRouter = createTRPCRouter({
  createReport: protectedProcedure
    .input(
      z.object({
        proStepId: z.number(),
        shift: z.number(),
        reportDate: z.date(),
        operatorName: z.string(),
        reportType: z.nativeEnum(LphType),

        startTime: z.string().optional(), // HH:mm
        endTime: z.string().optional(), // HH:mm

        // Rigid / Resources
        batchNo: z.string().optional(),
        mpStd: z.number().optional(),
        mpAct: z.number().optional(),
        cycleTimeStd: z.number().optional(),
        cycleTimeAct: z.number().optional(),
        cavityStd: z.number().optional(),
        cavityAct: z.number().optional(),

        // Material
        inputMaterialQty: z.number().optional(),
        materialRunnerQty: z.number().optional(),
        materialPurgeQty: z.number().optional(),

        // Output
        qtyGood: z.number().default(0),
        qtyPassOn: z.number().default(0),
        qtyHold: z.number().default(0),
        qtyWip: z.number().default(0),
        qtyReject: z.number().default(0),

        // Details
        rejectBreakdown: z.record(z.string(), z.number()).optional(),
        downtimeBreakdown: z.record(z.string(), z.number()).optional(),
        totalDowntime: z.number().default(0),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Helper to convert HH:mm string to Date object on reportDate
      const setTime = (date: Date, timeStr?: string) => {
        if (!timeStr) return undefined;
        const [hh, mm] = timeStr.split(":").map(Number);
        const newDate = new Date(date);
        newDate.setHours(hh || 0, mm || 0, 0, 0);
        return newDate;
      };

      return ctx.db.productionReport.create({
        data: {
          proStepId: input.proStepId,
          shift: input.shift,
          reportDate: input.reportDate,
          operatorName: input.operatorName,
          reportType: input.reportType,

          startTime: setTime(input.reportDate, input.startTime),
          endTime: setTime(input.reportDate, input.endTime),

          batchNo: input.batchNo,
          manPowerStd: input.mpStd,
          manPowerAct: input.mpAct,
          cycleTimeStd: input.cycleTimeStd,
          cycleTimeAct: input.cycleTimeAct,
          cavityStd: input.cavityStd,
          cavityAct: input.cavityAct,

          inputMaterialQty: input.inputMaterialQty,
          materialRunnerQty: input.materialRunnerQty,
          materialPurgeQty: input.materialPurgeQty,

          qtyGood: input.qtyGood,
          qtyPassOn: input.qtyPassOn,
          qtyHold: input.qtyHold,
          qtyWip: input.qtyWip,
          qtyReject: input.qtyReject,

          rejectBreakdown: input.rejectBreakdown || {},
          downtimeBreakdown: input.downtimeBreakdown || {},
          totalDowntime: input.totalDowntime,

          notes: input.notes,

          // @ts-ignore: Prisma types not updated yet (requires restart)
          // createdById: ctx.session.user.id, // Save the user ID (Account Owner)
        },
      });
    }),

  getHistory: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().default(20),
          proStepId: z.number().optional(),
          operatorName: z.string().optional(),
          createdById: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const where: any = {};
      if (input?.proStepId) where.proStepId = input.proStepId;
      if (input?.operatorName) where.operatorName = input.operatorName;
      if (input?.operatorName) where.operatorName = input.operatorName;
      // if (input?.createdById) where.createdById = input.createdById;

      return ctx.db.productionReport.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: input?.limit,
        select: {
          id: true,
          proStepId: true,
          reportDate: true,
          shift: true,
          operatorName: true,
          reportType: true,
          startTime: true,
          endTime: true,
          qtyGood: true,
          qtyPassOn: true,
          qtyReject: true,
          qtyHold: true,
          qtyWip: true,
          notes: true,
          createdAt: true,

          // Explicitly select these to match UI needs and avoid "select *" issues
          batchNo: true,
          inputMaterialQty: true,
          materialRunnerQty: true,
          materialPurgeQty: true,
          rejectBreakdown: true,
          downtimeBreakdown: true,
          totalDowntime: true,

          // Nested relations (replacing include)
          step: {
            select: {
              id: true,
              pro: true,
              machine: true,
            },
          },
        },
      });
    }),
});
