/*
  Warnings:

  - You are about to drop the column `code` on the `Machine` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Machine_code_key` ON `Machine`;

-- AlterTable
ALTER TABLE `Machine` DROP COLUMN `code`;
