<template>
  <div class="min-h-screen bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-base-100)_90%,white),color-mix(in_oklab,var(--color-secondary)_10%,white))]" :data-theme="template.themeName">
    <AdminPreviewBar />

    <nav :class="['fixed z-50 w-full border-b border-base-200 bg-base-100/90 backdrop-blur-md transition-[top] duration-300', useAdminBar().value ? 'top-9' : 'top-0']">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <NuxtLink to="/" class="flex items-center gap-3">
          <img v-if="settings?.logoUrl" :src="settings.logoUrl" :alt="siteName" class="h-9 w-auto max-w-40 object-contain" />
          <span v-else class="text-lg font-semibold tracking-tight text-primary">{{ siteName }}</span>
        </NuxtLink>
        <div class="flex items-center gap-3">
          <NuxtLink to="/book" class="btn btn-sm btn-ghost">Back to Booking</NuxtLink>
        </div>
      </div>
    </nav>

    <div class="mx-auto max-w-6xl px-6 pb-16 pt-28 lg:px-8">
      <div class="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(22rem,1.1fr)] lg:items-start">
        <section class="rounded-4xl border border-base-300 bg-base-100 p-8 shadow-[0_24px_80px_color-mix(in_oklab,var(--color-neutral)_12%,transparent)]">
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">Booking Status</p>
          <h1 class="mt-4 font-serif text-4xl text-primary md:text-5xl">Check your booking manually</h1>
          <p class="mt-4 max-w-2xl text-base-content/70 md:text-lg">Use email only to find your bookings, or add a reference code if you want to jump straight into one specific booking.</p>

          <form class="mt-8 grid gap-4" @submit.prevent="lookupBooking()">
            <fieldset class="fieldset">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Reference Code</legend>
              <input v-model="lookupForm.referenceCode" type="text" class="input w-full font-mono uppercase" placeholder="Optional: BK-XXXXXX" />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Email</legend>
              <input v-model="lookupForm.guestEmail" type="email" class="input w-full" required />
            </fieldset>
            <div class="flex items-center gap-3 pt-2">
              <button type="submit" class="btn btn-primary" :disabled="loading">{{ loading ? 'Checking...' : 'Check Status' }}</button>
              <p v-if="lookupError" class="text-sm text-error">{{ lookupError }}</p>
            </div>
          </form>

          <div class="mt-8 rounded-3xl bg-base-200/60 p-5 text-sm text-base-content/68">
            <p class="font-medium text-base-content">How this works</p>
            <ul class="mt-3 space-y-2 leading-7">
              <li>We do not send automatic confirmation yet.</li>
              <li>This page lets guests check whether the booking is still pending or already confirmed by the host.</li>
              <li>Email only will show all bookings under that email.</li>
              <li>If a room unit has been assigned by admin later, it will also appear here.</li>
            </ul>
          </div>
        </section>

        <section class="rounded-4xl border border-base-300 bg-base-100 p-8 shadow-[0_24px_80px_color-mix(in_oklab,var(--color-neutral)_12%,transparent)]">
          <div v-if="bookingList.length && !booking" class="space-y-4">
            <div class="border-b border-base-200 pb-5">
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-base-content/45">Matching Bookings</p>
              <p class="mt-2 text-sm text-base-content/68">Select a booking below to view its current status and room assignment.</p>
              <div class="mt-4 flex flex-wrap gap-2">
                <button
                  v-for="filter in BOOKING_LIST_FILTERS"
                  :key="filter.value"
                  class="badge badge-sm cursor-pointer transition-all"
                  :class="bookingListFilter === filter.value ? 'badge-primary' : 'badge-ghost hover:badge-neutral'"
                  @click="bookingListFilter = filter.value"
                >
                  {{ filter.label }}
                </button>
              </div>
            </div>

            <button
              v-for="item in filteredBookingList"
              :key="item.id"
              class="w-full rounded-3xl border px-5 py-4 text-left transition"
              :class="selectedReferenceCode === item.referenceCode ? 'border-secondary bg-base-200/30 ring-1 ring-secondary/25' : 'border-base-200 hover:border-secondary hover:bg-base-200/30'"
              @click="selectBooking(item.referenceCode)"
            >
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p class="font-mono text-sm text-base-content">{{ item.referenceCode }}</p>
                  <p class="mt-1 text-sm text-base-content/65">{{ item.property?.name || siteName }}</p>
                  <p class="mt-1 text-xs text-base-content/48">{{ formatStay(item.checkInDate, item.checkOutDate) }} · {{ item.totalNights }} night{{ item.totalNights !== 1 ? 's' : '' }}</p>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span class="badge badge-soft" :class="statusBadge(item.status)">{{ statusLabel(item.status) }}</span>
                  <span class="badge badge-soft" :class="paymentBadge(item.paymentStatus)">{{ paymentLabel(item.paymentStatus) }}</span>
                </div>
              </div>
              <div class="mt-3 flex items-center justify-between text-sm">
                <span class="text-base-content/55">Total {{ formatCurrency(item.totalAmount) }}</span>
                <span class="btn btn-ghost btn-xs text-secondary">Use this booking</span>
              </div>
            </button>

            <div v-if="!filteredBookingList.length" class="rounded-3xl border border-dashed border-base-300 px-6 py-10 text-center text-sm text-base-content/45">
              No bookings match the selected filter.
            </div>
          </div>

          <div v-if="booking" class="space-y-6">
            <div class="flex flex-wrap items-start justify-between gap-4 border-b border-base-200 pb-5">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-base-content/45">Reference</p>
                <p class="mt-2 font-mono text-sm text-base-content">{{ booking.referenceCode }}</p>
                <p class="mt-2 text-sm text-base-content/60">{{ booking.property?.name || siteName }}</p>
              </div>
              <div class="flex flex-wrap gap-2">
                <span class="badge badge-soft" :class="statusBadge(booking.status)">{{ statusLabel(booking.status) }}</span>
                <span class="badge badge-soft" :class="paymentBadge(booking.paymentStatus)">{{ paymentLabel(booking.paymentStatus) }}</span>
              </div>
            </div>

            <div class="grid gap-5 md:grid-cols-2">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-base-content/45">Stay</p>
                <div class="mt-3 space-y-1 text-sm text-base-content/70">
                  <p>{{ formatStay(booking.checkInDate, booking.checkOutDate) }}</p>
                  <p>{{ booking.totalNights }} night{{ booking.totalNights !== 1 ? 's' : '' }}</p>
                  <p>Total {{ formatCurrency(booking.totalAmount) }}</p>
                </div>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-base-content/45">Guest</p>
                <div class="mt-3 space-y-1 text-sm text-base-content/70">
                  <p>{{ booking.guestFirstName }} {{ booking.guestLastName || '' }}</p>
                  <p>{{ booking.guestEmail }}</p>
                  <p>{{ booking.guestPhone || '-' }}</p>
                </div>
              </div>
            </div>

            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-base-content/45">Booked Rooms</p>
              <div class="mt-4 space-y-3">
                <div v-for="line in booking.bookingRooms" :key="line.id" class="rounded-3xl border border-base-200 px-4 py-4">
                  <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p class="font-medium text-base-content">{{ line.roomType?.name || 'Room' }}</p>
                      <p class="mt-1 text-sm text-base-content/55">{{ line.adults }} adult · {{ line.children }} child</p>
                    </div>
                    <p class="text-sm font-medium text-primary">{{ formatCurrency(line.lineTotal) }}</p>
                  </div>
                  <div class="mt-4 rounded-2xl bg-base-200/60 px-4 py-3 text-sm text-base-content/68">
                    <span v-if="line.roomUnit?.code">Assigned unit: <span class="font-medium text-base-content">{{ line.roomUnit.code }}</span></span>
                    <span v-else>Unit assignment is not available yet.</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-3xl border border-base-200 bg-base-200/40 p-5 text-sm text-base-content/68">
              <p class="font-medium text-base-content">Current handling</p>
              <p class="mt-2 leading-7">Booking confirmation is still reviewed manually by the host. If your status is still pending, please contact the property and mention your reference code.</p>
            </div>
          </div>

          <div v-else-if="!bookingList.length" class="flex min-h-96 items-center justify-center rounded-3xl border border-dashed border-base-300 px-8 py-12 text-center text-sm text-base-content/45">
            Enter your email to find bookings, or add a reference code to open one booking directly.
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GuesthouseBooking, GuesthouseBookingLookupItem, GuesthouseBookingLookupResponse } from '~/types'

