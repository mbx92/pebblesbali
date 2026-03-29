import prisma from '../../utils/prisma'
import { getPrimaryProperty } from '../../utils/siteSettings'
import { requireAdminUser } from '../../utils/session'

const BLOCKING_BOOKING_STATUSES = ['pending', 'confirmed', 'checked_in']
const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' })
const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', { weekday: 'short', day: 'numeric', timeZone: 'UTC' })

function parseDateInput(value?: string) {
  const normalized = value && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? value
    : new Date().toISOString().slice(0, 10)

  const parsed = new Date(`${normalized}T00:00:00.000Z`)
  if (Number.isNaN(parsed.getTime())) {
    throw createError({ statusCode: 400, statusMessage: 'Tanggal occupancy tidak valid' })
  }

  return parsed
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

function overlaps(startDate: Date, endDate: Date, dayStart: Date, dayEnd: Date) {
  return startDate < dayEnd && endDate > dayStart
}

function guestName(booking: { guestFirstName: string, guestLastName: string | null }) {
  return [booking.guestFirstName, booking.guestLastName].filter(Boolean).join(' ')
}

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const property = await getPrimaryProperty()
  const query = getQuery(event)
  const startDate = parseDateInput(query.startDate ? String(query.startDate) : undefined)
  const dayCount = Math.min(Math.max(Number(query.days || 14), 7), 31)
  const endDate = addDays(startDate, dayCount)

  const [roomUnits, bookings, blockedDates] = await Promise.all([
    prisma.roomUnit.findMany({
      where: { propertyId: property.id },
      include: {
        roomType: true,
      },
    }),
    prisma.booking.findMany({
      where: {
        propertyId: property.id,
        status: { in: BLOCKING_BOOKING_STATUSES },
        checkInDate: { lt: endDate },
        checkOutDate: { gt: startDate },
      },
      include: {
        bookingRooms: {
          include: {
            roomType: true,
          },
        },
      },
    }),
    prisma.blockedDate.findMany({
      where: {
        propertyId: property.id,
        isActive: true,
        startDate: { lt: endDate },
        endDate: { gt: startDate },
      },
    }),
  ])

  const days = Array.from({ length: dayCount }, (_, index) => {
    const date = addDays(startDate, index)
    const dateKey = formatDate(date)

    return {
      date: dateKey,
      label: DATE_FORMATTER.format(date),
      shortLabel: SHORT_DATE_FORMATTER.format(date),
      isToday: dateKey === formatDate(new Date()),
    }
  })

  const units = roomUnits
    .slice()
    .sort((left, right) => {
      const roomTypeCompare = (left.roomType?.name || '').localeCompare(right.roomType?.name || '')
      if (roomTypeCompare !== 0) return roomTypeCompare
      return left.code.localeCompare(right.code)
    })
    .map((unit) => ({
      id: unit.id,
      code: unit.code,
      name: unit.name,
      roomTypeId: unit.roomTypeId,
      roomTypeName: unit.roomType?.name || 'Unknown room type',
      status: unit.status,
      isBookable: unit.isBookable,
      days: days.map((day) => {
        const dayStart = new Date(`${day.date}T00:00:00.000Z`)
        const dayEnd = addDays(dayStart, 1)

        if (unit.status === 'inactive') {
          return { date: day.date, status: 'inactive' as const, reason: 'Room unit is inactive' }
        }

        if (unit.status === 'maintenance') {
          return { date: day.date, status: 'maintenance' as const, reason: 'Room unit is under maintenance' }
        }

        if (!unit.isBookable) {
          return { date: day.date, status: 'hidden' as const, reason: 'Room unit is hidden from inventory' }
        }

        const blocked = blockedDates.find((entry) => {
          if (!overlaps(entry.startDate, entry.endDate, dayStart, dayEnd)) return false
          if (!entry.roomTypeId && !entry.roomUnitId) return true
          if (entry.roomUnitId === unit.id) return true
          if (entry.roomTypeId === unit.roomTypeId && !entry.roomUnitId) return true
          return false
        })

        if (blocked) {
          return {
            date: day.date,
            status: 'blocked' as const,
            reason: blocked.reason,
            notes: blocked.notes,
          }
        }

        const bookingLine = bookings
          .flatMap(booking => booking.bookingRooms.map(line => ({ booking, line })))
          .find(({ booking, line }) => line.roomUnitId === unit.id && overlaps(booking.checkInDate, booking.checkOutDate, dayStart, dayEnd))

        if (bookingLine) {
          return {
            date: day.date,
            status: 'occupied' as const,
            bookingId: bookingLine.booking.id,
            bookingReference: bookingLine.booking.referenceCode,
            bookingStatus: bookingLine.booking.status,
            guestName: bookingLine.line.guestName || guestName(bookingLine.booking),
            checkInDate: formatDate(bookingLine.booking.checkInDate),
            checkOutDate: formatDate(bookingLine.booking.checkOutDate),
          }
        }

        return { date: day.date, status: 'available' as const }
      }),
    }))

  const unassignedBookingRooms = bookings
    .flatMap(booking => booking.bookingRooms
      .filter(line => !line.roomUnitId)
      .map(line => ({
        bookingId: booking.id,
        bookingRoomId: line.id,
        bookingReference: booking.referenceCode,
        roomTypeId: line.roomTypeId,
        roomTypeName: line.roomType?.name || 'Unknown room type',
        guestName: line.guestName || guestName(booking),
        checkInDate: formatDate(booking.checkInDate),
        checkOutDate: formatDate(booking.checkOutDate),
        status: booking.status,
      })))
    .sort((left, right) => {
      if (left.checkInDate !== right.checkInDate) return left.checkInDate.localeCompare(right.checkInDate)
      return left.bookingReference.localeCompare(right.bookingReference)
    })

  const summaryDate = days.find(day => day.isToday)?.date || days[0]?.date || formatDate(startDate)
  const summary = units.reduce((accumulator, unit) => {
    const cell = unit.days.find(day => day.date === summaryDate)
    const status = cell?.status || 'available'

    if (status === 'available') accumulator.available += 1
    if (status === 'occupied') accumulator.occupied += 1
    if (status === 'blocked') accumulator.blocked += 1
    if (status === 'maintenance') accumulator.maintenance += 1
    if (status === 'inactive') accumulator.inactive += 1
    if (status === 'hidden') accumulator.hidden += 1

    return accumulator
  }, {
    date: summaryDate,
    available: 0,
    occupied: 0,
    blocked: 0,
    maintenance: 0,
    inactive: 0,
    hidden: 0,
    unassigned: unassignedBookingRooms.length,
  })

  return {
    property,
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    dayCount,
    days,
    units,
    summary,
    unassignedBookingRooms,
  }
})