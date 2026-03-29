import prisma from '../../utils/prisma'
import { getSectionScope } from '../../utils/sections'

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === 'GET') {
    const query = getQuery(event)
    const scope = await getSectionScope({
      businessType: query.businessType ? String(query.businessType) : undefined,
      templateKey: query.templateKey ? String(query.templateKey) : undefined,
    })

    const sections = await prisma.section.findMany({
      where: {
        businessType: scope.businessType,
        templateKey: scope.templateKey,
      },
      orderBy: { sortOrder: 'asc' },
    })
    return sections
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const scope = await getSectionScope({
      businessType: body.businessType ? String(body.businessType) : undefined,
      templateKey: body.templateKey ? String(body.templateKey) : undefined,
    })

    const section = await prisma.section.create({
      data: {
        businessType: scope.businessType,
        templateKey: scope.templateKey,
        slug: body.slug,
        title: body.title,
        subtitle: body.subtitle || null,
        body: body.body || null,
        image: body.image || null,
        metadata: body.metadata || null,
        sortOrder: body.sortOrder ?? 0,
        isActive: body.isActive ?? true,
      },
    })
    return section
  }
})
