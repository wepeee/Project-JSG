import * as dotenv from "dotenv";
import path from "path";
import { execSync } from "child_process";
import { PrismaClient } from "../generated/prisma";
import { resetDatabase, type SupportedDbProvider } from "./helpers/reset";

if (process.env.CI !== "true") {
  dotenv.config({
    path: path.join(process.cwd(), ".env.test.local"),
    override: true,
    quiet: true,
  });
}

const testDbUrl = process.env.DATABASE_URL;
const testDirectUrl = process.env.DIRECT_URL ?? testDbUrl;
const parsedTestDbUrl = testDbUrl ? new URL(testDbUrl) : null;
const parsedDbName = parsedTestDbUrl?.pathname.replace("/", "");
const dbProvider =
  parsedTestDbUrl?.protocol.replace(":", "") as SupportedDbProvider | undefined;

if (
  !testDbUrl ||
  !parsedDbName ||
  !parsedDbName.toLowerCase().includes("test")
) {
  throw new Error(
    "DATABASE_URL must target a database with 'test' in its name.",
  );
}

if (!dbProvider || !["postgresql", "postgres", "mysql"].includes(dbProvider)) {
  throw new Error("DATABASE_URL must use postgresql://, postgres://, or mysql://");
}

const db = new PrismaClient();

function getDbNameFromUrl(url: string): string {
  const parsed = new URL(url);
  const dbName = parsed.pathname.replace("/", "");
  if (!dbName) {
    throw new Error("DATABASE_URL must include database name.");
  }
  return dbName;
}

beforeAll(async () => {
  try {
    execSync("pnpm prisma migrate deploy", {
      stdio: "inherit",
      env: {
        ...process.env,
        DATABASE_URL: testDbUrl,
        DIRECT_URL: testDirectUrl,
      },
    });
  } catch {
    execSync("pnpm prisma db push --accept-data-loss", {
      stdio: "inherit",
      env: {
        ...process.env,
        DATABASE_URL: testDbUrl,
        DIRECT_URL: testDirectUrl,
      },
    });
  }
});

afterEach(async () => {
  const dbName = getDbNameFromUrl(testDbUrl);
  await resetDatabase(db, dbName, dbProvider);
});

afterAll(async () => {
  await db.$disconnect();
});

export { db };
