<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-base-content">Occupancy</h1>
        <p class="mt-1 text-sm text-base-content/50">Operational calendar for room usage, blocked dates, and bookings that still need unit assignment.</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <NuxtLink to="/admin/rooms" class="btn btn-sm btn-ghost">Manage Rooms</NuxtLink>
        <NuxtLink v-if="bookingEngineEnabled" to="/admin/bookings" class="btn btn-sm btn-primary">Open Bookings</NuxtLink>
      </div>
    </div>

    <GuesthouseOccupancyPanel />
  </div>
</template>

<script setup lang="ts">
import GuesthouseOccupancyPanel from '~/components/admin/GuesthouseOccupancyPanel.vue'
import { isFeatureEnabled } from '~/composables/usePlan'

const { data: settings } = await useFetch<Record<string, string>>('/api/settings', {
  key: 'site-settings',
})
const { businessType } = useTemplate(settings)

if (businessType.value !== 'guesthouse') {
  await navigateTo('/admin', { replace: true })
}

if (!isFeatureEnabled(settings.value, 'roomInventory')) {
  await navigateTo('/admin/settings', { replace: true })
}

const bookingEngineEnabled = computed(() => isFeatureEnabled(settings.value, 'bookingEngine'))
</script>