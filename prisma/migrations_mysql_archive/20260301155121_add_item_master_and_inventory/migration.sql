/*
  Warnings:

  - You are about to drop the column `qtyGood` on the `ProductionReport` table. All the data in the column will be lost.
  - You are about to drop the column `materialId` on the `ProsesMaterial` table. All the data in the column will be lost.
  - You are about to drop the `Material` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[prosesId,itemMasterId]` on the table `ProsesMaterial` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `itemMasterId` to the `ProsesMaterial` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ProsesMaterial` DROP FOREIGN KEY `ProsesMaterial_materialId_fkey`;

-- DropForeignKey
ALTER TABLE `ProsesMaterial` DROP FOREIGN KEY `ProsesMaterial_prosesId_fkey`;

-- DropIndex
DROP INDEX `ProsesMaterial_materialId_fkey` ON `ProsesMaterial`;

-- DropIndex
DROP INDEX `ProsesMaterial_prosesId_materialId_key` ON `ProsesMaterial`;

-- AlterTable
ALTER TABLE `Pro` ADD COLUMN `fgItemId` INTEGER NULL,
    MODIFY `status` ENUM('OPEN', 'IN_PROGRESS', 'COMPLETE', 'CLOSED', 'CANCELLED') NOT NULL DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE `ProductionReport` DROP COLUMN `qtyGood`,
    ADD COLUMN `inputWipQty` DECIMAL(65, 30) NULL DEFAULT 0,
    ADD COLUMN `stockPostedAt` DATETIME(3) NULL,
    ADD COLUMN `voidReason` VARCHAR(191) NULL,
    ADD COLUMN `voidedAt` DATETIME(3) NULL,
    ADD COLUMN `voidedById` VARCHAR(191) NULL,
    MODIFY `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'VOID') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `Proses` ADD COLUMN `outputItemId` INTEGER NULL;

-- AlterTable
ALTER TABLE `ProsesMaterial` DROP COLUMN `materialId`,
    ADD COLUMN `itemMasterId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `Material`;

-- CreateTable
CREATE TABLE `Item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `kind` ENUM('RAW', 'WIP', 'FG', 'CONSUMABLE') NOT NULL,
    `status` ENUM('DRAFT', 'ACTIVE', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `baseUom` VARCHAR(191) NULL,
    `createdById` VARCHAR(191) NULL,
    `createdFrom` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Item_code_key`(`code`),
    INDEX `Item_kind_idx`(`kind`),
    INDEX `Item_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InventoryLocation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('WIP', 'FG', 'RAW', 'HOLD', 'SCRAP') NOT NULL,
    `machineId` INTEGER NULL,

    UNIQUE INDEX `InventoryLocation_code_key`(`code`),
    UNIQUE INDEX `InventoryLocation_machineId_key`(`machineId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InventoryTxn` (
    `id` VARCHAR(191) NOT NULL,
    `groupId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` ENUM('IN', 'OUT', 'ADJUST') NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `qty` DECIMAL(12, 3) NOT NULL,
    `itemMasterId` INTEGER NULL,
    `locationId` INTEGER NOT NULL,
    `proId` INTEGER NULL,
    `prosesId` INTEGER NULL,
    `productionReportId` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `InventoryTxn_itemId_idx`(`itemId`),
    INDEX `InventoryTxn_itemMasterId_idx`(`itemMasterId`),
    INDEX `InventoryTxn_date_idx`(`date`),
    INDEX `InventoryTxn_groupId_idx`(`groupId`),
    INDEX `InventoryTxn_locationId_idx`(`locationId`),
    UNIQUE INDEX `InventoryTxn_productionReportId_itemId_type_locationId_key`(`productionReportId`, `itemId`, `type`, `locationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `ProsesMaterial_itemMasterId_idx` ON `ProsesMaterial`(`itemMasterId`);

-- CreateIndex
CREATE UNIQUE INDEX `ProsesMaterial_prosesId_itemMasterId_key` ON `ProsesMaterial`(`prosesId`, `itemMasterId`);

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pro` ADD CONSTRAINT `Pro_fgItemId_fkey` FOREIGN KEY (`fgItemId`) REFERENCES `Item`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Proses` ADD CONSTRAINT `Proses_outputItemId_fkey` FOREIGN KEY (`outputItemId`) REFERENCES `Item`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProsesMaterial` ADD CONSTRAINT `ProsesMaterial_itemMasterId_fkey` FOREIGN KEY (`itemMasterId`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryLocation` ADD CONSTRAINT `InventoryLocation_machineId_fkey` FOREIGN KEY (`machineId`) REFERENCES `Machine`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryTxn` ADD CONSTRAINT `InventoryTxn_itemMasterId_fkey` FOREIGN KEY (`itemMasterId`) REFERENCES `Item`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryTxn` ADD CONSTRAINT `InventoryTxn_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `InventoryLocation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryTxn` ADD CONSTRAINT `InventoryTxn_proId_fkey` FOREIGN KEY (`proId`) REFERENCES `Pro`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryTxn` ADD CONSTRAINT `InventoryTxn_prosesId_fkey` FOREIGN KEY (`prosesId`) REFERENCES `Proses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryTxn` ADD CONSTRAINT `InventoryTxn_productionReportId_fkey` FOREIGN KEY (`productionReportId`) REFERENCES `ProductionReport`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
