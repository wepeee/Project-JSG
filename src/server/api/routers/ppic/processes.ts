import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Prisma } from "../../../../../generated/prisma";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

// kalau kamu punya ppicProcedure, pakai itu. Ini versi aman minimal.
const ppicProcedure = protectedProcedure;

export const processesRouter = createTRPCRouter({
  list: ppicProcedure
    .input(z.object({ type: z.enum(["PAPER", "RIGID", "OTHER"]).optional() }))
    .query(({ ctx, input }) => {
      // Logic adjusted to use ProPrefix (formerly Kode_Proses)
      return ctx.db.proPrefix.findMany({
        where: input.type ? { type: input.type } : undefined,
        orderBy: { code: "asc" },
      });
    }),

  create: ppicProcedure
    .input(
      z.object({
        code: z.string().regex(/^\d{2}$/, "Code harus 2 digit (00-99)"),
        name: z.string().min(1, "Nama prefix wajib diisi"),
        type: z.enum(["PAPER", "RIGID", "OTHER"]).optional().default("PAPER"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.proPrefix.create({
          data: {
            code: input.code,
            name: input.name.trim(),
            type: input.type,
          },
        });
      } catch (e: any) {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === "P2002"
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Kode / nama prefix sudah ada",
          });
        }
        throw e;
      }
    }),

  update: ppicProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        code: z.string().regex(/^\d{2}$/),
        name: z.string().min(1),
        type: z.enum(["PAPER", "RIGID", "OTHER"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.proPrefix.update({
          where: { id: input.id },
          data: {
            code: input.code,
            name: input.name.trim(),
            type: input.type,
          },
        });
      } catch (e: any) {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === "P2002"
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Kode / nama prefix sudah dipakai",
          });
        }
        throw e;
      }
    }),

  delete: ppicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      // kalau sudah dipakai di PRO, delete bakal gagal (FK). Itu bagus.
      await ctx.db.proPrefix.delete({ where: { id: input.id } });
      return { ok: true };
    }),
});
