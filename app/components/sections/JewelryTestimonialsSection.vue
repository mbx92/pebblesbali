<script setup lang="ts">
import { IconStar, IconStarFilled } from '@tabler/icons-vue'
import type { Section, Testimonial } from '~/types'

const props = withDefaults(defineProps<{
  section?: Section
  items?: Testimonial[]
  sectionId?: string
}>(), {
  section: undefined,
  items: () => [],
  sectionId: 'testimonials',
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
          <span class="text-secondary text-xs font-medium tracking-[0.3em] uppercase">{{ meta(section, 'badgeLabel', t.sections.lovedByMany) }}</span>
          <div class="h-px w-8 bg-secondary/50" />
        </div>
        <h2 class="font-serif text-4xl md:text-5xl text-primary font-light tracking-wide">
          {{ section?.title || t.sections.testimonialsFallback }}
        </h2>
      </div>

      <div v-if="items.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="item in items"
          :key="item.id"
          class="p-8 border border-base-300 rounded-sm hover:border-secondary/40 transition-colors"
        >
          <div class="flex gap-0.5 mb-6">
            <component
              :is="i <= item.rating ? IconStarFilled : IconStar"
              v-for="i in 5"
              :key="i"
              class="size-4"
              :class="i <= item.rating ? 'text-secondary' : 'text-base-content/20'"
            />
          </div>
          <p class="text-base-content/70 font-light leading-relaxed italic mb-6">&quot;{{ item.content }}&quot;</p>
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-full overflow-hidden bg-base-200 shrink-0">
              <img v-if="item.avatar" :src="item.avatar" :alt="item.name" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center text-base-content/30 text-sm font-medium">
                {{ item.name.charAt(0) }}
              </div>
            </div>
            <div>
              <div class="font-medium text-primary text-sm">{{ item.name }}</div>
              <div v-if="item.role" class="text-xs text-base-content/50 tracking-wide">{{ item.role }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-16 text-base-content/40">
        <IconStarFilled class="size-10 mx-auto mb-4 opacity-20" />
        <p class="font-light">{{ meta(section, 'emptySoonText', t.sections.reviewsSoon) }}</p>
      </div>
    </div>
  </section>
</template>
