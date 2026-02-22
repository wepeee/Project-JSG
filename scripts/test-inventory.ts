import {
  PrismaClient,
  ReportStatus,
  TxnType,
  LocationType,
  ProType,
  MachineType,
  LphType,
} from "../generated/prisma";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

// --- MOCK CONTEXT ---
async function approveReportMock(reportId: string, userId: string) {
  console.log(`\n--- Approving Report ${reportId} ---`);

  // 1. Fetch Report
  const report = await prisma.productionReport.findUnique({
    where: { id: reportId },
    include: {
      proses: {
        include: {
          machine: true,
          pro: {
            include: {
              proses: {
                orderBy: { orderNo: "asc" },
                include: { machine: true },
              },
            },
          },
        },
      },
    },
  });

  if (!report) throw new Error("Report not found");
  if (report.status === ReportStatus.APPROVED || report.stockPostedAt)
    throw new Error("Already Approved");

  // 2. Prepare Data
  const { proses } = report;
  const { pro } = proses;
  const sortedSteps = pro.proses.sort((a, b) => a.orderNo - b.orderNo);
  const currentStepIdx = sortedSteps.findIndex((s) => s.id === proses.id);
  const isLastStep = currentStepIdx === sortedSteps.length - 1;

  const currentOutputItem = proses.partNumber || "UNKNOWN-PN";
  const fgItem = pro.partNumber || currentOutputItem;

  const qtyPassOn = Number(report.qtyPassOn) || 0;
  const qtyHold = Number(report.qtyHold) || 0;
  const qtyReject = Number(report.qtyReject) || 0;

  // 3. Transaction
  await prisma.$transaction(async (tx) => {
    // Helper
    const ensureLocation = async (
      code: string,
      type: string,
      name: string,
      machineId?: number | null,
    ) => {
      return await tx.inventoryLocation.upsert({
        where: { code },
        update: {},
        create: { code, type: type as LocationType, name, machineId },
      });
    };

    const now = new Date();
    const groupId = randomUUID();

    // 1. Output
    if (qtyPassOn > 0) {
      if (isLastStep) {
        const loc = await ensureLocation("FG_WH", "FG", "FG Warehouse");
        await tx.inventoryTxn.create({
          data: {
            groupId,
            date: now,
            type: TxnType.IN,
            itemId: fgItem,
            qty: qtyPassOn,
            locationId: loc.id,
            proId: pro.id,
            prosesId: proses.id,
            productionReportId: report.id,
            notes: "FG Output",
          },
        });
      } else {
        const machineId = proses.machineId;
        const code = machineId ? `WIP_M_${machineId}` : `WIP_UNASSIGNED`;
        const machineName = proses.machine ? proses.machine.name : "Unassigned";
        const loc = await ensureLocation(
          code,
          "WIP",
          `WIP Bin ${machineName}`,
          machineId || null,
        );
        await tx.inventoryTxn.create({
          data: {
            groupId,
            date: now,
            type: TxnType.IN,
            itemId: currentOutputItem,
            qty: qtyPassOn,
            locationId: loc.id,
            proId: pro.id,
            prosesId: proses.id,
            productionReportId: report.id,
            notes: "WIP Output",
          },
        });
      }
    }

    // 2. Hold
    if (qtyHold > 0) {
      const loc = await ensureLocation("HOLD_QA", "HOLD", "QA Hold");
      await tx.inventoryTxn.create({
        data: {
          groupId,
          date: now,
          type: TxnType.IN,
          itemId: currentOutputItem,
          qty: qtyHold,
          locationId: loc.id,
          proId: pro.id,
          prosesId: proses.id,
          productionReportId: report.id,
          notes: "QA Hold",
        },
      });
    }

    // 3. Reject
    if (qtyReject > 0) {
      const loc = await ensureLocation("SCRAP_BIN", "SCRAP", "Scrap Bin");
      await tx.inventoryTxn.create({
        data: {
          groupId,
          date: now,
          type: TxnType.IN,
          itemId: currentOutputItem,
          qty: qtyReject,
          locationId: loc.id,
          proId: pro.id,
          prosesId: proses.id,
          productionReportId: report.id,
          notes: "Scrap",
        },
      });
    }

    // 4. Update Report (Atomic Check)
    await tx.productionReport.update({
      where: { id: report.id, stockPostedAt: null },
      data: {
        status: ReportStatus.APPROVED,
        checkedById: userId,
        checkedAt: now,
        stockPostedAt: now,
      },
    });

    console.log(`>> Report ${reportId} APPROVED and Posted successfully.`);
  });
}

