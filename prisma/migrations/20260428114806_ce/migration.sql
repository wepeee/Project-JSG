-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Uom" ADD VALUE 'drum';
ALTER TYPE "Uom" ADD VALUE 'gr';
ALTER TYPE "Uom" ADD VALUE 'gram';
ALTER TYPE "Uom" ADD VALUE 'kg';
ALTER TYPE "Uom" ADD VALUE 'liter';
ALTER TYPE "Uom" ADD VALUE 'pack';
ALTER TYPE "Uom" ADD VALUE 'rim';
ALTER TYPE "Uom" ADD VALUE 'roll';
