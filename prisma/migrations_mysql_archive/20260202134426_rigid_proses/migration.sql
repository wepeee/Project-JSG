-- AlterTable
ALTER TABLE `Machine` ADD COLUMN `cavity` INTEGER NULL,
    ADD COLUMN `cycleTimeMin` DECIMAL(10, 3) NULL,
    ADD COLUMN `cycleTimeSec` DECIMAL(10, 3) NULL,
    ADD COLUMN `manPower` INTEGER NULL,
    ADD COLUMN `partNumber` VARCHAR(191) NULL,
    ADD COLUMN `phase` VARCHAR(191) NULL,
    ADD COLUMN `shortDesc` VARCHAR(191) NULL,
    ADD COLUMN `stdOutputPerDay` INTEGER NULL,
    ADD COLUMN `type` ENUM('PAPER', 'RIGID') NOT NULL DEFAULT 'PAPER',
    ADD COLUMN `workCenter` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `ProStep` ADD COLUMN `cavityStd` INTEGER NULL,
    ADD COLUMN `cycleTimeStd` DECIMAL(10, 2) NULL,
    ADD COLUMN `manPowerStd` INTEGER NULL;

-- AlterTable
ALTER TABLE `Process` ADD COLUMN `type` ENUM('PAPER', 'RIGID', 'OTHER') NOT NULL DEFAULT 'PAPER';

-- CreateTable
CREATE TABLE `ProductionReport` (
    `id` VARCHAR(191) NOT NULL,
    `proStepId` INTEGER NOT NULL,
    `reportDate` DATETIME(3) NOT NULL,
    `shift` INTEGER NOT NULL,
    `operatorName` VARCHAR(191) NOT NULL,
    `reportType` ENUM('PAPER', 'PRINTING', 'PACKING_ASSEMBLY', 'BLOW_MOULDING', 'INJECTION') NOT NULL,
    `startTime` DATETIME(3) NULL,
    `endTime` DATETIME(3) NULL,
    `batchNo` VARCHAR(191) NULL,
    `manPowerStd` INTEGER NULL,
    `manPowerAct` INTEGER NULL,
    `cycleTimeStd` DECIMAL(65, 30) NULL,
    `cycleTimeAct` DECIMAL(65, 30) NULL,
    `cavityStd` INTEGER NULL,
    `cavityAct` INTEGER NULL,
    `inputMaterialQty` DECIMAL(65, 30) NULL DEFAULT 0,
    `materialRunnerQty` DECIMAL(65, 30) NULL DEFAULT 0,
    `materialPurgeQty` DECIMAL(65, 30) NULL DEFAULT 0,
    `qtyPassOn` DECIMAL(65, 30) NULL DEFAULT 0,
    `qtyHold` DECIMAL(65, 30) NULL DEFAULT 0,
    `qtyWip` DECIMAL(65, 30) NULL DEFAULT 0,
    `qtyGood` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `qtyReject` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `rejectBreakdown` JSON NULL,
    `downtimeBreakdown` JSON NULL,
    `totalDowntime` INTEGER NOT NULL DEFAULT 0,
    `notes` TEXT NULL,
    `metaData` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ProductionReport_proStepId_idx`(`proStepId`),
    INDEX `ProductionReport_reportDate_idx`(`reportDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductionReport` ADD CONSTRAINT `ProductionReport_proStepId_fkey` FOREIGN KEY (`proStepId`) REFERENCES `ProStep`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
