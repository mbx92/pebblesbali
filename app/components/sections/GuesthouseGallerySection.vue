<script setup lang="ts">
import type { Section } from '~/types'

const props = withDefaults(defineProps<{
  section?: Section
  sectionId?: string
}>(), {
  section: undefined,
  sectionId: 'gallery',
})

const { lang } = useLocale()

function meta(key: string, fallback = ''): string {
  return props.section?.metadata?.[key] || fallback
}

const galleryItems = computed(() => {
  const items = [
    { url: props.section?.image || meta('image1Url'), label: meta('image1Label', lang.value === 'id' ? 'Ruang utama' : 'Main space') },
    { url: meta('image2Url'), label: meta('image2Label', lang.value === 'id' ? 'Interior suite' : 'Suite interior') },
    { url: meta('image3Url'), label: meta('image3Label', lang.value === 'id' ? 'Sarapan pagi' : 'Morning breakfast') },
    { url: meta('image4Url'), label: meta('image4Label', lang.value === 'id' ? 'Suasana sekitar' : 'Neighborhood mood') },
  ]

  return items.filter(item => item.url)
})
</script>

<template>
  <section :id="sectionId" class="bg-primary py-24 text-base-100">
    <div class="mx-auto max-w-6xl px-6 lg:px-8">
      <div class="mb-10 max-w-3xl">
        <p class="text-xs font-semibold uppercase tracking-[0.28em] text-secondary/85">
          {{ meta('badgeLabel', lang === 'id' ? 'Suasana' : 'Atmosphere') }}
        </p>
        <h2 class="mt-4 font-serif text-4xl md:text-5xl">{{ section?.title || (lang === 'id' ? 'Lihat cahaya, ruang, dan ritmenya' : 'See the light, space, and rhythm') }}</h2>
        <p class="mt-4 text-base-100/70 md:text-lg">{{ section?.subtitle || (lang === 'id' ? 'Sekilas gambaran sebelum kamu datang dan menetap beberapa hari.' : 'A quick visual feel for the stay before you arrive.') }}</p>
      </div>

      <div class="grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <figure class="group relative overflow-hidden rounded-4xl bg-[color-mix(in_oklab,var(--color-base-100)_10%,transparent)] min-h-96 shadow-[0_22px_72px_color-mix(in_oklab,var(--color-neutral)_14%,transparent)]">
          <img v-if="galleryItems[0]?.url" :src="galleryItems[0].url" :alt="galleryItems[0].label" class="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
          <figcaption class="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,color-mix(in_oklab,var(--color-neutral)_62%,transparent))] px-6 py-5 text-sm uppercase tracking-[0.25em] text-base-100/80">{{ galleryItems[0]?.label }}</figcaption>
        </figure>

        <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
          <figure v-for="item in galleryItems.slice(1)" :key="item.url" class="group relative overflow-hidden rounded-[1.75rem] bg-[color-mix(in_oklab,var(--color-base-100)_10%,transparent)] min-h-44 shadow-[0_18px_54px_color-mix(in_oklab,var(--color-neutral)_12%,transparent)]">
            <img :src="item.url" :alt="item.label" class="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
            <figcaption class="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,color-mix(in_oklab,var(--color-neutral)_62%,transparent))] px-5 py-4 text-xs uppercase tracking-[0.24em] text-base-100/80">{{ item.label }}</figcaption>
          </figure>
          <div v-if="galleryItems.length < 2" class="rounded-[1.75rem] border border-base-100/15 bg-base-100/8 p-6 text-sm leading-7 text-base-100/65">
            <div v-if="section?.body" class="tiptap-render" v-html="section.body" />
            <p v-else>{{ lang === 'id' ? 'Tambahkan beberapa URL gambar di metadata section Gallery untuk membangun collage guesthouse.' : 'Add more gallery image URLs in the Gallery section metadata to build the guesthouse collage.' }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>