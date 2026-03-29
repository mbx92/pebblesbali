<template>
  <div>
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-base-content">Blog</h1>
        <p class="text-sm text-base-content/50 mt-1">Manage blog posts</p>
      </div>
      <div class="mt-3 sm:mt-0">
        <button class="btn btn-primary btn-sm" @click="openCreate()">
          <IconPlus class="w-4 h-4" /> Add Post
        </button>
      </div>
    </div>

    <!-- Blog Posts Table -->
    <div class="card bg-base-100 border border-base-300">
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr class="text-xs uppercase text-base-content/40">
              <th>Post</th>
              <th>Tags</th>
              <th>Sort</th>
              <th>Status</th>
              <th>Published</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in blogPosts" :key="post.id" class="hover cursor-pointer" @click="openEdit(post)">
              <td>
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-base-200 rounded overflow-hidden shrink-0">
                    <img v-if="post.image" :src="post.image" :alt="post.title" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <IconArticle class="w-5 h-5 text-base-content/20" />
                    </div>
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-medium truncate max-w-xs">{{ post.title }}</p>
                    <p class="text-xs text-base-content/40 font-mono truncate max-w-xs">{{ post.slug }}</p>
                  </div>
                </div>
              </td>
              <td>
                <div class="flex flex-wrap gap-1 max-w-48">
                  <span v-for="tag in post.tags.slice(0, 3)" :key="tag" class="badge badge-soft badge-xs badge-secondary">{{ tag }}</span>
                  <span v-if="post.tags.length > 3" class="badge badge-soft badge-xs">+{{ post.tags.length - 3 }}</span>
                  <span v-if="post.tags.length === 0" class="text-xs text-base-content/30">—</span>
                </div>
              </td>
              <td class="text-sm text-base-content/60">{{ post.sortOrder }}</td>
              <td>
                <span class="badge badge-soft badge-sm" :class="post.isPublished ? 'badge-success' : 'badge-warning'">
                  {{ post.isPublished ? 'Published' : 'Draft' }}
                </span>
              </td>
              <td class="text-xs text-base-content/50">
                {{ post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '—' }}
              </td>
              <td>
                <button class="btn btn-ghost btn-xs" @click.stop="openEdit(post)">
                  <IconPencil class="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="(blogPosts || []).length === 0" class="py-16 flex flex-col items-center text-center">
          <div class="bg-base-200 rounded-full p-4 mb-3">
            <IconArticle class="w-8 h-8 text-base-content/30" />
          </div>
          <p class="font-medium text-base-content/60">No blog posts yet</p>
          <button class="btn btn-primary btn-sm mt-3" @click="openCreate()">
            <IconPlus class="w-4 h-4" /> Add Post
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <dialog ref="modalRef" class="modal">
      <div class="modal-box max-w-4xl">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-3 top-3" @click="closeModal()">
          <IconX class="w-4 h-4" />
        </button>
        <h3 class="font-bold text-lg mb-4">{{ editing ? 'Edit Post' : 'Add Post' }}</h3>

        <form @submit.prevent="save()">
          <div class="grid grid-cols-2 gap-4">
            <fieldset class="fieldset col-span-2">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Title</legend>
              <input v-model="form.title" type="text" class="input w-full" required @input="autoSlug" />
            </fieldset>

            <fieldset class="fieldset col-span-2">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Slug</legend>
              <input v-model="form.slug" type="text" class="input w-full font-mono text-sm" required />
            </fieldset>
          </div>

          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Excerpt</legend>
            <textarea v-model="form.excerpt" class="textarea w-full" rows="2" placeholder="Short summary..."></textarea>
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Body</legend>
            <TipTapEditor v-model="form.body" placeholder="Write your blog post content here..." />
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Cover Image</legend>
            <div v-if="form.image" class="mb-2 flex items-center gap-3">
              <img :src="form.image" class="w-20 h-14 rounded object-cover border border-base-300" />
              <button type="button" class="btn btn-xs btn-ghost text-error" @click="form.image = ''">Remove</button>
            </div>
            <div class="flex gap-2">
              <input v-model="form.image" type="text" class="input input-sm flex-1 font-mono" placeholder="Paste URL or pick from media..." />
              <button type="button" class="btn btn-sm btn-outline shrink-0" :disabled="!mediaLibraryEnabled" @click="pickerOpen = true">
                <IconPhoto class="w-4 h-4" />
              </button>
            </div>
            <p v-if="!mediaLibraryEnabled" class="label text-xs text-base-content/40">Media browser is disabled. Paste a direct image URL if needed.</p>
          </fieldset>

          <MediaPickerModal v-if="mediaLibraryEnabled" :open="pickerOpen" :selected="form.image" @close="pickerOpen = false" @pick="url => form.image = url" />

          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Tags (comma-separated)</legend>
            <input v-model="tagsInput" type="text" class="input w-full" placeholder="jewelry, bali, craft" />
          </fieldset>

          <div class="grid grid-cols-3 gap-4">
            <fieldset class="fieldset">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Sort Order</legend>
              <input v-model.number="form.sortOrder" type="number" class="input w-full" />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Published</legend>
              <input v-model="form.isPublished" type="checkbox" class="toggle toggle-primary mt-2" />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Publish Date</legend>
              <input v-model="form.publishedAt" type="date" class="input w-full" :disabled="!form.isPublished" />
            </fieldset>
          </div>

          <div class="modal-action">
            <button v-if="editing" type="button" class="btn btn-error btn-sm mr-auto" @click="remove(editing!)">Delete</button>
            <button type="button" class="btn btn-ghost btn-sm" @click="closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary btn-sm" :disabled="saving">
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop" @click="closeModal()"><button>close</button></form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { IconPlus, IconX, IconArticle, IconPhoto, IconPencil } from '@tabler/icons-vue'
import type { BlogPost } from '~/types'
import { isFeatureEnabled } from '~/composables/usePlan'

