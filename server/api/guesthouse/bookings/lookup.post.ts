import prisma from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const referenceCode = String(body.referenceCode || '').trim().toUpperCase()
  const guestEmail = String(body.guestEmail || '').trim().toLowerCase()

  if (!guestEmail) {
    throw createError({ statusCode: 400, statusMessage: 'Email wajib diisi' })
  }

  const emailFilter = {
    guestEmail: {
      equals: guestEmail,
      mode: 'insensitive' as const,
    },
  }

  if (referenceCode) {
    const booking = await prisma.booking.findFirst({
      where: {
        referenceCode,
        ...emailFilter,
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

    if (!booking) {
      throw createError({ statusCode: 404, statusMessage: 'Booking tidak ditemukan untuk kombinasi reference code dan email tersebut' })
    }

    return {
      mode: 'single',
      booking,
    }
  }

  const bookings = await prisma.booking.findMany({
    where: emailFilter,
    select: {
      id: true,
      referenceCode: true,
      status: true,
      paymentStatus: true,
      checkInDate: true,
      checkOutDate: true,
      totalNights: true,
      totalAmount: true,
      guestFirstName: true,
      guestLastName: true,
      createdAt: true,
      property: {
        select: {
          id: true,
          name: true,
          slug: true,
          timezone: true,
          currency: true,
          checkInTime: true,
          checkOutTime: true,
          address: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
    orderBy: [
      { createdAt: 'desc' },
    ],
  })

  if (!bookings.length) {
    throw createError({ statusCode: 404, statusMessage: 'Tidak ada booking ditemukan untuk email tersebut' })
  }

  return {
    mode: 'list',
    bookings,
  }
})