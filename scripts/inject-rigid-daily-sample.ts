import "dotenv/config";
import { hash } from "bcryptjs";
import {
  LphType,
  PrismaClient,
  ProType,
  ReportStatus,
  Role,
  Uom,
} from "../generated/prisma";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const IMPORT_TAG = "[IMPORT_RIGID_DAILY_TEST]";

type RigidSampleRow = {
  sourceSheet: string;
  sourceRow: number;
  reportType: "INJECTION" | "BLOW_MOULDING" | "PRINTING" | "PACKING_ASSEMBLY";
  reportDate: string; // YYYY-MM-DD
  shift: number;
  machineName: string;
  proNumber: string;
  partNumber: string | null;
  productName: string;
  operatorName: string;
  qtyPassOn: number;
  qtyHold: number;
  qtyWip: number;
  qtyReject: number;
  inputMaterialQty: number;
  materialPurgeQty: number;
  materialRunnerQty: number;
  totalDowntime: number;
  manPowerStd: number | null;
  manPowerAct: number | null;
  cycleTimeStd: number;
  cycleTimeAct: number;
  cavityStd: number | null;
  cavityAct: number | null;
  notes: string | null;
  rejectBreakdown: Record<string, number>;
  downtimeBreakdown: Record<string, number>;
};

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

function parseDateOnly(dateStr: string) {
  const [yRaw, mRaw, dRaw] = dateStr.split("-");
  const y = Number(yRaw ?? 0);
  const m = Number(mRaw ?? 0);
  const d = Number(dRaw ?? 0);
  if (!y || !m || !d) return new Date();
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

function enumReportType(type: RigidSampleRow["reportType"]): LphType {
  if (type === "INJECTION") return LphType.INJECTION;
  if (type === "BLOW_MOULDING") return LphType.BLOW_MOULDING;
  if (type === "PRINTING") return LphType.PRINTING;
  return LphType.PACKING_ASSEMBLY;
}

function normalizeNonNegative(value: number | null | undefined) {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, n);
}

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

async function ensureRigidMachine(name: string) {
  const normalized = name.trim();
  const existing = await db.machine.findFirst({
    where: { type: "RIGID", name: normalized },
    orderBy: { id: "asc" },
  });
  if (existing) return existing;

  return db.machine.create({
    data: {
      name: normalized,
      type: "RIGID",
      stdOutputPerHour: 100,
      stdOutputPerShift: 800,
      uom: Uom.pcs,
      remark: "Created by inject-rigid-daily-sample",
    },
  });
}

async function ensurePro(row: RigidSampleRow, ppicId: string) {
  const qtyPo = Math.max(
    1,
    Math.round(
      normalizeNonNegative(row.qtyPassOn) +
        normalizeNonNegative(row.qtyHold) +
        normalizeNonNegative(row.qtyWip),
    ),
  );

  return db.pro.upsert({
    where: { proNumber: row.proNumber },
    update: {
      updatedById: ppicId,
      type: ProType.RIGID,
      productName: row.productName || undefined,
      partNumber: row.partNumber ?? undefined,
    },
    create: {
      proNumber: row.proNumber,
      productName: row.productName,
      partNumber: row.partNumber ?? undefined,
      qtyPoPcs: qtyPo,
      type: ProType.RIGID,
      startDate: parseDateOnly(row.reportDate),
      createdById: ppicId,
      updatedById: ppicId,
    },
  });
}

async function ensureProses(
  row: RigidSampleRow,
  proId: number,
  machineId: number,
) {
  const existing = await db.proses.findFirst({
    where: {
      proId,
      machineId,
      partNumber: row.partNumber ?? undefined,
    },
    orderBy: { id: "asc" },
  });
  if (existing) return existing;

  const maxOrder = await db.proses.aggregate({
    where: { proId },
    _max: { orderNo: true },
  });
  const nextOrder = (maxOrder._max.orderNo ?? 0) + 1;

  return db.proses.create({
    data: {
      proId,
      orderNo: nextOrder,
      machineId,
      partNumber: row.partNumber ?? undefined,
      startDate: parseDateOnly(row.reportDate),
      up: row.cavityStd ?? undefined,
      estimatedShifts: 1,
    },
  });
}

function normalizeBreakdown(record: Record<string, number>) {
  const out: Record<string, number> = {};
  for (const [key, value] of Object.entries(record ?? {})) {
    const n = normalizeNonNegative(value);
    if (n > 0) out[key] = Number(n.toFixed(3));
  }
  return out;
}

