<script setup lang="ts">
import { IconCalendarEvent, IconMail, IconMessageCircle, IconSun } from '@tabler/icons-vue'
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
    key: 'sunset',
    icon: IconSun,
    label: meta('sunsetLabel', lang.value === 'id' ? 'Best arrival mood' : 'Best arrival mood'),
    value: meta('sunsetValue', lang.value === 'id' ? 'Late afternoon terrace light' : 'Late afternoon terrace light'),
  },
])
</script>

<template>
  <section :id="sectionId" class="bg-white px-6 py-24 lg:px-8">
    <div class="mx-auto grid max-w-6xl gap-8 rounded-[2.6rem] border border-[#28403a]/10 bg-[linear-gradient(145deg,#f8efe5_0%,#f5f1eb_100%)] p-8 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.95fr)] lg:p-12">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[#b86a2f]">{{ meta('badgeLabel', lang === 'id' ? 'Direct Reserve' : 'Direct Reserve') }}</p>
        <h2 class="mt-4 font-serif text-4xl leading-tight text-[#28403a] md:text-5xl">{{ section?.title || (lang === 'id' ? 'Booking block yang lebih tenang dan host-forward' : 'A calmer, more host-forward booking block') }}</h2>
        <p class="mt-4 max-w-2xl text-sm leading-7 text-[#28403a]/66 md:text-base">{{ section?.subtitle || (lang === 'id' ? 'Template veranda menjaga direct booking tetap jelas, tapi nadanya lebih seperti percakapan host daripada modul reservasi yang kaku.' : 'The veranda template keeps direct booking clear while making the tone feel more like host support than a rigid reservation module.') }}</p>

        <div class="mt-6 flex flex-col gap-3 sm:flex-row">
          <a :href="cta('ctaPrimaryLink', '/book')" class="btn border-0 bg-[#28403a] px-7 uppercase tracking-[0.24em] text-white hover:bg-[#1d302b]">
            <IconMessageCircle class="size-4" />
            {{ meta('ctaPrimaryText', lang === 'id' ? 'Cek Ketersediaan' : 'Check Availability') }}
          </a>
          <a :href="cta('ctaSecondaryLink', props.settings?.contactEmail ? `mailto:${props.settings.contactEmail}` : 'mailto:hello@example.com')" class="btn border-[#28403a]/10 bg-white px-7 uppercase tracking-[0.24em] text-[#28403a] hover:bg-white">
            <IconMail class="size-4" />
            {{ meta('ctaSecondaryText', lang === 'id' ? 'Email Host' : 'Email Host') }}
          </a>
        </div>

        <p class="mt-5 max-w-xl text-sm leading-7 text-[#28403a]/56">{{ meta('availabilityNote', lang === 'id' ? 'Bagikan tanggal, jumlah tamu, dan preferensi room. Balasan diarahkan agar tamu cepat tahu suite yang paling cocok.' : 'Share dates, guest count, and room preference. Replies are framed to quickly guide guests to the best-fit suite.') }}</p>
      </div>

      <div class="space-y-4">
        <div v-for="card in cards" :key="card.key" class="rounded-[1.8rem] border border-[#28403a]/10 bg-white/85 px-5 py-5">
          <component :is="card.icon" class="size-5 text-[#b86a2f]" />
          <p class="mt-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#28403a]/42">{{ card.label }}</p>
          <p class="mt-2 text-sm text-[#28403a]/72">{{ card.value }}</p>
        </div>
      </div>
    </div>
  </section>
</template>