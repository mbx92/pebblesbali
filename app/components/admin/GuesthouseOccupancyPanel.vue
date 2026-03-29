<template>
  <div>
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body p-0">
        <div class="flex flex-col gap-4 border-b border-base-200 px-5 pt-5 pb-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="font-semibold text-base-content">Occupancy Timeline</h2>
              <span class="badge badge-soft badge-sm">{{ occupancy?.dayCount || occupancyDays }} days</span>
            </div>
            <p class="mt-1 text-xs text-base-content/45">Gantt-style operational view for assigned stays, blocked dates, and units that are offline.</p>
          </div>

          <div class="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <label class="input input-sm flex items-center gap-2">
              <span class="text-xs uppercase tracking-wide text-base-content/45">Start</span>
              <input v-model="occupancyStartDate" type="date" class="grow" @change="refreshOccupancy()" />
            </label>
            <select v-model.number="occupancyDays" class="select select-sm" @change="refreshOccupancy()">
              <option :value="7">7 days</option>
              <option :value="14">14 days</option>
              <option :value="21">21 days</option>
              <option :value="30">30 days</option>
            </select>
            <div class="join">
              <button type="button" class="btn btn-sm join-item" @click="shiftOccupancyRange(-occupancyDays)">Prev</button>
              <button type="button" class="btn btn-sm join-item" @click="jumpOccupancyToToday()">Today</button>
              <button type="button" class="btn btn-sm join-item" @click="shiftOccupancyRange(occupancyDays)">Next</button>
            </div>
            <button type="button" class="btn btn-sm btn-outline" :disabled="occupancyPending" @click="refreshOccupancy()">
              {{ occupancyPending ? 'Refreshing...' : 'Refresh' }}
            </button>
          </div>
        </div>

        <div class="border-b border-base-200 px-5 py-4">
          <div class="flex flex-wrap gap-2 text-xs">
            <span class="badge badge-soft badge-success">{{ occupancySummary.available }} available</span>
            <span class="badge badge-soft badge-error">{{ occupancySummary.occupied }} occupied</span>
            <span class="badge badge-soft badge-warning">{{ occupancySummary.blocked }} blocked</span>
            <span class="badge badge-soft badge-info">{{ occupancySummary.maintenance }} maintenance</span>
            <span class="badge badge-soft">{{ occupancySummary.hidden }} hidden</span>
            <span class="badge badge-soft">{{ occupancySummary.inactive }} inactive</span>
            <span class="badge badge-soft" :class="occupancySummary.unassigned ? 'badge-warning' : 'badge-success'">
              {{ occupancySummary.unassigned }} unassigned stay{{ occupancySummary.unassigned === 1 ? '' : 's' }}
            </span>
          </div>
          <p class="mt-2 text-xs text-base-content/40">Snapshot for {{ occupancySummaryLabel }}</p>

          <div class="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div class="flex flex-wrap gap-2">
              <select v-model="selectedRoomTypeId" class="select select-sm">
                <option value="">All room types</option>
                <option v-for="roomType in roomTypeOptions" :key="roomType.value" :value="roomType.value">{{ roomType.label }}</option>
              </select>
              <select v-model="selectedBookingStatus" class="select select-sm">
                <option value="">All booking statuses</option>
                <option v-for="status in bookingStatusOptions" :key="status.value" :value="status.value">{{ status.label }}</option>
              </select>
              <button v-if="selectedRoomTypeId || selectedBookingStatus" type="button" class="btn btn-sm btn-ghost" @click="clearFilters()">Clear Filters</button>
            </div>
          </div>

          <div class="mt-4 space-y-3 text-[11px]">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-[10px] font-semibold uppercase tracking-wide text-base-content/40">Booking Status</span>
              <span v-for="item in bookingStatusLegend" :key="item.status" class="inline-flex items-center gap-2 rounded-full border px-2.5 py-1" :class="item.className">
                <span class="size-1.5 rounded-full bg-current opacity-70" />
                <span>{{ item.label }}</span>
              </span>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-[10px] font-semibold uppercase tracking-wide text-base-content/40">Operational</span>
              <span v-for="item in occupancyStateLegend" :key="item.label" class="inline-flex items-center gap-2 rounded-full border px-2.5 py-1" :class="item.className">
                <span class="size-1.5 rounded-full bg-current opacity-70" />
                <span>{{ item.label }}</span>
              </span>
            </div>
          </div>
        </div>

        <div v-if="filteredUnassignedBookingRooms.length" class="px-5 pt-4">
          <div class="rounded-2xl border border-warning/30 bg-warning/10 p-4">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p class="font-medium text-sm text-base-content">Unassigned stays need room-unit assignment</p>
                <p class="mt-1 text-xs text-base-content/50">These bookings already hold inventory by room type, but no physical unit has been assigned yet.</p>
              </div>
              <NuxtLink to="/admin/bookings" class="btn btn-sm btn-warning">Open Bookings</NuxtLink>
            </div>
            <div class="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              <div v-for="line in filteredUnassignedBookingRooms.slice(0, 6)" :key="line.bookingRoomId" class="rounded-xl border border-warning/25 bg-base-100 px-3 py-3 text-sm">
                <div class="flex items-center justify-between gap-3">
                  <p class="font-semibold text-base-content">{{ line.bookingReference }}</p>
                  <span class="badge badge-soft badge-warning badge-sm">{{ line.status }}</span>
                </div>
                <p class="mt-1 text-xs text-base-content/45">{{ line.roomTypeName }}</p>
                <p class="mt-2 text-sm text-base-content/70">{{ line.guestName }}</p>
                <p class="mt-1 text-xs text-base-content/45">{{ line.checkInDate }} to {{ line.checkOutDate }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto px-5 py-5">
          <div class="w-max min-w-full">
            <div class="grid overflow-hidden rounded-2xl border border-base-300 bg-base-200/50" :style="timelineTableStyle">
              <div class="sticky left-0 z-20 border-r border-base-300 bg-base-100 px-4 py-3">
                <p class="text-xs font-semibold uppercase tracking-wide text-base-content/40">Room Unit</p>
                <p class="mt-1 text-xs text-base-content/55">One lane per physical room</p>
              </div>

              <div class="grid border-b border-base-300 bg-base-100" :style="timelineGridStyle">
                <div
                  v-for="day in occupancyDaysList"
                  :key="day.date"
                  class="min-w-20 border-l border-base-200 px-2 py-3 text-center first:border-l-0"
                  :class="day.isToday ? 'bg-primary/8' : ''"
                >
                  <div class="flex flex-col items-center gap-1">
                    <span class="text-xs font-semibold" :class="day.isToday ? 'text-primary' : 'text-base-content'">{{ day.shortLabel }}</span>
                    <span class="text-[10px] uppercase tracking-wide text-base-content/35">{{ day.isToday ? 'Today' : day.label }}</span>
                  </div>
                </div>
              </div>

              <template v-if="!occupancyPending && !filteredOccupancyUnits.length">
                <div class="sticky left-0 z-10 border-r border-base-300 bg-base-100 px-4 py-6">
                  <p class="text-sm font-medium text-base-content">Inventory</p>
                </div>
                <div class="bg-base-100 px-6 py-10 text-center text-base-content/40">
                  No room units match the current filters.
                </div>
              </template>

              <template v-for="unit in filteredOccupancyUnits" :key="unit.id">
                <div class="sticky left-0 z-10 border-r border-t border-base-300 bg-base-100 px-4 py-4">
                  <div class="space-y-1">
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="badge badge-soft badge-sm">{{ unit.name || 'Unnamed Room' }}</span>
                      <span class="badge badge-soft badge-sm" :class="unitStatusBadge(unit.status)">{{ unit.status }}</span>
                      <span v-if="!unit.isBookable" class="badge badge-soft badge-sm">Hidden</span>
                    </div>
                    <p class="text-xs text-base-content/55">{{ unit.code }} - {{ unit.roomTypeName }}</p>
                  </div>
                </div>

                <div class="relative border-t border-base-300 bg-base-100">
                  <div class="grid min-h-22" :style="timelineGridStyle">
                    <div
                      v-for="day in unit.days"
                      :key="`${unit.id}-${day.date}`"
                      class="border-l border-base-200 first:border-l-0"
                      :class="timelineCellClass(day)"
                    />
                  </div>

                  <div class="pointer-events-none absolute inset-0 grid px-2 py-2" :style="timelineGridStyle">
                    <button
                      v-for="segment in occupancySegments(unit)"
                      :key="`${unit.id}-${segment.start}-${segment.end}-${segment.label}`"
                      type="button"
                      class="pointer-events-auto my-1 flex min-w-0 items-center rounded-xl border text-left shadow-sm"
                      :style="segmentGridStyle(segment)"
                      :class="[
                        segment.className,
                        isCompactSegment(segment) ? 'justify-center gap-2 px-2 py-2' : 'px-3 py-2',
                        segment.bookingId ? 'cursor-pointer hover:ring-2 hover:ring-primary/25' : 'cursor-default',
                      ]"
                      :title="segment.title"
                      @click="openSegmentBooking(segment)"
                    >
                      <div class="min-w-0 flex-1" :class="isCompactSegment(segment) ? 'text-center' : ''">
                        <p class="truncate text-xs font-semibold">{{ segment.label }}</p>
                        <p v-if="!isCompactSegment(segment)" class="truncate text-[11px] opacity-75">{{ segment.meta }}</p>
                      </div>
                      <span v-if="segment.bookingId && !isCompactSegment(segment)" class="ml-2 shrink-0 rounded-full border border-current/20 bg-base-100/35 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide opacity-90">
                        Click to open
                      </span>
                      <span v-else-if="segment.bookingId" class="shrink-0 rounded-full border border-current/20 bg-base-100/35 p-1 opacity-90" aria-hidden="true">
                        <IconEye class="h-3.5 w-3.5" />
                      </span>
                    </button>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <dialog ref="bookingModalRef" class="modal">
      <div class="modal-box max-w-3xl">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-3 top-3" @click="closeBookingModal()">
          <IconX class="w-4 h-4" />
        </button>

        <template v-if="selectedBooking">
          <h3 class="mb-1 text-lg font-bold">Booking Detail</h3>
          <p class="mb-6 font-mono text-xs text-base-content/40">{{ selectedBooking.referenceCode }} · {{ formatDateTime(selectedBooking.createdAt) }}</p>

          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-base-content/40">Guest Details</p>
              <div class="space-y-1 text-sm">
                <p class="font-medium text-base-content">{{ selectedBooking.guestFirstName }} {{ selectedBooking.guestLastName || '' }}</p>
                <p class="text-base-content/60">{{ selectedBooking.guestEmail }}</p>
                <p class="text-base-content/60">{{ selectedBooking.guestPhone || '-' }}</p>
                <p class="text-base-content/60">{{ selectedBooking.adultCount }} adult · {{ selectedBooking.childCount }} child</p>
                <p v-if="selectedBooking.notes" class="mt-1 text-xs italic text-base-content/50">{{ selectedBooking.notes }}</p>
              </div>
            </div>

            <div>
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-base-content/40">Stay</p>
              <div class="space-y-2 text-sm text-base-content/65">
                <p>{{ formatStay(selectedBooking.checkInDate, selectedBooking.checkOutDate) }}</p>
                <p>{{ selectedBooking.totalNights }} night{{ selectedBooking.totalNights !== 1 ? 's' : '' }}</p>
                <div class="flex flex-wrap gap-2 pt-1">
                  <span class="badge badge-soft badge-sm" :class="bookingStatusBadge(selectedBooking.status)">{{ bookingStatusLabel(selectedBooking.status) }}</span>
                  <span class="badge badge-soft badge-sm" :class="paymentStatusBadge(selectedBooking.paymentStatus)">{{ paymentStatusLabel(selectedBooking.paymentStatus) }}</span>
                </div>
                <p class="pt-1 font-medium text-primary">Total {{ formatIdr(selectedBooking.totalAmount) }}</p>
              </div>
            </div>
          </div>

          <div class="mt-5">
            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-base-content/40">Booked Rooms</p>
            <div class="space-y-2">
              <div v-for="line in selectedBooking.bookingRooms" :key="line.id" class="rounded-lg border border-base-200 px-4 py-3">
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
              </div>
            </div>
          </div>

          <div class="modal-action">
            <button class="btn btn-ghost btn-sm" @click="closeBookingModal()">Close</button>
            <NuxtLink to="/admin/bookings" class="btn btn-primary btn-sm">Open Full Bookings Page</NuxtLink>
          </div>
        </template>

        <template v-else>
          <div class="py-10 text-center text-sm text-base-content/45">Loading booking detail...</div>
        </template>
      </div>
      <form method="dialog" class="modal-backdrop" @click="closeBookingModal()"><button>close</button></form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { IconEye, IconX } from '@tabler/icons-vue'
