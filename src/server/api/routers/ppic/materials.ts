import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, ppicProcedure } from "../../trpc";

/**
 * Materials Router — NOW backed by unified Item table.
 *
 * The frontend still calls api.materials.* but under the hood
 * we query/mutate the Item table (kind=RAW/WIP/FG/CONSUMABLE).
 */

// Map ProType → array of ItemKind to show
function kindsForProType(proType?: string, includeFg = false): string[] {
  // Always show RAW + CONSUMABLE. Add WIP too for all.
  const base = ["RAW", "WIP", "CONSUMABLE"];
  if (includeFg) base.push("FG");
  return base;
}

export const materialsRouter = createTRPCRouter({
  /**
   * List materials (now reads from Item table)
   * Returns: id, name, uom, type, wipStock
   */
  list: ppicProcedure
    .input(
      z
        .object({
          type: z.enum(["PAPER", "RIGID", "OTHER"]).optional(),
          includeFg: z.boolean().optional().default(false),
          withStock: z.boolean().optional().default(true),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const kinds = kindsForProType(input?.type, input?.includeFg ?? false);
      const withStock = input?.withStock ?? true;

      // Fetch selected Item kinds and exclude ARCHIVED
      const items = await ctx.db.item.findMany({
        where: {
          kind: { in: kinds as any[] },
          status: { not: "ARCHIVED" as any },
        },
        select: {
          id: true,
          code: true,
          name: true,
          kind: true,
          status: true,
          baseUom: true,
          createdFrom: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { name: "asc" },
        take: 2000,
      });

      const stockByItemId = new Map<number, number>();
      if (withStock && items.length > 0) {
        const itemIds = items.map((item) => item.id);
        const stockGroups = await ctx.db.inventoryTxn.groupBy({
          by: ["itemMasterId", "type"],
          where: {
            itemMasterId: { in: itemIds },
          },
          _sum: { qty: true },
        });

        for (const g of stockGroups) {
          if (!g.itemMasterId) continue;
          const current = stockByItemId.get(g.itemMasterId) ?? 0;
          const amount = Number(g._sum.qty ?? 0);
          const next =
            g.type === "OUT" ? current - amount : current + amount; // IN + ADJUST add
          stockByItemId.set(g.itemMasterId, next);
        }
      }

      return items.map((item) => ({
        id: item.id,
        name: item.name,
        uom: item.baseUom || "pcs",
        type: item.kind, // RAW/WIP/FG/CONSUMABLE → maps to old MaterialType
        kind: item.kind,
        status: item.status,
        code: item.code,
        wipStock: withStock ? (stockByItemId.get(item.id) ?? 0) : 0,
        // Legacy compat: relatedPro is removed for now (perf)
        relatedPro: null,
        createdFrom: item.createdFrom,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
    }),

  /**
   * Create a material → creates an Item with kind=RAW/WIP/CONSUMABLE
   */
  create: ppicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        uom: z.string(),
        type: z.enum(["RAW", "WIP", "FG", "CONSUMABLE"]).default("RAW"),
        code: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const code =
        input.code?.trim() ||
        input.name.trim().replace(/\s+/g, "_").toUpperCase();

      // Check for duplicate
      const existing = await ctx.db.item.findUnique({ where: { code } });
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `Item dengan kode "${code}" sudah ada.`,
        });
      }

      const item = await ctx.db.item.create({
        data: {
          code,
          name: input.name.trim(),
          kind: input.type as any,
          status: "ACTIVE",
          baseUom: input.uom,
          createdFrom: "PPIC",
          createdById: ctx.session.user.id,
        },
      });

      // Return shape compatible with old Material
      return {
        id: item.id,
        name: item.name,
        uom: item.baseUom || "pcs",
        type: item.kind,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    }),

  /**
   * Update a material → updates an Item
   */
  update: ppicProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        name: z.string().min(1),
        uom: z.string(),
        type: z.enum(["RAW", "WIP", "FG", "CONSUMABLE"]).optional(),
        code: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const code =
        input.code?.trim() ||
        input.name.trim().replace(/\s+/g, "_").toUpperCase();

      // Check for duplicate code (if name changed)
      const existing = await ctx.db.item.findUnique({ where: { code } });
      if (existing && existing.id !== input.id) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `Item dengan kode "${code}" sudah ada (id=${existing.id}).`,
        });
      }

      const item = await ctx.db.item.update({
        where: { id: input.id },
        data: {
          code,
          name: input.name.trim(),
          baseUom: input.uom,
          ...(input.type ? { kind: input.type as any } : {}),
        },
      });

      return {
        id: item.id,
        name: item.name,
        uom: item.baseUom || "pcs",
        type: item.kind,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    }),

  /**
   * Activate a DRAFT item → set status to ACTIVE
   */
  activate: ppicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.item.update({
        where: { id: input.id },
        data: { status: "ACTIVE" as any },
      });
      return { ok: true };
    }),

  /**
   * Delete a material → archive the Item (soft delete)
   */
  delete: ppicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.item.update({
        where: { id: input.id },
        data: { status: "ARCHIVED" as any },
      });
      return { ok: true };
    }),
});
