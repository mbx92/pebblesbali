import prisma from './prisma'

export type CmsLicenseStatus = 'valid' | 'expired' | 'inactive' | 'invalid'

export const LICENSE_CONTROLLED_SETTING_KEYS = [
  'featureMediaLibrary',
  'featureShop',
  'featureCart',
  'featureBlog',
  'featureRoomInventory',
  'featureBookingEngine',
] as const

const LICENSE_STATE_KEYS = [
  'licenseKey',
  'licensePlan',
  'licenseStatus',
  'licenseLastValidatedAt',
  'licenseFeatures',
  'licenseExpiresAt',
  'licenseStatusMessage',
] as const

type StoredLicenseState = {
  licenseKey: string
  licensePlan: string
  licenseStatus: CmsLicenseStatus | ''
  licenseLastValidatedAt: string
  licenseFeatures: string[]
  licenseExpiresAt: string
  licenseStatusMessage: string
}

export function buildLicensedFeatureSettings(licensedFeatures: string[]) {
  const enabled = new Set(licensedFeatures)

  return {
    featureMediaLibrary: enabled.has('media') ? 'true' : 'false',
    featureShop: enabled.has('shop') ? 'true' : 'false',
    featureCart: enabled.has('shop') ? 'true' : 'false',
    featureBlog: enabled.has('blog') ? 'true' : 'false',
    featureRoomInventory: enabled.has('booking') ? 'true' : 'false',
    featureBookingEngine: enabled.has('booking') ? 'true' : 'false',
  }
}

export function buildRevokedFeatureSettings() {
  return {
    featureMediaLibrary: 'false',
    featureShop: 'false',
    featureCart: 'false',
    featureBlog: 'false',
    featureRoomInventory: 'false',
    featureBookingEngine: 'false',
  }
}

export function normalizeCmsLicenseStatus(value: string | null | undefined): CmsLicenseStatus | '' {
  const normalized = String(value || '').trim().toLowerCase()

  if (!normalized) return ''
  if (normalized === 'valid' || normalized === 'active') return 'valid'
  if (normalized === 'expired') return 'expired'
  if (normalized === 'inactive' || normalized === 'disabled' || normalized === 'revoked' || normalized === 'suspended') return 'inactive'
  if (normalized === 'invalid') return 'invalid'

  return ''
}

export function isAdminLicenseBlocked(status: CmsLicenseStatus | '' | null | undefined) {
  return status === 'expired' || status === 'inactive' || status === 'invalid'
}

export function describeLicenseStatus(status: CmsLicenseStatus | '' | null | undefined, fallback?: string | null) {
  if (fallback?.trim()) {
    return fallback.trim()
  }

  if (status === 'expired') {
    return 'CMS license expired. Revalidate the license from Settings to restore access.'
  }

  if (status === 'inactive') {
    return 'CMS license is inactive. Revalidate the license from Settings to restore access.'
  }

  if (status === 'invalid') {
    return 'CMS license is invalid. Update the key and revalidate from Settings.'
  }

  if (status === 'valid') {
    return 'CMS license is valid.'
  }

  return 'CMS license has not been validated yet.'
}

export function inferLicenseStatusFromValidationResult(result: {
  valid?: boolean
  status?: string | null
  isActive?: boolean | null
  expiresAt?: string | null
}) {
  const explicitStatus = normalizeCmsLicenseStatus(result.status)
  if (explicitStatus) {
    return explicitStatus
  }

  if (result.isActive === false) {
    return 'inactive'
  }

  if (result.expiresAt) {
    const expiresAt = new Date(result.expiresAt)
    if (!Number.isNaN(expiresAt.getTime()) && expiresAt.getTime() <= Date.now()) {
      return 'expired'
    }
  }

  return result.valid ? 'valid' : 'invalid'
}

export function inferLicenseStatusFromError(error: any) {
  const explicitStatus = normalizeCmsLicenseStatus(
    error?.data?.licenseStatus
    || error?.data?.status
    || error?.response?._data?.licenseStatus
    || error?.response?._data?.status,
  )

  if (explicitStatus) {
    return explicitStatus
  }

  const message = String(
    error?.data?.statusMessage
    || error?.data?.message
    || error?.response?._data?.statusMessage
    || error?.response?._data?.message
    || error?.statusMessage
    || error?.message
    || '',
  ).toLowerCase()

  if (message.includes('expired')) {
    return 'expired'
  }

  if (
    message.includes('inactive')
    || message.includes('disabled')
    || message.includes('revoked')
    || message.includes('suspended')
  ) {
    return 'inactive'
  }

  return 'invalid'
}

async function upsertSiteSettings(entries: Record<string, string>) {
  for (const [key, value] of Object.entries(entries)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
  }
}

export async function getStoredLicenseState(): Promise<StoredLicenseState> {
  const settings = await prisma.siteSetting.findMany({
    where: {
      key: {
        in: [...LICENSE_STATE_KEYS],
      },
    },
  })

  const record = Object.fromEntries(settings.map((setting) => [setting.key, setting.value])) as Record<string, string>

  return {
    licenseKey: record.licenseKey || '',
    licensePlan: record.licensePlan || '',
    licenseStatus: normalizeCmsLicenseStatus(record.licenseStatus),
    licenseLastValidatedAt: record.licenseLastValidatedAt || '',
    licenseFeatures: record.licenseFeatures?.split(',').map((item) => item.trim()).filter(Boolean) || [],
    licenseExpiresAt: record.licenseExpiresAt || '',
    licenseStatusMessage: record.licenseStatusMessage || '',
  }
}

export async function storeValidLicenseState(input: {
  licenseKey: string
  plan: string
  features: string[]
  expiresAt?: string | null
  message?: string
  syncLicensedFeatures?: boolean
}) {
  const nextSettings: Record<string, string> = {
    licenseKey: input.licenseKey,
    licensePlan: input.plan,
    licenseStatus: 'valid',
    licenseLastValidatedAt: new Date().toISOString(),
    licenseFeatures: input.features.join(','),
    licenseExpiresAt: input.expiresAt || '',
    licenseStatusMessage: input.message || describeLicenseStatus('valid'),
  }

  if (input.syncLicensedFeatures) {
    Object.assign(nextSettings, buildLicensedFeatureSettings(input.features))
  }

  await upsertSiteSettings(nextSettings)
}

export async function storeFailedLicenseState(input: {
  licenseKey: string
  status: Exclude<CmsLicenseStatus, 'valid'>
  message?: string
  expiresAt?: string | null
}) {
  await upsertSiteSettings({
    licenseKey: input.licenseKey,
    licensePlan: '',
    licenseStatus: input.status,
    licenseLastValidatedAt: new Date().toISOString(),
    licenseFeatures: '',
    licenseExpiresAt: input.expiresAt || '',
    licenseStatusMessage: describeLicenseStatus(input.status, input.message),
    ...buildRevokedFeatureSettings(),
  })
}

export async function clearStoredLicenseState() {
  await upsertSiteSettings({
    licenseKey: '',
    licensePlan: '',
    licenseStatus: 'invalid',
    licenseLastValidatedAt: '',
    licenseFeatures: '',
    licenseExpiresAt: '',
    licenseStatusMessage: 'License binding cleared from CMS settings.',
    ...buildRevokedFeatureSettings(),
  })
}