import { useAdminDateFormat } from '~/composables/useAdminDateFormat'
import type {
  GuesthouseBooking,
  GuesthouseBookingPaymentStatus,
  GuesthouseBookingStatus,
  GuesthouseOccupancyCell,
  GuesthouseOccupancyResponse,
  GuesthouseOccupancyUnit,
  RoomUnitStatus,
} from '~/types'

interface OccupancySegment {
  start: number
  end: number
  label: string
  meta: string
  className: string
  title: string
  bookingId?: string | null
}

const { formatAdminDateTime, formatAdminDateRange, formatOccupancyLabel } = useAdminDateFormat()

const occupancyStartDate = useState('guesthouse-occupancy-start-date', () => todayDateInput())
const occupancyDays = useState('guesthouse-occupancy-days', () => 14)
const selectedRoomTypeId = ref('')
const selectedBookingStatus = ref('')

const { data: occupancyResponse, pending: occupancyPending, refresh: refreshOccupancy } = await useFetch<GuesthouseOccupancyResponse>('/api/guesthouse/occupancy', {
  query: computed(() => ({
    startDate: occupancyStartDate.value,
    days: occupancyDays.value,
  })),
  key: computed(() => `guesthouse-occupancy:${occupancyStartDate.value}:${occupancyDays.value}`),
})

