import { PrismaClient, ProStatus } from "../generated/prisma";
import { faker } from "@faker-js/faker";

const DOWNTIME_KEYS = [
  "ISTIRAHAT",
  "TROUBLE_PLN",
  "TRIAL",
  "PREVENTIVE_MAINTENANCE",
  "TUNGGU_APPROVAL",
  "TUNGGU_MATERIAL",
  "SETUP_CHANGE_OVER",
  "MACHINE_PROBLEM",
  "MENCARI_TOOLS",
  "RUNNING_IN",
  "ADJUSTMENT_PROCESS",
  "OTHERS",
];

const REJECT_KEYS = [
  "BINTIK",
  "WARNA",
  "BARET",
  "PUTUS",
  "KOTOR",
  "MISREGISTER",
];

const PAPER_PROCESS_CODES = [
  "17", // OFFSET PHASE 1
  "22", // OFFSET PHASE 2
  "19", // DIE CUTTING
  "20", // FOLDED & GLUE
  "27", // LAMINASI
  "28", // UV SPOT
];

export async function seedPaperDashboard(prisma: PrismaClient) {
  console.log("🌱 Seeding Paper Dashboard Data...");

  // 1. Get Paper Machines & Processes
  const machines = await prisma.machine.findMany({
    where: { type: "PAPER" },
  });

  const processes = await prisma.process.findMany({
    where: {
      code: { in: PAPER_PROCESS_CODES },
    },
  });

  if (processes.length === 0 || machines.length === 0) {
    console.warn("⚠️ No Paper machines or processes found. Skipping dashboard seed.");
    return;
  }

  // 2. Clear old dashboard-specific data (optional, but good for dev)
  // We can filter by a specific flag or just add new data. Let's add new data.

  // 3. Generate PROs for the last 2 months
  const NUM_PROS = 10;
  const START_DATE = new Date();
  START_DATE.setMonth(START_DATE.getMonth() - 1); // Last 1 month

  for (let i = 0; i < NUM_PROS; i++) {
    const proNumber = `PD-${faker.string.numeric(5)}`;
    
    // Pick a random process
    const process = faker.helpers.arrayElement(processes);

    // Create PRO
    const pro = await prisma.pro.create({
      data: {
        proNumber,
        productName: faker.commerce.productName(),
        qtyPoPcs: faker.number.int({ min: 10000, max: 100000 }),
        startDate: START_DATE,
        status: "IN_PROGRESS",
        type: "PAPER",
        processId: process.id,
      },
    });

    console.log(`Create PRO: ${proNumber} - ${process.name}`);

    // Create Step (One step per PRO for simplicity)
    const machine = faker.helpers.arrayElement(machines);
    const step = await prisma.proStep.create({
      data: {
        proId: pro.id,
        orderNo: 1,
        machineId: machine.id,
        startDate: START_DATE,
      },
    });

    // 4. Generate Daily Reports for this Step
    // Simulate 30 days of production
    for (let day = 0; day < 30; day++) {
      const reportDate = new Date(START_DATE);
      reportDate.setDate(reportDate.getDate() + day);

      // Randomly skip Sundays
      if (reportDate.getDay() === 0) continue;

      // Generte 1-3 shifts per day
      const shifts = [1, 2, 3];
      for (const shift of shifts) {
        // 80% chance of having a report for a shift
        if (Math.random() > 0.8) continue;

        // Generate Downtime Breakdown
        const downtimeBreakdown: Record<string, number> = {};
        let totalDowntime = 0;
        
        // 50% chance of having downtime
        if (Math.random() > 0.5) {
          const numIssues = faker.number.int({ min: 1, max: 3 });
          for (let k = 0; k < numIssues; k++) {
            const key = faker.helpers.arrayElement(DOWNTIME_KEYS);
            const minutes = faker.number.int({ min: 15, max: 120 });
            downtimeBreakdown[key] = (downtimeBreakdown[key] || 0) + minutes;
            totalDowntime += minutes;
          }
        }

        // Generate Reject Breakdown
        const rejectBreakdown: Record<string, number> = {};
        let qtyReject = 0;
        
        // 70% chance of having rejects
        if (Math.random() > 0.3) {
           const numRejects = faker.number.int({ min: 1, max: 3 });
           for (let k = 0; k < numRejects; k++) {
             const key = faker.helpers.arrayElement(REJECT_KEYS);
             const qty = faker.number.int({ min: 10, max: 500 });
             rejectBreakdown[key] = (rejectBreakdown[key] || 0) + qty;
             qtyReject += qty;
           }
        }

        const qtyGood = faker.number.int({ min: 5000, max: 15000 });
        const operatorName = faker.person.firstName();

        await prisma.productionReport.create({
            data: {
                id: faker.string.uuid(),
                proStepId: step.id,
                reportDate: reportDate,
                shift: shift,
                reportType: "PAPER",
                operatorName: operatorName,
                startTime: new Date(reportDate.setHours(shift * 8 - 8, 0, 0)), // Rough estimate
                endTime: new Date(reportDate.setHours(shift * 8, 0, 0)),
                qtyGood: qtyGood,
                qtyReject: qtyReject,
                totalDowntime: totalDowntime,
                downtimeBreakdown: downtimeBreakdown,
                rejectBreakdown: rejectBreakdown,
                status: "APPROVED", // Auto approve for dashboard visualization
                inputMaterialQty: qtyGood + qtyReject + faker.number.int({min: 10, max: 100}) // Input > Output
            }
        });
      }
    }
  }

  console.log("✅ Paper Dashboard Data Seeded!");
}
