import prisma from '../../utils/prisma'
import {
  describeLicenseStatus,
  inferLicenseStatusFromError,
  inferLicenseStatusFromValidationResult,
  storeFailedLicenseState,
  storeValidLicenseState,
} from '../../utils/license'

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
  const licenseKey = body.licenseKey.trim()

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
    status?: string | null
    isActive?: boolean | null
    message?: string | null
    statusMessage?: string | null
  }

  try {
    validationResult = await $fetch(validationEndpoint, {
      method: 'POST',
      body: {
        licenseKey,
        domain,
      },
    })
  }
  catch (error: any) {
    const statusCode = error?.statusCode || error?.response?.status || 503
    const failureStatus = inferLicenseStatusFromError(error)
    const statusMessage = error?.data?.statusMessage || error?.statusMessage || describeLicenseStatus(failureStatus)

    await storeFailedLicenseState({
      licenseKey,
      status: failureStatus,
      message: statusMessage,
    })

    throw createError({
      statusCode,
      statusMessage,
      data: {
        licenseStatus: failureStatus,
      },
    })
  }

  const resolvedStatus = inferLicenseStatusFromValidationResult(validationResult)

  if (!validationResult?.valid || resolvedStatus !== 'valid') {
    const statusMessage = validationResult.statusMessage
      || validationResult.message
      || describeLicenseStatus(resolvedStatus)

    await storeFailedLicenseState({
      licenseKey,
      status: resolvedStatus === 'valid' ? 'invalid' : resolvedStatus,
      message: statusMessage,
      expiresAt: validationResult.expiresAt,
    })

    throw createError({
      statusCode: resolvedStatus === 'expired' ? 403 : 422,
      statusMessage,
      data: {
        licenseStatus: resolvedStatus,
      },
    })
  }

  await storeValidLicenseState({
    licenseKey,
    plan: validationResult.plan,
    features: validationResult.features,
    expiresAt: validationResult.expiresAt,
    message: describeLicenseStatus('valid', validationResult.statusMessage || validationResult.message || null),
    syncLicensedFeatures: Boolean(body.applyFeatures),
  })

  return {
    valid: true,
    licenseStatus: 'valid',
    plan: validationResult.plan,
    planName: validationResult.planName || validationResult.plan,
    features: validationResult.features,
    expiresAt: validationResult.expiresAt,
    domain,
    appliedFeatures: Boolean(body.applyFeatures),
  }
})
