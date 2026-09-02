<template>
  <header class="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
    <div class="mx-auto flex h-16 w-[90%] max-w-5xl items-center justify-between gap-4">
      <button class="text-lg font-semibold tracking-tight" type="button" @click="router.push('/')">
        Paper Station
      </button>

      <nav class="flex items-center gap-1">
        <UiButton
          v-for="menu in MENU_LIST"
          :key="menu.value"
          :variant="menuStore.value === menu.value ? 'secondary' : 'ghost'"
          size="sm"
          @click="router.push(menu.value)"
        >
          {{ menu.label }}
        </UiButton>
      </nav>

      <div ref="userMenuRef" class="relative">
        <UiButton
          variant="outline"
          size="icon"
          aria-label="用户菜单"
          aria-haspopup="menu"
          :aria-expanded="isUserMenuOpen"
          @click="toggleUserMenu"
        >
          <User class="size-4" />
        </UiButton>
        <div
          v-if="isUserMenuOpen"
          class="absolute right-0 mt-2 w-72 rounded-xl border border-border bg-popover p-3 text-popover-foreground shadow-lg"
          role="menu"
        >
          <UserMeta v-if="userStore.isLogin" />
          <UserLogin v-else />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { User } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { UiButton } from '@/components/ui/button'
import UserMeta from '../user/user-meta.vue'
import UserLogin from '../user/user-login.vue'
import { MENU_LIST } from '@/utils/constants'
import { useGlobalStore } from '@/stores/store'

defineOptions({
  name: 'HeaderNav'
})

const router = useRouter()
const { menuStore, userStore } = useGlobalStore()
const isUserMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const closeUserMenuWhenClickOutside = (event: PointerEvent) => {
  const target = event.target
  if (!(target instanceof Node) || userMenuRef.value?.contains(target)) {
    return
  }
  isUserMenuOpen.value = false
}

onMounted(() => {
  document.addEventListener('pointerdown', closeUserMenuWhenClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', closeUserMenuWhenClickOutside)
})
</script>
