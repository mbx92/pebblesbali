import prisma from '../../utils/prisma'
import { ocsPush } from '../../utils/ocs'

export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, 'mm_session')
  if (!sessionId) throw createError({ statusCode: 401, statusMessage: 'Unauthenticated' })
  const user = await prisma.user.findUnique({ where: { id: sessionId }, select: { role: true } })
  if (!user || !['admin', 'superadmin'].includes(user.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  // Test connection — push a ping record and expect a valid response
  const result = await ocsPush({
    sourceId: `PING-${Date.now()}`,
    sourceEntityType: 'ping',
    sourcePayload: { message: 'Connection test from Pebbles Bali CMS', timestamp: new Date().toISOString() },
  })

  if (!result) {
    throw createError({ statusCode: 503, statusMessage: 'OCS not configured or unreachable' })
  }

  return { ok: true, action: result.action }
})
