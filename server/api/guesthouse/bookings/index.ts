import prisma from '../../../utils/prisma'
import { createBookingReference, quoteStay } from '../../../utils/guesthouseBooking'
import { getPrimaryProperty } from '../../../utils/siteSettings'
import { requireAdminUser } from '../../../utils/session'

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === 'GET') {
    await requireAdminUser(event)

    const property = await getPrimaryProperty()
    const query = getQuery(event)
    const status = query.status ? String(query.status) : undefined

    return prisma.booking.findMany({
      where: {
        propertyId: property.id,
        ...(status ? { status } : {}),
      },
      include: {
        bookingRooms: {
          include: {
            roomType: true,
            roomUnit: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const property = await getPrimaryProperty()
    const quote = await quoteStay({
      propertyId: property.id,
      checkIn: String(body.checkIn || ''),
      checkOut: String(body.checkOut || ''),
      adults: Number(body.adults || 1),
      children: Number(body.children || 0),
      selections: Array.isArray(body.selections) ? body.selections : [],
    })

    const guestFirstName = String(body.guestFirstName || '').trim()
    const guestEmail = String(body.guestEmail || '').trim()

    if (!guestFirstName || !guestEmail) {
      throw createError({ statusCode: 400, statusMessage: 'Nama dan email tamu wajib diisi' })
    }

    const booking = await prisma.booking.create({
      data: {
        propertyId: property.id,
        referenceCode: createBookingReference(),
        source: 'direct',
        status: 'pending',
        paymentStatus: 'unpaid',
        guestFirstName,
        guestLastName: body.guestLastName || null,
        guestEmail,
        guestPhone: body.guestPhone || null,
        guestCountry: body.guestCountry || null,
        notes: body.notes || null,
        checkInDate: new Date(`${quote.checkIn}T00:00:00.000Z`),
        checkOutDate: new Date(`${quote.checkOut}T00:00:00.000Z`),
        adultCount: Number(body.adults || 1),
        childCount: Number(body.children || 0),
        totalNights: quote.totalNights,
        subtotal: quote.subtotal,
        totalAmount: quote.totalAmount,
        currency: quote.currency,
        bookingRooms: {
          create: quote.lines.flatMap(line => Array.from({ length: line.quantity }).map(() => ({
            roomTypeId: line.roomTypeId,
            adults: line.adults,
            children: line.children,
            nightlyRate: line.averageNightlyRate,
            lineTotal: line.lineSubtotal / line.quantity,
            extraGuestFee: 0,
            rateSnapshot: { nightlyRates: line.nightlyRates },
          }))),
        },
      },
      include: {
        bookingRooms: {
          include: {
            roomType: true,
            roomUnit: true,
          },
        },
      },
    })

    return booking
  }
})