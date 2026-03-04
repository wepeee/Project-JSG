import type { PrismaClient } from "../../generated/prisma";

export async function resetDatabase(
  db: PrismaClient,
  dbName: string,
): Promise<void> {
  await db.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS = 0;");

  const tableRows = await db.$queryRawUnsafe<Array<{ TABLE_NAME: string }>>(
    `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = '${dbName}';`,
  );

  for (const row of tableRows) {
    if (row.TABLE_NAME === "_prisma_migrations") {
      continue;
    }
    await db.$executeRawUnsafe(`TRUNCATE TABLE \`${row.TABLE_NAME}\`;`);
  }

  await db.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS = 1;");
}
