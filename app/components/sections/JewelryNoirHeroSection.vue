<script setup lang="ts">
import { IconArrowRight, IconDiamond, IconStars } from '@tabler/icons-vue'
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

function meta(key: string, fallback = '') {
  return props.section?.metadata?.[key] || fallback
}

function resolveLink(key: string, fallback?: string) {
  return props.section?.metadata?.[key] || fallback || ''
}

const facts = computed(() => [
  meta('fact1', lang.value === 'id' ? 'Limited capsule drops' : 'Limited capsule drops'),
  meta('fact2', lang.value === 'id' ? 'Collector-led custom work' : 'Collector-led custom work'),
  meta('fact3', lang.value === 'id' ? 'Gold-forward spotlight styling' : 'Gold-forward spotlight styling'),
].filter(Boolean))

const metrics = computed(() => [
  {
    label: meta('metric1Label', lang.value === 'id' ? 'Capsules / Tahun' : 'Capsules / Year'),
    value: meta('metric1Value', '04'),
  },
  {
    label: meta('metric2Label', lang.value === 'id' ? 'Private Commissions' : 'Private Commissions'),
    value: meta('metric2Value', '18'),
  },
])
</script>

<template>
  <section :id="sectionId" class="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,#23345d_0%,#111827_34%,#07090f_72%,#040508_100%)] text-[#f5ebda]">
    <div class="absolute inset-0 opacity-30">
      <img v-if="section?.image" :src="section.image" :alt="section.title" class="h-full w-full object-cover mix-blend-screen" />
      <div v-else class="h-full w-full bg-[radial-gradient(circle_at_72%_28%,rgba(245,197,112,0.34),transparent_16%),radial-gradient(circle_at_24%_18%,rgba(255,255,255,0.12),transparent_16%),linear-gradient(135deg,rgba(255,255,255,0.05),transparent_36%)]" />
    </div>
    <div class="absolute inset-y-0 right-[-12rem] hidden w-[36rem] rounded-full bg-[#d7af70]/12 blur-3xl lg:block" />

    <div class="relative mx-auto grid min-h-screen max-w-6xl gap-10 px-6 py-24 lg:grid-cols-[minmax(0,1.08fr)_26rem] lg:items-center lg:px-8">
      <div class="max-w-4xl">
        <div class="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d7af70] backdrop-blur">
          <IconStars class="size-4" />
          {{ meta('badgeLabel', lang === 'id' ? 'Dark Luxury' : 'Dark Luxury') }}
        </div>
        <div class="mt-8 grid gap-4 sm:grid-cols-2">
          <div v-for="metric in metrics" :key="metric.label" class="rounded-[1.6rem] border border-white/10 bg-white/6 px-5 py-4 backdrop-blur-sm">
            <p class="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#f5ebda]/44">{{ metric.label }}</p>
            <p class="mt-3 font-serif text-3xl text-[#d7af70]">{{ metric.value }}</p>
          </div>
        </div>
        <h1 class="mt-8 max-w-4xl font-serif text-5xl leading-[0.88] tracking-tight md:text-7xl">{{ section?.title || (lang === 'id' ? 'Perhiasan yang tampil seperti collector spotlight' : 'Jewelry framed like a collector spotlight') }}</h1>
        <p class="mt-6 max-w-2xl text-lg leading-relaxed text-[#f5ebda]/72 md:text-xl">{{ section?.subtitle || (lang === 'id' ? 'Preset ini lebih dekat ke referensi dark luxury desktop: headline besar, surface gelap berlapis, dan kartu metrik yang terasa editorial.' : 'This preset moves closer to a dark-luxury desktop reference with oversized headlines, layered dark surfaces, and more editorial metric cards.') }}</p>
        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <a :href="resolveLink('ctaPrimaryLink', ctaPrimaryHref)" class="btn border-0 bg-[#d7af70] px-7 uppercase tracking-[0.24em] text-[#0a0d15] hover:bg-[#e3bc81]">
            {{ meta('ctaPrimaryText', lang === 'id' ? 'Lihat Koleksi' : 'View Collection') }}
          </a>
          <a :href="resolveLink('ctaSecondaryLink', ctaSecondaryHref)" class="btn border-white/15 bg-white/6 px-7 uppercase tracking-[0.24em] text-[#f5ebda] hover:bg-white/10">
            {{ meta('ctaSecondaryText', lang === 'id' ? 'Kisah Studio' : 'Studio Story') }}
          </a>
        </div>
      </div>

      <div class="rounded-[2.2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <div class="rounded-[1.7rem] border border-white/8 bg-[#0d111a]/78 p-4">
          <div class="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div class="flex items-center gap-3">
              <div class="rounded-full bg-[#d7af70]/15 p-2 text-[#d7af70]"><IconDiamond class="size-4" /></div>
              <div>
                <p class="text-xs uppercase tracking-[0.28em] text-[#f5ebda]/42">Collector Profile</p>
                <p class="mt-1 text-sm text-[#f5ebda]/78">Built for fewer pieces with stronger visual authority.</p>
              </div>
            </div>
            <div class="rounded-full border border-[#d7af70]/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#d7af70]">Noir Edit</div>
          </div>

          <div class="mt-5 space-y-3">
            <div v-for="fact in facts" :key="fact" class="rounded-2xl border border-white/8 bg-black/18 px-4 py-3 text-sm leading-6 text-[#f5ebda]/78">
              {{ fact }}
            </div>
          </div>

          <div class="mt-5 rounded-[1.5rem] border border-[#d7af70]/12 bg-[radial-gradient(circle_at_top,rgba(215,175,112,0.18),transparent_50%),#111622] px-4 py-4">
            <p class="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#f5ebda]/42">Merchandising Cue</p>
            <p class="mt-3 text-sm leading-7 text-[#f5ebda]/72">Use tighter product edits, darker photography, and larger headline-to-product contrast for a more collector-driven homepage.</p>
          </div>

          <a :href="resolveLink('ctaPrimaryLink', scrollHref || ctaPrimaryHref)" class="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#d7af70] transition-colors hover:text-[#f5ebda]">
            <span>{{ meta('scrollText', lang === 'id' ? 'Jelajah' : 'Explore') }}</span>
            <IconArrowRight class="size-4" />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>