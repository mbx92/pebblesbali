<template>
  <div>
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-base-content">Dashboard</h1>
        <p class="text-sm text-base-content/50 mt-1">{{ dashboardSubtitle }}</p>
      </div>
      <div class="mt-3 flex flex-wrap gap-2 sm:mt-0 sm:justify-end">
        <NuxtLink
          to="/admin/templates"
          class="btn btn-sm btn-outline gap-2"
        >
          <IconLayoutGrid class="w-4 h-4" />
          Template Library
        </NuxtLink>
        <NuxtLink
          to="/"
          target="_blank"
          class="btn btn-sm btn-outline gap-2"
        >
          <IconEye class="w-4 h-4" />
          Live Preview
        </NuxtLink>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-base-content/40">Sections</p>
              <p class="text-2xl font-bold mt-1">{{ sections?.length || 0 }}</p>
            </div>
            <div class="bg-primary/10 rounded-lg p-3">
              <IconLayoutList class="w-5 h-5 text-primary" />
            </div>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 border border-base-300">
        <div class="card-body p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-base-content/40">{{ secondaryStatLabel }}</p>
              <p class="text-2xl font-bold mt-1">{{ secondaryStatValue }}</p>
            </div>
            <div class="bg-secondary/10 rounded-lg p-3">
              <IconCategory v-if="businessType === 'jewelry'" class="w-5 h-5 text-secondary" />
              <IconHome v-else-if="businessType === 'guesthouse'" class="w-5 h-5 text-secondary" />
              <IconShieldHalfFilled v-else class="w-5 h-5 text-secondary" />
            </div>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 border border-base-300">
        <div class="card-body p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-base-content/40">{{ tertiaryStatLabel }}</p>
              <p class="text-2xl font-bold mt-1">{{ tertiaryStatValue }}</p>
            </div>
            <div class="bg-accent/10 rounded-lg p-3">
              <IconDiamond v-if="businessType === 'jewelry'" class="w-5 h-5 text-accent" />
              <IconBed v-else-if="businessType === 'guesthouse'" class="w-5 h-5 text-accent" />
              <IconSettings v-else class="w-5 h-5 text-accent" />
            </div>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 border border-base-300">
        <div class="card-body p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-base-content/40">Testimonials</p>
              <p class="text-2xl font-bold mt-1">{{ testimonials?.length || 0 }}</p>
            </div>
            <div class="bg-primary/10 rounded-lg p-3">
              <IconQuote class="w-5 h-5 text-primary" />
            </div>
          </div>
        </div>
      </div>

      <div class="card bg-primary text-primary-content">
        <div class="card-body p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-primary-content/60">{{ quaternaryStatLabel }}</p>
              <p class="text-2xl font-bold mt-1">{{ quaternaryStatValue }}</p>
            </div>
            <div class="bg-white/15 rounded-lg p-3">
              <IconArticle v-if="businessType !== 'cctv'" class="w-5 h-5" />
              <IconPhoneCall v-else class="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] gap-6 mb-6">
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body p-5">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h2 class="font-semibold text-base-content">Audience Snapshot</h2>
              <p class="text-xs text-base-content/45 mt-1">7-day traffic, top location, and device mix</p>
            </div>
            <NuxtLink to="/admin/analytics" class="btn btn-ghost btn-xs text-primary">View Analytics</NuxtLink>
          </div>

          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
            <div class="rounded-2xl border border-base-300 bg-base-200/50 p-4">
              <p class="text-[11px] font-semibold uppercase tracking-wide text-base-content/45">Views 7D</p>
              <p class="text-2xl font-bold mt-2">{{ analytics?.viewsLast7Days || 0 }}</p>
            </div>
            <div class="rounded-2xl border border-base-300 bg-base-200/50 p-4">
              <p class="text-[11px] font-semibold uppercase tracking-wide text-base-content/45">Visitors 7D</p>
              <p class="text-2xl font-bold mt-2">{{ analytics?.uniqueVisitorsLast7Days || 0 }}</p>
            </div>
            <div class="rounded-2xl border border-base-300 bg-base-200/50 p-4">
              <p class="text-[11px] font-semibold uppercase tracking-wide text-base-content/45">Top Location</p>
              <p class="text-sm font-semibold mt-2">{{ analytics?.topLocations?.[0]?.label || 'No data' }}</p>
              <p class="text-xs text-base-content/45 mt-1">{{ analytics?.topLocations?.[0]?.count || 0 }} visits</p>
            </div>
            <div class="rounded-2xl border border-base-300 bg-base-200/50 p-4">
              <p class="text-[11px] font-semibold uppercase tracking-wide text-base-content/45">Top Device</p>
              <p class="text-sm font-semibold mt-2">{{ analytics?.topDevices?.[0]?.label || 'No data' }}</p>
              <p class="text-xs text-base-content/45 mt-1">{{ analytics?.topDevices?.[0]?.count || 0 }} visits</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 border border-base-300">
        <div class="card-body p-5">
          <h2 class="font-semibold text-base-content">Recent Visitors</h2>
          <div class="mt-4 space-y-3">
            <div v-for="visit in recentAnalyticsVisits" :key="visit.id" class="flex items-start justify-between gap-3 rounded-2xl bg-base-200/50 px-4 py-3">
              <div class="min-w-0">
                <p class="text-sm font-medium truncate">{{ visit.path }}</p>
                <p class="text-xs text-base-content/45 mt-1 truncate">{{ formatVisitLocation(visit) }} · {{ visit.deviceType }}</p>
              </div>
              <span class="text-[11px] text-base-content/40 whitespace-nowrap">{{ formatAdminDateTime(visit.createdAt) }}</span>
            </div>
            <div v-if="!recentAnalyticsVisits.length" class="rounded-2xl bg-base-200/50 px-4 py-6 text-center text-sm text-base-content/40">
              No visitor data yet
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Grid -->
    <div v-if="businessType === 'jewelry'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Products -->
      <div class="lg:col-span-2">
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body p-0">
            <div class="flex items-center justify-between px-5 pt-5 pb-3">
              <h2 class="font-semibold text-base-content">Recent Products</h2>
              <NuxtLink to="/admin/products" class="btn btn-ghost btn-xs text-primary">View All</NuxtLink>
            </div>
            <div class="overflow-x-auto">
              <table class="table">
                <thead>
                  <tr class="text-xs uppercase text-base-content/40">
                    <th>Product</th>
                    <th>Collection</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="p in recentProducts" :key="p.id" class="hover">
                    <td>
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-base-200 rounded overflow-hidden shrink-0">
                          <img v-if="p.image" :src="p.image" :alt="p.name" class="w-full h-full object-cover" />
                          <div v-else class="w-full h-full flex items-center justify-center">
                            <IconDiamond class="w-4 h-4 text-base-content/20" />
                          </div>
                        </div>
                        <span class="text-sm font-medium">{{ p.name }}</span>
                      </div>
                    </td>
                    <td><span class="badge badge-soft badge-sm">{{ p.collection?.name || '-' }}</span></td>
                    <td class="text-sm font-mono">{{ formatCurrency(p.price) }}</td>
                    <td>
                      <span class="badge badge-soft badge-sm" :class="p.isActive ? 'badge-success' : 'badge-error'">
                        {{ p.isActive ? 'Active' : 'Draft' }}
                      </span>
                    </td>
                  </tr>
                  <tr v-if="recentProducts.length === 0">
                    <td colspan="4" class="text-center py-10">
                      <div class="flex flex-col items-center text-base-content/30">
                        <IconDiamond class="w-10 h-10 mb-2" />
                        <p class="text-sm">No products yet</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Collections Sidebar -->
      <div>
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body p-0">
            <div class="flex items-center justify-between px-5 pt-5 pb-3">
              <h2 class="font-semibold text-base-content">Collections</h2>
              <NuxtLink to="/admin/collections" class="btn btn-ghost btn-xs text-primary">Manage</NuxtLink>
            </div>
            <div class="divide-y divide-base-200">
              <div v-for="col in (collections || [])" :key="col.id" class="flex items-center justify-between px-5 py-3">
                <div class="flex items-center gap-3 overflow-hidden pr-4">
                  <div class="bg-secondary/10 rounded-lg p-2 shrink-0">
                    <IconCategory class="w-4 h-4 text-secondary" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-medium truncate">{{ col.name }}</p>
                    <p class="text-xs text-base-content/40">{{ col._count?.products || 0 }} products</p>
                  </div>
                </div>
                <span class="badge badge-soft badge-sm" :class="col.isActive ? 'badge-success' : 'badge-error'">
                  {{ col.isActive ? 'Active' : 'Draft' }}
                </span>
              </div>
              <div v-if="(collections || []).length === 0" class="px-5 py-8 text-center">
                <div class="flex flex-col items-center text-base-content/30">
                  <IconCategory class="w-8 h-8 mb-2" />
                  <p class="text-sm">No collections yet</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="businessType === 'guesthouse'" class="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] gap-6">
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body p-0">
          <div class="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 class="font-semibold text-base-content">Room-Rent Sections</h2>
            <NuxtLink to="/admin/sections" class="btn btn-ghost btn-xs text-primary">Manage Sections</NuxtLink>
          </div>
          <div class="overflow-x-auto">
            <table class="table">
              <thead>
                <tr class="text-xs uppercase text-base-content/40">
                  <th>Section</th>
                  <th>Slug</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="section in guesthouseSections" :key="section.id" class="hover">
                  <td>
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                        <IconHome class="w-4 h-4" />
                      </div>
                      <div>
                        <p class="text-sm font-medium">{{ section.title || section.slug }}</p>
                        <p class="text-xs text-base-content/40">{{ section.subtitle || 'No subtitle yet' }}</p>
                      </div>
                    </div>
                  </td>
                  <td><span class="badge badge-soft badge-sm">/{{ section.slug }}</span></td>
                  <td>
                    <span class="badge badge-soft badge-sm" :class="section.isActive ? 'badge-success' : 'badge-error'">
                      {{ section.isActive ? 'Active' : 'Draft' }}
                    </span>
                  </td>
                </tr>
                <tr v-if="guesthouseSections.length === 0">
                  <td colspan="3" class="text-center py-10">
                    <div class="flex flex-col items-center text-base-content/30">
                      <IconHome class="w-10 h-10 mb-2" />
                      <p class="text-sm">No guesthouse sections yet</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body">
            <h2 class="font-semibold text-base-content">Current Setup</h2>
            <div class="space-y-3 mt-2 text-sm">
              <div class="rounded-xl bg-base-200/60 px-4 py-3">
                <p class="text-xs uppercase tracking-wide text-base-content/40">Business Type</p>
                <p class="mt-1 font-medium">Room Rent / Guesthouse</p>
              </div>
              <div class="rounded-xl bg-base-200/60 px-4 py-3">
                <p class="text-xs uppercase tracking-wide text-base-content/40">Template</p>
                <p class="mt-1 font-medium">{{ template.label }}</p>
              </div>
              <div class="rounded-xl bg-base-200/60 px-4 py-3">
                <p class="text-xs uppercase tracking-wide text-base-content/40">Booking Flow</p>
                <p class="mt-1 font-medium">Direct inquiry via WhatsApp / email</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 border border-base-300">
          <div class="card-body">
            <h2 class="font-semibold text-base-content">Recommended Next Steps</h2>
            <div class="mt-3 space-y-2">
              <NuxtLink to="/admin/sections" class="btn btn-sm btn-outline justify-start gap-2 w-full">
                <IconLayoutList class="w-4 h-4" /> Edit rooms, amenities, gallery
              </NuxtLink>
              <NuxtLink v-if="plan.hasFeature('roomInventory')" to="/admin/occupancy" class="btn btn-sm btn-outline justify-start gap-2 w-full">
                <IconEye class="w-4 h-4" /> Review occupancy and unit assignment
              </NuxtLink>
              <NuxtLink v-if="plan.hasFeature('mediaLibrary')" to="/admin/media" class="btn btn-sm btn-outline justify-start gap-2 w-full">
                <IconEye class="w-4 h-4" /> Upload room and property photos
              </NuxtLink>
              <NuxtLink to="/admin/settings" class="btn btn-sm btn-outline justify-start gap-2 w-full">
                <IconSettings class="w-4 h-4" /> Update contact and booking CTA
              </NuxtLink>
              <NuxtLink v-if="plan.hasFeature('testimonials')" to="/admin/testimonials" class="btn btn-sm btn-outline justify-start gap-2 w-full">
                <IconQuote class="w-4 h-4" /> Add guest reviews
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] gap-6">
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body p-0">
          <div class="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 class="font-semibold text-base-content">Service Sections</h2>
            <NuxtLink to="/admin/sections" class="btn btn-ghost btn-xs text-primary">Manage Sections</NuxtLink>
          </div>
          <div class="overflow-x-auto">
            <table class="table">
              <thead>
                <tr class="text-xs uppercase text-base-content/40">
                  <th>Section</th>
                  <th>Slug</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="section in cctvSections" :key="section.id" class="hover">
                  <td>
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                        <IconShieldHalfFilled class="w-4 h-4" />
                      </div>
                      <div>
                        <p class="text-sm font-medium">{{ section.title || section.slug }}</p>
                        <p class="text-xs text-base-content/40">{{ section.subtitle || 'No subtitle yet' }}</p>
                      </div>
                    </div>
                  </td>
                  <td><span class="badge badge-soft badge-sm">/{{ section.slug }}</span></td>
                  <td>
                    <span class="badge badge-soft badge-sm" :class="section.isActive ? 'badge-success' : 'badge-error'">
                      {{ section.isActive ? 'Active' : 'Draft' }}
                    </span>
                  </td>
                </tr>
                <tr v-if="cctvSections.length === 0">
                  <td colspan="3" class="text-center py-10">
                    <div class="flex flex-col items-center text-base-content/30">
                      <IconShieldHalfFilled class="w-10 h-10 mb-2" />
                      <p class="text-sm">No service sections yet</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body">
            <h2 class="font-semibold text-base-content">Current Setup</h2>
            <div class="space-y-3 mt-2 text-sm">
              <div class="rounded-xl bg-base-200/60 px-4 py-3">
                <p class="text-xs uppercase tracking-wide text-base-content/40">Business Type</p>
                <p class="mt-1 font-medium">CCTV &amp; Networking</p>
              </div>
              <div class="rounded-xl bg-base-200/60 px-4 py-3">
                <p class="text-xs uppercase tracking-wide text-base-content/40">Template</p>
                <p class="mt-1 font-medium">{{ template.label }}</p>
              </div>
              <div class="rounded-xl bg-base-200/60 px-4 py-3">
                <p class="text-xs uppercase tracking-wide text-base-content/40">Lead Flow</p>
                <p class="mt-1 font-medium">Direct survey request via WhatsApp / email</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 border border-base-300">
          <div class="card-body">
            <h2 class="font-semibold text-base-content">Recommended Next Steps</h2>
            <div class="mt-3 space-y-2">
              <NuxtLink to="/admin/sections" class="btn btn-sm btn-outline justify-start gap-2 w-full">
                <IconLayoutList class="w-4 h-4" /> Edit services, coverage, and contact flow
              </NuxtLink>
              <NuxtLink v-if="plan.hasFeature('mediaLibrary')" to="/admin/media" class="btn btn-sm btn-outline justify-start gap-2 w-full">
                <IconEye class="w-4 h-4" /> Upload project and installation photos
              </NuxtLink>
              <NuxtLink to="/admin/settings" class="btn btn-sm btn-outline justify-start gap-2 w-full">
                <IconSettings class="w-4 h-4" /> Update contact details and survey CTA
              </NuxtLink>
              <NuxtLink v-if="plan.hasFeature('testimonials')" to="/admin/testimonials" class="btn btn-sm btn-outline justify-start gap-2 w-full">
                <IconQuote class="w-4 h-4" /> Add client reviews
              </NuxtLink>
              <NuxtLink to="/admin/templates" class="btn btn-sm btn-outline justify-start gap-2 w-full">
                <IconLayoutGrid class="w-4 h-4" /> Review service template options
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IconLayoutList,
  IconCategory,
  IconDiamond,
  IconHome,
  IconBed,
  IconShieldHalfFilled,
  IconQuote,
  IconArticle,
  IconPhoneCall,
  IconEye,
  IconLayoutGrid,
  IconSettings,
  IconChartBar,
} from '@tabler/icons-vue'
import { useTemplate } from '~/composables/useTemplate'
import { useAdminDateFormat } from '~/composables/useAdminDateFormat'
import type { Section, Collection, Product, Testimonial, BlogPost, AnalyticsSummary, AnalyticsRecentVisit } from '~/types'

