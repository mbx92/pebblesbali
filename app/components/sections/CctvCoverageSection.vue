<script setup lang="ts">
import { IconClock, IconMap2, IconMapPin, IconPhoneCall } from '@tabler/icons-vue'
import type { Section } from '~/types'

const props = withDefaults(defineProps<{
  section?: Section
  settings?: Record<string, string> | null
  sectionId?: string
}>(), {
  section: undefined,
  settings: null,
  sectionId: 'coverage',
})

const { lang } = useLocale()

function meta(key: string, fallback = ''): string {
  return props.section?.metadata?.[key] || fallback
}

const areas = computed(() => [
  meta('coverageArea1', lang.value === 'id' ? 'Denpasar & Sanur' : 'Denpasar & Sanur'),
  meta('coverageArea2', lang.value === 'id' ? 'Kuta, Seminyak, Canggu' : 'Kuta, Seminyak, Canggu'),
  meta('coverageArea3', lang.value === 'id' ? 'Jimbaran, Nusa Dua, Uluwatu' : 'Jimbaran, Nusa Dua, Uluwatu'),
].filter(Boolean))
</script>

<template>
  <section :id="sectionId" class="bg-base-100 py-24">
    <div class="mx-auto grid max-w-6xl gap-6 px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:px-8">
      <div class="rounded-4xl border border-base-300 bg-base-100 p-8 shadow-[0_20px_70px_color-mix(in_oklab,var(--color-neutral)_10%,transparent)]">
        <p class="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">{{ meta('badgeLabel', lang === 'id' ? 'Jangkauan Layanan' : 'Service Coverage') }}</p>
        <h2 class="mt-4 font-serif text-4xl text-primary md:text-5xl">{{ section?.title || (lang === 'id' ? 'Area kerja, jam layanan, dan ekspektasi respon' : 'Coverage area, service hours, and response expectations') }}</h2>
        <p class="mt-4 text-base-content/68 md:text-lg">{{ section?.subtitle || (lang === 'id' ? 'Bagian ini penting supaya calon klien langsung tahu Anda melayani area mana dan seberapa cepat bisa bergerak.' : 'This section helps prospects understand where you work and how quickly you can usually move.') }}</p>
        <div v-if="section?.body" class="tiptap-render mt-5 text-sm leading-7 text-base-content/60" v-html="section.body" />

        <div class="mt-8 grid gap-4 md:grid-cols-2">
          <div class="rounded-3xl bg-base-200/70 p-5">
            <div class="flex items-center gap-3 text-secondary"><IconClock class="size-5" /><p class="text-xs font-semibold uppercase tracking-[0.22em] text-base-content/45">{{ lang === 'id' ? 'Response Time' : 'Response Time' }}</p></div>
            <p class="mt-3 text-sm leading-7 text-base-content/70">{{ meta('responseTime', lang === 'id' ? 'Survey lokasi maksimal 24 jam untuk area utama Bali.' : 'Site survey within 24 hours for most main Bali areas.') }}</p>
          </div>
          <div class="rounded-3xl bg-base-200/70 p-5">
            <div class="flex items-center gap-3 text-secondary"><IconPhoneCall class="size-5" /><p class="text-xs font-semibold uppercase tracking-[0.22em] text-base-content/45">{{ lang === 'id' ? 'Jam Layanan' : 'Service Hours' }}</p></div>
            <p class="mt-3 text-sm leading-7 text-base-content/70">{{ meta('serviceHours', lang === 'id' ? 'Senin - Sabtu · 08:00 - 18:00' : 'Mon - Sat · 08:00 - 18:00') }}</p>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="rounded-4xl bg-[linear-gradient(160deg,color-mix(in_oklab,var(--color-secondary)_16%,white),color-mix(in_oklab,var(--color-base-100)_74%,white))] p-8">
          <div class="flex items-center gap-3 text-secondary">
            <IconMapPin class="size-5" />
            <p class="text-xs font-semibold uppercase tracking-[0.28em]">{{ lang === 'id' ? 'Area Populer' : 'Common Service Areas' }}</p>
          </div>
          <ul class="mt-5 space-y-3 text-sm leading-7 text-base-content/70">
            <li v-for="item in areas" :key="item" class="rounded-2xl bg-[color-mix(in_oklab,var(--color-base-100)_78%,transparent)] px-4 py-3">{{ item }}</li>
          </ul>
          <p class="mt-5 text-sm leading-7 text-base-content/62">{{ meta('supportNote', lang === 'id' ? 'Emergency troubleshooting tersedia untuk klien existing sesuai kondisi lapangan.' : 'Emergency troubleshooting is available for existing clients depending on site conditions.') }}</p>
        </div>

        <div class="rounded-4xl border border-base-300 bg-base-100 px-6 py-5 shadow-[0_14px_50px_color-mix(in_oklab,var(--color-neutral)_10%,transparent)]">
          <div class="flex items-center gap-3 text-secondary">
            <IconMap2 class="size-5" />
            <p class="text-xs font-semibold uppercase tracking-[0.26em] text-base-content/40">{{ lang === 'id' ? 'Base Operasional' : 'Operational Base' }}</p>
          </div>
          <p class="mt-3 text-sm leading-7 text-base-content/72">{{ settings?.address || (lang === 'id' ? 'Tambahkan alamat base operasional di Settings.' : 'Add your operational base address in Settings.') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>