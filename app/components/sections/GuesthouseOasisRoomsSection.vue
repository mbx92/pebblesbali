<script setup lang="ts">
import { IconUsers } from '@tabler/icons-vue'
import type { Section } from '~/types'

const props = withDefaults(defineProps<{
  section?: Section
  sectionId?: string
}>(), {
  section: undefined,
  sectionId: 'rooms',
})

const { lang } = useLocale()

function meta(key: string, fallback = '') {
  return props.section?.metadata?.[key] || fallback
}

const roomCards = computed(() => [1, 2, 3].map((index) => ({
  key: `room${index}`,
  title: meta(`room${index}Title`, lang.value === 'id' ? `Tipe Kamar ${index}` : `Room Type ${index}`),
  subtitle: meta(`room${index}Subtitle`, lang.value === 'id' ? 'Ritme menginap yang santai' : 'A calm stay rhythm'),
  price: meta(`room${index}Price`, lang.value === 'id' ? 'Hubungi untuk harga' : 'Contact for rate'),
  highlights: meta(`room${index}Highlights`, lang.value === 'id' ? 'Kamar nyaman, cahaya alami, suasana tenang' : 'Comfortable room, natural light, calm atmosphere'),
  image: meta(`room${index}Image`),
})))
</script>

<template>
  <section :id="sectionId" class="bg-[#f7f4ee] px-6 py-24 lg:px-8">
    <div class="mx-auto max-w-6xl">
      <div class="max-w-2xl">
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[#4f6a54]">{{ meta('badgeLabel', lang === 'id' ? 'Pilihan Kamar' : 'Room Selection') }}</p>
        <h2 class="mt-4 font-serif text-4xl text-[#233536] md:text-5xl">{{ section?.title || (lang === 'id' ? 'Kartu kamar yang lebih bersih dan cepat dibaca' : 'Cleaner room cards that read faster') }}</h2>
        <p class="mt-4 text-sm leading-7 text-[#233536]/68 md:text-base">{{ section?.subtitle || (lang === 'id' ? 'Template oasis merangkum tiap kamar secara ringkas agar tamu cepat paham pilihan yang tersedia.' : 'The oasis template keeps each room summary lighter so guests can scan choices faster.') }}</p>
      </div>

      <div class="mt-10 grid gap-6 lg:grid-cols-3">
        <article v-for="room in roomCards" :key="room.key" class="overflow-hidden rounded-4xl border border-[#233536]/10 bg-white shadow-sm">
          <div class="aspect-4/3 bg-[#e7ece3]">
            <img v-if="room.image" :src="room.image" :alt="room.title" class="h-full w-full object-cover" />
          </div>
          <div class="p-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="font-serif text-2xl text-[#233536]">{{ room.title }}</h3>
                <p class="mt-2 text-sm text-[#233536]/58">{{ room.subtitle }}</p>
              </div>
              <span class="rounded-full bg-[#4f6a54]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#4f6a54]">{{ room.price }}</span>
            </div>

            <div class="mt-5 flex items-start gap-3 rounded-2xl bg-[#f7f4ee] px-4 py-3 text-sm leading-6 text-[#233536]/70">
              <IconUsers class="mt-0.5 size-4 shrink-0 text-[#4f6a54]" />
              <span>{{ room.highlights }}</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>