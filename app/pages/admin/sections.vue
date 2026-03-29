<template>
  <div>
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-base-content">Sections</h1>
        <p class="text-sm text-base-content/50 mt-1">Manage all landing page content — like Elementor for your site</p>
        <div class="mt-2 flex flex-wrap gap-2">
          <span class="badge badge-soft badge-secondary">{{ businessType }}</span>
          <span class="badge badge-soft badge-sm font-mono">{{ template.key }}</span>
          <span v-if="isDraftScope" class="badge badge-soft badge-warning">Draft Scope</span>
        </div>
      </div>
      <div class="mt-3 sm:mt-0">
        <button class="btn btn-primary btn-sm" @click="openCreate()">
          <IconPlus class="w-4 h-4" /> Add Section
        </button>
      </div>
    </div>

    <!-- Sections Table -->
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body p-0">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr class="text-xs uppercase text-base-content/40">
                <th>Order</th>
                <th>Title</th>
                <th>Slug</th>
                <th>Status</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in sections" :key="s.id" class="hover">
                <td class="text-sm font-mono w-16">{{ s.sortOrder }}</td>
                <td class="text-sm font-medium">{{ s.title }}</td>
                <td class="text-sm text-base-content/50 font-mono">{{ s.slug }}</td>
                <td>
                  <span class="badge badge-soft badge-sm" :class="s.isActive ? 'badge-success' : 'badge-error'">
                    {{ s.isActive ? 'Active' : 'Draft' }}
                  </span>
                </td>
                <td class="text-right">
                  <button class="btn btn-ghost btn-xs" @click="openEdit(s)"><IconEdit class="w-4 h-4" /></button>
                  <button class="btn btn-ghost btn-xs text-error" @click="remove(s.id)"><IconTrash class="w-4 h-4" /></button>
                </td>
              </tr>
              <tr v-if="(sections || []).length === 0">
                <td colspan="5" class="text-center py-10">
                  <div class="flex flex-col items-center text-base-content/30">
                    <IconLayoutList class="w-10 h-10 mb-2" />
                    <p class="text-sm">No sections yet</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <dialog ref="modalRef" class="modal">
      <div class="modal-box w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-3 top-3" @click="closeModal()">
          <IconX class="w-4 h-4" />
        </button>
        <h3 class="font-bold text-lg mb-1">{{ editing ? 'Edit Section' : 'Add Section' }}</h3>
        <p v-if="editing" class="text-xs text-base-content/40 font-mono mb-4">slug: {{ form.slug }}</p>

        <form @submit.prevent="save()">
          <!-- ── Basic Info ── -->
          <div class="divider text-xs text-base-content/40 uppercase tracking-widest">Basic Info</div>

          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Section Title</legend>
            <input v-model="form.title" type="text" class="input w-full" required />
          </fieldset>

          <fieldset v-if="!editing" class="fieldset">
            <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Slug</legend>
            <input v-model="form.slug" type="text" class="input w-full" required />
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Subtitle</legend>
            <input v-model="form.subtitle" type="text" class="input w-full" />
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Body Text</legend>
            <TipTapEditor v-model="form.body" placeholder="Section body content..." />
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Image</legend>
            <div v-if="form.image" class="mb-2 relative group w-full aspect-video rounded overflow-hidden bg-base-200">
              <img :src="form.image" class="w-full h-full object-cover" />
              <button type="button" class="absolute top-1 right-1 btn btn-xs btn-error opacity-0 group-hover:opacity-100" @click="form.image = ''">Remove</button>
            </div>
            <div class="flex gap-2">
              <input v-model="form.image" type="text" class="input input-sm flex-1 font-mono" placeholder="Paste URL or pick from media..." />
              <button type="button" class="btn btn-sm btn-outline shrink-0" :disabled="!mediaLibraryEnabled" @click="pickerOpen = true">
                <IconPhoto class="w-4 h-4" />
              </button>
            </div>
            <p v-if="!mediaLibraryEnabled" class="label text-xs text-base-content/40">Media browser is disabled. Paste a direct image URL if needed.</p>
          </fieldset>

          <MediaPickerModal v-if="mediaLibraryEnabled" :open="pickerOpen" :selected="form.image" @close="pickerOpen = false" @pick="url => form.image = url" />

          <div class="grid grid-cols-2 gap-4">
            <fieldset class="fieldset">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Sort Order</legend>
              <input v-model.number="form.sortOrder" type="number" class="input w-full" />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Active</legend>
              <input v-model="form.isActive" type="checkbox" class="toggle toggle-primary mt-2" />
            </fieldset>
          </div>

          <!-- ── Content Blocks (per-slug metadata) ── -->
          <template v-if="metadataSchema.length > 0">
            <div class="divider text-xs text-base-content/40 uppercase tracking-widest mt-2">Content Blocks</div>
            <p class="text-xs text-base-content/40 mb-4 -mt-2">These fields control all the static text inside this section on the landing page.</p>

            <template v-for="group in metadataSchema" :key="group.group">
              <p v-if="group.group" class="text-xs font-semibold uppercase tracking-widest text-secondary mb-2 mt-4">{{ group.group }}</p>
              <div :class="group.fields.length > 1 && !group.fields.some(f => f.multiline) ? 'grid grid-cols-1 sm:grid-cols-2 gap-x-4' : ''">
                <fieldset v-for="field in group.fields" :key="field.key" class="fieldset">
                  <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">{{ field.label }}</legend>
                  <textarea
                    v-if="field.multiline"
                    v-model="form.metadata[field.key]"
                    class="textarea w-full text-sm"
                    rows="2"
                    :placeholder="field.placeholder"
                  />
                  <input
                    v-else
                    v-model="form.metadata[field.key]"
                    type="text"
                    class="input w-full"
                    :placeholder="field.placeholder"
                  />
                </fieldset>
              </div>
            </template>
          </template>

          <div class="modal-action">
            <button type="button" class="btn btn-ghost btn-sm" @click="closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary btn-sm" :disabled="saving">
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop" @click="closeModal()"><button>close</button></form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { IconPlus, IconEdit, IconTrash, IconX, IconLayoutList, IconPhoto } from '@tabler/icons-vue'
import { useTemplate } from '~/composables/useTemplate'
import { SECTION_METADATA_SCHEMA } from '~/templates/sectionSchemas'
import type { Section } from '~/types'
import { isFeatureEnabled } from '~/composables/usePlan'

