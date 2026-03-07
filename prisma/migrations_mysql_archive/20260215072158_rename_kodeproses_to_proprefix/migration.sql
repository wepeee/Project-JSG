/*
  Warnings:

  - You are about to drop the column `kode_ProsesId` on the `Pro` table. All the data in the column will be lost.
  - You are about to drop the `Kode_Proses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Pro` DROP FOREIGN KEY `Pro_kode_ProsesId_fkey`;

-- DropIndex
DROP INDEX `Pro_kode_ProsesId_fkey` ON `Pro`;

-- AlterTable
ALTER TABLE `Material` ADD COLUMN `stock` DECIMAL(12, 3) NOT NULL DEFAULT 0,
    ADD COLUMN `type` VARCHAR(191) NOT NULL DEFAULT 'wip';

-- AlterTable
ALTER TABLE `Pro` DROP COLUMN `kode_ProsesId`,
    ADD COLUMN `partNumber` VARCHAR(191) NULL,
    ADD COLUMN `proPrefixId` INTEGER NULL;

-- DropTable
DROP TABLE `Kode_Proses`;

-- CreateTable
CREATE TABLE `ProPrefix` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(2) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('PAPER', 'RIGID', 'OTHER') NOT NULL DEFAULT 'PAPER',

    UNIQUE INDEX `ProPrefix_code_key`(`code`),
    UNIQUE INDEX `ProPrefix_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pro` ADD CONSTRAINT `Pro_proPrefixId_fkey` FOREIGN KEY (`proPrefixId`) REFERENCES `ProPrefix`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
