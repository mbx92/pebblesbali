<template>
  <div>
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-base-content">OCS Integration</h1>
        <p class="text-sm text-base-content/50 mt-1">Hubungkan CMS ini ke OCS Workspace untuk sync order, bugs, tasks, dan features</p>
      </div>
      <NuxtLink to="/admin/settings" class="btn btn-sm btn-ghost mt-3 sm:mt-0">
        <IconArrowLeft class="w-4 h-4" /> Back to Settings
      </NuxtLink>
    </div>

    <!-- Connection Status -->
    <div class="card bg-base-100 border mb-6"
      :class="isConfigured ? 'border-success/40 bg-success/5' : 'border-warning/40 bg-warning/5'">
      <div class="card-body py-4">
        <div class="flex items-center gap-3">
          <span class="flex h-3 w-3 rounded-full shrink-0" :class="isConfigured ? 'bg-success' : 'bg-warning'"></span>
          <p class="text-sm font-semibold" :class="isConfigured ? 'text-success' : 'text-warning'">
            {{ isConfigured ? 'Terkoneksi ke OCS Workspace' : 'Belum terkonfigurasi' }}
          </p>
          <button
            v-if="isConfigured"
            type="button"
            class="btn btn-xs btn-ghost ml-auto"
            :class="testStatus === 'loading' ? 'loading' : ''"
            :disabled="testStatus === 'loading'"
            @click="testConnection"
          >
            <IconRefresh v-if="testStatus !== 'loading'" class="w-3.5 h-3.5" />
            {{ testStatus === 'loading' ? 'Testing...' : testStatus === 'ok' ? '✓ Connected' : testStatus === 'fail' ? '✗ Failed' : 'Test Connection' }}
          </button>
        </div>
        <p v-if="isConfigured" class="text-xs text-base-content/50 ml-6">
          URL: <code class="font-mono">{{ form.ocsUrl }}</code> ·
          Connection: <code class="font-mono">{{ form.ocsConnectionId?.slice(0, 8) }}…</code>
        </p>
        <p v-if="form.licenseValidationUrl" class="text-xs text-base-content/40 ml-6">
          License validator: <code class="font-mono">{{ form.licenseValidationUrl }}</code>
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

      <!-- Credentials Card -->
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body">
          <div class="flex items-center gap-2 mb-3">
            <IconPlugConnected class="w-5 h-5 text-primary" />
            <h2 class="font-semibold text-sm uppercase tracking-wide text-base-content/50">Kredensial Koneksi</h2>
          </div>
          <p class="text-xs text-base-content/40 mb-4">
            Nilai-nilai ini didapat saat membuat koneksi di OCS Workspace
            (<code class="font-mono bg-base-200 px-1 rounded">/integrations</code>).
            Simpan di file <code class="font-mono bg-base-200 px-1 rounded">.env</code> pada server produksi — jangan commit ke git.
          </p>

          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">OCS_URL</legend>
            <input v-model="form.ocsUrl" type="url" class="input w-full font-mono" placeholder="https://workspace.ocnetworks.web.id" />
            <p class="label text-xs text-base-content/40">Base URL OCS Workspace tanpa trailing slash</p>
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">LICENSE_VALIDATION_URL</legend>
            <input v-model="form.licenseValidationUrl" type="url" class="input w-full font-mono" placeholder="http://localhost:3010" />
            <p class="label text-xs text-base-content/40">Opsional. Gunakan jika service validasi license berjalan terpisah dari OCS Workspace utama.</p>
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">OCS_CONNECTION_ID</legend>
            <input v-model="form.ocsConnectionId" type="text" class="input w-full font-mono" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
            <p class="label text-xs text-base-content/40">UUID koneksi yang di-generate oleh OCS</p>
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">OCS_PROJECT_ID</legend>
            <input v-model="form.ocsProjectId" type="text" class="input w-full font-mono" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
            <p class="label text-xs text-base-content/40">UUID project tujuan di OCS</p>
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">OCS_API_KEY</legend>
            <div class="relative">
              <input
                v-model="form.ocsApiKey"
                :type="showApiKey ? 'text' : 'password'"
                class="input w-full font-mono pr-10"
                placeholder="ocs_xxxxxxxxxxxx..."
              />
              <button
                type="button"
                class="absolute right-2 top-1/2 -translate-y-1/2 btn btn-xs btn-ghost"
                @click="showApiKey = !showApiKey"
              >
                <IconEye v-if="!showApiKey" class="w-4 h-4" />
                <IconEyeOff v-else class="w-4 h-4" />
              </button>
            </div>
            <p class="label text-xs text-base-content/40">Bearer API key — hanya tampil sekali saat koneksi dibuat. Gunakan rotate di OCS jika hilang.</p>
          </fieldset>

          <div class="alert alert-warning py-2 mt-1">
            <IconAlertTriangle class="w-4 h-4 shrink-0" />
            <span class="text-xs">
              Nilai ini disimpan ke file <code class="font-mono">.env</code> dan aktif setelah server di-restart.
              Jangan masukkan ke sini di production — update langsung di <code class="font-mono">.env</code> server.
            </span>
          </div>

          <div class="alert alert-info py-2 mt-3">
            <IconInfoCircle class="w-4 h-4 shrink-0" />
            <span class="text-xs">
              Validasi license CMS akan memakai <code class="font-mono">NUXT_LICENSE_VALIDATION_URL</code> bila diisi.
              Jika kosong, Pebbles fallback ke <code class="font-mono">NUXT_OCS_URL</code>.
            </span>
          </div>

          <div class="mt-4 flex gap-2">
            <button type="button" class="btn btn-primary btn-sm" :disabled="saving" @click="save">
              <span v-if="saving" class="loading loading-spinner loading-xs"></span>
              {{ saving ? 'Saving...' : 'Save Credentials' }}
            </button>
            <button type="button" class="btn btn-ghost btn-sm" @click="reset">Reset</button>
          </div>

          <div v-if="saveMsg" class="mt-3 text-xs" :class="saveMsgType === 'ok' ? 'text-success' : 'text-error'">
            {{ saveMsg }}
          </div>
        </div>
      </div>

      <!-- Right side: What gets synced -->
      <div class="flex flex-col gap-5">

        <!-- What gets synced -->
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body">
            <div class="flex items-center gap-2 mb-3">
              <IconArrowsExchange class="w-5 h-5 text-secondary" />
              <h2 class="font-semibold text-sm uppercase tracking-wide text-base-content/50">Data yang Di-sync</h2>
            </div>

            <div class="divide-y divide-base-200">
              <div v-for="item in SYNC_ITEMS" :key="item.type" class="flex items-center gap-3 py-2.5">
                <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" :class="item.bg">
                  <component :is="item.icon" class="w-4 h-4" :class="item.color" />
                </span>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-base-content">{{ item.label }}</p>
                  <p class="text-xs text-base-content/50">{{ item.desc }}</p>
                </div>
                <template v-if="item.type === 'order'">
                  <input
                    type="checkbox"
                    class="toggle toggle-sm toggle-success"
                    :checked="syncOrders"
                    :disabled="!isConfigured"
                    @change="toggleSyncOrders"
                  />
                </template>
                <template v-else>
                  <span class="badge badge-soft badge-sm" :class="item.badgeClass">{{ item.status }}</span>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- Sync Stats -->
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <IconChartBar class="w-5 h-5 text-base-content/60" />
                <h2 class="font-semibold text-sm uppercase tracking-wide text-base-content/50">Sync Status</h2>
              </div>
              <button type="button" class="btn btn-xs btn-ghost" :disabled="statsLoading" @click="loadStats">
                <IconRefresh class="w-3.5 h-3.5" :class="statsLoading ? 'animate-spin' : ''" />
              </button>
            </div>

            <div v-if="statsLoading" class="flex justify-center py-6">
              <span class="loading loading-spinner loading-sm"></span>
            </div>
            <div v-else class="grid grid-cols-3 gap-3">
              <div class="rounded-lg border border-base-200 bg-base-50 px-3 py-3 text-center">
                <p class="text-2xl font-bold text-base-content">{{ stats.total }}</p>
                <p class="text-xs text-base-content/40 mt-0.5">Total Orders</p>
              </div>
              <div class="rounded-lg border border-success/30 bg-success/5 px-3 py-3 text-center">
                <p class="text-2xl font-bold text-success">{{ stats.synced }}</p>
                <p class="text-xs text-base-content/40 mt-0.5">Synced</p>
              </div>
              <div class="rounded-lg border border-warning/30 bg-warning/5 px-3 py-3 text-center">
                <p class="text-2xl font-bold text-warning">{{ stats.pending }}</p>
                <p class="text-xs text-base-content/40 mt-0.5">Pending</p>
              </div>
            </div>

            <button
              type="button"
              class="btn btn-sm btn-outline w-full mt-3"
              :disabled="syncing || !isConfigured"
              @click="triggerSync"
            >
              <span v-if="syncing" class="loading loading-spinner loading-xs"></span>
              <IconRefresh v-else class="w-4 h-4" />
              {{ syncing ? 'Syncing...' : 'Sync Now' }}
            </button>
            <p class="text-xs text-base-content/40 text-center mt-1">Auto sync setiap 5 menit via scheduled task</p>
          </div>
        </div>

        <!-- How it works -->
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body">
            <div class="flex items-center gap-2 mb-3">
              <IconInfoCircle class="w-5 h-5 text-info" />
              <h2 class="font-semibold text-sm uppercase tracking-wide text-base-content/50">Cara Kerja</h2>
            </div>
            <ol class="space-y-2">
              <li v-for="(step, i) in HOW_IT_WORKS" :key="i" class="flex items-start gap-3 text-xs text-base-content/70">
                <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold mt-0.5">{{ i + 1 }}</span>
                <span>{{ step }}</span>
              </li>
            </ol>
            <div class="mt-3 flex gap-2">
              <a :href="ocsDocsUrl" target="_blank" rel="noopener noreferrer" class="btn btn-xs btn-ghost gap-1">
                <IconExternalLink class="w-3.5 h-3.5" /> API Docs
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import {
  IconArrowLeft, IconPlugConnected, IconArrowsExchange, IconRefresh,
  IconAlertTriangle, IconEye, IconEyeOff, IconChartBar, IconInfoCircle,
  IconExternalLink, IconShoppingCart, IconBug, IconCheckbox, IconSparkles,
} from '@tabler/icons-vue'

