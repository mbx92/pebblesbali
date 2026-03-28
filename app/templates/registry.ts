import type { BusinessType, BusinessTypeOption, SiteTemplate } from '~/types'

export const BUSINESS_TYPE_OPTIONS: BusinessTypeOption[] = [
  { value: 'jewelry', label: 'Jewelry', available: true },
  { value: 'guesthouse', label: 'Guesthouse / Room Rent', available: false },
]

export const TEMPLATE_REGISTRY: Record<string, SiteTemplate> = {
  'jewelry-classic': {
    key: 'jewelry-classic',
    businessType: 'jewelry',
    label: 'Jewelry Classic',
    themeName: 'jewels',
    sectionMap: {
      hero: 'hero',
      collections: 'collections',
      about: 'about',
      sustainability: 'sustainability',
      testimonials: 'testimonials',
      contact: 'contact',
      blog: 'blog',
    },
    sections: [
      { key: 'hero', slug: 'hero', anchor: 'home', component: 'hero' },
      { key: 'collections', slug: 'collections', anchor: 'collections', component: 'collections' },
      { key: 'about', slug: 'about', anchor: 'about', component: 'about' },
      { key: 'sustainability', slug: 'sustainability', anchor: 'sustainability', component: 'sustainability' },
      { key: 'testimonials', slug: 'testimonials', anchor: 'testimonials', component: 'testimonials' },
      { key: 'blog', slug: 'blog', anchor: 'blog', component: 'blog' },
      { key: 'contact', slug: 'contact', anchor: 'contact', component: 'contact' },
    ],
    navigation: [
      {
        key: 'shop',
        label: { en: 'Shop', id: 'Toko' },
        to: '/shop',
        requiresFeature: 'shop',
      },
      {
        key: 'collections',
        label: { en: 'Collections', id: 'Koleksi' },
        sectionKey: 'collections',
      },
      {
        key: 'about',
        label: { en: 'About', id: 'Tentang' },
        sectionKey: 'about',
      },
      {
        key: 'reviews',
        label: { en: 'Reviews', id: 'Ulasan' },
        sectionKey: 'testimonials',
      },
      {
        key: 'blog',
        label: { en: 'Blog', id: 'Blog' },
        to: '/blog',
      },
      {
        key: 'contact',
        label: { en: 'Contact', id: 'Kontak' },
        sectionKey: 'contact',
      },
    ],
    defaults: {
      siteName: 'Sense of Jewels',
      siteTagline: 'Handcrafted Balinese jewelry',
      metaDescription: 'Handcrafted Balinese jewelry inspired by the island\'s rich cultural heritage.',
    },
  },
}

export const DEFAULT_TEMPLATE_KEY = 'jewelry-classic'

export function isBusinessType(value: string | null | undefined): value is BusinessType {
  return BUSINESS_TYPE_OPTIONS.some(option => option.value === value)
}

export function getTemplateByKey(templateKey: string | null | undefined): SiteTemplate | null {
  if (!templateKey) return null
  return TEMPLATE_REGISTRY[templateKey] ?? null
}

export function getDefaultTemplateForBusinessType(businessType: BusinessType): SiteTemplate {
  const template = Object.values(TEMPLATE_REGISTRY).find(item => item.businessType === businessType)
  return template ?? TEMPLATE_REGISTRY[DEFAULT_TEMPLATE_KEY]
}

export function getTemplateOptionsForBusinessType(businessType: BusinessType): SiteTemplate[] {
  return Object.values(TEMPLATE_REGISTRY).filter(template => template.businessType === businessType)
}