/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Machine` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Machine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stdOutputPerShift` to the `Machine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Machine` ADD COLUMN `code` VARCHAR(191) NOT NULL,
    ADD COLUMN `stdOutputPerShift` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Machine_code_key` ON `Machine`(`code`);
