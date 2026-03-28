<script setup lang="ts">
import { IconDiamond, IconSearch, IconArticle, IconCalendar, IconTag, IconX } from '@tabler/icons-vue'

definePageMeta({ layout: false, middleware: 'features' })

const { data: settings } = await useFetch<Record<string, string>>('/api/settings')
useTheme(settings)
const { template, getSectionAnchor } = useTemplate(settings)

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  image: string | null
  tags: string[]
  isPublished: boolean
  publishedAt: string | null
  sortOrder: number
}

const { data: allPosts } = await useFetch<BlogPost[]>('/api/blog', { query: { published: 'true' } })

const { lang, t, toggleLang } = useLocale()
const plan = usePlan()
const siteName = computed(() => settings.value?.siteName || template.value.defaults.siteName)

function landingHref(sectionKey: string): string {
  return `/#${getSectionAnchor(sectionKey)}`
}

const search = ref('')
const selectedTag = ref<string | null>(null)

const allTags = computed(() => {
  const set = new Set<string>()
  allPosts.value?.forEach(p => p.tags.forEach(tag => set.add(tag)))
  return Array.from(set).sort()
})

const filteredPosts = computed(() => {
  let list = allPosts.value ?? []
  if (selectedTag.value) list = list.filter(p => p.tags.includes(selectedTag.value!))
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.excerpt ?? '').toLowerCase().includes(q) ||
      p.tags.some(tag => tag.toLowerCase().includes(q))
    )
  }
  return list
})

