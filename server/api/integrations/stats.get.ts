import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, 'mm_session')
  if (!sessionId) throw createError({ statusCode: 401, statusMessage: 'Unauthenticated' })
  const user = await prisma.user.findUnique({ where: { id: sessionId }, select: { role: true } })
  if (!user || !['admin', 'superadmin'].includes(user.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const [total, synced] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { ocsSyncedAt: { not: null } } }),
  ])

  return { total, synced, pending: total - synced }
})
