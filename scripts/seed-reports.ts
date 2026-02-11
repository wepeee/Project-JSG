import {
  PrismaClient,
  ProStatus,
  ReportStatus,
  LphType,
  Uom,
  MachineType,
  ProType,
} from "../generated/prisma";

const db = new PrismaClient();

async function main() {
  console.log("Start seeding dummy reports...");

  // 1. Get or Create Machine
  let machineId: number;
  const existingMachine = await db.machine.findFirst();

  if (!existingMachine) {
    const newMachine = await db.machine.create({
      data: {
        name: "Mesin Potong 01",
        stdOutputPerHour: 1000,
        stdOutputPerShift: 7000,
        uom: Uom.sheet,
        type: MachineType.PAPER,
      },
    });
    machineId = newMachine.id;
    console.log("Created dummy machine");
  } else {
    machineId = existingMachine.id;
  }

  // 1b. Get or Create Rigid Machine (Injection)
  let rigidMachineId: number;
  const existingRigidMachine = await db.machine.findFirst({
    where: { type: MachineType.RIGID },
  });

  if (!existingRigidMachine) {
    const newRigidMachine = await db.machine.create({
      data: {
        name: "Mesin Injection 01",
        stdOutputPerHour: 500,
        stdOutputPerShift: 3500,
        uom: Uom.pcs,
        type: MachineType.RIGID,
        cavity: 4,
        cycleTimeSec: 15.5,
      },
    });
    rigidMachineId = newRigidMachine.id;
    console.log("Created dummy rigid machine");
  } else {
    rigidMachineId = existingRigidMachine.id;
  }

  // 2. Get User for Creator
  const user = await db.user.findFirst();
  if (!user) {
    console.error("No user found. Please run main seed first.");
    return;
  }

  // 3. Define Dummy Products
  const products = [
    { name: "Kardus Indomie Goreng", type: "PAPER" },
    { name: "Box Sepatu Nike", type: "PAPER" },
  ];

  for (const prod of products) {
    console.log(`Creating data for: ${prod.name}`);

    // Create 2 Dummy Data (PROs + Reports)
    for (let i = 1; i <= 2; i++) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4 digits
      const proNumber = `2024${randomSuffix}${i}`; // Digits only

      // Check if PRO exists
      const existingPro = await db.pro.findUnique({ where: { proNumber } });
      if (existingPro) {
        console.log(`PRO ${proNumber} already exists, skipping...`);
        continue;
      }

      // Create PRO
      await db.pro.create({
        data: {
          proNumber,
          productName: prod.name,
          qtyPoPcs: 5000,
          status: ProStatus.IN_PROGRESS,
          type: ProType.PAPER,
          startDate: new Date(),
          process: {
            connectOrCreate: {
              where: { code: "11" },
              create: { code: "11", name: "Potong", type: ProType.PAPER },
            },
          },
          steps: {
            create: {
              orderNo: 1,
              machineId: machineId,
              productionReports: {
                create: {
                  reportDate: new Date(),
                  shift: i, // Shift 1 or 2
                  operatorName: "Budi Santoso",
                  reportType: LphType.PAPER,
                  startTime: new Date(),
                  endTime: new Date(new Date().getTime() + 4 * 60 * 60 * 1000), // +4 hours
                  qtyGood: 2500,
                  qtyReject: 50,
                  qtyWip: 0,
                  status: ReportStatus.APPROVED, // Approved immediately
                  checkedById: user.id,
                  checkedAt: new Date(),
                  createdById: user.id,
                  inputMaterialQty: 3000,
                },
              },
            },
          },
        },
      });

      console.log(`Created PRO ${proNumber} with Report for ${prod.name}`);
    }
  }

  // 4a. Create a TEST Report for Calculation Verification
  console.log("Creating Test Report for Injection Calculations...");
  // Test Data:
  // Total Time: 07:00 - 15:00 = 8h (480 mins)
  // Loss Hour (Planned): "Istirahat" = 60m. -> Working Time = 420m (7.0 Jam)
  // Downtime (Unplanned): "Material" = 30m. -> Commercial = 390m (6.5 Jam)
  //
  // Wait, if I want to match user image EXACTLY, I should guess or provide robust example.
  // I'll provide:
  // Planned: Istirahat (60), Trial (0).
  // Unplanned: Trouble Mesin (30), Ganti Mould (0).

  const testProNumber = "99990001";
  const existingTestPro = await db.pro.findUnique({
    where: { proNumber: testProNumber },
  });

  if (!existingTestPro) {
    const startTimeKey = new Date();
    startTimeKey.setHours(7, 0, 0, 0);
    const endTimeKey = new Date(startTimeKey);
    endTimeKey.setHours(15, 0, 0, 0); // 8 hours later

    await db.pro.create({
      data: {
        proNumber: testProNumber,
        productName: "TEST CALCULATION PRODUCT",
        qtyPoPcs: 1000,
        status: ProStatus.IN_PROGRESS,
        type: ProType.RIGID,
        startDate: startTimeKey,
        process: {
          connectOrCreate: {
            where: { code: "22" },
            create: { code: "22", name: "Injection", type: ProType.RIGID },
          },
        },
        steps: {
          create: {
            orderNo: 1,
            machineId: rigidMachineId,
            productionReports: {
              create: {
                reportDate: startTimeKey,
                shift: 1,
                operatorName: "Test Operator",
                reportType: LphType.INJECTION,
                startTime: startTimeKey,
                endTime: endTimeKey,
                qtyGood: 500,
                qtyReject: 10,
                qtyWip: 0,
                status: ReportStatus.APPROVED,
                checkedById: user.id,
                checkedAt: new Date(),
                createdById: user.id,
                inputMaterialQty: 100,
                materialRunnerQty: 5,
                materialPurgeQty: 2,
                cavityAct: 4,
                cycleTimeAct: 20,
                downtimeBreakdown: {
                  Istirahat: 60, // Planned
                  "Trouble Mesin": 30, // Unplanned
                },
                totalDowntime: 90, // 60 + 30
              },
            },
          },
        },
      },
    });
    console.log("Created Test Report 99990001");
  } else {
    console.log("Test Report 99990001 already exists.");
  }

  // 4. Define Dummy Rigid Products
  const rigidProducts = [
    { name: "Botol 600ml", type: "RIGID" },
    { name: "Tutup Galon", type: "RIGID" },
  ];

  for (const prod of rigidProducts) {
    console.log(`Creating data for: ${prod.name}`);

    // Create 2 Dummy Data (PROs + Reports)
    for (let i = 1; i <= 2; i++) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4 digits
      const proNumber = `2025${randomSuffix}${i}`; // Digits only

      // Check if PRO exists
      const existingPro = await db.pro.findUnique({ where: { proNumber } });
      if (existingPro) {
        console.log(`PRO ${proNumber} already exists, skipping...`);
        continue;
      }

      // Create PRO
      await db.pro.create({
        data: {
          proNumber,
          productName: prod.name,
          qtyPoPcs: 10000,
          status: ProStatus.IN_PROGRESS,
          type: ProType.RIGID,
          startDate: new Date(),
          process: {
            connectOrCreate: {
              where: { code: "22" },
              create: { code: "22", name: "Injection", type: ProType.RIGID },
            },
          },
          steps: {
            create: {
              orderNo: 1,
              machineId: rigidMachineId,
              productionReports: {
                create: {
                  reportDate: new Date(),
                  shift: i, // Shift 1 or 2
                  operatorName: "Agus Injection",
                  reportType: LphType.INJECTION,
                  startTime: new Date(),
                  endTime: new Date(new Date().getTime() + 8 * 60 * 60 * 1000), // +8 hours
                  qtyGood: 3400,
                  qtyReject: 100,
                  qtyWip: 0,
                  status: ReportStatus.APPROVED, // Approved immediately
                  checkedById: user.id,
                  checkedAt: new Date(),
                  createdById: user.id,
                  inputMaterialQty: 150, // Material Tuang
                  materialRunnerQty: 10,
                  materialPurgeQty: 5,
                  // More realistic downtime
                  downtimeBreakdown: {
                    Istirahat: 60,
                    "Ganti Mould": 45,
                  },
                  totalDowntime: 105,
                  cavityAct: 4,
                  cycleTimeAct: 15.5,
                },
              },
            },
          },
        },
      });

      console.log(
        `Created Rigid PRO ${proNumber} with Report for ${prod.name}`,
      );
    }
  }

  console.log("Seeding dummy reports completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
