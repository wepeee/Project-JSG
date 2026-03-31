import "dotenv/config";
import { hash } from "bcryptjs";
import { LphType, PrismaClient, ReportStatus, Role } from "../generated/prisma";

const SEED_TAG = "[SEED_PAPER_APPROVED]";

const dbConfig = (() => {
  if (process.env.SEED_DATABASE_URL) {
    return { source: "SEED_DATABASE_URL", url: process.env.SEED_DATABASE_URL };
  }
  if (process.env.DIRECT_URL) {
    return { source: "DIRECT_URL", url: process.env.DIRECT_URL };
  }
  if (process.env.DATABASE_URL) {
    return { source: "DATABASE_URL", url: process.env.DATABASE_URL };
  }
  throw new Error(
    "Missing DB URL. Set SEED_DATABASE_URL, DIRECT_URL, or DATABASE_URL.",
  );
})();

const db = new PrismaClient({
  datasources: {
    db: { url: dbConfig.url },
  },
});

async function ensureUser(role: Role, username: string) {
  const existing = await db.user.findUnique({ where: { username } });
  if (existing) return existing;

  const passwordHash = await hash(username, 10);
  return db.user.create({
    data: {
      username,
      passwordHash,
      role,
    },
  });
}

async function main() {
  console.log(`[inject-paper-approved] Using DB from ${dbConfig.source}`);

  const operator =
    (await db.user.findFirst({ where: { role: Role.OPERATOR } })) ??
    (await ensureUser(Role.OPERATOR, "operator_seed_paper"));

  const checker =
    (await db.user.findFirst({
      where: { role: { in: [Role.SUPERADMIN, Role.ADMIN] } },
    })) ??
    (await ensureUser(Role.ADMIN, "admin_seed_paper"));

  const paperSteps = await db.proses.findMany({
    where: {
      pro: {
        type: "PAPER",
      },
    },
    orderBy: [{ proId: "desc" }, { orderNo: "asc" }],
    select: {
      id: true,
      orderNo: true,
      pro: {
        select: {
          id: true,
          proNumber: true,
          productName: true,
          startDate: true,
        },
      },
    },
    take: 12,
  });

  if (paperSteps.length === 0) {
    throw new Error(
      "Tidak ada proses PAPER. Buat PRO PAPER dulu, lalu jalankan lagi script ini.",
    );
  }

  const deleted = await db.productionReport.deleteMany({
    where: {
      reportType: LphType.PAPER,
      notes: { contains: SEED_TAG },
    },
  });
  if (deleted.count > 0) {
    console.log(`[inject-paper-approved] Removed old seed rows: ${deleted.count}`);
  }

  const createdRows: Array<{
    proNumber: string;
    prosesId: number;
    shift: number;
    qtyPassOn: number;
    qtyReject: number;
  }> = [];

  for (let i = 0; i < paperSteps.length; i++) {
    const step = paperSteps[i]!;
    const baseDate = step.pro.startDate ? new Date(step.pro.startDate) : new Date();

    const reportDate = new Date(baseDate);
    reportDate.setDate(baseDate.getDate() + i);
    reportDate.setHours(0, 0, 0, 0);

    const startTime = new Date(reportDate);
    startTime.setHours(7 + (i % 2) * 8, 0, 0, 0);

    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 4);

    const qtyPassOn = 180 + i * 12;
    const qtyHold = i % 3 === 0 ? 2 : 1;
    const qtyWip = 0;
    const qtyReject = i % 4 === 0 ? 3 : 2;
    const shift = (i % 3) + 1;

    await db.productionReport.create({
      data: {
        prosesId: step.id,
        reportDate,
        shift,
        operatorName: operator.username,
        reportType: LphType.PAPER,
        startTime,
        endTime,
        qtyPassOn,
        qtyHold,
        qtyWip,
        qtyReject,
        totalDowntime: 20 + (i % 3) * 10,
        notes: `${SEED_TAG} Dummy paper report approved`,
        status: ReportStatus.APPROVED,
        createdById: operator.id,
        checkedById: checker.id,
        checkedAt: new Date(),
      },
    });

    createdRows.push({
      proNumber: step.pro.proNumber,
      prosesId: step.id,
      shift,
      qtyPassOn,
      qtyReject,
    });
  }

  console.table(createdRows);
  console.log(
    `[inject-paper-approved] Done. Inserted ${createdRows.length} APPROVED PAPER reports.`,
  );
}

main()
  .catch((err) => {
    console.error("[inject-paper-approved] Failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

