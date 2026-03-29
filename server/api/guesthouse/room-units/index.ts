import prisma from '../../../utils/prisma'
import { requireAdminUser } from '../../../utils/session'
import { getPrimaryProperty } from '../../../utils/siteSettings'

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const method = event.method

  if (method === 'GET') {
    const property = await getPrimaryProperty()
    const roomUnits = await prisma.roomUnit.findMany({
      where: { propertyId: property.id },
      include: {
        roomType: true,
      },
      orderBy: [{ code: 'asc' }],
    })

    return { property, roomUnits }
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const property = await getPrimaryProperty()

    return prisma.roomUnit.create({
      data: {
        propertyId: property.id,
        roomTypeId: String(body.roomTypeId || ''),
        code: String(body.code || ''),
        name: body.name || null,
        floor: body.floor || null,
        status: body.status || 'active',
        isBookable: body.isBookable ?? true,
      },
      include: {
        roomType: true,
      },
    })
  }
})