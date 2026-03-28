<script setup lang="ts">
import { IconArrowDown, IconDiamond } from '@tabler/icons-vue'
import type { Section } from '~/types'

const props = withDefaults(defineProps<{
  section?: Section
  sectionId?: string
  ctaPrimaryHref?: string
  ctaSecondaryHref?: string
  scrollHref?: string
}>(), {
  section: undefined,
  sectionId: 'home',
  ctaPrimaryHref: undefined,
  ctaSecondaryHref: undefined,
  scrollHref: undefined,
})

const { t } = useLocale()

function meta(section: Section | undefined, key: string, fallback = ''): string {
  return section?.metadata?.[key] || fallback
}

function resolveLink(key: string, fallback?: string): string {
  return props.section?.metadata?.[key] || fallback || ''
}
</script>

<template>
  <section :id="sectionId" class="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary">
    <div v-if="section?.image" class="absolute inset-0">
      <img :src="section.image" :alt="section.title" class="w-full h-full object-cover opacity-30" />
    </div>
    <div v-else class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(25%_0.02_260)_0%,oklch(12%_0.01_260)_100%)]" />

    <div class="absolute top-32 left-12 size-1.5 rounded-full bg-secondary opacity-60" />
    <div class="absolute top-48 left-24 size-1 rounded-full bg-secondary opacity-40" />
    <div class="absolute bottom-32 right-16 size-2 rounded-full bg-secondary opacity-50" />
    <div class="absolute bottom-48 right-32 size-1 rounded-full bg-secondary opacity-30" />

    <div class="relative z-10 text-center px-6 max-w-3xl mx-auto">
      <div class="flex items-center justify-center gap-3 mb-8">
        <div class="h-px w-12 bg-secondary/60" />
        <IconDiamond class="size-5 text-secondary" />
        <div class="h-px w-12 bg-secondary/60" />
      </div>
      <h1 class="font-serif text-5xl md:text-7xl text-base-100 font-light leading-tight tracking-wide mb-6">
        {{ section?.title || t.hero.fallbackTitle }}
      </h1>
      <p class="text-base-100/70 text-lg md:text-xl font-light tracking-wide mb-10 leading-relaxed">
        {{ section?.subtitle || t.hero.fallbackSubtitle }}
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a :href="resolveLink('ctaPrimaryLink', ctaPrimaryHref)" class="btn btn-secondary text-primary text-sm tracking-widest uppercase px-8">
          {{ meta(section, 'ctaPrimaryText', t.hero.explore) }}
        </a>
        <a :href="resolveLink('ctaSecondaryLink', ctaSecondaryHref)" class="btn btn-outline border-base-100/30 text-base-100 text-sm tracking-widest uppercase px-8 hover:bg-base-100/10">
          {{ meta(section, 'ctaSecondaryText', t.hero.story) }}
        </a>
      </div>
      <a :href="resolveLink('ctaPrimaryLink', scrollHref || ctaPrimaryHref)" class="mt-16 inline-flex flex-col items-center gap-2 text-base-100/40 hover:text-secondary transition-colors text-xs tracking-widest uppercase">
        <span>{{ meta(section, 'scrollText', t.hero.scroll) }}</span>
        <IconArrowDown class="size-4 animate-bounce" />
      </a>
    </div>
  </section>
</template>
