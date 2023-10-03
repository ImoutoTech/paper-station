<template>
  <div class="config-list">
    <t-skeleton :loading="loading">
      <t-list :stripe="true">
        <t-list-item v-for="item in data" :key="item._id">
          <t-list-item-meta  :title="item.name" />
          <template #action>
            <span>
              <t-button theme="primary" variant="text" @click="router.push(`/config/edit/${item.slug}`)">编辑</t-button>
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
import { useRouter } from 'vue-router';
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

const router = useRouter();
</script>
<style lang="scss">
.config-list {
  @apply tw-mt-4;
}
</style>