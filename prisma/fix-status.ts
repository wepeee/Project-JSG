import { PrismaClient } from "../generated/prisma";

const db = new PrismaClient();

async function main() {
  console.log("Fixing PRO statuses...");

  const pros = await db.pro.findMany({
    where: {
      status: "CLOSED", // Filter for CLOSED ones that might need to be COMPLETE
    },
    include: {
      proses: {
        include: {
          productionReports: true,
        },
      },
    },
  });

  for (const pro of pros) {
    let totalOutput = 0;

    // Calculate Total Output from LAST PROCESS
    if (pro.proses.length > 0) {
      // Sort processes manually
      const sortedSteps = [...pro.proses].sort((a, b) => a.orderNo - b.orderNo);
      const lastStep = sortedSteps[sortedSteps.length - 1];

      if (lastStep) {
        totalOutput = lastStep.productionReports
          .filter((r) => r.status === "APPROVED")
          .reduce((acc, r) => {
            return (
              acc +
              Number(r.qtyPassOn?.toString() ?? "0") +
              Number(r.qtyGood?.toString() ?? "0")
            );
          }, 0);
      }
    }

    console.log(`PRO ${pro.proNumber}: Target ${pro.qtyPoPcs}, Actual ${totalOutput}, Status ${pro.status}`);

    if (totalOutput >= pro.qtyPoPcs) {
      console.log(`-> Updating ${pro.proNumber} to COMPLETE`);
      await db.pro.update({
        where: { id: pro.id },
        data: { status: "COMPLETE" },
      });
    }
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
