export default defineNuxtRouteMiddleware(async (to) => {
  // Only protect /admin/* routes
  if (!to.path.startsWith('/admin')) return

  // Allow the login page through
  if (to.path === '/admin/login') return

  try {
    const user = await $fetch<{ role: string }>('/api/auth/me')
    if (user.role === 'customer') {
      return navigateTo('/admin/login')
    }
  } catch {
    return navigateTo('/admin/login')
  }

  if (to.path === '/admin/settings') {
    return
  }

  const settings = await $fetch<Record<string, string>>('/api/settings').catch(() => null)
  const licenseStatus = String(settings?.licenseStatus || '').toLowerCase()

  if (licenseStatus === 'expired' || licenseStatus === 'inactive' || licenseStatus === 'invalid') {
    return navigateTo({
      path: '/admin/settings',
      query: { license: licenseStatus },
      replace: true,
    })
  }
})
