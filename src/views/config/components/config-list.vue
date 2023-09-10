<template>
  <div class="config-list">
    <t-skeleton :loading="loading">
      <t-list :stripe="true">
        <t-list-item v-for="item in data" :key="item._id">
          <t-list-item-meta  :title="item.name" />
          <template #action>
            <span>
              <t-button theme="primary" variant="text">编辑</t-button>
              <t-button theme="primary" variant="text">详情</t-button>
              <t-button theme="danger" variant="text">删除</t-button>
            </span>
          </template>
        </t-list-item>
      </t-list>
    </t-skeleton>
  </div>
</template>
<script setup lang="ts">
import type { ConfigItem } from '@/types';

defineOptions({
  name: 'ConfigList',
});

withDefaults(defineProps<{
  data: ConfigItem[],
  loading: boolean;
}>(), {
  data: () => [],
  loading: false,
});
</script>
<style lang="scss" scope>
.config-list {
  @apply tw-mt-4;
}
</style>