<template>
  <div class="config-list">
    <t-skeleton :loading="loading">
      <t-list :split="true" size="small">
        <t-list-item v-for="item in data" :key="item._id">
          <t-list-item-meta  :title="item.name" />
          <template #action>
            <t-dropdown v-if="isMobile" placement="left-top">
              <t-button theme="primary" variant="text">操作</t-button>
              <t-dropdown-menu>
                <t-dropdown-item
                  v-for="opt in getDropItemList(item)"
                  :key="opt.content"
                  :theme="opt.isError ? 'error' : 'default'"
                  @click="opt.onClick"
                >
                  {{ opt.content }}
                </t-dropdown-item>
              </t-dropdown-menu>
            </t-dropdown>
            <span v-else>
              <t-button
                v-for="opt in getDropItemList(item)"
                :key="opt.content"
                :theme="opt.isError ? 'danger' : 'primary'"
                variant="text"
                @click="opt.onClick"
              >
                {{ opt.content }}
              </t-button>
            </span>
          </template>
        </t-list-item>
      </t-list>

      <div v-if="!data.length" class="tw-text-center tw-py-8 tw-font-light tw-text-3xl tw-opacity-50">
        No Data (x.x)
      </div>
    </t-skeleton>
  </div>
  <config-detail-dialog v-model:visible="detailVisible" :data="detailItem"/>
  <config-delete-dialog v-model:visible="delVisible" :data="delItem" @delete="emits('del', delItem?.slug || '')"/>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGlobalStore } from '@/stores/store'
import type { ConfigItem } from '@/types';
import ConfigDetailDialog from './config-detail-dialog.vue';
import ConfigDeleteDialog from './config-delete-dialog.vue';

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

const emits = defineEmits<{
  (e: 'del', slug: string): void;
}>()

const router = useRouter();

const { isMobile } = useGlobalStore()


const detailVisible = ref(false);
const detailItem = ref<ConfigItem>();
const delVisible = ref(false);
const delItem = ref<ConfigItem>();

const handleShowDetail = (item: ConfigItem) => {
  detailItem.value = item;
  detailVisible.value = true;
}

const handleDel = (item: ConfigItem) => {
  delItem.value = item;
  delVisible.value = true;
}

const redirectConfig = (item: ConfigItem) => {
  router.push(`/config/edit/${item.slug}`)
}

const getDropItemList = (item: ConfigItem) => {
  return [
    {
      content: '编辑',
      onClick: () => redirectConfig(item),
      isError: false
    },
    {
      content: '详情',
      onClick: () => handleShowDetail(item),
      isError: false
    },
    {
      content: '删除',
      onClick: () => handleDel(item),
      isError: true
    },
  ]
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