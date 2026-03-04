import * as dotenv from "dotenv";
import path from "path";
import mysql from "mysql2/promise";
import { execSync } from "child_process";
import { PrismaClient } from "../generated/prisma";
import { resetDatabase } from "./helpers/reset";

dotenv.config({
  path: path.join(process.cwd(), ".env.test.local"),
  override: true,
});

const testDbUrl = process.env.DATABASE_URL;
const parsedTestDbUrl = testDbUrl ? new URL(testDbUrl) : null;
const parsedDbName = parsedTestDbUrl?.pathname.replace("/", "");

if (!testDbUrl || !parsedDbName || !parsedDbName.toLowerCase().includes("test")) {
  throw new Error(
    "DATABASE_URL in .env.test.local must target a database with 'test' in its name.",
  );
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

async function ensureDatabaseExists(url: string): Promise<void> {
  const parsed = new URL(url);
  const dbName = getDbNameFromUrl(url);
  const serverUrl = `${parsed.protocol}//${parsed.username}${parsed.password ? `:${parsed.password}` : ""}@${parsed.host}`;

  const connection = await mysql.createConnection(serverUrl);
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
  await connection.end();
}

beforeAll(async () => {
  try {
    await ensureDatabaseExists(testDbUrl);
  } catch {
    // If CREATE DATABASE is forbidden we continue to migration attempt.
  }

  try {
    execSync("npx prisma migrate deploy", {
      stdio: "inherit",
      env: { ...process.env, DATABASE_URL: testDbUrl },
    });
  } catch {
    execSync("npx prisma db push --accept-data-loss", {
      stdio: "inherit",
      env: { ...process.env, DATABASE_URL: testDbUrl },
    });
  }
});

afterEach(async () => {
  const dbName = getDbNameFromUrl(testDbUrl);
  await resetDatabase(db, dbName);
});

afterAll(async () => {
  await db.$disconnect();
});

export { db };
