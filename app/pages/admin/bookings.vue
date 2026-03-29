<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
      <div>
        <h1 class="text-2xl font-bold text-base-content">Bookings</h1>
        <p class="text-sm text-base-content/50 mt-1">Manage direct room-rent bookings, guest details, and booking lifecycle.</p>
      </div>
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="filter in STATUS_FILTERS"
          :key="filter.value"
          @click="filterStatus = filter.value"
          class="badge badge-sm cursor-pointer transition-all"
          :class="filterStatus === filter.value ? 'badge-primary' : 'badge-ghost hover:badge-neutral'"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <div class="card bg-base-100 border border-base-300">
      <div class="card-body p-0">
        <table class="table table-sm">
          <thead>
            <tr class="border-b border-base-300 text-xs uppercase tracking-wide text-base-content/40">
              <th class="pl-5">Ref</th>
              <th>Guest</th>
              <th>Stay</th>
              <th>Rooms</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
              <th class="pr-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="booking in filteredBookings"
              :key="booking.id"
              class="border-b border-base-200 last:border-0 hover:bg-base-200/40 transition-colors cursor-pointer"
              @click="openDetail(booking)"
            >
              <td class="pl-5"><span class="font-mono text-xs text-base-content/60">{{ booking.referenceCode }}</span></td>
              <td>
                <div class="text-sm font-medium text-base-content">{{ booking.guestFirstName }} {{ booking.guestLastName || '' }}</div>
                <div class="text-xs text-base-content/50">{{ booking.guestEmail }}</div>
              </td>
              <td class="text-xs text-base-content/60">{{ formatStay(booking.checkInDate, booking.checkOutDate) }}</td>
              <td class="text-sm text-base-content/70">{{ booking.bookingRooms.length }} room{{ booking.bookingRooms.length !== 1 ? 's' : '' }}</td>
              <td class="text-sm font-medium text-primary">{{ formatIdr(booking.totalAmount) }}</td>
              <td>
                <span class="badge badge-sm badge-soft" :class="paymentBadge(booking.paymentStatus)">{{ PAYMENT_LABELS[booking.paymentStatus] || booking.paymentStatus }}</span>
              </td>
              <td>
                <span class="badge badge-sm badge-soft" :class="statusBadge(booking.status)">{{ STATUS_LABELS[booking.status] || booking.status }}</span>
              </td>
              <td class="text-xs text-base-content/50">{{ formatDate(booking.createdAt) }}</td>
              <td class="pr-5 text-right">
                <button class="btn btn-ghost btn-xs" @click.stop="openDetail(booking)"><IconEye class="w-4 h-4" /></button>
              </td>
            </tr>
            <tr v-if="!filteredBookings.length">
              <td colspan="9" class="text-center py-12 text-base-content/40">
                <IconCalendarTime class="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>No bookings yet</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <dialog ref="modalRef" class="modal">
      <div v-if="selected" class="modal-box max-w-3xl">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-3 top-3" @click="closeModal()"><IconX class="w-4 h-4" /></button>
        <h3 class="font-bold text-lg mb-1">Booking Detail</h3>
        <p class="text-xs text-base-content/40 font-mono mb-6">{{ selected.referenceCode }} · {{ formatDate(selected.createdAt) }}</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-base-content/40 mb-2">Guest Details</p>
            <div class="space-y-1 text-sm">
              <p class="font-medium text-base-content">{{ selected.guestFirstName }} {{ selected.guestLastName || '' }}</p>
              <p class="text-base-content/60">{{ selected.guestEmail }}</p>
              <p class="text-base-content/60">{{ selected.guestPhone || '-' }}</p>
              <p class="text-base-content/60">{{ selected.adultCount }} adult · {{ selected.childCount }} child</p>
              <p v-if="selected.notes" class="text-base-content/50 italic text-xs mt-1">{{ selected.notes }}</p>
            </div>
          </div>

          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-base-content/40 mb-2">Stay</p>
            <div class="space-y-1 text-sm text-base-content/65">
              <p>{{ formatStay(selected.checkInDate, selected.checkOutDate) }}</p>
              <p>{{ selected.totalNights }} night{{ selected.totalNights !== 1 ? 's' : '' }}</p>
              <p>Total {{ formatIdr(selected.totalAmount) }}</p>
            </div>
          </div>
        </div>

        <div class="mt-5">
          <p class="text-xs font-semibold uppercase tracking-wide text-base-content/40 mb-2">Booked Rooms</p>
          <div class="space-y-2">
            <div v-for="line in selected.bookingRooms" :key="line.id" class="rounded-lg border border-base-200 px-4 py-3">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-sm font-medium text-base-content">{{ line.roomType?.name || 'Room' }}</p>
                  <p class="text-xs text-base-content/45">{{ line.adults }} adult · {{ line.children }} child</p>
                </div>
                <div class="text-right text-sm">
                  <p class="font-medium text-primary">{{ formatIdr(line.lineTotal) }}</p>
                  <p class="text-xs text-base-content/40">{{ line.roomUnit?.code || 'Unit not assigned yet' }}</p>
                </div>
              </div>

              <div class="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div class="flex-1">
                  <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-base-content/40">Assign room unit</label>
                  <select
                    :value="assignmentSelections[line.id] ?? (line.roomUnitId || '')"
                    class="select select-sm w-full"
                    :disabled="updatingRoomLineId === line.id"
                    @change="onAssignmentChange(line.id, $event)"
                  >
                    <option value="">Unassigned</option>
                    <option v-for="unit in line.assignableRoomUnits || []" :key="unit.id" :value="unit.id">
                      {{ unit.code }}{{ unit.name ? ` - ${unit.name}` : '' }}
                    </option>
                  </select>
                  <p class="mt-1 text-xs text-base-content/40">
                    {{ (line.assignableRoomUnits || []).length }} assignable unit{{ (line.assignableRoomUnits || []).length !== 1 ? 's' : '' }}
                  </p>
                </div>
                <div class="flex justify-end">
                  <button
                    class="btn btn-primary btn-sm"
                    :disabled="updatingRoomLineId === line.id || (assignmentSelections[line.id] ?? (line.roomUnitId || '')) === (line.roomUnitId || '')"
                    @click="assignRoomUnit(line.id)"
                  >
                    {{ updatingRoomLineId === line.id ? 'Saving...' : 'Save Assignment' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-base-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-base-content/40 mb-2">Update Status</p>
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="status in BOOKING_STATUSES"
              :key="status.value"
              @click="updateStatus(selected.id, status.value)"
              :disabled="selected.status === status.value || updatingId === selected.id"
              class="badge badge-sm cursor-pointer transition-all disabled:opacity-40 disabled:cursor-default"
              :class="selected.status === status.value ? `badge-soft ${statusBadge(status.value)}` : 'badge-ghost hover:badge-neutral'"
            >
              {{ status.label }}
            </button>
          </div>
        </div>

        <div class="mt-3">
          <p class="text-xs font-semibold uppercase tracking-wide text-base-content/40 mb-2">Update Payment Status</p>
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="status in PAYMENT_STATUSES"
              :key="status.value"
              @click="updatePaymentStatus(selected.id, status.value)"
              :disabled="selected.paymentStatus === status.value || updatingId === selected.id"
              class="badge badge-sm cursor-pointer transition-all disabled:opacity-40 disabled:cursor-default"
              :class="selected.paymentStatus === status.value ? `badge-soft ${paymentBadge(status.value)}` : 'badge-ghost hover:badge-neutral'"
            >
              {{ status.label }}
            </button>
          </div>
        </div>

        <div class="modal-action">
          <button class="btn btn-ghost btn-sm" @click="closeModal()">Close</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop" @click="closeModal()"><button>close</button></form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { IconCalendarTime, IconEye, IconX } from '@tabler/icons-vue'
import { useAdminDateFormat } from '~/composables/useAdminDateFormat'
import { useTemplate } from '~/composables/useTemplate'
import type { GuesthouseBooking, GuesthouseBookingPaymentStatus, GuesthouseBookingStatus } from '~/types'
import { isFeatureEnabled } from '~/composables/usePlan'

const route = useRoute()
const router = useRouter()

const { data: settings } = await useFetch<Record<string, string>>('/api/settings', {
  key: 'site-settings',
})
const { businessType } = useTemplate(settings)

if (businessType.value !== 'guesthouse') {
  await navigateTo('/admin', { replace: true })
}

if (!isFeatureEnabled(settings.value, 'bookingEngine')) {
  await navigateTo('/admin/settings', { replace: true })
}

const { data: bookings, refresh } = await useFetch<GuesthouseBooking[]>('/api/guesthouse/bookings')

const PAYMENT_LABELS: Record<GuesthouseBookingPaymentStatus, string> = {
  unpaid: 'Unpaid',
  partially_paid: 'Partial',
  paid: 'Paid',
  refunded: 'Refunded',
  voided: 'Voided',
}

const STATUS_LABELS: Record<GuesthouseBookingStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  checked_in: 'Checked In',
  checked_out: 'Checked Out',
  cancelled: 'Cancelled',
  no_show: 'No Show',
}

const PAYMENT_STATUSES = Object.entries(PAYMENT_LABELS).map(([value, label]) => ({ value: value as GuesthouseBookingPaymentStatus, label }))
const BOOKING_STATUSES = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value: value as GuesthouseBookingStatus, label }))
const STATUS_FILTERS = [{ value: '', label: 'All' }, ...BOOKING_STATUSES]
const { formatAdminDateTime, formatAdminDateRange } = useAdminDateFormat()

