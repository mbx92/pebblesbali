import prisma from '../../utils/prisma'
import { toRelativeUrl } from '../../utils/prisma'
import { buildLicensedFeatureSettings, LICENSE_CONTROLLED_SETTING_KEYS } from '../../utils/license'
import { ensureTemplateSections } from '../../utils/templateSections'
import { ensureDefaultGuesthouseProperty } from '../../utils/siteSettings'

const LICENSE_CONTROLLED_SETTING_KEY_SET = new Set<string>(LICENSE_CONTROLLED_SETTING_KEYS)

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === 'GET') {
    const settings = await prisma.siteSetting.findMany()
    // Return as key-value object
    const result: Record<string, string> = {}
    for (const s of settings) {
      result[s.key] = s.value
    }
    return result
  }

  if (method === 'PUT') {
    const body = await readBody(event)
    // body is { key: value, key: value, ... }
    const URL_KEYS = ['logoUrl', 'ogImage']
    const entries = Object.entries(body) as [string, string][]
    const requestedKeys = entries.map(([key]) => key)
    const shouldLockLicensedFeatures = requestedKeys.some(key => LICENSE_CONTROLLED_SETTING_KEY_SET.has(key))

    let lockedLicensedFeatureSettings: ReturnType<typeof buildLicensedFeatureSettings> | null = null

    if (shouldLockLicensedFeatures) {
      const licenseSettings = await prisma.siteSetting.findMany({
        where: {
          key: {
            in: ['licenseStatus', 'licenseFeatures'],
          },
        },
      })

      const currentLicenseSettings = Object.fromEntries(licenseSettings.map(setting => [setting.key, setting.value])) as Record<string, string>

      if (currentLicenseSettings.licenseStatus === 'valid') {
        const licensedFeatures = currentLicenseSettings.licenseFeatures
          ?.split(',')
          .map(item => item.trim())
          .filter(Boolean) || []

        lockedLicensedFeatureSettings = buildLicensedFeatureSettings(licensedFeatures)
      }
    }

    for (const [key, value] of entries) {
      const nextValue = lockedLicensedFeatureSettings && key in lockedLicensedFeatureSettings
        ? lockedLicensedFeatureSettings[key as keyof typeof lockedLicensedFeatureSettings]
        : value
      const normalized = URL_KEYS.includes(key) ? (toRelativeUrl(nextValue) ?? '') : String(nextValue)
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value: normalized },
        create: { key, value: normalized },
      })
    }

    const explicitTemplateKey = body.templateKey !== undefined ? String(body.templateKey || '') : ''
    const explicitBusinessType = body.businessType !== undefined ? String(body.businessType || '') : ''
    const draftTemplateKey = body.draftTemplateKey !== undefined ? String(body.draftTemplateKey || '') : ''
    const draftBusinessType = body.draftBusinessType !== undefined ? String(body.draftBusinessType || '') : ''

    await ensureTemplateSections(explicitTemplateKey, explicitBusinessType)
    await ensureTemplateSections(draftTemplateKey, draftBusinessType || explicitBusinessType)

    if (explicitBusinessType === 'guesthouse') {
      await ensureDefaultGuesthouseProperty()
    }

    return { success: true }
  }
})
