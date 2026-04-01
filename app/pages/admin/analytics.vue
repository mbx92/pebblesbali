<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
      <div>
        <h1 class="text-2xl font-bold text-base-content">Analytics</h1>
        <p class="text-sm text-base-content/50 mt-1">Track visitor geography, device mix, and page activity across the public site</p>
      </div>
      <NuxtLink to="/" target="_blank" class="btn btn-sm btn-outline gap-2">
        <IconEye class="w-4 h-4" />
        Open Site
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body p-5">
          <p class="text-xs font-semibold uppercase tracking-wide text-base-content/40">Total Pageviews</p>
          <p class="text-3xl font-bold mt-2">{{ analytics?.totalPageviews || 0 }}</p>
        </div>
      </div>
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body p-5">
          <p class="text-xs font-semibold uppercase tracking-wide text-base-content/40">Views Today</p>
          <p class="text-3xl font-bold mt-2">{{ analytics?.viewsToday || 0 }}</p>
        </div>
      </div>
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body p-5">
          <p class="text-xs font-semibold uppercase tracking-wide text-base-content/40">Views Last 7 Days</p>
          <p class="text-3xl font-bold mt-2">{{ analytics?.viewsLast7Days || 0 }}</p>
        </div>
      </div>
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body p-5">
          <p class="text-xs font-semibold uppercase tracking-wide text-base-content/40">Unique Visitors 7 Days</p>
          <p class="text-3xl font-bold mt-2">{{ analytics?.uniqueVisitorsLast7Days || 0 }}</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-6 mb-6">
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h2 class="font-semibold text-base-content">Traffic Trend</h2>
              <p class="text-xs text-base-content/45 mt-1">Last 14 days pageviews</p>
            </div>
            <span class="badge badge-soft badge-sm">14D</span>
          </div>

          <div class="mt-5 rounded-3xl border border-base-300 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-secondary)_8%,white),transparent)] p-4">
            <svg viewBox="0 0 640 240" class="w-full h-56 overflow-visible" role="img" aria-label="Daily pageviews line chart">
              <g>
                <line v-for="step in 5" :key="`grid-${step}`" x1="48" :y1="20 + (step - 1) * 45" x2="612" :y2="20 + (step - 1) * 45" class="stroke-base-300" stroke-dasharray="4 6" />
              </g>
              <polyline
                :points="chartPoints"
                fill="none"
                stroke="currentColor"
                class="text-secondary"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <g>
                <circle
                  v-for="point in chartPlot"
                  :key="point.label"
                  :cx="point.x"
                  :cy="point.y"
                  r="4.5"
                  class="fill-secondary stroke-base-100"
                  stroke-width="3"
                />
              </g>
              <g>
                <text v-for="point in chartPlot" :key="`label-${point.label}`" :x="point.x" y="228" text-anchor="middle" class="fill-base-content/55 text-[10px]">
                  {{ point.label }}
                </text>
              </g>
            </svg>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <div class="rounded-2xl bg-base-200/50 px-4 py-3">
              <p class="text-xs uppercase tracking-wide text-base-content/45">Peak Day</p>
              <p class="text-sm font-semibold mt-1">{{ peakDay.label }}</p>
              <p class="text-xs text-base-content/45 mt-1">{{ peakDay.count }} views</p>
            </div>
            <div class="rounded-2xl bg-base-200/50 px-4 py-3">
              <p class="text-xs uppercase tracking-wide text-base-content/45">Average / Day</p>
              <p class="text-sm font-semibold mt-1">{{ averageDailyViews }}</p>
              <p class="text-xs text-base-content/45 mt-1">Across 14 tracked days</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 border border-base-300">
        <div class="card-body">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h2 class="font-semibold text-base-content">Visitor Locations</h2>
              <p class="text-xs text-base-content/45 mt-1">Lokasi terbaru berdasarkan IP address pengunjung</p>
            </div>
            <span class="badge badge-soft badge-sm">{{ recentIpLocations.length }} IPs</span>
          </div>

          <div class="mt-5 rounded-3xl border border-base-300 bg-[radial-gradient(circle_at_top,color-mix(in_oklab,var(--color-secondary)_10%,white),transparent_50%),linear-gradient(180deg,color-mix(in_oklab,var(--color-secondary)_8%,white),transparent)] p-4">
            <div class="space-y-3">
              <div
                v-for="location in recentIpLocations"
                :key="`${location.ipAddress}-${location.location}`"
                class="rounded-2xl border border-base-300/80 bg-base-100/80 px-4 py-3"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-base-content truncate">{{ location.location }}</p>
                    <p class="text-xs text-base-content/45 mt-1">Berdasarkan IP: <span class="font-mono">{{ location.ipAddress }}</span></p>
                  </div>
                  <span class="badge badge-soft badge-sm shrink-0">{{ location.count }} visits</span>
                </div>
                <div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-base-content/55">
                  <span class="rounded-full bg-base-200 px-2.5 py-1">{{ location.deviceType }}</span>
                  <span class="rounded-full bg-base-200 px-2.5 py-1">{{ location.browser }}</span>
                  <span class="rounded-full bg-base-200 px-2.5 py-1">{{ formatAdminDateTime(location.createdAt) }}</span>
                </div>
              </div>
              <div v-if="!recentIpLocations.length" class="rounded-2xl border border-dashed border-base-300 px-4 py-8 text-center text-sm text-base-content/40">
                Belum ada data lokasi dari IP address
              </div>
            </div>
          </div>

          <div class="mt-4 space-y-3">
            <div v-for="item in analytics?.topCountries || []" :key="`country-${item.label}`" class="flex items-center justify-between gap-4 rounded-2xl bg-base-200/50 px-4 py-3">
              <span class="text-sm font-medium">{{ item.label }}</span>
              <span class="badge badge-soft badge-sm">{{ item.count }}</span>
            </div>
            <div v-if="!(analytics?.topCountries || []).length" class="rounded-2xl bg-base-200/50 px-4 py-6 text-center text-sm text-base-content/40">No country data yet</div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body">
          <h2 class="font-semibold text-base-content">Top Locations</h2>
          <div class="mt-4 space-y-3">
            <div v-for="item in analytics?.topLocations || []" :key="`location-${item.label}`" class="flex items-center justify-between gap-4 rounded-2xl bg-base-200/50 px-4 py-3">
              <span class="text-sm font-medium">{{ item.label }}</span>
              <span class="badge badge-soft badge-sm">{{ item.count }}</span>
            </div>
            <div v-if="!(analytics?.topLocations || []).length" class="rounded-2xl bg-base-200/50 px-4 py-6 text-center text-sm text-base-content/40">No location data yet</div>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 border border-base-300 xl:col-span-2">
        <div class="card-body">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h2 class="font-semibold text-base-content">Device Mix</h2>
              <p class="text-xs text-base-content/45 mt-1">Share of visits by device category</p>
            </div>
            <span class="badge badge-soft badge-sm">Last 7 days</span>
          </div>

          <div class="mt-5 space-y-4">
            <div v-for="item in analytics?.topDevices || []" :key="`device-${item.label}`">
              <div class="flex items-center justify-between text-sm mb-2">
                <span class="font-medium">{{ item.label }}</span>
                <span class="text-base-content/50">{{ item.count }} visits</span>
              </div>
              <div class="h-3 rounded-full bg-base-200 overflow-hidden">
                <div class="h-full rounded-full bg-secondary" :style="{ width: `${deviceShare(item.count)}%` }" />
              </div>
            </div>
            <div v-if="!(analytics?.topDevices || []).length" class="rounded-2xl bg-base-200/50 px-4 py-6 text-center text-sm text-base-content/40">No device data yet</div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-6">
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body">
          <h2 class="font-semibold text-base-content">Top Pages</h2>
          <div class="mt-4 space-y-3">
            <div v-for="item in analytics?.topPages || []" :key="`page-${item.label}`" class="flex items-center justify-between gap-4 rounded-2xl bg-base-200/50 px-4 py-3">
              <span class="text-sm font-medium truncate">{{ item.label }}</span>
              <span class="badge badge-soft badge-sm shrink-0">{{ item.count }}</span>
            </div>
            <div v-if="!(analytics?.topPages || []).length" class="rounded-2xl bg-base-200/50 px-4 py-6 text-center text-sm text-base-content/40">No pageview data yet</div>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 border border-base-300">
        <div class="card-body p-0">
          <div class="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 class="font-semibold text-base-content">Recent Visits</h2>
            <span class="text-xs text-base-content/40">Latest 20 visits</span>
          </div>
          <div class="overflow-x-auto">
            <table class="table table-sm">
              <thead>
                <tr class="text-xs uppercase text-base-content/40">
                  <th>Path</th>
                  <th>Location</th>
                  <th>IP Address</th>
                  <th>Device</th>
                  <th>Browser</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="visit in analytics?.recentVisits || []" :key="visit.id" class="hover">
                  <td>
                    <div class="max-w-xs">
                      <p class="text-sm font-medium truncate">{{ visit.path }}</p>
                      <p v-if="visit.referrer" class="text-xs text-base-content/40 truncate mt-0.5">{{ visit.referrer }}</p>
                    </div>
                  </td>
                  <td class="text-xs text-base-content/60">{{ formatLocation(visit) }}</td>
                  <td class="text-xs font-mono text-base-content/55 whitespace-nowrap">{{ visit.ipAddress || 'Hidden' }}</td>
                  <td class="text-xs">{{ visit.deviceType }}</td>
                  <td class="text-xs">{{ visit.browser || 'Unknown' }} / {{ visit.os || 'Unknown' }}</td>
                  <td class="text-xs text-base-content/45 whitespace-nowrap">{{ formatAdminDateTime(visit.createdAt) }}</td>
                </tr>
                <tr v-if="!(analytics?.recentVisits || []).length">
                  <td colspan="6" class="text-center py-10 text-sm text-base-content/40">No visits tracked yet</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconEye } from '@tabler/icons-vue'
