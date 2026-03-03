-- AlterTable
ALTER TABLE `Machine` ADD COLUMN `defaultProPrefixId` INTEGER NULL;

-- CreateTable
CREATE TABLE `UserMachineAccess` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `machineId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `UserMachineAccess_userId_idx`(`userId`),
    INDEX `UserMachineAccess_machineId_idx`(`machineId`),
    UNIQUE INDEX `UserMachineAccess_userId_machineId_key`(`userId`, `machineId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserMachineAccess` ADD CONSTRAINT `UserMachineAccess_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserMachineAccess` ADD CONSTRAINT `UserMachineAccess_machineId_fkey` FOREIGN KEY (`machineId`) REFERENCES `Machine`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Machine` ADD CONSTRAINT `Machine_defaultProPrefixId_fkey` FOREIGN KEY (`defaultProPrefixId`) REFERENCES `ProPrefix`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
