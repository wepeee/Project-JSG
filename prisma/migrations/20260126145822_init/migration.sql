/*
  Warnings:

  - Added the required column `uom` to the `Material` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Material` ADD COLUMN `uom` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Process` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(2) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Process_code_key`(`code`),
    UNIQUE INDEX `Process_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProSequence` (
    `prefix` VARCHAR(6) NOT NULL,
    `last` INTEGER NOT NULL,

    PRIMARY KEY (`prefix`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pro` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `proNumber` VARCHAR(9) NOT NULL,
    `productName` VARCHAR(191) NOT NULL,
    `qtyPoPcs` INTEGER NOT NULL,
    `startDate` DATETIME(3) NULL,
    `status` ENUM('OPEN', 'IN_PROGRESS', 'DONE', 'CANCELLED') NOT NULL DEFAULT 'OPEN',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Pro_proNumber_key`(`proNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProStep` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `proId` INTEGER NOT NULL,
    `orderNo` INTEGER NOT NULL,
    `processId` INTEGER NOT NULL,
    `up` INTEGER NULL,
    `machineId` INTEGER NULL,

    INDEX `ProStep_proId_idx`(`proId`),
    UNIQUE INDEX `ProStep_proId_orderNo_key`(`proId`, `orderNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProStepMaterial` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stepId` INTEGER NOT NULL,
    `materialId` INTEGER NOT NULL,
    `qtyReq` DECIMAL(12, 3) NOT NULL,

    INDEX `ProStepMaterial_stepId_idx`(`stepId`),
    UNIQUE INDEX `ProStepMaterial_stepId_materialId_key`(`stepId`, `materialId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProStep` ADD CONSTRAINT `ProStep_proId_fkey` FOREIGN KEY (`proId`) REFERENCES `Pro`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProStep` ADD CONSTRAINT `ProStep_processId_fkey` FOREIGN KEY (`processId`) REFERENCES `Process`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProStep` ADD CONSTRAINT `ProStep_machineId_fkey` FOREIGN KEY (`machineId`) REFERENCES `Machine`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProStepMaterial` ADD CONSTRAINT `ProStepMaterial_stepId_fkey` FOREIGN KEY (`stepId`) REFERENCES `ProStep`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProStepMaterial` ADD CONSTRAINT `ProStepMaterial_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `Material`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
