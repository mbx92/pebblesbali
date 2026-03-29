import type { Component } from 'vue'
import type { BusinessType, TemplateSectionComponentKey } from '~/types'
import GuesthouseAmenitiesSection from '~/components/sections/GuesthouseAmenitiesSection.vue'
import GuesthouseBookingSection from '~/components/sections/GuesthouseBookingSection.vue'
import GuesthouseGallerySection from '~/components/sections/GuesthouseGallerySection.vue'
import GuesthouseHeroSection from '~/components/sections/GuesthouseHeroSection.vue'
import GuesthouseLocationSection from '~/components/sections/GuesthouseLocationSection.vue'
import GuesthouseRoomsSection from '~/components/sections/GuesthouseRoomsSection.vue'
import GuesthouseTestimonialsSection from '~/components/sections/GuesthouseTestimonialsSection.vue'
import JewelryAboutSection from '~/components/sections/JewelryAboutSection.vue'
import JewelryBlogPreviewSection from '~/components/sections/JewelryBlogPreviewSection.vue'
import JewelryCollectionsSection from '~/components/sections/JewelryCollectionsSection.vue'
import JewelryContactSection from '~/components/sections/JewelryContactSection.vue'
import JewelryHeroSection from '~/components/sections/JewelryHeroSection.vue'
import JewelrySustainabilitySection from '~/components/sections/JewelrySustainabilitySection.vue'
import JewelryTestimonialsSection from '~/components/sections/JewelryTestimonialsSection.vue'
import GuesthouseOasisBookingSection from '~/components/sections/GuesthouseOasisBookingSection.vue'
import GuesthouseOasisHeroSection from '~/components/sections/GuesthouseOasisHeroSection.vue'
import GuesthouseOasisRoomsSection from '~/components/sections/GuesthouseOasisRoomsSection.vue'
import GuesthouseCourtyardAmenitiesSection from '~/components/sections/GuesthouseCourtyardAmenitiesSection.vue'
import GuesthouseCourtyardBookingSection from '~/components/sections/GuesthouseCourtyardBookingSection.vue'
import GuesthouseCourtyardHeroSection from '~/components/sections/GuesthouseCourtyardHeroSection.vue'
import GuesthouseVerandaBookingSection from '~/components/sections/GuesthouseVerandaBookingSection.vue'
import GuesthouseVerandaHeroSection from '~/components/sections/GuesthouseVerandaHeroSection.vue'
import GuesthouseVerandaRoomsSection from '~/components/sections/GuesthouseVerandaRoomsSection.vue'
import JewelryBoutiqueAboutSection from '~/components/sections/JewelryBoutiqueAboutSection.vue'
import JewelryBoutiqueHeroSection from '~/components/sections/JewelryBoutiqueHeroSection.vue'
import JewelryEditorialCollectionsSection from '~/components/sections/JewelryEditorialCollectionsSection.vue'
import JewelryEditorialContactSection from '~/components/sections/JewelryEditorialContactSection.vue'
import JewelryEditorialHeroSection from '~/components/sections/JewelryEditorialHeroSection.vue'
import JewelryMobileCollectionsSection from '~/components/sections/JewelryMobileCollectionsSection.vue'
import JewelryMobileHeroSection from '~/components/sections/JewelryMobileHeroSection.vue'
import JewelryNoirCollectionsSection from '~/components/sections/JewelryNoirCollectionsSection.vue'
import JewelryNoirHeroSection from '~/components/sections/JewelryNoirHeroSection.vue'

type TemplateComponentMap = Partial<Record<TemplateSectionComponentKey, Component>>

const DEFAULT_COMPONENTS: Record<BusinessType, TemplateComponentMap> = {
  jewelry: {
    hero: JewelryHeroSection,
    collections: JewelryCollectionsSection,
    about: JewelryAboutSection,
    sustainability: JewelrySustainabilitySection,
    testimonials: JewelryTestimonialsSection,
    blog: JewelryBlogPreviewSection,
    contact: JewelryContactSection,
  },
  guesthouse: {
    hero: GuesthouseHeroSection,
    rooms: GuesthouseRoomsSection,
    amenities: GuesthouseAmenitiesSection,
    gallery: GuesthouseGallerySection,
    location: GuesthouseLocationSection,
    testimonials: GuesthouseTestimonialsSection,
    booking: GuesthouseBookingSection,
  },
}

const TEMPLATE_COMPONENTS: Record<string, TemplateComponentMap> = {
  'jewelry-classic': DEFAULT_COMPONENTS.jewelry,
  'jewelry-editorial': {
    ...DEFAULT_COMPONENTS.jewelry,
    hero: JewelryEditorialHeroSection,
    collections: JewelryEditorialCollectionsSection,
    contact: JewelryEditorialContactSection,
  },
  'jewelry-boutique': {
    ...DEFAULT_COMPONENTS.jewelry,
    hero: JewelryBoutiqueHeroSection,
    about: JewelryBoutiqueAboutSection,
  },
  'jewelry-noir': {
    ...DEFAULT_COMPONENTS.jewelry,
    hero: JewelryNoirHeroSection,
    collections: JewelryNoirCollectionsSection,
  },
  'jewelry-mobile': {
    ...DEFAULT_COMPONENTS.jewelry,
    hero: JewelryMobileHeroSection,
    collections: JewelryMobileCollectionsSection,
  },
  'guesthouse-retreat': DEFAULT_COMPONENTS.guesthouse,
  'guesthouse-oasis': {
    ...DEFAULT_COMPONENTS.guesthouse,
    hero: GuesthouseOasisHeroSection,
    rooms: GuesthouseOasisRoomsSection,
    booking: GuesthouseOasisBookingSection,
  },
  'guesthouse-courtyard': {
    ...DEFAULT_COMPONENTS.guesthouse,
    hero: GuesthouseCourtyardHeroSection,
    amenities: GuesthouseCourtyardAmenitiesSection,
    booking: GuesthouseCourtyardBookingSection,
  },
  'guesthouse-veranda': {
    ...DEFAULT_COMPONENTS.guesthouse,
    hero: GuesthouseVerandaHeroSection,
    rooms: GuesthouseVerandaRoomsSection,
    booking: GuesthouseVerandaBookingSection,
  },
}

export function resolveTemplateSectionComponent(templateKey: string, businessType: BusinessType, sectionKey: TemplateSectionComponentKey) {
  return TEMPLATE_COMPONENTS[templateKey]?.[sectionKey] || DEFAULT_COMPONENTS[businessType]?.[sectionKey] || null
}