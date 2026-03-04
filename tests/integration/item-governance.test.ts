/**
 * B1 Item governance — route-level tests via tRPC caller.
 *
 * Routes exercised:
 *   items.create         (ppicProcedure)
 *   items.listByStatus   (superAdminProcedure)
 *   items.approve        (superAdminProcedure)
 */

import { TRPCError } from "@trpc/server";
import { ItemStatus, Role } from "../../generated/prisma";
import { db } from "../setup";
import { seedBaseContext } from "../helpers/seed";
import { createTestCaller } from "../helpers/caller";

describe("B1 Item governance (route-level)", () => {
  test("I1. items.create -> status DRAFT", async () => {
    const ctx = await seedBaseContext(db);
    const caller = createTestCaller(ctx.users.PPIC.id, Role.PPIC);

    const item = await caller.items.create({
      code: "TEST_ITEM_1",
      name: "Draft Test Item",
      kind: "RAW",
    });

    expect(item.status).toBe("DRAFT");
    expect(item.code).toBe("TEST_ITEM_1");
  });

  test("I2. items.create duplicate code -> CONFLICT error", async () => {
    const ctx = await seedBaseContext(db);
    const caller = createTestCaller(ctx.users.PPIC.id, Role.PPIC);

    await caller.items.create({
      code: "DUPE_CODE_1",
      name: "First",
      kind: "RAW",
    });

    await expect(
      caller.items.create({
        code: "DUPE_CODE_1",
        name: "Second",
        kind: "RAW",
      }),
    ).rejects.toThrow();
  });

  test("I3. items.listByStatus DRAFT returns created items", async () => {
    const ctx = await seedBaseContext(db);
    const ppicCaller = createTestCaller(ctx.users.PPIC.id, Role.PPIC);
    const adminCaller = createTestCaller(
      ctx.users.SUPERADMIN.id,
      Role.SUPERADMIN,
    );

    await ppicCaller.items.create({
      code: "LIST_DRAFT_1",
      name: "List Draft",
      kind: "RAW",
    });

    const result = await adminCaller.items.listByStatus({ status: "DRAFT" });
    expect(result.items.some((i) => i.code === "LIST_DRAFT_1")).toBe(true);
  });

  test("I4. items.listByStatus forbidden for non-SUPERADMIN", async () => {
    const ctx = await seedBaseContext(db);
    const opCaller = createTestCaller(ctx.users.OPERATOR.id, Role.OPERATOR);

    await expect(
      opCaller.items.listByStatus({ status: "DRAFT" }),
    ).rejects.toThrow();
  });

  test("I5. items.approve activates DRAFT item", async () => {
    const ctx = await seedBaseContext(db);
    const ppicCaller = createTestCaller(ctx.users.PPIC.id, Role.PPIC);
    const adminCaller = createTestCaller(
      ctx.users.SUPERADMIN.id,
      Role.SUPERADMIN,
    );

    const item = await ppicCaller.items.create({
      code: "APPROVE_ME_1",
      name: "Approve Me",
      kind: "RAW",
    });

    const activated = await adminCaller.items.approve({ id: item.id });
    expect(activated.status).toBe("ACTIVE");
  });

  test("I6. items.approve on ACTIVE item -> BAD_REQUEST", async () => {
    const ctx = await seedBaseContext(db);
    const adminCaller = createTestCaller(
      ctx.users.SUPERADMIN.id,
      Role.SUPERADMIN,
    );

    // fg123456789 is already ACTIVE from seed
    await expect(
      adminCaller.items.approve({ id: ctx.items.fg123456789.id }),
    ).rejects.toThrow();
  });
});
