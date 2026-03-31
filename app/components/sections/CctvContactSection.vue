<script setup lang="ts">
import { IconBrandWhatsapp, IconClock, IconMail, IconMapPin, IconPhone } from '@tabler/icons-vue'
import type { Section } from '~/types'

const props = withDefaults(defineProps<{
  section?: Section
  settings?: Record<string, string> | null
  sectionId?: string
}>(), {
  section: undefined,
  settings: null,
  sectionId: 'contact',
})

const { lang } = useLocale()

function meta(key: string, fallback = ''): string {
  return props.section?.metadata?.[key] || fallback
}

const whatsappHref = computed(() => {
  const number = props.settings?.whatsappNumber?.replace(/\D/g, '')
  if (!number) return ''
  const text = encodeURIComponent(lang.value === 'id'
    ? 'Halo, saya ingin konsultasi untuk kebutuhan CCTV / jaringan.'
    : 'Hello, I would like to discuss a CCTV / networking requirement.')
  return `https://wa.me/${number}?text=${text}`
})
</script>

<template>
  <section :id="sectionId" class="bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-base-100)_88%,white),color-mix(in_oklab,var(--color-secondary)_10%,white))] py-24 scroll-mt-16">
    <div class="mx-auto max-w-6xl px-6 lg:px-8">
      <div class="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">{{ meta('badgeLabel', lang === 'id' ? 'Hubungi Kami' : 'Get in Touch') }}</p>
          <h2 class="mt-4 font-serif text-4xl text-primary md:text-5xl">{{ section?.title || (lang === 'id' ? 'Butuh survey lokasi atau perbaikan sistem?' : 'Need a site survey or system fix?') }}</h2>
          <p class="mt-4 text-base-content/66 md:text-lg">{{ section?.subtitle || (lang === 'id' ? 'Ceritakan jenis lokasi, kendala, atau target instalasi Anda. Kami bantu arahkan scope yang paling masuk akal.' : 'Tell us about the site, current issue, or installation target. We will help scope the work clearly.') }}</p>
          <div v-if="section?.body" class="tiptap-render mt-5 text-sm leading-7 text-base-content/60" v-html="section.body" />

          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <a v-if="whatsappHref" :href="whatsappHref" target="_blank" rel="noreferrer" class="btn btn-secondary btn-md border-0 px-7 uppercase tracking-[0.22em] text-primary">
              {{ meta('ctaPrimaryText', lang === 'id' ? 'Request Survey' : 'Request Survey') }}
            </a>
            <a v-if="settings?.contactEmail" :href="`mailto:${settings.contactEmail}`" class="btn btn-outline btn-md border-base-300 px-7 uppercase tracking-[0.22em] text-primary">
              {{ meta('ctaSecondaryText', lang === 'id' ? 'Email Detail Proyek' : 'Email Project Details') }}
            </a>
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="rounded-4xl border border-base-300 bg-base-100 p-6">
            <div class="flex items-center gap-3 text-secondary"><IconPhone class="size-5" /><p class="text-xs font-semibold uppercase tracking-[0.22em] text-base-content/45">{{ lang === 'id' ? 'Telepon' : 'Phone' }}</p></div>
            <p class="mt-4 text-sm font-medium text-primary">{{ settings?.contactPhone || '-' }}</p>
          </div>
          <div class="rounded-4xl border border-base-300 bg-base-100 p-6">
            <div class="flex items-center gap-3 text-secondary"><IconBrandWhatsapp class="size-5" /><p class="text-xs font-semibold uppercase tracking-[0.22em] text-base-content/45">WhatsApp</p></div>
            <p class="mt-4 text-sm font-medium text-primary">{{ settings?.whatsappNumber || '-' }}</p>
          </div>
          <div class="rounded-4xl border border-base-300 bg-base-100 p-6">
            <div class="flex items-center gap-3 text-secondary"><IconMail class="size-5" /><p class="text-xs font-semibold uppercase tracking-[0.22em] text-base-content/45">Email</p></div>
            <p class="mt-4 text-sm font-medium text-primary break-all">{{ settings?.contactEmail || '-' }}</p>
          </div>
          <div class="rounded-4xl border border-base-300 bg-base-100 p-6">
            <div class="flex items-center gap-3 text-secondary"><IconClock class="size-5" /><p class="text-xs font-semibold uppercase tracking-[0.22em] text-base-content/45">{{ lang === 'id' ? 'Jam Layanan' : 'Service Hours' }}</p></div>
            <p class="mt-4 text-sm font-medium text-primary">{{ meta('serviceHours', lang === 'id' ? 'Senin - Sabtu · 08:00 - 18:00' : 'Mon - Sat · 08:00 - 18:00') }}</p>
          </div>
          <div class="rounded-4xl border border-base-300 bg-base-100 p-6 md:col-span-2">
            <div class="flex items-center gap-3 text-secondary"><IconMapPin class="size-5" /><p class="text-xs font-semibold uppercase tracking-[0.22em] text-base-content/45">{{ lang === 'id' ? 'Area Base' : 'Base Area' }}</p></div>
            <p class="mt-4 text-sm leading-7 text-base-content/70">{{ settings?.address || (lang === 'id' ? 'Tambahkan alamat operasional di Settings.' : 'Add the operational address in Settings.') }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>