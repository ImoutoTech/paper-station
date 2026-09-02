<template>
  <div class="space-y-3 p-2">
    <p class="text-sm text-muted-foreground">登录后可管理配置与站点。</p>
    <UiButton class="w-full" @click="handleLogin">登录</UiButton>
  </div>
</template>

<script setup lang="ts">
import { UiButton } from '@/components/ui/button'
import { ENV } from '@/utils/env'

const handleLogin = () => {
  const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`
  const loginUrl = `${ENV.API.replace(/\/$/, '')}/user/oidc/login`
  window.location.assign(`${loginUrl}?returnTo=${encodeURIComponent(returnTo)}`)
}
</script>
