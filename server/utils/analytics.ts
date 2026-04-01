import type { H3Event } from 'h3'
import { getHeader } from 'h3'

const regionNames = (() => {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' })
  }
  catch {
    return null
  }
})()

function cleanValue(value: string | null | undefined, fallback = '') {
  return String(value || '').trim() || fallback
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function truncate(value: string, maxLength: number) {
  return value.length > maxLength ? value.slice(0, maxLength) : value
}

const COUNTRY_COORDINATES: Record<string, { latitude: number; longitude: number }> = {
  Argentina: { latitude: -34.0, longitude: -64.0 },
  Australia: { latitude: -25.0, longitude: 133.0 },
  Austria: { latitude: 47.6, longitude: 14.1 },
  Belgium: { latitude: 50.8, longitude: 4.5 },
  Brazil: { latitude: -14.2, longitude: -51.9 },
  Canada: { latitude: 56.1, longitude: -106.3 },
  China: { latitude: 35.9, longitude: 104.2 },
  France: { latitude: 46.2, longitude: 2.2 },
  Germany: { latitude: 51.2, longitude: 10.4 },
  India: { latitude: 20.6, longitude: 78.9 },
  Indonesia: { latitude: -2.2, longitude: 117.3 },
  Ireland: { latitude: 53.1, longitude: -8.2 },
  Italy: { latitude: 41.9, longitude: 12.6 },
  Japan: { latitude: 36.2, longitude: 138.3 },
  Malaysia: { latitude: 4.2, longitude: 102.0 },
  Mexico: { latitude: 23.6, longitude: -102.5 },
  Netherlands: { latitude: 52.1, longitude: 5.3 },
  'New Zealand': { latitude: -40.9, longitude: 174.9 },
  Philippines: { latitude: 12.9, longitude: 121.8 },
  Russia: { latitude: 61.5, longitude: 105.3 },
  'Saudi Arabia': { latitude: 23.9, longitude: 45.1 },
  Singapore: { latitude: 1.35, longitude: 103.8 },
  'South Africa': { latitude: -30.6, longitude: 22.9 },
  'South Korea': { latitude: 35.9, longitude: 127.8 },
  Spain: { latitude: 40.5, longitude: -3.7 },
  Sweden: { latitude: 60.1, longitude: 18.6 },
  Switzerland: { latitude: 46.8, longitude: 8.2 },
  Thailand: { latitude: 15.8, longitude: 100.9 },
  Turkey: { latitude: 38.9, longitude: 35.2 },
  'United Arab Emirates': { latitude: 23.4, longitude: 53.8 },
  'United Kingdom': { latitude: 55.4, longitude: -3.4 },
  'United States': { latitude: 39.8, longitude: -98.6 },
  Vietnam: { latitude: 14.1, longitude: 108.3 },
  Local: { latitude: -8.65, longitude: 115.22 },
}

export function normalizeAnalyticsPath(input: string) {
  const trimmed = cleanValue(input)

  if (!trimmed) {
    return '/'
  }

  try {
    const url = new URL(trimmed)
    return truncate(`${url.pathname || '/'}${url.search || ''}`, 255)
  }
  catch {
    if (trimmed.startsWith('/')) {
      return truncate(trimmed.split('#')[0] || '/', 255)
    }

    return truncate(`/${trimmed.replace(/^\/+/, '')}`.split('#')[0] || '/', 255)
  }
}

export function normalizeAnalyticsUrl(input: string | null | undefined) {
  const trimmed = cleanValue(input)

  if (!trimmed) {
    return null
  }

  try {
    return truncate(new URL(trimmed).toString(), 512)
  }
  catch {
    if (trimmed.startsWith('/')) {
      return truncate(trimmed, 512)
    }

    return null
  }
}

function extractFirstHeaderValue(event: H3Event, keys: string[]) {
  for (const key of keys) {
    const value = cleanValue(getHeader(event, key))
    if (value) {
      return value
    }
  }

  return ''
}

export function getRequestIpAddress(event: H3Event) {
  const forwardedFor = extractFirstHeaderValue(event, ['x-forwarded-for', 'x-real-ip', 'cf-connecting-ip', 'x-vercel-forwarded-for'])
  const ip = forwardedFor.split(',')[0]?.trim() || ''

  if (ip) {
    return truncate(ip, 64)
  }

  return null
}

export function getAnalyticsLocation(event: H3Event) {
  const ip = getRequestIpAddress(event)
  const host = cleanValue(getHeader(event, 'host')).toLowerCase()
  const isLocal = host.includes('localhost') || host.startsWith('127.0.0.1') || ip === '127.0.0.1' || ip === '::1'

  if (isLocal) {
    return {
      country: 'Local',
      region: 'Development',
      city: 'Localhost',
    }
  }

  const countryCode = extractFirstHeaderValue(event, ['x-vercel-ip-country', 'cf-ipcountry']).toUpperCase()
  const region = truncate(extractFirstHeaderValue(event, ['x-vercel-ip-country-region', 'x-region']), 120) || null
  const city = truncate(extractFirstHeaderValue(event, ['x-vercel-ip-city', 'x-city']), 120) || null

  const country = countryCode && countryCode !== 'XX'
    ? truncate(regionNames?.of(countryCode) || countryCode, 120)
    : null

  return {
    country,
    region,
    city,
  }
}

export function getUserAgentDetails(userAgent: string | null | undefined) {
  const ua = cleanValue(userAgent)
  const normalized = ua.toLowerCase()

  const deviceType = normalized.includes('bot') || normalized.includes('crawler') || normalized.includes('spider')
    ? 'bot'
    : normalized.includes('ipad') || normalized.includes('tablet') || normalized.includes('playbook') || normalized.includes('silk')
      ? 'tablet'
      : normalized.includes('mobile') || normalized.includes('iphone') || normalized.includes('ipod') || normalized.includes('android') && normalized.includes('mobile') || normalized.includes('windows phone')
        ? 'mobile'
        : 'desktop'

  let browser = 'Unknown'
  if (normalized.includes('edg/')) browser = 'Edge'
  else if (normalized.includes('opr/') || normalized.includes('opera')) browser = 'Opera'
  else if (normalized.includes('chrome/') && !normalized.includes('edg/')) browser = 'Chrome'
  else if (normalized.includes('firefox/')) browser = 'Firefox'
  else if (normalized.includes('safari/') && !normalized.includes('chrome/')) browser = 'Safari'
  else if (normalized.includes('trident/') || normalized.includes('msie')) browser = 'Internet Explorer'

  let os = 'Unknown'
  if (normalized.includes('windows')) os = 'Windows'
  else if (normalized.includes('android')) os = 'Android'
  else if (normalized.includes('iphone') || normalized.includes('ipad') || normalized.includes('ios')) os = 'iOS'
  else if (normalized.includes('mac os x') || normalized.includes('macintosh')) os = 'macOS'
  else if (normalized.includes('linux')) os = 'Linux'

  return {
    deviceType,
    browser,
    os,
    userAgent: ua ? truncate(ua, 1024) : null,
  }
}

export function countAnalyticsByLabel(values: Array<string | null | undefined>, limit = 5) {
  const counts = new Map<string, number>()

  for (const value of values) {
    const label = cleanValue(value, 'Unknown')
    counts.set(label, (counts.get(label) || 0) + 1)
  }

  return Array.from(counts.entries())
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }))
}

