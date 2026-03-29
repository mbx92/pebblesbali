import prisma from '../../../utils/prisma'
import { requireAdminUser } from '../../../utils/session'

function normalizeRoomTypeMetadata(body: Record<string, any>) {
  const facilities = Array.isArray(body.facilities)
    ? body.facilities.map((item: unknown) => String(item).trim()).filter(Boolean)
    : []

  return {
    featured: Boolean(body.featured),
    facilities,
    imageUrl: body.imageUrl ? String(body.imageUrl) : null,
  }
}

export default defineEventHandler(async (event) => {
  const id = String(getRouterParam(event, 'id') || '')
  const method = event.method

  if (method === 'GET') {
    const roomType = await prisma.roomType.findUnique({
      where: { id },
      include: {
        roomUnits: { orderBy: [{ code: 'asc' }] },
        _count: { select: { bookingRooms: true } },
      },
    })

    if (!roomType) {
      throw createError({ statusCode: 404, statusMessage: 'Room type tidak ditemukan' })
    }

    return roomType
  }

  await requireAdminUser(event)

  if (method === 'PUT') {
    const body = await readBody(event)

    return prisma.roomType.update({
      where: { id },
      data: {
        name: String(body.name || ''),
        slug: String(body.slug || ''),
        description: body.description || null,
        baseOccupancy: Number(body.baseOccupancy || 2),
        maxOccupancy: Number(body.maxOccupancy || 2),
        maxAdults: body.maxAdults ? Number(body.maxAdults) : null,
        maxChildren: body.maxChildren ? Number(body.maxChildren) : null,
        bedroomCount: body.bedroomCount ? Number(body.bedroomCount) : null,
        bathroomCount: body.bathroomCount ? Number(body.bathroomCount) : null,
        areaSqm: body.areaSqm ? Number(body.areaSqm) : null,
        bedConfiguration: body.bedConfiguration || null,
        defaultNightlyRate: Number(body.defaultNightlyRate || 0),
        extraAdultRate: body.extraAdultRate ? Number(body.extraAdultRate) : null,
        extraChildRate: body.extraChildRate ? Number(body.extraChildRate) : null,
        sortOrder: Number(body.sortOrder || 0),
        isActive: body.isActive ?? true,
        metadata: normalizeRoomTypeMetadata(body),
      },
    })
  }

  if (method === 'DELETE') {
    await prisma.roomType.delete({ where: { id } })
    return { success: true }
  }
})