const occupancy = computed(() => occupancyResponse.value)
const occupancyUnits = computed<GuesthouseOccupancyUnit[]>(() => occupancy.value?.units || [])
const roomTypeOptions = computed(() => {
  const map = new Map<string, string>()

  for (const unit of occupancyUnits.value) {
    if (!map.has(unit.roomTypeId)) {
      map.set(unit.roomTypeId, unit.roomTypeName)
    }
  }

  return Array.from(map.entries())
    .map(([value, label]) => ({ value, label }))
    .sort((left, right) => left.label.localeCompare(right.label))
})

const bookingStatusLegend: Array<{ status: GuesthouseBookingStatus, label: string, className: string }> = [
  { status: 'pending', label: 'Pending', className: 'border-amber-300 bg-amber-200/80 text-amber-950' },
  { status: 'confirmed', label: 'Confirmed', className: 'border-sky-300 bg-sky-200/80 text-sky-950' },
  { status: 'checked_in', label: 'Checked In', className: 'border-emerald-300 bg-emerald-200/85 text-emerald-950' },
  { status: 'checked_out', label: 'Checked Out', className: 'border-slate-300 bg-slate-200/85 text-slate-900' },
  { status: 'cancelled', label: 'Cancelled', className: 'border-rose-300 bg-rose-200/80 text-rose-950' },
  { status: 'no_show', label: 'No Show', className: 'border-fuchsia-300 bg-fuchsia-200/80 text-fuchsia-950' },
]

