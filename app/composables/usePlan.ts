/**
 * Feature flag composable.
 * Features are stored as SiteSettings with keys like "featureShop", "featureSeo", etc.
 * Only superadmins can toggle them.
 *
 * Future: replace with license server validation.
 */

export const FEATURES = {
  shop: {
    key: 'featureShop',
    label: 'Shop / Catalog Page',
    description: 'Public /shop page with product catalog, search, and filtering',
    icon: 'shop',
    category: 'Jewelry',
    defaultValue: 'true',
  },
  cart: {
    key: 'featureCart',
    label: 'Shopping Cart & Checkout',
    description: 'Add-to-cart, cart drawer, and checkout flow with customer login (requires Shop to be enabled)',
    icon: 'cart',
    category: 'Jewelry',
    dependsOn: ['shop'],
    defaultValue: 'true',
  },
  blog: {
    key: 'featureBlog',
    label: 'Blog',
    description: 'Manage and publish blog posts for the site',
    icon: 'blog',
    category: 'Core',
    defaultValue: 'true',
  },
  roomInventory: {
    key: 'featureRoomInventory',
    label: 'Guesthouse Room Inventory',
    description: 'Structured room types, room units, room showcase section, and guesthouse room management in admin',
    icon: 'rooms',
    category: 'Guesthouse',
    defaultValue: 'true',
  },
  bookingEngine: {
    key: 'featureBookingEngine',
    label: 'Guesthouse Booking Engine',
    description: 'Public availability check, booking form, booking status lookup, and guesthouse booking management',
    icon: 'booking',
    category: 'Guesthouse',
    dependsOn: ['roomInventory'],
    defaultValue: 'true',
  },
  testimonials: {
    key: 'featureTestimonials',
    label: 'Testimonials & Reviews',
    description: 'Public testimonials section and admin review/testimonial management',
    icon: 'testimonials',
    category: 'Core',
    defaultValue: 'true',
  },
  mediaLibrary: {
    key: 'featureMediaLibrary',
    label: 'Media Library',
    description: 'Central image upload manager and embedded media browser shortcuts across admin editors',
    icon: 'media',
    category: 'Core',
    defaultValue: 'true',
  },
  seo: {
    key: 'featureSeo',
    label: 'SEO & Social Sharing',
    description: 'Meta description, OG image, Google Analytics, sitemap',
    icon: 'seo',
    category: 'Core',
    defaultValue: 'true',
  },
  theme: {
    key: 'featureTheme',
    label: 'Theme Customization',
    description: 'Custom colors and typography fonts',
    icon: 'theme',
    category: 'Core',
    defaultValue: 'true',
  },
} as const

export type FeatureName = keyof typeof FEATURES

export function isFeatureEnabled(settings: Record<string, string> | null | undefined, name: FeatureName, visited = new Set<FeatureName>()): boolean {
  if (visited.has(name)) {
    return true
  }

  visited.add(name)

  const feature = FEATURES[name]
  const val = settings?.[feature.key] ?? feature.defaultValue

  if (val === 'false') {
    return false
  }

  const dependencies = feature.dependsOn ?? []
  return dependencies.every(dependency => isFeatureEnabled(settings, dependency, visited))
}

export function usePlan() {
  const { data: settings } = useFetch<Record<string, string>>('/api/settings')

  function hasFeature(name: FeatureName): boolean {
    return isFeatureEnabled(settings.value, name)
  }

  return { hasFeature, settings }
}
