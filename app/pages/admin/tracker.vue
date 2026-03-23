<template>
  <div>
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-base-content">Tracker</h1>
        <p class="text-sm text-base-content/50 mt-1">Catat dan sync bugs, tasks, dan features ke OCS Workspace</p>
      </div>
      <button class="btn btn-primary btn-sm mt-3 sm:mt-0" @click="openCreate(activeTab)">
        <IconPlus class="w-4 h-4" />
        Add {{ TAB_LABELS[activeTab] }}
      </button>
    </div>

    <!-- Not configured warning -->
    <div v-if="notConfigured" class="alert alert-warning mb-6">
      <IconAlertTriangle class="w-5 h-5 shrink-0" />
      <div>
        <p class="font-semibold">OCS Workspace belum terkonfigurasi</p>
        <p class="text-sm">Atur kredensial koneksi di halaman
          <NuxtLink to="/admin/integrations" class="underline font-medium">Integrations</NuxtLink>
          terlebih dahulu.
        </p>
      </div>
    </div>

    <!-- Tabs -->
    <div role="tablist" class="tabs tabs-box mb-5 w-fit">
      <button
        v-for="tab in TABS"
        :key="tab.type"
        role="tab"
        class="tab gap-2"
        :class="activeTab === tab.type ? 'tab-active' : ''"
        @click="switchTab(tab.type)"
      >
        <component :is="tab.icon" class="w-4 h-4" />
        {{ tab.label }}
        <span v-if="countByType[tab.type]" class="badge badge-sm" :class="tab.badgeClass">
          {{ countByType[tab.type] }}
        </span>
      </button>
    </div>

    <!-- Records List -->
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body p-0">
        <!-- Loading -->
        <div v-if="loading" class="flex justify-center py-16">
          <span class="loading loading-spinner loading-md"></span>
        </div>

        <!-- Empty -->
        <div v-else-if="!filteredRecords.length" class="flex flex-col items-center py-16 text-base-content/30">
          <component :is="TABS.find(t => t.type === activeTab)!.icon" class="w-12 h-12 mb-3" />
          <p class="text-sm font-medium">Belum ada {{ TAB_LABELS[activeTab] }}</p>
          <p class="text-xs mt-1">Klik <strong>Add {{ TAB_LABELS[activeTab] }}</strong> untuk menambahkan</p>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="table table-sm">
            <thead>
              <tr class="bg-base-200/50 text-xs uppercase tracking-wide text-base-content/50">
                <th>ID</th>
                <th>Title</th>
                <th>Status</th>
                <th v-if="activeTab === 'bug'">Severity</th>
                <th v-if="activeTab === 'task'">Priority</th>
                <th v-if="activeTab === 'feature'">Priority</th>
                <th v-if="activeTab === 'feature'">Release</th>
                <th>Last Seen</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rec in filteredRecords" :key="rec.id" class="hover:bg-base-200/30">
                <td class="font-mono text-xs text-base-content/50 whitespace-nowrap">{{ rec.sourceId }}</td>
                <td class="max-w-xs">
                  <p class="font-medium text-sm truncate">{{ rec.sourcePayloadJson?.title || '—' }}</p>
                  <p v-if="rec.sourcePayloadJson?.description" class="text-xs text-base-content/40 truncate mt-0.5">
                    {{ rec.sourcePayloadJson.description }}
                  </p>
                </td>
                <td>
                  <span v-if="rec.sourceStatus" class="badge badge-sm badge-soft" :class="statusBadge(rec.sourceStatus)">
                    {{ rec.sourceStatus }}
                  </span>
                  <span v-else class="text-base-content/30 text-xs">—</span>
                </td>
                <td v-if="activeTab === 'bug'">
                  <span v-if="rec.sourcePayloadJson?.severity" class="badge badge-xs badge-soft" :class="severityBadge(rec.sourcePayloadJson.severity)">
                    {{ rec.sourcePayloadJson.severity }}
                  </span>
                  <span v-else class="text-base-content/30 text-xs">—</span>
                </td>
                <td v-if="activeTab === 'task' || activeTab === 'feature'">
                  <span v-if="rec.sourcePayloadJson?.priority" class="badge badge-xs badge-soft" :class="priorityBadge(rec.sourcePayloadJson.priority)">
                    {{ rec.sourcePayloadJson.priority }}
                  </span>
                  <span v-else class="text-base-content/30 text-xs">—</span>
                </td>
                <td v-if="activeTab === 'feature'" class="text-xs text-base-content/60">
                  {{ rec.sourcePayloadJson?.targetRelease || '—' }}
                </td>
                <td class="text-xs text-base-content/40 whitespace-nowrap">
                  {{ formatDate(rec.lastSeenAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <dialog class="modal" :open="showModal">
      <div class="modal-box max-w-lg">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-3 top-3" @click="showModal = false">
          <IconX class="w-4 h-4" />
        </button>
        <h3 class="font-bold text-lg mb-1">Add {{ TAB_LABELS[modalType] }}</h3>
        <p class="text-xs text-base-content/50 mb-5">Record akan langsung di-push ke OCS Workspace</p>

        <form @submit.prevent="submit">
          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Title <span class="text-error">*</span></legend>
            <input v-model="form.title" type="text" class="input w-full" required placeholder="Deskripsikan secara singkat..." />
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Description</legend>
            <textarea v-model="form.description" class="textarea w-full" rows="3" placeholder="Detail tambahan (opsional)"></textarea>
          </fieldset>

          <div class="grid grid-cols-2 gap-3">
            <!-- Status -->
            <fieldset class="fieldset">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Status</legend>
              <select v-model="form.status" class="select select-sm w-full">
                <option value="">— pilih —</option>
                <option v-for="s in STATUS_OPTIONS[modalType]" :key="s" :value="s">{{ s }}</option>
              </select>
            </fieldset>

            <!-- Priority (task & feature) or Severity (bug) -->
            <fieldset v-if="modalType === 'bug'" class="fieldset">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Severity</legend>
              <select v-model="form.severity" class="select select-sm w-full">
                <option value="">— pilih —</option>
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
                <option value="critical">critical</option>
              </select>
            </fieldset>
            <fieldset v-else class="fieldset">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Priority</legend>
              <select v-model="form.priority" class="select select-sm w-full">
                <option value="">— pilih —</option>
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
                <option value="critical">critical</option>
              </select>
            </fieldset>
          </div>

          <!-- Due Date (task & bug) -->
          <fieldset v-if="modalType !== 'feature'" class="fieldset">
            <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Due Date</legend>
            <input v-model="form.dueDate" type="date" class="input input-sm w-full" />
          </fieldset>

          <!-- Feature-specific fields -->
          <template v-if="modalType === 'feature'">
            <fieldset class="fieldset">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Target Release</legend>
              <input v-model="form.targetRelease" type="text" class="input input-sm w-full" placeholder="e.g. v2.1" />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Business Value</legend>
              <textarea v-model="form.businessValue" class="textarea textarea-sm w-full" rows="2" placeholder="Mengapa feature ini penting?"></textarea>
            </fieldset>
          </template>

          <div v-if="submitError" class="alert alert-error py-2 mt-2 text-sm">{{ submitError }}</div>

          <div class="modal-action mt-4">
            <button type="button" class="btn btn-ghost btn-sm" @click="showModal = false">Cancel</button>
            <button type="submit" class="btn btn-primary btn-sm" :disabled="submitting">
              <span v-if="submitting" class="loading loading-spinner loading-xs"></span>
              {{ submitting ? 'Pushing...' : 'Push to OCS' }}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop" @click="showModal = false"><button>close</button></form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { IconPlus, IconX, IconBug, IconCheckbox, IconSparkles, IconAlertTriangle } from '@tabler/icons-vue'

definePageMeta({ layout: 'default' })

// ── Constants ────────────────────────────────────────────────────────────────

type EntityType = 'task' | 'feature' | 'bug'

const TABS = [
  { type: 'task' as EntityType, label: 'Tasks', icon: IconCheckbox, badgeClass: 'badge-info' },
  { type: 'feature' as EntityType, label: 'Features', icon: IconSparkles, badgeClass: 'badge-secondary' },
  { type: 'bug' as EntityType, label: 'Bugs', icon: IconBug, badgeClass: 'badge-error' },
]

const TAB_LABELS: Record<EntityType, string> = { task: 'Task', feature: 'Feature', bug: 'Bug' }

const STATUS_OPTIONS: Record<EntityType, string[]> = {
  task: ['todo', 'in-progress', 'blocked', 'review', 'done'],
  feature: ['backlog', 'planned', 'in-progress', 'blocked', 'done', 'cancelled'],
  bug: ['open', 'in-progress', 'resolved', 'verified', 'closed'],
}

// ── State ────────────────────────────────────────────────────────────────────

const activeTab = ref<EntityType>('task')
const loading = ref(false)
const notConfigured = ref(false)
const allRecords = ref<any[]>([])

const showModal = ref(false)
const modalType = ref<EntityType>('task')
const submitting = ref(false)
const submitError = ref('')

const form = ref({
  title: '',
  description: '',
  status: '',
  priority: '',
  severity: '',
  dueDate: '',
  targetRelease: '',
  businessValue: '',
})

// ── Computed ─────────────────────────────────────────────────────────────────

const filteredRecords = computed(() =>
  allRecords.value.filter(r => r.sourceEntityType === activeTab.value),
)

const countByType = computed(() => {
  const counts: Record<string, number> = {}
  for (const r of allRecords.value) {
    counts[r.sourceEntityType] = (counts[r.sourceEntityType] || 0) + 1
  }
  return counts
})

// ── Methods ──────────────────────────────────────────────────────────────────

async function loadRecords() {
  loading.value = true
  try {
    const data = await $fetch<{ records: any[]; notConfigured?: boolean }>('/api/tracker')
    if (data.notConfigured) notConfigured.value = true
    allRecords.value = data.records || []
  } finally {
    loading.value = false
  }
}

function switchTab(type: EntityType) {
  activeTab.value = type
}

function openCreate(type: EntityType) {
  modalType.value = type
  form.value = { title: '', description: '', status: '', priority: '', severity: '', dueDate: '', targetRelease: '', businessValue: '' }
  submitError.value = ''
  showModal.value = true
}

async function submit() {
  submitting.value = true
  submitError.value = ''
  try {
    await $fetch('/api/tracker', {
      method: 'POST',
      body: {
        sourceEntityType: modalType.value,
        title: form.value.title,
        description: form.value.description || undefined,
        status: form.value.status || undefined,
        priority: form.value.priority || undefined,
        severity: form.value.severity || undefined,
        dueDate: form.value.dueDate || undefined,
        targetRelease: form.value.targetRelease || undefined,
        businessValue: form.value.businessValue || undefined,
      },
    })
    showModal.value = false
    activeTab.value = modalType.value
    await loadRecords()
  } catch (err: any) {
    submitError.value = err?.data?.statusMessage || 'Gagal push ke OCS'
  } finally {
    submitting.value = false
  }
}

function formatDate(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    open: 'badge-error', 'in-progress': 'badge-warning', resolved: 'badge-success',
    verified: 'badge-success', closed: 'badge-ghost', done: 'badge-success',
    todo: 'badge-ghost', blocked: 'badge-error', review: 'badge-info',
    planned: 'badge-info', backlog: 'badge-ghost', cancelled: 'badge-ghost',
  }
  return map[status] || 'badge-ghost'
}

function severityBadge(severity: string) {
  const map: Record<string, string> = { low: 'badge-success', medium: 'badge-warning', high: 'badge-error', critical: 'badge-error' }
  return map[severity] || 'badge-ghost'
}

function priorityBadge(priority: string) {
  const map: Record<string, string> = { low: 'badge-ghost', medium: 'badge-info', high: 'badge-warning', critical: 'badge-error' }
  return map[priority] || 'badge-ghost'
}

onMounted(loadRecords)
</script>
