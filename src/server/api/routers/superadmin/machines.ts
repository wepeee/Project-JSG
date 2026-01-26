import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  superAdminProcedure,
} from "../../trpc";

import { Uom } from "~/../generated/prisma";

const SHIFT_HOURS = 6.8; // sesuaikan kalau jam shift kamu beda

export const machinesRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.machine.findMany({
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
        remark: z.string().optional(),
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
          remark: input.remark,
        },
        select: {
          id: true,
          name: true,
          stdOutputPerHour: true,
          stdOutputPerShift: true,
          uom: true,
          remark: true,
          createdAt: true,
        },
      });
    }),
});
