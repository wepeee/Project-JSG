/*
  Warnings:

  - You are about to drop the column `processId` on the `ProStep` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `ProStep` DROP FOREIGN KEY `ProStep_processId_fkey`;

-- DropIndex
DROP INDEX `ProStep_processId_fkey` ON `ProStep`;

-- AlterTable
ALTER TABLE `Pro` ADD COLUMN `autoShiftExpansion` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `processId` INTEGER NULL,
    ADD COLUMN `type` ENUM('PAPER', 'RIGID', 'OTHER') NOT NULL DEFAULT 'PAPER';

-- AlterTable
ALTER TABLE `ProStep` DROP COLUMN `processId`,
    ADD COLUMN `estimatedShifts` INTEGER NULL,
    ADD COLUMN `partNumber` VARCHAR(191) NULL,
    ADD COLUMN `startDate` DATETIME(3) NULL;

-- AddForeignKey
ALTER TABLE `Pro` ADD CONSTRAINT `Pro_processId_fkey` FOREIGN KEY (`processId`) REFERENCES `Process`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
