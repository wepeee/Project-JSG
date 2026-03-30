import { PrismaClient } from '../generated/prisma/index.js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      if (!key) return;
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      process.env[key] = value;
    }
  });
}

const prisma = new PrismaClient();

async function main() {
  const txns = await prisma.inventoryTxn.findMany({
    where: { itemId: "111" },
    include: { pro: true },
    orderBy: { createdAt: 'asc' }
  });

  console.log("=== TRANSAKSI DB UNTUK PN 111 ===");
  for (const t of txns) {
    console.log(`[${t.date.toISOString()}] ${t.type.padEnd(4)} | Qty: ${Number(t.qty).toString().padStart(3)} | PRO ID: ${t.pro?.proNumber ?? 'N/A'}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
