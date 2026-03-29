<script setup lang="ts">
import { IconArrowUpRight } from '@tabler/icons-vue'
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
  <section :id="sectionId" class="bg-base-100 px-6 py-24 lg:px-8">
    <div class="mx-auto max-w-6xl">
      <div class="grid gap-8 border-b border-base-300 pb-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-end">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.32em] text-secondary">{{ meta('badgeLabel', 'Curated Pieces') }}</p>
          <h2 class="mt-4 font-serif text-4xl leading-tight text-primary md:text-5xl">{{ section?.title || (lang === 'id' ? 'Koleksi pilihan dengan ritme editorial' : 'Collections with an editorial cadence') }}</h2>
        </div>
        <p class="max-w-2xl text-sm leading-7 text-base-content/68 md:text-base">{{ section?.subtitle || (lang === 'id' ? 'Template ini menata koleksi seperti spread editorial: lebih fokus pada ritme, ruang, dan citra produk.' : 'This template frames collections like an editorial spread, emphasizing rhythm, whitespace, and product imagery.') }}</p>
      </div>

      <div v-if="items.length" class="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <article v-for="(item, index) in items" :key="item.id" class="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-base-300 bg-base-100 shadow-sm transition-transform duration-300 hover:-translate-y-1">
          <div class="aspect-[4/5] overflow-hidden bg-base-200">
            <img v-if="item.image" :src="item.image" :alt="item.name" class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            <div v-else class="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,#d6cbc4,transparent_60%)] text-base-content/28">
              <span class="text-xs uppercase tracking-[0.4em]">No Image</span>
            </div>
          </div>
          <div class="flex flex-1 flex-col justify-between p-6">
            <div>
              <p class="text-[11px] uppercase tracking-[0.3em] text-base-content/38">{{ String(index + 1).padStart(2, '0') }}</p>
              <h3 class="mt-3 font-serif text-2xl text-primary">{{ item.name }}</h3>
              <div v-if="item.description" class="mt-3 text-sm leading-7 text-base-content/65 prose prose-sm max-w-none" v-html="item.description" />
            </div>
            <div class="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-secondary">
              <span>{{ meta('viewText', lang === 'id' ? 'Lihat Koleksi' : 'View Collection') }}</span>
              <IconArrowUpRight class="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
          </div>
        </article>
      </div>

      <div v-else class="mt-10 rounded-[2rem] border border-dashed border-base-300 px-6 py-14 text-center text-sm text-base-content/52">
        {{ meta('emptySoonText', lang === 'id' ? 'Koleksi akan segera hadir' : 'Collections coming soon') }}
      </div>
    </div>
  </section>
</template>