<template>
  <div class="config-create-sidebar">
    <div class="tw-mb-4">
      <h2 class="tw-text-2xl">创建配置</h2>
    </div>
    <t-form :data="configData" label-align="top" class="tw-mb-4">
      <t-form-item label="配置名" prop="name">
        <t-input v-model="configData.name"></t-input>
      </t-form-item>

      <t-form-item label="Slug" prop="slug">
        <t-input v-model="configData.slug"></t-input>
      </t-form-item>
    </t-form>

    <div class="tw-opacity-70 tw-mb-8 tw-text-sm">
      可通过以下链接获取配置 <span>{{ `${ENV.API}/config/get?slug=${configData.slug || '{slug}'}` }}</span>
    </div>

    <t-button block>创建</t-button>
  </div>
</template>
<script setup lang="ts">
import { ENV } from '@/utils/env';
import { reactive } from 'vue';

const configData = reactive({
  name: '',
  slug: '',
});
</script>
<style lang="scss" scope>
.config-create-sidebar {
  @apply tw-h-full tw-px-4 tw-py-2;
}
</style>