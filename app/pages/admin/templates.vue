<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-base-content">Template Library</h1>
        <p class="mt-1 text-sm text-base-content/50">Choose a template as draft, preview it on the live site, then publish when you are ready.</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="btn btn-sm"
          :class="scopeFilter === 'all' ? 'btn-primary' : 'btn-ghost border border-base-300'"
          @click="scopeFilter = 'all'"
        >
          All Templates
        </button>
        <button
          v-for="option in businessTypeOptions"
          :key="option.value"
          type="button"
          class="btn btn-sm"
          :class="scopeFilter === option.value ? 'btn-primary' : 'btn-ghost border border-base-300'"
          @click="scopeFilter = option.value"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <div class="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
      <div class="space-y-6">
        <section v-for="group in groupedTemplates" :key="group.businessType" class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-base font-semibold text-base-content">{{ group.label }}</h2>
              <p class="mt-1 text-xs uppercase tracking-wide text-base-content/40">{{ group.templates.length }} template options</p>
            </div>
          </div>

          <div class="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            <article
              v-for="templateOption in group.templates"
              :key="templateOption.key"
              class="overflow-hidden rounded-3xl border bg-base-100 shadow-sm transition-all"
              :class="templateCardClass(templateOption.key)"
            >
              <TemplateLibraryPreview
                :label="templateOption.label"
                :business-type="templateOption.businessType"
                :theme-name="templateOption.themeName"
                :image-src="getPreviewImage(templateOption.key)"
                :generated="getPreviewStatus(templateOption.key)?.generated"
              />

              <div class="border-b border-base-300 px-5 py-4">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <div class="flex flex-wrap gap-2">
                      <span v-if="isActiveTemplate(templateOption.key)" class="badge badge-soft badge-success">Active</span>
                      <span v-if="isDraftTemplate(templateOption.key)" class="badge badge-soft badge-warning">Draft</span>
                      <span class="badge badge-soft uppercase">{{ templateOption.themeName }}</span>
                      <span class="badge badge-soft" :class="getPreviewStatus(templateOption.key)?.generated ? 'badge-info' : 'badge-ghost'">
                        {{ getPreviewStatus(templateOption.key)?.generated ? 'Live screenshot' : 'SVG fallback' }}
                      </span>
                    </div>
                    <h3 class="mt-3 text-lg font-semibold text-base-content">{{ templateOption.label }}</h3>
                    <p class="mt-2 text-sm leading-6 text-base-content/60">{{ templateOption.description }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-base-200/40 px-5 py-4">
                <div class="grid grid-cols-2 gap-3 text-xs text-base-content/50">
                  <div class="rounded-2xl border border-base-300 bg-base-100 px-3 py-3">
                    <p class="font-semibold uppercase tracking-wide text-base-content/45">Sections</p>
                    <p class="mt-2 text-lg font-bold text-base-content">{{ templateOption.sections.length }}</p>
                  </div>
                  <div class="rounded-2xl border border-base-300 bg-base-100 px-3 py-3">
                    <p class="font-semibold uppercase tracking-wide text-base-content/45">Last Capture</p>
                    <p class="mt-2 text-sm font-semibold text-base-content">{{ getGeneratedAtLabel(templateOption.key) }}</p>
                  </div>
                </div>
              </div>

              <div class="space-y-3 px-5 py-4">
                <div class="flex flex-wrap gap-2">
                  <button
                    type="button"
                    class="btn btn-sm btn-primary"
                    :disabled="draftSaving"
                    @click="setDraft(templateOption.key)"
                  >
                    {{ isDraftTemplate(templateOption.key) ? 'Draft Selected' : 'Use As Draft' }}
                  </button>
                  <a
                    :href="previewHref(templateOption.key)"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn btn-sm btn-outline border-base-300"
                  >
                    Preview
                  </a>
                  <button
                    type="button"
                    class="btn btn-sm btn-ghost border border-base-300"
                    :disabled="!!generating || generatingAll"
                    @click="generatePreview(templateOption.key)"
                  >
                    {{ generating === templateOption.key ? 'Generating...' : (getPreviewStatus(templateOption.key)?.generated ? 'Regenerate Shot' : 'Generate Shot') }}
                  </button>
                </div>

                <div class="flex flex-wrap gap-2">
                  <NuxtLink
                    :to="draftEditorLink(templateOption.key)"
                    class="btn btn-sm btn-ghost border border-base-300"
                  >
                    Edit Draft Sections
                  </NuxtLink>
                  <button
                    v-if="isDraftTemplate(templateOption.key)"
                    type="button"
                    class="btn btn-sm btn-secondary"
                    :disabled="publishing"
                    @click="publishDraft()"
                  >
                    Publish Draft
                  </button>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>

      <aside class="space-y-4">
        <div class="card border border-base-300 bg-base-100">
          <div class="card-body">
            <h2 class="font-semibold text-base-content">Current Status</h2>
            <div class="mt-4 space-y-4 text-sm">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wide text-base-content/40">Active Template</p>
                <p class="mt-1 font-medium text-base-content">{{ activeTemplate?.label || 'Not set' }}</p>
                <p class="mt-1 text-base-content/55">{{ activeTemplate?.description }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-wide text-base-content/40">Draft Template</p>
                <p class="mt-1 font-medium text-base-content">{{ draftTemplate?.label || 'No draft selected' }}</p>
                <p class="mt-1 text-base-content/55">{{ draftTemplate?.description || 'Pick any template card to seed draft sections and start previewing before publish.' }}</p>
              </div>
            </div>
            <div class="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                class="btn btn-sm btn-outline border-base-300"
                :disabled="generatingAll || !!generating"
                @click="generatePreview()"
              >
                {{ generatingAll ? 'Generating All...' : 'Regenerate All Screenshots' }}
              </button>
              <a
                v-if="draftTemplate"
                :href="previewHref(draftTemplate.key)"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-sm btn-primary"
              >
                Preview Draft
              </a>
              <NuxtLink
                v-if="draftTemplate"
                :to="draftEditorLink(draftTemplate.key)"
                class="btn btn-sm btn-outline border-base-300"
              >
                Edit Draft
              </NuxtLink>
              <button
                v-if="draftTemplate"
                type="button"
                class="btn btn-sm btn-secondary"
                :disabled="publishing"
                @click="publishDraft()"
              >
                Publish Draft
              </button>
              <button
                v-if="draftTemplate"
                type="button"
                class="btn btn-sm btn-ghost"
                :disabled="discarding"
                @click="discardDraft()"
              >
                Discard Draft
              </button>
            </div>
            <p v-if="generationMessage" class="mt-4 text-xs leading-6 text-base-content/55">{{ generationMessage }}</p>
          </div>
        </div>

        <div class="card border border-base-300 bg-base-100">
          <div class="card-body">
            <h2 class="font-semibold text-base-content">Draft Workflow</h2>
            <ol class="mt-4 space-y-3 text-sm text-base-content/65">
              <li class="flex gap-3">
                <span class="badge badge-soft badge-primary mt-0.5">1</span>
                <span>Select any template card as draft. The CMS seeds sections for that template scope automatically.</span>
              </li>
              <li class="flex gap-3">
                <span class="badge badge-soft badge-primary mt-0.5">2</span>
                <span>Preview draft on the public landing page and optionally edit draft sections before publishing.</span>
              </li>
              <li class="flex gap-3">
                <span class="badge badge-soft badge-primary mt-0.5">3</span>
                <span>Publish the draft to switch the active business type and template in one step.</span>
              </li>
            </ol>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import TemplateLibraryPreview from '~/components/admin/TemplateLibraryPreview.vue'
import { BUSINESS_TYPE_OPTIONS, getAllTemplateOptions, getTemplateByKey } from '~/templates/registry'
import type { BusinessType, TemplatePreviewStatus } from '~/types'

definePageMeta({ layout: 'default' })

const { data: settings, refresh: refreshSettings } = await useFetch<Record<string, string>>('/api/settings', {
  key: 'site-settings',
})
const { data: previewStatuses, refresh: refreshPreviewStatuses } = await useFetch<TemplatePreviewStatus[]>('/api/templates/previews', {
  key: 'template-preview-statuses',
})

const draftSaving = ref(false)
const publishing = ref(false)
const discarding = ref(false)
const generating = ref<string | null>(null)
const generatingAll = ref(false)
const generationMessage = ref('')
const scopeFilter = ref<'all' | BusinessType>('all')

const businessTypeOptions = BUSINESS_TYPE_OPTIONS
const templates = computed(() => getAllTemplateOptions())
const activeTemplate = computed(() => getTemplateByKey(settings.value?.templateKey))
const draftTemplate = computed(() => getTemplateByKey(settings.value?.draftTemplateKey))
const previewStatusMap = computed(() => new Map((previewStatuses.value ?? []).map(status => [status.templateKey, status])))

const groupedTemplates = computed(() => {
  return businessTypeOptions
    .filter(option => scopeFilter.value === 'all' || scopeFilter.value === option.value)
    .map((option) => ({
      businessType: option.value,
      label: option.label,
      templates: templates.value.filter(template => template.businessType === option.value),
    }))
})

function isActiveTemplate(templateKey: string) {
  return settings.value?.templateKey === templateKey
}

function isDraftTemplate(templateKey: string) {
  return settings.value?.draftTemplateKey === templateKey
}

function templateCardClass(templateKey: string) {
  if (isDraftTemplate(templateKey)) return 'border-warning/50 ring-1 ring-warning/35'
  if (isActiveTemplate(templateKey)) return 'border-success/45 ring-1 ring-success/25'
  return 'border-base-300'
}

function getPreviewStatus(templateKey: string) {
  return previewStatusMap.value.get(templateKey) || null
}

function getPreviewImage(templateKey: string) {
  const status = getPreviewStatus(templateKey)
  if (status?.generated && status.imageUrl) return status.imageUrl
  return getTemplateByKey(templateKey)?.previewImage
}

function getGeneratedAtLabel(templateKey: string) {
  const generatedAt = getPreviewStatus(templateKey)?.generatedAt
  if (!generatedAt) return 'Not generated yet'
  return generatedAt.replace('T', ' ').slice(0, 16)
}

function previewHref(templateKey: string) {
  const template = getTemplateByKey(templateKey)
  if (!template) return '/'
  const params = new URLSearchParams({
    previewTemplate: template.key,
    previewBusinessType: template.businessType,
    previewMode: 'draft',
  })
  return `/?${params.toString()}`
}

function draftEditorLink(templateKey: string) {
  const template = getTemplateByKey(templateKey)
  if (!template) return '/admin/sections'

  return {
    path: '/admin/sections',
    query: {
      templateKey: template.key,
      businessType: template.businessType,
      mode: 'draft',
    },
  }
}

async function generatePreview(templateKey?: string) {
  generationMessage.value = ''

  if (templateKey) {
    generating.value = templateKey
  } else {
    generatingAll.value = true
  }

  try {
    const response = await $fetch<{ generated: Array<{ templateKey: string }> }>('/api/templates/previews/generate', {
      method: 'POST',
      body: templateKey ? { templateKey } : {},
    })
    await refreshPreviewStatuses()
    await refreshNuxtData('template-preview-statuses')
    generationMessage.value = templateKey
      ? `Live screenshot updated for ${getTemplateByKey(templateKey)?.label || templateKey}.`
      : `Live screenshots updated for ${response.generated.length} templates.`
  } catch (error: any) {
    generationMessage.value = error?.data?.statusMessage || error?.message || 'Failed to generate live screenshots.'
  } finally {
    generating.value = null
    generatingAll.value = false
  }
}

async function setDraft(templateKey: string) {
  const template = getTemplateByKey(templateKey)
  if (!template) return

  draftSaving.value = true
  try {
    await $fetch('/api/settings', {
      method: 'PUT',
      body: {
        draftTemplateKey: template.key,
        draftBusinessType: template.businessType,
      },
    })
    await refreshSettings()
    await refreshNuxtData('site-settings')
  } finally {
    draftSaving.value = false
  }
}

async function publishDraft() {
  if (!draftTemplate.value) return

  publishing.value = true
  try {
    await $fetch('/api/settings', {
      method: 'PUT',
      body: {
        businessType: draftTemplate.value.businessType,
        templateKey: draftTemplate.value.key,
        draftTemplateKey: '',
        draftBusinessType: '',
      },
    })
    await refreshSettings()
    await refreshNuxtData('site-settings')
  } finally {
    publishing.value = false
  }
}

async function discardDraft() {
  discarding.value = true
  try {
    await $fetch('/api/settings', {
      method: 'PUT',
      body: {
        draftTemplateKey: '',
        draftBusinessType: '',
      },
    })
    await refreshSettings()
    await refreshNuxtData('site-settings')
  } finally {
    discarding.value = false
  }
}
</script>