const recentBookingLookup = useState<{ referenceCode: string; guestEmail: string }>('recent-booking-lookup', () => ({
  referenceCode: '',
  guestEmail: '',
}))

const route = useRoute()
definePageMeta({ layout: false, middleware: 'features' })

const { data: settings } = await useFetch<Record<string, string>>('/api/settings', {
  key: 'site-settings',
})

useTheme(settings)

const { businessType, template } = useTemplate(settings)
if (businessType.value !== 'guesthouse') {
  await navigateTo('/', { replace: true })
}

const siteName = computed(() => settings.value?.siteName || template.value.defaults.siteName)
const { formatCurrency } = useFormatCurrency()

const lookupForm = reactive({
  referenceCode: String(route.query.reference || recentBookingLookup.value.referenceCode || '').toUpperCase(),
  guestEmail: recentBookingLookup.value.guestEmail || '',
})

const booking = ref<GuesthouseBooking | null>(null)
const bookingList = ref<GuesthouseBookingLookupItem[]>([])
const loading = ref(false)
const lookupError = ref('')
const bookingListFilter = ref<'all' | 'pending' | 'confirmed'>('all')
const selectedReferenceCode = ref('')

const BOOKING_LIST_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
] as const

const filteredBookingList = computed(() => {
  if (bookingListFilter.value === 'all') {
    return bookingList.value
  }

  return bookingList.value.filter((item) => item.status === bookingListFilter.value)
})

