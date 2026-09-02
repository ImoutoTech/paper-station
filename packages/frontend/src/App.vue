<template>
  <div class="min-h-screen bg-background text-foreground">
    <HeaderNav />
    <main class="min-h-[calc(100vh-136px)]">
      <RouterView />
    </main>
    <footer class="border-t border-border bg-card py-6">
      <p class="text-center text-sm text-muted-foreground">Made with ❤️ by youranreus</p>
    </footer>
  </div>
  <FullscreenLoading v-if="userStore.loginLoading || isLoading" />
  <UiToaster rich-colors position="top-center" />
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import HeaderNav from '@/components/layout/header-nav.vue'
import FullscreenLoading from '@/components/layout/fullscreen-loading.vue'
import { UiToaster } from '@/components/ui/sonner'
import { useGlobalStore } from '@/stores/store'
import { getUserData } from './api/user'

const { userStore, isLoading } = useGlobalStore()
const router = useRouter()

onMounted(() => {
  userStore.setLoading(true)
  getUserData()
    .then((res) => {
      userStore.login({
        ...res.data?.data
      })
      toast.success('登录信息获取成功')
    })
    .catch(() => undefined)
    .finally(() => {
      userStore.setLoading(false)
    })
})

watch(
  () => userStore.isLogin,
  (val) => {
    if (!val) {
      router.push('/')
    }
  }
)
</script>
