<template>
  <div class="space-y-4 p-2">
    <div class="flex flex-col items-center gap-2 text-center">
      <UiAvatar :image="userStore.userInfo.avatar" :fallback="userStore.userInfo.email || 'User'" />
      <div>
        <p class="font-medium">{{ userStore.userInfo.email || '已登录用户' }}</p>
        <p class="text-xs text-muted-foreground">ID {{ userStore.userInfo.id }}</p>
      </div>
    </div>
    <div class="space-y-2 text-sm">
      <div class="flex items-center justify-between gap-2">
        <UiBadge variant="outline">用户ID</UiBadge>
        <span>{{ userStore.userInfo.id }}</span>
      </div>
      <div class="flex items-center justify-between gap-2">
        <UiBadge variant="outline">邮箱</UiBadge>
        <span class="truncate">{{ userStore.userInfo.email }}</span>
      </div>
    </div>
    <UiButton class="w-full" variant="secondary" @click="userStore.logout">退出</UiButton>
  </div>
</template>

<script setup lang="ts">
import { UiAvatar } from '@/components/ui/avatar'
import { UiBadge } from '@/components/ui/badge'
import { UiButton } from '@/components/ui/button'
import { useGlobalStore } from '@/stores/store'

const { userStore } = useGlobalStore()
</script>
