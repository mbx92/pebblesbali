import type { BusinessType, BusinessTypeOption, SiteTemplate } from '~/types'

export const BUSINESS_TYPE_OPTIONS: BusinessTypeOption[] = [
  { value: 'jewelry', label: 'Jewelry', available: true },
  { value: 'guesthouse', label: 'Guesthouse / Room Rent', available: true },
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
      { key: 'testimonials', slug: 'testimonials', anchor: 'testimonials', component: 'testimonials', requiresFeature: 'testimonials' },
      { key: 'blog', slug: 'blog', anchor: 'blog', component: 'blog', requiresFeature: 'blog' },
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
        requiresFeature: 'testimonials',
      },
      {
        key: 'blog',
        label: { en: 'Blog', id: 'Blog' },
        to: '/blog',
        requiresFeature: 'blog',
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
  'guesthouse-retreat': {
    key: 'guesthouse-retreat',
    businessType: 'guesthouse',
    label: 'Guesthouse Retreat',
    themeName: 'jewels',
    sectionMap: {
      hero: 'hero',
      rooms: 'rooms',
      amenities: 'amenities',
      gallery: 'gallery',
      location: 'location',
      testimonials: 'testimonials',
      booking: 'booking',
    },
    sections: [
      { key: 'hero', slug: 'hero', anchor: 'home', component: 'hero' },
      { key: 'rooms', slug: 'rooms', anchor: 'rooms', component: 'rooms', requiresFeature: 'roomInventory' },
      { key: 'amenities', slug: 'amenities', anchor: 'amenities', component: 'amenities' },
      { key: 'gallery', slug: 'gallery', anchor: 'gallery', component: 'gallery' },
      { key: 'location', slug: 'location', anchor: 'location', component: 'location' },
      { key: 'testimonials', slug: 'testimonials', anchor: 'reviews', component: 'testimonials', requiresFeature: 'testimonials' },
      { key: 'booking', slug: 'booking', anchor: 'booking', component: 'booking', requiresFeature: 'bookingEngine' },
    ],
    navigation: [
      {
        key: 'rooms',
        label: { en: 'Rooms', id: 'Kamar' },
        sectionKey: 'rooms',
        requiresFeature: 'roomInventory',
      },
      {
        key: 'amenities',
        label: { en: 'Amenities', id: 'Fasilitas' },
        sectionKey: 'amenities',
      },
      {
        key: 'gallery',
        label: { en: 'Gallery', id: 'Galeri' },
        sectionKey: 'gallery',
      },
      {
        key: 'location',
        label: { en: 'Location', id: 'Lokasi' },
        sectionKey: 'location',
      },
      {
        key: 'reviews',
        label: { en: 'Reviews', id: 'Ulasan' },
        sectionKey: 'testimonials',
        requiresFeature: 'testimonials',
      },
      {
        key: 'booking',
        label: { en: 'Book Stay', id: 'Pesan' },
        sectionKey: 'booking',
        requiresFeature: 'bookingEngine',
      },
    ],
    defaults: {
      siteName: 'Pebbles Bali Guesthouse',
      siteTagline: 'Boutique rooms for slower Bali stays',
      metaDescription: 'A boutique Balinese guesthouse with calm rooms, tropical details, and direct booking inquiries.',
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