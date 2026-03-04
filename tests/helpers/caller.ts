/**
 * Test helper: creates a tRPC caller with a faked session.
 *
 * This bypasses NextAuth's `auth()` call by constructing the context manually.
 * Every integration test that wants to hit an actual tRPC route should
 * use this helper instead of calling domain services directly.
 */

import { createCaller } from "~/server/api/root";
import { db } from "../setup";
import type { Role } from "../../generated/prisma";

type FakeSession = {
  user: {
    id: string;
    name: string;
    role: Role;
    department?: string;
  };
  expires: string;
};

/**
 * Create a tRPC server-side caller with an authenticated session.
 *
 * @param userId     - DB user id
 * @param role       - Role enum value (e.g. Role.SUPERADMIN)
 * @param department - optional department for route-level filtering
 */
export function createTestCaller(
  userId: string,
  role: Role,
  department?: string,
) {
  const session: FakeSession = {
    user: {
      id: userId,
      name: `test_${role.toLowerCase()}`,
      role,
      department,
    },
    expires: new Date(Date.now() + 86400_000).toISOString(),
  };

  // createCaller = createCallerFactory(appRouter)
  // It expects the same shape as createTRPCContext returns: { db, session, headers }
  return createCaller({
    db,
    session,
    headers: new Headers(),
  } as any);
}
