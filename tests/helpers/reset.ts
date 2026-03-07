import type { PrismaClient } from "../../generated/prisma";

export type SupportedDbProvider = "postgresql" | "postgres" | "mysql";

export async function resetDatabase(
  db: PrismaClient,
  dbName: string,
  provider: SupportedDbProvider,
): Promise<void> {
  if (provider === "mysql") {
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
    return;
  }

  const tableRows = await db.$queryRawUnsafe<Array<{ tablename: string }>>(
    "SELECT tablename FROM pg_tables WHERE schemaname = 'public';",
  );
  const tableNames = tableRows
    .map((r) => r.tablename)
    .filter((name) => name !== "_prisma_migrations");

  if (tableNames.length === 0) {
    return;
  }

  const quotedTables = tableNames
    .map((name) => `"public"."${name.replace(/"/g, '""')}"`)
    .join(", ");

  await db.$executeRawUnsafe(
    `TRUNCATE TABLE ${quotedTables} RESTART IDENTITY CASCADE;`,
  );
}
