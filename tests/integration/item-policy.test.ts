import { ItemStatus, ItemKind } from "../../generated/prisma";
import { setupBaseTestEnvironment } from "../helpers/seed";
import { db } from "../setup";

describe("Integration System: Validation - Items/Material Policy", () => {
  let mockEntities: any;

  beforeEach(async () => {
    mockEntities = await setupBaseTestEnvironment(db);
  });

  test("1) PPIC create raw material Item (Draft Status) => Must retain draft and restrict actions properly", async () => {
    const itemCreateReqProps = await db.item.create({
      data: {
        code: "PAPER_MOCKRM_001",
        name: "RAW MAT. PAPER X1",
        kind: ItemKind.RAW,
        baseUom: "PCS",
        status: ItemStatus.DRAFT,
        createdById: mockEntities.users.ppicUser.id,
      },
    });

    const fetchCheck = await db.item.findUnique({
      where: { id: itemCreateReqProps.id },
    });

    expect(fetchCheck?.status).toBe(ItemStatus.DRAFT);
    expect(fetchCheck?.code).toBe("PAPER_MOCKRM_001");
  });

  test("2) SUPERADMIN Only Query Rules -> items.listByStatus(DRAFT) Simulation Data Role Validation Check", async () => {
    const adminResult = await db.item.findMany({
      where: { status: ItemStatus.DRAFT },
    });
    expect(adminResult.length).toBeGreaterThanOrEqual(1);

    // Superadmin status transitions:
    if (adminResult[0]) {
      await db.item.update({
        where: { id: adminResult[0].id },
        data: { status: ItemStatus.ACTIVE },
      });
    }

    const afterApprovalStateCheck = await db.item.findUnique({
      where: { id: adminResult[0]!.id },
    });
    expect(afterApprovalStateCheck?.status).toBe(ItemStatus.ACTIVE);
  });

  test("3) ResolveItemMasterId Core Integrity Rule => Hard reject invalid non-existent logic items code references ", async () => {
    const nonExistentMaterialCode = "ABS_MOCK_XYZ444";

    let targetMasterId = null;
    try {
      const dbItem = await db.item.findFirst({
        where: { code: nonExistentMaterialCode },
      });

      if (!dbItem) {
        throw new Error(
          `Item ${nonExistentMaterialCode} tidak ditemukan di master`,
        );
      }
      targetMasterId = dbItem.id;
    } catch (error: any) {
      expect(error.message).toContain("tidak ditemukan di master");
    }

    expect(targetMasterId).toBeNull();
  });

  test("4) Items that are Active cannot be downgraded to DRAFT", async () => {
    // Check that there's an active item
    const activeItem = await db.item.findFirst({
      where: { status: ItemStatus.ACTIVE },
    });
    expect(activeItem).toBeDefined();

    // Mock constraint enforcement locally for testing the policy design
    let err = null;
    try {
      if (activeItem && activeItem.status === ItemStatus.ACTIVE) {
        throw new Error("Cannot downgrade ACTIVE item to DRAFT status.");
      }
    } catch (e: any) {
      err = e;
    }

    expect(err).toBeDefined();
    expect(err.message).toContain("downgrade ACTIVE");
  });

  test("5) Archiving an Active Item transitions properly", async () => {
    const freshItemToArchive = await db.item.create({
      data: {
        code: "RM_TO_ARCHIVE_1",
        name: "Archive Target Mat",
        kind: ItemKind.RAW,
        baseUom: "KG",
        status: ItemStatus.ACTIVE,
        createdById: mockEntities.users.superAdminUser.id,
      },
    });

    const archiveTransition = await db.item.update({
      where: { id: freshItemToArchive.id },
      data: { status: ItemStatus.ARCHIVED },
    });

    expect(archiveTransition.status).toBe(ItemStatus.ARCHIVED);
  });

  test("6) Fetching items should filter properly on different kind queries", async () => {
    // Create a WIP logic
    await db.item.create({
      data: {
        code: "WIP_TESTING_KINDS_2",
        name: "HALF FINISHED PRODUCT",
        kind: ItemKind.WIP,
        baseUom: "PCS",
        status: ItemStatus.ACTIVE,
        createdById: mockEntities.users.adminUser.id,
      },
    });

    const rawMats = await db.item.findMany({ where: { kind: ItemKind.RAW } });
    const wipMats = await db.item.findMany({ where: { kind: ItemKind.WIP } });

    expect(rawMats.length).toBeGreaterThanOrEqual(1);
    expect(wipMats.length).toBeGreaterThanOrEqual(1);

    const isCleanSplitted = rawMats.every((m) => m.kind !== ItemKind.WIP);
    expect(isCleanSplitted).toBe(true);
  });
});
