<script setup lang="ts">
import { IconHeart, IconShoppingBag } from '@tabler/icons-vue'
import type { Collection, Section } from '~/types'

const props = withDefaults(defineProps<{
  section?: Section
  items?: Collection[]
  sectionId?: string
}>(), {
  section: undefined,
  items: () => [],
  sectionId: 'collections',
})

const { lang } = useLocale()

function meta(key: string, fallback = '') {
  return props.section?.metadata?.[key] || fallback
}
</script>

<template>
  <section :id="sectionId" class="bg-[#f7f2ea] px-6 py-24 text-[#201c18] lg:px-8">
    <div class="mx-auto max-w-6xl">
      <div class="max-w-2xl">
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[#d29b2d]">{{ meta('badgeLabel', lang === 'id' ? 'Mobile Shop' : 'Mobile Shop') }}</p>
        <h2 class="mt-4 font-serif text-4xl md:text-5xl">{{ props.section?.title || (lang === 'id' ? 'Collection cards yang lebih cepat dipilih di mobile' : 'Collection cards that scan faster on mobile') }}</h2>
        <p class="mt-4 text-sm leading-7 text-[#201c18]/64 md:text-base">{{ props.section?.subtitle || (lang === 'id' ? 'Preset ini mengarah ke bahasa UI app commerce: tile ringkas, chip category, dan CTA yang lebih cepat terlihat.' : 'This preset leans into commerce-app UI language with compact tiles, category chips, and faster CTA visibility.') }}</p>
      </div>

      <div class="mt-6 flex flex-wrap gap-2">
        <span class="rounded-full bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#201c18]/56 shadow-sm">Trending</span>
        <span class="rounded-full bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#201c18]/56 shadow-sm">Minimal</span>
        <span class="rounded-full bg-[#ffbe2e] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#201c18] shadow-sm">New Drop</span>
      </div>

      <div v-if="items.length" class="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <article v-for="item in items" :key="item.id" class="overflow-hidden rounded-4xl border border-[#201c18]/10 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
          <div class="flex items-center justify-between px-4 pt-4 text-[#201c18]/45">
            <IconHeart class="size-4" />
            <span class="rounded-full bg-[#fff7df] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d29b2d]">New</span>
          </div>
          <div class="aspect-square bg-[#fcfaf6] p-4">
            <img v-if="item.image" :src="item.image" :alt="item.name" class="h-full w-full object-contain" />
          </div>
          <div class="px-4 pb-4">
            <h3 class="text-base font-semibold text-[#201c18]">{{ item.name }}</h3>
            <p v-if="item.description" class="mt-2 text-sm leading-6 text-[#201c18]/56">{{ item.description }}</p>
            <div class="mt-4 flex items-center justify-between">
              <span class="rounded-full bg-[#f7f2ea] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#201c18]/56">{{ meta('priceHint', lang === 'id' ? 'Tap for details' : 'Tap for details') }}</span>
              <button type="button" class="btn btn-sm border-0 bg-[#ffbe2e] text-[#201c18] hover:bg-[#ffc94f]"><IconShoppingBag class="size-4" /></button>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>