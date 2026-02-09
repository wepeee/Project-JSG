import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  superAdminProcedure,
} from "../../trpc";

import { Uom, MachineType } from "~/../generated/prisma";

const SHIFT_HOURS = 6.8; // sesuaikan kalau jam shift kamu beda

export const machinesRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z
        .object({
          type: z.nativeEnum(MachineType).optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.machine.findMany({
        where: {
          type: input?.type,
        },
        orderBy: { name: "asc" },
        take: 200,
      });
    }),

  create: superAdminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        stdOutputPerHour: z.number().int().positive(),
        // frontend boleh kirim, tapi server gak percaya
        stdOutputPerShift: z.number().int().nonnegative().optional(),
        uom: z.nativeEnum(Uom),
        type: z.nativeEnum(MachineType).default("PAPER"),
        remark: z.string().optional(),

        // Rigid Fields
        cycleTimeSec: z.number().optional(),
        cycleTimeMin: z.number().optional(),
        cavity: z.number().int().optional(),
        manPower: z.number().int().optional(),
        stdOutputPerDay: z.number().int().optional(),
        workCenter: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const computedShift = Math.round(input.stdOutputPerHour * SHIFT_HOURS);

      return ctx.db.machine.create({
        data: {
          name: input.name,
          stdOutputPerHour: input.stdOutputPerHour,
          stdOutputPerShift: computedShift, // ✅ server source of truth
          uom: input.uom,
          type: input.type,
          remark: input.remark,

          cycleTimeSec: input.cycleTimeSec,
          cycleTimeMin: input.cycleTimeMin,
          cavity: input.cavity,
          manPower: input.manPower,
          stdOutputPerDay: input.stdOutputPerDay,
          workCenter: input.workCenter,
        },
      });
    }),

  update: superAdminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        stdOutputPerHour: z.number().int().positive().optional(),
        uom: z.nativeEnum(Uom).optional(),
        remark: z.string().optional(),
        // Rigid Fields
        cycleTimeSec: z.number().optional(),
        cycleTimeMin: z.number().optional(),
        cavity: z.number().int().optional(),
        manPower: z.number().int().optional(),
        stdOutputPerDay: z.number().int().optional(),
        workCenter: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Calculate derived fields if necessary
      let computedShift = undefined;
      if (data.stdOutputPerHour) {
        computedShift = Math.round(data.stdOutputPerHour * SHIFT_HOURS);
      }

      return ctx.db.machine.update({
        where: { id },
        data: {
          ...data,
          ...(computedShift !== undefined && {
            stdOutputPerShift: computedShift,
          }),
        },
      });
    }),

  delete: superAdminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.machine.delete({
        where: { id: input.id },
      });
    }),
});
