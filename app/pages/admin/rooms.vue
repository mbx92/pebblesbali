<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-base-content">Rooms</h1>
        <p class="mt-1 text-sm text-base-content/50">Manage room types, nightly rates, and physical room inventory for the guesthouse.</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button class="btn btn-sm" :class="showFeaturedOnly ? 'btn-secondary text-secondary-content' : 'btn-ghost'" @click="showFeaturedOnly = !showFeaturedOnly">
          {{ showFeaturedOnly ? 'Showing Featured' : 'Featured Only' }}
        </button>
        <button class="btn btn-sm btn-outline" @click="openUnitCreate()">
          <IconPlus class="w-4 h-4" /> Add Room Unit
        </button>
        <button class="btn btn-sm btn-primary" @click="openTypeCreate()">
          <IconPlus class="w-4 h-4" /> Add Room Type
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] gap-6">
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body p-0">
          <div class="flex items-center justify-between px-5 pt-5 pb-3">
            <div>
              <h2 class="font-semibold text-base-content">Room Types</h2>
              <p class="text-xs text-base-content/40 mt-1">Commercial room categories shown to guests.</p>
            </div>
            <span class="badge badge-soft badge-sm">{{ visibleRoomTypes.length }} types</span>
          </div>

          <div v-if="visibleRoomTypes.length" class="divide-y divide-base-200">
            <div v-for="roomType in visibleRoomTypes" :key="roomType.id" class="px-5 py-4 hover:bg-base-200/40 transition-colors cursor-pointer" @click="openTypeEdit(roomType)">
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h3 class="font-semibold text-base-content">{{ roomType.name }}</h3>
                    <span class="badge badge-soft badge-sm" :class="roomType.isActive ? 'badge-success' : 'badge-error'">{{ roomType.isActive ? 'Active' : 'Draft' }}</span>
                  </div>
                  <p class="text-xs font-mono text-base-content/35 mt-1">/{{ roomType.slug }}</p>
                  <p class="text-sm text-base-content/55 mt-2 line-clamp-2">{{ plainText(roomType.description) || 'No description yet' }}</p>
                </div>
                <div class="text-right shrink-0">
                  <p class="text-sm font-semibold text-primary">{{ formatIdr(roomType.defaultNightlyRate) }}</p>
                  <p class="text-xs text-base-content/40 mt-1">{{ roomType.baseOccupancy }} base · {{ roomType.maxOccupancy }} max</p>
                </div>
              </div>
              <div class="mt-3 flex items-center gap-3 text-xs text-base-content/45 flex-wrap">
                <span v-if="roomType.metadata?.featured" class="badge badge-soft badge-secondary badge-sm">Featured</span>
                <span>{{ roomType._count?.roomUnits || 0 }} units</span>
                <span>{{ roomType._count?.bookingRooms || 0 }} booking lines</span>
                <span v-if="roomType.bedConfiguration">{{ roomType.bedConfiguration }}</span>
              </div>
              <div v-if="roomType.metadata?.facilities?.length" class="mt-2 flex flex-wrap gap-2">
                <span v-for="facility in roomType.metadata.facilities" :key="facility" class="badge badge-soft badge-sm">{{ facility }}</span>
              </div>
            </div>
          </div>

          <div v-else class="px-5 py-12 text-center text-base-content/40">
            <IconBed class="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p>No room types yet</p>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body">
            <h2 class="font-semibold text-base-content">Property</h2>
            <div v-if="property" class="mt-3 space-y-2 text-sm text-base-content/65">
              <p class="font-medium text-base-content">{{ property.name }}</p>
              <p>{{ property.address || 'Address follows current site settings.' }}</p>
              <p class="text-xs text-base-content/40">Check-in {{ property.checkInTime || '-' }} · Check-out {{ property.checkOutTime || '-' }}</p>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 border border-base-300">
          <div class="card-body p-0">
            <div class="flex items-center justify-between px-5 pt-5 pb-3">
              <div>
                <h2 class="font-semibold text-base-content">Room Units</h2>
                <p class="text-xs text-base-content/40 mt-1">Actual rooms used for availability inventory.</p>
              </div>
              <span class="badge badge-soft badge-sm">{{ roomUnits.length }} units</span>
            </div>

            <div v-if="roomUnits.length" class="divide-y divide-base-200">
              <div v-for="unit in roomUnits" :key="unit.id" class="px-5 py-3 hover:bg-base-200/40 cursor-pointer transition-colors" @click="openUnitEdit(unit)">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p class="font-medium text-sm text-base-content">{{ unit.code }} <span v-if="unit.name" class="text-base-content/45">· {{ unit.name }}</span></p>
                    <p class="text-xs text-base-content/40 mt-1">{{ unit.roomType?.name || 'Unknown room type' }}</p>
                  </div>
                  <div class="text-right">
                    <span class="badge badge-soft badge-sm" :class="unitStatusBadge(unit.status)">{{ unit.status }}</span>
                    <p class="text-xs text-base-content/35 mt-1">{{ unit.isBookable ? 'Bookable' : 'Hidden' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="px-5 py-12 text-center text-base-content/40">
              <IconDoor class="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No room units yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <dialog ref="typeModalRef" class="modal">
      <div class="modal-box max-w-3xl">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-3 top-3" @click="closeTypeModal()">
          <IconX class="w-4 h-4" />
        </button>
        <h3 class="font-bold text-lg mb-4">{{ editingTypeId ? 'Edit Room Type' : 'Add Room Type' }}</h3>

        <form @submit.prevent="saveRoomType()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <fieldset class="fieldset">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Name</legend>
              <input v-model="typeForm.name" type="text" class="input w-full" required />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Slug</legend>
              <input v-model="typeForm.slug" type="text" class="input w-full" required />
            </fieldset>
          </div>

          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Description</legend>
            <TipTapEditor v-model="typeForm.description" placeholder="Describe this room type..." />
          </fieldset>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <fieldset class="fieldset">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Base Occupancy</legend>
              <input v-model.number="typeForm.baseOccupancy" type="number" min="1" class="input w-full" />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Max Occupancy</legend>
              <input v-model.number="typeForm.maxOccupancy" type="number" min="1" class="input w-full" />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Bedrooms</legend>
              <input v-model.number="typeForm.bedroomCount" type="number" min="0" class="input w-full" />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Bathrooms</legend>
              <input v-model.number="typeForm.bathroomCount" type="number" min="0" class="input w-full" />
            </fieldset>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <fieldset class="fieldset md:col-span-2">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Bed Configuration</legend>
              <input v-model="typeForm.bedConfiguration" type="text" class="input w-full" placeholder="e.g. 1 king bed + sofa bed" />
            </fieldset>
            <fieldset class="fieldset md:col-span-2">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Image URL</legend>
              <div v-if="typeForm.imageUrl" class="mb-2 relative group w-full aspect-video rounded overflow-hidden bg-base-200">
                <img :src="typeForm.imageUrl" class="w-full h-full object-cover" />
                <button type="button" class="absolute top-1 right-1 btn btn-xs btn-error opacity-0 group-hover:opacity-100" @click="typeForm.imageUrl = ''">Remove</button>
              </div>
              <div class="flex gap-2">
                <input v-model="typeForm.imageUrl" type="text" class="input w-full font-mono" placeholder="https://..." />
                <button type="button" class="btn btn-outline shrink-0" :disabled="!mediaLibraryEnabled" @click="typeImagePickerOpen = true">
                  <IconPhoto class="w-4 h-4" />
                </button>
              </div>
              <p v-if="!mediaLibraryEnabled" class="label text-xs text-base-content/40">Media browser is disabled. Paste a direct image URL if needed.</p>
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Area (sqm)</legend>
              <input v-model.number="typeForm.areaSqm" type="number" min="0" class="input w-full" />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Sort Order</legend>
              <input v-model.number="typeForm.sortOrder" type="number" class="input w-full" />
            </fieldset>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <fieldset class="fieldset">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Nightly Rate (IDR)</legend>
              <input v-model.number="typeForm.defaultNightlyRate" type="number" min="0" class="input w-full" />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Extra Adult Rate</legend>
              <input v-model.number="typeForm.extraAdultRate" type="number" min="0" class="input w-full" />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Extra Child Rate</legend>
              <input v-model.number="typeForm.extraChildRate" type="number" min="0" class="input w-full" />
            </fieldset>
          </div>

          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Facilities</legend>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              <label v-for="facility in ROOM_TYPE_FACILITIES" :key="facility" class="label cursor-pointer justify-start gap-3 rounded-lg border border-base-300 px-3 py-2">
                <input :checked="typeForm.facilities.includes(facility)" type="checkbox" class="checkbox checkbox-sm checkbox-primary" @change="toggleFacility(facility, ($event.target as HTMLInputElement).checked)" />
                <span class="label-text text-sm">{{ facility }}</span>
              </label>
            </div>
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Active</legend>
            <div class="flex items-center gap-6 mt-2">
              <label class="label cursor-pointer justify-start gap-3">
                <input v-model="typeForm.isActive" type="checkbox" class="toggle toggle-primary" />
                <span class="label-text">Active</span>
              </label>
              <label class="label cursor-pointer justify-start gap-3">
                <input v-model="typeForm.featured" type="checkbox" class="toggle toggle-secondary" />
                <span class="label-text">Featured on landing</span>
              </label>
            </div>
          </fieldset>

          <div class="modal-action">
            <button v-if="editingTypeId" type="button" class="btn btn-error btn-sm mr-auto" @click="removeRoomType(editingTypeId)">Delete</button>
            <button type="button" class="btn btn-ghost btn-sm" @click="closeTypeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary btn-sm" :disabled="savingType">{{ savingType ? 'Saving...' : 'Save' }}</button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop" @click="closeTypeModal()"><button>close</button></form>
    </dialog>

    <dialog ref="unitModalRef" class="modal">
      <div class="modal-box max-w-xl">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-3 top-3" @click="closeUnitModal()">
          <IconX class="w-4 h-4" />
        </button>
        <h3 class="font-bold text-lg mb-4">{{ editingUnitId ? 'Edit Room Unit' : 'Add Room Unit' }}</h3>

        <form @submit.prevent="saveRoomUnit()" class="space-y-4">
          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Room Type</legend>
            <select v-model="unitForm.roomTypeId" class="select w-full" required>
              <option value="" disabled>Select room type</option>
              <option v-for="roomType in roomTypes" :key="roomType.id" :value="roomType.id">{{ roomType.name }}</option>
            </select>
          </fieldset>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <fieldset class="fieldset">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Code</legend>
              <input v-model="unitForm.code" type="text" class="input w-full" required />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Display Name</legend>
              <input v-model="unitForm.name" type="text" class="input w-full" />
            </fieldset>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <fieldset class="fieldset">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Floor</legend>
              <input v-model="unitForm.floor" type="text" class="input w-full" />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Status</legend>
              <select v-model="unitForm.status" class="select w-full">
                <option value="active">active</option>
                <option value="maintenance">maintenance</option>
                <option value="inactive">inactive</option>
              </select>
            </fieldset>
          </div>

          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Bookable</legend>
            <input v-model="unitForm.isBookable" type="checkbox" class="toggle toggle-primary mt-2" />
          </fieldset>

          <div class="modal-action">
            <button v-if="editingUnitId" type="button" class="btn btn-error btn-sm mr-auto" @click="removeRoomUnit(editingUnitId)">Delete</button>
            <button type="button" class="btn btn-ghost btn-sm" @click="closeUnitModal()">Cancel</button>
            <button type="submit" class="btn btn-primary btn-sm" :disabled="savingUnit">{{ savingUnit ? 'Saving...' : 'Save' }}</button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop" @click="closeUnitModal()"><button>close</button></form>
    </dialog>

    <MediaPickerModal v-if="mediaLibraryEnabled" :open="typeImagePickerOpen" :selected="typeForm.imageUrl" @close="typeImagePickerOpen = false" @pick="url => typeForm.imageUrl = url" />
  </div>
</template>

<script setup lang="ts">
import { IconBed, IconDoor, IconPhoto, IconPlus, IconX } from '@tabler/icons-vue'
import { useTemplate } from '~/composables/useTemplate'
import type { Property, RoomType, RoomUnit, RoomUnitStatus } from '~/types'
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

const { data: roomTypesResponse, refresh: refreshRoomTypes } = await useFetch<{ property: Property, roomTypes: RoomType[] }>('/api/guesthouse/room-types')
const { data: roomUnitsResponse, refresh: refreshRoomUnits } = await useFetch<{ property: Property, roomUnits: RoomUnit[] }>('/api/guesthouse/room-units')

const property = computed(() => roomTypesResponse.value?.property || roomUnitsResponse.value?.property || null)
const roomTypes = computed(() => roomTypesResponse.value?.roomTypes || [])
const roomUnits = computed(() => roomUnitsResponse.value?.roomUnits || [])

const typeModalRef = ref<HTMLDialogElement>()
const unitModalRef = ref<HTMLDialogElement>()
const editingTypeId = ref<string | null>(null)
const editingUnitId = ref<string | null>(null)
const savingType = ref(false)
const savingUnit = ref(false)
const typeImagePickerOpen = ref(false)
const showFeaturedOnly = ref(false)
const mediaLibraryEnabled = computed(() => isFeatureEnabled(settings.value, 'mediaLibrary'))

const ROOM_TYPE_FACILITIES = [
  'Private terrace',
  'Breakfast included',
  'Workspace',
  'Bathtub',
  'Pool access',
  'Air conditioning',
  'Wi-Fi',
  'Kitchenette',
  'Smart TV',
]

const defaultTypeForm = () => ({
  name: '',
  slug: '',
  description: '',
  baseOccupancy: 2,
  maxOccupancy: 2,
  bedroomCount: 1,
  bathroomCount: 1,
  bedConfiguration: '',
  areaSqm: 0,
  defaultNightlyRate: 0,
  extraAdultRate: 0,
  extraChildRate: 0,
  sortOrder: 0,
  isActive: true,
  featured: false,
  facilities: [] as string[],
  imageUrl: '',
})

const defaultUnitForm = () => ({
  roomTypeId: '',
  code: '',
  name: '',
  floor: '',
  status: 'active' as RoomUnitStatus,
  isBookable: true,
})

const typeForm = ref(defaultTypeForm())
const unitForm = ref(defaultUnitForm())
const visibleRoomTypes = computed(() => showFeaturedOnly.value
  ? roomTypes.value.filter(roomType => roomType.metadata?.featured)
  : roomTypes.value)

function formatIdr(value: number | string) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value || 0))
}