const pickerOpen = ref(false)

const { data: blogPosts, refresh } = await useFetch<BlogPost[]>('/api/blog')
const { data: settings } = await useFetch<Record<string, string>>('/api/settings', {
  key: 'site-settings',
})
const mediaLibraryEnabled = computed(() => isFeatureEnabled(settings.value, 'mediaLibrary'))

const modalRef = ref<HTMLDialogElement>()
const editing = ref<string | null>(null)
const saving = ref(false)
const tagsInput = ref('')

const defaultForm = () => ({
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  image: '',
  isPublished: false,
  publishedAt: '',
  sortOrder: 0,
})
const form = ref(defaultForm())

function autoSlug() {
  if (!editing.value) {
    form.value.slug = form.value.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
  }
}

function openCreate() {
  editing.value = null
  form.value = defaultForm()
  tagsInput.value = ''
  modalRef.value?.showModal()
}

function openEdit(post: BlogPost) {
  editing.value = post.id
  form.value = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || '',
    body: post.body || '',
    image: post.image || '',
    isPublished: post.isPublished,
    publishedAt: post.publishedAt ? post.publishedAt.slice(0, 10) : '',
    sortOrder: post.sortOrder,
  }
  tagsInput.value = post.tags.join(', ')
  modalRef.value?.showModal()
}

function closeModal() {
  modalRef.value?.close()
}

async function save() {
  saving.value = true
  try {
    const tags = tagsInput.value
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)
    const payload = { ...form.value, tags }
    if (editing.value) {
      await $fetch(`/api/blog/${editing.value}`, { method: 'PUT', body: payload })
    } else {
      await $fetch('/api/blog', { method: 'POST', body: payload })
    }
    closeModal()
    await refresh()
  } finally {
    saving.value = false
  }
}

async function remove(id: string) {
  if (!confirm('Delete this blog post?')) return
  await $fetch(`/api/blog/${id}`, { method: 'DELETE' })
  closeModal()
  await refresh()
}
</script>
