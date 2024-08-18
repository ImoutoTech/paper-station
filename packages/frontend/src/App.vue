<template>
  <t-layout class="app-layout">
    <t-header><header-nav/></t-header>
    <t-content>
      <router-view />
    </t-content>
    <t-footer>
      <p class="tw-text-xl tw-text-center">Made with ❤️ by youranreus</p>
    </t-footer>
  </t-layout>
  <fullscreen-loading v-if="userStore.loginLoading || isLoading"/>
</template>
<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { RouterView, useRouter } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next';
import HeaderNav from '@/components/layout/header-nav.vue'
import FullscreenLoading from '@/components/layout/fullscreen-loading.vue';

import { useGlobalStore } from '@/stores/store';
import { getUserData } from './api/user';

const { userStore, isLoading } = useGlobalStore();
const router = useRouter();

onMounted(() => {
  if (localStorage.getItem('PS_TOKEN')) {
    userStore.setLoading(true);
    getUserData()
      .then((res) => {
        if (res.data.code !== 0) {
          return;
        }
        userStore.login({
          ...res.data?.data
        })
        MessagePlugin.success('登录信息获取成功');
      })
      .finally(() => {
        userStore.setLoading(false);
      })
  }
})

watch(
  () => userStore.isLogin,
  (val) => {
    if (!val) {
      router.push('/')
    }
  },
)
</script>
<style lang="scss" scoped>
.app-layout {
  @apply tw-bg-white
}
</style>
