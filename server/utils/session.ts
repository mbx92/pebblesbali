import prisma from './prisma'

export async function getSessionUser(event: any) {
  const sessionId = getCookie(event, 'mm_session')
  if (!sessionId) return null

  return prisma.user.findUnique({
    where: { id: sessionId },
    select: { id: true, name: true, email: true, role: true },
  })
}

export async function requireSessionUser(event: any) {
  const user = await getSessionUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthenticated' })
  }

  return user
}

export async function requireAdminUser(event: any) {
  const user = await requireSessionUser(event)
  if (user.role === 'customer') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  return user
}