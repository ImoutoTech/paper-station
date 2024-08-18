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
  const redirect = `${window.location.origin}/login`
  window.location.href = `${ENV.SSO}/oauth/authorize?client_id=${ENV.SSO_ID}&redirect_uri=${redirect}`
}
</script>