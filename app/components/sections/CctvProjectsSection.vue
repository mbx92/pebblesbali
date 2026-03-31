<script setup lang="ts">
import { IconArrowUpRight, IconChecklist } from '@tabler/icons-vue'
import type { Section } from '~/types'

const props = withDefaults(defineProps<{
  section?: Section
  sectionId?: string
}>(), {
  section: undefined,
  sectionId: 'projects',
})

const { lang } = useLocale()

function meta(key: string, fallback = ''): string {
  return props.section?.metadata?.[key] || fallback
}

const projects = computed(() => [1, 2, 3].map((index) => ({
  title: meta(`project${index}Title`, lang.value === 'id' ? `Project ${index}` : `Project ${index}`),
  metaText: meta(`project${index}Meta`, lang.value === 'id' ? 'Detail proyek' : 'Project details'),
  body: meta(`project${index}Body`, lang.value === 'id' ? 'Tambahkan ringkasan singkat proyek, scope pekerjaan, dan hasil instalasi.' : 'Add a short project summary, scope of work, and installation result.'),
})))
</script>

<template>
  <section :id="sectionId" class="bg-primary py-24 text-primary-content">
    <div class="mx-auto max-w-6xl px-6 lg:px-8">
      <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div class="max-w-2xl">
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">{{ meta('badgeLabel', lang === 'id' ? 'Pekerjaan Terbaru' : 'Recent Work') }}</p>
          <h2 class="mt-4 font-serif text-4xl md:text-5xl">{{ section?.title || (lang === 'id' ? 'Contoh hasil kerja yang mudah dipahami calon klien' : 'Recent installations clients can understand at a glance') }}</h2>
          <p class="mt-4 text-primary-content/72 md:text-lg">{{ section?.subtitle || (lang === 'id' ? 'Tampilkan scope, jumlah device, dan jenis lokasi supaya calon klien cepat relate dengan kebutuhannya.' : 'Show the scope, device count, and site type so prospects can map your work to their own needs quickly.') }}</p>
        </div>
      </div>

      <div class="mt-10 grid gap-5 lg:grid-cols-3">
        <article v-for="project in projects" :key="project.title" class="rounded-4xl border border-white/10 bg-white/6 p-6 backdrop-blur-sm">
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-3 text-secondary">
              <IconChecklist class="size-5" />
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-primary-content/55">{{ project.metaText }}</p>
            </div>
            <IconArrowUpRight class="size-4 text-primary-content/45" />
          </div>
          <h3 class="mt-6 text-xl font-semibold text-white">{{ project.title }}</h3>
          <p class="mt-4 text-sm leading-7 text-primary-content/72">{{ project.body }}</p>
        </article>
      </div>
    </div>
  </section>
</template>