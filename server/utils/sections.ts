import { getSiteSettings } from './siteSettings'

export interface SectionScope {
  businessType: string
  templateKey: string
}

export async function getSectionScope(override?: Partial<SectionScope>) {
  if (override?.businessType && override.templateKey) {
    return {
      businessType: override.businessType,
      templateKey: override.templateKey,
    }
  }

  const settings = await getSiteSettings()

  return {
    businessType: override?.businessType || settings.businessType || 'jewelry',
    templateKey: override?.templateKey || settings.templateKey || 'jewelry-classic',
  }
}