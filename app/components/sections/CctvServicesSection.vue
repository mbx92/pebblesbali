<script setup lang="ts">
import { IconCamera, IconNetwork, IconPlugConnected, IconTool } from '@tabler/icons-vue'
import type { Section } from '~/types'

const props = withDefaults(defineProps<{
  section?: Section
  sectionId?: string
}>(), {
  section: undefined,
  sectionId: 'services',
})

const { lang } = useLocale()

function meta(key: string, fallback = ''): string {
  return props.section?.metadata?.[key] || fallback
}

const cards = computed(() => [
  {
    title: meta('service1Title', lang.value === 'id' ? 'Instalasi CCTV' : 'CCTV Installation'),
    body: meta('service1Body', lang.value === 'id' ? 'Penempatan kamera, setting recorder, remote monitoring, dan handover sistem sampai siap dipakai.' : 'Camera placement, recorder setup, remote monitoring, and handover so the system is ready to use.'),
    icon: IconCamera,
  },
  {
    title: meta('service2Title', lang.value === 'id' ? 'Wi-Fi & Access Point' : 'Wi-Fi & Access Points'),
    body: meta('service2Body', lang.value === 'id' ? 'Perencanaan coverage, tuning router, mesh deployment, dan optimasi area sinyal lemah.' : 'Coverage planning, router tuning, mesh deployment, and optimization for weak-signal zones.'),
    icon: IconNetwork,
  },
  {
    title: meta('service3Title', lang.value === 'id' ? 'Structured Cabling' : 'Structured Cabling'),
    body: meta('service3Body', lang.value === 'id' ? 'Penarikan kabel LAN, rack cleanup, patch panel, labeling, dan jalur yang lebih rapi untuk maintenance.' : 'LAN cable pulling, rack cleanup, patch panels, labeling, and cleaner routing for easier maintenance.'),
    icon: IconPlugConnected,
  },
  {
    title: meta('service4Title', lang.value === 'id' ? 'Maintenance & Troubleshooting' : 'Maintenance & Troubleshooting'),
    body: meta('service4Body', lang.value === 'id' ? 'Cek gangguan, ganti device bermasalah, backup setting, dan audit kesehatan sistem.' : 'Fault isolation, problematic device replacement, settings backup, and system health audits.'),
    icon: IconTool,
  },
])
</script>

<template>
  <section :id="sectionId" class="bg-base-100 py-24 scroll-mt-16">
    <div class="mx-auto max-w-6xl px-6 lg:px-8">
      <div class="max-w-2xl">
        <p class="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">{{ meta('badgeLabel', lang === 'id' ? 'Layanan Inti' : 'Core Services') }}</p>
        <h2 class="mt-4 font-serif text-4xl text-primary md:text-5xl">{{ section?.title || (lang === 'id' ? 'Pekerjaan teknis yang paling sering dibutuhkan klien' : 'Technical work most clients actually need') }}</h2>
        <p class="mt-4 text-base-content/66 md:text-lg">{{ section?.subtitle || (lang === 'id' ? 'Fokus pada instalasi yang rapi, stabil, dan mudah dipelihara sesudah serah terima.' : 'Focused on clean installation, stable performance, and easier maintenance after handover.') }}</p>
      </div>

      <div class="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <article v-for="card in cards" :key="card.title" class="flex h-full flex-col rounded-4xl border border-base-300 bg-base-100 p-6 shadow-[0_18px_60px_color-mix(in_oklab,var(--color-neutral)_8%,transparent)]">
          <div class="flex size-12 items-center justify-center rounded-2xl bg-secondary/12 text-secondary">
            <component :is="card.icon" class="size-5" />
          </div>
          <h3 class="mt-5 text-lg font-semibold text-primary">{{ card.title }}</h3>
          <p class="mt-3 text-sm leading-7 text-base-content/66">{{ card.body }}</p>
        </article>
      </div>
    </div>
  </section>
</template>