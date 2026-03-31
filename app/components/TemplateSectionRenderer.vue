<script setup lang="ts">
import { resolveTemplateSectionComponent } from '~/templates/sectionComponents'
import type { BlogPost, BusinessType, Collection, Section, TemplateSectionComponentKey, Testimonial } from '~/types'

const props = withDefaults(defineProps<{
  businessType?: BusinessType
  templateKey: string
  sectionKey: TemplateSectionComponentKey
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

const resolvedComponent = computed(() => resolveTemplateSectionComponent(props.templateKey, props.businessType, props.sectionKey))

const componentProps = computed(() => {
  const base = {
    section: props.section,
    sectionId: props.sectionId,
  }

  if (props.sectionKey === 'hero') {
    return {
      ...base,
      ctaPrimaryHref: props.ctaPrimaryHref,
      ctaSecondaryHref: props.ctaSecondaryHref,
      scrollHref: props.scrollHref,
      bookingEnabled: props.bookingEnabled,
    }
  }

  if (props.sectionKey === 'collections') {
    return {
      ...base,
      items: props.collections,
    }
  }

  if (props.sectionKey === 'testimonials') {
    return {
      ...base,
      items: props.testimonials,
    }
  }

  if (props.sectionKey === 'blog') {
    return {
      ...base,
      posts: props.posts,
    }
  }

  if (props.sectionKey === 'contact' || props.sectionKey === 'location' || props.sectionKey === 'booking' || props.sectionKey === 'coverage') {
    return {
      ...base,
      settings: props.settings,
    }
  }

  return base
})
</script>

<template>
  <component
    :is="resolvedComponent"
    v-if="resolvedComponent"
    v-bind="componentProps"
  />
</template>
