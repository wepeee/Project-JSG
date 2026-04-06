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
  productWeight?: number | null;
  notes: string | null;
  rejectBreakdown: Record<string, number>;
  downtimeBreakdown: Record<string, number>;
};

type RigidReportType = RigidSampleRow["reportType"];

const RIGID_DOWNTIME_KEY_MAP: Record<RigidReportType, Record<string, string>> = {
  INJECTION: {
    "PLANNED:NO_ORDER": "No Order",
    "PLANNED:ISTIRAHAT": "Istirahat",
    "PLANNED:CIL_CLEAN": "Cil / Clean",
    "PLANNED:TRIAL": "Trial",
    "PLANNED:PREVENTIVE": "Preventive",
    "UNPLANNED:MATERIAL": "Material",
    "UNPLANNED:ELECTRIC": "Electrik",
    "UNPLANNED:ELEKTRIK": "Electrik",
    "UNPLANNED:MESIN": "Mesin",
    "UNPLANNED:START_MESIN": "Start Mesin",
    "UNPLANNED:SETUP": "Set Up",
    "UNPLANNED:SET_UP": "Set Up",
    "UNPLANNED:APPROVE": "Approve",
    "UNPLANNED:MOLD_TOOLS": "Mold/Tools",
    "UNPLANNED:PROSES": "Proses",
    "UNPLANNED:MATERIAL_HABIS": "Material Habis",
    "UNPLANNED:MATERIAL_TELAT": "Material Telat",
    "UNPLANNED:MAN_POWER": "Man Power",
    "UNPLANNED:OTHERS": "Others",
    "UNPLANNED:OTHER": "Others",
  },
  BLOW_MOULDING: {
    "PLANNED:NO_ORDER": "No Order",
    "PLANNED:ISTIRAHAT": "Istirahat",
    "PLANNED:CIL_CLEAN": "Cil / Clean",
    "PLANNED:TRIAL": "Trial",
    "PLANNED:PREVENTIVE": "Preventive",
    "UNPLANNED:MATERIAL": "Material",
    "UNPLANNED:ELECTRIC": "Electrik",
    "UNPLANNED:ELEKTRIK": "Electrik",
    "UNPLANNED:MESIN": "Mesin",
    "UNPLANNED:START_MESIN": "Start Mesin",
    "UNPLANNED:SETUP": "Set Up",
    "UNPLANNED:SET_UP": "Set Up",
    "UNPLANNED:APPROVE": "Approve",
    "UNPLANNED:MOLD_TOOLS": "Mold/Tools",
    "UNPLANNED:PROSES": "Proses",
    "UNPLANNED:MATERIAL_HABIS": "Material Habis",
    "UNPLANNED:MATERIAL_TELAT": "Material Telat",
    "UNPLANNED:MAN_POWER": "Man Power",
    "UNPLANNED:OTHERS": "Others",
    "UNPLANNED:OTHER": "Others",
  },
  PRINTING: {
    "PLANNED:CLEAN": "CLEAN",
    "PLANNED:NO_ORDER": "NO ORDER",
    "PLANNED:ISTIRAHAT": "ISTIRAHAT",
    "PLANNED:TRIAL": "TRIAL",
    "PLANNED:PREVEN_MESIN": "PREVEN MESIN",
    "UNPLANNED:ELECTRIC": "ELECTRIC",
    "UNPLANNED:MACHINE": "MACHINE",
    "UNPLANNED:PNUMATIC": "PNUMATIC",
    "UNPLANNED:UTILITY": "UTILITY",
    "UNPLANNED:START_MESIN": "START MESIN",
    "UNPLANNED:SETUP": "SET UP",
    "UNPLANNED:SET_UP": "SET UP",
    "UNPLANNED:APPROVAL": "APPROVAL",
    "UNPLANNED:SCREEN": "SCREEN",
    "UNPLANNED:PROSES": "PROSES",
    "UNPLANNED:MATERIAL": "MATERIAL",
    "UNPLANNED:WARNA_TIDAK_STANDART": "WARNA TIDAK STANDART",
    "UNPLANNED:TOOLS": "TOOLS",
    "UNPLANNED:MAN": "MAN",
    "UNPLANNED:OTHER": "OTHER",
    "UNPLANNED:OTHERS": "OTHER",
  },
  PACKING_ASSEMBLY: {
    "PLANNED:CLEAN": "CLEAN",
    "PLANNED:NO_ORDER": "NO ORDER",
    "PLANNED:ISTIRAHAT": "ISTIRAHAT",
    "PLANNED:TRIAL": "TRIAL",
    "UNPLANNED:MATERIAL": "Material",
    "UNPLANNED:WARNA_TIDAK_STD": "WARNA TIDAK STD",
    "UNPLANNED:APPROVE": "Approve",
    "UNPLANNED:SETUP": "Set Up",
    "UNPLANNED:SET_UP": "Set Up",
    "UNPLANNED:AIRBLOW": "Airblow",
    "UNPLANNED:PROSES": "Proses",
    "UNPLANNED:MAN": "Man",
    "UNPLANNED:OTHER": "Other",
    "UNPLANNED:OTHERS": "Other",
  },
};

