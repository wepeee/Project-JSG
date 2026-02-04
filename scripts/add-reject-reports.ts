import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Menambahkan Data Laporan Dummy (Dengan REJECT)...");

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
    rejectInfo: any,
  ) => {
    // Reuse existing dummy pro logic
    const pro = await prisma.pro.findUnique({ where: { proNumber } });
    if (!pro) {
      console.error(`PRO ${proNumber} not found!`);
      return;
    }

    const step = await prisma.proStep.findFirst({ where: { proId: pro.id } });
    if (!step) {
      console.error("Step not found");
      return;
    }

    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - minutes * 60 * 1000);

    // Calculate total reject from breakdown
    const qtyReject = Object.values(rejectInfo).reduce(
      (a: any, b: any) => a + b,
      0,
    );

    const report = await prisma.productionReport.create({
      data: {
        proStepId: step.id,
        reportDate: new Date(),
        shift: 2,
        operatorName: "Reject Tester",
        reportType: "PAPER",
        startTime,
        endTime,
        qtyPassOn: output,
        qtyGood: 0,
        qtyReject: Number(qtyReject),
        rejectBreakdown: rejectInfo, // JSON
        status: "APPROVED",
        checkedById: admin?.id,
        checkedAt: new Date(),
      },
    });
    console.log(
      `--> Report added for ${productName} with ${qtyReject} rejects.`,
    );
  };

  // Data 1: Produk "KOTAK MAKANAN SPICY" (DUMMY-001)
  // Banyak Reject
  await createReport("KOTAK MAKANAN SPICY", "DUMMY-001", 7500, 60, {
    Kotor: 50,
    Sobek: 25,
    "Lem Lepas": 10,
  });

  // Data 2: Produk "PAPER BAG PREMIUM" (DUMMY-002)
  // Sedikit Reject
  await createReport("PAPER BAG PREMIUM", "DUMMY-002", 4800, 60, {
    "Warna Pudar": 15,
    Gelembung: 5,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
