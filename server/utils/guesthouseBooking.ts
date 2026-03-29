import prisma from './prisma'
import { getPrimaryProperty } from './siteSettings'

const BLOCKING_BOOKING_STATUSES = ['pending', 'confirmed', 'checked_in']

export interface StaySearchInput {
  propertyId?: string | null
  checkIn: string
  checkOut: string
  adults?: number
  children?: number
}

export interface SelectedRoomInput {
  roomTypeId: string
  quantity: number
  adults?: number
  children?: number
}

export function parseStayDates(input: StaySearchInput) {
  const checkInDate = new Date(`${input.checkIn}T00:00:00.000Z`)
  const checkOutDate = new Date(`${input.checkOut}T00:00:00.000Z`)

  if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
    throw createError({ statusCode: 400, statusMessage: 'Tanggal check-in / check-out tidak valid' })
  }

  const totalNights = Math.round((checkOutDate.getTime() - checkInDate.getTime()) / 86400000)
  if (totalNights < 1) {
    throw createError({ statusCode: 400, statusMessage: 'Check-out harus setelah check-in' })
  }

  return { checkInDate, checkOutDate, totalNights }
}

function enumerateStayDates(checkInDate: Date, checkOutDate: Date) {
  const dates: Date[] = []
  let cursor = new Date(checkInDate)

  while (cursor < checkOutDate) {
    dates.push(new Date(cursor))
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }

  return dates
}

function overlaps(startDate: Date, endDate: Date, checkInDate: Date, checkOutDate: Date) {
  return startDate < checkOutDate && endDate > checkInDate
}

function ratePriority(rate: { roomTypeId: string | null, priority: number }) {
  return (rate.roomTypeId ? 1000 : 0) + rate.priority
}

async function getProperty(propertyId?: string | null) {
  if (propertyId) {
    const property = await prisma.property.findUnique({ where: { id: propertyId } })
    if (!property) {
      throw createError({ statusCode: 404, statusMessage: 'Property tidak ditemukan' })
    }
    return property
  }

  return getPrimaryProperty()
}

