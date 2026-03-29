// Guards /shop, /checkout, and public /blog routes based on feature flags
import { isFeatureEnabled } from '~/composables/usePlan'

// Guards feature-gated public routes based on feature flags.
export default defineNuxtRouteMiddleware(async (to) => {
  const isGuarded =
    to.path === '/shop' ||
    to.path === '/checkout' ||
    to.path.startsWith('/blog') ||
    to.path === '/book' ||
    to.path === '/booking-status'

  if (!isGuarded) return

  const settings = await $fetch<Record<string, string>>('/api/settings').catch(() => null)

  if (to.path === '/shop' && !isFeatureEnabled(settings, 'shop')) {
    return navigateTo('/')
  }

  if (to.path === '/checkout' && !isFeatureEnabled(settings, 'cart')) {
    return navigateTo('/shop')
  }

  if (to.path.startsWith('/blog') && !isFeatureEnabled(settings, 'blog')) {
    return navigateTo('/')
  }

  if ((to.path === '/book' || to.path === '/booking-status') && !isFeatureEnabled(settings, 'bookingEngine')) {
    return navigateTo('/')
  }
})
