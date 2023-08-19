<template>
  <t-layout>
    <t-header><header-nav/></t-header>
    <t-content>
      <router-view />
    </t-content>
    <t-footer>
      <p class="tw-text-xl tw-text-center">Made with ❤️ by youranreus</p>
    </t-footer>
  </t-layout>
  <fullscreen-loading v-if="userStore.loginLoading"/>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView, useRouter } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next';
import HeaderNav from '@/components/layout/header-nav.vue'
import FullscreenLoading from '@/components/layout/fullscreen-loading.vue';

import { useGlobalStore } from '@/stores/store';
import { getUserData } from './api/user';

const { userStore } = useGlobalStore();
const router = useRouter();

onMounted(() => {
  if (localStorage.getItem('PS_TOKEN')) {
    userStore.setLoading(true);
    getUserData()
      .then((res) => {
        userStore.login({
          ...res.data.data
        })
        MessagePlugin.success('登录信息获取成功');
      }).catch((e) => {
        router.push('/');
        MessagePlugin.warning('登录态已失效')
        console.error(e);
      })
      .finally(() => {
        userStore.setLoading(false);
      })
  } else {
    router.push('/')
  }
})
</script>