export function formatDeviceLabel(deviceType: string | null | undefined) {
  const normalized = cleanValue(deviceType, 'unknown').toLowerCase()
  return titleCase(normalized)
}

export function formatLocationLabel(city: string | null | undefined, region: string | null | undefined, country: string | null | undefined) {
  return [cleanValue(city), cleanValue(region), cleanValue(country)].filter(Boolean).join(', ') || 'Unknown'
}

export function buildDailyAnalyticsSeries(values: Date[], totalDays: number) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const counts = new Map<string, number>()
  for (const value of values) {
    const date = new Date(value)
    date.setHours(0, 0, 0, 0)
    const key = date.toISOString().slice(0, 10)
    counts.set(key, (counts.get(key) || 0) + 1)
  }

  return Array.from({ length: totalDays }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (totalDays - index - 1))
    const key = date.toISOString().slice(0, 10)

    return {
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: counts.get(key) || 0,
    }
  })
}

export function buildAnalyticsMapMarkers(items: Array<{ country: string | null | undefined; count: number }>) {
  return items
    .map((item) => {
      const label = cleanValue(item.country)
      const coordinates = COUNTRY_COORDINATES[label]

      if (!label || !coordinates) {
        return null
      }

      return {
        label,
        count: item.count,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      }
    })
    .filter(Boolean)
}