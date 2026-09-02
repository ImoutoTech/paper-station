<template>
  <div class="app-home">
    <section class="banner">
      <div class="mx-auto w-[90%] max-w-5xl text-center">
        <p class="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-primary">Paper Station</p>
        <h1>动态配置发布工作台</h1>
        <p class="mx-auto mt-4 max-w-2xl text-muted-foreground">
          管理配置、绑定站点，让应用按域名获取正确的动态配置。
        </p>
      </div>
    </section>

    <section class="content space-y-5">
      <UiCard title="README">
        <pre class="whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">{{ displayData }}</pre>
      </UiCard>

      <div>
        <h2 class="mb-3 text-2xl font-semibold">快速开始</h2>
        <div class="grid gap-4 md:grid-cols-3">
          <UiCard title="登录">
            <p class="text-sm text-muted-foreground">啥事都得先有个账号，点击右上角以登录。</p>
          </UiCard>
          <UiCard title="创建配置">
            <p class="text-sm text-muted-foreground">创建一个配置，支持 JSON 格式。</p>
            <template #actions>
              <UiButton v-if="globalStore.userStore.isLogin" size="sm" class="gap-2" @click="router.push('/config/create')">
                <Rocket class="size-4" />开始
              </UiButton>
              <UiBadge v-else variant="outline">请先登录</UiBadge>
            </template>
          </UiCard>
          <UiCard title="创建站点">
            <p class="text-sm text-muted-foreground">创建一个站点，输入域名并关联配置，限制配置访问来源。</p>
            <template #actions>
              <UiButton v-if="globalStore.userStore.isLogin" size="sm" class="gap-2" @click="router.push('/site')">
                <Rocket class="size-4" />开始
              </UiButton>
              <UiBadge v-else variant="outline">请先登录</UiBadge>
            </template>
          </UiCard>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Rocket } from 'lucide-vue-next'
import { UiBadge } from '@/components/ui/badge'
import { UiButton } from '@/components/ui/button'
import { UiCard } from '@/components/ui/card'
import { readConfig } from '@/api/config'
import { useGlobalStore } from '@/stores/store'

const globalStore = useGlobalStore()
const displayData = ref('加载中...')
const router = useRouter()

onMounted(() => {
  readConfig('index').then((res) => {
    displayData.value = res.data.content
  })
})
</script>

<style lang="scss" scoped>
.app-home {
  .banner {
    @apply flex h-[360px] items-center justify-center bg-gradient-to-br from-blue-50 via-background to-slate-100 md:h-[500px];

    h1 {
      @apply text-3xl font-bold tracking-tight md:text-5xl;
    }
  }

  .content {
    @include content-width;
    @apply my-6;
  }
}
</style>
