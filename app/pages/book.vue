<template>
  <div class="min-h-screen bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-base-100)_88%,white),color-mix(in_oklab,var(--color-secondary)_10%,white))]" :data-theme="template.themeName">
    <AdminPreviewBar />

    <nav :class="['fixed z-50 w-full bg-base-100/90 backdrop-blur-md border-b border-base-200 transition-[top] duration-300', useAdminBar().value ? 'top-9' : 'top-0']">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <NuxtLink to="/" class="flex items-center gap-3">
          <img v-if="settings?.logoUrl" :src="settings.logoUrl" :alt="siteName" class="h-9 w-auto max-w-40 object-contain" />
          <span v-else class="text-lg font-semibold tracking-tight text-primary">{{ siteName }}</span>
        </NuxtLink>
        <div class="flex items-center gap-3">
          <NuxtLink to="/booking-status" class="btn btn-sm btn-ghost">Check Booking Status</NuxtLink>
          <NuxtLink to="/" class="btn btn-sm btn-ghost">Back Home</NuxtLink>
        </div>
      </div>
    </nav>

    <div class="mx-auto max-w-6xl px-6 pt-28 pb-16 lg:px-8">
      <div class="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)] lg:items-start">
        <div class="space-y-6">
          <section class="rounded-4xl border border-base-300 bg-base-100 p-8 shadow-[0_24px_80px_color-mix(in_oklab,var(--color-neutral)_12%,transparent)]">
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">Direct Booking</p>
            <h1 class="mt-4 font-serif text-4xl text-primary md:text-5xl">Check availability and request your stay</h1>
            <p class="mt-4 max-w-2xl text-base-content/70 md:text-lg">Choose your dates, review featured room types, and send a direct booking request to the host.</p>

            <form class="mt-8 grid gap-4 md:grid-cols-2" @submit.prevent="checkAvailability()">
              <fieldset class="fieldset">
                <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Check-in</legend>
                <input v-model="searchForm.checkIn" type="date" class="input w-full" required />
              </fieldset>
              <fieldset class="fieldset">
                <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Check-out</legend>
                <input v-model="searchForm.checkOut" type="date" class="input w-full" required />
              </fieldset>
              <fieldset class="fieldset">
                <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Adults</legend>
                <input v-model.number="searchForm.adults" type="number" min="1" class="input w-full" required />
              </fieldset>
              <fieldset class="fieldset">
                <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Children</legend>
                <input v-model.number="searchForm.children" type="number" min="0" class="input w-full" />
              </fieldset>
              <div class="md:col-span-2 flex items-center gap-3">
                <button type="submit" class="btn btn-primary" :disabled="checkingAvailability">{{ checkingAvailability ? 'Checking...' : 'Check Availability' }}</button>
                <p v-if="availabilityError" class="text-sm text-error">{{ availabilityError }}</p>
              </div>
            </form>
          </section>

          <section class="rounded-4xl border border-base-300 bg-base-100 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
            <div class="flex items-center justify-between gap-4">
              <div>
                <h2 class="font-semibold text-base-content">Featured Room Types</h2>
                <p class="mt-1 text-sm text-base-content/50">These are the room types currently promoted on the guesthouse landing page.</p>
              </div>
              <span class="badge badge-soft badge-secondary">{{ displayRoomTypes.length }} options</span>
            </div>

            <div class="mt-6 space-y-4">
              <article v-for="room in displayRoomTypes" :key="room.id" class="overflow-hidden rounded-3xl border border-base-300 bg-base-100">
                <div class="grid gap-0 md:grid-cols-[12rem_minmax(0,1fr)]">
                  <div class="aspect-4/3 bg-base-200 md:aspect-auto">
                    <img v-if="room.imageUrl" :src="room.imageUrl" :alt="room.name" class="h-full w-full object-cover" />
                    <div v-else class="flex h-full items-center justify-center text-sm uppercase tracking-[0.24em] text-base-content/30">Room Photo</div>
                  </div>
                  <div class="p-5">
                    <div class="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div class="flex items-center gap-2 flex-wrap">
                          <h3 class="font-serif text-2xl text-primary">{{ room.name }}</h3>
                          <span class="badge badge-soft badge-secondary">Featured</span>
                          <span v-if="room.availability" class="badge badge-soft" :class="room.availability.isAvailable ? 'badge-success' : 'badge-error'">
                            {{ room.availability.isAvailable ? `${room.availability.availableUnits} available` : 'Unavailable' }}
                          </span>
                        </div>
                        <p class="mt-1 text-sm text-base-content/50">{{ room.bedConfiguration || `${room.baseOccupancy} base · ${room.maxOccupancy} max` }}</p>
                      </div>
                      <p class="text-sm font-semibold text-primary">From {{ formatCurrency(room.defaultNightlyRate) }} / night</p>
                    </div>

                    <div v-if="room.description" class="tiptap-render mt-4 text-sm leading-7 text-base-content/65" v-html="room.description" />

                    <div v-if="room.facilities.length" class="mt-4 flex flex-wrap gap-2">
                      <span v-for="facility in room.facilities" :key="facility" class="badge badge-soft badge-sm">{{ facility }}</span>
                    </div>

                    <div class="mt-5 flex items-center gap-3">
                      <label class="text-xs font-semibold uppercase tracking-wide text-base-content/40">Select rooms</label>
                      <input v-model.number="selections[room.id]" type="number" min="0" :max="room.availability?.availableUnits ?? 0" class="input input-sm w-24" :disabled="!room.availability?.isAvailable" />
                      <span v-if="room.availability && room.availability.minStay > 1" class="text-xs text-base-content/45">Min stay {{ room.availability.minStay }} nights</span>
                    </div>
                  </div>
                </div>
              </article>

              <div v-if="!displayRoomTypes.length" class="rounded-3xl border border-dashed border-base-300 px-6 py-10 text-center text-sm text-base-content/45">
                No featured room types yet. Mark room types as featured in the admin to publish them here.
              </div>
            </div>
          </section>
        </div>

        <div class="space-y-6 lg:sticky lg:top-24">
          <section class="rounded-4xl border border-base-300 bg-base-100 p-6 shadow-[0_24px_80px_color-mix(in_oklab,var(--color-neutral)_12%,transparent)]">
            <h2 class="font-semibold text-base-content">Booking Quote</h2>
            <p class="mt-1 text-sm text-base-content/50">After selecting available room types, generate a quote and send a direct booking request.</p>

            <div class="mt-5 flex gap-3">
              <button class="btn btn-outline" :disabled="!canQuote || quoting" @click="loadQuote()">{{ quoting ? 'Calculating...' : 'Calculate Quote' }}</button>
            </div>
            <p v-if="quoteError" class="mt-3 text-sm text-error">{{ quoteError }}</p>

            <div v-if="quote" class="mt-6 space-y-4">
              <div class="rounded-xl bg-base-200/60 p-4 text-sm">
                <p class="font-medium text-base-content">{{ quote.property.name }}</p>
                <p class="mt-1 text-base-content/60">{{ quote.checkIn }} to {{ quote.checkOut }} · {{ quote.totalNights }} nights</p>
              </div>

              <div class="space-y-3">
                <div v-for="line in quote.lines" :key="line.roomTypeId" class="flex items-start justify-between gap-4 rounded-xl border border-base-200 px-4 py-3">
                  <div>
                    <p class="font-medium text-base-content">{{ line.name }}</p>
                    <p class="text-xs text-base-content/45">{{ line.quantity }} room · {{ line.adults }} adult · {{ line.children }} child</p>
                  </div>
                  <p class="font-medium text-primary">{{ formatCurrency(line.lineSubtotal) }}</p>
                </div>
              </div>

              <div class="flex items-center justify-between border-t border-base-200 pt-4">
                <span class="text-sm text-base-content/60">Total</span>
                <span class="text-lg font-semibold text-primary">{{ formatCurrency(quote.totalAmount) }}</span>
              </div>

              <form class="space-y-4" @submit.prevent="submitBooking()">
                <fieldset class="fieldset">
                  <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">First Name</legend>
                  <input v-model="guestForm.guestFirstName" type="text" class="input w-full" required />
                </fieldset>
                <fieldset class="fieldset">
                  <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Last Name</legend>
                  <input v-model="guestForm.guestLastName" type="text" class="input w-full" />
                </fieldset>
                <fieldset class="fieldset">
                  <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Email</legend>
                  <input v-model="guestForm.guestEmail" type="email" class="input w-full" required />
                </fieldset>
                <fieldset class="fieldset">
                  <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Phone</legend>
                  <input v-model="guestForm.guestPhone" type="text" class="input w-full" />
                </fieldset>
                <fieldset class="fieldset">
                  <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Notes</legend>
                  <textarea v-model="guestForm.notes" class="textarea w-full" rows="3"></textarea>
                </fieldset>
                <button type="submit" class="btn btn-primary w-full" :disabled="submittingBooking">{{ submittingBooking ? 'Sending...' : 'Send Booking Request' }}</button>
                <p v-if="bookingError" class="text-sm text-error">{{ bookingError }}</p>
              </form>
            </div>
          </section>

          <section v-if="bookingSuccess" class="rounded-4xl border border-success/40 bg-success/5 p-6">
            <h2 class="font-semibold text-success">Booking request sent</h2>
            <p class="mt-2 text-sm text-base-content/70">Reference: <span class="font-mono">{{ bookingSuccess.referenceCode }}</span></p>
            <p class="mt-2 text-sm text-base-content/70">We have saved your request with pending status. Right now confirmation is still handled manually by the host.</p>
            <p class="mt-2 text-sm text-base-content/70">Use this reference when contacting the property by WhatsApp or email to follow up on confirmation.</p>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AvailabilityResponse, BookingQuote, GuesthouseBooking, RoomType } from '~/types'

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

