import {
  DEFAULT_TEMPLATE_KEY,
  getDefaultTemplateForBusinessType,
  getTemplateByKey,
  isBusinessType,
} from '~/templates/registry'
import type { BusinessType } from '~/types'

function normalizeBusinessType(value: string | null | undefined): BusinessType {
  return isBusinessType(value) ? value : 'jewelry'
}

export function useTemplate(
  settings?: Ref<Record<string, string> | null | undefined>,
  overrides?: {
    businessType?: MaybeRefOrGetter<string | null | undefined>
    templateKey?: MaybeRefOrGetter<string | null | undefined>
  },
) {
  const resolvedSettings = computed(() => settings?.value ?? {})
  const overrideBusinessType = computed(() => overrides?.businessType ? toValue(overrides.businessType) : undefined)
  const overrideTemplateKey = computed(() => overrides?.templateKey ? toValue(overrides.templateKey) : undefined)

  const businessType = computed<BusinessType>(() => normalizeBusinessType(overrideBusinessType.value || resolvedSettings.value.businessType))

  const templateKey = computed(() => overrideTemplateKey.value || resolvedSettings.value.templateKey || DEFAULT_TEMPLATE_KEY)

  const template = computed(() => {
    const explicitTemplate = getTemplateByKey(templateKey.value)
    if (explicitTemplate && explicitTemplate.businessType === businessType.value) {
      return explicitTemplate
    }

    return getDefaultTemplateForBusinessType(businessType.value)
  })

  function getSectionSlug(key: string): string {
    return template.value.sectionMap[key] || key
  }

  function getSectionAnchor(key: string, fallback = key): string {
    return template.value.sections.find(section => section.key === key)?.anchor || fallback
  }

  return {
    businessType,
    templateKey,
    template,
    getSectionSlug,
    getSectionAnchor,
  }
}