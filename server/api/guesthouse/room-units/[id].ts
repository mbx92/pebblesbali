import prisma from '../../../utils/prisma'
import { requireAdminUser } from '../../../utils/session'

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const id = String(getRouterParam(event, 'id') || '')
  const method = event.method

  if (method === 'PUT') {
    const body = await readBody(event)

    return prisma.roomUnit.update({
      where: { id },
      data: {
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

  if (method === 'DELETE') {
    await prisma.roomUnit.delete({ where: { id } })
    return { success: true }
  }
})