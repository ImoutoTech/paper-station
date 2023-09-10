<template>
  <div class="config-home">
    <t-card>
      <div class="tw-flex tw-justify-between tw-items-center tw-mb-3">
        <h2>我的配置</h2>
        <t-button>新建</t-button>
      </div>
      <t-input placeholder="输入关键词查找配置"></t-input>
    </t-card>

    <config-list :data="configData"/>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { useConfigList } from '@/hooks/useConfigList';
import ConfigList from './components/config-list.vue';

const { configList: configData, refreshConfigList } = useConfigList();

onMounted(() => {
  refreshConfigList().then(() => {
    console.log(configData.value)
  });
});
</script>
<style lang="scss" scope>
@import '../../assets/common.scss';

.config-home {
  @include content-width;
  @apply tw-mt-5;

  h2 {
    @apply tw-text-xl tw-font-bold;
  }
}
</style>