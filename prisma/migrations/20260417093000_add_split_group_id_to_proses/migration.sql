ALTER TABLE "Proses"
ADD COLUMN "splitGroupId" TEXT;

CREATE INDEX "Proses_splitGroupId_idx"
ON "Proses"("splitGroupId");