import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, ppicProcedure } from "../../trpc";

/**
 * Materials Router — NOW backed by unified Item table.
 *
 * The frontend still calls api.materials.* but under the hood
 * we query/mutate the Item table (kind=RAW/WIP/CONSUMABLE).
 */

// Map ProType → array of ItemKind to show
function kindsForProType(proType?: string): string[] {
  // Always show RAW + CONSUMABLE. Add WIP too for all.
  return ["RAW", "WIP", "CONSUMABLE"];
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
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const kinds = kindsForProType(input?.type);

      // Fetch all Items that are RAW/WIP/CONSUMABLE and not ARCHIVED
      const items = await ctx.db.item.findMany({
        where: {
          kind: { in: kinds as any[] },
          status: { not: "ARCHIVED" as any },
        },
        include: {
          inventoryTxns: {
            select: { qty: true, type: true },
          },
        },
        orderBy: { name: "asc" },
        take: 2000,
      });

      // Calculate stock per item
      return items.map((item) => {
        let wipStock = 0;
        for (const tx of item.inventoryTxns) {
          const q = Number(tx.qty);
          if (tx.type === "IN" || tx.type === "ADJUST") wipStock += q;
          else if (tx.type === "OUT") wipStock -= q;
        }

        return {
          id: item.id,
          name: item.name,
          uom: item.baseUom || "pcs",
          type: item.kind, // RAW/WIP/CONSUMABLE → maps to old MaterialType
          kind: item.kind,
          status: item.status,
          code: item.code,
          wipStock,
          // Legacy compat: relatedPro is removed for now (perf)
          relatedPro: null,
          createdFrom: item.createdFrom,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      });
    }),

  /**
   * Create a material → creates an Item with kind=RAW/WIP/CONSUMABLE
   */
  create: ppicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        uom: z.string(),
        type: z.enum(["RAW", "WIP", "CONSUMABLE"]).default("RAW"),
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
        type: z.enum(["RAW", "WIP", "CONSUMABLE"]).optional(),
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
