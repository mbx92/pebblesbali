<script setup lang="ts">
import { IconDiamond } from '@tabler/icons-vue'
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

const { t } = useLocale()

function meta(section: Section | undefined, key: string, fallback = ''): string {
  return section?.metadata?.[key] || fallback
}
</script>

<template>
  <section :id="sectionId" class="py-24 bg-base-100 scroll-mt-16">
    <div class="max-w-6xl mx-auto px-6">
      <div class="text-center mb-16">
        <div class="flex items-center justify-center gap-3 mb-4">
          <div class="h-px w-8 bg-secondary/50" />
          <span class="text-secondary text-xs font-medium tracking-[0.3em] uppercase">{{ meta(section, 'badgeLabel', t.sections.ourCraft) }}</span>
          <div class="h-px w-8 bg-secondary/50" />
        </div>
        <h2 class="font-serif text-4xl md:text-5xl text-primary font-light tracking-wide">
          {{ section?.title || t.sections.collectionsFallback }}
        </h2>
        <p v-if="section?.subtitle" class="mt-4 text-base-content/60 text-lg font-light max-w-xl mx-auto">
          {{ section.subtitle }}
        </p>
      </div>

      <div v-if="items.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="item in items"
          :key="item.id"
          class="group cursor-pointer"
        >
          <div class="relative overflow-hidden rounded-sm aspect-3/4 bg-base-200 mb-4">
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.name"
              class="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 p-2"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <IconDiamond class="size-12 text-base-content/20" />
            </div>
            <div class="absolute inset-0 bg-linear-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div class="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
              <span class="text-base-100 text-xs tracking-widest uppercase font-medium">{{ meta(section, 'viewText', t.sections.viewCollection) }}</span>
            </div>
          </div>
          <h3 class="font-serif text-xl text-primary font-light tracking-wide">{{ item.name }}</h3>
          <div v-if="item.description" class="text-base-content/50 text-sm mt-1 font-light leading-relaxed prose prose-sm max-w-none" v-html="item.description" />
        </div>
      </div>
      <div v-else class="text-center py-16 text-base-content/40">
        <IconDiamond class="size-12 mx-auto mb-4 opacity-30" />
        <p class="font-light">{{ meta(section, 'emptySoonText', t.sections.collectionsSoon) }}</p>
      </div>
    </div>
  </section>
</template>