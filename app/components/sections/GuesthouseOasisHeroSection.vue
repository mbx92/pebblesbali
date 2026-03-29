<script setup lang="ts">
import { IconArrowRight, IconLeaf, IconSun } from '@tabler/icons-vue'
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

const primaryLink = computed(() => resolveLink('ctaPrimaryLink', props.ctaPrimaryHref || '#rooms'))
const secondaryLink = computed(() => resolveLink('ctaSecondaryLink', props.ctaSecondaryHref || (props.bookingEnabled ? '#booking' : '#location')))
</script>

<template>
  <section :id="sectionId" class="relative overflow-hidden bg-[#f5efe6] text-[#233536]">
    <div class="absolute inset-0 opacity-90">
      <img v-if="section?.image" :src="section.image" :alt="section.title" class="h-full w-full object-cover opacity-45" />
      <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(245,239,230,0.68),rgba(245,239,230,0.96)),radial-gradient(circle_at_top_left,rgba(110,145,114,0.18),transparent_28%)]" />
    </div>

    <div class="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-24 lg:px-8">
      <div class="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_20rem] lg:items-center">
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-2 rounded-full border border-[#233536]/10 bg-white/55 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#4f6a54] backdrop-blur">
            <IconLeaf class="size-4" />
            {{ meta('badgeLabel', lang === 'id' ? 'Oasis Courtyard Stay' : 'Oasis Courtyard Stay') }}
          </div>
          <h1 class="mt-6 font-serif text-5xl font-medium leading-[0.95] tracking-tight md:text-7xl">
            {{ section?.title || (lang === 'id' ? 'Template guesthouse yang lebih ringan dan airy' : 'A lighter, airier guesthouse template') }}
          </h1>
          <p class="mt-6 max-w-2xl text-lg leading-relaxed text-[#233536]/72 md:text-xl">
            {{ section?.subtitle || (lang === 'id' ? 'Tampilan ini fokus pada rasa teduh, terang, dan alami untuk properti guesthouse tropis.' : 'This layout leans into a bright, natural mood suited to tropical guesthouse stays.') }}
          </p>

          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <a :href="primaryLink" class="btn border-0 bg-[#233536] px-7 uppercase tracking-[0.24em] text-white hover:bg-[#172627]">
              {{ meta('ctaPrimaryText', lang === 'id' ? 'Lihat Kamar' : 'Browse Rooms') }}
            </a>
            <a :href="secondaryLink" class="btn border-[#233536]/15 bg-white/60 px-7 uppercase tracking-[0.24em] text-[#233536] hover:bg-white">
              {{ meta('ctaSecondaryText', lang === 'id' ? 'Cek Detail' : 'Check Details') }}
            </a>
          </div>
        </div>

        <div class="rounded-[2rem] border border-[#233536]/10 bg-white/70 p-6 backdrop-blur-md">
          <div class="flex items-center gap-3">
            <div class="rounded-full bg-[#4f6a54]/10 p-2 text-[#4f6a54]"><IconSun class="size-4" /></div>
            <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[#233536]/46">Template Focus</p>
          </div>
          <p class="mt-5 text-sm leading-7 text-[#233536]/70">Soft contrast, simpler room cards, and cleaner booking prompts for fast guesthouse setup.</p>
          <a :href="resolveLink('ctaPrimaryLink', scrollHref || props.ctaPrimaryHref || '#rooms')" class="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#4f6a54] transition-colors hover:text-[#233536]">
            <span>{{ meta('scrollText', lang === 'id' ? 'Jelajah' : 'Explore') }}</span>
            <IconArrowRight class="size-4" />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>