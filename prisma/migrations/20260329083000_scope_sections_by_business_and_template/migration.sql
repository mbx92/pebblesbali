ALTER TABLE "sections"
ADD COLUMN "businessType" TEXT,
ADD COLUMN "templateKey" TEXT;

UPDATE "sections"
SET
  "businessType" = 'jewelry',
  "templateKey" = 'jewelry-classic'
WHERE "slug" IN ('collections', 'about', 'sustainability', 'blog', 'contact');

UPDATE "sections"
SET
  "businessType" = 'guesthouse',
  "templateKey" = 'guesthouse-retreat'
WHERE "slug" IN ('rooms', 'amenities', 'gallery', 'location', 'booking');

UPDATE "sections"
SET
  "businessType" = COALESCE((SELECT "value" FROM "site_settings" WHERE "key" = 'businessType' LIMIT 1), 'jewelry'),
  "templateKey" = COALESCE((SELECT "value" FROM "site_settings" WHERE "key" = 'templateKey' LIMIT 1), 'jewelry-classic')
WHERE "businessType" IS NULL OR "templateKey" IS NULL;

ALTER TABLE "sections"
ALTER COLUMN "businessType" SET NOT NULL,
ALTER COLUMN "templateKey" SET NOT NULL;

DROP INDEX IF EXISTS "sections_slug_key";

CREATE INDEX "sections_businessType_templateKey_sortOrder_idx" ON "sections"("businessType", "templateKey", "sortOrder");
CREATE UNIQUE INDEX "sections_businessType_templateKey_slug_key" ON "sections"("businessType", "templateKey", "slug");