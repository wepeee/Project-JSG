/**
 * Backfill Script: Seed Item master + link InventoryTxn.itemMasterId
 *
 * Run: npx tsx prisma/backfill-items.ts
 *
 * Strategy:
 * 1) Create Item records from Material table (RAW/WIP/CONSUMABLE)
 * 2) Create Item records from distinct InventoryTxn.itemId not yet covered
 * 3) Create Item records from Pro.partNumber / Proses.partNumber not yet covered
 * 4) Link Material.itemId → Item.id (1-to-1 bridge)
 * 5) Backfill InventoryTxn.itemMasterId by matching itemId → Item.code
 * 6) Report unmapped transactions
 */

import { PrismaClient } from "../generated/prisma";

const db = new PrismaClient();

// Helper: determine ItemKind from string patterns
function inferKind(
  code: string,
  materialType?: string,
): "RAW" | "WIP" | "FG" | "CONSUMABLE" {
  if (materialType === "RAW") return "RAW";
  if (materialType === "WIP") return "WIP";
  if (materialType === "CONSUMABLE") return "CONSUMABLE";

  // Infer from naming convention
  if (
    code.startsWith("WIP_INJ_") ||
    code.startsWith("WIP_BLOW_") ||
    code.startsWith("WIP_PRINT_")
  ) {
    return "WIP";
  }
  if (code.startsWith("FG_")) return "FG";

  // Default: treat as FG (Part Numbers from Pro/Proses are usually FG or WIP output)
  return "FG";
}

