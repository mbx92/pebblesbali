<script setup lang="ts">
import { IconHeart } from '@tabler/icons-vue'
import type { Section } from '~/types'

const props = withDefaults(defineProps<{
  section?: Section
  sectionId?: string
}>(), {
  section: undefined,
  sectionId: 'about',
})

const { t } = useLocale()

function meta(section: Section | undefined, key: string, fallback = ''): string {
  return section?.metadata?.[key] || fallback
}
</script>

<template>
  <section :id="sectionId" class="py-24 bg-base-200/40 scroll-mt-16">
    <div class="max-w-6xl mx-auto px-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div class="relative">
          <div v-if="section?.image" class="relative">
            <img :src="section.image" :alt="section.title" class="rounded-sm w-full object-cover aspect-square" />
            <div class="absolute -bottom-4 -right-4 size-24 border border-secondary/30 rounded-sm" />
          </div>
          <div v-else class="aspect-square bg-primary/5 rounded-sm flex items-center justify-center border border-base-300">
            <IconHeart class="size-20 text-secondary/30" />
          </div>
        </div>
        <div>
          <div class="flex items-center gap-3 mb-6">
            <div class="h-px w-8 bg-secondary/50" />
            <span class="text-secondary text-xs font-medium tracking-[0.3em] uppercase">{{ meta(section, 'badgeLabel', t.sections.ourStory) }}</span>
          </div>
          <h2 class="font-serif text-4xl text-primary font-light leading-tight tracking-wide mb-6">
            {{ section?.title || t.about.fallbackTitle }}
          </h2>
          <p v-if="section?.subtitle" class="text-base-content/60 text-lg font-light mb-6 leading-relaxed">
            {{ section.subtitle }}
          </p>
          <p v-if="section?.body" class="text-base-content/70 font-light leading-relaxed whitespace-pre-line">
            {{ section.body }}
          </p>
          <p v-else class="text-base-content/70 font-light leading-relaxed">
            {{ t.about.fallbackBody }}
          </p>
          <div class="mt-10 grid grid-cols-3 gap-6 pt-8 border-t border-base-300">
            <div class="text-center">
              <div class="font-serif text-3xl text-primary font-light">{{ meta(section, 'stat1Value', '15+') }}</div>
              <div class="text-xs text-base-content/50 tracking-widest uppercase mt-1">{{ meta(section, 'stat1Label', t.about.yearsCraft) }}</div>
            </div>
            <div class="text-center border-x border-base-300">
              <div class="font-serif text-3xl text-primary font-light">{{ meta(section, 'stat2Value', '500+') }}</div>
              <div class="text-xs text-base-content/50 tracking-widest uppercase mt-1">{{ meta(section, 'stat2Label', t.about.uniqueDesigns) }}</div>
            </div>
            <div class="text-center">
              <div class="font-serif text-3xl text-primary font-light">{{ meta(section, 'stat3Value', '50+') }}</div>
              <div class="text-xs text-base-content/50 tracking-widest uppercase mt-1">{{ meta(section, 'stat3Label', t.about.countries) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>