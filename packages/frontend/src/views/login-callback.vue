<template>
  <div class="flex min-h-[calc(100vh-136px)] items-center justify-center px-4">
    <UiCard class="w-full max-w-md text-center">
      <div class="mb-4 flex justify-center">
        <CircleAlert v-if="isError" class="size-16 text-destructive" />
        <Cat v-else class="size-16 text-primary" />
      </div>
      <p class="flex items-center justify-center leading-6">
        <LoaderCircle v-if="loading" class="mr-2 size-4 animate-spin" />{{ msg }}
      </p>
      <UiButton v-if="isError" class="mt-4 w-full" @click="router.push('/')">返回</UiButton>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Cat, CircleAlert, LoaderCircle } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { UiButton } from '@/components/ui/button'
import { UiCard } from '@/components/ui/card'
import { useGlobalStore } from '@/stores/store'
import { getUserData } from '@/api/user'

const route = useRoute()
const router = useRouter()

const { userStore } = useGlobalStore()

const msg = ref('登录中')
const isError = ref(false)
const loading = ref(true)

const errorMessages: Record<string, string> = {
  oidc_cancelled: '登录已取消',
  oidc_invalid_callback: '登录回调无效或已过期',
  oidc_unavailable: '登录服务暂时不可用'
}

const safeReturnTo = (value: unknown) => {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return '/'
  return value
}

const login = () => {
  loading.value = true

  getUserData()
    .then((res) => {
      if (res.data.code !== 0) {
        throw new Error(res.data.msg)
      }

      userStore.login(res.data.data)
      toast.success('登陆成功')
      router.replace(safeReturnTo(route.query.returnTo))
    })
    .catch(() => {
      isError.value = true
      msg.value = '登录态建立失败，请重试'
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  const error = typeof route.query.error === 'string' ? route.query.error : ''
  if (error) {
    msg.value = errorMessages[error] || '登录失败，请重试'
    isError.value = true
    loading.value = false
    return
  }

  login()
})
</script>
