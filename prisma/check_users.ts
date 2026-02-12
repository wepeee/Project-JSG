import { PrismaClient } from "../generated/prisma";

const db = new PrismaClient();

async function main() {
  console.log("Checking user accounts...");

  const users = await db.user.findMany({
    select: {
      id: true,
      username: true,
      role: true,
      department: true,
    },
    orderBy: {
      username: "asc",
    },
  });

  console.log(`\nFound ${users.length} users:`);
  users.forEach((u) => {
    console.log(
      `- User: ${u.username.padEnd(15)} | Role: ${u.role.padEnd(10)} | Dept: ${
        u.department || "-"
      } | ID: ${u.id}`
    );
  });

  console.log("\nDone!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