const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(today.getDate() + 1)
const dayAfter = new Date(today)
dayAfter.setDate(today.getDate() + 2)

function toDateInput(date: Date) {
  return date.toISOString().slice(0, 10)
}

const searchForm = reactive({
  checkIn: toDateInput(tomorrow),
  checkOut: toDateInput(dayAfter),
  adults: 2,
  children: 0,
})

const guestForm = reactive({
  guestFirstName: '',
  guestLastName: '',
  guestEmail: '',
  guestPhone: '',
  notes: '',
})

const { data: featuredResponse } = await useFetch<{ roomTypes: RoomType[] }>('/api/guesthouse/room-types', {
  query: { public: 'true' },
})

const featuredRoomTypes = computed(() => featuredResponse.value?.roomTypes || [])
const availability = ref<AvailabilityResponse | null>(null)
const quote = ref<BookingQuote | null>(null)
const checkingAvailability = ref(false)
const quoting = ref(false)
const submittingBooking = ref(false)
const availabilityError = ref('')
const quoteError = ref('')
const bookingError = ref('')
const bookingSuccess = ref<GuesthouseBooking | null>(null)
const selections = ref<Record<string, number>>({})
const recentBookingLookup = useState<{ referenceCode: string; guestEmail: string }>('recent-booking-lookup', () => ({
  referenceCode: '',
  guestEmail: '',
}))

