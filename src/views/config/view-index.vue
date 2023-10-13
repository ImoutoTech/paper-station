<template>
  <div class="config-home">
    <t-card>
      <div class="tw-flex tw-justify-between tw-items-center tw-mb-3">
        <h2>我的配置</h2>
        <t-button @click="router.push({name: 'config-create'})">新建</t-button>
      </div>
      <t-input v-model="configSearchText" placeholder="输入关键词，回车查找配置" @enter="handleSearch"></t-input>
    </t-card>

    <t-space direction="vertical" class="tw-w-full">
      <config-list :data="configData" :loading="configLoading" @del="handleDelete"/>

      <t-pagination
        v-model="configPagination.current"
        v-model:pageSize="configPagination.size"
        :total="configPagination.total"
        @change="onPageChange"
      />
    </t-space>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from "vue-router";
import { useConfigList } from '@/hooks/useConfigList';
import ConfigList from './components/config-list.vue';

const { 
  configList: configData,
  refreshConfigList,
  configLoading,
  configPagination,
  onPageChange,
  configSearchText,
  handleSearch,
  handleDelete,
} = useConfigList();

const router = useRouter();

onMounted(() => {
  refreshConfigList()
});
</script>
<style lang="scss" scoped>
.config-home {
  @include content-width;
  @apply tw-mt-5;

  h2 {
    @apply tw-text-xl tw-font-bold;
  }
}
</style>