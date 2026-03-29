<script setup lang="ts">
import {
  IconDiamond,
  IconHome,
} from '@tabler/icons-vue'
import { useTemplate } from '~/composables/useTemplate'
import { getTemplateByKey } from '~/templates/registry'
import type { BlogPost, Collection, Section, TemplateNavItem, Testimonial } from '~/types'

definePageMeta({ layout: false })

const { data: collectionsData } = await useFetch<Collection[]>('/api/collections')
const { data: testimonialsData } = await useFetch<Testimonial[]>('/api/testimonials')
const { data: settings } = await useFetch<Record<string, string>>('/api/settings', {
  key: 'site-settings',
})
const { data: blogData } = await useFetch<BlogPost[]>('/api/blog', { query: { published: 'true' } })

useTheme(settings)

const route = useRoute()
const previewTemplateKey = computed(() => typeof route.query.previewTemplate === 'string' ? route.query.previewTemplate : undefined)
const previewTemplateDefinition = computed(() => getTemplateByKey(previewTemplateKey.value))
const previewBusinessType = computed(() => previewTemplateDefinition.value?.businessType)
const captureMode = computed(() => typeof route.query.capturePreview === 'string' && route.query.capturePreview === '1')

const { businessType, template, getSectionSlug, getSectionAnchor } = useTemplate(settings, {
  businessType: previewBusinessType,
  templateKey: previewTemplateKey,
})

const { data: sectionsData } = await useFetch<Section[]>('/api/sections', {
  query: computed(() => ({
    businessType: businessType.value,
    templateKey: template.value.key,
  })),
})

const sections = computed(() => sectionsData.value?.filter(s => s.isActive) ?? [])
const collections = computed(() => collectionsData.value?.filter(c => c.isActive) ?? [])
const testimonials = computed(() => testimonialsData.value?.filter(t => t.isActive) ?? [])
const recentPosts = computed(() => (blogData.value ?? []).slice(0, 3))

const { lang, currency, t, formatPrice, toggleLang, toggleCurrency } = useLocale()
const plan = usePlan()
const requestURL = useRequestURL()
const adminBarVisible = useAdminBar()

const siteName = computed(() => settings.value?.siteName || template.value.defaults.siteName)
const siteTagline = computed(() => settings.value?.siteTagline || template.value.defaults.siteTagline || '')
const defaultMetaDescription = computed(() => template.value.defaults.metaDescription || 'Handcrafted Balinese jewelry inspired by the island\'s rich cultural heritage.')
const visibleTemplateSections = computed(() => template.value.sections
  .filter(section => !section.requiresFeature || plan.hasFeature(section.requiresFeature)))

const templateSections = computed(() => visibleTemplateSections.value
  .map(sectionDefinition => ({
    ...sectionDefinition,
    data: getTemplateSection(sectionDefinition.key),
  }))
  .filter(sectionDefinition => !!sectionDefinition.data))

const activeSectionKeys = computed(() => new Set(templateSections.value.map(section => section.key)))

const navigationItems = computed(() => template.value.navigation
  .filter(item => !item.requiresFeature || plan.hasFeature(item.requiresFeature))
  .filter(item => !item.sectionKey || activeSectionKeys.value.has(item.sectionKey))
  .map(item => ({
    ...item,
    href: item.sectionKey ? `#${getSectionAnchor(item.sectionKey)}` : item.href,
  })))

const bookingEngineEnabled = computed(() => businessType.value === 'guesthouse' && plan.hasFeature('bookingEngine'))
const previewMode = computed(() => !!previewTemplateDefinition.value)
const floatingPreviewBadgeVisible = computed(() => previewMode.value && !captureMode.value)
const previewBarVisible = computed(() => !captureMode.value)

const heroPrimaryTargetKey = computed(() => {
  return templateSections.value.find(section => section.key !== 'hero')?.key || null
})

const heroSecondaryTargetKey = computed(() => {
  return templateSections.value.find(section => section.key === 'booking')?.key
    || templateSections.value.filter(section => section.key !== 'hero')[1]?.key
    || heroPrimaryTargetKey.value
    || null
})

const heroPrimaryHref = computed(() => heroPrimaryTargetKey.value ? `#${getSectionAnchor(heroPrimaryTargetKey.value)}` : undefined)
const heroSecondaryHref = computed(() => heroSecondaryTargetKey.value ? `#${getSectionAnchor(heroSecondaryTargetKey.value)}` : undefined)
const topActionLabel = computed(() => {
  if (businessType.value === 'guesthouse') {
    return lang.value === 'id' ? 'Book Stay' : 'Book Stay'
  }

  return t.value.nav.shopNow
})

const topActionHref = computed(() => {
  if (businessType.value === 'guesthouse') {
    return bookingEngineEnabled.value ? '/book' : null
  }

  return null
})

function getSection(slug: string) {
  return sections.value.find(s => s.slug === slug)
}

function getTemplateSection(key: string) {
  return getSection(getSectionSlug(key))
}

function getNavLabel(item: TemplateNavItem): string {
  return lang.value === 'id' ? item.label.id : item.label.en
}

