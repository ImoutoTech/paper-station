<template>
  <div class="config-create-sidebar">
    <div class="tw-mb-4">
      <h2 class="tw-text-2xl">{{actionText}}配置</h2>
    </div>
    <t-form ref="formRef" :data="meta" :rules="formRules" label-align="top" class="tw-mb-4">
      <t-form-item label="配置名" name="name">
        <t-input :value="meta.name" @change="updateName"></t-input>
      </t-form-item>

      <t-form-item label="Slug" name="slug">
        <t-input :value="meta.slug" :disabled="!isCreate" @change="updateSlug"></t-input>
      </t-form-item>
    </t-form>

    <div class="tw-opacity-70 tw-mb-8 tw-text-sm">
      可通过以下链接获取配置 <span>{{ `${ENV.API}/config/get?slug=${meta.slug || '{slug}'}` }}</span>
    </div>

    <t-button block @click="handleConfirm" :loading="loading">{{ actionText }}</t-button>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { ENV } from '@/utils/env';
import { useConfigStore } from './store'

const { meta, updateName, updateSlug, loading } = useConfigStore();

const emit = defineEmits<{
  (e: 'confirm'): void;
}>()

const props = withDefaults(defineProps<{
  isCreate: boolean;
}>(), {
  isCreate: true,
});

const formRules = {
  name: [{ required: true, message: '请填写该选项', type: 'error' }],
  slug: [{ required: true, message: '请填写该选项', type: 'error' }],
};

const formRef = ref();

const actionText = computed(() => props.isCreate ? '创建' : '更新')

const handleConfirm = async () => {
  if (!formRef.value) {
    return;
  }

  const isValidate = await formRef.value.validate();
  isValidate === true && emit('confirm');
}
</script>
<style lang="scss" scoped>
.config-create-sidebar {
  @apply tw-h-full tw-px-4 tw-py-2;
}
</style>