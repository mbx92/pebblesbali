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
</script>

<template>
  <section :id="sectionId" class="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,#17243f_0%,#090d18_52%,#06070c_100%)] text-[#f5ebda]">
    <div class="absolute inset-0 opacity-25">
      <img v-if="section?.image" :src="section.image" :alt="section.title" class="h-full w-full object-cover mix-blend-screen" />
      <div v-else class="h-full w-full bg-[radial-gradient(circle_at_70%_35%,rgba(255,206,107,0.28),transparent_18%),radial-gradient(circle_at_25%_15%,rgba(255,255,255,0.1),transparent_18%)]" />
    </div>

    <div class="relative mx-auto grid min-h-screen max-w-6xl gap-10 px-6 py-24 lg:grid-cols-[minmax(0,1.1fr)_24rem] lg:items-center lg:px-8">
      <div class="max-w-4xl">
        <div class="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d7af70] backdrop-blur">
          <IconStars class="size-4" />
          {{ meta('badgeLabel', lang === 'id' ? 'Dark Luxury' : 'Dark Luxury') }}
        </div>
        <h1 class="mt-6 font-serif text-5xl leading-[0.92] tracking-tight md:text-7xl">{{ section?.title || (lang === 'id' ? 'Perhiasan yang tampil seperti spotlight piece' : 'Jewelry framed like a spotlight piece') }}</h1>
        <p class="mt-6 max-w-2xl text-lg leading-relaxed text-[#f5ebda]/72 md:text-xl">{{ section?.subtitle || (lang === 'id' ? 'Preset ini mengarah ke nuansa dark luxury: kontras tinggi, emas hangat, dan storytelling yang lebih eksklusif.' : 'This preset leans into dark luxury with higher contrast, warmer gold, and a more exclusive storytelling tone.') }}</p>
        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <a :href="resolveLink('ctaPrimaryLink', ctaPrimaryHref)" class="btn border-0 bg-[#d7af70] px-7 uppercase tracking-[0.24em] text-[#0a0d15] hover:bg-[#e3bc81]">
            {{ meta('ctaPrimaryText', lang === 'id' ? 'Lihat Koleksi' : 'View Collection') }}
          </a>
          <a :href="resolveLink('ctaSecondaryLink', ctaSecondaryHref)" class="btn border-white/15 bg-white/6 px-7 uppercase tracking-[0.24em] text-[#f5ebda] hover:bg-white/10">
            {{ meta('ctaSecondaryText', lang === 'id' ? 'Kisah Studio' : 'Studio Story') }}
          </a>
        </div>
      </div>

      <div class="rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <div class="flex items-center gap-3 border-b border-white/10 pb-4">
          <div class="rounded-full bg-[#d7af70]/15 p-2 text-[#d7af70]"><IconDiamond class="size-4" /></div>
          <div>
            <p class="text-xs uppercase tracking-[0.28em] text-[#f5ebda]/42">Collector Profile</p>
            <p class="mt-1 text-sm text-[#f5ebda]/78">Built for fewer pieces with stronger visual authority.</p>
          </div>
        </div>

        <div class="mt-5 space-y-3">
          <div v-for="fact in facts" :key="fact" class="rounded-2xl border border-white/8 bg-black/18 px-4 py-3 text-sm leading-6 text-[#f5ebda]/78">
            {{ fact }}
          </div>
        </div>

        <a :href="resolveLink('ctaPrimaryLink', scrollHref || ctaPrimaryHref)" class="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#d7af70] transition-colors hover:text-[#f5ebda]">
          <span>{{ meta('scrollText', lang === 'id' ? 'Jelajah' : 'Explore') }}</span>
          <IconArrowRight class="size-4" />
        </a>
      </div>
    </div>
  </section>
</template>