async function voidReportMock(
  reportId: string,
  userId: string,
  reason: string,
) {
  console.log(`\n--- VOID Report ${reportId} ---`);
  const report = await prisma.productionReport.findUnique({
    where: { id: reportId },
  });
  if (!report || report.status !== ReportStatus.APPROVED)
    throw new Error("Invalid report status for Void");

  await prisma.$transaction(async (tx) => {
    const txns = await tx.inventoryTxn.findMany({
      where: { productionReportId: reportId },
    });
    const now = new Date();
    const groupId = randomUUID();

    for (const t of txns) {
      // Logic reversal: IN -> OUT, OUT -> IN
      let revType: TxnType = TxnType.OUT;
      if (t.type === TxnType.OUT) revType = TxnType.IN;
      // Skip ADJUST
      if (t.type === TxnType.ADJUST) continue;

      await tx.inventoryTxn.create({
        data: {
          groupId,
          date: now,
          type: revType,
          itemId: t.itemId,
          qty: t.qty,
          locationId: t.locationId,
          proId: t.proId,
          prosesId: t.prosesId,
          productionReportId: reportId,
          notes: `VOID: ${reason}`,
        },
      });
    }

    await tx.productionReport.update({
      where: { id: reportId },
      data: {
        status: ReportStatus.VOID,
        voidReason: reason,
        voidedById: userId,
        voidedAt: now,
      },
    });
    console.log(`>> Report ${reportId} VOIDED successfully.`);
  });
}

