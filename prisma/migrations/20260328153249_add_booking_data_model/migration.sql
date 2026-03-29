-- CreateEnum
CREATE TYPE "RoomUnitStatus" AS ENUM ('active', 'maintenance', 'inactive');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show');

-- CreateEnum
CREATE TYPE "BookingPaymentStatus" AS ENUM ('unpaid', 'partially_paid', 'paid', 'refunded', 'voided');

-- CreateTable
CREATE TABLE "properties" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Makassar',
    "currency" TEXT NOT NULL DEFAULT 'IDR',
    "checkInTime" TEXT,
    "checkOutTime" TEXT,
    "address" TEXT,
    "metadata" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_types" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "baseOccupancy" INTEGER NOT NULL DEFAULT 2,
    "maxOccupancy" INTEGER NOT NULL DEFAULT 2,
    "maxAdults" INTEGER,
    "maxChildren" INTEGER,
    "bedroomCount" INTEGER,
    "bathroomCount" INTEGER,
    "areaSqm" INTEGER,
    "bedConfiguration" TEXT,
    "defaultNightlyRate" DECIMAL(15,2) NOT NULL,
    "extraAdultRate" DECIMAL(15,2),
    "extraChildRate" DECIMAL(15,2),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "room_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_units" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "roomTypeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT,
    "floor" TEXT,
    "status" "RoomUnitStatus" NOT NULL DEFAULT 'active',
    "isBookable" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "room_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "referenceCode" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'direct',
    "status" "BookingStatus" NOT NULL DEFAULT 'pending',
    "paymentStatus" "BookingPaymentStatus" NOT NULL DEFAULT 'unpaid',
    "guestFirstName" TEXT NOT NULL,
    "guestLastName" TEXT,
    "guestEmail" TEXT NOT NULL,
    "guestPhone" TEXT,
    "guestCountry" TEXT,
    "notes" TEXT,
    "internalNotes" TEXT,
    "checkInDate" DATE NOT NULL,
    "checkOutDate" DATE NOT NULL,
    "adultCount" INTEGER NOT NULL DEFAULT 1,
    "childCount" INTEGER NOT NULL DEFAULT 0,
    "totalNights" INTEGER NOT NULL,
    "subtotal" DECIMAL(15,2) NOT NULL,
    "taxAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "feeAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'IDR',
    "confirmedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "checkedInAt" TIMESTAMP(3),
    "checkedOutAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_rooms" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "roomTypeId" TEXT NOT NULL,
    "roomUnitId" TEXT,
    "guestName" TEXT,
    "adults" INTEGER NOT NULL DEFAULT 1,
    "children" INTEGER NOT NULL DEFAULT 0,
    "nightlyRate" DECIMAL(15,2) NOT NULL,
    "extraGuestFee" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "lineTotal" DECIMAL(15,2) NOT NULL,
    "rateSnapshot" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seasonal_rates" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "roomTypeId" TEXT,
    "name" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "nightlyRate" DECIMAL(15,2) NOT NULL,
    "minStay" INTEGER NOT NULL DEFAULT 1,
    "closedToArrival" BOOLEAN NOT NULL DEFAULT false,
    "closedToDeparture" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seasonal_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blocked_dates" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "roomTypeId" TEXT,
    "roomUnitId" TEXT,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "reason" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blocked_dates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "properties_slug_key" ON "properties"("slug");

-- CreateIndex
CREATE INDEX "room_types_propertyId_isActive_sortOrder_idx" ON "room_types"("propertyId", "isActive", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "room_types_propertyId_slug_key" ON "room_types"("propertyId", "slug");

-- CreateIndex
CREATE INDEX "room_units_roomTypeId_status_isBookable_idx" ON "room_units"("roomTypeId", "status", "isBookable");

-- CreateIndex
CREATE UNIQUE INDEX "room_units_propertyId_code_key" ON "room_units"("propertyId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_referenceCode_key" ON "bookings"("referenceCode");

-- CreateIndex
CREATE INDEX "bookings_propertyId_checkInDate_checkOutDate_idx" ON "bookings"("propertyId", "checkInDate", "checkOutDate");

-- CreateIndex
CREATE INDEX "bookings_status_paymentStatus_idx" ON "bookings"("status", "paymentStatus");

-- CreateIndex
CREATE INDEX "booking_rooms_bookingId_idx" ON "booking_rooms"("bookingId");

-- CreateIndex
CREATE INDEX "booking_rooms_roomTypeId_idx" ON "booking_rooms"("roomTypeId");

-- CreateIndex
CREATE INDEX "booking_rooms_roomUnitId_idx" ON "booking_rooms"("roomUnitId");

-- CreateIndex
CREATE INDEX "seasonal_rates_propertyId_startDate_endDate_isActive_idx" ON "seasonal_rates"("propertyId", "startDate", "endDate", "isActive");

-- CreateIndex
CREATE INDEX "seasonal_rates_roomTypeId_startDate_endDate_idx" ON "seasonal_rates"("roomTypeId", "startDate", "endDate");

-- CreateIndex
CREATE INDEX "blocked_dates_propertyId_startDate_endDate_isActive_idx" ON "blocked_dates"("propertyId", "startDate", "endDate", "isActive");

-- CreateIndex
CREATE INDEX "blocked_dates_roomTypeId_startDate_endDate_idx" ON "blocked_dates"("roomTypeId", "startDate", "endDate");

-- CreateIndex
CREATE INDEX "blocked_dates_roomUnitId_startDate_endDate_idx" ON "blocked_dates"("roomUnitId", "startDate", "endDate");

-- AddForeignKey
ALTER TABLE "room_types" ADD CONSTRAINT "room_types_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_units" ADD CONSTRAINT "room_units_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_units" ADD CONSTRAINT "room_units_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "room_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_rooms" ADD CONSTRAINT "booking_rooms_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_rooms" ADD CONSTRAINT "booking_rooms_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "room_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_rooms" ADD CONSTRAINT "booking_rooms_roomUnitId_fkey" FOREIGN KEY ("roomUnitId") REFERENCES "room_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seasonal_rates" ADD CONSTRAINT "seasonal_rates_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seasonal_rates" ADD CONSTRAINT "seasonal_rates_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "room_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocked_dates" ADD CONSTRAINT "blocked_dates_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocked_dates" ADD CONSTRAINT "blocked_dates_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "room_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocked_dates" ADD CONSTRAINT "blocked_dates_roomUnitId_fkey" FOREIGN KEY ("roomUnitId") REFERENCES "room_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;