async function main() {
  console.log(`[inject-rigid-daily-sample] Using DB from ${dbConfig.source}`);
  const jsonPath = resolve(process.cwd(), "scripts/data/rigid-daily-sample.json");
  const rows = JSON.parse(readFileSync(jsonPath, "utf8")) as RigidSampleRow[];
  if (!rows.length) {
    throw new Error("No rows found in scripts/data/rigid-daily-sample.json");
  }

  const ppic =
    (await db.user.findFirst({ where: { role: Role.PPIC } })) ??
    (await ensureUser(Role.PPIC, "ppic_import_rigid_daily"));

  const checker =
    (await db.user.findFirst({
      where: { role: { in: [Role.SUPERADMIN, Role.ADMIN] } },
    })) ??
    (await ensureUser(Role.ADMIN, "admin_import_rigid_daily"));

  const removed = await db.productionReport.deleteMany({
    where: {
      reportType: {
        in: [
          LphType.INJECTION,
          LphType.BLOW_MOULDING,
          LphType.PRINTING,
          LphType.PACKING_ASSEMBLY,
        ],
      },
      notes: { contains: IMPORT_TAG },
    },
  });
  if (removed.count > 0) {
    console.log(
      `[inject-rigid-daily-sample] Removed old imported rows: ${removed.count}`,
    );
  }

  const created: Array<{
    sheet: string;
    row: number;
    reportType: string;
    proNumber: string;
    machine: string;
    shift: number;
    passOn: number;
    reject: number;
  }> = [];

  for (const row of rows) {
    const operator =
      (await db.user.findUnique({ where: { username: row.operatorName } })) ??
      (await ensureUser(Role.OPERATOR, row.operatorName));
    const machine = await ensureRigidMachine(row.machineName);
    const pro = await ensurePro(row, ppic.id);
    const proses = await ensureProses(row, pro.id, machine.id);

    const rejectBreakdown = normalizeBreakdown(row.rejectBreakdown);
    const downtimeBreakdown = normalizeBreakdown(row.downtimeBreakdown);
    const breakdownDowntimeTotal = Object.values(downtimeBreakdown).reduce(
      (acc, v) => acc + Number(v),
      0,
    );
    const finalTotalDowntime = Math.round(
      Math.max(normalizeNonNegative(row.totalDowntime), breakdownDowntimeTotal),
    );

    await db.productionReport.create({
      data: {
        prosesId: proses.id,
        reportDate: parseDateOnly(row.reportDate),
        shift: Math.min(3, Math.max(1, row.shift || 1)),
        operatorName: row.operatorName,
        reportType: enumReportType(row.reportType),
        qtyPassOn: normalizeNonNegative(row.qtyPassOn),
        qtyHold: normalizeNonNegative(row.qtyHold),
        qtyWip: normalizeNonNegative(row.qtyWip),
        qtyReject: normalizeNonNegative(row.qtyReject),
        inputMaterialQty: normalizeNonNegative(row.inputMaterialQty),
        materialPurgeQty: normalizeNonNegative(row.materialPurgeQty),
        materialRunnerQty: normalizeNonNegative(row.materialRunnerQty),
        manPowerStd: row.manPowerStd ?? undefined,
        manPowerAct: row.manPowerAct ?? undefined,
        cycleTimeStd:
          normalizeNonNegative(row.cycleTimeStd) > 0
            ? normalizeNonNegative(row.cycleTimeStd)
            : undefined,
        cycleTimeAct:
          normalizeNonNegative(row.cycleTimeAct) > 0
            ? normalizeNonNegative(row.cycleTimeAct)
            : undefined,
        cavityStd: row.cavityStd ?? undefined,
        cavityAct: row.cavityAct ?? undefined,
        rejectBreakdown,
        downtimeBreakdown,
        totalDowntime: finalTotalDowntime,
        notes: `${IMPORT_TAG} ${row.sourceSheet}#${row.sourceRow} ${row.notes ?? ""}`.trim(),
        status: ReportStatus.APPROVED,
        createdById: operator.id,
        checkedById: checker.id,
        checkedAt: new Date(),
        metaData: {
          source: "DAILY RIGID - FEBRUARI 2026 (1).xlsx",
          sourceSheet: row.sourceSheet,
          sourceRow: row.sourceRow,
        },
      },
    });

    created.push({
      sheet: row.sourceSheet,
      row: row.sourceRow,
      reportType: row.reportType,
      proNumber: row.proNumber,
      machine: row.machineName,
      shift: row.shift,
      passOn: row.qtyPassOn,
      reject: row.qtyReject,
    });
  }

  console.table(created);
  console.log(
    `[inject-rigid-daily-sample] Done. Inserted ${created.length} APPROVED rigid reports from sample.`,
  );
}

main()
  .catch((err) => {
    console.error("[inject-rigid-daily-sample] Failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

