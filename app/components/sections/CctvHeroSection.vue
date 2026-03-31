<script setup lang="ts">
import { IconArrowDown, IconShieldHalfFilled, IconTopologyStar3, IconWifi } from '@tabler/icons-vue'
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

const { lang } = useLocale()

function meta(key: string, fallback = ''): string {
  return props.section?.metadata?.[key] || fallback
}

function resolveLink(key: string, fallback?: string): string {
  return props.section?.metadata?.[key] || fallback || ''
}

const highlights = computed(() => [
  meta('highlight1', lang.value === 'id' ? 'Survey lokasi dan layout kamera' : 'Site survey and camera layout planning'),
  meta('highlight2', lang.value === 'id' ? 'Setup Wi-Fi dan jaringan kantor' : 'Wi-Fi and office network setup'),
  meta('highlight3', lang.value === 'id' ? 'Maintenance dan troubleshooting cepat' : 'Fast maintenance and troubleshooting'),
].filter(Boolean))
</script>

<template>
  <section :id="sectionId" class="relative isolate overflow-hidden bg-[linear-gradient(135deg,color-mix(in_oklab,var(--color-primary)_94%,black),color-mix(in_oklab,var(--color-neutral)_76%,var(--color-accent)))] text-base-100">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_oklab,var(--color-secondary)_26%,transparent),transparent_34%),radial-gradient(circle_at_bottom_left,color-mix(in_oklab,var(--color-accent)_22%,transparent),transparent_32%)]" />
    <div class="absolute inset-0 opacity-20 [background-image:linear-gradient(color-mix(in_oklab,var(--color-base-100)_10%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklab,var(--color-base-100)_8%,transparent)_1px,transparent_1px)] [background-size:4rem_4rem]" />
    <div class="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-28 lg:px-8">
      <div class="inline-flex w-fit items-center gap-2 rounded-full border border-base-100/15 bg-base-100/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-base-100/78 backdrop-blur">
        <IconShieldHalfFilled class="size-4 text-secondary" />
        {{ meta('badgeLabel', lang === 'id' ? 'Instalasi CCTV & Jaringan Bali' : 'Bali CCTV & Network Installations') }}
      </div>

      <div class="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(19rem,0.8fr)] lg:items-end">
        <div class="max-w-3xl">
          <h1 class="max-w-4xl font-serif text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl">
            {{ section?.title || (lang === 'id' ? 'Sistem CCTV dan jaringan yang rapi, stabil, dan siap dipakai' : 'CCTV and network systems installed cleanly, reliably, and ready to use') }}
          </h1>
          <p class="mt-6 max-w-2xl text-lg leading-relaxed text-base-100/76 md:text-xl">
            {{ section?.subtitle || (lang === 'id' ? 'Untuk rumah, villa, toko, kantor, dan proyek yang butuh hasil teknis rapi tanpa drama.' : 'For homes, villas, shops, offices, and project sites that need technical work done properly the first time.') }}
          </p>
          <div v-if="section?.body" class="tiptap-render mt-4 max-w-2xl text-sm leading-7 text-base-100/62" v-html="section.body" />

          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <a :href="resolveLink('ctaPrimaryLink', ctaPrimaryHref || '#contact')" class="btn btn-secondary btn-md border-0 px-7 uppercase tracking-[0.22em] text-primary">
              {{ meta('ctaPrimaryText', lang === 'id' ? 'Request Survey' : 'Request Survey') }}
            </a>
            <a :href="resolveLink('ctaSecondaryLink', ctaSecondaryHref || '#services')" class="btn btn-outline btn-md border-base-100/25 bg-base-100/5 px-7 uppercase tracking-[0.22em] text-base-100 hover:bg-base-100/12">
              {{ meta('ctaSecondaryText', lang === 'id' ? 'Lihat Layanan' : 'View Services') }}
            </a>
          </div>
        </div>

        <div class="rounded-4xl border border-base-100/12 bg-base-100/8 p-6 backdrop-blur-md shadow-[0_20px_70px_color-mix(in_oklab,var(--color-neutral)_28%,transparent)]">
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-base-100/52">
            {{ lang === 'id' ? 'Lingkup Kerja' : 'Scope of Work' }}
          </p>
          <div class="mt-5 space-y-4">
            <div v-for="(item, index) in highlights" :key="item" class="flex items-start gap-3 border-b border-base-100/10 pb-4 last:border-b-0 last:pb-0">
              <div class="mt-0.5 rounded-full bg-base-100/10 p-2 text-secondary">
                <IconShieldHalfFilled v-if="index === 0" class="size-4" />
                <IconWifi v-else-if="index === 1" class="size-4" />
                <IconTopologyStar3 v-else class="size-4" />
              </div>
              <p class="text-sm leading-6 text-base-100/78">{{ item }}</p>
            </div>
          </div>
        </div>
      </div>

      <a :href="resolveLink('ctaPrimaryLink', scrollHref || ctaPrimaryHref || '#services')" class="mt-14 inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-base-100/55 transition-colors hover:text-base-100/80">
        <span>{{ meta('scrollText', lang === 'id' ? 'Lihat Detail' : 'Explore More') }}</span>
        <IconArrowDown class="size-4 animate-bounce" />
      </a>
    </div>
  </section>
</template>