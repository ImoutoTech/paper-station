<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { UiButton } from '@/components/ui/button'

defineOptions({
  name: 'UiPagination'
})

export interface PaginationChange {
  current: number
  pageSize: number
}

const current = defineModel<number>('current', { default: 1 })
const pageSize = defineModel<number>('pageSize', { default: 10 })

const props = withDefaults(defineProps<{
  total: number
  pageSizes?: number[]
}>(), {
  pageSizes: () => [10, 20, 50]
})

const emit = defineEmits<{
  change: [value: PaginationChange]
}>()

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / pageSize.value)))
const start = computed(() => props.total === 0 ? 0 : (current.value - 1) * pageSize.value + 1)
const end = computed(() => Math.min(props.total, current.value * pageSize.value))

const update = (nextCurrent = current.value, nextPageSize = pageSize.value) => {
  current.value = Math.min(Math.max(1, nextCurrent), Math.max(1, Math.ceil(props.total / nextPageSize)))
  pageSize.value = nextPageSize
  emit('change', { current: current.value, pageSize: pageSize.value })
}
</script>

<template>
  <div class="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
    <div>显示 {{ start }} - {{ end }} / 共 {{ total }} 条</div>
    <div class="flex flex-wrap items-center gap-2">
      <label class="flex items-center gap-2">
        每页
        <select class="h-9 rounded-md border border-input bg-background px-2 text-foreground" :value="pageSize" @change="update(1, Number(($event.target as HTMLSelectElement).value))">
          <option v-for="size in pageSizes" :key="size" :value="size">{{ size }}</option>
        </select>
      </label>
      <UiButton variant="outline" size="sm" :disabled="current <= 1" @click="update(current - 1)">
        <ChevronLeft class="size-4" />上一页
      </UiButton>
      <span class="px-2 text-foreground">{{ current }} / {{ pageCount }}</span>
      <UiButton variant="outline" size="sm" :disabled="current >= pageCount" @click="update(current + 1)">
        下一页<ChevronRight class="size-4" />
      </UiButton>
    </div>
  </div>
</template>
