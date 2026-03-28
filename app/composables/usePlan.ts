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
  },
  cart: {
    key: 'featureCart',
    label: 'Shopping Cart & Checkout',
    description: 'Add-to-cart, cart drawer, and checkout flow with customer login (requires Shop to be enabled)',
    icon: 'cart',
  },
  blog: {
    key: 'featureBlog',
    label: 'Blog',
    description: 'Manage and publish blog posts for the site',
    icon: 'blog',
  },
  seo: {
    key: 'featureSeo',
    label: 'SEO & Social Sharing',
    description: 'Meta description, OG image, Google Analytics, sitemap',
    icon: 'seo',
  },
  theme: {
    key: 'featureTheme',
    label: 'Theme Customization',
    description: 'Custom colors and typography fonts',
    icon: 'theme',
  },
} as const

export type FeatureName = keyof typeof FEATURES

export function usePlan() {
  const { data: settings } = useFetch<Record<string, string>>('/api/settings')

  function hasFeature(name: FeatureName): boolean {
    const key = FEATURES[name].key
    const val = settings.value?.[key]
    // treat undefined (never saved) as enabled; only explicit 'false' disables
    return val !== 'false'
  }

  return { hasFeature, settings }
}
