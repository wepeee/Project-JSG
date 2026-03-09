import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  ppicProcedure,
  protectedProcedure,
  superAdminProcedure,
} from "../../trpc";

// Valid code: alphanumeric, underscores, hyphens, dots. 2-50 chars.
const ITEM_CODE_REGEX = /^[A-Z0-9_\-\.]{2,50}$/;
const VALID_WIP_PREFIXES = ["WIP_INJ_", "WIP_BLOW_", "WIP_PRINT_"];

import { normalizeCode } from "~/utils/normalize";

export const itemsRouter = createTRPCRouter({
  /**
   * Search items by code/name (autocomplete)
   * Accessible by all authenticated users
   */
  search: protectedProcedure
    .input(
      z.object({
        q: z.string().min(1).max(100),
        kind: z.enum(["RAW", "WIP", "FG", "CONSUMABLE"]).optional(),
        limit: z.number().min(1).max(50).default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.item.findMany({
        where: {
          AND: [
            {
              OR: [
                { code: { contains: input.q.toUpperCase() } },
                { name: { contains: input.q } },
              ],
            },
            ...(input.kind ? [{ kind: input.kind as any }] : []),
            { status: { not: "ARCHIVED" as any } }, // Show DRAFT + ACTIVE
          ],
        },
        orderBy: [{ status: "asc" }, { code: "asc" }], // ACTIVE first, then DRAFT
        take: input.limit,
        select: {
          id: true,
          code: true,
          name: true,
          kind: true,
          status: true,
          baseUom: true,
        },
      });

      if (items.length === 0) return [];

      const ids = items.map((item) => item.id);
      const stockGroups = await ctx.db.inventoryTxn.groupBy({
        by: ["itemMasterId", "type"],
        where: {
          itemMasterId: { in: ids },
        },
        _sum: { qty: true },
      });

      const stockByItemId = new Map<number, number>();
      for (const g of stockGroups) {
        if (!g.itemMasterId) continue;
        const current = stockByItemId.get(g.itemMasterId) ?? 0;
        const amount = Number(g._sum.qty ?? 0);
        const next =
          g.type === "OUT" ? current - amount : current + amount; // IN + ADJUST add
        stockByItemId.set(g.itemMasterId, next);
      }

      return items.map((item) => ({
        id: item.id,
        code: item.code,
        name: item.name,
        kind: item.kind,
        status: item.status,
        baseUom: item.baseUom,
        stock: stockByItemId.get(item.id) ?? 0,
      }));
    }),

  /**
   * Create a new Item (PPIC creates as DRAFT)
   */
  create: ppicProcedure
    .input(
      z.object({
        code: z.string().min(2).max(50),
        name: z.string().min(1).max(200),
        kind: z.enum(["RAW", "WIP", "FG", "CONSUMABLE"]),
        baseUom: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Normalize code
      const code = normalizeCode(input.code);

      // Validate code format
      if (!ITEM_CODE_REGEX.test(code)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Kode item tidak valid: "${code}". Hanya huruf, angka, underscore, dash, dan titik diperbolehkan (2-50 karakter).`,
        });
      }

      // Validate WIP prefix for rigid items
      if (input.kind === "WIP" && code.startsWith("WIP_")) {
        const hasValidPrefix = VALID_WIP_PREFIXES.some((p) =>
          code.startsWith(p),
        );
        if (!hasValidPrefix) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `WIP item dengan prefix "WIP_" harus menggunakan: ${VALID_WIP_PREFIXES.join(", ")}. Contoh: WIP_INJ_BOTOL123`,
          });
        }
      }

      // Check duplicate (normalized)
      const existing = await ctx.db.item.findUnique({ where: { code } });
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `Item dengan kode "${code}" sudah ada (${existing.name}).`,
        });
      }

      const userId = ctx.session?.user?.id;

      const item = await ctx.db.item.create({
        data: {
          code,
          name: input.name.trim(),
          kind: input.kind as any,
          status: "DRAFT",
          baseUom: input.baseUom?.trim() || null,
          ...(userId ? { createdById: userId } : {}),
          createdFrom: "PPIC",
        },
      });

      return item;
    }),

  /**
   * List items by status (for admin/master review queue)
   */
  listByStatus: superAdminProcedure
    .input(
      z.object({
        status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).optional(),
        kind: z.enum(["RAW", "WIP", "FG", "CONSUMABLE"]).optional(),
        q: z.string().optional(),
        take: z.number().min(1).max(100).default(50),
        cursor: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where: any = {};
      if (input.status) where.status = input.status;
      if (input.kind) where.kind = input.kind;
      if (input.q) {
        where.OR = [
          { code: { contains: input.q.toUpperCase() } },
          { name: { contains: input.q } },
        ];
      }

      const items = await ctx.db.item.findMany({
        where,
        take: input.take + 1,
        ...(input.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}),
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          code: true,
          name: true,
          kind: true,
          status: true,
          baseUom: true,
          createdFrom: true,
          createdAt: true,
          createdBy: { select: { username: true } },
        },
      });

      let nextCursor: number | undefined;
      if (items.length > input.take) {
        const next = items.pop()!;
        nextCursor = next.id;
      }

      return { items, nextCursor };
    }),

  /**
   * Approve DRAFT → ACTIVE (MASTER/SUPERADMIN only)
   */
  approve: superAdminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.db.item.findUnique({ where: { id: input.id } });
      if (!item)
        throw new TRPCError({ code: "NOT_FOUND", message: "Item not found" });
      if (item.status !== "DRAFT") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Item "${item.code}" bukan DRAFT (status: ${item.status}).`,
        });
      }

      return ctx.db.item.update({
        where: { id: input.id },
        data: { status: "ACTIVE" },
      });
    }),

  /**
   * Update item (name, kind, baseUom) — SUPERADMIN only
   */
  update: superAdminProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        name: z.string().min(1).max(200).optional(),
        kind: z.enum(["RAW", "WIP", "FG", "CONSUMABLE"]).optional(),
        baseUom: z.string().optional(),
        status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.item.update({
        where: { id },
        data: {
          ...(data.name ? { name: data.name.trim() } : {}),
          ...(data.kind ? { kind: data.kind as any } : {}),
          ...(data.baseUom !== undefined
            ? { baseUom: data.baseUom || null }
            : {}),
          ...(data.status ? { status: data.status as any } : {}),
        },
      });
    }),

  /**
   * Bulk approve DRAFT items
   */
  bulkApprove: superAdminProcedure
    .input(z.object({ ids: z.array(z.number().int().positive()).min(1) }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.item.updateMany({
        where: { id: { in: input.ids }, status: "DRAFT" },
        data: { status: "ACTIVE" },
      });
      return { count: result.count };
    }),
});