const bookingStatusOptions = computed(() => bookingStatusLegend.map(item => ({ value: item.status, label: item.label })))

const occupancyStateLegend = [
  { label: 'Blocked', className: 'border-warning/30 bg-warning/18 text-base-content' },
  { label: 'Maintenance', className: 'border-info/30 bg-info/18 text-base-content' },
  { label: 'Inactive', className: 'border-base-300 bg-base-200 text-base-content/70' },
  { label: 'Hidden', className: 'border-base-300 bg-base-200/80 text-base-content/75' },
]

const filteredOccupancyUnits = computed(() => occupancyUnits.value.filter((unit) => {
  if (selectedRoomTypeId.value && unit.roomTypeId !== selectedRoomTypeId.value) {
    return false
  }

  if (!selectedBookingStatus.value) {
    return true
  }

  return unit.days.some(day => day.status === 'occupied' && day.bookingStatus === selectedBookingStatus.value)
}))

const filteredUnassignedBookingRooms = computed(() => (occupancy.value?.unassignedBookingRooms || []).filter((line) => {
  if (selectedRoomTypeId.value && line.roomTypeId !== selectedRoomTypeId.value) {
    return false
  }

  if (selectedBookingStatus.value && line.status !== selectedBookingStatus.value) {
    return false
  }

  return true
}))

