<script setup lang="ts">
import { IconArrowRight, IconDiamond, IconSparkles } from '@tabler/icons-vue'
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

const highlights = computed(() => [
  meta('highlight1', 'Small-batch collections'),
  meta('highlight2', 'Island-made detail'),
  meta('highlight3', 'Quiet luxury finish'),
].filter(Boolean))
</script>

<template>
  <section :id="sectionId" class="relative overflow-hidden bg-[linear-gradient(160deg,#1f2f34_0%,#0f191b_52%,#2e4348_100%)] text-base-100">
    <div class="absolute inset-0 opacity-25">
      <img v-if="section?.image" :src="section.image" :alt="section.title" class="h-full w-full object-cover mix-blend-screen" />
      <div v-else class="h-full w-full bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.08),transparent_22%),linear-gradient(120deg,transparent,rgba(255,255,255,0.04),transparent)]" />
    </div>

    <div class="relative mx-auto grid min-h-screen max-w-6xl gap-12 px-6 py-28 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-end lg:px-8">
      <div class="max-w-4xl">
        <div class="inline-flex items-center gap-2 rounded-full border border-base-100/15 bg-base-100/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-secondary">
          <IconSparkles class="size-4" />
          {{ meta('badgeLabel', 'Editorial Collection') }}
        </div>
        <h1 class="mt-6 font-serif text-5xl font-medium leading-[0.92] tracking-tight md:text-7xl">
          {{ section?.title || t.hero.fallbackTitle }}
        </h1>
        <p class="mt-6 max-w-2xl text-lg leading-relaxed text-base-100/72 md:text-xl">
          {{ section?.subtitle || t.hero.fallbackSubtitle }}
        </p>

        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <a :href="resolveLink('ctaPrimaryLink', ctaPrimaryHref)" class="btn btn-secondary border-0 px-7 uppercase tracking-[0.24em] text-primary">
            {{ meta('ctaPrimaryText', t.hero.explore) }}
          </a>
          <a :href="resolveLink('ctaSecondaryLink', ctaSecondaryHref)" class="btn btn-outline border-base-100/20 bg-transparent px-7 uppercase tracking-[0.24em] text-base-100 hover:bg-base-100/8">
            {{ meta('ctaSecondaryText', t.hero.story) }}
          </a>
        </div>
      </div>

      <div class="rounded-[2rem] border border-base-100/10 bg-base-100/6 p-6 backdrop-blur-md">
        <div class="flex items-center gap-3 border-b border-base-100/10 pb-4">
          <div class="rounded-full bg-secondary/15 p-2 text-secondary">
            <IconDiamond class="size-4" />
          </div>
          <div>
            <p class="text-xs uppercase tracking-[0.28em] text-base-100/45">Collection Mood</p>
            <p class="mt-1 text-sm text-base-100/75">Designed for gallery-like presentation and stronger luxury storytelling.</p>
          </div>
        </div>

        <div class="mt-5 space-y-3">
          <div v-for="item in highlights" :key="item" class="rounded-2xl border border-base-100/8 bg-base-100/4 px-4 py-3 text-sm leading-6 text-base-100/76">
            {{ item }}
          </div>
        </div>

        <a :href="resolveLink('ctaPrimaryLink', scrollHref || ctaPrimaryHref)" class="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-base-100/55 transition-colors hover:text-secondary">
          <span>{{ meta('scrollText', t.hero.scroll) }}</span>
          <IconArrowRight class="size-4" />
        </a>
      </div>
    </div>
  </section>
</template>