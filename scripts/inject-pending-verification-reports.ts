import "dotenv/config";
import { hash } from "bcryptjs";
import {
  LphType,
  PrismaClient,
  ProStatus,
  ProType,
  ReportStatus,
  Role,
} from "../generated/prisma";

const SEED_TAG = "[SEED_PENDING_VERIFY]";

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

function detectRigidReportType(machineName?: string | null): LphType {
  const name = (machineName ?? "").toUpperCase();
  if (name.includes("INJECT")) return LphType.INJECTION;
  if (name.includes("BLOW")) return LphType.BLOW_MOULDING;
  if (name.includes("PRINT")) return LphType.PRINTING;
  return LphType.PACKING_ASSEMBLY;
}

function detectReportType(params: {
  proType?: ProType | null;
  machineName?: string | null;
}): LphType {
  if (params.proType === ProType.PAPER) return LphType.PAPER;
  return detectRigidReportType(params.machineName);
}

function buildRejectBreakdown(type: LphType, qtyReject: number) {
  if (type === LphType.PAPER) {
    return {
      Bintik: Math.max(1, Math.floor(qtyReject * 0.5)),
      Kotor: Math.max(0, qtyReject - Math.max(1, Math.floor(qtyReject * 0.5))),
    };
  }
  return {
    Proses: Math.max(1, Math.floor(qtyReject * 0.6)),
    Baret: Math.max(0, qtyReject - Math.max(1, Math.floor(qtyReject * 0.6))),
  };
}

function buildDowntimeBreakdown(type: LphType, totalDowntime: number) {
  const half = Math.max(1, Math.floor(totalDowntime / 2));
  const rest = Math.max(0, totalDowntime - half);

  if (type === LphType.PAPER) {
    return {
      "Tunggu Material": half,
      "Machine Problem": rest,
    };
  }
  return {
    Material: half,
    Mesin: rest,
  };
}

async function main() {
  console.log(
    `[inject-pending-verification] Using DB from ${dbConfig.source}`,
  );

  const operator =
    (await db.user.findFirst({ where: { role: Role.OPERATOR } })) ??
    (await ensureUser(Role.OPERATOR, "operator_seed_pending"));

  const deleted = await db.productionReport.deleteMany({
    where: { notes: { contains: SEED_TAG } },
  });
  if (deleted.count > 0) {
    console.log(
      `[inject-pending-verification] Removed old seeded rows: ${deleted.count}`,
    );
  }

  const steps = await db.proses.findMany({
    where: {
      pro: {
        status: { not: ProStatus.CANCELLED },
      },
    },
    orderBy: [{ id: "desc" }],
    include: {
      pro: {
        select: {
          proNumber: true,
          type: true,
        },
      },
      machine: {
        select: { name: true },
      },
    },
    take: 24,
  });

  if (steps.length === 0) {
    throw new Error("Tidak ada step PRO untuk di-inject.");
  }

  const createdRows: Array<{
    proNumber: string;
    prosesId: number;
    reportType: LphType;
    shift: number;
    qtyPassOn: number;
    qtyReject: number;
    status: ReportStatus;
  }> = [];

  let createdCount = 0;
  for (let i = 0; i < steps.length && createdCount < 12; i++) {
    const step = steps[i]!;
    const reportType = detectReportType({
      proType: step.pro.type,
      machineName: step.machine?.name,
    });

    const dayOffset = i % 6;
    const reportDate = new Date();
    reportDate.setDate(reportDate.getDate() - dayOffset);
    reportDate.setHours(0, 0, 0, 0);

    const shift = (i % 3) + 1;
    const startTime = new Date(reportDate);
    if (shift === 1) startTime.setHours(6, 0, 0, 0);
    if (shift === 2) startTime.setHours(11, 0, 0, 0);
    if (shift === 3) startTime.setHours(16, 0, 0, 0);
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 4);

    const qtyPassOn = 150 + i * 10;
    const qtyHold = i % 3 === 0 ? 2 : 1;
    const qtyWip = i % 2 === 0 ? 3 : 0;
    const qtyReject = (i % 4) + 1;
    const totalDowntime = 20 + (i % 3) * 10;

    await db.productionReport.create({
      data: {
        prosesId: step.id,
        reportDate,
        shift,
        operatorName: operator.username,
        reportType,
        startTime,
        endTime,
        qtyPassOn,
        qtyHold,
        qtyWip,
        qtyReject,
        inputMaterialQty: 120 + i * 8,
        materialRunnerQty: reportType === LphType.PAPER ? 0 : 2 + (i % 2),
        materialPurgeQty: reportType === LphType.PAPER ? 0 : 1,
        rejectBreakdown: buildRejectBreakdown(reportType, qtyReject),
        downtimeBreakdown: buildDowntimeBreakdown(reportType, totalDowntime),
        totalDowntime,
        notes: `${SEED_TAG} pending report for admin verification`,
        status: ReportStatus.PENDING,
        createdById: operator.id,
      },
    });

    createdRows.push({
      proNumber: step.pro.proNumber,
      prosesId: step.id,
      reportType,
      shift,
      qtyPassOn,
      qtyReject,
      status: ReportStatus.PENDING,
    });
    createdCount++;
  }

  console.table(createdRows);
  console.log(
    `[inject-pending-verification] Done. Inserted ${createdRows.length} PENDING reports.`,
  );
}

main()
  .catch((err) => {
    console.error("[inject-pending-verification] Failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

