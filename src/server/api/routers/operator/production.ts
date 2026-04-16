import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { resolveOutputCountUom } from "~/lib/output-uom";
import { sumPackingPrimaryRejectFromBreakdown } from "~/lib/packing-reject";
import {
  LphType,
  ReportStatus,
  ProStatus,
} from "../../../../../generated/prisma";

const productionReportInput = z.object({
  prosesId: z.number(),
  shift: z.number(),
  reportDate: z.date(),
  operatorName: z.string(),
  reportType: z.nativeEnum(LphType),

  startTime: z.string().optional(), // HH:mm
  endTime: z.string().optional(), // HH:mm
  startDate: z.coerce.date().optional(), // tanggal mulai (opsional, fallback ke reportDate)
  endDate: z.coerce.date().optional(), // tanggal selesai (bisa beda hari untuk shift malam)

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

  // Output — operator must explicitly fill these (no silent default)
  qtyPassOn: z.number().min(0),
  qtyHold: z.number().min(0).default(0),
  qtyWip: z.number().min(0).default(0),
  qtyReject: z.number().min(0).default(0),

  // Details
  rejectBreakdown: z.record(z.string(), z.number()).optional(),
  downtimeBreakdown: z.record(z.string(), z.number()).optional(),
  totalDowntime: z.number().default(0),
  notes: z.string().optional(),
  othersNote: z.string().optional(),
  metaData: z.record(z.string(), z.any()).optional(),
});

