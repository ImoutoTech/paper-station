<template>
  <div class="site-list">
    <div v-if="loading" :class="gridClass">
      <UiCard v-for="item in 4" :key="item">
        <div class="space-y-3">
          <div class="h-5 w-36 animate-pulse rounded bg-muted" />
          <div class="h-4 w-full animate-pulse rounded bg-muted" />
          <div class="h-4 w-24 animate-pulse rounded bg-muted" />
        </div>
      </UiCard>
    </div>

    <div v-else-if="data.length" :class="gridClass">
      <SiteItemCard
        v-for="(item, index) in data"
        :key="item.id"
        :data="item"
        @del="emits('del', $event)"
        @edit="handleSelectSite('edit', index)"
        @inspect="handleSelectSite('inspect', index)"
      />
    </div>

    <UiCard v-else class="py-8 text-center">
      <p class="text-lg font-medium text-muted-foreground">No Data (x.x)</p>
      <p class="mt-1 text-sm text-muted-foreground">还没有匹配的站点。</p>
    </UiCard>
  </div>

  <SiteEdit
    v-model:visible="editVisible"
    :is-create="false"
    :readonly="isReadonly"
    :site="currentSiteItem"
    @confirm="emits('refresh')"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { UiCard } from '@/components/ui/card'
import SiteItemCard from './site-item.vue'
import SiteEdit from './site-edit.vue'
import type { SiteItem } from '@/types'

defineOptions({
  name: 'SiteList'
})

const props = withDefaults(defineProps<{
  data: SiteItem[]
  loading: boolean
  preLine: number
}>(), {
  data: () => [],
  loading: false,
  preLine: 3
})

const emits = defineEmits<{
  (e: 'del', slug: number): void
  (e: 'refresh'): void
}>()

const editVisible = ref(false)
const currentSiteItem = ref<SiteItem>()
const isReadonly = ref(false)

const gridClass = computed(() => {
  const columns = props.preLine === 4 ? 'lg:grid-cols-4' : props.preLine === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'
  return ['grid gap-4 md:grid-cols-2', columns]
})

const handleSelectSite = (type: 'inspect' | 'edit', idx: number) => {
  currentSiteItem.value = props.data[idx]
  isReadonly.value = type === 'inspect'
  editVisible.value = true
}
</script>
