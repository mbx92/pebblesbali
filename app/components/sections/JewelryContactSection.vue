<script setup lang="ts">
import { IconBrandFacebook, IconBrandInstagram, IconMail, IconMapPin } from '@tabler/icons-vue'
import type { Section } from '~/types'

const props = withDefaults(defineProps<{
  section?: Section
  settings?: Record<string, string> | null
  sectionId?: string
}>(), {
  section: undefined,
  settings: null,
  sectionId: 'contact',
})

const { t } = useLocale()

function meta(section: Section | undefined, key: string, fallback = ''): string {
  return section?.metadata?.[key] || fallback
}

function extractHandle(url: string | undefined | null): string {
  if (!url) return ''
  try {
    const path = new URL(url).pathname.replace(/^\/?|\/?$/g, '')
    const handle = path.split('/').filter(Boolean).pop() || ''
    return handle ? `@${handle}` : ''
  } catch {
    return ''
  }
}
</script>

<template>
  <section :id="sectionId" class="py-24 bg-base-200/40 scroll-mt-16">
    <div class="max-w-6xl mx-auto px-6">
      <div class="text-center mb-16">
        <div class="flex items-center justify-center gap-3 mb-4">
          <div class="h-px w-8 bg-secondary/50" />
          <span class="text-secondary text-xs font-medium tracking-[0.3em] uppercase">{{ meta(section, 'badgeLabel', t.sections.getInTouch) }}</span>
          <div class="h-px w-8 bg-secondary/50" />
        </div>
        <h2 class="font-serif text-4xl md:text-5xl text-primary font-light tracking-wide">
          {{ section?.title || t.sections.studioFallback }}
        </h2>
        <p v-if="section?.subtitle" class="mt-4 text-base-content/60 text-lg font-light max-w-xl mx-auto">
          {{ section.subtitle }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
        <div v-if="settings?.address" class="text-center p-6">
          <div class="size-12 rounded-full border border-secondary/30 flex items-center justify-center mx-auto mb-4">
            <IconMapPin class="size-5 text-secondary" />
          </div>
          <h3 class="font-medium text-primary text-sm tracking-widest uppercase mb-2">{{ meta(section, 'locationLabel', t.contact.location) }}</h3>
          <p class="text-base-content/60 text-sm font-light leading-relaxed">{{ settings.address }}</p>
        </div>
        <div v-if="settings?.contactEmail" class="text-center p-6">
          <div class="size-12 rounded-full border border-secondary/30 flex items-center justify-center mx-auto mb-4">
            <IconMail class="size-5 text-secondary" />
          </div>
          <h3 class="font-medium text-primary text-sm tracking-widest uppercase mb-2">{{ meta(section, 'emailLabel', t.contact.email) }}</h3>
          <a :href="`mailto:${settings.contactEmail}`" class="text-base-content/60 text-sm font-light hover:text-secondary transition-colors">
            {{ settings.contactEmail }}
          </a>
        </div>
        <div v-if="settings?.instagramUrl || settings?.facebookUrl" class="text-center p-6">
          <div class="size-12 rounded-full border border-secondary/30 flex items-center justify-center mx-auto mb-4">
            <IconBrandInstagram class="size-5 text-secondary" />
          </div>
          <h3 class="font-medium text-primary text-sm tracking-widest uppercase mb-2">{{ meta(section, 'socialLabel', t.contact.followUs) }}</h3>
          <div class="flex items-center justify-center gap-6 mt-2">
            <a v-if="settings?.instagramUrl" :href="settings.instagramUrl" target="_blank" rel="noopener" class="flex flex-col items-center gap-1 text-base-content/40 hover:text-secondary transition-colors group">
              <IconBrandInstagram class="size-5" />
              <span v-if="extractHandle(settings.instagramUrl)" class="text-xs tracking-wide group-hover:text-secondary transition-colors">{{ extractHandle(settings.instagramUrl) }}</span>
            </a>
            <a v-if="settings?.facebookUrl" :href="settings.facebookUrl" target="_blank" rel="noopener" class="flex flex-col items-center gap-1 text-base-content/40 hover:text-secondary transition-colors group">
              <IconBrandFacebook class="size-5" />
              <span v-if="extractHandle(settings.facebookUrl)" class="text-xs tracking-wide group-hover:text-secondary transition-colors">{{ extractHandle(settings.facebookUrl) }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