function plainText(value?: string | null) {
  return String(value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function unitStatusBadge(status: RoomUnitStatus) {
  return {
    active: 'badge-success',
    maintenance: 'badge-warning',
    inactive: 'badge-error',
  }[status] || 'badge-ghost'
}

function openTypeCreate() {
  editingTypeId.value = null
  typeForm.value = defaultTypeForm()
  typeModalRef.value?.showModal()
}

function openTypeEdit(roomType: RoomType) {
  editingTypeId.value = roomType.id
  typeForm.value = {
    name: roomType.name,
    slug: roomType.slug,
    description: roomType.description || '',
    baseOccupancy: roomType.baseOccupancy,
    maxOccupancy: roomType.maxOccupancy,
    bedroomCount: Number(roomType.bedroomCount || 0),
    bathroomCount: Number(roomType.bathroomCount || 0),
    bedConfiguration: roomType.bedConfiguration || '',
    areaSqm: Number(roomType.areaSqm || 0),
    defaultNightlyRate: Number(roomType.defaultNightlyRate || 0),
    extraAdultRate: Number(roomType.extraAdultRate || 0),
    extraChildRate: Number(roomType.extraChildRate || 0),
    sortOrder: roomType.sortOrder,
    isActive: roomType.isActive,
    featured: Boolean(roomType.metadata?.featured),
    facilities: [...(roomType.metadata?.facilities || [])],
    imageUrl: roomType.metadata?.imageUrl || '',
  }
  typeModalRef.value?.showModal()
}

function toggleFacility(facility: string, checked: boolean) {
  if (checked) {
    if (!typeForm.value.facilities.includes(facility)) {
      typeForm.value.facilities = [...typeForm.value.facilities, facility]
    }
    return
  }

  typeForm.value.facilities = typeForm.value.facilities.filter(item => item !== facility)
}

function closeTypeModal() {
  typeModalRef.value?.close()
}

async function saveRoomType() {
  savingType.value = true
  try {
    if (editingTypeId.value) {
      await $fetch(`/api/guesthouse/room-types/${editingTypeId.value}`, { method: 'PUT', body: typeForm.value })
    } else {
      await $fetch('/api/guesthouse/room-types', { method: 'POST', body: typeForm.value })
    }
    await refreshRoomTypes()
    await refreshRoomUnits()
    closeTypeModal()
  } finally {
    savingType.value = false
  }
}

async function removeRoomType(id: string) {
  if (!confirm('Delete this room type? Related room units must be removed first.')) return
  await $fetch(`/api/guesthouse/room-types/${id}`, { method: 'DELETE' })
  await refreshRoomTypes()
  closeTypeModal()
}

function openUnitCreate() {
  editingUnitId.value = null
  unitForm.value = {
    ...defaultUnitForm(),
    roomTypeId: roomTypes.value[0]?.id || '',
  }
  unitModalRef.value?.showModal()
}

function openUnitEdit(unit: RoomUnit) {
  editingUnitId.value = unit.id
  unitForm.value = {
    roomTypeId: unit.roomTypeId,
    code: unit.code,
    name: unit.name || '',
    floor: unit.floor || '',
    status: unit.status,
    isBookable: unit.isBookable,
  }
  unitModalRef.value?.showModal()
}

function closeUnitModal() {
  unitModalRef.value?.close()
}

async function saveRoomUnit() {
  savingUnit.value = true
  try {
    if (editingUnitId.value) {
      await $fetch(`/api/guesthouse/room-units/${editingUnitId.value}`, { method: 'PUT', body: unitForm.value })
    } else {
      await $fetch('/api/guesthouse/room-units', { method: 'POST', body: unitForm.value })
    }
    await refreshRoomUnits()
    await refreshRoomTypes()
    closeUnitModal()
  } finally {
    savingUnit.value = false
  }
}

async function removeRoomUnit(id: string) {
  if (!confirm('Delete this room unit?')) return
  await $fetch(`/api/guesthouse/room-units/${id}`, { method: 'DELETE' })
  await refreshRoomUnits()
  await refreshRoomTypes()
  closeUnitModal()
}
</script>