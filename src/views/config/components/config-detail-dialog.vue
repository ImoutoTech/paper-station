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
      <t-form-item label="访问链接">
        <t-link underline theme="primary" @click="handleCopy">
          <template #prefix-icon>
            <CopyIcon/>
          </template>
          {{ `${ENV.API}/config/get?slug=${data?.slug}` }}
        </t-link>
      </t-form-item>
    </t-form>
  </t-dialog>
</template>
<script lang="ts" setup>
import type { ConfigItem } from '@/types';
import { ENV } from '@/utils/env';
import { CopyIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import copy from 'copy-to-clipboard';

defineOptions({
  name: 'ConfigDetailDialog',
});

const props = withDefaults(defineProps<{
  data?: ConfigItem,
  visible: boolean;
}>(), {
  visible: false,
});

const emits = defineEmits<{
  (e: 'update:visible', value: boolean): void;
}>()


const handleCopy = () => {
  copy(`${ENV.API}/config/get?slug=${props.data?.slug}`);
  MessagePlugin.success('复制成功')
}
</script>