const RIGID_REJECT_KEY_MAP: Record<RigidReportType, Record<string, string>> = {
  INJECTION: {
    BINTIK_HITAM: "Bintik Hitam",
    PS_DEFORMASI: "P/S Deformasi",
    DEFORMASI: "P/S Deformasi",
    WARNA_STD: "Warna # Std",
    APPEARANCE_STD: "Appearance # Std",
    DIMENSI_STD: "Dimensi # Std",
    KOTOR_FET: "Kotor Fet",
    PROSES: "Proses",
    BARET: "Baret",
  },
  BLOW_MOULDING: {
    BINTIK_HITAM: "Bintik Hitam",
    PS_DEFORMASI: "P/S Deformasi",
    DEFORMASI: "P/S Deformasi",
    WARNA_STD: "Warna # Std",
    APPEARANCE_STD: "Appearance # Std",
    DIMENSI_STD: "Dimensi # Std",
    KOTOR_FET: "Kotor Fet",
    PROSES: "Proses",
    BARET: "Baret",
  },
  PRINTING: {
    B_SPOT_CEKUNG: "B. Spot/Cekung",
    KOTOR_VAT: "Kotor Vat",
    BLOBOR_CEMBUNG: "Blobor/Cembung",
    PRINT_PETHAL: "Print Pethal",
    MBAYANG: "Mbayang/Tebal Tipis",
    MBAYANG_TEBAL_TIPIS: "Mbayang/Tebal Tipis",
    PRINT_GESER: "Print Geser",
    WARNA_STD: "Warna # Std",
    BARET: "Baret",
    BOTOL_BERTEKSTUR: "Botol Bertekstur",
    TIDAK_PRESS: "Tidak Press",
    PECAH: "Pecah",
    LAIN_LAIN: "Lain-lain",
  },
  PACKING_ASSEMBLY: {
    B_SPOT: "B. Spot",
    CEKUNG: "Cekung",
    BARET: "Baret",
    BUBLE: "Buble",
    PRINT_PETHAL: "Print Pethal",
    PRINT_MIRING: "Print Miring",
    PRINT_BLOBOR: "Print Blobor",
    PECAH: "Pecah",
    ACRYLIC_MIX_UP: "Acrylic Mix Up",
    LENGKET: "Lengket",
    BOTOL_BERTEKSTUR: "Botol Bertekstur",
    TERTEMPEL_STICKER: "Tertempel Sticker",
    KONSTAMINASI: "Konstaminasi",
    WARNA_TIDAK_STANDART: "Warna Tidak Standart",
    BURAM: "Buram",
    KOTOR_FAT: "Kotor Fat",
    TOTAL_REJECT_2: "Other",
    TOTAL_REJECT_3: "Other",
    TOTAL_REJECT_4: "Other",
    TOTAL_REJECT_5: "Other",
    TOTAL_REJECT_6: "Other",
  },
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

function normalizeDowntimeBreakdown(
  reportType: RigidReportType,
  record: Record<string, number>,
) {
  const out: Record<string, number> = {};
  const map = RIGID_DOWNTIME_KEY_MAP[reportType] ?? {};
  for (const [key, value] of Object.entries(record ?? {})) {
    const canonical = canonicalBreakdownKey(key);
    const target = map[canonical] ?? map[key] ?? canonical ?? key;
    const n = normalizeNonNegative(value);
    if (n > 0) {
      out[target] = Number(((out[target] ?? 0) + n).toFixed(3));
    }
  }
  return out;
}

function normalizeRejectBreakdown(
  reportType: RigidReportType,
  record: Record<string, number>,
) {
  const out: Record<string, number> = {};
  const map = RIGID_REJECT_KEY_MAP[reportType] ?? {};
  for (const [key, value] of Object.entries(record ?? {})) {
    const canonical = canonicalBreakdownKey(key);
    const target = map[canonical] ?? map[key] ?? canonical ?? key;
    const n = normalizeNonNegative(value);
    if (n > 0) {
      out[target] = Number(((out[target] ?? 0) + n).toFixed(3));
    }
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

    const rejectBreakdown = normalizeRejectBreakdown(
      row.reportType,
      row.rejectBreakdown,
    );
    const downtimeBreakdown = normalizeDowntimeBreakdown(
      row.reportType,
      row.downtimeBreakdown,
    );
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
          productWeight:
            normalizeNonNegative(row.productWeight) > 0
              ? normalizeNonNegative(row.productWeight)
              : undefined,
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
