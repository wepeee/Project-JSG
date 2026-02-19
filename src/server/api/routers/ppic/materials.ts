import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  Prisma,
  LocationType,
  MaterialType,
  ProType,
} from "../../../../../generated/prisma";
import { createTRPCRouter } from "../../trpc";
import { ppicProcedure } from "../../trpc";

// ...

export const materialsRouter = createTRPCRouter({
  list: ppicProcedure
    .input(
      z
        .object({
          type: z.enum(["PAPER", "RIGID", "OTHER"]).optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      // 1. Calculate WIP Inventory for all items
      const whereClause: Prisma.InventoryTxnWhereInput = {
        location: { type: LocationType.WIP },
      };

      if (input?.type) {
        whereClause.pro = { type: input.type as ProType };
      }

      const wipGroups = await ctx.db.inventoryTxn.groupBy({
        by: ["itemId", "type"],
        where: whereClause,
        _sum: { qty: true },
      });

      // Map: Normalized Name (lowercase) -> Qty
      const wipStockMap = new Map<string, number>();
      // Map: Normalized Name -> Original Name (for creation)
      const wipNameMap = new Map<string, string>();

      const normalize = (s: string) => s.trim().toLowerCase();

      for (const g of wipGroups) {
        const normName = normalize(g.itemId);
        const current = wipStockMap.get(normName) || 0;
        const qty = Number(g._sum.qty ?? 0);

        let newQty = current;
        if (g.type === "IN") newQty += qty;
        else if (g.type === "OUT") newQty -= qty;
        else if (g.type === "ADJUST") newQty += qty;

        wipStockMap.set(normName, newQty);
        if (!wipNameMap.has(normName)) wipNameMap.set(normName, g.itemId);
      }

      // 2. Fetch Existing Materials
      const existingMaterials = await ctx.db.material.findMany({
        orderBy: { name: "asc" },
        take: 1000,
      });

      const existingNames = new Set(
        existingMaterials.map((m) => normalize(m.name)),
      );

      // 2b. Fetch Related PROs (if material name matches ProNumber)
      const potentialProNumbers = existingMaterials.map((m) => m.name);
      const pros = await ctx.db.pro.findMany({
        where: { proNumber: { in: potentialProNumbers } },
        select: {
          proNumber: true,
          productName: true,
          proses: {
            select: {
              machine: { select: { name: true } },
            },
            orderBy: { orderNo: "asc" },
          },
        },
      });

      const proMap = new Map<string, (typeof pros)[number]>();
      for (const p of pros) {
        proMap.set(p.proNumber, p);
      }

      // 3. Identify Missing WIP Items (in Stock but not in Material DB)
      const missingNormNames = Array.from(wipStockMap.keys()).filter(
        (normName) => !existingNames.has(normName),
      );

      // OPTIONAL: Try Auto-Create (Fire and Forget)
      if (missingNormNames.length > 0) {
        const missingOriginalNames = missingNormNames.map(
          (n) => wipNameMap.get(n)!,
        );
        console.log(
          `Auto-creating ${missingOriginalNames.length} missing WIP materials`,
        );

        // We don't await this to speed up response, just try in background
        ctx.db.material
          .createMany({
            data: missingOriginalNames.map((name) => ({
              name,
              uom: "pcs",
              type: MaterialType.WIP,
            })),
            skipDuplicates: true,
          })
          .catch((err) => console.error("Auto-create failed", err));
      }

      // 4. Merge Data (DB Materials + Virtual WIP Items)
      const result = existingMaterials.map((m) => {
        const pro = proMap.get(m.name);
        const machineNames = pro
          ? Array.from(
              new Set(
                pro.proses
                  .map((p) => p.machine?.name)
                  .filter((n): n is string => !!n),
              ),
            )
          : [];

        return {
          ...m,
          wipStock: wipStockMap.get(normalize(m.name)) || 0,
          relatedPro: pro
            ? {
                proNumber: pro.proNumber,
                productName: pro.productName,
                machineNames,
              }
            : null,
        };
      });

      // Append virtual items that are missing from DB
      for (const normName of missingNormNames) {
        const originalName = wipNameMap.get(normName)!;
        const stock = wipStockMap.get(normName)!;

        // Try to find if this virtual item matches a PRO
        // (We didn't fetch PROs for virtual items above, but usually virtual items ARE the PROs)
        // For now, only map DB materials. If needed, we can do a second PRO fetch or include all names.
        // Let's assume virtual items might be PROs too.

        // Quick check if we already fetched it (unlikely if strictly subset)
        // If we want to support virtual items mapping so PROs, we should have included missingOriginalNames in potentialProNumbers.
        // But for simplicity/performance in this step, let's stick to DB materials first or
        // we can assume the user has created the entries or auto-create will handle it next time.

        result.push({
          id: -1 * Math.floor(Math.random() * 100000),
          name: originalName,
          uom: "pcs",
          type: MaterialType.WIP,
          createdAt: new Date(),
          updatedAt: new Date(),
          prosesMaterials: [], // Mock relation
          wipStock: stock,
          relatedPro: null, // Virtual items won't have it in this pass unless we expand the query
        } as any);
      }

      // Final Sort
      return result.sort((a, b) => a.name.localeCompare(b.name));
    }),

  create: ppicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        uom: z.string(),
        type: z.enum(["RAW", "WIP", "CONSUMABLE"]).default("RAW"),
        remark: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.material.create({
        data: {
          name: input.name.trim(),
          uom: input.uom,
          type: input.type as any,
        },
      });
    }),

  update: ppicProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        name: z.string().min(1),
        uom: z.string(),
        type: z.enum(["RAW", "WIP", "CONSUMABLE"]).optional(),
        remark: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.material.update({
        where: { id: input.id },
        data: {
          name: input.name.trim(),
          uom: input.uom,
          type: input.type as any,
        },
      });
    }),

  delete: ppicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.material.delete({ where: { id: input.id } });
      return { ok: true };
    }),
});
