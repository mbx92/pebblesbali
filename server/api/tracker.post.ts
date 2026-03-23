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
    throw createError({ statusCode: 503, statusMessage: 'OCS not configured' })
  }

  const body = await readBody(event)
  const { sourceEntityType, title, description, status, priority, severity, dueDate, targetRelease, businessValue } = body

  if (!sourceEntityType || !['task', 'feature', 'bug'].includes(sourceEntityType)) {
    throw createError({ statusCode: 422, statusMessage: 'sourceEntityType must be task, feature, or bug' })
  }
  if (!title?.trim()) {
    throw createError({ statusCode: 422, statusMessage: 'title is required' })
  }

  const sourceId = `${(sourceEntityType as string).toUpperCase()}-${Date.now()}`
  const sourcePayload: Record<string, unknown> = { title: (title as string).trim() }
  if (description) sourcePayload.description = description
  if (status) sourcePayload.status = status
  if (priority) sourcePayload.priority = priority
  if (severity) sourcePayload.severity = severity
  if (dueDate) sourcePayload.dueDate = dueDate
  if (targetRelease) sourcePayload.targetRelease = targetRelease
  if (businessValue) sourcePayload.businessValue = businessValue

  const result = await $fetch<{ action: string; mappedEntityId: string | null }>(
    `${config.ocsUrl}/api/integrations/${config.ocsConnectionId}/push`,
    {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${config.ocsApiKey}` },
      body: { sourceId, sourceEntityType, sourceStatus: status, projectId: config.ocsProjectId || undefined, sourcePayload },
    },
  ).catch((err: any) => {
    console.error('[OCS] Tracker push failed:', err?.message ?? err)
    return null
  })

  if (!result) {
    throw createError({ statusCode: 503, statusMessage: 'OCS unreachable' })
  }
  return { sourceId, action: result.action, mappedEntityId: result.mappedEntityId }
})
