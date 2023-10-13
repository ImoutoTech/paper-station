<template>
  <div class="config-list">
    <t-skeleton :loading="loading">
      <t-list :split="true" size="small">
        <t-list-item v-for="item in data" :key="item._id">
          <t-list-item-meta  :title="item.name" />
          <template #action>
            <span>
              <t-button theme="primary" variant="text" @click="router.push(`/config/edit/${item.slug}`)">编辑</t-button>
              <t-button theme="primary" variant="text" @click="handleShowDetail(item)">详情</t-button>
              <t-popconfirm
                placement="top-left"
                theme="danger"
                :confirm-btn="DELETE_POPUP_CONFIRM"
                @confirm="emits('del', item.slug)"
              >
                <template #content>
                  <div>
                    <p class="tw-font-bold tw-mb-2">确认删除{{item.name}}吗？</p>
                    <p class="tw-opacity-50">删除后，所有已关联的站点将无法访问该配置</p>
                  </div>
                </template>
                <t-button theme="danger" variant="text">删除</t-button>
              </t-popconfirm>
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
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { ConfigItem } from '@/types';
import ConfigDetailDialog from './config-detail-dialog.vue';

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

const DELETE_POPUP_CONFIRM = {
  content: '确认删除',
  theme: 'danger',
}

const detailVisible = ref(false);
const detailItem = ref<ConfigItem>();

const handleShowDetail = (item: ConfigItem) => {
  detailItem.value = item;
  detailVisible.value = true;
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