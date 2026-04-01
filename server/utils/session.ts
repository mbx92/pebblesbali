import prisma from './prisma'

export function getSessionCookieOptions(event: any) {
  const requestUrl = getRequestURL(event)
  const forwardedProto = getHeader(event, 'x-forwarded-proto')
  const protocol = String(forwardedProto || requestUrl.protocol || '').replace(/:$/, '').toLowerCase()

  return {
    secure: protocol === 'https',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    httpOnly: true,
  }
}

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