async function main() {
  console.log("Starting Inventory Test Suite...");

  try {
    // B. SETUP
    const username = `Tester-${Date.now()}`;
    const user = await prisma.user.create({
      data: { username, passwordHash: "x", role: "SUPERADMIN" },
    });
    const machine = await prisma.machine.create({
      data: {
        name: "Machine Test 01",
        type: "RIGID",
        stdOutputPerHour: 100,
        stdOutputPerShift: 800,
        uom: "pcs",
      },
    });

    const pro = await prisma.pro.create({
      data: {
        proNumber: `T${randomUUID().substring(0, 8)}`, // 9 chars max
        productName: "Test Product FG",
        partNumber: "FG-12345",
        qtyPoPcs: 1000,
        status: "OPEN",
        type: "RIGID",
      },
    });

    const step1 = await prisma.proses.create({
      data: {
        proId: pro.id,
        orderNo: 1,
        partNumber: "WIP-STEP-1",
        machineId: machine.id,
      },
    });

    const step2 = await prisma.proses.create({
      data: {
        proId: pro.id,
        orderNo: 2,
        partNumber: "FG-12345",
        machineId: machine.id,
      },
    });

    console.log("Setup complete: PRO", pro.proNumber);

    // --- SKENARIO A (Step 1 WIP) ---
    const repA = await prisma.productionReport.create({
      data: {
        prosesId: step1.id,
        reportDate: new Date(),
        shift: 1,
        operatorName: "Op1",
        qtyReject: 10,
        qtyPassOn: 80,
        qtyHold: 5,
        status: "PENDING",
        reportType: "INJECTION",
      },
    });

    await approveReportMock(repA.id, user.id);

    // --- SKENARIO B (Step 2 FG) ---
    const repB = await prisma.productionReport.create({
      data: {
        prosesId: step2.id,
        reportDate: new Date(),
        shift: 1,
        operatorName: "Op2",
        qtyReject: 3,
        qtyPassOn: 50,
        qtyHold: 2,
        status: "PENDING",
        reportType: "INJECTION",
      },
    });

    await approveReportMock(repB.id, user.id);

    // --- SKENARIO C (Machine Null & Not Last Step) ---
    const proC = await prisma.pro.create({
      data: {
        proNumber: `T${randomUUID().substring(0, 8)}`,
        productName: "Test C",
        partNumber: "FG-C",
        qtyPoPcs: 100,
        status: "OPEN",
        type: "RIGID",
      },
    });

    const stepC1 = await prisma.proses.create({
      data: {
        proId: proC.id,
        orderNo: 1,
        partNumber: "WIP-C1",
        machineId: null,
      }, // Machine NULL
    });

    // Create Step 2 so Step 1 is NOT last
    await prisma.proses.create({
      data: {
        proId: proC.id,
        orderNo: 2,
        partNumber: "FG-C",
        machineId: machine.id,
      },
    });

    const repC = await prisma.productionReport.create({
      data: {
        prosesId: stepC1.id,
        reportDate: new Date(),
        shift: 1,
        operatorName: "OpC",
        qtyPassOn: 10,
        status: "PENDING",
        qtyReject: 0,
        qtyHold: 0,
        reportType: "INJECTION",
      },
    });

    await approveReportMock(repC.id, user.id);

    // --- VERIFICATION & EVIDENCE GENERATION ---
    console.log("\n=== EVIDENCE: SCENARIO A (WIP) ===");
    const finalTxnsA = await prisma.inventoryTxn.findMany({
      where: { productionReportId: repA.id },
      select: {
        type: true,
        itemId: true,
        qty: true,
        locationId: true,
        groupId: true,
        productionReportId: true,
      },
    });
    console.log(JSON.stringify(finalTxnsA, null, 2));

    console.log("\n=== EVIDENCE: SCENARIO B (FG) ===");
    const finalTxnsB = await prisma.inventoryTxn.findMany({
      where: { productionReportId: repB.id },
      include: { location: true },
    });
    // Map to simplified object for readable log
    const logB = finalTxnsB.map((t) => ({
      type: t.type,
      itemId: t.itemId,
      qty: t.qty,
      location: t.location.code,
      groupId: t.groupId,
    }));
    console.log(JSON.stringify(logB, null, 2));

    console.log("\n=== EVIDENCE: SCENARIO C (WIP UNASSIGNED) ===");
    const finalTxnsC = await prisma.inventoryTxn.findMany({
      where: { productionReportId: repC.id },
      include: { location: true },
    });
    const logC = finalTxnsC.map((t) => ({
      type: t.type,
      itemId: t.itemId,
      qty: t.qty,
      location: t.location.code,
    }));
    console.log(JSON.stringify(logC, null, 2));

    // --- TEST DOUBLE APPROVE ---
    try {
      await approveReportMock(repA.id, user.id);
      console.error("FAILED Double Approve: Should have thrown");
    } catch (e) {
      console.log("PASSED Double Approve: Caught expected error");
    }

    // --- TEST VOID ---
    await voidReportMock(repA.id, user.id, "Mistake");

    // --- VOID NET BALANCE CHECK ---
    console.log("\n=== EVIDENCE: VOID REVERSAL (Scenario A) ===");
    // Scenario A txns should strictly sum to 0 per item+location
    const allVoidTxns = await prisma.inventoryTxn.findMany({
      where: { productionReportId: repA.id },
    });

    // Calculate Net
    const balanceMap: Record<string, number> = {};
    for (const t of allVoidTxns) {
      const key = `${t.itemId}_LOC${t.locationId}`;
      const val = t.type === "IN" ? Number(t.qty) : -Number(t.qty);
      balanceMap[key] = (balanceMap[key] || 0) + val;
    }

    console.log("Net Balance per Location (Should be 0):");
    console.log(JSON.stringify(balanceMap, null, 2));

    const isZero = Object.values(balanceMap).every((v) => Math.abs(v) < 0.0001);
    console.log(
      `\n>>> VOID INTEGRITY CHECK: ${isZero ? "PASSED (Net 0)" : "FAILED (Non-zero balance)"}`,
    );
  } catch (e) {
    console.error("TEST SUITE ERROR:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