const filterStatus = ref('')
const filteredBookings = computed(() => {
  if (!filterStatus.value) return bookings.value ?? []
  return (bookings.value ?? []).filter(booking => booking.status === filterStatus.value)
})

function formatDate(value: string) {
  return formatAdminDateTime(value)
}

function formatStay(checkIn: string, checkOut: string) {
  return formatAdminDateRange(checkIn, checkOut)
}

function formatIdr(value: number | string) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value || 0))
}

function statusBadge(status: GuesthouseBookingStatus) {
  return {
    pending: 'badge-warning',
    confirmed: 'badge-info',
    checked_in: 'badge-primary',
    checked_out: 'badge-success',
    cancelled: 'badge-error',
    no_show: 'badge-ghost',
  }[status] || 'badge-ghost'
}

function paymentBadge(status: GuesthouseBookingPaymentStatus) {
  return {
    unpaid: 'badge-warning',
    partially_paid: 'badge-info',
    paid: 'badge-success',
    refunded: 'badge-ghost',
    voided: 'badge-error',
  }[status] || 'badge-ghost'
}

const modalRef = ref<HTMLDialogElement>()
const selected = ref<GuesthouseBooking | null>(null)
const updatingId = ref<string | null>(null)
const updatingRoomLineId = ref<string | null>(null)
const openingBookingId = ref<string | null>(null)
const assignmentSelections = reactive<Record<string, string>>({})

