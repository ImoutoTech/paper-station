<template>
  <t-dialog
    :visible="visible"
    theme="warning"
    :header="`确认删除 ${data?.name} 吗？`"
    cancel-btn="取消"
    @close="emits('update:visible', false)"
    @confirm="emits('delete'), emits('update:visible', false)"
  >
    <div>
      <p class="tw-opacity-50">删除后，所有已关联的站点将无法访问该配置</p>
    </div>
  </t-dialog>
</template>
<script lang="ts" setup>
import type { ConfigItem } from '@/types';

defineOptions({
  name: 'ConfigDeleteDialog',
});

withDefaults(defineProps<{
  data?: ConfigItem,
  visible: boolean;
}>(), {
  visible: false,
});

const emits = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'delete'): void;
}>()
</script>