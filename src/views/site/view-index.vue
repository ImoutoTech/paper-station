<template>
  <div class="config-home">
    <t-space direction="vertical" class="tw-w-full">
      <t-card>
        <div class="tw-flex tw-justify-between tw-items-center tw-mb-3">
          <h2>我的站点</h2>
          <t-space>
            <t-select v-model="displayPreLine" autoWidth label="每行展示">
              <t-option label="2个" :value="2"></t-option>
              <t-option label="3个" :value="3"></t-option>
              <t-option label="4个" :value="4"></t-option>
            </t-select>
            <t-button @click="router.push({name: 'config-create'})">新建</t-button>
          </t-space>
        </div>
        <t-input
          v-model="siteSearchText"
          placeholder="输入关键词，回车查找配置"
          @enter="siteStore.handleSearch"
        ></t-input>
      </t-card>

      <site-list :data="siteData" :pre-line="displayPreLine" :loading="siteLoading"/>

      <t-pagination
        v-model="siteStore.sitePagination.current"
        v-model:pageSize="siteStore.sitePagination.size"
        :total="siteStore.sitePagination.total"
        @change="siteStore.onPageChange"
      />
    </t-space>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import SiteList from './components/site-list.vue';
import { useSiteList } from '@/hooks/useSiteList';

const router = useRouter();

const siteStore = useSiteList();
const { siteSearchText, siteList: siteData, siteLoading } = siteStore;

const displayPreLine = ref(3);

onMounted(() => {
  siteStore.refreshSiteList();
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