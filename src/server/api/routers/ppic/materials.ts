import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Prisma } from "generated/prisma"; // sesuai output prisma kamu
import { createTRPCRouter } from "../../trpc";
import { ppicProcedure } from "../../trpc"; // kalau kamu export ppicProcedure dari file yang sama, sesuaikan import

const UOM_OPTIONS = ["sheet", "pcs", "meter", "cm"] as const;

export const materialsRouter = createTRPCRouter({
  list: ppicProcedure.query(async ({ ctx }) => {
    return ctx.db.material.findMany({
      orderBy: { name: "asc" },
      take: 500,
    });
  }),

  create: ppicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        uom: z.enum(UOM_OPTIONS),
        remark: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.material.create({
        data: { name: input.name.trim(), uom: input.uom },
      });
    }),

  update: ppicProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        name: z.string().min(1),
        uom: z.enum(UOM_OPTIONS),
        remark: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.material.update({
        where: { id: input.id },
        data: { name: input.name.trim(), uom: input.uom },
      });
    }),

  delete: ppicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.material.delete({ where: { id: input.id } });
      return { ok: true };
    }),
});
