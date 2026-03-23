import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, 'mm_session')
  if (!sessionId) throw createError({ statusCode: 401, statusMessage: 'Unauthenticated' })
  const user = await prisma.user.findUnique({ where: { id: sessionId }, select: { role: true } })
  if (!user || !['admin', 'superadmin'].includes(user.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const config = useRuntimeConfig()
  const method = getMethod(event)

  if (method === 'GET') {
    const syncOrdersSetting = await prisma.siteSetting.findUnique({ where: { key: 'ocsSyncOrders' } })
    return {
      ocsUrl: config.ocsUrl || '',
      ocsConnectionId: config.ocsConnectionId || '',
      ocsProjectId: config.ocsProjectId || '',
      isConfigured: !!(config.ocsUrl && config.ocsConnectionId && config.ocsApiKey),
      syncOrders: syncOrdersSetting?.value !== 'false',
    }
  }

  if (method === 'PUT') {
    const body = await readBody(event)
    const lines: string[] = []

    if (body.ocsUrl !== undefined) lines.push(`NUXT_OCS_URL="${body.ocsUrl}"`)
    if (body.ocsConnectionId !== undefined) lines.push(`NUXT_OCS_CONNECTION_ID="${body.ocsConnectionId}"`)
    if (body.ocsProjectId !== undefined) lines.push(`NUXT_OCS_PROJECT_ID="${body.ocsProjectId}"`)
    if (body.ocsApiKey) lines.push(`NUXT_OCS_API_KEY="${body.ocsApiKey}"`)

    // Handle syncOrders toggle (stored in DB, no restart needed)
    if (body.syncOrders !== undefined) {
      await prisma.siteSetting.upsert({
        where: { key: 'ocsSyncOrders' },
        update: { value: body.syncOrders ? 'true' : 'false' },
        create: { key: 'ocsSyncOrders', value: body.syncOrders ? 'true' : 'false' },
      })
    }

    if (!lines.length) return { updated: true }

    // Read .env, update/append OCS vars
    const { readFileSync, writeFileSync, existsSync } = await import('fs')
    const { resolve } = await import('path')
    const envPath = resolve(process.cwd(), '.env')

    let content = existsSync(envPath) ? readFileSync(envPath, 'utf8') : ''

    const keysToUpdate: Record<string, string> = {}
    if (body.ocsUrl !== undefined) keysToUpdate['NUXT_OCS_URL'] = body.ocsUrl
    if (body.ocsConnectionId !== undefined) keysToUpdate['NUXT_OCS_CONNECTION_ID'] = body.ocsConnectionId
    if (body.ocsProjectId !== undefined) keysToUpdate['NUXT_OCS_PROJECT_ID'] = body.ocsProjectId
    if (body.ocsApiKey) keysToUpdate['NUXT_OCS_API_KEY'] = body.ocsApiKey

    for (const [key, value] of Object.entries(keysToUpdate)) {
      const regex = new RegExp(`^${key}=.*$`, 'm')
      const newLine = `${key}="${value}"`
      if (regex.test(content)) {
        content = content.replace(regex, newLine)
      } else {
        content += `\n${newLine}`
      }
    }

    writeFileSync(envPath, content, 'utf8')
    return { updated: true, note: 'Restart server to apply changes.' }
  }
})
