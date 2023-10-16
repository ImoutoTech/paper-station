<template>
  <t-card :title="data.name" header-bordered>
    <template #actions>
      <t-dropdown :options="actionOptions" :min-column-width="100">
        <span class="tw-cursor-pointer">操作</span>
      </t-dropdown>
    </template>
    <t-space direction="vertical" class="tw-w-full">
      <div class="tw-flex tw-justify-between">
        <t-tag theme="success" variant="light">域名</t-tag><span class="tw-ml-2">{{ displayDomainText }} <t-tag v-if="data.domains.length > 1" shape="round" size="small">+{{ data.domains.length - 1 }}</t-tag> </span>
      </div>
      <div class="tw-flex tw-justify-between">
        <t-tag theme="success" variant="light">配置数</t-tag><span class="tw-ml-2">{{ data.configs.length }}</span>
      </div>
    </t-space>
  </t-card>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import type { SiteItem } from '@/types';

defineOptions({
  name: 'SiteItem',
});

const props = withDefaults(defineProps<{
  data: SiteItem;
}>(), {});

const emits = defineEmits<{
  (e: 'del', id: string): void;
  (e: 'inspect', id: string): void;
  (e: 'edit', id: string): void;
}>()

const actionOptions = [
  {
    content: '编辑',
    value: 'edit',
    onClick: () => emits('edit', props.data._id),
  },
  {
    content: '详情',
    value: 'inspect',
    onClick: () => emits('inspect', props.data._id),
  },
  {
    content: '删除',
    value: 'del',
    theme: 'error',
    onClick: () => emits('del', props.data._id),
  },
];

const displayDomainText = computed(() => {
  if (props.data.domains.length >= 1) {
    return props.data.domains[0]
  }

  return '-'
})
</script>