import { useAdminDateFormat } from '~/composables/useAdminDateFormat'
import type { AnalyticsRecentVisit, AnalyticsSummary } from '~/types'

definePageMeta({ layout: 'default' })

const { data: analytics } = await useFetch<AnalyticsSummary>('/api/analytics')
const { formatAdminDateTime } = useAdminDateFormat()

const peakDay = computed(() => {
  const days = analytics.value?.dailyViews || []
  return days.reduce((best, current) => current.count > best.count ? current : best, days[0] || { label: 'No data', count: 0 })
})

const averageDailyViews = computed(() => {
  const days = analytics.value?.dailyViews || []
  if (!days.length) {
    return 0
  }

  return Math.round(days.reduce((total, item) => total + item.count, 0) / days.length)
})

const chartPlot = computed(() => {
  const days = analytics.value?.dailyViews || []
  const width = 564
  const startX = 48
  const endX = 612
  const startY = 200
  const endY = 24
  const maxCount = Math.max(...days.map(item => item.count), 1)

  return days.map((item, index) => ({
    ...item,
    x: startX + (days.length <= 1 ? width / 2 : (width / (days.length - 1)) * index),
    y: startY - ((startY - endY) * item.count) / maxCount,
  }))
})

const chartPoints = computed(() => chartPlot.value.map(point => `${point.x},${point.y}`).join(' '))

