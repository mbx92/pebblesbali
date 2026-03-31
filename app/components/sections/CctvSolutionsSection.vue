<script setup lang="ts">
import { IconBuildingStore, IconHome, IconBuildingWarehouse } from '@tabler/icons-vue'
import type { Section } from '~/types'

const props = withDefaults(defineProps<{
  section?: Section
  sectionId?: string
}>(), {
  section: undefined,
  sectionId: 'solutions',
})

const { lang } = useLocale()

function meta(key: string, fallback = ''): string {
  return props.section?.metadata?.[key] || fallback
}

const solutions = computed(() => [
  {
    title: meta('solution1Title', lang.value === 'id' ? 'Rumah & Villa' : 'Homes & Villas'),
    body: meta('solution1Body', lang.value === 'id' ? 'Penempatan kamera perimeter, coverage indoor, dan jaringan rumah yang lebih stabil untuk keluarga maupun guest stay.' : 'Perimeter camera placement, indoor coverage, and more stable home networks for families and guest stays.'),
    icon: IconHome,
  },
  {
    title: meta('solution2Title', lang.value === 'id' ? 'Toko & Kantor' : 'Shops & Offices'),
    body: meta('solution2Body', lang.value === 'id' ? 'Monitoring area kasir, gudang, akses masuk, plus Wi-Fi staff dan tamu yang lebih terkontrol.' : 'Monitoring for cashier, storage, entry points, plus better-controlled staff and guest Wi-Fi.'),
    icon: IconBuildingStore,
  },
  {
    title: meta('solution3Title', lang.value === 'id' ? 'Gudang & Site Project' : 'Warehouses & Project Sites'),
    body: meta('solution3Body', lang.value === 'id' ? 'Surveillance multi-titik, network extension, dan instalasi yang lebih tahan kondisi lapangan.' : 'Multi-point surveillance, network extension, and installations built for harsher site conditions.'),
    icon: IconBuildingWarehouse,
  },
])
</script>

<template>
  <section :id="sectionId" class="bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-base-100)_94%,white),color-mix(in_oklab,var(--color-secondary)_10%,white))] py-24">
    <div class="mx-auto max-w-6xl px-6 lg:px-8">
      <div class="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">{{ meta('badgeLabel', lang === 'id' ? 'Solusi per Lokasi' : 'Solutions by Site') }}</p>
          <h2 class="mt-4 font-serif text-4xl text-primary md:text-5xl">{{ section?.title || (lang === 'id' ? 'Setiap lokasi butuh pendekatan teknis yang berbeda' : 'Each site needs a different technical approach') }}</h2>
          <p class="mt-4 text-base-content/66 md:text-lg">{{ section?.subtitle || (lang === 'id' ? 'Layout kamera, jalur kabel, dan topologi jaringan kami sesuaikan dengan operasional di lapangan.' : 'Camera layout, cable routing, and network topology are adjusted to match how the site actually operates.') }}</p>
          <div v-if="section?.body" class="tiptap-render mt-5 text-sm leading-7 text-base-content/60" v-html="section.body" />
        </div>

        <div class="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
          <article v-for="solution in solutions" :key="solution.title" class="rounded-4xl border border-base-300 bg-base-100 px-6 py-6">
            <div class="flex items-center gap-3 text-secondary">
              <component :is="solution.icon" class="size-5" />
              <p class="text-sm font-semibold uppercase tracking-[0.18em] text-base-content/50">{{ solution.title }}</p>
            </div>
            <p class="mt-4 text-sm leading-7 text-base-content/68">{{ solution.body }}</p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>