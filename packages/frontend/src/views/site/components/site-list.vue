<template>
  <div class="site-list">
    <t-skeleton :loading="loading">
      <t-row :gutter="[16, 16]">
        <t-col v-for="item in data.length" :key="`item-${item}`" :span="12/preLine">
          <site-item-card
            v-if="data[item - 1]"
            :data="data[item - 1]"
            @del="emits('del', $event)"
            @edit="handleSelectSite('edit', item - 1)"
            @inspect="handleSelectSite('inspect', item - 1)"
          />
        </t-col>
      </t-row>
      <div v-if="!data.length" class="tw-text-center tw-py-8 tw-font-light tw-text-3xl tw-opacity-50">
        No Data (x.x)
      </div>
    </t-skeleton>
  </div>

  <site-edit
    v-model:visible="editVisible"
    :is-create="false"
    :readonly="isReadonly"
    :site="currentSiteItem"
    @confirm="emits('refresh')"
  />
</template>
<script setup lang="ts">
import { ref } from 'vue';
import SiteItemCard from './site-item.vue';
import SiteEdit from './site-edit.vue';
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
  (e: 'refresh'): void;
}>()

const editVisible = ref(false);
const currentSiteItem = ref<SiteItem>();
const isReadonly = ref(false);

const handleSelectSite = (type: 'inspect' | 'edit', idx: number) => {
  currentSiteItem.value = props.data[idx];
  isReadonly.value = type === 'inspect';
  editVisible.value = true;
}
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