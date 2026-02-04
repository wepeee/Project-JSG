import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Mencari data PRO 'coba PAPER'...");

  // 1. Cari ProStep
  const step = await prisma.proStep.findFirst({
    where: {
      pro: {
        productName: {
          contains: "coba PAPER",
        },
      },
      machine: {
        name: {
          contains: "GOWEI",
        },
      },
    },
    include: {
      pro: true,
      machine: true,
    },
  });

  if (!step) {
    console.error("Gagal: Tidak menemukan Process Step.");
    return;
  }

  // 2. Cari Admin User
  const admin = await prisma.user.findFirst({
    where: { role: "SUPERADMIN" },
  });

  if (!admin) {
    console.log("Warning: No SUPERADMIN found, trying ADMIN");
  }

  const userToConnect = admin || (await prisma.user.findFirst());

  console.log(
    `Ditemukan: PRO ${step.pro.proNumber}, User: ${userToConnect?.username}`,
  );

  // 3. Buat Laporan
  const report = await prisma.productionReport.create({
    data: {
      proStepId: step.id,
      reportDate: new Date(),
      shift: 2,
      operatorName: "Test Operator AI",
      reportType: "PAPER",
      startTime: new Date(new Date().setHours(14, 0, 0, 0)),
      endTime: new Date(new Date().setHours(15, 0, 0, 0)),
      qtyPassOn: 5000,
      qtyGood: 0,
      qtyReject: 100,
      qtyWip: 200,
      qtyHold: 50,
      totalDowntime: 15,
      status: "APPROVED",
      checkedById: userToConnect?.id, // Use ID directly
      checkedAt: new Date(),
    },
  });

  console.log("Berhasil insert laporan baru. ID:", report.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
