<script setup lang="ts">
import { IconCalendarEvent, IconMessageCircle } from '@tabler/icons-vue'
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
</script>

<template>
  <section :id="sectionId" class="bg-[#253a34] px-6 py-24 text-[#f3ede2] lg:px-8">
    <div class="mx-auto grid max-w-6xl gap-8 rounded-[2.5rem] border border-white/10 bg-white/5 p-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:p-12">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[#d2b48c]">{{ meta('badgeLabel', lang === 'id' ? 'Pemesanan Host-Led' : 'Host-Led Booking') }}</p>
        <h2 class="mt-4 font-serif text-4xl leading-tight md:text-5xl">{{ section?.title || (lang === 'id' ? 'CTA pemesanan yang terasa lebih personal' : 'Booking CTA with a more personal tone') }}</h2>
        <p class="mt-4 max-w-2xl text-sm leading-7 text-[#f3ede2]/70 md:text-base">{{ section?.subtitle || (lang === 'id' ? 'Template ini memosisikan booking sebagai percakapan langsung dengan host, bukan sekadar blok form.' : 'This template frames booking as a direct host conversation rather than only a utility block.') }}</p>

        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <a :href="cta('ctaPrimaryLink', '/book')" class="btn border-0 bg-[#d2b48c] px-7 uppercase tracking-[0.24em] text-[#253a34] hover:bg-[#dfc19b]">
            <IconMessageCircle class="size-4" />
            {{ meta('ctaPrimaryText', lang === 'id' ? 'Tanya Ketersediaan' : 'Ask Availability') }}
          </a>
          <div class="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[#f3ede2]/70">
            {{ meta('availabilityNote', lang === 'id' ? 'Balasan cepat saat jam operasional' : 'Fast reply during operating hours') }}
          </div>
        </div>
      </div>

      <div class="rounded-4xl border border-white/10 bg-white/6 p-6">
        <div class="flex items-start gap-3">
          <IconCalendarEvent class="mt-1 size-5 text-[#d2b48c]" />
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[#f3ede2]/45">{{ meta('checkInLabel', lang === 'id' ? 'Check-in' : 'Check-in') }}</p>
            <p class="mt-2 text-sm text-[#f3ede2]/75">{{ meta('checkInValue', '14:00 onwards') }}</p>
          </div>
        </div>
        <div class="mt-5 flex items-start gap-3">
          <IconCalendarEvent class="mt-1 size-5 text-[#d2b48c]" />
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[#f3ede2]/45">{{ meta('checkOutLabel', lang === 'id' ? 'Check-out' : 'Check-out') }}</p>
            <p class="mt-2 text-sm text-[#f3ede2]/75">{{ meta('checkOutValue', 'Before 12:00') }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>