useHead({
  htmlAttrs: { style: 'scroll-behavior: smooth;' },
  script: () => settings.value?.googleAnalyticsId ? [
    { src: `https://www.googletagmanager.com/gtag/js?id=${settings.value.googleAnalyticsId}`, async: true },
    { innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${settings.value.googleAnalyticsId}');` },
  ] : [],
})

const hero = computed(() => getTemplateSection('hero'))
if (import.meta.server) {
  useSeoMeta({
    title: siteName.value,
    description: settings.value?.metaDescription || hero.value?.subtitle || siteTagline.value || defaultMetaDescription.value,
    keywords: settings.value?.metaKeywords || '',
    ogTitle: siteName.value,
    ogDescription: settings.value?.metaDescription || hero.value?.subtitle || siteTagline.value || defaultMetaDescription.value,
    ogImage: settings.value?.ogImage || hero.value?.image || '',
    ogType: 'website',
    ogUrl: requestURL.origin,
    twitterCard: 'summary_large_image',
    twitterTitle: siteName.value,
    twitterDescription: settings.value?.metaDescription || hero.value?.subtitle || siteTagline.value || defaultMetaDescription.value,
    twitterImage: settings.value?.ogImage || getTemplateSection('hero')?.image || '',
  })
}
</script>

<template>
  <div :data-theme="template.themeName" class="min-h-screen bg-base-100 font-sans">

    <AdminPreviewBar v-if="previewBarVisible" />

    <div v-if="floatingPreviewBadgeVisible" class="fixed right-4 z-70 rounded-2xl border border-warning/40 bg-base-100/95 px-4 py-3 text-xs shadow-lg backdrop-blur" :class="adminBarVisible ? 'top-12' : 'top-4'">
      <p class="font-semibold uppercase tracking-wide text-warning">Draft Template Preview</p>
      <p class="mt-1 text-base-content/60">{{ template.label }}</p>
    </div>

    <!-- ===== NAVBAR ===== -->
    <nav :class="['fixed z-50 w-full bg-base-100/90 backdrop-blur-md border-b border-base-200 transition-[top] duration-300', previewBarVisible && adminBarVisible ? 'top-9' : 'top-0']">
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2 shrink-0">
          <img v-if="settings?.logoUrl" :src="settings.logoUrl" :alt="siteName" class="h-9 w-auto max-w-40 object-contain" />
          <span v-else class="flex items-center gap-2 text-primary font-serif text-base font-semibold tracking-widest uppercase">
            <IconDiamond v-if="businessType === 'jewelry'" class="size-4 shrink-0 text-secondary" />
            <IconHome v-else class="size-4 shrink-0 text-secondary" />
            <span class="truncate max-w-36 sm:max-w-none">{{ siteName }}</span>
          </span>
        </NuxtLink>
        <div class="hidden md:flex items-center gap-8 text-xs font-medium tracking-widest uppercase text-base-content/70">
          <template v-for="item in navigationItems" :key="item.key">
            <NuxtLink v-if="item.to" :to="item.to" class="hover:text-secondary transition-colors">{{ getNavLabel(item) }}</NuxtLink>
            <a v-else-if="item.href" :href="item.href" class="hover:text-secondary transition-colors">{{ getNavLabel(item) }}</a>
          </template>
        </div>
        <div class="flex items-center gap-2">
          <button @click="toggleLang" class="btn btn-xs btn-ghost font-medium tracking-widest text-base-content/50 hover:text-primary px-2">
            {{ lang === 'en' ? 'EN' : 'ID' }}
          </button>
          <span class="text-base-content/20 text-xs">|</span>
          <button @click="toggleCurrency" class="btn btn-xs btn-ghost font-medium tracking-widest text-base-content/50 hover:text-primary px-2">
            {{ currency }}
          </button>
          <NuxtLink v-if="businessType === 'jewelry' && plan.hasFeature('shop')" to="/shop" class="hidden md:inline-flex btn btn-sm btn-secondary text-primary text-xs tracking-widest uppercase ml-2">
            {{ t.nav.shopNow }}
          </NuxtLink>
          <a v-else-if="topActionHref" :href="topActionHref" class="hidden md:inline-flex btn btn-sm btn-secondary text-primary text-xs tracking-widest uppercase ml-2">
            {{ topActionLabel }}
          </a>
        </div>
      </div>
    </nav>

    <TemplateSectionRenderer
      v-for="templateSection in templateSections"
      :key="templateSection.key"
      :business-type="businessType"
      :template-key="template.key"
      :section-key="templateSection.key"
      :section="templateSection.data"
      :collections="collections"
      :testimonials="testimonials"
      :posts="recentPosts"
      :settings="settings"
      :section-id="templateSection.anchor"
      :cta-primary-href="heroPrimaryHref"
      :cta-secondary-href="heroSecondaryHref"
      :scroll-href="heroPrimaryHref"
      :booking-enabled="bookingEngineEnabled"
    />

    <!-- ===== FOOTER ===== -->
    <footer class="bg-primary py-12">
      <div class="max-w-6xl mx-auto px-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <NuxtLink to="/" class="flex items-center gap-2">
            <img v-if="settings?.logoUrl" :src="settings.logoUrl" :alt="siteName" class="h-7 w-auto object-contain brightness-0 invert opacity-50" />
            <span v-else class="flex items-center gap-2 text-base-100/60 font-serif text-sm tracking-widest uppercase">
              <IconDiamond v-if="businessType === 'jewelry'" class="size-4 text-secondary/60" />
              <IconHome v-else class="size-4 text-secondary/60" />
              {{ siteName }}
            </span>
          </NuxtLink>
          <p class="text-base-100/30 text-xs tracking-wide text-center">
            &copy; {{ new Date().getFullYear() }} {{ siteName }}. {{ t.footer.tagline }}
          </p>
          <NuxtLink to="/admin/login" class="text-base-100/20 hover:text-base-100/40 transition-colors text-xs tracking-widest uppercase">
            {{ t.footer.admin }}
          </NuxtLink>
        </div>
      </div>
    </footer>

  </div>
</template>
