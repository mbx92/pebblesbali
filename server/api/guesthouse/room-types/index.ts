import prisma from '../../../utils/prisma'
import { requireAdminUser } from '../../../utils/session'
import { ensureDefaultGuesthouseProperty, getPrimaryProperty } from '../../../utils/siteSettings'

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
  const method = event.method

  if (method === 'GET') {
    const property = await ensureDefaultGuesthouseProperty()
    const query = getQuery(event)
    const isPublicRequest = String(query.public || '') === 'true'
    const roomTypes = await prisma.roomType.findMany({
      where: {
        propertyId: property.id,
        ...(isPublicRequest ? {
          isActive: true,
          metadata: {
            path: ['featured'],
            equals: true,
          },
        } : {}),
      },
      include: {
        _count: { select: { roomUnits: true, bookingRooms: true } },
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    })

    return { property, roomTypes }
  }

  await requireAdminUser(event)

  if (method === 'POST') {
    const body = await readBody(event)
    const property = body.propertyId
      ? await prisma.property.findUnique({ where: { id: String(body.propertyId) } })
      : await getPrimaryProperty()

    if (!property) {
      throw createError({ statusCode: 404, statusMessage: 'Property tidak ditemukan' })
    }

    return prisma.roomType.create({
      data: {
        propertyId: property.id,
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
})