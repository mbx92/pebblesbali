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
              <IconHome v-else class="w-5 h-5 text-secondary" />
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
              <IconBed v-else class="w-5 h-5 text-accent" />
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
              <p class="text-xs font-semibold uppercase tracking-wide text-primary-content/60">Blog Posts</p>
              <p class="text-2xl font-bold mt-1">{{ blogPosts?.length || 0 }}</p>
            </div>
            <div class="bg-white/15 rounded-lg p-3">
              <IconArticle class="w-5 h-5" />
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

    <div v-else class="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] gap-6">
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
  </div>
</template>

<script setup lang="ts">
import {
  IconLayoutList,
  IconCategory,
  IconDiamond,
  IconHome,
  IconBed,
  IconQuote,
  IconArticle,
  IconEye,
  IconLayoutGrid,
  IconSettings,
} from '@tabler/icons-vue'
import { useTemplate } from '~/composables/useTemplate'
import type { Section, Collection, Product, Testimonial, BlogPost } from '~/types'

const { data: sections } = await useFetch<Section[]>('/api/sections')
const { data: collections } = await useFetch<Collection[]>('/api/collections')
const { data: products } = await useFetch<Product[]>('/api/products')
const { data: testimonials } = await useFetch<Testimonial[]>('/api/testimonials')
const { data: blogPosts } = await useFetch<BlogPost[]>('/api/blog')
const { data: settings } = await useFetch<Record<string, string>>('/api/settings', {
  key: 'site-settings',
})

const { businessType, template } = useTemplate(settings)
const plan = usePlan()

const recentProducts = computed(() => (products.value || []).slice(0, 5))
const guesthouseSections = computed(() => {
  const guesthouseSlugs = new Set(['hero', 'rooms', 'amenities', 'gallery', 'location', 'testimonials', 'booking'])
  return (sections.value || []).filter(section => guesthouseSlugs.has(section.slug)).sort((left, right) => left.sortOrder - right.sortOrder)
})

const dashboardSubtitle = computed(() => businessType.value === 'guesthouse'
  ? 'Overview of guesthouse sections, booking content, and guest-facing assets'
  : 'Landing page content overview')

const secondaryStatLabel = computed(() => businessType.value === 'guesthouse' ? 'Room Sections' : 'Collections')
const secondaryStatValue = computed(() => businessType.value === 'guesthouse' ? guesthouseSections.value.length : (collections.value?.length || 0))
const tertiaryStatLabel = computed(() => businessType.value === 'guesthouse' ? 'Booking Status' : 'Products')
const tertiaryStatValue = computed(() => {
  if (businessType.value === 'guesthouse') {
    return guesthouseSections.value.some(section => section.slug === 'booking' && section.isActive) ? 'Ready' : 'Draft'
  }

  return products.value?.length || 0
})

const { formatCurrency } = useFormatCurrency()
</script>
