<script setup lang="ts">
import { IconAt, IconBrandInstagram, IconMapPin } from '@tabler/icons-vue'
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

function meta(key: string, fallback = '') {
  return props.section?.metadata?.[key] || fallback
}

const cards = computed(() => [
  {
    key: 'location',
    icon: IconMapPin,
    label: meta('locationLabel', lang.value === 'id' ? 'Lokasi' : 'Location'),
    value: props.settings?.address || (lang.value === 'id' ? 'Alamat belum diatur' : 'Address not configured'),
  },
  {
    key: 'email',
    icon: IconAt,
    label: meta('emailLabel', 'Email'),
    value: props.settings?.contactEmail || 'hello@example.com',
  },
  {
    key: 'social',
    icon: IconBrandInstagram,
    label: meta('socialLabel', lang.value === 'id' ? 'Ikuti Kami' : 'Follow Us'),
    value: props.settings?.instagramUrl || '@senseofjewels',
  },
])
</script>

<template>
  <section :id="sectionId" class="bg-[linear-gradient(180deg,transparent,#efe5de_28%,#efe5de_100%)] px-6 py-24 lg:px-8">
    <div class="mx-auto max-w-6xl rounded-[2.5rem] border border-base-300 bg-base-100 px-8 py-10 shadow-sm lg:px-12 lg:py-14">
      <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-secondary">{{ meta('badgeLabel', lang === 'id' ? 'Hubungi Studio' : 'Contact the Studio') }}</p>
          <h2 class="mt-4 font-serif text-4xl leading-tight text-primary md:text-5xl">{{ section?.title || (lang === 'id' ? 'Mulai percakapan yang terasa personal' : 'Start a conversation that feels personal') }}</h2>
          <p class="mt-4 max-w-xl text-sm leading-7 text-base-content/66 md:text-base">{{ section?.subtitle || (lang === 'id' ? 'Template editorial menempatkan kontak sebagai penutup yang hangat, rapi, dan lebih premium.' : 'The editorial template closes the page with a calmer, more premium contact experience.') }}</p>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
          <div v-for="card in cards" :key="card.key" class="rounded-[1.75rem] border border-base-300 bg-base-100 px-5 py-6">
            <component :is="card.icon" class="size-5 text-secondary" />
            <p class="mt-5 text-[11px] font-semibold uppercase tracking-[0.3em] text-base-content/40">{{ card.label }}</p>
            <p class="mt-3 text-sm leading-7 text-base-content/72">{{ card.value }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>