import prisma from '../../utils/prisma'
import { toRelativeUrl } from '../../utils/prisma'
import { getSectionScope } from '../../utils/sections'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const method = event.method

  if (method === 'GET') {
    const section = await prisma.section.findUnique({
      where: { id: id as string },
    })
    if (!section) throw createError({ statusCode: 404, statusMessage: 'Section not found' })
    return section
  }

  if (method === 'PUT') {
    const body = await readBody(event)
    const scope = await getSectionScope({
      businessType: body.businessType ? String(body.businessType) : undefined,
      templateKey: body.templateKey ? String(body.templateKey) : undefined,
    })

    const section = await prisma.section.update({
      where: { id: id as string },
      data: {
        businessType: scope.businessType,
        templateKey: scope.templateKey,
        slug: body.slug,
        title: body.title,
        subtitle: body.subtitle ?? null,
        body: body.body ?? null,
        image: toRelativeUrl(body.image),
        metadata: body.metadata ?? null,
        sortOrder: body.sortOrder,
        isActive: body.isActive,
      },
    })
    return section
  }

  if (method === 'DELETE') {
    await prisma.section.delete({
      where: { id: id as string },
    })
    return { success: true }
  }
})
