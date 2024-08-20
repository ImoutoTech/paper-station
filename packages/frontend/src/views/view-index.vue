<template>
  <div class="app-home">
    <div class="banner">
      <h2>Paper Station 动态配置系统</h2>
    </div>

    <div class="content">
      <h3>README</h3>
      <t-card>
        {{ displayData }}
      </t-card>
      <t-space></t-space>
      <h3>快速开始</h3>
      <t-row :gutter="[16, 16]">
        <t-col :xs="12" :sm="4">
          <t-card title="登录" hover-shadow header-bordered class="tw-w-full">
            啥事都得先有个账号，点击右上角以登录。
          </t-card>
        </t-col>
        <t-col :xs="12" :sm="4">
          <t-card title="创建配置" hover-shadow header-bordered class="tw-flex-1">
            创建一个配置，支持JSON格式。
            <template #actions>
              <span
                v-if="globalStore.userStore.isLogin"
                class="tw-cursor-pointer"
                @click="router.push('/config/create')"
              >
                <RocketIcon/>
              </span>
              <span v-else class="tw-cursor-pointer">请先登录</span>
            </template>
          </t-card>
        </t-col>
        <t-col :xs="12" :sm="4">
          <t-card title="创建站点" hover-shadow header-bordered class="tw-w-full">
            创建一个站点，并输入域名、关联配置。配置关联后，只有该域名才能访问对应配置噢。
            <template #actions>
              <span
                v-if="globalStore.userStore.isLogin"
                class="tw-cursor-pointer"
                @click="router.push('/site')"
              >
                <RocketIcon/>
              </span>
              <span v-else class="tw-cursor-pointer">请先登录</span>
            </template>
          </t-card>
        </t-col>
      </t-row>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { readConfig } from '@/api/config';
import { useGlobalStore } from '@/stores/store';

import { RocketIcon } from 'tdesign-icons-vue-next';

const globalStore = useGlobalStore();
const displayData = ref('加载中...');
const router = useRouter();

onMounted(() => {
  readConfig('index').then(res => {
    displayData.value = res.data.content;
  })
})
</script>
<style lang="scss" >
.app-home {
  .banner {
    @apply tw-h-[300px] tw-flex tw-justify-center tw-items-center tw-bg-slate-100 md:tw-h-[500px];

    h2 {
      @apply tw-text-2xl tw-opacity-70 md:tw-text-3xl;
    }
  }

  .content {
    @include content-width;
    @apply tw-my-5;

    h3 {
      @apply tw-text-xl tw-mb-2 md:tw-text-2xl;
    }
  }
}
</style>