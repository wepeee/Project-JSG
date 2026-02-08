import {
  PrismaClient,
  ProType,
  LphType,
  Role,
  ReportStatus,
  MachineType,
  Uom,
} from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Adding verified Rigid dummy reports...");

  // 1. Ensure Superadmin user exists for verification
  let superadmin = await prisma.user.findFirst({
    where: { role: Role.SUPERADMIN },
  });

  if (!superadmin) {
    superadmin = await prisma.user.create({
      data: {
        username: "superadmin_dummy",
        passwordHash: "dummy",
        role: Role.SUPERADMIN,
      },
    });
  }

  // 2. Define the 4 types of Rigid reports needed
  const rigidTypes = [
    {
      type: LphType.INJECTION,
      processCode: "11",
      processName: "INJECTION MOLDING",
      machineName: "IMM-99",
      items: [
        {
          product: "BTL 100ML",
          partNo: "BTL-100-NJ",
          color: "Putih",
          qty: 5000,
        },
        {
          product: "CAP FLIP",
          partNo: "CAP-FLP-NJ",
          color: "Merah",
          qty: 12000,
        },
      ],
    },
    {
      type: LphType.BLOW_MOULDING,
      processCode: "12",
      processName: "BLOW MOLDING",
      machineName: "EBM-88",
      items: [
        {
          product: "BTL 200ML",
          partNo: "BTL-200-BL",
          color: "Natural",
          qty: 3000,
        },
        {
          product: "JERRY CAN 5L",
          partNo: "JC-5L-BL",
          color: "Biru",
          qty: 1000,
        },
      ],
    },
    {
      type: LphType.PRINTING, // Assuming Rigid Printing
      processCode: "14",
      processName: "PRINTING RIGID",
      machineName: "PRINT-77",
      items: [
        {
          product: "BTL PRINTED",
          partNo: "BTL-PRT",
          color: "Design A",
          qty: 2500,
        },
        {
          product: "CUP PRINTED",
          partNo: "CUP-PRT",
          color: "Design B",
          qty: 8000,
        },
      ],
    },
    {
      type: LphType.PACKING_ASSEMBLY,
      processCode: "29",
      processName: "PACKING ASSEMBLY",
      machineName: "ASSEMBLY-LIN-1",
      items: [
        {
          product: "SET BTL+CAP",
          partNo: "SET-BTL-CAP",
          color: "Mix",
          qty: 500,
        },
        { product: "GIFT SET", partNo: "GIFT-BOX", color: "Special", qty: 200 },
      ],
    },
  ];

  for (const rt of rigidTypes) {
    console.log(`Processing ${rt.type}...`);

    // Ensure Process exists
    let process = await prisma.process.findUnique({
      where: { code: rt.processCode },
    });
    if (!process) {
      process = await prisma.process.create({
        data: {
          code: rt.processCode,
          name: rt.processName,
          type: ProType.RIGID,
        },
      });
    }

    // Ensure Machine exists
    let machine = await prisma.machine.findFirst({
      where: { name: rt.machineName },
    });
    if (!machine) {
      machine = await prisma.machine.create({
        data: {
          name: rt.machineName,
          type: MachineType.RIGID,
          uom: Uom.pcs,
          stdOutputPerHour: 1000,
          stdOutputPerShift: 8000,
        },
      });
    }

    // Create 2 Reports for this type
    let counter = 1;
    for (const item of rt.items) {
      // Create Pro
      const proNumber = `DUM-${rt.processCode}-${counter++}`;
      let pro = await prisma.pro.findUnique({ where: { proNumber } });
      if (!pro) {
        pro = await prisma.pro.create({
          data: {
            proNumber,
            productName: item.product,
            qtyPoPcs: item.qty * 2, // PO larger than report
            status: "IN_PROGRESS",
            type: ProType.RIGID,
            processId: process.id,
          },
        });
      }

      // Create ProStep
      let step = await prisma.proStep.findFirst({
        where: { proId: pro.id, orderNo: 1 },
      });
      if (!step) {
        step = await prisma.proStep.create({
          data: {
            proId: pro.id,
            orderNo: 1,
            machineId: machine.id,
            partNumber: item.partNo,
            estimatedShifts: 2,
            startDate: new Date(),
          },
        });
      }

      // Create Production Report
      await prisma.productionReport.create({
        data: {
          proStepId: step.id,
          reportDate: new Date(),
          shift: 1,
          operatorName: "Dummy Operator",
          reportType: rt.type,
          startTime: new Date(new Date().setHours(8, 0, 0, 0)),
          endTime: new Date(new Date().setHours(16, 0, 0, 0)),

          // Rigid specifics
          manPowerStd: 2,
          manPowerAct: 2,
          cycleTimeStd: 12.5,
          cycleTimeAct: 12.8,
          cavityStd: 4,
          cavityAct: 4,

          // Material
          inputMaterialQty: 100, // kg

          // Output
          qtyGood: item.qty,
          qtyReject: 50,
          qtyPassOn: 0,
          qtyHold: 0,
          qtyWip: 0,

          totalDowntime: 30, // 30 mins
          downtimeBreakdown: { Setup: 15, "No Material": 15 },
          rejectBreakdown: { Scratch: 20, Bubble: 30 },

          notes: "Dummy report verified by script",

          // Verification
          status: ReportStatus.APPROVED,
          checkedById: superadmin.id,
          checkedAt: new Date(),

          createdById: superadmin.id,
        },
      });

      console.log(`  Added approved report for ${item.product}`);
    }
  }

  console.log("Done adding Rigid reports.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
