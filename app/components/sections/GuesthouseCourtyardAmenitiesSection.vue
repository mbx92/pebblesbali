<script setup lang="ts">
import { IconLeaf, IconWifi, IconToolsKitchen2, IconCar } from '@tabler/icons-vue'
import type { Section } from '~/types'

const props = withDefaults(defineProps<{
  section?: Section
  sectionId?: string
}>(), {
  section: undefined,
  sectionId: 'amenities',
})

const { lang } = useLocale()

function meta(key: string, fallback = '') {
  return props.section?.metadata?.[key] || fallback
}

const amenityIcons = [IconLeaf, IconToolsKitchen2, IconWifi, IconCar]

const amenities = computed(() => [1, 2, 3, 4].map((index) => ({
  key: `amenity${index}`,
  icon: amenityIcons[index - 1],
  title: meta(`amenity${index}Title`, lang.value === 'id' ? `Amenity ${index}` : `Amenity ${index}`),
  body: meta(`amenity${index}Body`, lang.value === 'id' ? 'Tambahkan detail amenity di editor section.' : 'Add amenity detail in the section editor.'),
})))
</script>

<template>
  <section :id="sectionId" class="bg-[#f3ede2] px-6 py-24 lg:px-8">
    <div class="mx-auto max-w-6xl">
      <div class="max-w-2xl">
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[#8c6d47]">{{ meta('badgeLabel', lang === 'id' ? 'Kenyamanan Harian' : 'Daily Comforts') }}</p>
        <h2 class="mt-4 font-serif text-4xl text-[#253a34] md:text-5xl">{{ section?.title || (lang === 'id' ? 'Amenities disusun seperti sudut-sudut pengalaman' : 'Amenities framed as hospitality moments') }}</h2>
        <p class="mt-4 text-sm leading-7 text-[#253a34]/68 md:text-base">{{ section?.subtitle || (lang === 'id' ? 'Template courtyard membuat amenity terasa lebih hidup, bukan sekadar daftar fasilitas.' : 'The courtyard template presents amenities as guest experience moments instead of a plain checklist.') }}</p>
      </div>

      <div class="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <article v-for="item in amenities" :key="item.key" class="rounded-4xl border border-[#253a34]/10 bg-white px-5 py-6 shadow-sm">
          <component :is="item.icon" class="size-5 text-[#8c6d47]" />
          <h3 class="mt-5 font-serif text-2xl text-[#253a34]">{{ item.title }}</h3>
          <p class="mt-3 text-sm leading-7 text-[#253a34]/65">{{ item.body }}</p>
        </article>
      </div>
    </div>
  </section>
</template>