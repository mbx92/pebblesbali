<script setup lang="ts">
import { IconCalendarTime, IconMail, IconMessageCircle } from '@tabler/icons-vue'
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

function meta(key: string, fallback = ''): string {
  return props.section?.metadata?.[key] || fallback
}

const bookingHref = computed(() => meta('ctaPrimaryLink') || '/book')

const emailHref = computed(() => meta('ctaSecondaryLink') || (props.settings?.contactEmail ? `mailto:${props.settings.contactEmail}` : '#'))

const whatsappHref = computed(() => {
  const number = props.settings?.whatsappNumber?.replace(/\D/g, '')
  if (!number) return '#'
  const message = encodeURIComponent(lang.value === 'id'
    ? 'Halo, saya ingin cek ketersediaan kamar.'
    : 'Hi, I would like to check room availability.')
  return `https://wa.me/${number}?text=${message}`
})
</script>

<template>
  <section :id="sectionId" class="bg-primary py-24 text-base-100">
    <div class="mx-auto max-w-5xl px-6 lg:px-8">
      <div class="overflow-hidden rounded-[2.5rem] border border-base-100/12 bg-[color-mix(in_oklab,var(--color-base-100)_8%,transparent)] shadow-[0_30px_90px_color-mix(in_oklab,var(--color-neutral)_32%,transparent)] backdrop-blur">
        <div class="grid gap-0 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
          <div class="p-8 md:p-10">
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-secondary/85">
              {{ meta('badgeLabel', lang === 'id' ? 'Reservasi Langsung' : 'Direct Booking') }}
            </p>
            <h2 class="mt-4 max-w-2xl font-serif text-4xl leading-tight md:text-5xl">{{ section?.title || (lang === 'id' ? 'Cek tanggalmu dan kami bantu pilih kamar terbaik' : 'Share your dates and we will help match the right room') }}</h2>
            <p class="mt-4 max-w-2xl text-base-100/72 md:text-lg">{{ section?.subtitle || (lang === 'id' ? 'Belum ada booking engine dulu. Mulai dengan pertanyaan langsung via WhatsApp atau email.' : 'No booking engine yet. Start with a direct WhatsApp or email inquiry.') }}</p>
            <div v-if="section?.body" class="tiptap-render mt-5 max-w-2xl text-sm leading-7 text-base-100/62" v-html="section.body" />

            <div class="mt-8 flex flex-col gap-3 sm:flex-row">
              <NuxtLink :to="bookingHref" class="btn btn-secondary border-0 px-7 uppercase tracking-[0.22em] text-primary">
                <IconMessageCircle class="size-4" />
                {{ meta('ctaPrimaryText', lang === 'id' ? 'Cek Ketersediaan' : 'Check Availability') }}
              </NuxtLink>
              <a :href="whatsappHref !== '#' ? whatsappHref : emailHref" :class="['btn btn-outline border-base-100/25 bg-base-100/5 px-7 uppercase tracking-[0.22em] text-base-100 hover:bg-base-100/12', whatsappHref === '#' && emailHref === '#' ? 'pointer-events-none opacity-60' : '']" :target="whatsappHref !== '#' ? '_blank' : undefined" rel="noreferrer">
                <IconMail class="size-4" />
                {{ meta('ctaSecondaryText', lang === 'id' ? 'Hubungi Host' : 'Contact the Host') }}
              </a>
            </div>

            <p class="mt-5 text-sm leading-7 text-base-100/58">
              {{ meta('availabilityNote', lang === 'id' ? 'Balasan biasanya diberikan pada jam operasional dalam hari yang sama.' : 'Replies are usually sent within business hours on the same day.') }}
            </p>
          </div>

          <div class="border-t border-base-100/10 bg-[color-mix(in_oklab,var(--color-neutral)_16%,transparent)] p-8 md:border-l md:border-t-0 md:p-10">
            <div class="rounded-[1.75rem] border border-base-100/12 bg-base-100/8 p-6">
              <p class="text-xs font-semibold uppercase tracking-[0.28em] text-base-100/55">{{ lang === 'id' ? 'Info Menginap' : 'Stay Details' }}</p>
              <div class="mt-5 space-y-4 text-sm">
                <div class="flex items-start gap-3">
                  <IconCalendarTime class="mt-0.5 size-4 text-secondary" />
                  <div>
                    <p class="text-base-100/45">{{ meta('checkInLabel', lang === 'id' ? 'Check-in' : 'Check-in') }}</p>
                    <p class="mt-1 text-base-100/78">{{ meta('checkInValue', lang === 'id' ? '14:00 ke atas' : 'From 14:00') }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <IconCalendarTime class="mt-0.5 size-4 text-secondary" />
                  <div>
                    <p class="text-base-100/45">{{ meta('checkOutLabel', lang === 'id' ? 'Check-out' : 'Check-out') }}</p>
                    <p class="mt-1 text-base-100/78">{{ meta('checkOutValue', lang === 'id' ? 'Sebelum 12:00' : 'Before 12:00') }}</p>
                  </div>
                </div>
                <div class="border-t border-base-100/10 pt-4 text-base-100/72">
                  <p>{{ props.settings?.contactPhone || props.settings?.contactEmail || (lang === 'id' ? 'Tambahkan kontak di Settings.' : 'Add contact details in Settings.') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>