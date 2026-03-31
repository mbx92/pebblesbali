-- CreateEnum
CREATE TYPE "LicenseOperationType" AS ENUM ('create', 'update', 'delete', 'validate', 'login', 'logout');

-- CreateEnum
CREATE TYPE "LicenseOperationTone" AS ENUM ('success', 'warning', 'error', 'info');

-- CreateTable
CREATE TABLE "license_plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "features" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "license_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "licenses" (
    "id" TEXT NOT NULL,
    "licenseKey" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT,
    "domain" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "features" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "licenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "license_operations" (
    "id" TEXT NOT NULL,
    "type" "LicenseOperationType" NOT NULL,
    "title" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "tone" "LicenseOperationTone" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "license_operations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "license_sessions" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "license_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "license_plans_slug_key" ON "license_plans"("slug");

-- CreateIndex
CREATE INDEX "license_plans_sortOrder_idx" ON "license_plans"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "licenses_licenseKey_key" ON "licenses"("licenseKey");

-- CreateIndex
CREATE UNIQUE INDEX "licenses_domain_key" ON "licenses"("domain");

-- CreateIndex
CREATE INDEX "licenses_planId_idx" ON "licenses"("planId");

-- CreateIndex
CREATE INDEX "license_operations_createdAt_idx" ON "license_operations"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "license_sessions_tokenHash_key" ON "license_sessions"("tokenHash");

-- CreateIndex
CREATE INDEX "license_sessions_expiresAt_idx" ON "license_sessions"("expiresAt");

-- AddForeignKey
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_planId_fkey" FOREIGN KEY ("planId") REFERENCES "license_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
