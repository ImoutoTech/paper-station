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
  window.location.href = `${ENV.SSO}/callback/${ENV.SSO_ID}`
}
</script>