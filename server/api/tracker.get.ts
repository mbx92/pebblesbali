import prisma from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, 'mm_session')
  if (!sessionId) throw createError({ statusCode: 401, statusMessage: 'Unauthenticated' })
  const user = await prisma.user.findUnique({ where: { id: sessionId }, select: { role: true } })
  if (!user || !['admin', 'superadmin'].includes(user.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const config = useRuntimeConfig()
  if (!config.ocsUrl || !config.ocsConnectionId || !config.ocsApiKey) {
    return { records: [], notConfigured: true }
  }

  const query = getQuery(event)
  const type = query.type as string | undefined

  try {
    const data = await $fetch<{ records: any[] }>(
      `${config.ocsUrl}/api/integrations/${config.ocsConnectionId}/records`,
      { headers: { 'Authorization': `Bearer ${config.ocsApiKey}` } },
    )
    const records = (data.records || []).filter((r: any) =>
      type ? r.sourceEntityType === type : ['task', 'feature', 'bug'].includes(r.sourceEntityType),
    )
    return { records }
  } catch (err: any) {
    return { records: [], error: err?.message }
  }
})
