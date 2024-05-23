<template>
  <div class="config-create">
    <t-row class="tw-h-full">
      <t-col :xs="12" :md="2" class="md:tw-h-full">
        <view-sidebar :is-create="isCreate" @confirm="confirmRequest"/>
      </t-col>
      <t-col :xs="12" :md="10" class="tw-h-[900px] md:tw-h-full">
        <config-editor />
      </t-col>
    </t-row>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';
import ViewSidebar from './view-sidebar.vue';
import ConfigEditor from './config-editor.vue';
import { createConfig, getConfig, updateConfig } from '@/api/config';

import { useConfigStore } from './store'; 

const configStore = useConfigStore();
const router = useRouter();
const route = useRoute();

const isCreate = computed(() => route.name === 'config-create')

const addConfig = () => {
  return createConfig(configStore.getConfigData()).then((res) => {
    if (res.data.code === 0) {
      MessagePlugin.success('创建成功');
      router.push({ name: 'config-index' });
    } else {
      throw new Error(res.data.msg)
    }
  })
}

const editConfig = () => {
  return updateConfig(route.params.slug as string, configStore.getConfigData()).then((res) => {
    if (res.data.code === 0) {
      MessagePlugin.success('编辑成功');
      router.push({ name: 'config-index' });
    } else {
      throw new Error(res.data.msg)
    }
  })
}

const confirmRequest = () => {
  configStore.setLoading(true);
  const request = isCreate.value ? addConfig() : editConfig();

  request.catch((e) => {
    MessagePlugin.error(e.message);
  }).finally(() => {
    configStore.setLoading(false);
  })
}

onMounted(() => {
  if (!isCreate.value) {
    getConfig(route.params.slug as string).then((res) => {
      if (res.data.code !== 0) {
        throw new Error(res.data.msg)
      }
      configStore.updateMeta(res.data.data.name, res.data.data.slug)
      configStore.updateContent(res.data.data.data)
    }).catch((e) => {
      MessagePlugin.error(e.message);
      router.go(-1);
    })
  }
})

onUnmounted(() => {
  configStore.clear();
})
</script>
<style lang="scss" scoped>
.config-create {
  @apply tw-h-[calc(100vh-132px)];
}
</style>