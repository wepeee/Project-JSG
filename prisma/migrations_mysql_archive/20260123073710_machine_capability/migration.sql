-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('SUPERADMIN', 'ADMIN', 'PPIC', 'OPERATOR', 'MASTER') NOT NULL DEFAULT 'ADMIN';

-- CreateTable
CREATE TABLE `Machine` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Machine_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MachineCapability` (
    `stepId` INTEGER NOT NULL,
    `machineId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `standardSpeed` INTEGER NOT NULL,
    `uom` VARCHAR(191) NOT NULL,
    `remark` VARCHAR(191) NULL,

    INDEX `MachineCapability_machineId_idx`(`machineId`),
    UNIQUE INDEX `MachineCapability_machineId_name_key`(`machineId`, `name`),
    PRIMARY KEY (`machineId`, `stepId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MachineCapability` ADD CONSTRAINT `MachineCapability_machineId_fkey` FOREIGN KEY (`machineId`) REFERENCES `Machine`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
