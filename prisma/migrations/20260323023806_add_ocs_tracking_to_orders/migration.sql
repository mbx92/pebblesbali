-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "ocsEntityId" TEXT,
ADD COLUMN     "ocsSyncedAt" TIMESTAMP(3);
