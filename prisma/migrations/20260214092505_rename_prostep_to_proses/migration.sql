/*
  Warnings:

  - You are about to drop the column `proStepId` on the `ProductionReport` table. All the data in the column will be lost.
  - You are about to drop the `ProStep` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProStepMaterial` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `prosesId` to the `ProductionReport` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ProStep` DROP FOREIGN KEY `ProStep_machineId_fkey`;

-- DropForeignKey
ALTER TABLE `ProStep` DROP FOREIGN KEY `ProStep_proId_fkey`;

-- DropForeignKey
ALTER TABLE `ProStepMaterial` DROP FOREIGN KEY `ProStepMaterial_materialId_fkey`;

-- DropForeignKey
ALTER TABLE `ProStepMaterial` DROP FOREIGN KEY `ProStepMaterial_stepId_fkey`;

-- DropForeignKey
ALTER TABLE `ProductionReport` DROP FOREIGN KEY `ProductionReport_proStepId_fkey`;

-- DropIndex
DROP INDEX `ProductionReport_proStepId_idx` ON `ProductionReport`;

-- AlterTable
ALTER TABLE `ProductionReport` DROP COLUMN `proStepId`,
    ADD COLUMN `prosesId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `ProStep`;

-- DropTable
DROP TABLE `ProStepMaterial`;

-- CreateTable
CREATE TABLE `Proses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `proId` INTEGER NOT NULL,
    `orderNo` INTEGER NOT NULL,
    `up` INTEGER NULL,
    `estimatedShifts` INTEGER NULL,
    `startDate` DATETIME(3) NULL,
    `machineId` INTEGER NULL,
    `partNumber` VARCHAR(191) NULL,
    `batchNo` VARCHAR(191) NULL,

    INDEX `Proses_proId_idx`(`proId`),
    UNIQUE INDEX `Proses_proId_orderNo_key`(`proId`, `orderNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProsesMaterial` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `prosesId` INTEGER NOT NULL,
    `materialId` INTEGER NOT NULL,
    `qtyReq` DECIMAL(12, 3) NOT NULL,

    INDEX `ProsesMaterial_prosesId_idx`(`prosesId`),
    UNIQUE INDEX `ProsesMaterial_prosesId_materialId_key`(`prosesId`, `materialId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `ProductionReport_prosesId_idx` ON `ProductionReport`(`prosesId`);

-- AddForeignKey
ALTER TABLE `Proses` ADD CONSTRAINT `Proses_proId_fkey` FOREIGN KEY (`proId`) REFERENCES `Pro`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Proses` ADD CONSTRAINT `Proses_machineId_fkey` FOREIGN KEY (`machineId`) REFERENCES `Machine`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProsesMaterial` ADD CONSTRAINT `ProsesMaterial_prosesId_fkey` FOREIGN KEY (`prosesId`) REFERENCES `Proses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProsesMaterial` ADD CONSTRAINT `ProsesMaterial_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `Material`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductionReport` ADD CONSTRAINT `ProductionReport_prosesId_fkey` FOREIGN KEY (`prosesId`) REFERENCES `Proses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
