import { PrismaClient } from "../generated/prisma";

const db = new PrismaClient();

async function main() {
  console.log("Starting PRO status synchronization...");

  const pros = await db.pro.findMany({
    include: {
      proses: {
        include: {
          productionReports: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      },
    },
  });

  console.log(`Found ${pros.length} PROs.`);

  let updatedCount = 0;

  for (const pro of pros) {
    // Skip CANCELLED PROs
    if (pro.status === "CANCELLED") continue;

    const totalSteps = pro.proses.length;
    let stepsWithApprovedReport = 0;
    let stepsWithAnyReport = 0;

    for (const proses of pro.proses) {
      const hasAnyReport = proses.productionReports.length > 0;
      const hasApprovedReport = proses.productionReports.some(
        (r) => r.status === "APPROVED",
      );

      if (hasAnyReport) stepsWithAnyReport++;
      if (hasApprovedReport) stepsWithApprovedReport++;
    }

    let newStatus = pro.status;

    // New Logic:
    // 1. All steps have at least one APPROVED report -> CLOSED
    // 2. At least one step has any report (PENDING/REJECTED/APPROVED) -> IN_PROGRESS
    // 3. No reports at all -> OPEN

    if (totalSteps > 0 && stepsWithApprovedReport >= totalSteps) {
      newStatus = "CLOSED";
    } else if (stepsWithAnyReport > 0) {
      newStatus = "IN_PROGRESS";
    } else {
      newStatus = "OPEN";
    }

    if (newStatus !== pro.status) {
      console.log(
        `Updating PRO ${pro.proNumber}: ${pro.status} -> ${newStatus} (Approved: ${stepsWithApprovedReport}/${totalSteps}, Any: ${stepsWithAnyReport}/${totalSteps})`,
      );
      await db.pro.update({
        where: { id: pro.id },
        data: { status: newStatus },
      });
      updatedCount++;
    }
  }

  console.log(`Sync complete. Updated ${updatedCount} PROs.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
