<template>
  <div class="tw-p-2">
    <t-space>
      <t-button @click="handleLogin">登录</t-button>
    </t-space>
  </div>
</template>
<script setup lang="ts">
import { ENV } from '@/utils/env';

const handleLogin = () => {
  const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`
  const loginUrl = `${ENV.API.replace(/\/$/, '')}/user/oidc/login`
  window.location.assign(`${loginUrl}?returnTo=${encodeURIComponent(returnTo)}`)
}
</script>
