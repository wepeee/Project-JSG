import { PrismaClient } from "../generated/prisma"; // penting: sesuai schema output
import { hash } from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const username = "superadmin";
  const plainPassword = "superadmin";
  const passwordHash = await hash(plainPassword, 12);

  await db.user.upsert({
    where: { username },
    update: {
      passwordHash, // <-- ini yang bikin login kamu sekarang bisa
      role: "SUPERADMIN",
    },
    create: {
      username,
      passwordHash,
      role: "SUPERADMIN",
    },
  });

  const u = await db.user.findUnique({
    where: { username },
    select: { username: true, role: true, passwordHash: true },
  });

  console.log(
    "Seed OK:",
    u?.username,
    u?.role,
    "hashLen:",
    u?.passwordHash.length,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
