<script setup lang="ts">
import { IconArrowRight, IconRosetteDiscountCheck, IconSparkles } from '@tabler/icons-vue'
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

function meta(key: string, fallback = '') {
  return props.section?.metadata?.[key] || fallback
}

function resolveLink(key: string, fallback?: string) {
  return props.section?.metadata?.[key] || fallback || ''
}
</script>

<template>
  <section :id="sectionId" class="relative overflow-hidden bg-[linear-gradient(145deg,#f6efe6_0%,#fdf9f2_52%,#e9dccd_100%)] text-[#2f2a25]">
    <div class="absolute inset-0 opacity-50">
      <img v-if="section?.image" :src="section.image" :alt="section.title" class="h-full w-full object-cover mix-blend-multiply opacity-35" />
      <div v-else class="h-full w-full bg-[radial-gradient(circle_at_top_left,rgba(196,154,108,0.22),transparent_32%),radial-gradient(circle_at_85%_18%,rgba(55,112,119,0.12),transparent_26%)]" />
    </div>

    <div class="relative mx-auto grid min-h-screen max-w-6xl gap-12 px-6 py-28 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.75fr)] lg:items-center lg:px-8">
      <div class="max-w-3xl">
        <div class="inline-flex items-center gap-2 rounded-full border border-[#2f2a25]/10 bg-white/60 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8d6b49] backdrop-blur">
          <IconSparkles class="size-4" />
          {{ meta('badgeLabel', 'Boutique Atelier') }}
        </div>
        <h1 class="mt-6 font-serif text-5xl font-medium leading-[0.95] tracking-tight md:text-7xl">
          {{ section?.title || t.hero.fallbackTitle }}
        </h1>
        <p class="mt-6 max-w-2xl text-lg leading-relaxed text-[#2f2a25]/70 md:text-xl">
          {{ section?.subtitle || t.hero.fallbackSubtitle }}
        </p>
        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <a :href="resolveLink('ctaPrimaryLink', ctaPrimaryHref)" class="btn border-0 bg-[#2f2a25] px-7 uppercase tracking-[0.24em] text-white hover:bg-[#1f1a16]">
            {{ meta('ctaPrimaryText', t.hero.explore) }}
          </a>
          <a :href="resolveLink('ctaSecondaryLink', ctaSecondaryHref)" class="btn border-[#2f2a25]/10 bg-white/80 px-7 uppercase tracking-[0.24em] text-[#2f2a25] hover:bg-white">
            {{ meta('ctaSecondaryText', t.hero.story) }}
          </a>
        </div>
      </div>

      <div class="rounded-4xl border border-[#2f2a25]/10 bg-white/72 p-6 shadow-[0_24px_70px_rgba(78,60,34,0.12)] backdrop-blur">
        <div class="flex items-center gap-3">
          <div class="rounded-full bg-[#c49a6c]/14 p-2 text-[#8d6b49]"><IconRosetteDiscountCheck class="size-4" /></div>
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[#2f2a25]/46">Boutique Template</p>
        </div>
        <p class="mt-4 text-sm leading-7 text-[#2f2a25]/68">Warm neutrals, denser product framing, and a softer luxury tone for smaller jewelry brands.</p>
        <a :href="resolveLink('ctaPrimaryLink', scrollHref || ctaPrimaryHref)" class="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#8d6b49] transition-colors hover:text-[#2f2a25]">
          <span>{{ meta('scrollText', t.hero.scroll) }}</span>
          <IconArrowRight class="size-4" />
        </a>
      </div>
    </div>
  </section>
</template>