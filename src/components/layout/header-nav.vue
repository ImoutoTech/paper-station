<template>
  <t-head-menu :value="menuStore.value" theme="light">
    <template #logo>
      <span class="tw-font-medium tw-text-lg tw-mx-3">Paper Station</span>
    </template>
    <t-menu-item v-for="menu in  MENU_LIST" :key="menu.value" :value="menu.value" @click="router.push(menu.value)">{{ menu.label }}</t-menu-item>
    <template #operations>
      <t-popup trigger="click">
        <t-button variant="text" shape="square">
          <template #icon><t-icon name="user" /></template>
        </t-button>
        <template #content>
          <user-meta v-if="userStore.isLogin"></user-meta>
        </template>
      </t-popup>
    </template>
  </t-head-menu>
</template>
<script setup lang="ts">
import { useGlobalStore } from '@/stores/store';
import { useRouter } from 'vue-router';

import UserMeta from '../user/user-meta.vue';

import { MENU_LIST } from '@/utils/constants';

defineOptions({
  name: 'HeaderNav'
})

const router = useRouter();
const { menuStore, userStore } = useGlobalStore();
</script>