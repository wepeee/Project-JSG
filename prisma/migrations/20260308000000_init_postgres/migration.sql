-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPERADMIN', 'ADMIN', 'PPIC', 'OPERATOR', 'MASTER');

-- CreateEnum
CREATE TYPE "Uom" AS ENUM ('sheet', 'pcs', 'meter', 'cm');

-- CreateEnum
CREATE TYPE "MachineType" AS ENUM ('PAPER', 'RIGID');

-- CreateEnum
CREATE TYPE "ItemKind" AS ENUM ('RAW', 'WIP', 'FG', 'CONSUMABLE');

-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ProStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'COMPLETE', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ProType" AS ENUM ('PAPER', 'RIGID', 'OTHER');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'VOID');

-- CreateEnum
CREATE TYPE "LphType" AS ENUM ('PAPER', 'PRINTING', 'PACKING_ASSEMBLY', 'BLOW_MOULDING', 'INJECTION');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('WIP', 'FG', 'RAW', 'HOLD', 'SCRAP');

-- CreateEnum
CREATE TYPE "TxnType" AS ENUM ('IN', 'OUT', 'ADJUST');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "department" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMachineAccess" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "machineId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserMachineAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Machine" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "stdOutputPerHour" INTEGER NOT NULL,
    "stdOutputPerShift" INTEGER NOT NULL,
    "uom" "Uom" NOT NULL,
    "type" "MachineType" NOT NULL DEFAULT 'PAPER',
    "remark" TEXT,
    "cycleTimeSec" DECIMAL(10,3),
    "cycleTimeMin" DECIMAL(10,3),
    "cavity" INTEGER,
    "manPower" INTEGER,
    "stdOutputPerDay" INTEGER,
    "workCenter" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "defaultProPrefixId" INTEGER,

    CONSTRAINT "Machine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" "ItemKind" NOT NULL,
    "status" "ItemStatus" NOT NULL DEFAULT 'DRAFT',
    "baseUom" TEXT,
    "createdById" TEXT,
    "createdFrom" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProPrefix" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(2) NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ProType" NOT NULL DEFAULT 'PAPER',

    CONSTRAINT "ProPrefix_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProSequence" (
    "prefix" VARCHAR(6) NOT NULL,
    "last" INTEGER NOT NULL,

    CONSTRAINT "ProSequence_pkey" PRIMARY KEY ("prefix")
);