const { data: sections } = await useFetch<Section[]>('/api/sections')
const { data: collections } = await useFetch<Collection[]>('/api/collections')
const { data: products } = await useFetch<Product[]>('/api/products')
const { data: testimonials } = await useFetch<Testimonial[]>('/api/testimonials')
const { data: blogPosts } = await useFetch<BlogPost[]>('/api/blog')
const { data: analytics } = await useFetch<AnalyticsSummary>('/api/analytics')
const { data: settings } = await useFetch<Record<string, string>>('/api/settings', {
  key: 'site-settings',
})

const { businessType, template } = useTemplate(settings)
const plan = usePlan()
const { formatAdminDateTime } = useAdminDateFormat()

const recentProducts = computed(() => (products.value || []).slice(0, 5))
const recentAnalyticsVisits = computed<AnalyticsRecentVisit[]>(() => (analytics.value?.recentVisits || []).slice(0, 5))
const guesthouseSections = computed(() => {
  const guesthouseSlugs = new Set(['hero', 'rooms', 'amenities', 'gallery', 'location', 'testimonials', 'booking'])
  return (sections.value || []).filter(section => guesthouseSlugs.has(section.slug)).sort((left, right) => left.sortOrder - right.sortOrder)
})
const cctvSections = computed(() => {
  const cctvSlugs = new Set(['hero', 'services', 'solutions', 'projects', 'coverage', 'testimonials', 'contact'])
  return (sections.value || []).filter(section => cctvSlugs.has(section.slug)).sort((left, right) => left.sortOrder - right.sortOrder)
})

