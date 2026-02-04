import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Menambahkan Data Laporan Dummy (Paper)...");

  // Find or Create Pro for "Produk Baru A"
  // Usually steps are linked to Pros. We need a valid ProStep.
  // Let's see if we can find existing machines to link to.

  const machine = await prisma.machine.findFirst({
    where: { type: "PAPER", name: { contains: "GOWEI" } },
  });

  if (!machine) {
    console.error("No valid PAPER machine found");
    return;
  }

  const admin = await prisma.user.findFirst({ where: { role: "SUPERADMIN" } });

  // Helper to create report
  const createReport = async (
    productName: string,
    proNumber: string,
    output: number,
    minutes: number,
  ) => {
    // 1. Create Dummy Pro & Step first (so we have unique products)
    let pro = await prisma.pro.findUnique({ where: { proNumber } });
    if (!pro) {
      pro = await prisma.pro.create({
        data: {
          proNumber,
          productName,
          qtyPoPcs: 10000,
          status: "IN_PROGRESS",
          type: "PAPER",
        },
      });
      console.log(`Created PRO ${proNumber}: ${productName}`);
    } else {
      console.log(`Using existing PRO ${proNumber}: ${productName}`);
    }

    // Find or create step
    let step = await prisma.proStep.findFirst({
      where: { proId: pro.id },
    });

    if (!step) {
      step = await prisma.proStep.create({
        data: {
          proId: pro.id,
          orderNo: 1,
          machineId: machine.id,
        },
      });
    }

    // 2. Create Report
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - minutes * 60 * 1000);

    await prisma.productionReport.create({
      data: {
        proStepId: step.id,
        reportDate: new Date(),
        shift: 1,
        operatorName: "Dummy Operator",
        reportType: "PAPER",
        startTime,
        endTime,
        qtyPassOn: output, // Total Output effectively
        qtyGood: 0,
        status: "APPROVED",
        checkedById: admin?.id,
        checkedAt: new Date(),
      },
    });
    console.log(
      `--> Report added for ${productName}: Output ${output} in ${minutes}m`,
    );
  };

  // Data 1: Produk "KOTAK MAKANAN SPICY" (Speed Tinggi)
  // Output 10000 pcs dalam 60 jam -> Speed ~166/m
  await createReport("KOTAK MAKANAN SPICY", "DUMMY-001", 10000, 60);

  // Data 2: Produk "PAPER BAG PREMIUM" (Speed Sedang)
  // Output 5000 pcs dalam 100 menit -> Speed 50/m
  await createReport("PAPER BAG PREMIUM", "DUMMY-002", 5000, 100);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
