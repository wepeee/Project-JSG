import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log(
    "Menambahkan EXTRA Data Laporan Dummy (Untuk Test Std Speed Average)...",
  );

  const machine = await prisma.machine.findFirst({
    where: { type: "PAPER", name: { contains: "GOWEI" } },
  });

  if (!machine) {
    console.error("No valid PAPER machine found");
    return;
  }

  const admin = await prisma.user.findFirst({ where: { role: "SUPERADMIN" } });

  const createReport = async (
    productName: string,
    proNumber: string,
    output: number,
    minutes: number,
  ) => {
    // Find existing PRO
    const pro = await prisma.pro.findUnique({ where: { proNumber } });
    if (!pro) {
      console.error(`PRO ${proNumber} not found! Run previous script first.`);
      return;
    }

    // Find step
    const step = await prisma.proStep.findFirst({ where: { proId: pro.id } });
    if (!step) {
      console.error("Step not found");
      return;
    }

    // Create Report
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - minutes * 60 * 1000);

    await prisma.productionReport.create({
      data: {
        proStepId: step.id,
        reportDate: new Date(), // Hari ini
        shift: 3, // Shift beda
        operatorName: "Dummy Operator 2",
        reportType: "PAPER",
        startTime,
        endTime,
        qtyPassOn: output,
        qtyGood: 0,
        status: "APPROVED",
        checkedById: admin?.id,
        checkedAt: new Date(),
      },
    }); // @ts-ignore
    console.log(
      `--> Extra Report added for ${productName}: Output ${output} in ${minutes}m`,
    );
  };

  // Data 1: Produk "KOTAK MAKANAN SPICY" (DUMMY-001)
  // Previous: 10000 in 60m (166/m)
  // New: 8000 in 60m (133/m)
  // Expected Avg: (18000 / 120) = 150/m
  await createReport("KOTAK MAKANAN SPICY", "DUMMY-001", 8000, 60);

  // Data 2: Produk "PAPER BAG PREMIUM" (DUMMY-002)
  // Previous: 5000 in 100m (50/m)
  // New: 6000 in 60m (100/m)
  // Expected Avg: (11000 / 160) = 68.75/m
  await createReport("PAPER BAG PREMIUM", "DUMMY-002", 6000, 60);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
