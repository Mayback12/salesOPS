-- Convert products from a fixed enum category to a user-defined text category.
ALTER TABLE "Product" ALTER COLUMN "category" TYPE TEXT USING "category"::text;
ALTER TABLE "Product" ALTER COLUMN "category" SET DEFAULT 'OTHER';

CREATE TABLE "ProductCategory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProductCategory_userId_name_key" ON "ProductCategory"("userId", "name");
CREATE INDEX "ProductCategory_userId_idx" ON "ProductCategory"("userId");

ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

INSERT INTO "ProductCategory" ("id", "userId", "name", "updatedAt")
SELECT CONCAT('seed_', md5(CONCAT("userId", ':', "category"))), "userId", "category", CURRENT_TIMESTAMP
FROM "Product"
GROUP BY "userId", "category"
ON CONFLICT ("userId", "name") DO NOTHING;

DROP TYPE IF EXISTS "Category";