async function loadAvailabilityContext(propertyId: string, checkInDate: Date, checkOutDate: Date) {
  const [roomTypes, roomUnits, bookings, blockedDates, seasonalRates] = await Promise.all([
    prisma.roomType.findMany({
      where: { propertyId, isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    }),
    prisma.roomUnit.findMany({
      where: { propertyId, status: 'active', isBookable: true },
      orderBy: [{ code: 'asc' }],
    }),
    prisma.booking.findMany({
      where: {
        propertyId,
        status: { in: BLOCKING_BOOKING_STATUSES },
        checkInDate: { lt: checkOutDate },
        checkOutDate: { gt: checkInDate },
      },
      include: { bookingRooms: true },
    }),
    prisma.blockedDate.findMany({
      where: {
        propertyId,
        isActive: true,
        startDate: { lt: checkOutDate },
        endDate: { gt: checkInDate },
      },
    }),
    prisma.seasonalRate.findMany({
      where: {
        propertyId,
        isActive: true,
        startDate: { lt: checkOutDate },
        endDate: { gt: checkInDate },
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    }),
  ])

  return { roomTypes, roomUnits, bookings, blockedDates, seasonalRates }
}

function validateGlobalClosures(roomTypeId: string, blockedDates: Array<{ propertyId: string, roomTypeId: string | null, roomUnitId: string | null, startDate: Date, endDate: Date }>, checkInDate: Date, checkOutDate: Date) {
  return blockedDates.some(block => {
    if (!overlaps(block.startDate, block.endDate, checkInDate, checkOutDate)) return false
    if (!block.roomTypeId && !block.roomUnitId) return true
    if (block.roomTypeId === roomTypeId && !block.roomUnitId) return true
    return false
  })
}

function resolveRateForNight(roomType: { id: string, defaultNightlyRate: any }, night: Date, seasonalRates: Array<{ roomTypeId: string | null, startDate: Date, endDate: Date, nightlyRate: any, priority: number }>) {
  const applicable = seasonalRates
    .filter(rate => rate.startDate <= night && rate.endDate > night)
    .sort((left, right) => ratePriority(right) - ratePriority(left))

  const selected = applicable[0]
  return Number(selected?.nightlyRate ?? roomType.defaultNightlyRate)
}

function resolveStayConstraints(roomTypeId: string, checkInDate: Date, checkOutDate: Date, seasonalRates: Array<{ roomTypeId: string | null, startDate: Date, endDate: Date, minStay: number, closedToArrival: boolean, closedToDeparture: boolean, priority: number }>) {
  const overlapping = seasonalRates
    .filter(rate => (!rate.roomTypeId || rate.roomTypeId === roomTypeId) && overlaps(rate.startDate, rate.endDate, checkInDate, checkOutDate))
    .sort((left, right) => ratePriority(right) - ratePriority(left))

  const minStay = overlapping.reduce((max, rate) => Math.max(max, rate.minStay), 1)
  const arrivalBlocked = overlapping.some(rate => rate.closedToArrival && rate.startDate <= checkInDate && rate.endDate > checkInDate)
  const departureBlocked = overlapping.some(rate => rate.closedToDeparture && rate.startDate < checkOutDate && rate.endDate >= checkOutDate)

  return { minStay, arrivalBlocked, departureBlocked }
}

export async function getAvailability(input: StaySearchInput) {
  const property = await getProperty(input.propertyId)
  const { checkInDate, checkOutDate, totalNights } = parseStayDates(input)
  const { roomTypes, roomUnits, bookings, blockedDates, seasonalRates } = await loadAvailabilityContext(property.id, checkInDate, checkOutDate)
  const stayDates = enumerateStayDates(checkInDate, checkOutDate)

  const results = roomTypes.map((roomType) => {
    const typeUnits = roomUnits.filter(unit => unit.roomTypeId === roomType.id)
    const fullyBlocked = validateGlobalClosures(roomType.id, blockedDates, checkInDate, checkOutDate)

    const blockedUnitIds = new Set(
      blockedDates
        .filter(block => block.roomUnitId && overlaps(block.startDate, block.endDate, checkInDate, checkOutDate))
        .map(block => block.roomUnitId as string),
    )

    const assignedBookingUnitIds = new Set(
      bookings
        .flatMap(booking => booking.bookingRooms)
        .filter(room => room.roomTypeId === roomType.id && room.roomUnitId)
        .map(room => room.roomUnitId as string),
    )

    const unassignedHolds = bookings
      .flatMap(booking => booking.bookingRooms)
      .filter(room => room.roomTypeId === roomType.id && !room.roomUnitId)
      .length

    const unavailableAssigned = typeUnits.filter(unit => blockedUnitIds.has(unit.id) || assignedBookingUnitIds.has(unit.id)).length
    const availableUnits = fullyBlocked ? 0 : Math.max(typeUnits.length - unavailableAssigned - unassignedHolds, 0)

    const nightlyRates = stayDates.map((night) => resolveRateForNight(roomType, night, seasonalRates.filter(rate => !rate.roomTypeId || rate.roomTypeId === roomType.id)))
    const subtotal = nightlyRates.reduce((sum, rate) => sum + rate, 0)
    const constraints = resolveStayConstraints(roomType.id, checkInDate, checkOutDate, seasonalRates.filter(rate => !rate.roomTypeId || rate.roomTypeId === roomType.id))
    const isAvailable = availableUnits > 0 && totalNights >= constraints.minStay && !constraints.arrivalBlocked && !constraints.departureBlocked

    return {
      id: roomType.id,
      propertyId: property.id,
      name: roomType.name,
      slug: roomType.slug,
      description: roomType.description,
      baseOccupancy: roomType.baseOccupancy,
      maxOccupancy: roomType.maxOccupancy,
      bedConfiguration: roomType.bedConfiguration,
      defaultNightlyRate: Number(roomType.defaultNightlyRate),
      availableUnits,
      totalUnits: typeUnits.length,
      isAvailable,
      minStay: constraints.minStay,
      arrivalBlocked: constraints.arrivalBlocked,
      departureBlocked: constraints.departureBlocked,
      nightlyRates,
      subtotal,
      averageNightlyRate: nightlyRates.length ? subtotal / nightlyRates.length : 0,
    }
  })

  return {
    property: {
      id: property.id,
      name: property.name,
      checkInTime: property.checkInTime,
      checkOutTime: property.checkOutTime,
    },
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    totalNights,
    roomTypes: results,
  }
}

export async function quoteStay(input: StaySearchInput & { selections: SelectedRoomInput[] }) {
  const availability = await getAvailability(input)
  const selections = input.selections.filter(selection => selection.quantity > 0)

  if (!selections.length) {
    throw createError({ statusCode: 400, statusMessage: 'Pilih minimal satu kamar' })
  }

  const lines = selections.map((selection) => {
    const roomType = availability.roomTypes.find(item => item.id === selection.roomTypeId)
    if (!roomType) {
      throw createError({ statusCode: 400, statusMessage: 'Room type tidak ditemukan dalam hasil availability' })
    }
    if (!roomType.isAvailable) {
      throw createError({ statusCode: 400, statusMessage: `${roomType.name} tidak tersedia untuk tanggal terpilih` })
    }
    if (selection.quantity > roomType.availableUnits) {
      throw createError({ statusCode: 400, statusMessage: `Jumlah ${roomType.name} melebihi ketersediaan` })
    }

    return {
      roomTypeId: roomType.id,
      name: roomType.name,
      quantity: selection.quantity,
      nightlyRates: roomType.nightlyRates,
      lineSubtotal: roomType.subtotal * selection.quantity,
      adults: selection.adults ?? input.adults ?? roomType.baseOccupancy,
      children: selection.children ?? input.children ?? 0,
      averageNightlyRate: roomType.averageNightlyRate,
    }
  })

  const subtotal = lines.reduce((sum, line) => sum + line.lineSubtotal, 0)

  return {
    property: availability.property,
    checkIn: availability.checkIn,
    checkOut: availability.checkOut,
    totalNights: availability.totalNights,
    lines,
    subtotal,
    totalAmount: subtotal,
    currency: 'IDR',
  }
}

export function createBookingReference() {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `BK-${random}`
}