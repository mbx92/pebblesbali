import prisma from '../../utils/prisma'

function normalizeDomain(domain: string) {
  return domain.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '').toLowerCase()
}

function resolveValidationEndpoint(url: string) {
  const normalized = url.trim().replace(/\/$/, '')

  if (!normalized) {
    return ''
  }

  if (normalized.endsWith('/api/validate')) {
    return normalized
  }

  return `${normalized}/api/validate`
}

function extractDomain(input: string) {
  const trimmed = input.trim()

  if (!trimmed) {
    return ''
  }

  try {
    return normalizeDomain(new URL(trimmed).hostname)
  }
  catch {
    return normalizeDomain(trimmed)
  }
}

function applyLicensedFeatures(currentSettings: Record<string, string>, licensedFeatures: string[]) {
  const enabled = new Set(licensedFeatures)

  return {
    ...currentSettings,
    featureMediaLibrary: enabled.has('media') ? 'true' : 'false',
    featureShop: enabled.has('shop') ? 'true' : 'false',
    featureCart: enabled.has('shop') ? 'true' : 'false',
    featureBlog: enabled.has('blog') ? 'true' : 'false',
    featureRoomInventory: enabled.has('booking') ? 'true' : 'false',
    featureBookingEngine: enabled.has('booking') ? 'true' : 'false',
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const sessionId = getCookie(event, 'mm_session')

  if (!sessionId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthenticated' })
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionId },
    select: { id: true, role: true },
  })

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthenticated' })
  }

  const body = await readBody<{
    licenseKey?: string
    domain?: string
    applyFeatures?: boolean
  }>(event)

  if (!body.licenseKey?.trim()) {
    throw createError({ statusCode: 422, statusMessage: 'licenseKey is required' })
  }

  const siteSettings = await prisma.siteSetting.findMany()
  const currentSettings = Object.fromEntries(siteSettings.map(setting => [setting.key, setting.value])) as Record<string, string>
  const domain = extractDomain(body.domain || currentSettings.siteUrl || '')
  const validationEndpoint = resolveValidationEndpoint(String(config.licenseValidationUrl || config.ocsUrl || ''))

  if (!domain) {
    throw createError({ statusCode: 422, statusMessage: 'siteUrl or domain is required to validate license' })
  }

  if (!validationEndpoint) {
    throw createError({ statusCode: 503, statusMessage: 'License validator is not configured' })
  }

  let validationResult: {
    valid: boolean
    plan: string
    planName?: string
    features: string[]
    expiresAt: string | null
  }

  try {
    validationResult = await $fetch(validationEndpoint, {
      method: 'POST',
      body: {
        licenseKey: body.licenseKey.trim(),
        domain,
      },
    })
  }
  catch (error: any) {
    const statusCode = error?.statusCode || error?.response?.status || 503
    const statusMessage = error?.data?.statusMessage || error?.statusMessage || 'License validation failed'

    throw createError({
      statusCode,
      statusMessage,
    })
  }

  if (!validationResult?.valid) {
    throw createError({ statusCode: 403, statusMessage: 'License validation failed' })
  }

  if (body.applyFeatures) {
    const nextSettings = applyLicensedFeatures(currentSettings, validationResult.features)
    const keysToWrite = [
      'licenseKey',
      'licensePlan',
      'licenseStatus',
      'licenseLastValidatedAt',
      'licenseFeatures',
      'featureMediaLibrary',
      'featureShop',
      'featureCart',
      'featureBlog',
      'featureRoomInventory',
      'featureBookingEngine',
    ] as const

    nextSettings.licenseKey = body.licenseKey.trim()
    nextSettings.licensePlan = validationResult.plan
    nextSettings.licenseStatus = 'valid'
    nextSettings.licenseLastValidatedAt = new Date().toISOString()
    nextSettings.licenseFeatures = validationResult.features.join(',')

    for (const key of keysToWrite) {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value: nextSettings[key] || '' },
        create: { key, value: nextSettings[key] || '' },
      })
    }
  }

  return {
    valid: true,
    plan: validationResult.plan,
    planName: validationResult.planName || validationResult.plan,
    features: validationResult.features,
    expiresAt: validationResult.expiresAt,
    domain,
    appliedFeatures: Boolean(body.applyFeatures),
  }
})