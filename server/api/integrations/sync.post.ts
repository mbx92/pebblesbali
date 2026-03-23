import prisma from '../../utils/prisma'
import { syncOrderToOcs } from '../../utils/ocs'

export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, 'mm_session')
  if (!sessionId) throw createError({ statusCode: 401, statusMessage: 'Unauthenticated' })
  const user = await prisma.user.findUnique({ where: { id: sessionId }, select: { role: true } })
  if (!user || !['admin', 'superadmin'].includes(user.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const orders = await prisma.$queryRaw<{ id: string }[]>`
    SELECT id FROM orders
    WHERE "ocsSyncedAt" IS NULL
       OR "updatedAt" > "ocsSyncedAt"
    ORDER BY "createdAt" DESC
    LIMIT 50
  `

  let synced = 0
  for (const order of orders) {
    await syncOrderToOcs(order.id).catch(() => {})
    synced++
  }

  return { synced }
})
