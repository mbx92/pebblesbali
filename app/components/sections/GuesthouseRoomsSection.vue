<script setup lang="ts">
import { IconBath, IconBed, IconCheck, IconUsers } from '@tabler/icons-vue'
import type { RoomType, Section } from '~/types'

const props = withDefaults(defineProps<{
  section?: Section
  sectionId?: string
}>(), {
  section: undefined,
  sectionId: 'rooms',
})

const { lang } = useLocale()

function meta(key: string, fallback = ''): string {
  return props.section?.metadata?.[key] || fallback
}

function splitHighlights(value: string): string[] {
  return value.split(',').map(item => item.trim()).filter(Boolean)
}

function formatIdr(value: number | string) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value || 0))
}

const { data: featuredResponse } = await useFetch<{ roomTypes: RoomType[] }>('/api/guesthouse/room-types', {
  query: { public: 'true' },
})

const featuredRoomTypes = computed(() => featuredResponse.value?.roomTypes || [])

const rooms = computed(() => [
  {
    title: meta('room1Title', lang.value === 'id' ? 'Garden Suite' : 'Garden Suite'),
    subtitle: meta('room1Subtitle', lang.value === 'id' ? 'Sudut tenang menghadap taman' : 'A quiet room facing the courtyard'),
    price: meta('room1Price', lang.value === 'id' ? 'Mulai IDR 950K / malam' : 'From IDR 950K / night'),
    image: meta('room1Image', props.section?.image || ''),
    highlights: splitHighlights(meta('room1Highlights', lang.value === 'id' ? 'King bed, teras privat, sarapan' : 'King bed, private terrace, breakfast')),
  },
  {
    title: meta('room2Title', lang.value === 'id' ? 'Pool Loft' : 'Pool Loft'),
    subtitle: meta('room2Subtitle', lang.value === 'id' ? 'Lebih lega untuk kerja dan liburan' : 'More space for work and longer stays'),
    price: meta('room2Price', lang.value === 'id' ? 'Mulai IDR 1.25M / malam' : 'From IDR 1.25M / night'),
    image: meta('room2Image', props.section?.image || ''),
    highlights: splitHighlights(meta('room2Highlights', lang.value === 'id' ? 'Bathtub, meja kerja, akses kolam' : 'Bathtub, workspace, pool access')),
  },
  {
    title: meta('room3Title', lang.value === 'id' ? 'Family Pavilion' : 'Family Pavilion'),
    subtitle: meta('room3Subtitle', lang.value === 'id' ? 'Lebih luas untuk grup kecil atau keluarga' : 'Spacious for small groups or families'),
    price: meta('room3Price', lang.value === 'id' ? 'Mulai IDR 1.8M / malam' : 'From IDR 1.8M / night'),
    image: meta('room3Image', props.section?.image || ''),
    highlights: splitHighlights(meta('room3Highlights', lang.value === 'id' ? 'Dua kamar, pantry, lounge' : 'Two bedrooms, pantry, lounge')),
  },
].filter(room => room.title))

const displayRooms = computed(() => {
  if (featuredRoomTypes.value.length) {
    return featuredRoomTypes.value.map((roomType) => ({
      id: roomType.id,
      title: roomType.name,
      subtitle: roomType.bedConfiguration || `${roomType.baseOccupancy} base · ${roomType.maxOccupancy} max`,
      price: `${lang.value === 'id' ? 'Mulai' : 'From'} ${formatIdr(roomType.defaultNightlyRate)} / ${lang.value === 'id' ? 'malam' : 'night'}`,
      image: roomType.metadata?.imageUrl || '',
      description: roomType.description || '',
      highlights: roomType.metadata?.facilities?.length
        ? roomType.metadata.facilities
        : splitHighlights(roomType.bedConfiguration || ''),
    }))
  }

  return rooms.value.map(room => ({
    id: room.title,
    ...room,
    description: '',
  }))
})
</script>

<template>
  <section :id="sectionId" class="bg-base-100 py-24">
    <div class="mx-auto max-w-6xl px-6 lg:px-8">
      <div class="flex max-w-3xl flex-col gap-4">
        <p class="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">
          {{ meta('badgeLabel', lang === 'id' ? 'Pilihan Kamar' : 'Room Selection') }}
        </p>
        <h2 class="font-serif text-4xl text-primary md:text-5xl">{{ section?.title || (lang === 'id' ? 'Kamar untuk setiap jenis perjalanan' : 'Rooms for every kind of trip') }}</h2>
        <p class="text-base-content/70 md:text-lg">{{ section?.subtitle || (lang === 'id' ? 'Pilih suasana dan ukuran kamar yang paling pas untuk ritme liburanmu.' : 'Choose the room style and layout that best fits your pace in Bali.') }}</p>
        <div v-if="section?.body" class="tiptap-render text-sm leading-7 text-base-content/60" v-html="section.body" />
      </div>

      <div class="mt-12 grid gap-6 lg:grid-cols-3">
        <article v-for="room in displayRooms" :key="room.id" class="overflow-hidden rounded-[1.75rem] border border-base-300 bg-base-100 shadow-[0_24px_80px_color-mix(in_oklab,var(--color-neutral)_12%,transparent)]">
          <div class="aspect-5/4 bg-base-200">
            <img v-if="room.image" :src="room.image" :alt="room.title" class="h-full w-full object-cover" />
            <div v-else class="flex h-full items-center justify-center bg-[linear-gradient(135deg,color-mix(in_oklab,var(--color-secondary)_28%,white),color-mix(in_oklab,var(--color-base-200)_70%,white))] text-sm uppercase tracking-[0.28em] text-base-content/35">
              {{ lang === 'id' ? 'Foto kamar' : 'Room image' }}
            </div>
          </div>
          <div class="space-y-5 p-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="font-serif text-2xl text-primary">{{ room.title }}</h3>
                <p class="mt-1 text-sm text-base-content/58">{{ room.subtitle }}</p>
              </div>
              <span class="rounded-full bg-secondary/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-secondary">{{ room.price }}</span>
            </div>
            <div v-if="room.description" class="tiptap-render text-sm leading-7 text-base-content/65" v-html="room.description" />
            <ul class="space-y-3 text-sm text-base-content/68">
              <li v-for="(highlight, index) in room.highlights" :key="highlight" class="flex items-start gap-3">
                <IconBed v-if="index === 0" class="mt-0.5 size-4 text-secondary" />
                <IconBath v-else-if="index === 1" class="mt-0.5 size-4 text-secondary" />
                <IconUsers v-else-if="index === 2" class="mt-0.5 size-4 text-secondary" />
                <IconCheck v-else class="mt-0.5 size-4 text-secondary" />
                <span>{{ highlight }}</span>
              </li>
            </ul>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>