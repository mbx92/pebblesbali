// Guards /shop, /checkout, and public /blog routes based on feature flags
export default defineNuxtRouteMiddleware(async (to) => {
  const isGuarded =
    to.path === '/shop' ||
    to.path === '/checkout' ||
    to.path.startsWith('/blog')

  if (!isGuarded) return

  const settings = await $fetch<Record<string, string>>('/api/settings').catch(() => null)

  if (to.path === '/shop' && settings?.featureShop === 'false') {
    return navigateTo('/')
  }

  if (to.path === '/checkout' && settings?.featureCart === 'false') {
    return navigateTo('/shop')
  }

  if (to.path.startsWith('/blog') && settings?.featureBlog === 'false') {
    return navigateTo('/')
  }
})
