import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Prisma } from "../../../../../generated/prisma";
import { createTRPCRouter, ppicProcedure } from "../../trpc";

const SAFE_TYPES = new Set(["PAPER", "RIGID", "OTHER"]);
type PrefixRow = { id: number; code: string; name: string; type?: string | null };

function normalizePrefixType(typeValue: string | null | undefined) {
  return SAFE_TYPES.has(typeValue ?? "") ? typeValue! : "PAPER";
}

export const processesRouter = createTRPCRouter({
  list: ppicProcedure
    .input(z.object({ type: z.enum(["PAPER", "RIGID", "OTHER"]).optional() }))
    .query(async ({ ctx, input }) => {
      // Primary path: typed Prisma query
      try {
        return await ctx.db.proPrefix.findMany({
          where: input.type ? { type: input.type } : undefined,
          orderBy: { code: "asc" },
        });
      } catch (e: any) {
        // Fallback path: tolerate legacy data/schema drift (e.g., old nullable/missing type column)
        try {
          const rows = await ctx.db.$queryRaw<PrefixRow[]>`
            SELECT "id", "code", "name", "type"::text AS "type"
            FROM "ProPrefix"
            ORDER BY "code" ASC
          `;

          const normalized = rows
            .map((r) => ({
              id: r.id,
              code: r.code,
              name: r.name,
              type: normalizePrefixType(r.type),
            }))
            .filter((r) => (input.type ? r.type === input.type : true));

          return normalized;
        } catch {
          try {
            const rowsNoType = await ctx.db.$queryRaw<
              Array<{ id: number; code: string; name: string }>
            >`
              SELECT "id", "code", "name"
              FROM "ProPrefix"
              ORDER BY "code" ASC
            `;

            const normalized = rowsNoType.map((r) => ({
              id: r.id,
              code: r.code,
              name: r.name,
              type: "PAPER" as const,
            }));

            return input.type
              ? normalized.filter((r) => r.type === input.type)
              : normalized;
          } catch {
            if (
              e instanceof Prisma.PrismaClientKnownRequestError ||
              e instanceof Prisma.PrismaClientUnknownRequestError
            ) {
              throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                  "Master proses gagal dibaca. Kemungkinan schema DB belum sinkron. Jalankan migrasi/db push terbaru.",
              });
            }
            throw e;
          }
        }
      }
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