function formatDate(dateStr: string | null) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString(lang.value === 'id' ? 'id-ID' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

useSeoMeta({
  title: () => `Blog — ${siteName.value}`,
  description: () => settings.value?.metaDescription || 'Read the latest stories, insights, and inspirations from our Balinese jewelry studio.',
})
</script>

<template>
  <div :data-theme="template.themeName" class="min-h-screen bg-base-100 font-sans">

    <AdminPreviewBar />

    <!-- Navbar -->
    <nav :class="['fixed z-50 w-full bg-base-100/90 backdrop-blur-md border-b border-base-200 transition-[top] duration-300', useAdminBar().value ? 'top-9' : 'top-0']">
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2 shrink-0">
          <img v-if="settings?.logoUrl" :src="settings.logoUrl" :alt="siteName" class="h-9 w-auto max-w-40 object-contain" />
          <span v-else class="flex items-center gap-2 text-primary font-serif text-base font-semibold tracking-widest uppercase">
            <IconDiamond class="size-4 shrink-0 text-secondary" />
            <span class="truncate max-w-36 sm:max-w-none">{{ siteName }}</span>
          </span>
        </NuxtLink>
        <div class="hidden md:flex items-center gap-8 text-xs font-medium tracking-widest uppercase text-base-content/70">
          <NuxtLink v-if="plan.hasFeature('shop')" to="/shop" class="hover:text-secondary transition-colors">{{ t.nav.shop }}</NuxtLink>
          <NuxtLink :to="landingHref('collections')" class="hover:text-secondary transition-colors">{{ t.nav.collections }}</NuxtLink>
          <NuxtLink :to="landingHref('about')" class="hover:text-secondary transition-colors">{{ t.nav.about }}</NuxtLink>
          <NuxtLink to="/blog" class="text-secondary font-semibold">Blog</NuxtLink>
          <NuxtLink :to="landingHref('contact')" class="hover:text-secondary transition-colors">{{ t.nav.contact }}</NuxtLink>
        </div>
        <div class="flex items-center gap-2">
          <button @click="toggleLang" class="btn btn-xs btn-ghost font-medium tracking-widest text-base-content/50 hover:text-primary px-2">
            {{ lang === 'en' ? 'EN' : 'ID' }}
          </button>
          <NuxtLink to="/" class="hidden md:inline-flex btn btn-sm btn-outline btn-primary text-xs tracking-widest uppercase ml-2">
            {{ t.nav.backToHome }}
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Header -->
    <section class="pt-32 pb-12 bg-primary text-primary-content text-center">
      <div class="max-w-2xl mx-auto px-6">
        <div class="flex items-center justify-center gap-3 mb-5">
          <div class="h-px w-10 bg-secondary/60" />
          <IconArticle class="size-5 text-secondary" />
          <div class="h-px w-10 bg-secondary/60" />
        </div>
        <h1 class="font-serif text-4xl md:text-5xl font-light tracking-wide mb-4">Blog</h1>
        <p class="text-primary-content/60 text-base font-light tracking-wide">
          Stories, craft insights, and inspirations from our Balinese studio
        </p>
      </div>
    </section>

    <!-- Search & Filter -->
    <section class="sticky top-16 z-30 bg-base-100/95 backdrop-blur border-b border-base-200 py-4">
      <div class="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row gap-3 items-center">
        <!-- Search -->
        <div class="relative flex-1 max-w-sm">
          <IconSearch class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/30" />
          <input
            v-model="search"
            type="text"
            placeholder="Search posts..."
            class="input input-sm w-full pl-9"
          />
          <button v-if="search" @click="search = ''" class="absolute right-2 top-1/2 -translate-y-1/2">
            <IconX class="w-3.5 h-3.5 text-base-content/40" />
          </button>
        </div>
        <!-- Tags -->
        <div class="flex flex-wrap gap-2">
          <button
            class="badge badge-sm cursor-pointer transition-colors"
            :class="selectedTag === null ? 'badge-primary' : 'badge-ghost hover:badge-primary'"
            @click="selectedTag = null"
          >All</button>
          <button
            v-for="tag in allTags"
            :key="tag"
            class="badge badge-sm cursor-pointer transition-colors"
            :class="selectedTag === tag ? 'badge-secondary' : 'badge-ghost hover:badge-secondary'"
            @click="selectedTag = selectedTag === tag ? null : tag"
          >
            <IconTag class="w-2.5 h-2.5 mr-1" />{{ tag }}
          </button>
        </div>
      </div>
    </section>

    <!-- Posts Grid -->
    <main class="max-w-6xl mx-auto px-6 py-12">
      <!-- Results count -->
      <p class="text-xs text-base-content/40 tracking-widest uppercase mb-8">
        {{ filteredPosts.length }} post{{ filteredPosts.length !== 1 ? 's' : '' }}
      </p>

      <div v-if="filteredPosts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <NuxtLink
          v-for="post in filteredPosts"
          :key="post.id"
          :to="`/blog/${post.slug}`"
          class="group flex flex-col"
        >
          <!-- Image -->
          <div class="aspect-video overflow-hidden rounded-lg bg-base-200 mb-4">
            <img
              v-if="post.image"
              :src="post.image"
              :alt="post.title"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-base-content/20">
              <IconArticle class="w-12 h-12" />
            </div>
          </div>

          <!-- Meta -->
          <div class="flex items-center gap-3 text-xs text-base-content/40 tracking-wide mb-2">
            <span v-if="post.publishedAt" class="flex items-center gap-1">
              <IconCalendar class="w-3 h-3" />
              {{ formatDate(post.publishedAt) }}
            </span>
          </div>

          <!-- Title -->
          <h2 class="font-serif text-lg font-light leading-snug text-base-content group-hover:text-secondary transition-colors mb-2">
            {{ post.title }}
          </h2>

          <!-- Excerpt -->
          <p v-if="post.excerpt" class="text-sm text-base-content/60 line-clamp-3 leading-relaxed flex-1">
            {{ post.excerpt }}
          </p>

          <!-- Tags -->
          <div v-if="post.tags.length" class="flex flex-wrap gap-1.5 mt-3">
            <span v-for="tag in post.tags" :key="tag" class="badge badge-soft badge-xs badge-secondary">{{ tag }}</span>
          </div>

          <span class="mt-3 text-xs text-secondary tracking-widest uppercase font-medium group-hover:underline">
            Read More →
          </span>
        </NuxtLink>
      </div>

      <!-- Empty state -->
      <div v-else class="flex flex-col items-center text-center py-24">
        <div class="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4">
          <IconArticle class="w-8 h-8 text-base-content/20" />
        </div>
        <p class="font-medium text-base-content/50">No posts found</p>
        <button v-if="search || selectedTag" class="btn btn-ghost btn-sm mt-3" @click="search = ''; selectedTag = null">
          Clear filters
        </button>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-primary py-12 mt-12">
      <div class="max-w-6xl mx-auto px-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <NuxtLink to="/" class="flex items-center gap-2">
            <img v-if="settings?.logoUrl" :src="settings.logoUrl" :alt="settings?.siteName" class="h-7 w-auto object-contain brightness-0 invert opacity-50" />
            <span v-else class="flex items-center gap-2 text-base-100/60 font-serif text-sm tracking-widest uppercase">
              <IconDiamond class="size-4 text-secondary/60" />
              {{ settings?.siteName || 'Sense of Jewels' }}
            </span>
          </NuxtLink>
          <p class="text-base-100/30 text-xs tracking-wide text-center">
            &copy; {{ new Date().getFullYear() }} {{ settings?.siteName || 'Sense of Jewels' }}. {{ t.footer.tagline }}
          </p>
          <NuxtLink to="/admin/login" class="text-base-100/20 hover:text-base-100/40 transition-colors text-xs tracking-widest uppercase">
            {{ t.footer.admin }}
          </NuxtLink>
        </div>
      </div>
    </footer>

  </div>
</template>
