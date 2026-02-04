import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { LphType, ReportStatus } from "../../../../../generated/prisma";

const productionReportInput = z.object({
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
});

export const productionRouter = createTRPCRouter({
  createReport: protectedProcedure
    .input(productionReportInput)
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

  updateReport: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: productionReportInput,
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

      return ctx.db.productionReport.update({
        where: { id: input.id },
        data: {
          shift: input.data.shift,
          reportDate: input.data.reportDate,
          operatorName: input.data.operatorName,
          // reportType: input.data.reportType, // Type usually doesn't change

          startTime: setTime(input.data.reportDate, input.data.startTime),
          endTime: setTime(input.data.reportDate, input.data.endTime),

          batchNo: input.data.batchNo,
          manPowerStd: input.data.mpStd,
          manPowerAct: input.data.mpAct,
          cycleTimeStd: input.data.cycleTimeStd,
          cycleTimeAct: input.data.cycleTimeAct,
          cavityStd: input.data.cavityStd,
          cavityAct: input.data.cavityAct,

          inputMaterialQty: input.data.inputMaterialQty,
          materialRunnerQty: input.data.materialRunnerQty,
          materialPurgeQty: input.data.materialPurgeQty,

          qtyGood: input.data.qtyGood,
          qtyPassOn: input.data.qtyPassOn,
          qtyHold: input.data.qtyHold,
          qtyWip: input.data.qtyWip,
          qtyReject: input.data.qtyReject,

          rejectBreakdown: input.data.rejectBreakdown || {},
          downtimeBreakdown: input.data.downtimeBreakdown || {},
          totalDowntime: input.data.totalDowntime,

          notes: input.data.notes,

          // IMPORTANT: Reset status to PENDING so Admin can re-verify
          status: "PENDING",
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
          status: z
            .union([
              z.nativeEnum(ReportStatus),
              z.array(z.nativeEnum(ReportStatus)),
            ])
            .optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const where: any = {};
      if (input?.proStepId) where.proStepId = input.proStepId;
      if (input?.operatorName) where.operatorName = input.operatorName;
      // if (input?.createdById) where.createdById = input.createdById;

      if (input?.status) {
        // Handle both single status and array of statuses
        if (Array.isArray(input.status)) {
          where.status = { in: input.status };
        } else {
          where.status = input.status;
        }
      }

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
          status: true,
          rejectionNote: true,

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