-- CreateTable
CREATE TABLE "Pro" (
    "id" SERIAL NOT NULL,
    "proNumber" VARCHAR(9) NOT NULL,
    "productName" TEXT NOT NULL,
    "partNumber" TEXT,
    "qtyPoPcs" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3),
    "status" "ProStatus" NOT NULL DEFAULT 'OPEN',
    "type" "ProType" NOT NULL DEFAULT 'PAPER',
    "autoShiftExpansion" BOOLEAN NOT NULL DEFAULT false,
    "proPrefixId" INTEGER,
    "fgItemId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proses" (
    "id" SERIAL NOT NULL,
    "proId" INTEGER NOT NULL,
    "orderNo" INTEGER NOT NULL,
    "up" INTEGER,
    "estimatedShifts" INTEGER,
    "startDate" TIMESTAMP(3),
    "machineId" INTEGER,
    "partNumber" TEXT,
    "batchNo" TEXT,
    "outputItemId" INTEGER,

    CONSTRAINT "Proses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProsesMaterial" (
    "id" SERIAL NOT NULL,
    "prosesId" INTEGER NOT NULL,
    "itemMasterId" INTEGER NOT NULL,
    "qtyReq" DECIMAL(12,3) NOT NULL,

    CONSTRAINT "ProsesMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionReport" (
    "id" TEXT NOT NULL,
    "prosesId" INTEGER NOT NULL,
    "reportDate" TIMESTAMP(3) NOT NULL,
    "shift" INTEGER NOT NULL,
    "operatorName" TEXT NOT NULL,
    "reportType" "LphType" NOT NULL,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "batchNo" TEXT,
    "manPowerStd" INTEGER,
    "manPowerAct" INTEGER,
    "cycleTimeStd" DECIMAL(65,30),
    "cycleTimeAct" DECIMAL(65,30),
    "cavityStd" INTEGER,
    "cavityAct" INTEGER,
    "inputMaterialQty" DECIMAL(65,30) DEFAULT 0,
    "materialRunnerQty" DECIMAL(65,30) DEFAULT 0,
    "materialPurgeQty" DECIMAL(65,30) DEFAULT 0,
    "qtyPassOn" DECIMAL(65,30) DEFAULT 0,
    "qtyHold" DECIMAL(65,30) DEFAULT 0,
    "qtyWip" DECIMAL(65,30) DEFAULT 0,
    "qtyReject" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "rejectBreakdown" JSONB,
    "downtimeBreakdown" JSONB,
    "totalDowntime" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "othersNote" TEXT,
    "adminNote" TEXT,
    "metaData" JSONB,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionNote" TEXT,
    "checkedById" TEXT,
    "checkedAt" TIMESTAMP(3),
    "voidedAt" TIMESTAMP(3),
    "voidedById" TEXT,
    "voidReason" TEXT,
    "stockPostedAt" TIMESTAMP(3),
    "inputWipQty" DECIMAL(65,30) DEFAULT 0,

    CONSTRAINT "ProductionReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryLocation" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "LocationType" NOT NULL,
    "machineId" INTEGER,

    CONSTRAINT "InventoryLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryTxn" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "TxnType" NOT NULL,
    "itemId" TEXT NOT NULL,
    "qty" DECIMAL(12,3) NOT NULL,
    "itemMasterId" INTEGER,
    "locationId" INTEGER NOT NULL,
    "proId" INTEGER,
    "prosesId" INTEGER,
    "productionReportId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryTxn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "UserMachineAccess_userId_idx" ON "UserMachineAccess"("userId");

-- CreateIndex
CREATE INDEX "UserMachineAccess_machineId_idx" ON "UserMachineAccess"("machineId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMachineAccess_userId_machineId_key" ON "UserMachineAccess"("userId", "machineId");

-- CreateIndex
CREATE UNIQUE INDEX "Item_code_key" ON "Item"("code");

-- CreateIndex
CREATE INDEX "Item_kind_idx" ON "Item"("kind");

-- CreateIndex
CREATE INDEX "Item_status_idx" ON "Item"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ProPrefix_code_key" ON "ProPrefix"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ProPrefix_name_key" ON "ProPrefix"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Pro_proNumber_key" ON "Pro"("proNumber");

-- CreateIndex
CREATE INDEX "Proses_proId_idx" ON "Proses"("proId");

-- CreateIndex
CREATE UNIQUE INDEX "Proses_proId_orderNo_key" ON "Proses"("proId", "orderNo");

-- CreateIndex
CREATE INDEX "ProsesMaterial_prosesId_idx" ON "ProsesMaterial"("prosesId");

-- CreateIndex
CREATE INDEX "ProsesMaterial_itemMasterId_idx" ON "ProsesMaterial"("itemMasterId");

-- CreateIndex
CREATE UNIQUE INDEX "ProsesMaterial_prosesId_itemMasterId_key" ON "ProsesMaterial"("prosesId", "itemMasterId");

-- CreateIndex
CREATE INDEX "ProductionReport_prosesId_idx" ON "ProductionReport"("prosesId");

-- CreateIndex
CREATE INDEX "ProductionReport_reportDate_idx" ON "ProductionReport"("reportDate");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryLocation_code_key" ON "InventoryLocation"("code");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryLocation_machineId_key" ON "InventoryLocation"("machineId");

-- CreateIndex
CREATE INDEX "InventoryTxn_itemId_idx" ON "InventoryTxn"("itemId");

-- CreateIndex
CREATE INDEX "InventoryTxn_itemMasterId_idx" ON "InventoryTxn"("itemMasterId");

-- CreateIndex
CREATE INDEX "InventoryTxn_date_idx" ON "InventoryTxn"("date");

-- CreateIndex
CREATE INDEX "InventoryTxn_groupId_idx" ON "InventoryTxn"("groupId");

-- CreateIndex
CREATE INDEX "InventoryTxn_locationId_idx" ON "InventoryTxn"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryTxn_productionReportId_itemId_type_locationId_key" ON "InventoryTxn"("productionReportId", "itemId", "type", "locationId");

-- AddForeignKey
ALTER TABLE "UserMachineAccess" ADD CONSTRAINT "UserMachineAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMachineAccess" ADD CONSTRAINT "UserMachineAccess_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Machine" ADD CONSTRAINT "Machine_defaultProPrefixId_fkey" FOREIGN KEY ("defaultProPrefixId") REFERENCES "ProPrefix"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pro" ADD CONSTRAINT "Pro_proPrefixId_fkey" FOREIGN KEY ("proPrefixId") REFERENCES "ProPrefix"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pro" ADD CONSTRAINT "Pro_fgItemId_fkey" FOREIGN KEY ("fgItemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proses" ADD CONSTRAINT "Proses_proId_fkey" FOREIGN KEY ("proId") REFERENCES "Pro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proses" ADD CONSTRAINT "Proses_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proses" ADD CONSTRAINT "Proses_outputItemId_fkey" FOREIGN KEY ("outputItemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProsesMaterial" ADD CONSTRAINT "ProsesMaterial_prosesId_fkey" FOREIGN KEY ("prosesId") REFERENCES "Proses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProsesMaterial" ADD CONSTRAINT "ProsesMaterial_itemMasterId_fkey" FOREIGN KEY ("itemMasterId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionReport" ADD CONSTRAINT "ProductionReport_prosesId_fkey" FOREIGN KEY ("prosesId") REFERENCES "Proses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionReport" ADD CONSTRAINT "ProductionReport_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionReport" ADD CONSTRAINT "ProductionReport_checkedById_fkey" FOREIGN KEY ("checkedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryLocation" ADD CONSTRAINT "InventoryLocation_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTxn" ADD CONSTRAINT "InventoryTxn_itemMasterId_fkey" FOREIGN KEY ("itemMasterId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTxn" ADD CONSTRAINT "InventoryTxn_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "InventoryLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTxn" ADD CONSTRAINT "InventoryTxn_proId_fkey" FOREIGN KEY ("proId") REFERENCES "Pro"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTxn" ADD CONSTRAINT "InventoryTxn_prosesId_fkey" FOREIGN KEY ("prosesId") REFERENCES "Proses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTxn" ADD CONSTRAINT "InventoryTxn_productionReportId_fkey" FOREIGN KEY ("productionReportId") REFERENCES "ProductionReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