const dashboardSubtitle = computed(() => {
  if (businessType.value === 'guesthouse') {
    return 'Overview of guesthouse sections, booking content, and guest-facing assets'
  }

  if (businessType.value === 'cctv') {
    return 'Overview of service sections, survey contact flow, and client-facing assets'
  }

  return 'Landing page content overview'
})

const secondaryStatLabel = computed(() => {
  if (businessType.value === 'guesthouse') return 'Room Sections'
  if (businessType.value === 'cctv') return 'Service Sections'
  return 'Collections'
})
const secondaryStatValue = computed(() => {
  if (businessType.value === 'guesthouse') return guesthouseSections.value.length
  if (businessType.value === 'cctv') return cctvSections.value.length
  return collections.value?.length || 0
})
const tertiaryStatLabel = computed(() => {
  if (businessType.value === 'guesthouse') return 'Booking Status'
  if (businessType.value === 'cctv') return 'Survey Flow'
  return 'Products'
})
const tertiaryStatValue = computed(() => {
  if (businessType.value === 'guesthouse') {
    return guesthouseSections.value.some(section => section.slug === 'booking' && section.isActive) ? 'Ready' : 'Draft'
  }

  if (businessType.value === 'cctv') {
    return cctvSections.value.some(section => section.slug === 'contact' && section.isActive) ? 'Ready' : 'Draft'
  }

  return products.value?.length || 0
})

const quaternaryStatLabel = computed(() => businessType.value === 'cctv' ? 'Contact Flow' : 'Blog Posts')
const quaternaryStatValue = computed(() => {
  if (businessType.value === 'cctv') {
    return settings.value?.whatsappNumber || settings.value?.contactEmail ? 'Connected' : 'Setup'
  }

  return blogPosts.value?.length || 0
})

function formatVisitLocation(visit: AnalyticsRecentVisit) {
  return [visit.city, visit.region, visit.country].filter(Boolean).join(', ') || 'Unknown'
}

const { formatCurrency } = useFormatCurrency()
</script>
