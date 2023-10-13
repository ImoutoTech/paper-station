<template>
  <t-dialog
    :visible="visible"
    header="配置详情"
    :footer="false"
    @close="emits('update:visible', false)"
  >
    <t-form label-align="top">
      <t-form-item label="配置名">
        {{ data?.name || '-' }}
      </t-form-item>
      <t-form-item label="Slug">
        {{ data?.slug || '-' }}
      </t-form-item>
      <t-form-item label="归属者ID">
        {{ data?.owner || '-' }}
      </t-form-item>
      <t-form-item label="创建于">
        {{ data?.created_at || '-' }}
      </t-form-item>
      <t-form-item label="上次修改于">
        {{ data?.updated_at || '-' }}
      </t-form-item>
    </t-form>
  </t-dialog>
</template>
<script lang="ts" setup>
import type { ConfigItem } from '@/types';

defineOptions({
  name: 'ConfigDetailDialog',
});

withDefaults(defineProps<{
  data?: ConfigItem,
  visible: boolean;
}>(), {
  visible: false,
});

const emits = defineEmits<{
  (e: 'update:visible', value: boolean): void;
}>()
</script>