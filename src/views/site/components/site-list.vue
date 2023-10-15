<template>
  <div class="site-list">
    <t-skeleton :loading="loading">
      <t-row v-for="line in displayLines" :key="`line-${line}`">
        <t-col v-for="item in preLine" :key="`item-${line}-${item}`" :span="12/preLine">
          <site-item-card v-if="data[(line - 1) * preLine + item - 1]" :data="data[(line - 1) * preLine + item - 1]"/>
        </t-col>
      </t-row>
      <div v-if="!data.length" class="tw-text-center tw-py-8 tw-font-light tw-text-3xl tw-opacity-50">
        No Data (x.x)
      </div>
    </t-skeleton>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import SiteItemCard from './site-item.vue';
import type { SiteItem } from '@/types';

defineOptions({
  name: 'SiteList',
});

const props = withDefaults(defineProps<{
  data: SiteItem[];
  loading: boolean;
  preLine: number;
}>(), {
  data: () => [],
  loading: false,
  preLine: 3,
});

const emits = defineEmits<{
  (e: 'del', slug: string): void;
}>()

const displayLines = computed(() => {
  return Math.ceil(props.data.length / props.preLine);
})

</script>
<style lang="scss">
.config-list {
  .t-list-item__meta-title {
    @apply tw-m-0;
  }

  .t-list--split .t-list-item:last-of-type::after {
    @apply tw-h-0;
  }
}
</style>