const recentIpLocations = computed(() => {
  const visits = analytics.value?.recentVisits || []
  const grouped = new Map<string, {
    ipAddress: string
    location: string
    deviceType: string
    browser: string
    count: number
    createdAt: string
  }>()

  for (const visit of visits) {
    const ipAddress = visit.ipAddress || 'Hidden'
    const location = formatLocation(visit)
    const key = `${ipAddress}-${location}`
    const existing = grouped.get(key)

    if (existing) {
      existing.count += 1
      if (new Date(visit.createdAt) > new Date(existing.createdAt)) {
        existing.createdAt = visit.createdAt
        existing.deviceType = visit.deviceType
        existing.browser = visit.browser || 'Unknown'
      }
      continue
    }

    grouped.set(key, {
      ipAddress,
      location,
      deviceType: visit.deviceType,
      browser: visit.browser || 'Unknown',
      count: 1,
      createdAt: visit.createdAt,
    })
  }

  return Array.from(grouped.values())
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .slice(0, 6)
})

function deviceShare(count: number) {
  const total = (analytics.value?.topDevices || []).reduce((sum, item) => sum + item.count, 0)
  if (!total) {
    return 0
  }

  return Math.max(6, Math.round((count / total) * 100))
}

function formatLocation(visit: AnalyticsRecentVisit) {
  return [visit.city, visit.region, visit.country].filter(Boolean).join(', ') || 'Unknown'
}
</script>
