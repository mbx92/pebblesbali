<script setup lang="ts">
import { IconArrowDown, IconBed, IconMapPin, IconSparkles } from '@tabler/icons-vue'
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

function meta(key: string, fallback = ''): string {
  return props.section?.metadata?.[key] || fallback
}

function resolveLink(key: string, fallback = ''): string {
  return props.section?.metadata?.[key] || fallback
}

const fallbackBody = computed(() => (
  lang.value === 'id'
    ? 'Guesthouse butik bernuansa tropis untuk perjalanan yang lebih tenang, nyaman, dan terasa personal.'
    : 'A boutique tropical stay for slower days, easier check-ins, and a more personal Bali base.'
))

const highlights = computed(() => [
  meta('highlight1', lang.value === 'id' ? '8 suite privat' : '8 private suites'),
  meta('highlight2', lang.value === 'id' ? '5 menit ke pantai' : '5 minutes to the beach'),
  meta('highlight3', lang.value === 'id' ? 'Sarapan harian tersedia' : 'Daily breakfast available'),
].filter(Boolean))

const primaryCtaHref = computed(() => resolveLink('ctaPrimaryLink', props.ctaPrimaryHref || '#rooms'))

const secondaryCtaHref = computed(() => {
  if (props.bookingEnabled) {
    return resolveLink('ctaSecondaryLink', props.ctaSecondaryHref || '#booking')
  }

  return resolveLink('ctaSecondaryLinkFallback', props.ctaSecondaryHref || props.ctaPrimaryHref || '#rooms')
})

const secondaryCtaText = computed(() => {
  if (props.bookingEnabled) {
    return meta('ctaSecondaryText', lang.value === 'id' ? 'Cek Ketersediaan' : 'Check Availability')
  }

  return meta('ctaSecondaryTextFallback', lang.value === 'id' ? 'Jelajahi Properti' : 'Explore Stay')
})
</script>

<template>
  <section :id="sectionId" class="relative isolate overflow-hidden bg-[linear-gradient(135deg,color-mix(in_oklab,var(--color-primary)_80%,var(--color-neutral)),color-mix(in_oklab,var(--color-secondary)_45%,var(--color-primary)))] text-base-100">
    <div class="absolute inset-0">
      <img v-if="section?.image" :src="section.image" :alt="section.title" class="h-full w-full object-cover opacity-30" />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,color-mix(in_oklab,var(--color-base-100)_18%,transparent),transparent_38%),linear-gradient(180deg,color-mix(in_oklab,var(--color-primary)_14%,transparent),color-mix(in_oklab,var(--color-neutral)_58%,transparent))]" />
    </div>

    <div class="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-28 lg:px-8">
      <div class="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-base-100/20 bg-base-100/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-base-100/80 backdrop-blur">
        <IconSparkles class="size-4" />
        {{ meta('badgeLabel', lang === 'id' ? 'Retret Tropis di Bali' : 'Tropical Bali Retreat') }}
      </div>

      <div class="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.9fr)] lg:items-end">
        <div class="max-w-3xl">
          <h1 class="max-w-4xl font-serif text-5xl font-medium leading-[0.95] tracking-tight text-base-100 md:text-7xl">
            {{ section?.title || (lang === 'id' ? 'Menginap tenang di sudut Bali yang hangat' : 'Stay slow in a warm corner of Bali') }}
          </h1>
          <p class="mt-6 max-w-2xl text-lg leading-relaxed text-base-100/78 md:text-xl">
            {{ section?.subtitle || (lang === 'id' ? 'Guesthouse butik dengan kamar nyaman, taman tropis, dan ritme yang lebih lembut.' : 'A boutique guesthouse with calm rooms, tropical greenery, and a slower daily rhythm.') }}
          </p>
          <div v-if="section?.body" class="tiptap-render mt-4 max-w-2xl text-sm leading-7 text-base-100/65" v-html="section.body" />
          <p v-else class="mt-4 max-w-2xl text-sm leading-7 text-base-100/65">{{ fallbackBody }}</p>

          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <a :href="primaryCtaHref" class="btn btn-secondary btn-md border-0 px-7 uppercase tracking-[0.22em] text-primary">
              {{ meta('ctaPrimaryText', lang === 'id' ? 'Lihat Kamar' : 'Browse Rooms') }}
            </a>
            <a :href="secondaryCtaHref" class="btn btn-outline btn-md border-base-100/25 bg-base-100/5 px-7 uppercase tracking-[0.22em] text-base-100 hover:bg-base-100/12">
              {{ secondaryCtaText }}
            </a>
          </div>
        </div>

        <div class="rounded-4xl border border-base-100/15 bg-[color-mix(in_oklab,var(--color-base-100)_10%,transparent)] p-6 backdrop-blur-md shadow-[0_20px_70px_color-mix(in_oklab,var(--color-neutral)_22%,transparent)]">
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-base-100/55">
            {{ lang === 'id' ? 'Sorotan Singkat' : 'Quick Highlights' }}
          </p>
          <div class="mt-5 space-y-4">
            <div v-for="(item, index) in highlights" :key="item" class="flex items-start gap-3 border-b border-base-100/10 pb-4 last:border-b-0 last:pb-0">
              <div class="mt-0.5 rounded-full bg-base-100/10 p-2 text-secondary">
                <IconBed v-if="index === 0" class="size-4" />
                <IconMapPin v-else-if="index === 1" class="size-4" />
                <IconSparkles v-else class="size-4" />
              </div>
              <p class="text-sm leading-6 text-base-100/78">{{ item }}</p>
            </div>
          </div>
        </div>
      </div>

      <a :href="resolveLink('ctaPrimaryLink', scrollHref || ctaPrimaryHref || '#rooms')" class="mt-14 inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-base-100/55 transition-colors hover:text-base-100/80">
        <span>{{ meta('scrollText', lang === 'id' ? 'Jelajah' : 'Explore') }}</span>
        <IconArrowDown class="size-4 animate-bounce" />
      </a>
    </div>
  </section>
</template>