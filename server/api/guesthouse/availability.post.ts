import { getAvailability } from '../../utils/guesthouseBooking'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  return getAvailability({
    propertyId: body.propertyId || null,
    checkIn: String(body.checkIn || ''),
    checkOut: String(body.checkOut || ''),
    adults: Number(body.adults || 1),
    children: Number(body.children || 0),
  })
})