const occupancyDaysList = computed(() => occupancy.value?.days || [])
const timelineLabelWidth = 240
const timelineDayWidth = 96
const timelineDaysWidth = computed(() => Math.max(occupancyDaysList.value.length, 1) * timelineDayWidth)
const timelineTableStyle = computed(() => ({
  gridTemplateColumns: `${timelineLabelWidth}px minmax(${timelineDaysWidth.value}px, max-content)`,
}))
const timelineGridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${Math.max(occupancyDaysList.value.length, 1)}, ${timelineDayWidth}px)`,
}))
const occupancySummary = computed(() => occupancy.value?.summary || {
  date: occupancyStartDate.value,
  available: 0,
  occupied: 0,
  blocked: 0,
  maintenance: 0,
  inactive: 0,
  hidden: 0,
  unassigned: 0,
})
const occupancySummaryLabel = computed(() => formatOccupancyLabel(occupancySummary.value.date))
const bookingModalRef = ref<HTMLDialogElement>()
const selectedBooking = ref<GuesthouseBooking | null>(null)

function todayDateInput() {
  return new Date().toISOString().slice(0, 10)
}

function addDateDays(value: string, days: number) {
  const date = new Date(`${value}T00:00:00.000Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

function formatDisplayDate(value: string) {
  return formatOccupancyLabel(value)
}

function formatDateTime(value: string) {
  return formatAdminDateTime(value)
}

function formatStay(checkIn: string, checkOut: string) {
  return formatAdminDateRange(checkIn, checkOut)
}

function formatIdr(value: number | string) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value || 0))
}

function unitStatusBadge(status: RoomUnitStatus) {
  return {
    active: 'badge-success',
    maintenance: 'badge-warning',
    inactive: 'badge-error',
  }[status] || 'badge-ghost'
}

function timelineCellClass(day: GuesthouseOccupancyCell) {
  return {
    available: day.date === occupancySummary.value.date ? 'bg-primary/5' : 'bg-base-100',
    occupied: bookingTimelineCellClass(day.bookingStatus),
    blocked: 'bg-warning/8',
    maintenance: 'bg-info/8',
    inactive: 'bg-base-200',
    hidden: 'bg-base-200/80',
  }[day.status] || 'bg-base-100'
}

function segmentGridStyle(segment: OccupancySegment) {
  return {
    gridColumn: `${segment.start + 1} / ${segment.end + 1}`,
  }
}

function isCompactSegment(segment: OccupancySegment) {
  return segment.end - segment.start <= 1
}

function occupancySegments(unit: GuesthouseOccupancyUnit) {
  const segments: OccupancySegment[] = []
  const days = unit.days
  let index = 0

  while (index < days.length) {
    const current = days[index]

    if (current.status === 'available') {
      index += 1
      continue
    }

    let end = index + 1
    while (end < days.length && canMergeOccupancyCells(current, days[end])) {
      end += 1
    }

    segments.push({
      start: index,
      end,
      label: segmentLabel(current),
      meta: segmentMeta(current),
      className: segmentClassName(current),
      title: occupancyCellTitle(unit, current),
      bookingId: current.bookingId,
    })

    index = end
  }

  return segments
}

function occupancyCellTitle(unit: GuesthouseOccupancyUnit, day: GuesthouseOccupancyCell) {
  const base = [`${unit.code} · ${unit.roomTypeName}`, `${formatDisplayDate(day.date)} · ${day.status}`]

  if (day.bookingReference) base.push(`Booking ${day.bookingReference}`)
  if (day.bookingStatus) base.push(`Status: ${bookingStatusLabel(day.bookingStatus)}`)
  if (day.guestName) base.push(`Guest: ${day.guestName}`)
  if (day.checkInDate && day.checkOutDate) base.push(`Stay: ${day.checkInDate} to ${day.checkOutDate}`)
  if (day.reason) base.push(`Reason: ${day.reason}`)
  if (day.notes) base.push(`Notes: ${day.notes}`)

  return base.join('\n')
}

function canMergeOccupancyCells(left: GuesthouseOccupancyCell, right: GuesthouseOccupancyCell) {
  if (left.status !== right.status) return false

  if (left.status === 'occupied') {
    return left.bookingId === right.bookingId
  }

  if (left.status === 'blocked') {
    return (left.reason || '') === (right.reason || '')
  }

  return true
}

function segmentLabel(day: GuesthouseOccupancyCell) {
  if (day.status === 'occupied') return day.bookingReference || 'Booked'
  if (day.status === 'blocked') return 'Blocked'
  if (day.status === 'maintenance') return 'Maintenance'
  if (day.status === 'inactive') return 'Inactive'
  if (day.status === 'hidden') return 'Hidden'
  return 'Open'
}

