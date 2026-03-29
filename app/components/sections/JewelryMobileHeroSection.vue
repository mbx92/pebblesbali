<script setup lang="ts">
import { IconArrowRight, IconDeviceMobile, IconShoppingBag } from '@tabler/icons-vue'
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

const chips = computed(() => [
  meta('chip1', lang.value === 'id' ? 'Quick add' : 'Quick add'),
  meta('chip2', lang.value === 'id' ? 'New drops' : 'New drops'),
  meta('chip3', lang.value === 'id' ? 'Mobile checkout' : 'Mobile checkout'),
].filter(Boolean))
</script>

<template>
  <section :id="sectionId" class="overflow-hidden bg-[linear-gradient(180deg,#faf7f1_0%,#f7f2ea_100%)] px-6 py-20 text-[#201c18] lg:px-8">
    <div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-center">
      <div class="max-w-3xl">
        <div class="inline-flex items-center gap-2 rounded-full border border-[#201c18]/10 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d29b2d] shadow-sm">
          <IconDeviceMobile class="size-4" />
          {{ meta('badgeLabel', lang === 'id' ? 'Mobile Commerce' : 'Mobile Commerce') }}
        </div>
        <h1 class="mt-6 font-serif text-5xl leading-[0.94] tracking-tight md:text-7xl">{{ props.section?.title || (lang === 'id' ? 'Template jewelry yang terasa seperti premium shopping app' : 'A jewelry template that feels like a premium shopping app') }}</h1>
        <p class="mt-6 max-w-2xl text-lg leading-relaxed text-[#201c18]/68 md:text-xl">{{ props.section?.subtitle || (lang === 'id' ? 'Lebih cepat discan di mobile, lebih jelas CTA-nya, tapi tetap terasa premium untuk brand jewelry.' : 'Built for faster mobile scanning, clearer CTAs, and a still-premium commerce feel for jewelry brands.') }}</p>
        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <a :href="resolveLink('ctaPrimaryLink', ctaPrimaryHref)" class="btn border-0 bg-[#ffbe2e] px-7 uppercase tracking-[0.24em] text-[#201c18] hover:bg-[#ffc94f]">
            {{ meta('ctaPrimaryText', lang === 'id' ? 'Mulai Belanja' : 'Start Shopping') }}
          </a>
          <a :href="resolveLink('ctaSecondaryLink', ctaSecondaryHref)" class="btn border-[#201c18]/10 bg-white px-7 uppercase tracking-[0.24em] text-[#201c18] hover:bg-white">
            {{ meta('ctaSecondaryText', lang === 'id' ? 'Lihat Drops' : 'View Drops') }}
          </a>
        </div>
        <div class="mt-6 flex flex-wrap gap-2">
          <span v-for="chip in chips" :key="chip" class="rounded-full border border-[#201c18]/10 bg-white px-3 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-[#201c18]/70">{{ chip }}</span>
        </div>
      </div>

      <div class="rounded-[2.2rem] border border-[#201c18]/10 bg-white p-4 shadow-[0_30px_80px_rgba(0,0,0,0.1)]">
        <div class="rounded-[1.8rem] bg-[#fcfaf6] p-4">
          <div class="mx-auto h-1.5 w-12 rounded-full bg-[#201c18]/10" />
          <div class="mt-4 grid grid-cols-2 gap-3">
            <div class="col-span-2 rounded-[1.6rem] bg-[#fff7df] p-4">
              <div class="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.24em] text-[#201c18]/52">
                <span>Elite Ring</span>
                <IconShoppingBag class="size-4 text-[#d29b2d]" />
              </div>
              <div class="mt-4 flex items-center justify-center rounded-[1.25rem] bg-white p-4">
                <div class="relative h-24 w-24 rounded-full bg-[radial-gradient(circle_at_35%_35%,#ffffff_0%,#ffda79_28%,#d89b2a_72%,#6b4300_100%)] shadow-[0_18px_40px_rgba(255,190,46,0.35)]">
                  <div class="absolute -bottom-3 left-1/2 h-14 w-5 -translate-x-1/2 rounded-full bg-[#f7c14c] blur-[1px] rotate-45" />
                </div>
              </div>
            </div>
            <div class="rounded-[1.3rem] bg-white p-3 text-sm font-semibold text-[#201c18]">$899</div>
            <div class="rounded-[1.3rem] bg-white p-3 text-sm text-[#201c18]/62">Decorative Golden Love Ring</div>
          </div>
          <a :href="resolveLink('ctaPrimaryLink', scrollHref || ctaPrimaryHref)" class="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.26em] text-[#d29b2d]">
            <span>{{ meta('scrollText', lang === 'id' ? 'Jelajah' : 'Explore') }}</span>
            <IconArrowRight class="size-4" />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>