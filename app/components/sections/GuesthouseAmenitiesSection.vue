<script setup lang="ts">
import { IconCoffee, IconMapPin, IconPlaneTilt, IconWifi } from '@tabler/icons-vue'
import type { Section } from '~/types'

const props = withDefaults(defineProps<{
  section?: Section
  sectionId?: string
}>(), {
  section: undefined,
  sectionId: 'amenities',
})

const { lang } = useLocale()

function meta(key: string, fallback = ''): string {
  return props.section?.metadata?.[key] || fallback
}

const amenities = computed(() => [
  {
    title: meta('amenity1Title', lang.value === 'id' ? 'Kolam Tropis' : 'Tropical Pool'),
    body: meta('amenity1Body', lang.value === 'id' ? 'Kolam tenang untuk pagi yang lambat dan sore yang hangat.' : 'A calm pool for slow mornings and warm late afternoons.'),
    icon: IconMapPin,
  },
  {
    title: meta('amenity2Title', lang.value === 'id' ? 'Sarapan Harian' : 'Daily Breakfast'),
    body: meta('amenity2Body', lang.value === 'id' ? 'Menu sederhana dan segar untuk memulai hari.' : 'A fresh, simple breakfast to start the day well.'),
    icon: IconCoffee,
  },
  {
    title: meta('amenity3Title', lang.value === 'id' ? 'Wi-Fi Cepat' : 'Fast Wi-Fi'),
    body: meta('amenity3Body', lang.value === 'id' ? 'Koneksi stabil untuk kerja jarak jauh atau streaming ringan.' : 'Reliable connection for remote work and easy streaming.'),
    icon: IconWifi,
  },
  {
    title: meta('amenity4Title', lang.value === 'id' ? 'Transfer Bandara' : 'Airport Transfer'),
    body: meta('amenity4Body', lang.value === 'id' ? 'Bisa diatur sebelum tiba agar check-in lebih lancar.' : 'Can be arranged before arrival for a smoother check-in.'),
    icon: IconPlaneTilt,
  },
].filter(item => item.title))
</script>

<template>
  <section :id="sectionId" class="bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-base-100)_80%,white),color-mix(in_oklab,var(--color-secondary)_10%,white))] py-24">
    <div class="mx-auto max-w-6xl px-6 lg:px-8">
      <div class="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">
            {{ meta('badgeLabel', lang === 'id' ? 'Kenyamanan Harian' : 'Daily Comforts') }}
          </p>
          <h2 class="mt-4 font-serif text-4xl text-primary md:text-5xl">{{ section?.title || (lang === 'id' ? 'Semua yang kamu butuhkan, tanpa yang berlebihan' : 'Everything you need, without the noise') }}</h2>
          <p class="mt-4 text-base-content/70 md:text-lg">{{ section?.subtitle || (lang === 'id' ? 'Fasilitas yang praktis, hangat, dan benar-benar terasa berguna saat menginap.' : 'Amenities that feel practical, warm, and genuinely useful during your stay.') }}</p>
          <div v-if="section?.body" class="tiptap-render mt-4 text-sm leading-7 text-base-content/60" v-html="section.body" />
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <article v-for="item in amenities" :key="item.title" class="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-[0_18px_60px_color-mix(in_oklab,var(--color-neutral)_10%,transparent)]">
            <div class="flex size-11 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
              <component :is="item.icon" class="size-5" />
            </div>
            <h3 class="mt-5 font-serif text-2xl text-primary">{{ item.title }}</h3>
            <p class="mt-3 text-sm leading-7 text-base-content/65">{{ item.body }}</p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>