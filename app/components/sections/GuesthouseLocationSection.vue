<script setup lang="ts">
import { IconMap2, IconMapPin, IconRouteSquare } from '@tabler/icons-vue'
import type { Section } from '~/types'

const props = withDefaults(defineProps<{
  section?: Section
  settings?: Record<string, string> | null
  sectionId?: string
}>(), {
  section: undefined,
  settings: null,
  sectionId: 'location',
})

const { lang } = useLocale()

function meta(key: string, fallback = ''): string {
  return props.section?.metadata?.[key] || fallback
}

const nearby = computed(() => [
  meta('nearby1', lang.value === 'id' ? '7 menit ke pantai' : '7 minutes to the beach'),
  meta('nearby2', lang.value === 'id' ? '3 menit ke cafe dan toko' : '3 minutes to cafes and shops'),
  meta('nearby3', lang.value === 'id' ? '45 menit dari bandara' : '45 minutes from the airport'),
].filter(Boolean))
</script>

<template>
  <section :id="sectionId" class="bg-base-100 py-24">
    <div class="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:px-8">
      <div class="rounded-4xl border border-base-300 bg-base-100 p-8 shadow-[0_20px_70px_color-mix(in_oklab,var(--color-neutral)_12%,transparent)]">
        <p class="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">
          {{ meta('badgeLabel', lang === 'id' ? 'Lokasi' : 'Location') }}
        </p>
        <h2 class="mt-4 font-serif text-4xl text-primary md:text-5xl">{{ section?.title || (lang === 'id' ? 'Dekat dengan alasan kamu datang ke Bali' : 'Close to what brings you to Bali') }}</h2>
        <p class="mt-4 text-base-content/70 md:text-lg">{{ section?.subtitle || (lang === 'id' ? 'Tenang saat istirahat, strategis saat ingin keluar.' : 'Peaceful when you stay in, practical when you head out.') }}</p>
        <div v-if="section?.body" class="tiptap-render mt-5 text-sm leading-7 text-base-content/60" v-html="section.body" />

        <div class="mt-8 rounded-3xl bg-base-200/65 p-6">
          <div class="flex items-start gap-3">
            <div class="rounded-2xl bg-secondary/10 p-3 text-secondary"><IconMapPin class="size-5" /></div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-base-content/45">{{ lang === 'id' ? 'Alamat' : 'Address' }}</p>
              <p class="mt-2 text-sm leading-7 text-base-content/72">{{ settings?.address || (lang === 'id' ? 'Tambahkan alamat property di Settings.' : 'Add the property address in Settings.') }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="rounded-4xl bg-[linear-gradient(160deg,color-mix(in_oklab,var(--color-secondary)_18%,white),color-mix(in_oklab,var(--color-base-100)_78%,white))] p-8">
          <div class="flex items-center gap-3 text-secondary">
            <IconRouteSquare class="size-5" />
            <p class="text-xs font-semibold uppercase tracking-[0.28em]">{{ lang === 'id' ? 'Sekitar Properti' : 'Nearby' }}</p>
          </div>
          <ul class="mt-5 space-y-3 text-sm leading-7 text-base-content/70">
            <li v-for="item in nearby" :key="item" class="rounded-2xl bg-[color-mix(in_oklab,var(--color-base-100)_78%,transparent)] px-4 py-3">{{ item }}</li>
          </ul>
        </div>

        <a :href="meta('mapUrl', '#')" :class="['flex items-center justify-between rounded-4xl border border-base-300 bg-base-100 px-6 py-5 shadow-[0_14px_50px_color-mix(in_oklab,var(--color-neutral)_10%,transparent)] transition', meta('mapUrl') ? 'hover:border-secondary hover:text-secondary' : 'pointer-events-none opacity-60']" target="_blank" rel="noreferrer">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.26em] text-base-content/40">{{ lang === 'id' ? 'Arahkan di peta' : 'Open in maps' }}</p>
            <p class="mt-2 text-sm text-base-content/70">{{ lang === 'id' ? 'Gunakan link map untuk melihat rute tercepat.' : 'Use the map link for the quickest route.' }}</p>
          </div>
          <IconMap2 class="size-6" />
        </a>
      </div>
    </div>
  </section>
</template>