<script setup lang="ts">
import { IconDiamond, IconCalendar, IconTag, IconArrowLeft, IconArticle } from '@tabler/icons-vue'
import { useTemplate } from '~/composables/useTemplate'

definePageMeta({ layout: false, middleware: 'features' })

const { data: settings } = await useFetch<Record<string, string>>('/api/settings')
useTheme(settings)
const { template, getSectionAnchor } = useTemplate(settings)

const route = useRoute()
const slug = route.params.slug as string

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  body: string | null
  image: string | null
  tags: string[]
  isPublished: boolean
  publishedAt: string | null
}

const { data: post, error } = await useFetch<BlogPost>(`/api/blog/${slug}`)

if (error.value || !post.value?.isPublished) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found' })
}

const { lang, t, toggleLang } = useLocale()
const plan = usePlan()
const siteName = computed(() => settings.value?.siteName || template.value.defaults.siteName)

function landingHref(sectionKey: string): string {
  return `/#${getSectionAnchor(sectionKey)}`
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString(lang.value === 'id' ? 'id-ID' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

// Simple plain-text body renderer — preserves paragraphs
const bodyParagraphs = computed(() =>
  (post.value?.body ?? '').split(/\n{2,}/).map(p => p.trim()).filter(Boolean)
)

useSeoMeta({
  title: () => `${post.value?.title} — ${siteName.value}`,
  description: () => post.value?.excerpt || settings.value?.metaDescription || '',
  ogImage: () => post.value?.image || settings.value?.ogImage || '',
  ogType: 'article',
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
          <NuxtLink to="/blog" class="hidden md:inline-flex btn btn-sm btn-outline btn-primary text-xs tracking-widest uppercase ml-2">
            <IconArrowLeft class="w-3.5 h-3.5" /> All Posts
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Hero / Cover Image -->
    <div class="pt-16">
      <div v-if="post?.image" class="w-full max-h-[50vh] overflow-hidden">
        <img :src="post.image" :alt="post.title" class="w-full h-full object-cover" style="max-height:50vh;" />
      </div>
      <div v-else class="w-full h-40 bg-primary flex items-center justify-center">
        <IconArticle class="w-16 h-16 text-primary-content/20" />
      </div>
    </div>

    <!-- Article -->
    <article class="max-w-3xl mx-auto px-6 py-12">

      <!-- Back -->
      <NuxtLink to="/blog" class="flex items-center gap-2 text-xs text-base-content/40 hover:text-secondary transition-colors tracking-widest uppercase mb-8">
        <IconArrowLeft class="w-4 h-4" /> Back to Blog
      </NuxtLink>

      <!-- Tags -->
      <div v-if="post?.tags?.length" class="flex flex-wrap gap-2 mb-5">
        <span v-for="tag in post.tags" :key="tag" class="flex items-center gap-1 badge badge-soft badge-secondary badge-sm">
          <IconTag class="w-2.5 h-2.5" />{{ tag }}
        </span>
      </div>

      <!-- Title -->
      <h1 class="font-serif text-3xl md:text-4xl font-light leading-tight text-base-content mb-4">
        {{ post?.title }}
      </h1>

      <!-- Date -->
      <div v-if="post?.publishedAt" class="flex items-center gap-2 text-sm text-base-content/40 mb-8 pb-8 border-b border-base-200">
        <IconCalendar class="w-4 h-4" />
        <span>{{ formatDate(post.publishedAt) }}</span>
      </div>

      <!-- Excerpt (lead) -->
      <p v-if="post?.excerpt" class="text-lg text-base-content/70 font-light leading-relaxed mb-8 italic">
        {{ post.excerpt }}
      </p>

      <!-- Body -->
      <div
        class="tiptap-render prose prose-sm max-w-none text-base-content/80 leading-relaxed"
        v-html="post?.body || ''"
      />

      <!-- Footer / Tags repeat -->
      <div v-if="post?.tags?.length" class="flex flex-wrap gap-2 mt-12 pt-8 border-t border-base-200">
        <span class="text-xs text-base-content/40 tracking-widest uppercase self-center mr-2">Tags:</span>
        <NuxtLink
          v-for="tag in post.tags"
          :key="tag"
          :to="`/blog?tag=${tag}`"
          class="badge badge-ghost badge-sm hover:badge-secondary transition-colors cursor-pointer"
        >{{ tag }}</NuxtLink>
      </div>

      <!-- Back button -->
      <div class="mt-12">
        <NuxtLink to="/blog" class="btn btn-outline btn-sm">
          <IconArrowLeft class="w-4 h-4" /> All Posts
        </NuxtLink>
      </div>

    </article>

    <!-- Footer -->
    <footer class="bg-primary py-12 mt-8">
      <div class="max-w-6xl mx-auto px-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <NuxtLink to="/" class="flex items-center gap-2">
            <img v-if="settings?.logoUrl" :src="settings.logoUrl" :alt="siteName" class="h-7 w-auto object-contain brightness-0 invert opacity-50" />
            <span v-else class="flex items-center gap-2 text-base-100/60 font-serif text-sm tracking-widest uppercase">
              <IconDiamond class="size-4 text-secondary/60" />
              {{ siteName }}
            </span>
          </NuxtLink>
          <p class="text-base-100/30 text-xs tracking-wide text-center">
            &copy; {{ new Date().getFullYear() }} {{ siteName }}. {{ t.footer.tagline }}
          </p>
          <NuxtLink to="/admin/login" class="text-base-100/20 hover:text-base-100/40 transition-colors text-xs tracking-widest uppercase">
            {{ t.footer.admin }}
          </NuxtLink>
        </div>
      </div>
    </footer>

  </div>
</template>
