<script setup lang="ts">
import { IconArticle, IconCalendar, IconTag } from '@tabler/icons-vue'
import type { BlogPost, Section } from '~/types'

const props = withDefaults(defineProps<{
  section?: Section
  posts?: BlogPost[]
  sectionId?: string
}>(), {
  section: undefined,
  posts: () => [],
  sectionId: 'blog',
})

function meta(section: Section | undefined, key: string, fallback = ''): string {
  return section?.metadata?.[key] || fallback
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(dateStr))
}
</script>

<template>
  <section v-if="posts.length" :id="sectionId" class="py-24 bg-base-100 scroll-mt-16">
    <div class="max-w-6xl mx-auto px-6">
      <div class="text-center mb-16">
        <div class="flex items-center justify-center gap-3 mb-4">
          <div class="h-px w-8 bg-secondary/50" />
          <span class="text-secondary text-xs font-medium tracking-[0.3em] uppercase">{{ meta(section, 'badgeLabel', 'Our Journal') }}</span>
          <div class="h-px w-8 bg-secondary/50" />
        </div>
        <h2 class="font-serif text-4xl md:text-5xl text-primary font-light tracking-wide">
          {{ section?.title || 'Stories & Inspiration' }}
        </h2>
        <p class="mt-4 text-base-content/60 text-lg font-light max-w-xl mx-auto">
          {{ section?.subtitle || meta(section, 'description', 'Discover the craft, culture, and stories behind our handmade Balinese jewelry.') }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <NuxtLink
          v-for="post in posts"
          :key="post.id"
          :to="`/blog/${post.slug}`"
          class="group"
        >
          <div class="relative overflow-hidden rounded-sm aspect-video bg-base-200 mb-5">
            <img
              v-if="post.image"
              :src="post.image"
              :alt="post.title"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <IconArticle class="size-10 text-base-content/20" />
            </div>
          </div>
          <div class="flex items-center gap-3 mb-3 text-xs text-base-content/40 tracking-wide">
            <span class="flex items-center gap-1">
              <IconCalendar class="size-3.5" />
              {{ formatDate(post.publishedAt || post.createdAt) }}
            </span>
            <span v-if="post.tags.length" class="flex items-center gap-1">
              <IconTag class="size-3.5" />
              {{ post.tags[0] }}
            </span>
          </div>
          <h3 class="font-serif text-xl text-primary font-light tracking-wide mb-2 group-hover:text-secondary transition-colors leading-snug">
            {{ post.title }}
          </h3>
          <p v-if="post.excerpt" class="text-base-content/60 text-sm font-light leading-relaxed line-clamp-2">
            {{ post.excerpt }}
          </p>
        </NuxtLink>
      </div>

      <div class="text-center mt-12">
        <NuxtLink to="/blog" class="btn btn-outline border-primary/30 text-primary text-xs tracking-widest uppercase hover:bg-primary hover:text-base-100 transition-colors">
          {{ meta(section, 'buttonText', 'View All Posts') }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>