function statusLabel(status: GuesthouseBooking['status']) {
  return {
    pending: 'Pending',
    confirmed: 'Confirmed',
    checked_in: 'Checked In',
    checked_out: 'Checked Out',
    cancelled: 'Cancelled',
    no_show: 'No Show',
  }[status] || status
}

function paymentLabel(status: GuesthouseBooking['paymentStatus']) {
  return {
    unpaid: 'Unpaid',
    partially_paid: 'Partial',
    paid: 'Paid',
    refunded: 'Refunded',
    voided: 'Voided',
  }[status] || status
}

function statusBadge(status: GuesthouseBooking['status']) {
  return {
    pending: 'badge-warning',
    confirmed: 'badge-info',
    checked_in: 'badge-primary',
    checked_out: 'badge-success',
    cancelled: 'badge-error',
    no_show: 'badge-ghost',
  }[status] || 'badge-ghost'
}

function paymentBadge(status: GuesthouseBooking['paymentStatus']) {
  return {
    unpaid: 'badge-warning',
    partially_paid: 'badge-info',
    paid: 'badge-success',
    refunded: 'badge-ghost',
    voided: 'badge-error',
  }[status] || 'badge-ghost'
}

function formatStay(checkIn: string, checkOut: string) {
  const start = new Date(checkIn).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
  const end = new Date(checkOut).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
  return `${start} → ${end}`
}

async function lookupBooking() {
  lookupError.value = ''
  booking.value = null
  bookingList.value = []
  selectedReferenceCode.value = lookupForm.referenceCode.trim().toUpperCase()

  try {
    loading.value = true
    recentBookingLookup.value = {
      referenceCode: lookupForm.referenceCode.trim().toUpperCase(),
      guestEmail: lookupForm.guestEmail.trim(),
    }
    const response = await $fetch<GuesthouseBookingLookupResponse>('/api/guesthouse/bookings/lookup', {
      method: 'POST',
      body: recentBookingLookup.value,
    })

    if (response.mode === 'single' && response.booking) {
      booking.value = response.booking
      bookingList.value = []
      selectedReferenceCode.value = response.booking.referenceCode
      return
    }

    bookingList.value = response.bookings || []
  } catch (error: any) {
    lookupError.value = error?.data?.statusMessage || 'Failed to load booking status'
  } finally {
    loading.value = false
  }
}

async function selectBooking(referenceCode: string) {
  selectedReferenceCode.value = referenceCode
  lookupForm.referenceCode = referenceCode
  await lookupBooking()
}

if (lookupForm.referenceCode && lookupForm.guestEmail) {
  await lookupBooking()
}

useSeoMeta({
  title: () => `Booking Status - ${siteName.value}`,
  description: () => 'Check your booking status manually using email only or reference code plus email.',
})
</script>