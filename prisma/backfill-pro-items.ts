import { PrismaClient } from "../generated/prisma";
const db = new PrismaClient();

async function main() {
  // 1. Backfill Pro.fgItemId from Pro.partNumber
  const pros = await db.pro.findMany({
    where: { partNumber: { not: null }, fgItemId: null },
    select: { id: true, partNumber: true },
  });

  let proLinked = 0;
  let proSkipped = 0;
  for (const pro of pros) {
    if (!pro.partNumber) continue;
    const normalized = pro.partNumber.trim().replace(/\s+/g, "_").toUpperCase();
    const item = await db.item.findFirst({
      where: { OR: [{ code: normalized }, { code: pro.partNumber }] },
      select: { id: true },
    });
    if (item) {
      await db.pro.update({
        where: { id: pro.id },
        data: { fgItemId: item.id },
      });
      proLinked++;
    } else {
      proSkipped++;
      console.log(`  SKIP Pro ${pro.id}: no Item for "${pro.partNumber}"`);
    }
  }
  console.log(
    `Pro: ${proLinked} linked, ${proSkipped} skipped (out of ${pros.length})`,
  );

  // 2. Backfill Proses.outputItemId from Proses.partNumber
  const proses = await db.proses.findMany({
    where: { partNumber: { not: null }, outputItemId: null },
    select: { id: true, partNumber: true },
  });

  let prosesLinked = 0;
  let prosesSkipped = 0;
  for (const p of proses) {
    if (!p.partNumber) continue;
    const normalized = p.partNumber.trim().replace(/\s+/g, "_").toUpperCase();
    const item = await db.item.findFirst({
      where: { OR: [{ code: normalized }, { code: p.partNumber }] },
      select: { id: true },
    });
    if (item) {
      await db.proses.update({
        where: { id: p.id },
        data: { outputItemId: item.id },
      });
      prosesLinked++;
    } else {
      prosesSkipped++;
      console.log(`  SKIP Proses ${p.id}: no Item for "${p.partNumber}"`);
    }
  }
  console.log(
    `Proses: ${prosesLinked} linked, ${prosesSkipped} skipped (out of ${proses.length})`,
  );
}

main()
  .then(() => console.log("\nDone!"))
  .catch(console.error)
  .finally(() => db.$disconnect());