definePageMeta({ layout: 'default' })

// ── Constants ────────────────────────────────────────────────────────────────

const SYNC_ITEMS = [
  {
    type: 'order',
    label: 'Orders',
    desc: 'Setiap order baru & update status di-push ke OCS secara real-time',
    icon: IconShoppingCart,
    bg: 'bg-primary/10',
    color: 'text-primary',
    badgeClass: 'badge-success',
    status: 'Active',
  },
  {
    type: 'bug',
    label: 'Bugs',
    desc: 'Push manual via API: sourceEntityType = "bug"',
    icon: IconBug,
    bg: 'bg-error/10',
    color: 'text-error',
    badgeClass: 'badge-ghost',
    status: 'Via API',
  },
  {
    type: 'task',
    label: 'Tasks',
    desc: 'Push manual via API: sourceEntityType = "task"',
    icon: IconCheckbox,
    bg: 'bg-info/10',
    color: 'text-info',
    badgeClass: 'badge-ghost',
    status: 'Via API',
  },
  {
    type: 'feature',
    label: 'Features',
    desc: 'Push manual via API: sourceEntityType = "feature"',
    icon: IconSparkles,
    bg: 'bg-secondary/10',
    color: 'text-secondary',
    badgeClass: 'badge-ghost',
    status: 'Via API',
  },
]

