<script setup lang="ts">
import { IconArrowUpRight, IconDiamond } from '@tabler/icons-vue'
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
  <section :id="sectionId" class="bg-[#090d18] px-6 py-24 text-[#f5ebda] lg:px-8">
    <div class="mx-auto max-w-6xl">
      <div class="grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.1fr)] lg:items-end">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.32em] text-[#d7af70]">{{ meta('badgeLabel', lang === 'id' ? 'Spotlight Pieces' : 'Spotlight Pieces') }}</p>
          <h2 class="mt-4 font-serif text-4xl leading-tight md:text-5xl">{{ props.section?.title || (lang === 'id' ? 'Koleksi yang dipilih lebih ketat, ditampilkan lebih kuat' : 'Collections chosen tighter, shown with more authority') }}</h2>
        </div>
        <p class="max-w-2xl text-sm leading-7 text-[#f5ebda]/62 md:text-base">{{ props.section?.subtitle || (lang === 'id' ? 'Template noir menempatkan koleksi seperti spotlight products, bukan grid netral.' : 'The noir template treats collections like spotlight products instead of a neutral merchandise grid.') }}</p>
      </div>

      <div v-if="items.length" class="mt-10 grid gap-6 lg:grid-cols-3">
        <article v-for="(item, index) in items.slice(0, 3)" :key="item.id" class="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] shadow-[0_28px_70px_rgba(0,0,0,0.25)]">
          <div class="aspect-[4/5] overflow-hidden bg-[radial-gradient(circle_at_top,rgba(215,175,112,0.16),transparent_44%),rgba(255,255,255,0.02)]">
            <img v-if="item.image" :src="item.image" :alt="item.name" class="h-full w-full object-contain p-5" />
            <div v-else class="flex h-full items-center justify-center"><IconDiamond class="size-12 text-white/20" /></div>
          </div>
          <div class="px-5 py-5">
            <p class="text-[11px] uppercase tracking-[0.3em] text-[#d7af70]">{{ String(index + 1).padStart(2, '0') }}</p>
            <h3 class="mt-2 font-serif text-2xl">{{ item.name }}</h3>
            <p v-if="item.description" class="mt-3 text-sm leading-7 text-[#f5ebda]/58">{{ item.description }}</p>
            <div class="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#d7af70]">
              <span>{{ meta('viewText', lang === 'id' ? 'Lihat Koleksi' : 'View Collection') }}</span>
              <IconArrowUpRight class="size-4" />
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>