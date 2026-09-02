<template>
  <UiAlertDialog
    v-model:open="open"
    :title="`确认删除 ${data?.name || ''} 吗？`"
    description="删除后，所有已关联的站点将无法访问该配置。"
    confirm-text="删除"
    @confirm="handleConfirm"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { UiAlertDialog } from '@/components/ui/alert-dialog'
import type { ConfigItem } from '@/types'

defineOptions({
  name: 'ConfigDeleteDialog'
})

const props = withDefaults(defineProps<{
  data?: ConfigItem
  visible: boolean
}>(), {
  visible: false
})

const emits = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'delete'): void
}>()

const open = computed({
  get: () => props.visible,
  set: (value: boolean) => emits('update:visible', value)
})

const handleConfirm = () => {
  emits('delete')
  emits('update:visible', false)
}
</script>