const HOW_IT_WORKS = [
  'Order dibuat → server langsung push ke endpoint /api/integrations/{connectionId}/push menggunakan Bearer API key',
  'Status order diupdate (confirmed, shipped, dll.) → re-push otomatis ke OCS',
  'Scheduled task berjalan setiap 5 menit untuk sync order yang belum/perlu diperbarui',
  'OCS Workspace menyimpan data sebagai external_records — bisa dilihat di halaman integration detail',
  'Untuk sync bug/task/feature: panggil POST /api/integrations/{connectionId}/push dengan Authorization: Bearer <key>',
]

// ── State ────────────────────────────────────────────────────────────────────

const showApiKey = ref(false)
const saving = ref(false)
const saveMsg = ref('')
const saveMsgType = ref<'ok' | 'err'>('ok')
const testStatus = ref<'idle' | 'loading' | 'ok' | 'fail'>('idle')
const syncing = ref(false)
const statsLoading = ref(false)

const form = ref({
  ocsUrl: '',
  licenseValidationUrl: '',
  ocsConnectionId: '',
  ocsProjectId: '',
  ocsApiKey: '',
})

const stats = ref({ total: 0, synced: 0, pending: 0 })

// ── Computed ─────────────────────────────────────────────────────────────────

const isConfigured = computed(() =>
  integrationConfig.value?.isConfigured || !!(form.value.ocsUrl && form.value.ocsConnectionId && form.value.ocsApiKey),
)

