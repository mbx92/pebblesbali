<script setup lang="ts">
import { IconPhoto } from '@tabler/icons-vue'
import type { BusinessType } from '~/types'

defineProps<{
  label: string
  businessType: BusinessType
  themeName: string
  imageSrc?: string
  generated?: boolean
}>()
</script>

<template>
  <div class="relative aspect-4/3 overflow-hidden border-b border-base-300/70 bg-base-200">
    <img
      v-if="imageSrc"
      :src="imageSrc"
      :alt="`${label} preview`"
      class="h-full w-full object-cover"
      loading="lazy"
    />
    <div v-else class="flex h-full items-center justify-center text-base-content/35">
      <div class="flex flex-col items-center gap-2 text-xs uppercase tracking-[0.28em]">
        <IconPhoto class="size-6" />
        <span>Preview</span>
      </div>
    </div>

    <div class="absolute inset-x-4 top-4 flex items-center justify-between gap-3">
      <span class="rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.26em] text-white backdrop-blur-sm">
        {{ businessType }}
      </span>
      <span class="rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.26em] text-white/85 backdrop-blur-sm">
        {{ themeName }}
      </span>
    </div>

    <div class="absolute left-4 top-16">
      <span class="rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.26em] text-white/85 backdrop-blur-sm">
        {{ generated ? 'Live Shot' : 'Fallback' }}
      </span>
    </div>

    <div class="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/72 via-black/30 to-transparent px-4 pb-4 pt-12">
      <p class="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/68">Template Preview</p>
      <h3 class="mt-2 text-lg font-semibold text-white">{{ label }}</h3>
    </div>
  </div>
</template>