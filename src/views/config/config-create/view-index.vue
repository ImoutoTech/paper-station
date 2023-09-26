<template>
  <div class="config-create">
    <t-row class="tw-h-full">
      <t-col flex="400px" class="tw-h-full">
        <view-sidebar @confirm="addConfig"/>
      </t-col>
      <t-col flex="auto" class="tw-h-full">
        <config-editor />
      </t-col>
    </t-row>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';
import ViewSidebar from './view-sidebar.vue';
import ConfigEditor from './config-editor.vue';
import { createConfig } from '@/api/config';

import { useConfigStore } from './store'; 

const configStore = useConfigStore();
const router = useRouter();

const addConfig = () => {
  configStore.setLoading(true);
  createConfig(configStore.getConfigData()).then((res) => {
    if (res.data.code === 0) {
      MessagePlugin.success('创建成功');
      router.push({ name: 'config-index' });
    } else {
      throw new Error(res.data.msg)
    }
  }).catch((e) => {
    MessagePlugin.error(e.message);
  }).finally(() => {
    configStore.setLoading(false);
  })
}

</script>
<style lang="scss" scoped>
.config-create {
  @apply tw-h-[calc(100vh-132px)];
}
</style>