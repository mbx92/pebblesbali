<script setup lang="ts">
import JewelryAboutSection from './sections/JewelryAboutSection.vue'
import JewelryBlogPreviewSection from './sections/JewelryBlogPreviewSection.vue'
import JewelryCollectionsSection from './sections/JewelryCollectionsSection.vue'
import JewelryContactSection from './sections/JewelryContactSection.vue'
import JewelryHeroSection from './sections/JewelryHeroSection.vue'
import JewelrySustainabilitySection from './sections/JewelrySustainabilitySection.vue'
import JewelryTestimonialsSection from './sections/JewelryTestimonialsSection.vue'
import type { BlogPost, Collection, Section, Testimonial } from '~/types'

const props = withDefaults(defineProps<{
  sectionKey: 'hero' | 'collections' | 'about' | 'sustainability' | 'testimonials' | 'blog' | 'contact'
  section?: Section
  settings?: Record<string, string> | null
  collections?: Collection[]
  testimonials?: Testimonial[]
  posts?: BlogPost[]
  sectionId?: string
  ctaPrimaryHref?: string
  ctaSecondaryHref?: string
  scrollHref?: string
}>(), {
  section: undefined,
  settings: null,
  collections: () => [],
  testimonials: () => [],
  posts: () => [],
  sectionId: undefined,
  ctaPrimaryHref: undefined,
  ctaSecondaryHref: undefined,
  scrollHref: undefined,
})
</script>

<template>
  <JewelryHeroSection
    v-if="sectionKey === 'hero'"
    :section="section"
    :section-id="sectionId || 'home'"
    :cta-primary-href="ctaPrimaryHref"
    :cta-secondary-href="ctaSecondaryHref"
    :scroll-href="scrollHref"
  />

  <JewelryCollectionsSection
    v-else-if="sectionKey === 'collections'"
    :section="section"
    :items="collections"
    :section-id="sectionId || 'collections'"
  />

  <JewelryAboutSection
    v-else-if="sectionKey === 'about'"
    :section="section"
    :section-id="sectionId || 'about'"
  />

  <JewelrySustainabilitySection
    v-else-if="sectionKey === 'sustainability'"
    :section="section"
    :section-id="sectionId || 'sustainability'"
  />

  <JewelryTestimonialsSection
    v-else-if="sectionKey === 'testimonials'"
    :section="section"
    :items="testimonials"
    :section-id="sectionId || 'testimonials'"
  />

  <JewelryBlogPreviewSection
    v-else-if="sectionKey === 'blog'"
    :section="section"
    :posts="posts"
    :section-id="sectionId || 'blog'"
  />

  <JewelryContactSection
    v-else-if="sectionKey === 'contact'"
    :section="section"
    :settings="settings"
    :section-id="sectionId || 'contact'"
  />
</template>
