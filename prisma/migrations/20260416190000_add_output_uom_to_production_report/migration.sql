-- Add enum for report output count unit
DO $$
BEGIN
  CREATE TYPE "public"."OutputCountUom" AS ENUM ('pcs', 'sheet');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Add nullable snapshot column first (safe rollout)
ALTER TABLE "public"."ProductionReport"
ADD COLUMN IF NOT EXISTS "outputUom" "public"."OutputCountUom";

-- Backfill based on linked machine UOM (sheet -> sheet, others -> pcs)
UPDATE "public"."ProductionReport" pr
SET "outputUom" = CASE
  WHEN m."uom"::text = 'sheet' THEN 'sheet'::"public"."OutputCountUom"
  ELSE 'pcs'::"public"."OutputCountUom"
END
FROM "public"."Proses" p
LEFT JOIN "public"."Machine" m
  ON m."id" = p."machineId"
WHERE pr."prosesId" = p."id";

-- Fallback for legacy edge-cases with missing relation
UPDATE "public"."ProductionReport"
SET "outputUom" = 'pcs'::"public"."OutputCountUom"
WHERE "outputUom" IS NULL;
