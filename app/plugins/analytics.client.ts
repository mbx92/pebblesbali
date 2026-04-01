export default defineNuxtPlugin(() => {
  const router = useRouter()

  function shouldTrack(path: string) {
    return Boolean(path) && !path.startsWith('/admin')
  }

  function getVisitorId() {
    const storageKey = 'pb_analytics_visitor_id'
    const existing = localStorage.getItem(storageKey)

    if (existing) {
      return existing
    }

    const nextValue = `pb_${Date.now().toString(36)}_${globalThis.crypto?.randomUUID?.().slice(0, 8) || Math.random().toString(36).slice(2, 10)}`
    localStorage.setItem(storageKey, nextValue)
    return nextValue
  }

  function sendAnalytics(payload: { path: string; referrer: string }) {
    if (!shouldTrack(payload.path)) {
      return
    }

    const body = JSON.stringify({
      visitorId: getVisitorId(),
      path: payload.path,
      title: document.title,
      referrer: payload.referrer,
    })

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/track', new Blob([body], { type: 'application/json' }))
      return
    }

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {})
  }

  let lastTrackedPath = ''

  const trackCurrentRoute = (path: string, referrer: string) => {
    if (!path || path === lastTrackedPath) {
      return
    }

    lastTrackedPath = path
    sendAnalytics({ path, referrer })
  }

  queueMicrotask(() => {
    trackCurrentRoute(window.location.pathname + window.location.search, document.referrer || '')
  })

  router.afterEach((to, from) => {
    const referrer = from.fullPath ? new URL(from.fullPath, window.location.origin).toString() : document.referrer || ''
    trackCurrentRoute(to.fullPath, referrer)
  })
})