function syncAssignmentSelections(booking: GuesthouseBooking) {
  for (const key of Object.keys(assignmentSelections)) {
    delete assignmentSelections[key]
  }

  for (const line of booking.bookingRooms) {
    assignmentSelections[line.id] = line.roomUnitId || ''
  }
}

function replaceBooking(updated: GuesthouseBooking) {
  if (bookings.value) {
    const index = bookings.value.findIndex(booking => booking.id === updated.id)
    if (index !== -1) bookings.value[index] = updated
  }
  if (selected.value?.id === updated.id) {
    selected.value = updated
    syncAssignmentSelections(updated)
  }
}

async function openDetailById(bookingId: string) {
  if (openingBookingId.value === bookingId) return

  openingBookingId.value = bookingId
  try {
    const detail = await $fetch<GuesthouseBooking>(`/api/guesthouse/bookings/${bookingId}`)
    selected.value = detail
    syncAssignmentSelections(detail)
    modalRef.value?.showModal()
  } finally {
    openingBookingId.value = null
  }
}

async function openDetail(booking: GuesthouseBooking) {
  await openDetailById(booking.id)
}

function closeModal() {
  modalRef.value?.close()
  selected.value = null

  if (typeof route.query.booking === 'string') {
    const nextQuery = { ...route.query }
    delete nextQuery.booking
    void router.replace({ query: nextQuery })
  }
}

function onAssignmentChange(lineId: string, event: Event) {
  const target = event.target as HTMLSelectElement
  assignmentSelections[lineId] = target.value
}

async function updateStatus(bookingId: string, status: GuesthouseBookingStatus) {
  updatingId.value = bookingId
  try {
    const updated = await $fetch<GuesthouseBooking>(`/api/guesthouse/bookings/${bookingId}`, { method: 'PUT', body: { status } })
    replaceBooking(updated)
  } finally {
    updatingId.value = null
  }
}

async function updatePaymentStatus(bookingId: string, paymentStatus: GuesthouseBookingPaymentStatus) {
  updatingId.value = bookingId
  try {
    const updated = await $fetch<GuesthouseBooking>(`/api/guesthouse/bookings/${bookingId}`, { method: 'PUT', body: { paymentStatus } })
    replaceBooking(updated)
  } finally {
    updatingId.value = null
  }
}

async function assignRoomUnit(bookingRoomId: string) {
  if (!selected.value) return

  updatingRoomLineId.value = bookingRoomId
  try {
    const updated = await $fetch<GuesthouseBooking>(`/api/guesthouse/bookings/${selected.value.id}`, {
      method: 'PUT',
      body: {
        bookingRoomId,
        roomUnitId: assignmentSelections[bookingRoomId] || null,
      },
    })
    replaceBooking(updated)
  } finally {
    updatingRoomLineId.value = null
  }
}

watch(
  () => route.query.booking,
  async (bookingId) => {
    if (typeof bookingId !== 'string' || !bookingId) return

    if (selected.value?.id === bookingId) {
      modalRef.value?.showModal()
      return
    }

    await openDetailById(bookingId)
  },
  { immediate: true },
)
</script>