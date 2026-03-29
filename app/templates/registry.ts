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
    description: 'Luxury jewelry landing page with a dramatic hero and classic section flow.',
    previewImage: '/template-previews/jewelry-classic.svg',
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
  'jewelry-editorial': {
    key: 'jewelry-editorial',
    businessType: 'jewelry',
    label: 'Jewelry Editorial',
    description: 'A more spacious, magazine-like jewelry presentation with stronger visual storytelling.',
    previewImage: '/template-previews/jewelry-editorial.svg',
    themeName: 'jewels-editorial',
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
      { key: 'about', slug: 'about', anchor: 'atelier', component: 'about' },
      { key: 'sustainability', slug: 'sustainability', anchor: 'values', component: 'sustainability' },
      { key: 'testimonials', slug: 'testimonials', anchor: 'reviews', component: 'testimonials', requiresFeature: 'testimonials' },
      { key: 'blog', slug: 'blog', anchor: 'journal', component: 'blog', requiresFeature: 'blog' },
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
        key: 'atelier',
        label: { en: 'Atelier', id: 'Atelier' },
        sectionKey: 'about',
      },
      {
        key: 'values',
        label: { en: 'Values', id: 'Nilai' },
        sectionKey: 'sustainability',
      },
      {
        key: 'journal',
        label: { en: 'Journal', id: 'Jurnal' },
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
      siteTagline: 'Editorial Balinese jewelry stories',
      metaDescription: 'An editorial jewelry landing page for handcrafted Balinese collections with a more gallery-like presentation.',
    },
  },
  'jewelry-boutique': {
    key: 'jewelry-boutique',
    businessType: 'jewelry',
    label: 'Jewelry Boutique',
    description: 'A warmer, smaller-scale jewelry preset with softer luxury cues and boutique-brand framing.',
    previewImage: '/template-previews/jewelry-boutique.svg',
    themeName: 'jewels-boutique',
    sectionMap: {
      hero: 'hero',
      collections: 'collections',
      about: 'about',
      sustainability: 'sustainability',
      testimonials: 'testimonials',
      blog: 'blog',
      contact: 'contact',
    },
    sections: [
      { key: 'hero', slug: 'hero', anchor: 'home', component: 'hero' },
      { key: 'collections', slug: 'collections', anchor: 'collections', component: 'collections' },
      { key: 'about', slug: 'about', anchor: 'story', component: 'about' },
      { key: 'sustainability', slug: 'sustainability', anchor: 'values', component: 'sustainability' },
      { key: 'testimonials', slug: 'testimonials', anchor: 'reviews', component: 'testimonials', requiresFeature: 'testimonials' },
      { key: 'blog', slug: 'blog', anchor: 'journal', component: 'blog', requiresFeature: 'blog' },
      { key: 'contact', slug: 'contact', anchor: 'contact', component: 'contact' },
    ],
    navigation: [
      { key: 'shop', label: { en: 'Shop', id: 'Toko' }, to: '/shop', requiresFeature: 'shop' },
      { key: 'collections', label: { en: 'Collections', id: 'Koleksi' }, sectionKey: 'collections' },
      { key: 'story', label: { en: 'Story', id: 'Cerita' }, sectionKey: 'about' },
      { key: 'values', label: { en: 'Values', id: 'Nilai' }, sectionKey: 'sustainability' },
      { key: 'contact', label: { en: 'Contact', id: 'Kontak' }, sectionKey: 'contact' },
    ],
    defaults: {
      siteName: 'Sense of Jewels',
      siteTagline: 'Small-batch Balinese jewelry with boutique warmth',
      metaDescription: 'A boutique jewelry template with softer luxury tones and a more intimate brand story layout.',
    },
  },
  'jewelry-noir': {
    key: 'jewelry-noir',
    businessType: 'jewelry',
    label: 'Jewelry Noir',
    description: 'Dark-luxury jewelry preset with cinematic contrast, deep navy surfaces, and gold-led spotlighting.',
    previewImage: '/template-previews/jewelry-noir.svg',
    themeName: 'jewels-noir',
    sectionMap: {
      hero: 'hero',
      collections: 'collections',
      about: 'about',
      sustainability: 'sustainability',
      testimonials: 'testimonials',
      blog: 'blog',
      contact: 'contact',
    },
    sections: [
      { key: 'hero', slug: 'hero', anchor: 'home', component: 'hero' },
      { key: 'collections', slug: 'collections', anchor: 'collections', component: 'collections' },
      { key: 'about', slug: 'about', anchor: 'atelier', component: 'about' },
      { key: 'sustainability', slug: 'sustainability', anchor: 'craft', component: 'sustainability' },
      { key: 'testimonials', slug: 'testimonials', anchor: 'collectors', component: 'testimonials', requiresFeature: 'testimonials' },
      { key: 'blog', slug: 'blog', anchor: 'journal', component: 'blog', requiresFeature: 'blog' },
      { key: 'contact', slug: 'contact', anchor: 'contact', component: 'contact' },
    ],
    navigation: [
      { key: 'shop', label: { en: 'Shop', id: 'Toko' }, to: '/shop', requiresFeature: 'shop' },
      { key: 'collections', label: { en: 'Collections', id: 'Koleksi' }, sectionKey: 'collections' },
      { key: 'atelier', label: { en: 'Atelier', id: 'Atelier' }, sectionKey: 'about' },
      { key: 'craft', label: { en: 'Craft', id: 'Craft' }, sectionKey: 'sustainability' },
      { key: 'journal', label: { en: 'Journal', id: 'Jurnal' }, to: '/blog', requiresFeature: 'blog' },
      { key: 'contact', label: { en: 'Contact', id: 'Kontak' }, sectionKey: 'contact' },
    ],
    defaults: {
      siteName: 'Sense of Jewels',
      siteTagline: 'Dark luxury jewelry with cinematic contrast',
      metaDescription: 'A dark-luxury jewelry template built for bold hero imagery, spotlight product framing, and high-contrast brand storytelling.',
    },
  },
  'jewelry-mobile': {
    key: 'jewelry-mobile',
    businessType: 'jewelry',
    label: 'Jewelry Mobile Commerce',
    description: 'Mobile-first jewelry preset inspired by premium commerce apps, with product chips, compact cards, and faster CTA scanning.',
    previewImage: '/template-previews/jewelry-mobile.svg',
    themeName: 'jewels-mobile',
    sectionMap: {
      hero: 'hero',
      collections: 'collections',
      about: 'about',
      sustainability: 'sustainability',
      testimonials: 'testimonials',
      blog: 'blog',
      contact: 'contact',
    },
    sections: [
      { key: 'hero', slug: 'hero', anchor: 'home', component: 'hero' },
      { key: 'collections', slug: 'collections', anchor: 'shop', component: 'collections' },
      { key: 'about', slug: 'about', anchor: 'story', component: 'about' },
      { key: 'sustainability', slug: 'sustainability', anchor: 'materials', component: 'sustainability' },
      { key: 'testimonials', slug: 'testimonials', anchor: 'reviews', component: 'testimonials', requiresFeature: 'testimonials' },
      { key: 'blog', slug: 'blog', anchor: 'drops', component: 'blog', requiresFeature: 'blog' },
      { key: 'contact', slug: 'contact', anchor: 'contact', component: 'contact' },
    ],
    navigation: [
      { key: 'shop', label: { en: 'Shop', id: 'Toko' }, to: '/shop', requiresFeature: 'shop' },
      { key: 'new', label: { en: 'New Drops', id: 'Rilis Baru' }, sectionKey: 'collections' },
      { key: 'story', label: { en: 'Story', id: 'Cerita' }, sectionKey: 'about' },
      { key: 'materials', label: { en: 'Materials', id: 'Material' }, sectionKey: 'sustainability' },
      { key: 'contact', label: { en: 'Contact', id: 'Kontak' }, sectionKey: 'contact' },
    ],
    defaults: {
      siteName: 'Sense of Jewels',
      siteTagline: 'Premium mobile jewelry shopping flow',
      metaDescription: 'A mobile-commerce jewelry template with faster product scanning, stronger conversion rhythm, and app-inspired UI language.',
    },
  },
  'guesthouse-retreat': {
    key: 'guesthouse-retreat',
    businessType: 'guesthouse',
    label: 'Guesthouse Retreat',
    description: 'Layered tropical guesthouse landing page with richer booking storytelling.',
    previewImage: '/template-previews/guesthouse-retreat.svg',
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
  'guesthouse-oasis': {
    key: 'guesthouse-oasis',
    businessType: 'guesthouse',
    label: 'Guesthouse Oasis',
    description: 'A lighter, more minimal guesthouse template with brighter cards and softer contrast.',
    previewImage: '/template-previews/guesthouse-oasis.svg',
    themeName: 'guesthouse-oasis',
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
      { key: 'location', slug: 'location', anchor: 'location', component: 'location' },
      { key: 'gallery', slug: 'gallery', anchor: 'gallery', component: 'gallery' },
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
        key: 'location',
        label: { en: 'Location', id: 'Lokasi' },
        sectionKey: 'location',
      },
      {
        key: 'gallery',
        label: { en: 'Gallery', id: 'Galeri' },
        sectionKey: 'gallery',
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
      siteTagline: 'Bright, quiet rooms for easy Bali stays',
      metaDescription: 'A lighter guesthouse landing page with calm rooms, cleaner cards, and direct booking flow.',
    },
  },
  'guesthouse-courtyard': {
    key: 'guesthouse-courtyard',
    businessType: 'guesthouse',
    label: 'Guesthouse Courtyard',
    description: 'A warmer, more host-led guesthouse preset with courtyard atmosphere and stronger hospitality cues.',
    previewImage: '/template-previews/guesthouse-courtyard.svg',
    themeName: 'guesthouse-courtyard',
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
      { key: 'location', slug: 'location', anchor: 'location', component: 'location' },
      { key: 'gallery', slug: 'gallery', anchor: 'gallery', component: 'gallery' },
      { key: 'testimonials', slug: 'testimonials', anchor: 'reviews', component: 'testimonials', requiresFeature: 'testimonials' },
      { key: 'booking', slug: 'booking', anchor: 'booking', component: 'booking', requiresFeature: 'bookingEngine' },
    ],
    navigation: [
      { key: 'rooms', label: { en: 'Rooms', id: 'Kamar' }, sectionKey: 'rooms', requiresFeature: 'roomInventory' },
      { key: 'amenities', label: { en: 'Amenities', id: 'Fasilitas' }, sectionKey: 'amenities' },
      { key: 'gallery', label: { en: 'Gallery', id: 'Galeri' }, sectionKey: 'gallery' },
      { key: 'location', label: { en: 'Location', id: 'Lokasi' }, sectionKey: 'location' },
      { key: 'booking', label: { en: 'Book Stay', id: 'Pesan' }, sectionKey: 'booking', requiresFeature: 'bookingEngine' },
    ],
    defaults: {
      siteName: 'Pebbles Bali Guesthouse',
      siteTagline: 'Warm courtyard rooms with direct host support',
      metaDescription: 'A warmer guesthouse landing page with stronger courtyard atmosphere and host-led booking cues.',
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

export function getAllTemplateOptions(): SiteTemplate[] {
  return Object.values(TEMPLATE_REGISTRY)
}