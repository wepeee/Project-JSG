import { PrismaClient } from "./generated/prisma";
import { compare } from "bcryptjs";

const db = new PrismaClient();

async function check() {
  const username = "ppic";
  const password = "ppic";

  console.log(`Checking user: ${username}`);

  const user = await db.user.findUnique({
    where: { username },
  });

  if (!user) {
    console.log("User NOT FOUND in database.");
    return;
  }

  console.log("User found:", user);

  const isMatch = await compare(password, user.passwordHash);
  console.log(`Password '${password}' match result: ${isMatch}`);
}

check()
  .catch(console.error)
  .finally(() => db.$disconnect());
