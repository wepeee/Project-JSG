import "dotenv/config";
import { hash } from "bcryptjs";
import { LphType, PrismaClient, ProType, ReportStatus, Role, Uom } from "../generated/prisma";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const IMPORT_TAG = "[IMPORT_DAILY_TEST]";

type DailySampleRow = {
  sourceRow: number;
  proNumber: string;
  productName: string;
  partNumber: string | null;
  machineName: string;
  operatorName: string;
  reportDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  shift: number;
  qtyPassOn: number;
  qtyHold: number;
  qtyWip: number;
  qtyReject: number;
  inputMaterialQty: number;
  totalDowntime: number;
  notes: string | null;
  rejectBreakdown: Record<string, number>;
  downtimeBreakdown: Record<string, number>;
};

const PAPER_DOWNTIME_KEY_MAP: Record<string, string> = {
  "PLANNED:TROUBLE_PLN": "Trouble PLN",
  "PLANNED:TRIAL": "Trial",
  "PLANNED:PREVENTIVE_MAINTENANCE": "Preventive Maintenance",
  "PLANNED:PREVENTIVE MAINTENANCE": "Preventive Maintenance",
  "PLANNED:ISTIRAHAT": "Istirahat",
  "PLANNED:LAIN_LAIN": "Lain-lain",
  "PLANNED:OTHERS": "Lain-lain",
  "UNPLANNED:TUNGGU_APPROVAL": "Tunggu Approval",
  "UNPLANNED:TUNGGU_MATERIAL": "Tunggu Material",
  "UNPLANNED:SETUP_CHANGE_OVER": "Set Up & Change Over",
  "UNPLANNED:SET UP & CHANGE OVER": "Set Up & Change Over",
  "UNPLANNED:MACHINE_PROBLEM": "Machine Problem",
  "UNPLANNED:MENCARI_TOOLS": "Mencari Tools",
  "UNPLANNED:RUNNING_IN": "Running In",
  "UNPLANNED:OPERATOR_ISSUE": "Operator Issue",
  "UNPLANNED:ADJUSTMENT_PROCESS": "Adjustment Process",
  "UNPLANNED:LAIN_LAIN": "Lain-lain",
};

const PAPER_REJECT_KEY_MAP: Record<string, string> = {
  BINTIK: "Bintik",
  WARNA: "Warna",
  BARET: "Baret",
  BERCAK: "Bercak",
  BOLD: "Bold",
  PETAL: "Petal",
  LAMINASI: "Laminasi",
  UV_SPOT: "UV Spot",
  HOT_PRINT: "Hot Print",
  EMBOSS: "Emboss",
  CREASING: "Creasing",
  SOBEK: "Sobek",
  LEM: "Lem",
  KOTOR: "Kotor",
  LAIN_LAIN: "Lain-lain",
  REJECT_SET_UP: "Reject Setup",
  "REJECT SET UP": "Reject Setup",
  REJECT_PROCESS: "Reject Process",
  "REJECT PROCESS": "Reject Process",
};

function canonicalBreakdownKey(rawKey: string) {
  const key = String(rawKey ?? "").trim();
  if (!key) return "";

  const [prefixRaw, restRaw] = key.includes(":") ? key.split(":", 2) : ["", key];
  const normalizePart = (input: string) =>
    input
      .trim()
      .replace(/[&/]/g, " ")
      .replace(/[-]+/g, " ")
      .replace(/\s+/g, " ")
      .toUpperCase()
      .replace(/\s/g, "_");

  const prefix = normalizePart(prefixRaw ?? "");
  const rest = normalizePart(restRaw ?? "");
  return prefix ? `${prefix}:${rest}` : rest;
}

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
  const [y, m, d] = dateStr.split("-").map((v) => Number(v));
  if (!y || !m || !d) return new Date();
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

function combineDateTime(dateStr: string, hhmm: string) {
  const base = parseDateOnly(dateStr);
  const [hhRaw, mmRaw] = hhmm.split(":");
  const hh = Number(hhRaw ?? 0);
  const mm = Number(mmRaw ?? 0);
  base.setHours(Number.isFinite(hh) ? hh : 0, Number.isFinite(mm) ? mm : 0, 0, 0);
  return base;
}

function normalizePaperDowntimeBreakdown(
  raw: Record<string, number> | null | undefined,
) {
  const out: Record<string, number> = {};
  for (const [key, value] of Object.entries(raw ?? {})) {
    const canonical = canonicalBreakdownKey(key);
    const target =
      PAPER_DOWNTIME_KEY_MAP[canonical] ??
      PAPER_DOWNTIME_KEY_MAP[key] ??
      canonical ??
      key;
    const qty = Number(value ?? 0);
    if (!Number.isFinite(qty) || qty <= 0) continue;
    out[target] = Number(((out[target] ?? 0) + qty).toFixed(3));
  }
  return out;
}