function segmentMeta(day: GuesthouseOccupancyCell) {
  if (day.status === 'occupied') return [bookingStatusLabel(day.bookingStatus), day.guestName || 'Assigned booking'].filter(Boolean).join(' · ')
  if (day.status === 'blocked') return day.reason || 'Closure'
  if (day.status === 'maintenance') return day.reason || 'Room offline'
  if (day.status === 'inactive') return day.reason || 'Not used for sales'
  if (day.status === 'hidden') return day.reason || 'Excluded from inventory'
  return 'Ready'
}

function segmentClassName(day: GuesthouseOccupancyCell) {
  if (day.status === 'occupied') return bookingSegmentClassName(day.bookingStatus)

  return {
    blocked: 'border-warning/30 bg-warning/18 text-base-content',
    maintenance: 'border-info/30 bg-info/18 text-base-content',
    inactive: 'border-base-300 bg-base-200 text-base-content/70',
    hidden: 'border-base-300 bg-base-200/80 text-base-content/75',
    available: 'border-success/20 bg-success/10 text-base-content',
  }[day.status] || 'border-base-300 bg-base-100 text-base-content'
}

function bookingStatusLabel(status?: GuesthouseBookingStatus | null) {
  return {
    pending: 'Pending',
    confirmed: 'Confirmed',
    checked_in: 'Checked In',
    checked_out: 'Checked Out',
    cancelled: 'Cancelled',
    no_show: 'No Show',
  }[status || 'pending']
}

function paymentStatusLabel(status: GuesthouseBookingPaymentStatus) {
  return {
    unpaid: 'Unpaid',
    partially_paid: 'Partial',
    paid: 'Paid',
    refunded: 'Refunded',
    voided: 'Voided',
  }[status] || status
}

function bookingTimelineCellClass(status?: GuesthouseBookingStatus | null) {
  return {
    pending: 'bg-amber-100/60',
    confirmed: 'bg-sky-100/60',
    checked_in: 'bg-emerald-100/60',
    checked_out: 'bg-slate-100/70',
    cancelled: 'bg-rose-100/60',
    no_show: 'bg-fuchsia-100/60',
  }[status || 'pending']
}

function bookingSegmentClassName(status?: GuesthouseBookingStatus | null) {
  return {
    pending: 'border-amber-300 bg-amber-200/80 text-amber-950',
    confirmed: 'border-sky-300 bg-sky-200/80 text-sky-950',
    checked_in: 'border-emerald-300 bg-emerald-200/85 text-emerald-950',
    checked_out: 'border-slate-300 bg-slate-200/85 text-slate-900',
    cancelled: 'border-rose-300 bg-rose-200/80 text-rose-950',
    no_show: 'border-fuchsia-300 bg-fuchsia-200/80 text-fuchsia-950',
  }[status || 'pending']
}

function bookingStatusBadge(status: GuesthouseBookingStatus) {
  return {
    pending: 'badge-warning',
    confirmed: 'badge-info',
    checked_in: 'badge-primary',
    checked_out: 'badge-success',
    cancelled: 'badge-error',
    no_show: 'badge-ghost',
  }[status] || 'badge-ghost'
}

function paymentStatusBadge(status: GuesthouseBookingPaymentStatus) {
  return {
    unpaid: 'badge-warning',
    partially_paid: 'badge-info',
    paid: 'badge-success',
    refunded: 'badge-ghost',
    voided: 'badge-error',
  }[status] || 'badge-ghost'
}

function clearFilters() {
  selectedRoomTypeId.value = ''
  selectedBookingStatus.value = ''
}

async function openSegmentBooking(segment: OccupancySegment) {
  if (!segment.bookingId) return

  selectedBooking.value = null
  bookingModalRef.value?.showModal()
  selectedBooking.value = await $fetch<GuesthouseBooking>(`/api/guesthouse/bookings/${segment.bookingId}`)
}

function closeBookingModal() {
  bookingModalRef.value?.close()
  selectedBooking.value = null
}

async function shiftOccupancyRange(days: number) {
  occupancyStartDate.value = addDateDays(occupancyStartDate.value, days)
  await refreshOccupancy()
}

async function jumpOccupancyToToday() {
  occupancyStartDate.value = todayDateInput()
  await refreshOccupancy()
}
</script>