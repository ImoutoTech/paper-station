<template>
  <div class="config-home">
    <t-space direction="vertical" class="tw-w-full">
      <t-card>
        <div class="tw-flex tw-justify-between tw-items-center tw-mb-3">
          <h2>我的站点</h2>
          <t-button @click="router.push({name: 'config-create'})">新建</t-button>
        </div>
        <t-input
          v-model="siteSearchText"
          placeholder="输入关键词，回车查找配置"
          @enter="siteStore.handleSearch"
        ></t-input>
      </t-card>

      <site-list :data="siteData" :pre-line="3" :loading="siteLoading"/>
    </t-space>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import SiteList from './components/site-list.vue';
import { useSiteList } from '@/hooks/useSiteList';

const router = useRouter();

const siteStore = useSiteList();
const { siteSearchText, siteList: siteData, siteLoading } = siteStore;

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