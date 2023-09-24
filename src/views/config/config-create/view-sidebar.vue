<template>
  <div class="config-create-sidebar">
    <div class="tw-mb-4">
      <h2 class="tw-text-2xl">创建配置</h2>
    </div>
    <t-form :data="meta" label-align="top" class="tw-mb-4">
      <t-form-item label="配置名" prop="name">
        <t-input :value="meta.name" @change="updateName"></t-input>
      </t-form-item>

      <t-form-item label="Slug" prop="slug">
        <t-input :value="meta.slug" @change="updateSlug"></t-input>
      </t-form-item>
    </t-form>

    <div class="tw-opacity-70 tw-mb-8 tw-text-sm">
      可通过以下链接获取配置 <span>{{ `${ENV.API}/config/get?slug=${meta.slug || '{slug}'}` }}</span>
    </div>

    <t-button block>创建</t-button>
  </div>
</template>
<script setup lang="ts">
import { ENV } from '@/utils/env';

import { useConfigStore } from './store'

const { meta, updateName, updateSlug } = useConfigStore();
</script>
<style lang="scss" scope>
.config-create-sidebar {
  @apply tw-h-full tw-px-4 tw-py-2;
}
</style>