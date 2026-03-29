<script setup lang="ts">
import GuesthouseAmenitiesSection from './sections/GuesthouseAmenitiesSection.vue'
import GuesthouseBookingSection from './sections/GuesthouseBookingSection.vue'
import GuesthouseGallerySection from './sections/GuesthouseGallerySection.vue'
import GuesthouseHeroSection from './sections/GuesthouseHeroSection.vue'
import GuesthouseLocationSection from './sections/GuesthouseLocationSection.vue'
import GuesthouseRoomsSection from './sections/GuesthouseRoomsSection.vue'
import GuesthouseTestimonialsSection from './sections/GuesthouseTestimonialsSection.vue'
import JewelryAboutSection from './sections/JewelryAboutSection.vue'
import JewelryBlogPreviewSection from './sections/JewelryBlogPreviewSection.vue'
import JewelryCollectionsSection from './sections/JewelryCollectionsSection.vue'
import JewelryContactSection from './sections/JewelryContactSection.vue'
import JewelryHeroSection from './sections/JewelryHeroSection.vue'
import JewelrySustainabilitySection from './sections/JewelrySustainabilitySection.vue'
import JewelryTestimonialsSection from './sections/JewelryTestimonialsSection.vue'
import type { BlogPost, BusinessType, Collection, Section, Testimonial } from '~/types'

const props = withDefaults(defineProps<{
  businessType?: BusinessType
  sectionKey: 'hero' | 'collections' | 'about' | 'sustainability' | 'testimonials' | 'blog' | 'contact' | 'rooms' | 'amenities' | 'gallery' | 'location' | 'booking'
  section?: Section
  settings?: Record<string, string> | null
  collections?: Collection[]
  testimonials?: Testimonial[]
  posts?: BlogPost[]
  sectionId?: string
  ctaPrimaryHref?: string
  ctaSecondaryHref?: string
  scrollHref?: string
  bookingEnabled?: boolean
}>(), {
  businessType: 'jewelry',
  section: undefined,
  settings: null,
  collections: () => [],
  testimonials: () => [],
  posts: () => [],
  sectionId: undefined,
  ctaPrimaryHref: undefined,
  ctaSecondaryHref: undefined,
  scrollHref: undefined,
  bookingEnabled: true,
})
</script>

<template>
  <JewelryHeroSection
    v-if="businessType === 'jewelry' && sectionKey === 'hero'"
    :section="section"
    :section-id="sectionId || 'home'"
    :cta-primary-href="ctaPrimaryHref"
    :cta-secondary-href="ctaSecondaryHref"
    :scroll-href="scrollHref"
  />

  <GuesthouseHeroSection
    v-else-if="businessType === 'guesthouse' && sectionKey === 'hero'"
    :section="section"
    :section-id="sectionId || 'home'"
    :cta-primary-href="ctaPrimaryHref"
    :cta-secondary-href="ctaSecondaryHref"
    :scroll-href="scrollHref"
    :booking-enabled="bookingEnabled"
  />

  <JewelryCollectionsSection
    v-else-if="businessType === 'jewelry' && sectionKey === 'collections'"
    :section="section"
    :items="collections"
    :section-id="sectionId || 'collections'"
  />

  <JewelryAboutSection
    v-else-if="businessType === 'jewelry' && sectionKey === 'about'"
    :section="section"
    :section-id="sectionId || 'about'"
  />

  <JewelrySustainabilitySection
    v-else-if="businessType === 'jewelry' && sectionKey === 'sustainability'"
    :section="section"
    :section-id="sectionId || 'sustainability'"
  />

  <JewelryTestimonialsSection
    v-else-if="businessType === 'jewelry' && sectionKey === 'testimonials'"
    :section="section"
    :items="testimonials"
    :section-id="sectionId || 'testimonials'"
  />

  <GuesthouseTestimonialsSection
    v-else-if="businessType === 'guesthouse' && sectionKey === 'testimonials'"
    :section="section"
    :items="testimonials"
    :section-id="sectionId || 'reviews'"
  />

  <JewelryBlogPreviewSection
    v-else-if="businessType === 'jewelry' && sectionKey === 'blog'"
    :section="section"
    :posts="posts"
    :section-id="sectionId || 'blog'"
  />

  <JewelryContactSection
    v-else-if="businessType === 'jewelry' && sectionKey === 'contact'"
    :section="section"
    :settings="settings"
    :section-id="sectionId || 'contact'"
  />

  <GuesthouseRoomsSection
    v-else-if="businessType === 'guesthouse' && sectionKey === 'rooms'"
    :section="section"
    :section-id="sectionId || 'rooms'"
  />

  <GuesthouseAmenitiesSection
    v-else-if="businessType === 'guesthouse' && sectionKey === 'amenities'"
    :section="section"
    :section-id="sectionId || 'amenities'"
  />

  <GuesthouseGallerySection
    v-else-if="businessType === 'guesthouse' && sectionKey === 'gallery'"
    :section="section"
    :section-id="sectionId || 'gallery'"
  />

  <GuesthouseLocationSection
    v-else-if="businessType === 'guesthouse' && sectionKey === 'location'"
    :section="section"
    :settings="settings"
    :section-id="sectionId || 'location'"
  />

  <GuesthouseBookingSection
    v-else-if="businessType === 'guesthouse' && sectionKey === 'booking'"
    :section="section"
    :settings="settings"
    :section-id="sectionId || 'booking'"
  />
</template>
