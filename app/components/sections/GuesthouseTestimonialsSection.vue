<script setup lang="ts">
import { IconQuote, IconStarFilled } from '@tabler/icons-vue'
import type { Section, Testimonial } from '~/types'

const props = withDefaults(defineProps<{
  section?: Section
  items?: Testimonial[]
  sectionId?: string
}>(), {
  section: undefined,
  items: () => [],
  sectionId: 'testimonials',
})

const { lang } = useLocale()

function meta(key: string, fallback = ''): string {
  return props.section?.metadata?.[key] || fallback
}
</script>

<template>
  <section :id="sectionId" class="bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-base-100)_82%,white),color-mix(in_oklab,var(--color-secondary)_12%,white))] py-24">
    <div class="mx-auto max-w-6xl px-6 lg:px-8">
      <div class="max-w-3xl">
        <p class="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">
          {{ meta('badgeLabel', lang === 'id' ? 'Cerita Tamu' : 'Guest Stories') }}
        </p>
        <h2 class="mt-4 font-serif text-4xl text-primary md:text-5xl">{{ section?.title || (lang === 'id' ? 'Kesan yang tertinggal setelah check-out' : 'What stays with guests after check-out') }}</h2>
        <p class="mt-4 text-base-content/68 md:text-lg">{{ section?.subtitle || (lang === 'id' ? 'Ulasan singkat dari tamu yang datang untuk istirahat, kerja, atau tinggal lebih lama.' : 'Short reviews from guests who came for rest, work, or longer Bali stays.') }}</p>
      </div>

      <div v-if="items.length" class="mt-12 grid gap-6 lg:grid-cols-3">
        <article v-for="item in items" :key="item.id" class="rounded-[1.75rem] border border-base-300 bg-base-100 p-7 shadow-[0_20px_70px_color-mix(in_oklab,var(--color-neutral)_12%,transparent)]">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h3 class="font-serif text-2xl text-primary">{{ item.name }}</h3>
              <p class="text-sm text-base-content/45">{{ item.role || (lang === 'id' ? 'Tamu' : 'Guest') }}</p>
            </div>
            <IconQuote class="size-8 text-secondary/35" />
          </div>
          <div class="mt-5 flex gap-1 text-secondary">
            <IconStarFilled v-for="star in item.rating" :key="star" class="size-4" />
          </div>
          <p class="mt-5 text-sm leading-7 text-base-content/72">{{ item.content }}</p>
        </article>
      </div>

      <div v-else class="mt-12 rounded-4xl border border-dashed border-base-300 bg-base-100 px-8 py-12 text-center text-sm text-base-content/45">
        {{ meta('emptySoonText', lang === 'id' ? 'Testimoni akan tampil di sini setelah kamu menambahkan review tamu.' : 'Testimonials will appear here once you add guest reviews.') }}
      </div>
    </div>
  </section>
</template>