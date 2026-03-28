import prisma from '../../utils/prisma'
import { toRelativeUrl } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') as string
  const method = event.method

  if (method === 'GET') {
    // Try by ID first, then fall back to slug
    const blogPost = await prisma.blogPost.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    })
    if (!blogPost) {
      throw createError({ statusCode: 404, statusMessage: 'Blog post not found' })
    }
    return blogPost
  }

  if (method === 'PUT') {
    const body = await readBody(event)
    const blogPost = await prisma.blogPost.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt ?? null,
        body: body.body ?? null,
        image: toRelativeUrl(body.image),
        tags: body.tags ?? [],
        isPublished: body.isPublished,
        publishedAt: body.isPublished ? (body.publishedAt ? new Date(body.publishedAt) : new Date()) : null,
        sortOrder: body.sortOrder,
      },
    })
    return blogPost
  }

  if (method === 'DELETE') {
    await prisma.blogPost.delete({
      where: { id },
    })
    return { success: true }
  }
})
