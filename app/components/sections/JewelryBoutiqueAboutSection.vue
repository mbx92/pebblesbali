<script setup lang="ts">
import { IconHeartHandshake } from '@tabler/icons-vue'
import type { Section } from '~/types'

const props = withDefaults(defineProps<{
  section?: Section
  sectionId?: string
}>(), {
  section: undefined,
  sectionId: 'about',
})

const { lang } = useLocale()

function meta(key: string, fallback = '') {
  return props.section?.metadata?.[key] || fallback
}

const stats = computed(() => [
  { value: meta('stat1Value', '15+'), label: meta('stat1Label', lang.value === 'id' ? 'Tahun craft' : 'Years of craft') },
  { value: meta('stat2Value', '500+'), label: meta('stat2Label', lang.value === 'id' ? 'Detail dibuat' : 'Pieces shaped') },
  { value: meta('stat3Value', '40+'), label: meta('stat3Label', lang.value === 'id' ? 'Negara tujuan' : 'Countries shipped') },
])
</script>

<template>
  <section :id="sectionId" class="bg-[#f8f3ec] px-6 py-24 lg:px-8">
    <div class="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.85fr)] lg:items-start">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[#8d6b49]">{{ meta('badgeLabel', lang === 'id' ? 'Tentang Studio' : 'About the Studio') }}</p>
        <h2 class="mt-4 font-serif text-4xl leading-tight text-[#2f2a25] md:text-5xl">{{ section?.title || (lang === 'id' ? 'Cerita brand dalam format yang lebih intim' : 'Brand storytelling in a more intimate format') }}</h2>
        <p class="mt-5 max-w-2xl text-sm leading-7 text-[#2f2a25]/68 md:text-base">{{ section?.subtitle || (lang === 'id' ? 'Template boutique memosisikan brand story seperti percakapan studio yang lebih dekat.' : 'The boutique template frames your story like a closer studio conversation.') }}</p>
        <div v-if="section?.body" class="tiptap-render mt-4 max-w-2xl text-sm leading-7 text-[#2f2a25]/64" v-html="section.body" />
      </div>

      <div class="rounded-4xl border border-[#2f2a25]/10 bg-white p-6 shadow-sm">
        <div class="flex items-center gap-3 border-b border-[#2f2a25]/8 pb-4">
          <div class="rounded-full bg-[#c49a6c]/12 p-2 text-[#8d6b49]"><IconHeartHandshake class="size-4" /></div>
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[#2f2a25]/45">Brand Snapshot</p>
        </div>
        <div class="mt-5 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <div v-for="item in stats" :key="item.label" class="rounded-3xl bg-[#f8f3ec] px-4 py-4">
            <p class="font-serif text-3xl text-[#2f2a25]">{{ item.value }}</p>
            <p class="mt-2 text-xs uppercase tracking-[0.24em] text-[#2f2a25]/48">{{ item.label }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>