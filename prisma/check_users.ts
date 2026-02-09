import { PrismaClient } from "../generated/prisma";

const db = new PrismaClient();

async function main() {
  console.log("Checking and fixing user accounts...");

  // Get all sessions to see what user IDs are being used
  const sessions = await db.session.findMany({
    select: {
      userId: true,
      user: {
        select: {
          id: true,
          username: true,
          role: true,
        },
      },
    },
  });

  console.log("\nCurrent sessions:");
  sessions.forEach((s) => {
    console.log(`- User ID: ${s.userId}, Username: ${s.user?.username || "MISSING"}, Role: ${s.user?.role || "N/A"}`);
  });

  // Check if there are any orphaned sessions (sessions without users)
  const orphanedSessions = sessions.filter((s) => !s.user);
  
  if (orphanedSessions.length > 0) {
    console.log(`\n⚠️  Found ${orphanedSessions.length} orphaned session(s)!`);
    console.log("Deleting orphaned sessions...");
    
    for (const session of orphanedSessions) {
      await db.session.delete({
        where: { userId: session.userId },
      });
      console.log(`  Deleted session for user ID: ${session.userId}`);
    }
  }

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