function normalizePaperRejectBreakdown(
  raw: Record<string, number> | null | undefined,
) {
  const out: Record<string, number> = {};
  for (const [key, value] of Object.entries(raw ?? {})) {
    const canonical = canonicalBreakdownKey(key);
    const target =
      PAPER_REJECT_KEY_MAP[canonical] ??
      PAPER_REJECT_KEY_MAP[key] ??
      canonical ??
      key;
    const qty = Number(value ?? 0);
    if (!Number.isFinite(qty) || qty <= 0) continue;
    out[target] = Number(((out[target] ?? 0) + qty).toFixed(3));
  }
  return out;
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

async function ensurePaperMachine(name: string) {
  const normalized = name.trim();
  const existing = await db.machine.findFirst({
    where: { type: "PAPER", name: normalized },
    orderBy: { id: "asc" },
  });
  if (existing) return existing;

  return db.machine.create({
    data: {
      name: normalized,
      type: "PAPER",
      stdOutputPerHour: 100,
      stdOutputPerShift: 800,
      uom: Uom.sheet,
      remark: "Created by inject-paper-daily-sample",
    },
  });
}

async function ensureProAndProses(
  row: DailySampleRow,
  machineId: number,
  ppicId: string,
) {
  const pro = await db.pro.upsert({
    where: { proNumber: row.proNumber },
    update: {
      updatedById: ppicId,
      type: ProType.PAPER,
    },
    create: {
      proNumber: row.proNumber,
      productName: row.productName,
      partNumber: row.partNumber ?? undefined,
      qtyPoPcs: Math.max(1, Math.round(row.qtyPassOn + row.qtyHold + row.qtyWip)),
      type: ProType.PAPER,
      startDate: parseDateOnly(row.reportDate),
      createdById: ppicId,
      updatedById: ppicId,
    },
  });

  const existingProses = await db.proses.findMany({
    where: { proId: pro.id },
    orderBy: [{ orderNo: "asc" }, { id: "asc" }],
    take: 1,
  });
  if (existingProses.length > 0) return existingProses[0]!;

  return db.proses.create({
    data: {
      proId: pro.id,
      orderNo: 1,
      machineId,
      startDate: parseDateOnly(row.reportDate),
      estimatedShifts: 1,
      up: null,
      partNumber: row.partNumber ?? undefined,
    },
  });
}

async function main() {
  console.log(`[inject-paper-daily-sample] Using DB from ${dbConfig.source}`);
  const jsonPath = resolve(process.cwd(), "scripts/data/paper-daily-sample.json");
  const rows = JSON.parse(readFileSync(jsonPath, "utf8")) as DailySampleRow[];
  if (!rows.length) {
    throw new Error("No rows found in scripts/data/paper-daily-sample.json");
  }

  const ppic =
    (await db.user.findFirst({ where: { role: Role.PPIC } })) ??
    (await ensureUser(Role.PPIC, "ppic_import_daily"));

  const operator =
    (await db.user.findFirst({ where: { role: Role.OPERATOR } })) ??
    (await ensureUser(Role.OPERATOR, "operator_import_daily"));

  const checker =
    (await db.user.findFirst({
      where: { role: { in: [Role.SUPERADMIN, Role.ADMIN] } },
    })) ??
    (await ensureUser(Role.ADMIN, "admin_import_daily"));

  const removed = await db.productionReport.deleteMany({
    where: {
      reportType: LphType.PAPER,
      notes: { contains: IMPORT_TAG },
    },
  });
  if (removed.count > 0) {
    console.log(
      `[inject-paper-daily-sample] Removed old imported rows: ${removed.count}`,
    );
  }

  const created: Array<{
    sourceRow: number;
    proNumber: string;
    machine: string;
    shift: number;
    qtyPassOn: number;
    qtyReject: number;
  }> = [];

  for (const row of rows) {
    const machine = await ensurePaperMachine(row.machineName);
    const proses = await ensureProAndProses(row, machine.id, ppic.id);

    const startTime = combineDateTime(row.reportDate, row.startTime);
    const endTime = combineDateTime(row.reportDate, row.endTime);
    const reportDate = parseDateOnly(row.reportDate);

    await db.productionReport.create({
      data: {
        prosesId: proses.id,
        reportDate,
        shift: Math.min(3, Math.max(1, row.shift || 1)),
        operatorName: row.operatorName,
        reportType: LphType.PAPER,
        startTime,
        endTime,
        qtyPassOn: row.qtyPassOn,
        qtyHold: row.qtyHold,
        qtyWip: row.qtyWip,
        qtyReject: row.qtyReject,
        inputMaterialQty: row.inputMaterialQty,
        rejectBreakdown: normalizePaperRejectBreakdown(row.rejectBreakdown),
        downtimeBreakdown: normalizePaperDowntimeBreakdown(row.downtimeBreakdown),
        totalDowntime: row.totalDowntime,
        notes: `${IMPORT_TAG} row:${row.sourceRow} ${row.notes ?? ""}`.trim(),
        status: ReportStatus.APPROVED,
        createdById: operator.id,
        checkedById: checker.id,
        checkedAt: new Date(),
        metaData: {
          source: "DAILY NEW",
          sourceRow: row.sourceRow,
        },
      },
    });

    created.push({
      sourceRow: row.sourceRow,
      proNumber: row.proNumber,
      machine: machine.name,
      shift: row.shift,
      qtyPassOn: row.qtyPassOn,
      qtyReject: row.qtyReject,
    });
  }

  console.table(created);
  console.log(
    `[inject-paper-daily-sample] Done. Inserted ${created.length} APPROVED PAPER reports from DAILY sample.`,
  );
}

main()
  .catch((err) => {
    console.error("[inject-paper-daily-sample] Failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
