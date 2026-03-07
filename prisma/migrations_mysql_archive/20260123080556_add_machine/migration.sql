/*
  Warnings:

  - You are about to drop the `MachineCapability` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code]` on the table `Machine` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Machine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stdOutputPerHour` to the `Machine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uom` to the `Machine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Machine` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `MachineCapability` DROP FOREIGN KEY `MachineCapability_machineId_fkey`;

-- DropIndex
DROP INDEX `Machine_name_key` ON `Machine`;

-- AlterTable
ALTER TABLE `Machine` ADD COLUMN `code` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `remark` VARCHAR(191) NULL,
    ADD COLUMN `stdOutputPerHour` INTEGER NOT NULL,
    ADD COLUMN `uom` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `MachineCapability`;

-- CreateIndex
CREATE UNIQUE INDEX `Machine_code_key` ON `Machine`(`code`);