const ocsDocsUrl = computed(() => {
  const baseUrl = (form.value.ocsUrl || 'https://workspace.ocnetworks.web.id').replace(/\/$/, '')
  return `${baseUrl}/integrations/provider-guide#push`
})

// ── Load current config from server ──────────────────────────────────────────

const { data: integrationConfig } = useFetch<{
  ocsUrl: string
  licenseValidationUrl: string
  ocsConnectionId: string
  ocsProjectId: string
  isConfigured: boolean
  syncOrders: boolean
}>('/api/integrations/config')

const syncOrders = ref(true)

watchEffect(() => {
  if (integrationConfig.value) {
    form.value.ocsUrl = integrationConfig.value.ocsUrl || ''
    form.value.licenseValidationUrl = integrationConfig.value.licenseValidationUrl || ''
    form.value.ocsConnectionId = integrationConfig.value.ocsConnectionId || ''
    form.value.ocsProjectId = integrationConfig.value.ocsProjectId || ''
    syncOrders.value = integrationConfig.value.syncOrders !== false
    // API key never sent to client — leave blank unless user types a new one
  }
})

// ── Methods ──────────────────────────────────────────────────────────────────

async function save() {
  saving.value = true
  saveMsg.value = ''
  try {
    await $fetch('/api/integrations/config', {
      method: 'PUT',
      body: {
        ocsUrl: form.value.ocsUrl,
        licenseValidationUrl: form.value.licenseValidationUrl,
        ocsConnectionId: form.value.ocsConnectionId,
        ocsProjectId: form.value.ocsProjectId,
        ocsApiKey: form.value.ocsApiKey || undefined,
      },
    })
    saveMsg.value = 'Kredensial disimpan. Restart server untuk mengaktifkan perubahan.'
    saveMsgType.value = 'ok'
    form.value.ocsApiKey = '' // clear after save
  } catch (err: any) {
    saveMsg.value = err?.data?.statusMessage || 'Gagal menyimpan'
    saveMsgType.value = 'err'
  } finally {
    saving.value = false
  }
}

function reset() {
  if (integrationConfig.value) {
    form.value.ocsUrl = integrationConfig.value.ocsUrl || ''
    form.value.licenseValidationUrl = integrationConfig.value.licenseValidationUrl || ''
    form.value.ocsConnectionId = integrationConfig.value.ocsConnectionId || ''
    form.value.ocsProjectId = integrationConfig.value.ocsProjectId || ''
  }
  form.value.ocsApiKey = ''
  saveMsg.value = ''
}

async function testConnection() {
  testStatus.value = 'loading'
  try {
    await $fetch('/api/integrations/test')
    testStatus.value = 'ok'
  } catch {
    testStatus.value = 'fail'
  }
  setTimeout(() => { testStatus.value = 'idle' }, 3000)
}

async function loadStats() {
  statsLoading.value = true
  try {
    const data = await $fetch<{ total: number; synced: number; pending: number }>('/api/integrations/stats')
    stats.value = data
  } finally {
    statsLoading.value = false
  }
}

async function triggerSync() {
  syncing.value = true
  try {
    await $fetch('/api/integrations/sync', { method: 'POST' })
    await loadStats()
  } finally {
    syncing.value = false
  }
}

async function toggleSyncOrders(e: Event) {
  const enabled = (e.target as HTMLInputElement).checked
  syncOrders.value = enabled
  await $fetch('/api/integrations/config', {
    method: 'PUT',
    body: { syncOrders: enabled },
  })
}

// Load stats on mount
onMounted(loadStats)
</script>
