import { PrismaClient } from "../generated/prisma";
import { seedRigid } from "../prisma/seed_rigid";

const prisma = new PrismaClient();

async function main() {
  await seedRigid(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
