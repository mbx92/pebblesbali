<script setup lang="ts">
import { IconDiamond, IconHeart, IconLeaf, IconSparkles } from '@tabler/icons-vue'
import type { Section } from '~/types'

const props = withDefaults(defineProps<{
  section?: Section
  sectionId?: string
}>(), {
  section: undefined,
  sectionId: 'sustainability',
})

const { t } = useLocale()

function meta(section: Section | undefined, key: string, fallback = ''): string {
  return section?.metadata?.[key] || fallback
}
</script>

<template>
  <section :id="sectionId" class="py-24 bg-primary text-base-100">
    <div class="max-w-6xl mx-auto px-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <div class="flex items-center gap-3 mb-6">
            <div class="h-px w-8 bg-secondary/60" />
            <span class="text-secondary text-xs font-medium tracking-[0.3em] uppercase">{{ meta(section, 'badgeLabel', t.sections.ourValues) }}</span>
          </div>
          <h2 class="font-serif text-4xl text-base-100 font-light leading-tight tracking-wide mb-6">
            {{ section?.title || t.sustainability.fallbackTitle }}
          </h2>
          <p v-if="section?.subtitle" class="text-base-100/70 text-lg font-light mb-6 leading-relaxed">
            {{ section.subtitle }}
          </p>
          <p v-if="section?.body" class="text-base-100/60 font-light leading-relaxed whitespace-pre-line">
            {{ section.body }}
          </p>
          <p v-else class="text-base-100/60 font-light leading-relaxed">
            {{ t.sustainability.fallbackBody }}
          </p>
        </div>
        <div class="grid grid-cols-2 gap-6">
          <div class="p-6 border border-base-100/10 rounded-sm hover:border-secondary/30 transition-colors">
            <IconLeaf class="size-8 text-secondary mb-4" />
            <h3 class="font-serif text-lg text-base-100 font-light mb-2">{{ meta(section, 'feature1Title', t.sustainability.ecoTitle) }}</h3>
            <p class="text-base-100/50 text-sm font-light leading-relaxed">{{ meta(section, 'feature1Body', t.sustainability.ecoDesc) }}</p>
          </div>
          <div class="p-6 border border-base-100/10 rounded-sm hover:border-secondary/30 transition-colors">
            <IconHeart class="size-8 text-secondary mb-4" />
            <h3 class="font-serif text-lg text-base-100 font-light mb-2">{{ meta(section, 'feature2Title', t.sustainability.fairTitle) }}</h3>
            <p class="text-base-100/50 text-sm font-light leading-relaxed">{{ meta(section, 'feature2Body', t.sustainability.fairDesc) }}</p>
          </div>
          <div class="p-6 border border-base-100/10 rounded-sm hover:border-secondary/30 transition-colors">
            <IconDiamond class="size-8 text-secondary mb-4" />
            <h3 class="font-serif text-lg text-base-100 font-light mb-2">{{ meta(section, 'feature3Title', t.sustainability.ethTitle) }}</h3>
            <p class="text-base-100/50 text-sm font-light leading-relaxed">{{ meta(section, 'feature3Body', t.sustainability.ethDesc) }}</p>
          </div>
          <div class="p-6 border border-base-100/10 rounded-sm hover:border-secondary/30 transition-colors">
            <IconSparkles class="size-8 text-secondary mb-4" />
            <h3 class="font-serif text-lg text-base-100 font-light mb-2">{{ meta(section, 'feature4Title', t.sustainability.handTitle) }}</h3>
            <p class="text-base-100/50 text-sm font-light leading-relaxed">{{ meta(section, 'feature4Body', t.sustainability.handDesc) }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>