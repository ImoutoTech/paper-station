<template>
  <div class="config-list divide-y divide-border">
    <template v-if="loading">
      <div v-for="item in 4" :key="item" class="flex items-center justify-between p-5">
        <div class="space-y-2">
          <div class="h-4 w-40 animate-pulse rounded bg-muted" />
          <div class="h-3 w-24 animate-pulse rounded bg-muted" />
        </div>
        <div class="h-8 w-24 animate-pulse rounded bg-muted" />
      </div>
    </template>

    <template v-else-if="data.length">
      <article v-for="item in data" :key="item._id" class="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 class="font-medium text-foreground">{{ item.name }}</h3>
          <p class="mt-1 text-sm text-muted-foreground">{{ item.slug }}</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <UiButton variant="ghost" size="sm" @click="redirectConfig(item)">编辑</UiButton>
          <UiButton variant="ghost" size="sm" @click="handleShowDetail(item)">详情</UiButton>
          <UiButton variant="ghost" size="sm" class="text-destructive hover:text-destructive" @click="handleDel(item)">删除</UiButton>
        </div>
      </article>
    </template>

    <div v-else class="py-12 text-center">
      <p class="text-lg font-medium text-muted-foreground">No Data (x.x)</p>
      <p class="mt-1 text-sm text-muted-foreground">还没有匹配的配置。</p>
    </div>
  </div>

  <ConfigDetailDialog v-model:visible="detailVisible" :data="detailItem" />
  <ConfigDeleteDialog v-model:visible="delVisible" :data="delItem" @delete="emitDelete" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { UiButton } from '@/components/ui/button'
import type { ConfigItem } from '@/types'
import ConfigDetailDialog from './config-detail-dialog.vue'
import ConfigDeleteDialog from './config-delete-dialog.vue'

defineOptions({
  name: 'ConfigList'
})

withDefaults(defineProps<{
  data: ConfigItem[]
  loading: boolean
}>(), {
  data: () => [],
  loading: false
})

const emits = defineEmits<{
  (e: 'del', slug: string): void
}>()

const router = useRouter()

const detailVisible = ref(false)
const detailItem = ref<ConfigItem>()
const delVisible = ref(false)
const delItem = ref<ConfigItem>()

const handleShowDetail = (item: ConfigItem) => {
  detailItem.value = item
  detailVisible.value = true
}

const handleDel = (item: ConfigItem) => {
  delItem.value = item
  delVisible.value = true
}

const redirectConfig = (item: ConfigItem) => {
  router.push(`/config/edit/${item.slug}`)
}

const emitDelete = () => {
  emits('del', delItem.value?.slug || '')
}
</script>
