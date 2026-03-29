<script setup lang="ts">
import { IconArrowRight, IconSunset2, IconWind } from '@tabler/icons-vue'
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

const stats = computed(() => [
  { label: meta('stat1Label', lang.value === 'id' ? 'Open-air check-in' : 'Open-air check-in'), value: meta('stat1Value', '24/7') },
  { label: meta('stat2Label', lang.value === 'id' ? 'Best for' : 'Best for'), value: meta('stat2Value', lang.value === 'id' ? 'Longer stays' : 'Longer stays') },
])
</script>

<template>
  <section :id="sectionId" class="relative overflow-hidden bg-[linear-gradient(160deg,#f2d8bb_0%,#f6ecde_40%,#f5f1eb_100%)] text-[#28403a]">
    <div class="absolute inset-0 opacity-60">
      <img v-if="section?.image" :src="section.image" :alt="section.title" class="h-full w-full object-cover mix-blend-multiply opacity-35" />
      <div v-else class="h-full w-full bg-[radial-gradient(circle_at_top_right,rgba(233,157,88,0.25),transparent_22%),radial-gradient(circle_at_20%_20%,rgba(73,114,91,0.14),transparent_18%)]" />
    </div>

    <div class="relative mx-auto grid min-h-screen max-w-6xl gap-10 px-6 py-24 lg:grid-cols-[minmax(0,1.05fr)_24rem] lg:items-center lg:px-8">
      <div class="max-w-4xl">
        <div class="inline-flex items-center gap-2 rounded-full border border-[#28403a]/10 bg-white/65 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#b86a2f] backdrop-blur">
          <IconSunset2 class="size-4" />
          {{ meta('badgeLabel', lang === 'id' ? 'Veranda Stay' : 'Veranda Stay') }}
        </div>
        <h1 class="mt-6 max-w-4xl font-serif text-5xl font-medium leading-[0.92] tracking-tight md:text-7xl">
          {{ section?.title || (lang === 'id' ? 'Guesthouse tropis dengan terasa veranda yang lebih tenang' : 'A tropical guesthouse with a calmer veranda feel') }}
        </h1>
        <p class="mt-6 max-w-2xl text-lg leading-relaxed text-[#28403a]/72 md:text-xl">
          {{ section?.subtitle || (lang === 'id' ? 'Preset ini menekankan cahaya sore, airflow, dan ritme menginap yang lebih pelan untuk properti yang ingin terasa sun-washed dan boutique.' : 'This preset leans into late light, airflow, and a slower stay rhythm for properties that want to feel sun-washed and boutique.') }}
        </p>

        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <a :href="resolveLink('ctaPrimaryLink', ctaPrimaryHref || '#rooms')" class="btn border-0 bg-[#28403a] px-7 uppercase tracking-[0.24em] text-white hover:bg-[#1d302b]">
            {{ meta('ctaPrimaryText', lang === 'id' ? 'Lihat Suite' : 'Browse Suites') }}
          </a>
          <a :href="resolveLink('ctaSecondaryLink', ctaSecondaryHref || (bookingEnabled ? '#booking' : '#location'))" class="btn border-[#28403a]/12 bg-white/75 px-7 uppercase tracking-[0.24em] text-[#28403a] hover:bg-white">
            {{ meta('ctaSecondaryText', lang === 'id' ? 'Rencanakan Stay' : 'Plan Your Stay') }}
          </a>
        </div>
      </div>

      <div class="rounded-[2.2rem] border border-[#28403a]/10 bg-white/72 p-6 shadow-[0_28px_70px_rgba(0,0,0,0.08)] backdrop-blur-md">
        <div class="flex items-center gap-3 text-[#b86a2f]">
          <IconWind class="size-4" />
          <span class="text-xs font-semibold uppercase tracking-[0.28em]">Template Mood</span>
        </div>
        <div class="mt-5 grid gap-3">
          <div v-for="stat in stats" :key="stat.label" class="rounded-[1.4rem] border border-[#28403a]/8 bg-white px-4 py-4">
            <p class="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#28403a]/42">{{ stat.label }}</p>
            <p class="mt-2 text-lg font-semibold text-[#28403a]">{{ stat.value }}</p>
          </div>
        </div>
        <p class="mt-5 text-sm leading-7 text-[#28403a]/68">Airier hero framing, wider room cards, and softer terrace-forward booking cues.</p>
        <a :href="resolveLink('ctaPrimaryLink', scrollHref || ctaPrimaryHref || '#rooms')" class="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#b86a2f] transition-colors hover:text-[#28403a]">
          <span>{{ meta('scrollText', lang === 'id' ? 'Jelajah' : 'Explore') }}</span>
          <IconArrowRight class="size-4" />
        </a>
      </div>
    </div>
  </section>
</template>