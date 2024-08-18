<template>
  <div class="tw-p-2">
    <t-space direction="vertical">
      <div class="tw-text-center">
        <t-avatar size="64px" :image="userStore.userInfo.avatar"> User </t-avatar>
      </div>
      <p>
        <t-space>
          <t-tag theme="primary" variant="light">用户ID</t-tag>
          <span>{{ userStore.userInfo.id }}</span>
        </t-space>
      </p>
      <p>
        <t-space>
          <t-tag theme="primary" variant="light">用户邮箱</t-tag>
          <span>{{ userStore.userInfo.email }}</span>
        </t-space>
      </p>
      <t-button block theme="primary" variant="base" @click="userStore.logout">退出</t-button>
    </t-space>
  </div>
</template>
<script setup lang="ts">
import { useGlobalStore } from '@/stores/store';

const { userStore } = useGlobalStore();
</script>