async function main() {
  console.log("=== BACKFILL: Item Master ===\n");

  let created = 0;
  let skipped = 0;
  let linked = 0;
  let txnUpdated = 0;
  const unmapped: string[] = [];

  // ─── STEP 1: Material → Item ───
  console.log("STEP 1: Seeding Items from Material table...");
  const materials = await db.material.findMany();

  for (const mat of materials) {
    const code = mat.name; // Material.name is unique, use as Item.code
    const existing = await db.item.findUnique({ where: { code } });

    if (existing) {
      skipped++;
      // Ensure bridge is set
      if (!mat.itemId) {
        await db.material.update({
          where: { id: mat.id },
          data: { itemId: existing.id },
        });
        linked++;
      }
      continue;
    }

    const item = await db.item.create({
      data: {
        code,
        name: mat.name,
        kind: inferKind(code, mat.type) as any,
        baseUom: mat.uom,
      },
    });
    created++;

    // Link Material → Item
    await db.material.update({
      where: { id: mat.id },
      data: { itemId: item.id },
    });
    linked++;
  }
  console.log(
    `  Materials: ${created} created, ${skipped} skipped, ${linked} linked\n`,
  );

  // ─── STEP 2: Distinct InventoryTxn.itemId → Item ───
  console.log("STEP 2: Seeding Items from InventoryTxn.itemId...");
  let step2Created = 0;
  let step2Skipped = 0;

  const distinctItems = await db.inventoryTxn.groupBy({
    by: ["itemId"],
  });

  for (const g of distinctItems) {
    const code = g.itemId;
    const existing = await db.item.findUnique({ where: { code } });
    if (existing) {
      step2Skipped++;
      continue;
    }

    await db.item.create({
      data: {
        code,
        name: code, // Use code as name for now
        kind: inferKind(code) as any,
      },
    });
    step2Created++;
  }
  console.log(
    `  Txn itemIds: ${step2Created} created, ${step2Skipped} already exist\n`,
  );

  // ─── STEP 3: Pro.partNumber + Proses.partNumber → Item ───
  console.log("STEP 3: Seeding Items from Pro/Proses partNumbers...");
  let step3Created = 0;
  let step3Skipped = 0;

  // Pro.partNumber (FG items)
  const pros = await db.pro.findMany({
    where: { partNumber: { not: null } },
    select: { partNumber: true },
  });

  const uniqueProPNs = [
    ...new Set(pros.map((p) => p.partNumber!).filter(Boolean)),
  ];
  for (const pn of uniqueProPNs) {
    const existing = await db.item.findUnique({ where: { code: pn } });
    if (existing) {
      step3Skipped++;
      continue;
    }
    await db.item.create({
      data: { code: pn, name: pn, kind: "FG" },
    });
    step3Created++;
  }

  // Proses.partNumber (WIP/step output items)
  const proses = await db.proses.findMany({
    where: { partNumber: { not: null } },
    select: { partNumber: true },
  });

  const uniqueProsesPNs = [
    ...new Set(proses.map((p) => p.partNumber!).filter(Boolean)),
  ];
  for (const pn of uniqueProsesPNs) {
    const existing = await db.item.findUnique({ where: { code: pn } });
    if (existing) {
      step3Skipped++;
      continue;
    }
    await db.item.create({
      data: { code: pn, name: pn, kind: inferKind(pn) as any },
    });
    step3Created++;
  }
  console.log(
    `  PartNumbers: ${step3Created} created, ${step3Skipped} already exist\n`,
  );

  // ─── STEP 4: Backfill InventoryTxn.itemMasterId ───
  console.log("STEP 4: Backfilling InventoryTxn.itemMasterId...");

  // Build lookup map: code → Item.id
  const allItems = await db.item.findMany({ select: { id: true, code: true } });
  const itemMap = new Map<string, number>();
  for (const item of allItems) {
    itemMap.set(item.code, item.id);
  }

  // Find txns that need backfill (itemMasterId is null)
  const txnsToUpdate = await db.inventoryTxn.findMany({
    where: { itemMasterId: null },
    select: { id: true, itemId: true },
  });

  console.log(`  Found ${txnsToUpdate.length} txns with null itemMasterId`);

  // Batch update in chunks of 100
  const BATCH_SIZE = 100;
  for (let i = 0; i < txnsToUpdate.length; i += BATCH_SIZE) {
    const batch = txnsToUpdate.slice(i, i + BATCH_SIZE);
    const ops = [];

    for (const txn of batch) {
      const masterId = itemMap.get(txn.itemId);
      if (masterId) {
        ops.push(
          db.inventoryTxn.update({
            where: { id: txn.id },
            data: { itemMasterId: masterId },
          }),
        );
        txnUpdated++;
      } else {
        unmapped.push(txn.itemId);
      }
    }

    if (ops.length > 0) {
      await db.$transaction(ops);
    }

    if ((i + BATCH_SIZE) % 500 === 0 || i + BATCH_SIZE >= txnsToUpdate.length) {
      console.log(
        `  Progress: ${Math.min(i + BATCH_SIZE, txnsToUpdate.length)}/${txnsToUpdate.length}`,
      );
    }
  }

  console.log(`  Updated: ${txnUpdated} txns\n`);

  // ─── STEP 5: Report ───
  const uniqueUnmapped = [...new Set(unmapped)];
  if (uniqueUnmapped.length > 0) {
    console.log("⚠️  UNMAPPED itemIds (no matching Item.code):");
    for (const id of uniqueUnmapped) {
      console.log(`  - "${id}"`);
    }
    console.log(`  Total unmapped txns: ${unmapped.length}\n`);
  } else {
    console.log("✅ All transactions mapped successfully!\n");
  }

  // Final summary
  const totalItems = await db.item.count();
  const nullTxns = await db.inventoryTxn.count({
    where: { itemMasterId: null },
  });
  const totalTxns = await db.inventoryTxn.count();

  console.log("=== SUMMARY ===");
  console.log(`Total Items in master: ${totalItems}`);
  console.log(`Total InventoryTxn: ${totalTxns}`);
  console.log(`Txns with itemMasterId: ${totalTxns - nullTxns}`);
  console.log(`Txns still null: ${nullTxns}`);
  console.log(
    `Coverage: ${totalTxns > 0 ? (((totalTxns - nullTxns) / totalTxns) * 100).toFixed(1) : 100}%`,
  );
}

main()
  .catch((e) => {
    console.error("BACKFILL FAILED:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
