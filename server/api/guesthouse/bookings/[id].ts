import prisma from '../../../utils/prisma'
import { requireAdminUser } from '../../../utils/session'

const VALID_BOOKING_STATUSES = ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show']
const VALID_PAYMENT_STATUSES = ['unpaid', 'partially_paid', 'paid', 'refunded', 'voided']

const BLOCKING_BOOKING_STATUSES = ['pending', 'confirmed', 'checked_in']

function overlaps(startDate: Date, endDate: Date, checkInDate: Date, checkOutDate: Date) {
  return startDate < checkOutDate && endDate > checkInDate
}

async function getBookingWithRelations(id: string) {
  return prisma.booking.findUnique({
    where: { id },
    include: {
      property: true,
      bookingRooms: {
        include: {
          roomType: true,
          roomUnit: true,
        },
      },
    },
  })
}

async function attachAssignableRoomUnits(booking: Awaited<ReturnType<typeof getBookingWithRelations>>) {
  if (!booking) {
    return null
  }

  const [propertyUnits, overlappingBookings, blockedDates] = await Promise.all([
    prisma.roomUnit.findMany({
      where: {
        propertyId: booking.propertyId,
        status: 'active',
        isBookable: true,
      },
      include: { roomType: true },
      orderBy: [{ code: 'asc' }],
    }),
    prisma.booking.findMany({
      where: {
        propertyId: booking.propertyId,
        id: { not: booking.id },
        status: { in: BLOCKING_BOOKING_STATUSES },
        checkInDate: { lt: booking.checkOutDate },
        checkOutDate: { gt: booking.checkInDate },
      },
      include: {
        bookingRooms: true,
      },
    }),
    prisma.blockedDate.findMany({
      where: {
        propertyId: booking.propertyId,
        roomUnitId: { not: null },
        isActive: true,
        startDate: { lt: booking.checkOutDate },
        endDate: { gt: booking.checkInDate },
      },
    }),
  ])

  const blockedUnitIds = new Set(
    blockedDates
      .filter((entry) => entry.roomUnitId && overlaps(entry.startDate, entry.endDate, booking.checkInDate, booking.checkOutDate))
      .map((entry) => entry.roomUnitId as string),
  )

  const assignedUnitIds = new Set(
    overlappingBookings
      .flatMap((entry) => entry.bookingRooms)
      .filter((room) => room.roomUnitId)
      .map((room) => room.roomUnitId as string),
  )

  return {
    ...booking,
    bookingRooms: booking.bookingRooms.map((line) => ({
      ...line,
      assignableRoomUnits: propertyUnits.filter((unit) => {
        const assignedToSiblingLine = booking.bookingRooms.some((otherLine) => otherLine.id !== line.id && otherLine.roomUnitId === unit.id)

        if (unit.roomTypeId !== line.roomTypeId) return false
        if (line.roomUnitId === unit.id) return true
        if (assignedToSiblingLine) return false
        if (blockedUnitIds.has(unit.id)) return false
        if (assignedUnitIds.has(unit.id)) return false
        return true
      }),
    })),
  }
}

export default defineEventHandler(async (event) => {
  const id = String(getRouterParam(event, 'id') || '')
  const method = event.method

  if (method === 'GET') {
    await requireAdminUser(event)

    const booking = await attachAssignableRoomUnits(await getBookingWithRelations(id))

    if (!booking) {
      throw createError({ statusCode: 404, statusMessage: 'Booking tidak ditemukan' })
    }

    return booking
  }

  await requireAdminUser(event)

  if (method === 'PUT') {
    const body = await readBody(event)

    if (body.status && !VALID_BOOKING_STATUSES.includes(body.status)) {
      throw createError({ statusCode: 400, statusMessage: 'Status booking tidak valid' })
    }

    if (body.paymentStatus && !VALID_PAYMENT_STATUSES.includes(body.paymentStatus)) {
      throw createError({ statusCode: 400, statusMessage: 'Status pembayaran tidak valid' })
    }

    if (body.bookingRoomId !== undefined) {
      const booking = await getBookingWithRelations(id)

      if (!booking) {
        throw createError({ statusCode: 404, statusMessage: 'Booking tidak ditemukan' })
      }

      const bookingRoomId = String(body.bookingRoomId || '')
      const roomUnitId = body.roomUnitId ? String(body.roomUnitId) : null

      const bookingRoom = booking.bookingRooms.find((line) => line.id === bookingRoomId)
      if (!bookingRoom) {
        throw createError({ statusCode: 404, statusMessage: 'Booking room tidak ditemukan' })
      }

      if (roomUnitId) {
        const enriched = await attachAssignableRoomUnits(booking)
        const enrichedLine = enriched?.bookingRooms.find((line) => line.id === bookingRoomId)
        const isAllowed = enrichedLine?.assignableRoomUnits?.some((unit) => unit.id === roomUnitId)

        if (!isAllowed) {
          throw createError({ statusCode: 400, statusMessage: 'Room unit tidak tersedia untuk line booking ini' })
        }
      }

      await prisma.bookingRoom.update({
        where: { id: bookingRoomId },
        data: { roomUnitId },
      })

      const updatedBooking = await attachAssignableRoomUnits(await getBookingWithRelations(id))

      if (!updatedBooking) {
        throw createError({ statusCode: 404, statusMessage: 'Booking tidak ditemukan setelah update' })
      }

      return updatedBooking
    }

    await prisma.booking.update({
      where: { id },
      data: {
        ...(body.status ? {
          status: body.status,
          ...(body.status === 'confirmed' ? { confirmedAt: new Date() } : {}),
          ...(body.status === 'cancelled' ? { cancelledAt: new Date() } : {}),
          ...(body.status === 'checked_in' ? { checkedInAt: new Date() } : {}),
          ...(body.status === 'checked_out' ? { checkedOutAt: new Date() } : {}),
        } : {}),
        ...(body.paymentStatus ? { paymentStatus: body.paymentStatus } : {}),
        ...(body.internalNotes !== undefined ? { internalNotes: body.internalNotes || null } : {}),
      },
      include: {
        property: true,
        bookingRooms: {
          include: {
            roomType: true,
            roomUnit: true,
          },
        },
      },
    })

    const updatedBooking = await attachAssignableRoomUnits(await getBookingWithRelations(id))

    if (!updatedBooking) {
      throw createError({ statusCode: 404, statusMessage: 'Booking tidak ditemukan setelah update' })
    }

    return updatedBooking
  }
})