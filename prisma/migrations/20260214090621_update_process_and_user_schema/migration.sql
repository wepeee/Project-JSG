/*
  Warnings:

  - You are about to drop the column `partNumber` on the `Machine` table. All the data in the column will be lost.
  - You are about to drop the column `phase` on the `Machine` table. All the data in the column will be lost.
  - You are about to drop the column `shortDesc` on the `Machine` table. All the data in the column will be lost.
  - You are about to drop the column `processId` on the `Pro` table. All the data in the column will be lost.
  - The values [DONE] on the enum `Pro_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `cavityStd` on the `ProStep` table. All the data in the column will be lost.
  - You are about to drop the column `cycleTimeStd` on the `ProStep` table. All the data in the column will be lost.
  - You are about to drop the column `manPowerStd` on the `ProStep` table. All the data in the column will be lost.
  - You are about to drop the `Process` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Pro` DROP FOREIGN KEY `Pro_processId_fkey`;

-- DropIndex
DROP INDEX `Pro_processId_fkey` ON `Pro`;

-- AlterTable
ALTER TABLE `Machine` DROP COLUMN `partNumber`,
    DROP COLUMN `phase`,
    DROP COLUMN `shortDesc`;

-- AlterTable
ALTER TABLE `Pro` DROP COLUMN `processId`,
    ADD COLUMN `kode_ProsesId` INTEGER NULL,
    MODIFY `status` ENUM('OPEN', 'IN_PROGRESS', 'CLOSED', 'CANCELLED') NOT NULL DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE `ProStep` DROP COLUMN `cavityStd`,
    DROP COLUMN `cycleTimeStd`,
    DROP COLUMN `manPowerStd`,
    ADD COLUMN `batchNo` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `ProductionReport` ADD COLUMN `adminNote` TEXT NULL,
    ADD COLUMN `checkedAt` DATETIME(3) NULL,
    ADD COLUMN `checkedById` VARCHAR(191) NULL,
    ADD COLUMN `createdById` VARCHAR(191) NULL,
    ADD COLUMN `othersNote` TEXT NULL,
    ADD COLUMN `rejectionNote` TEXT NULL,
    ADD COLUMN `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `User` ADD COLUMN `department` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Process`;

-- CreateTable
CREATE TABLE `Kode_Proses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(2) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('PAPER', 'RIGID', 'OTHER') NOT NULL DEFAULT 'PAPER',

    UNIQUE INDEX `Kode_Proses_code_key`(`code`),
    UNIQUE INDEX `Kode_Proses_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pro` ADD CONSTRAINT `Pro_kode_ProsesId_fkey` FOREIGN KEY (`kode_ProsesId`) REFERENCES `Kode_Proses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductionReport` ADD CONSTRAINT `ProductionReport_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductionReport` ADD CONSTRAINT `ProductionReport_checkedById_fkey` FOREIGN KEY (`checkedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
