<template>
  <UiDialog v-model:open="open" title="配置详情" width-class="max-w-2xl">
    <dl class="grid gap-4 sm:grid-cols-2">
      <div v-for="item in detailRows" :key="item.label" class="rounded-lg border border-border bg-muted/40 p-3">
        <dt class="text-xs text-muted-foreground">{{ item.label }}</dt>
        <dd class="mt-1 break-all text-sm font-medium">{{ item.value }}</dd>
      </div>
      <div class="rounded-lg border border-border bg-muted/40 p-3 sm:col-span-2">
        <dt class="text-xs text-muted-foreground">访问链接</dt>
        <dd class="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
          <code class="flex-1 break-all rounded bg-background px-2 py-1 text-sm">{{ accessUrl }}</code>
          <UiButton variant="secondary" size="sm" class="gap-2" @click="handleCopy">
            <Copy class="size-4" />复制
          </UiButton>
        </dd>
      </div>
    </dl>
  </UiDialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Copy } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import copy from 'copy-to-clipboard'
import { UiButton } from '@/components/ui/button'
import { UiDialog } from '@/components/ui/dialog'
import type { ConfigItem } from '@/types'
import { ENV } from '@/utils/env'

defineOptions({
  name: 'ConfigDetailDialog'
})

const props = withDefaults(defineProps<{
  data?: ConfigItem
  visible: boolean
}>(), {
  visible: false
})

const emits = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const open = computed({
  get: () => props.visible,
  set: (value: boolean) => emits('update:visible', value)
})

const accessUrl = computed(() => `${ENV.API}/config/get?slug=${props.data?.slug || ''}`)
const detailRows = computed(() => [
  { label: '配置名', value: props.data?.name || '-' },
  { label: 'Slug', value: props.data?.slug || '-' },
  { label: '归属者ID', value: props.data?.owner || '-' },
  { label: '创建于', value: props.data?.created_at || '-' },
  { label: '上次修改于', value: props.data?.updated_at || '-' }
])

const handleCopy = () => {
  copy(accessUrl.value)
  toast.success('复制成功')
}
</script>
