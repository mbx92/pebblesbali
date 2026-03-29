<script setup lang="ts">
import { IconArrowRight, IconCoffee, IconTrees } from '@tabler/icons-vue'
import type { Section } from '~/types'

const props = withDefaults(defineProps<{
  section?: Section
  sectionId?: string
  ctaPrimaryHref?: string
  ctaSecondaryHref?: string
  scrollHref?: string
  bookingEnabled?: boolean
}>(), {
  section: undefined,
  sectionId: 'home',
  ctaPrimaryHref: undefined,
  ctaSecondaryHref: undefined,
  scrollHref: undefined,
  bookingEnabled: true,
})

const { lang } = useLocale()

function meta(key: string, fallback = '') {
  return props.section?.metadata?.[key] || fallback
}

function resolveLink(key: string, fallback = '') {
  return props.section?.metadata?.[key] || fallback
}
</script>

<template>
  <section :id="sectionId" class="relative overflow-hidden bg-[linear-gradient(155deg,#253a34_0%,#324c45_50%,#1d2c29_100%)] text-[#f3ede2]">
    <div class="absolute inset-0 opacity-30">
      <img v-if="section?.image" :src="section.image" :alt="section.title" class="h-full w-full object-cover" />
      <div v-else class="h-full w-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_25%),radial-gradient(circle_at_20%_20%,rgba(196,154,108,0.16),transparent_22%)]" />
    </div>

    <div class="relative mx-auto grid min-h-screen max-w-6xl gap-10 px-6 py-28 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.8fr)] lg:items-end lg:px-8">
      <div class="max-w-3xl">
        <div class="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d2b48c] backdrop-blur">
          <IconTrees class="size-4" />
          {{ meta('badgeLabel', lang === 'id' ? 'Courtyard Guesthouse' : 'Courtyard Guesthouse') }}
        </div>
        <h1 class="mt-6 font-serif text-5xl font-medium leading-[0.95] tracking-tight md:text-7xl">
          {{ section?.title || (lang === 'id' ? 'Template yang lebih hangat dan terasa host-led' : 'A warmer template with a more host-led feel') }}
        </h1>
        <p class="mt-6 max-w-2xl text-lg leading-relaxed text-[#f3ede2]/74 md:text-xl">
          {{ section?.subtitle || (lang === 'id' ? 'Cocok untuk properti yang ingin terasa lebih ramah, lebih hidup, dan lebih personal.' : 'Designed for properties that want to feel more personal, lived-in, and host-driven.') }}
        </p>
        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <a :href="resolveLink('ctaPrimaryLink', ctaPrimaryHref || '#rooms')" class="btn border-0 bg-[#d2b48c] px-7 uppercase tracking-[0.24em] text-[#253a34] hover:bg-[#dfc19b]">
            {{ meta('ctaPrimaryText', lang === 'id' ? 'Lihat Kamar' : 'Browse Rooms') }}
          </a>
          <a :href="resolveLink('ctaSecondaryLink', ctaSecondaryHref || '#booking')" class="btn border-white/14 bg-white/8 px-7 uppercase tracking-[0.24em] text-[#f3ede2] hover:bg-white/12">
            {{ meta('ctaSecondaryText', lang === 'id' ? 'Cek Ketersediaan' : 'Check Availability') }}
          </a>
        </div>
      </div>

      <div class="rounded-4xl border border-white/10 bg-white/7 p-6 backdrop-blur-md">
        <div class="flex items-center gap-3 text-[#d2b48c]"><IconCoffee class="size-4" /><span class="text-xs font-semibold uppercase tracking-[0.28em]">Template Mood</span></div>
        <p class="mt-4 text-sm leading-7 text-[#f3ede2]/70">A stronger sense of courtyard atmosphere, guest rituals, and warm hospitality cues.</p>
        <a :href="resolveLink('ctaPrimaryLink', scrollHref || ctaPrimaryHref || '#rooms')" class="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#d2b48c] transition-colors hover:text-[#f3ede2]">
          <span>{{ meta('scrollText', lang === 'id' ? 'Jelajah' : 'Explore') }}</span>
          <IconArrowRight class="size-4" />
        </a>
      </div>
    </div>
  </section>
</template>