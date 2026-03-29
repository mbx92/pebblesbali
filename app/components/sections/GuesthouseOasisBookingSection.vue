<script setup lang="ts">
import { IconCalendarEvent, IconMail, IconMessageCircle } from '@tabler/icons-vue'
import type { Section } from '~/types'

const props = withDefaults(defineProps<{
  section?: Section
  settings?: Record<string, string> | null
  sectionId?: string
}>(), {
  section: undefined,
  settings: null,
  sectionId: 'booking',
})

const { lang } = useLocale()

function meta(key: string, fallback = '') {
  return props.section?.metadata?.[key] || fallback
}

function cta(key: string, fallback = '') {
  return props.section?.metadata?.[key] || fallback
}

const cards = computed(() => [
  {
    key: 'checkin',
    icon: IconCalendarEvent,
    label: meta('checkInLabel', lang.value === 'id' ? 'Check-in' : 'Check-in'),
    value: meta('checkInValue', '14:00 onwards'),
  },
  {
    key: 'checkout',
    icon: IconCalendarEvent,
    label: meta('checkOutLabel', lang.value === 'id' ? 'Check-out' : 'Check-out'),
    value: meta('checkOutValue', 'Before 12:00'),
  },
])
</script>

<template>
  <section :id="sectionId" class="bg-white px-6 py-24 lg:px-8">
    <div class="mx-auto grid max-w-6xl gap-8 rounded-[2.5rem] border border-[#233536]/10 bg-[#f7f4ee] p-8 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.95fr)] lg:p-12">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[#4f6a54]">{{ meta('badgeLabel', lang === 'id' ? 'Pemesanan Langsung' : 'Direct Booking') }}</p>
        <h2 class="mt-4 font-serif text-4xl leading-tight text-[#233536] md:text-5xl">{{ section?.title || (lang === 'id' ? 'Booking block yang lebih ringan' : 'A lighter booking block') }}</h2>
        <p class="mt-4 max-w-2xl text-sm leading-7 text-[#233536]/68 md:text-base">{{ section?.subtitle || (lang === 'id' ? 'PoC template ini menunjukkan bahwa CTA pemesanan bisa tampil berbeda tanpa mengubah model data section.' : 'This proof-of-concept shows booking calls-to-action can change layout without changing the section data model.') }}</p>

        <div class="mt-6 flex flex-col gap-3 sm:flex-row">
          <a :href="cta('ctaPrimaryLink', '/book')" class="btn border-0 bg-[#233536] px-7 uppercase tracking-[0.24em] text-white hover:bg-[#172627]">
            <IconMessageCircle class="size-4" />
            {{ meta('ctaPrimaryText', lang === 'id' ? 'Cek Ketersediaan' : 'Check Availability') }}
          </a>
          <a :href="cta('ctaSecondaryLink', props.settings?.contactEmail ? `mailto:${props.settings.contactEmail}` : 'mailto:hello@example.com')" class="btn border-[#233536]/10 bg-white px-7 uppercase tracking-[0.24em] text-[#233536] hover:bg-white">
            <IconMail class="size-4" />
            {{ meta('ctaSecondaryText', lang === 'id' ? 'Email Host' : 'Email Host') }}
          </a>
        </div>

        <p class="mt-5 max-w-xl text-sm leading-7 text-[#233536]/56">{{ meta('availabilityNote', lang === 'id' ? 'Balasan biasanya lebih cepat pada jam kerja dan saat tidak ada peak arrival.' : 'Replies are typically faster during office hours and outside peak arrival windows.') }}</p>
      </div>

      <div class="space-y-4">
        <div v-for="card in cards" :key="card.key" class="rounded-[1.75rem] border border-[#233536]/10 bg-white px-5 py-5">
          <component :is="card.icon" class="size-5 text-[#4f6a54]" />
          <p class="mt-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#233536]/42">{{ card.label }}</p>
          <p class="mt-2 text-sm text-[#233536]/72">{{ card.value }}</p>
        </div>
      </div>
    </div>
  </section>
</template>