export const productionRouter = createTRPCRouter({
  createReport: protectedProcedure
    .input(productionReportInput)
    .mutation(async ({ ctx, input }) => {
      // Guard: machineId must be assigned on Proses
      const targetProses = await ctx.db.proses.findUnique({
        where: { id: input.prosesId },
        select: {
          machineId: true,
          partNumber: true,
          machine: {
            select: { uom: true },
          },
        },
      });

      if (!targetProses) {
        throw new Error("Proses tidak ditemukan.");
      }

      if (!targetProses.machineId) {
        throw new Error(
          "Mesin belum di-assign oleh PPIC untuk proses ini. Hubungi PPIC.",
        );
      }

      // Helper to convert HH:mm string to Date object on reportDate
      const setTime = (date: Date, timeStr?: string) => {
        if (!timeStr) return undefined;
        const [hh, mm] = timeStr.split(":").map(Number);
        const newDate = new Date(date);
        newDate.setHours(hh || 0, mm || 0, 0, 0);
        return newDate;
      };

      const rejectBreakdown = input.rejectBreakdown || {};
      const resolvedQtyReject =
        input.reportType === LphType.PACKING_ASSEMBLY
          ? sumPackingPrimaryRejectFromBreakdown(rejectBreakdown)
          : input.qtyReject;

      const report = await ctx.db.productionReport.create({
        data: {
          prosesId: input.prosesId,
          shift: input.shift,
          reportDate: input.reportDate,
          operatorName: input.operatorName,
          reportType: input.reportType,

          startTime: setTime(
            input.startDate ?? input.reportDate,
            input.startTime,
          ),
          endTime: setTime(input.endDate ?? input.reportDate, input.endTime),

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

          qtyPassOn: input.qtyPassOn,
          qtyHold: input.qtyHold,
          qtyWip: input.qtyWip,
          qtyReject: resolvedQtyReject,
          outputUom: resolveOutputCountUom(targetProses.machine?.uom),

          rejectBreakdown,
          downtimeBreakdown: input.downtimeBreakdown || {},
          totalDowntime: input.totalDowntime,

          notes: input.notes,
          othersNote: input.othersNote,
          metaData: input.metaData || {},

          // @ts-ignore: Prisma types not updated yet (requires restart)
          // createdById: ctx.session.user.id, // Save the user ID (Account Owner)
        },
      });

      // --- Auto-Update PRO Status ---
      // Requirement:
      // 1. Belum ada laporan = OPEN (handled initially)
      // 2. Satu aja laporan masuk = IN_PROGRESS
      // 3. Semua laporan masuk (tiap step ada report) = DONE
      try {
        const proses = await ctx.db.proses.findUnique({
          where: { id: input.prosesId },
          select: {
            pro: {
              select: {
                id: true,
                status: true,
                proses: {
                  select: {
                    id: true,
                    productionReports: {
                      select: {
                        id: true,
                        status: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        if (proses?.pro) {
          const pro = proses.pro;
          const totalSteps = pro.proses.length;
          let stepsWithApprovedReport = 0;
          let stepsWithAnyReport = 0;

          for (const s of pro.proses) {
            const hasAnyReport = s.productionReports.length > 0;
            const hasApprovedReport = s.productionReports.some(
              (r) => r.status === ReportStatus.APPROVED,
            );

            if (hasAnyReport) stepsWithAnyReport++;
            if (hasApprovedReport) stepsWithApprovedReport++;
          }

          let newStatus = pro.status;

          // Logic Simplified:
          // If any report exists (pending or approved) -> IN_PROGRESS
          // Completion/Closing is handled by Superadmin Approval only.

          if (stepsWithAnyReport > 0) {
            newStatus = ProStatus.IN_PROGRESS;
          } else {
            newStatus = ProStatus.OPEN;
          }

          if (newStatus !== pro.status && pro.status !== ProStatus.CANCELLED) {
            await ctx.db.pro.update({
              where: { id: pro.id },
              data: { status: newStatus },
            });
          }
        }
      } catch (err) {
        console.error("Failed to auto-update PRO status", err);
        // Do not fail the report creation just because status update failed
      }

      return report;
    }),

  updateReport: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: productionReportInput,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const targetProses = await ctx.db.proses.findUnique({
        where: { id: input.data.prosesId },
        select: {
          machine: {
            select: { uom: true },
          },
        },
      });

      const rejectBreakdown = input.data.rejectBreakdown || {};
      const resolvedQtyReject =
        input.data.reportType === LphType.PACKING_ASSEMBLY
          ? sumPackingPrimaryRejectFromBreakdown(rejectBreakdown)
          : input.data.qtyReject;

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

          startTime: setTime(
            input.data.startDate ?? input.data.reportDate,
            input.data.startTime,
          ),
          endTime: setTime(
            input.data.endDate ?? input.data.reportDate,
            input.data.endTime,
          ),

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

          qtyPassOn: input.data.qtyPassOn,
          qtyHold: input.data.qtyHold,
          qtyWip: input.data.qtyWip,
          qtyReject: resolvedQtyReject,
          outputUom: resolveOutputCountUom(targetProses?.machine?.uom),

          rejectBreakdown,
          downtimeBreakdown: input.data.downtimeBreakdown || {},
          totalDowntime: input.data.totalDowntime,

          notes: input.data.notes,
          othersNote: input.data.othersNote,
          metaData: input.data.metaData, // Update metadata if provided

          // IMPORTANT: Reset status to PENDING so Admin can re-verify
          status: ReportStatus.PENDING,
        },
      });
    }),

  // Endpoint untuk ambil daftar material per proses (untuk checklist reject FG)
  getProsesMaterials: protectedProcedure
    .input(z.object({ prosesId: z.number() }))
    .query(async ({ ctx, input }) => {
      const materials = await ctx.db.prosesMaterial.findMany({
        where: { prosesId: input.prosesId },
        select: {
          id: true,
          itemMaster: {
            select: {
              id: true,
              name: true,
              code: true,
              baseUom: true,
            },
          },
        },
        orderBy: { id: "asc" },
      });
      return materials.map((m) => ({
        id: m.id,
        name: m.itemMaster.name,
        code: m.itemMaster.code,
        uom: m.itemMaster.baseUom,
      }));
    }),

  getHistory: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().default(20),
          prosesId: z.number().optional(),
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
      if (input?.prosesId) where.prosesId = input.prosesId;
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
          prosesId: true,
          reportDate: true,
          shift: true,
          operatorName: true,
          reportType: true,
          startTime: true,
          endTime: true,
          qtyPassOn: true,
          qtyReject: true,
          qtyHold: true,
          qtyWip: true,
          outputUom: true,
          notes: true,
          othersNote: true,
          metaData: true,
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
          proses: {
            select: {
              id: true,
              pro: true,
              machineId: true, // Needed for validation in modal
              partNumber: true, // Needed for validation in modal
              machine: true,
            },
          },
        },
      });
    }),
});