type MetaSchema = (typeof SECTION_METADATA_SCHEMA)[string]

// ---------- State ----------
const pickerOpen = ref(false)
const route = useRoute()
const { data: settings } = await useFetch<Record<string, string>>('/api/settings', {
  key: 'site-settings',
})
const previewTemplateKey = computed(() => typeof route.query.templateKey === 'string' ? route.query.templateKey : undefined)
const previewBusinessType = computed(() => typeof route.query.businessType === 'string' ? route.query.businessType : undefined)
const { businessType, template } = useTemplate(settings, {
  businessType: previewBusinessType,
  templateKey: previewTemplateKey,
})
const mediaLibraryEnabled = computed(() => isFeatureEnabled(settings.value, 'mediaLibrary'))
const isDraftScope = computed(() => route.query.mode === 'draft')
const { data: sections, refresh } = await useFetch<Section[]>('/api/sections', {
  query: computed(() => ({
    businessType: businessType.value,
    templateKey: template.value.key,
  })),
})
const modalRef = ref<HTMLDialogElement>()
const editing = ref<string | null>(null)
const saving = ref(false)

const defaultForm = () => ({
  title: '',
  slug: '',
  subtitle: '',
  body: '',
  image: '',
  sortOrder: 0,
  isActive: true,
  metadata: {} as Record<string, string>,
})
const form = ref(defaultForm())

const metadataSchema = computed<MetaSchema>(() => SECTION_METADATA_SCHEMA[form.value.slug] ?? [])

// ---------- Actions ----------
function openCreate() {
  editing.value = null
  form.value = defaultForm()
  modalRef.value?.showModal()
}

function openEdit(s: Section) {
  editing.value = s.id
  form.value = {
    title: s.title,
    slug: s.slug,
    subtitle: s.subtitle || '',
    body: s.body || '',
    image: s.image || '',
    sortOrder: s.sortOrder,
    isActive: s.isActive,
    metadata: s.metadata ? { ...(s.metadata as Record<string, string>) } : {},
  }
  modalRef.value?.showModal()
}

function closeModal() {
  modalRef.value?.close()
}

async function save() {
  saving.value = true
  try {
    const payload = {
      ...form.value,
      businessType: businessType.value,
      templateKey: template.value.key,
    }
    if (editing.value) {
      await $fetch(`/api/sections/${editing.value}`, { method: 'PUT', body: payload })
    } else {
      await $fetch('/api/sections', { method: 'POST', body: payload })
    }
    closeModal()
    await refresh()
  } finally {
    saving.value = false
  }
}

async function remove(id: string) {
  if (!confirm('Delete this section?')) return
  await $fetch(`/api/sections/${id}`, { method: 'DELETE' })
  await refresh()
}
</script>
