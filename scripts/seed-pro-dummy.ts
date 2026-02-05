import { PrismaClient, ProStatus } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting PRO dummy data seeding (Without LPH)...");

  // 1. Definisikan PRO Numbers yang akan dibuat
  const proNumbers = [
    "110226001", // Paper
    "110226002", // Printing
    "220226001", // Packing/Assembly
    "220226002", // Blow Moulding
    "220226003", // Injection
  ];

  // 2. Bersihkan data lama
  console.log("🗑️  Cleaning old dummy PROs...");

  // Hapus LPH yang mungkin terkait (jika ada sisa)
  await prisma.productionReport.deleteMany({
    where: {
      step: {
        pro: {
          proNumber: { in: proNumbers },
        },
      },
    },
  });

  // Hapus PRO
  await prisma.pro.deleteMany({
    where: {
      proNumber: { in: proNumbers },
    },
  });

  // 3. Pastikan Machines tersedia untuk setiap tipe
  // PAPER Machine
  const machinePaper = await prisma.machine.upsert({
    where: { id: 1 },
    update: { type: "PAPER", name: "PAPER MACHINE 01 (PON)" },
    create: {
      id: 1,
      name: "PAPER MACHINE 01 (PON)",
      type: "PAPER",
      uom: "sheet",
      stdOutputPerHour: 1000,
      stdOutputPerShift: 8000,
    },
  });

  // PRINTING Machine (Type Paper, tapi untuk proses Printing)
  const machinePrinting = await prisma.machine.upsert({
    where: { id: 2 },
    update: { type: "PAPER", name: "PRINTING MACHINE 01 (OFFSET)" },
    create: {
      id: 2,
      name: "PRINTING MACHINE 01 (OFFSET)",
      type: "PAPER",
      uom: "sheet",
      stdOutputPerHour: 1200,
      stdOutputPerShift: 9600,
    },
  });

  // PACKING/ASSEMBLY Machine (Type Rigid)
  const machinePacking = await prisma.machine.upsert({
    where: { id: 3 },
    update: { type: "RIGID", name: "ASSEMBLY LINE 01" },
    create: {
      id: 3,
      name: "ASSEMBLY LINE 01",
      type: "RIGID",
      uom: "pcs",
      stdOutputPerHour: 500,
      stdOutputPerShift: 4000,
    },
  });

  // BLOW MOULDING Machine (Type Rigid)
  const machineBlow = await prisma.machine.upsert({
    where: { id: 4 },
    update: {
      type: "RIGID",
      name: "BLOW MACHINE 01",
      workCenter: "BLOW",
    },
    create: {
      id: 4,
      name: "BLOW MACHINE 01",
      type: "RIGID",
      uom: "pcs",
      stdOutputPerHour: 600,
      stdOutputPerShift: 4800,
      cycleTimeSec: 12,
      cavity: 4,
      workCenter: "BLOW",
    },
  });

  // INJECTION Machine (Type Rigid)
  const machineInjection = await prisma.machine.upsert({
    where: { id: 5 },
    update: {
      type: "RIGID",
      name: "INJECTION MACHINE 01",
      workCenter: "INJECTION",
    },
    create: {
      id: 5,
      name: "INJECTION MACHINE 01",
      type: "RIGID",
      uom: "pcs",
      stdOutputPerHour: 400,
      stdOutputPerShift: 3200,
      cycleTimeSec: 15,
      cavity: 2,
      workCenter: "INJECTION",
    },
  });

  console.log("✅ Machines ready");

  // 4. Pastikan Process tersedia
  const processPaper = await prisma.process.upsert({
    where: { code: "11" },
    update: {},
    create: { code: "11", name: "Paper Process", type: "PAPER" },
  });

  const processRigid = await prisma.process.upsert({
    where: { code: "22" },
    update: {},
    create: { code: "22", name: "Rigid Process", type: "RIGID" },
  });

  // 5. Materials
  const matPaper = await prisma.material.upsert({
    where: { name: "Duplex 350g" },
    update: {},
    create: { name: "Duplex 350g", uom: "sheet" },
  });
  const matInk = await prisma.material.upsert({
    where: { name: "Ink Cyan" },
    update: {},
    create: { name: "Ink Cyan", uom: "kg" },
  });
  const matResin = await prisma.material.upsert({
    where: { name: "PVC Resin" },
    update: {},
    create: { name: "PVC Resin", uom: "kg" },
  });
  const matGlue = await prisma.material.upsert({
    where: { name: "Glue Stick" },
    update: {},
    create: { name: "Glue Stick", uom: "kg" },
  });

  // 6. Buat PRO
  const today = new Date(); // Hari ini agar muncul di dashboard

  // --- 1. PRO PAPER (Standard) ---
  await prisma.pro.create({
    data: {
      proNumber: "110226001",
      productName: "Kotak Nasi Paper",
      qtyPoPcs: 5000,
      startDate: today,
      status: ProStatus.IN_PROGRESS,
      type: "PAPER",
      processId: processPaper.id,
      steps: {
        create: {
          orderNo: 1,
          machineId: machinePaper.id,
          up: 4, // 1 sheet jadi 4 kotak
          startDate: today,
          estimatedShifts: 1,
          materials: {
            create: { materialId: matPaper.id, qtyReq: 1250 },
          },
        },
      },
    },
  });

  // --- 2. PRO PRINTING (Masih kategori Paper secara schema, tapi untuk tes LPH Printing) ---
  await prisma.pro.create({
    data: {
      proNumber: "110226002",
      productName: "Brosur Full Color",
      qtyPoPcs: 10000,
      startDate: today,
      status: ProStatus.IN_PROGRESS,
      type: "PAPER",
      processId: processPaper.id,
      steps: {
        create: {
          orderNo: 1,
          machineId: machinePrinting.id,
          up: 10,
          startDate: today,
          estimatedShifts: 2,
          materials: {
            create: [
              { materialId: matPaper.id, qtyReq: 1000 },
              { materialId: matInk.id, qtyReq: 5 },
            ],
          },
        },
      },
    },
  });

  // --- 3. PRO PACKING/ASSEMBLY (Rigid) ---
  await prisma.pro.create({
    data: {
      proNumber: "220226001",
      productName: "Gift Box Premium (Assembly)",
      qtyPoPcs: 2000,
      startDate: today,
      status: ProStatus.IN_PROGRESS,
      type: "RIGID",
      processId: processRigid.id,
      steps: {
        create: {
          orderNo: 1,
          machineId: machinePacking.id,
          up: 1,
          startDate: today,
          estimatedShifts: 3,
          materials: {
            create: { materialId: matGlue.id, qtyReq: 20 },
          },
        },
      },
    },
  });

  // --- 4. PRO BLOW MOULDING (Rigid) ---
  await prisma.pro.create({
    data: {
      proNumber: "220226002",
      productName: "Botol Minum 1L",
      qtyPoPcs: 3000,
      startDate: today,
      status: ProStatus.IN_PROGRESS,
      type: "RIGID",
      processId: processRigid.id,
      steps: {
        create: {
          orderNo: 1,
          machineId: machineBlow.id,
          up: 1,
          startDate: today,
          estimatedShifts: 2,
          materials: {
            create: { materialId: matResin.id, qtyReq: 300 },
          },
        },
      },
    },
  });

  // --- 5. PRO INJECTION (Rigid) ---
  await prisma.pro.create({
    data: {
      proNumber: "220226003",
      productName: "Tutup Botol (Injection)",
      qtyPoPcs: 50000,
      startDate: today,
      status: ProStatus.IN_PROGRESS,
      type: "RIGID",
      processId: processRigid.id,
      steps: {
        create: {
          orderNo: 1,
          machineId: machineInjection.id,
          up: 24, // Sekali shoot 24 pcs
          startDate: today,
          estimatedShifts: 4,
          materials: {
            create: { materialId: matResin.id, qtyReq: 500 },
          },
        },
      },
    },
  });

  console.log("✅ Created 5 PROs (Active/In_Progress)");
  console.log("   👉 PAPER (PON): 110226001");
  console.log("   👉 PRINTING:    110226002");
  console.log("   👉 ASSEMBLY:    220226001");
  console.log("   👉 BLOW:        220226002");
  console.log("   👉 INJECTION:   220226003");
  console.log("\nSiap untuk dites input LPH di Dashboard Operator!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding PROs:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
