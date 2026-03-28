<script setup lang="ts">
import {
  IconDiamond,
} from '@tabler/icons-vue'
import type { BlogPost, Collection, Section, TemplateNavItem, Testimonial } from '~/types'

definePageMeta({ layout: false })

const { data: sectionsData } = await useFetch<Section[]>('/api/sections')
const { data: collectionsData } = await useFetch<Collection[]>('/api/collections')
const { data: testimonialsData } = await useFetch<Testimonial[]>('/api/testimonials')
const { data: settings } = await useFetch<Record<string, string>>('/api/settings')
const { data: blogData } = await useFetch<BlogPost[]>('/api/blog', { query: { published: 'true' } })

useTheme(settings)

const sections = computed(() => sectionsData.value?.filter(s => s.isActive) ?? [])
const collections = computed(() => collectionsData.value?.filter(c => c.isActive) ?? [])
const testimonials = computed(() => testimonialsData.value?.filter(t => t.isActive) ?? [])
const recentPosts = computed(() => (blogData.value ?? []).slice(0, 3))

const { lang, currency, t, formatPrice, toggleLang, toggleCurrency } = useLocale()
const plan = usePlan()
const requestURL = useRequestURL()
const adminBarVisible = useAdminBar()
const { template, getSectionSlug, getSectionAnchor } = useTemplate(settings)

const siteName = computed(() => settings.value?.siteName || template.value.defaults.siteName)
const siteTagline = computed(() => settings.value?.siteTagline || template.value.defaults.siteTagline || '')
const defaultMetaDescription = computed(() => template.value.defaults.metaDescription || 'Handcrafted Balinese jewelry inspired by the island\'s rich cultural heritage.')
const navigationItems = computed(() => template.value.navigation
  .filter(item => !item.requiresFeature || plan.hasFeature(item.requiresFeature))
  .map(item => ({
    ...item,
    href: item.sectionKey ? `#${getSectionAnchor(item.sectionKey)}` : item.href,
  })))

function getSection(slug: string) {
  return sections.value.find(s => s.slug === slug)
}

function getTemplateSection(key: string) {
  return getSection(getSectionSlug(key))
}

const hero = computed(() => getTemplateSection('hero'))
const collectionsSection = computed(() => getTemplateSection('collections'))
const about = computed(() => getTemplateSection('about'))
const sustainability = computed(() => getTemplateSection('sustainability'))
const blog = computed(() => getTemplateSection('blog'))
const contact = computed(() => getTemplateSection('contact'))
const testimonials_ = computed(() => getTemplateSection('testimonials'))

function getNavLabel(item: TemplateNavItem): string {
  return lang.value === 'id' ? item.label.id : item.label.en
}

/** Get a metadata value from a section with a fallback string */
function meta(section: Section | undefined, key: string, fallback: string = ''): string {
  return section?.metadata?.[key] || fallback
}

useHead({
  htmlAttrs: { style: 'scroll-behavior: smooth;' },
  script: () => settings.value?.googleAnalyticsId ? [
    { src: `https://www.googletagmanager.com/gtag/js?id=${settings.value.googleAnalyticsId}`, async: true },
    { innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${settings.value.googleAnalyticsId}');` },
  ] : [],
})

useSeoMeta({
  title: () => siteName.value,
  description: () => settings.value?.metaDescription || hero.value?.subtitle || siteTagline.value || defaultMetaDescription.value,
  keywords: () => settings.value?.metaKeywords || '',
  ogTitle: () => siteName.value,
  ogDescription: () => settings.value?.metaDescription || hero.value?.subtitle || siteTagline.value || defaultMetaDescription.value,
  ogImage: () => settings.value?.ogImage || hero.value?.image || '',
  ogType: 'website',
  ogUrl: () => requestURL.origin,
  twitterCard: 'summary_large_image',
  twitterTitle: () => siteName.value,
  twitterDescription: () => settings.value?.metaDescription || hero.value?.subtitle || siteTagline.value || defaultMetaDescription.value,
  twitterImage: () => settings.value?.ogImage || hero.value?.image || '',
})
</script>

<template>
  <div :data-theme="template.themeName" class="min-h-screen bg-base-100 font-sans">

    <AdminPreviewBar />

    <!-- ===== NAVBAR ===== -->
    <nav :class="['fixed z-50 w-full bg-base-100/90 backdrop-blur-md border-b border-base-200 transition-[top] duration-300', adminBarVisible ? 'top-9' : 'top-0']">
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2 shrink-0">
          <img v-if="settings?.logoUrl" :src="settings.logoUrl" :alt="siteName" class="h-9 w-auto max-w-40 object-contain" />
          <span v-else class="flex items-center gap-2 text-primary font-serif text-base font-semibold tracking-widest uppercase">
            <IconDiamond class="size-4 shrink-0 text-secondary" />
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
          <NuxtLink v-if="plan.hasFeature('shop')" to="/shop" class="hidden md:inline-flex btn btn-sm btn-secondary text-primary text-xs tracking-widest uppercase ml-2">
            {{ t.nav.shopNow }}
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- ===== HERO ===== -->
    <TemplateSectionRenderer
      section-key="hero"
      :section="hero"
      :section-id="getSectionAnchor('hero')"
      :cta-primary-href="`#${getSectionAnchor('collections')}`"
      :cta-secondary-href="`#${getSectionAnchor('about')}`"
      :scroll-href="`#${getSectionAnchor('collections')}`"
    />

    <!-- ===== COLLECTIONS ===== -->
    <TemplateSectionRenderer
      section-key="collections"
      :section="collectionsSection"
      :collections="collections"
      :section-id="getSectionAnchor('collections')"
    />

    <!-- ===== ABOUT ===== -->
    <TemplateSectionRenderer
      section-key="about"
      :section="about"
      :section-id="getSectionAnchor('about')"
    />

    <!-- ===== SUSTAINABILITY ===== -->
    <TemplateSectionRenderer
      section-key="sustainability"
      :section="sustainability"
      :section-id="getSectionAnchor('sustainability')"
    />

    <!-- ===== TESTIMONIALS ===== -->
    <TemplateSectionRenderer
      section-key="testimonials"
      :section="testimonials_"
      :testimonials="testimonials"
      :section-id="getSectionAnchor('testimonials')"
    />

    <!-- ===== BLOG ===== -->
    <TemplateSectionRenderer
      section-key="blog"
      :section="blog"
      :posts="recentPosts"
      :section-id="getSectionAnchor('blog')"
    />

    <!-- ===== CONTACT ===== -->
    <TemplateSectionRenderer
      section-key="contact"
      :section="contact"
      :settings="settings"
      :section-id="getSectionAnchor('contact')"
    />

    <!-- ===== FOOTER ===== -->
    <footer class="bg-primary py-12">
      <div class="max-w-6xl mx-auto px-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <NuxtLink to="/" class="flex items-center gap-2">
            <img v-if="settings?.logoUrl" :src="settings.logoUrl" :alt="siteName" class="h-7 w-auto object-contain brightness-0 invert opacity-50" />
            <span v-else class="flex items-center gap-2 text-base-100/60 font-serif text-sm tracking-widest uppercase">
              <IconDiamond class="size-4 text-secondary/60" />
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
