import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === 'GET') {
    const query = getQuery(event)
    const where = query.published === 'true' ? { isPublished: true } : {}
    const blogPosts = await prisma.blogPost.findMany({
      where,
      orderBy: [
        { sortOrder: 'asc' },
        { publishedAt: 'desc' },
      ],
    })
    return blogPosts
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const blogPost = await prisma.blogPost.create({
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt || null,
        body: body.body || null,
        image: body.image || null,
        tags: body.tags ?? [],
        isPublished: body.isPublished ?? false,
        publishedAt: body.isPublished ? (body.publishedAt ? new Date(body.publishedAt) : new Date()) : null,
        sortOrder: body.sortOrder ?? 0,
      },
    })
    return blogPost
  }
})
