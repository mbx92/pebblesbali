<script setup lang="ts">
import { IconLayoutDashboard, IconPencil, IconX } from '@tabler/icons-vue'

const visible = useAdminBar()
const auth = useAuth()

onMounted(async () => {
  await auth.fetchUser()
  visible.value = auth.user.value !== null
})
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300"
    enter-from-class="-translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition-all duration-300"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="-translate-y-full opacity-0"
  >
    <div
      v-if="visible"
      class="fixed top-0 left-0 right-0 z-70 h-9 bg-primary border-b border-secondary/20 flex items-center justify-between px-4 text-xs text-base-100/70"
    >
      <div class="flex items-center gap-2.5">
        <span class="size-2 rounded-full bg-green-400 animate-pulse shrink-0" />
        <span class="tracking-wide hidden sm:inline">Live Preview</span>
        <span class="text-base-100/20 mx-1 hidden sm:inline">·</span>
        <span class="text-secondary font-medium">{{ auth.user.value?.name || auth.user.value?.email }}</span>
      </div>
      <div class="flex items-center gap-4">
        <NuxtLink
          to="/admin"
          class="flex items-center gap-1.5 hover:text-secondary transition-colors tracking-widest uppercase"
        >
          <IconLayoutDashboard class="size-3.5" />
          <span class="hidden sm:inline">Dashboard</span>
        </NuxtLink>
        <NuxtLink
          to="/admin/sections"
          class="flex items-center gap-1.5 hover:text-secondary transition-colors tracking-widest uppercase"
        >
          <IconPencil class="size-3.5" />
          <span class="hidden sm:inline">Edit Sections</span>
        </NuxtLink>
        <button
          @click="visible = false"
          class="hover:text-secondary transition-colors ml-1 flex items-center"
          aria-label="Close preview bar"
        >
          <IconX class="size-4" />
        </button>
      </div>
    </div>
  </Transition>
</template>
