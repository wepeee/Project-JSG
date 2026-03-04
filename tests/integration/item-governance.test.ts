import { TRPCError } from "@trpc/server";
import { ItemKind, ItemStatus, Role } from "../../generated/prisma";
import {
  activateItem,
  createDraftItem,
  listItemsByStatus,
  resolveItemMasterId,
} from "~/server/domain/inventory-service";
import { db } from "../setup";
import { seedBaseContext } from "../helpers/seed";

describe("B1 Item governance", () => {
  test("I1. PPIC create item -> status DRAFT with 9-digit code", async () => {
    const ctx = await seedBaseContext(db);

    const item = await createDraftItem(db, {
      actorRole: Role.PPIC,
      createdById: ctx.users.PPIC.id,
      code: "333333333",
      name: "Draft Item",
      kind: ItemKind.RAW,
    });

    expect(item.code).toBe("333333333");
    expect(item.status).toBe(ItemStatus.DRAFT);
  });

  test("I2. Duplicate code does not create new record", async () => {
    const ctx = await seedBaseContext(db);
    const before = await db.item.count();

    await createDraftItem(db, {
      actorRole: Role.PPIC,
      createdById: ctx.users.PPIC.id,
      code: "333333333",
      name: "First",
      kind: ItemKind.RAW,
    });

    await expect(
      createDraftItem(db, {
        actorRole: Role.PPIC,
        createdById: ctx.users.PPIC.id,
        code: "333333333",
        name: "Second",
        kind: ItemKind.RAW,
      }),
    ).rejects.toBeInstanceOf(TRPCError);

    const after = await db.item.count();
    expect(after).toBe(before + 1);
  });

  test("I3. SUPERADMIN can list items by DRAFT status", async () => {
    const ctx = await seedBaseContext(db);
    await createDraftItem(db, {
      actorRole: Role.PPIC,
      createdById: ctx.users.PPIC.id,
      code: "333333333",
      name: "Draft Item",
      kind: ItemKind.RAW,
    });

    const drafts = await listItemsByStatus(db, Role.SUPERADMIN, ItemStatus.DRAFT);
    expect(drafts.length).toBeGreaterThanOrEqual(1);
    expect(drafts.some((d) => d.code === "333333333")).toBe(true);
  });

  test("I4. Non-superadmin cannot list items by DRAFT status", async () => {
    await seedBaseContext(db);

    await expect(
      listItemsByStatus(db, Role.ADMIN, ItemStatus.DRAFT),
    ).rejects.toBeInstanceOf(TRPCError);
  });

  test("I5. SUPERADMIN can activate DRAFT item", async () => {
    const ctx = await seedBaseContext(db);
    const item = await createDraftItem(db, {
      actorRole: Role.PPIC,
      createdById: ctx.users.PPIC.id,
      code: "333333333",
      name: "Draft Item",
      kind: ItemKind.RAW,
    });

    const activated = await activateItem(db, Role.SUPERADMIN, item.id);
    expect(activated.status).toBe(ItemStatus.ACTIVE);
  });

  test("I6. resolveItemMasterId missing -> PRECONDITION_FAILED and no auto-create; existing -> same id", async () => {
    const ctx = await seedBaseContext(db);
    const before = await db.item.count();

    await expect(resolveItemMasterId(db, "999999999")).rejects.toMatchObject({
      code: "PRECONDITION_FAILED",
    });

    const after = await db.item.count();
    expect(after).toBe(before);

    const resolvedId = await resolveItemMasterId(db, ctx.items.fg123456789.code);
    expect(resolvedId).toBe(ctx.items.fg123456789.id);
  });
});