const displayRoomTypes = computed(() => {
  const featured = featuredRoomTypes.value
  const availabilityById = new Map((availability.value?.roomTypes || []).map(roomType => [roomType.id, roomType]))

  if (featured.length) {
    return featured.map((roomType) => ({
      ...roomType,
      facilities: roomType.metadata?.facilities || [],
      imageUrl: roomType.metadata?.imageUrl || '',
      availability: availabilityById.get(roomType.id) || null,
    }))
  }

  return (availability.value?.roomTypes || []).map(roomType => ({
    ...roomType,
    facilities: [],
    imageUrl: '',
    availability: roomType,
  }))
})

const canQuote = computed(() => {
  if (!availability.value) return false
  return Object.values(selections.value).some(value => Number(value) > 0)
})

async function checkAvailability() {
  availabilityError.value = ''
  quote.value = null
  bookingSuccess.value = null
  try {
    checkingAvailability.value = true
    availability.value = await $fetch<AvailabilityResponse>('/api/guesthouse/availability', {
      method: 'POST',
      body: searchForm,
    })
  } catch (error: any) {
    availabilityError.value = error?.data?.statusMessage || 'Failed to check availability'
  } finally {
    checkingAvailability.value = false
  }
}

async function loadQuote() {
  quoteError.value = ''
  bookingError.value = ''
  try {
    quoting.value = true
    quote.value = await $fetch<BookingQuote>('/api/guesthouse/quote', {
      method: 'POST',
      body: {
        ...searchForm,
        selections: Object.entries(selections.value)
          .filter(([, quantity]) => Number(quantity) > 0)
          .map(([roomTypeId, quantity]) => ({
            roomTypeId,
            quantity: Number(quantity),
            adults: searchForm.adults,
            children: searchForm.children,
          })),
      },
    })
  } catch (error: any) {
    quoteError.value = error?.data?.statusMessage || 'Failed to calculate quote'
  } finally {
    quoting.value = false
  }
}

async function submitBooking() {
  bookingError.value = ''
  if (!quote.value) {
    bookingError.value = 'Calculate a quote first'
    return
  }

  try {
    submittingBooking.value = true
    bookingSuccess.value = await $fetch<GuesthouseBooking>('/api/guesthouse/bookings', {
      method: 'POST',
      body: {
        ...searchForm,
        ...guestForm,
        selections: quote.value.lines.map(line => ({
          roomTypeId: line.roomTypeId,
          quantity: line.quantity,
          adults: line.adults,
          children: line.children,
        })),
      },
    })
    recentBookingLookup.value = {
      referenceCode: bookingSuccess.value.referenceCode,
      guestEmail: guestForm.guestEmail,
    }
    quote.value = null
    selections.value = {}
    await navigateTo({
      path: '/booking-status',
      query: { reference: bookingSuccess.value.referenceCode },
    })
  } catch (error: any) {
    bookingError.value = error?.data?.statusMessage || 'Failed to submit booking'
  } finally {
    submittingBooking.value = false
  }
}

useSeoMeta({
  title: () => `Book Stay - ${siteName.value}`,
  description: () => settings.value?.metaDescription || settings.value?.siteTagline || 'Check room availability and send a direct booking request.',
})
</script>