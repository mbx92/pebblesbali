<script setup lang="ts">
import { IconChecks, IconHomeHeart } from '@tabler/icons-vue'
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
  title: meta(`room${index}Title`, lang.value === 'id' ? `Suite ${index}` : `Suite ${index}`),
  subtitle: meta(`room${index}Subtitle`, lang.value === 'id' ? 'Cahaya alami dan sirkulasi baik' : 'Natural light and soft airflow'),
  price: meta(`room${index}Price`, lang.value === 'id' ? 'Hubungi untuk harga' : 'Contact for rate'),
  highlights: meta(`room${index}Highlights`, lang.value === 'id' ? 'Terrace seat, shower hangat, meja kerja ringan' : 'Terrace seat, warm shower, light work desk'),
  image: meta(`room${index}Image`),
})))
</script>

<template>
  <section :id="sectionId" class="bg-[#f7f0e7] px-6 py-24 lg:px-8">
    <div class="mx-auto max-w-6xl">
      <div class="max-w-2xl">
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[#b86a2f]">{{ meta('badgeLabel', lang === 'id' ? 'Suite Selection' : 'Suite Selection') }}</p>
        <h2 class="mt-4 font-serif text-4xl text-[#28403a] md:text-5xl">{{ section?.title || (lang === 'id' ? 'Kartu suite yang lebih lebar dan terasa airy' : 'Wider suite cards with a more airy rhythm') }}</h2>
        <p class="mt-4 text-sm leading-7 text-[#28403a]/64 md:text-base">{{ section?.subtitle || (lang === 'id' ? 'Template veranda menempatkan room summary dalam layout horizontal agar cahaya, ruang, dan rate terasa lebih seimbang.' : 'The veranda template uses horizontal room summaries so light, atmosphere, and rate cues feel more balanced.') }}</p>
      </div>

      <div class="mt-10 grid gap-6">
        <article v-for="room in roomCards" :key="room.key" class="overflow-hidden rounded-[2.2rem] border border-[#28403a]/10 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
          <div class="grid gap-0 lg:grid-cols-[15rem_minmax(0,1fr)]">
            <div class="aspect-4/3 bg-[#ead8c4] lg:aspect-auto">
              <img v-if="room.image" :src="room.image" :alt="room.title" class="h-full w-full object-cover" />
            </div>
            <div class="p-6 lg:p-7">
              <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div class="inline-flex items-center gap-2 rounded-full bg-[#f7f0e7] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#28403a]/54">
                    <IconHomeHeart class="size-4 text-[#b86a2f]" />
                    Veranda Suite
                  </div>
                  <h3 class="mt-4 font-serif text-3xl text-[#28403a]">{{ room.title }}</h3>
                  <p class="mt-3 text-sm leading-7 text-[#28403a]/62">{{ room.subtitle }}</p>
                </div>
                <span class="rounded-full bg-[#28403a] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white">{{ room.price }}</span>
              </div>

              <div class="mt-6 flex items-start gap-3 rounded-[1.5rem] bg-[#f7f0e7] px-4 py-4 text-sm leading-7 text-[#28403a]/68">
                <IconChecks class="mt-1 size-4 shrink-0 text-[#b86a2f]" />
                <span>{{ room.highlights }}</span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>