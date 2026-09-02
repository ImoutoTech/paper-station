<template>
  <UiCard :title="data.name" class="h-full">
    <template #actions>
      <UiDropdownMenu :items="actionOptions" icon-only label="站点操作" />
    </template>
    <div class="space-y-4">
      <div class="flex items-center justify-between gap-3">
        <UiBadge variant="secondary">域名</UiBadge>
        <span class="truncate text-sm">
          {{ displayDomainText }}
          <UiBadge v-if="data.domains.length > 1" variant="outline" class="ml-1">+{{ data.domains.length - 1 }}</UiBadge>
        </span>
      </div>
      <div class="flex items-center justify-between gap-3">
        <UiBadge variant="secondary">配置数</UiBadge>
        <span class="text-sm">{{ data.configs.length }}</span>
      </div>
    </div>
  </UiCard>

  <UiAlertDialog
    v-model:open="deleteVisible"
    title="删除站点"
    :description="`你确定要删除站点 ${data.name} 吗？`"
    confirm-text="删除"
    @confirm="confirmDelete"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { UiAlertDialog } from '@/components/ui/alert-dialog'
import { UiBadge } from '@/components/ui/badge'
import { UiCard } from '@/components/ui/card'
import { UiDropdownMenu, type DropdownMenuItem } from '@/components/ui/dropdown-menu'
import type { SiteItem } from '@/types'

defineOptions({
  name: 'SiteItem'
})

const props = withDefaults(defineProps<{
  data: SiteItem
}>(), {})

const emits = defineEmits<{
  (e: 'del', id: number): void
  (e: 'inspect', id: number): void
  (e: 'edit', id: number): void
}>()

const deleteVisible = ref(false)

const actionOptions: DropdownMenuItem[] = [
  {
    label: '编辑',
    onClick: () => emits('edit', props.data.id)
  },
  {
    label: '详情',
    onClick: () => emits('inspect', props.data.id)
  },
  {
    label: '删除',
    destructive: true,
    onClick: () => {
      deleteVisible.value = true
    }
  }
]

const displayDomainText = computed(() => {
  if (props.data.domains.length >= 1) {
    return props.data.domains[0]
  }

  return '-'
})

const confirmDelete = () => {
  emits('del', props.data.id)
  deleteVisible.value = false
}
</script>
