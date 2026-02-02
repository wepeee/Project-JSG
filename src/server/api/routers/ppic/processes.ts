import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Prisma } from "generated/prisma";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

// kalau kamu punya ppicProcedure, pakai itu. Ini versi aman minimal.
const ppicProcedure = protectedProcedure;

export const processesRouter = createTRPCRouter({
  list: ppicProcedure
    .input(z.object({ type: z.enum(["PAPER", "RIGID", "OTHER"]).optional() }))
    .query(({ ctx, input }) => {
      return ctx.db.process.findMany({
        where: input.type ? { type: input.type } : undefined,
        orderBy: { code: "asc" },
      });
    }),

  create: ppicProcedure
    .input(
      z.object({
        code: z.string().regex(/^\d{2}$/, "Kode proses harus 2 digit (00-99)"),
        name: z.string().min(1, "Nama proses wajib diisi"),
        type: z.enum(["PAPER", "RIGID", "OTHER"]).optional().default("PAPER"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.process.create({
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
            message: "Kode / nama proses sudah ada",
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
        return await ctx.db.process.update({
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
            message: "Kode / nama proses sudah dipakai",
          });
        }
        throw e;
      }
    }),

  delete: ppicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      // kalau proses sudah dipakai di PRO step, delete bakal gagal (FK). Itu bagus.
      await ctx.db.process.delete({ where: { id: input.id } });
      return { ok: true };
    }),
});
