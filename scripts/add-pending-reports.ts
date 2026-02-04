import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Menambahkan Data Laporan Dummy (PENDING - Untuk Verifikasi)...");

  const machine = await prisma.machine.findFirst({
    where: { type: "PAPER", name: { contains: "GOWEI" } },
  });

  if (!machine) {
    console.error("No valid PAPER machine found");
    return;
  }

  const createPendingReport = async (
    productName: string,
    proNumber: string,
    output: number,
    minutes: number,
    rejectInfo: any,
    downtimeInfo: any,
  ) => {
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

    // Calculate totals
    const qtyReject = Object.values(rejectInfo).reduce(
      (a: any, b: any) => a + b,
      0,
    );
    const totalDowntime = Object.values(downtimeInfo).reduce(
      (a: any, b: any) => a + b,
      0,
    );

    const report = await prisma.productionReport.create({
      data: {
        proStepId: step.id,
        reportDate: new Date(),
        shift: 1,
        operatorName: "Test Operator - Verifikasi",
        reportType: "PAPER",
        startTime,
        endTime,
        qtyPassOn: output,
        qtyGood: 0,
        qtyReject: Number(qtyReject),
        rejectBreakdown: rejectInfo, // JSON
        downtimeBreakdown: downtimeInfo, // JSON
        totalDowntime: Number(totalDowntime),
        status: "PENDING", // PENDING = Masuk ke Verifikasi
        // checkedById and checkedAt left null (belum di-verify)
      },
    });
    console.log(`--> PENDING Report added for ${productName}`);
    console.log(
      `    Reject Total: ${qtyReject}, Downtime Total: ${totalDowntime}m`,
    );
  };

  // Data 1: Produk dengan banyak rincian
  await createPendingReport(
    "KOTAK MAKANAN SPICY",
    "DUMMY-001",
    8500,
    75,
    {
      Bintik: 15,
      Warna: 8,
      Baret: 12,
      Sobek: 5,
      Kotor: 10,
    },
    {
      "Machine Problem": 20,
      "Tunggu Material": 15,
      "Set Up & Change Over": 10,
      "Adjustment Process": 5,
    },
  );

  // Data 2: Produk dengan rincian berbeda
  await createPendingReport(
    "PAPER BAG PREMIUM",
    "DUMMY-002",
    4500,
    90,
    {
      Bercak: 7,
      Laminasi: 3,
      Lem: 5,
    },
    {
      "Trouble PLN": 30,
      Istirahat: 20,
      "Running In": 10,
    },
  );

  console.log("\n✅ Data dummy sudah ditambahkan dengan status PENDING.");
  console.log("Silakan buka halaman 'Verifikasi Laporan' untuk approve!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
