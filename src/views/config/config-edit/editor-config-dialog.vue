<template>
  <t-button theme="primary" variant="text" @click="visible = true">
    <template #icon><adjustment-icon /></template>
  </t-button>
  <t-dialog
    v-model:visible="visible"
    header="编辑器设置"
    confirm-btn="保存"
    :on-confirm="handleConfirm"
    @close="visible = false"
  >
    <t-form :data="config" label-align="top">
      <t-form-item label="字体大小">
        <t-select v-model="config.options.fontSize" :options="EDITOR_OPTIONS.FONT_SIZE"></t-select>
      </t-form-item>
      <t-form-item label="Tab大小">
        <t-select v-model="config.options.tabSize" :options="EDITOR_OPTIONS.TAB_SIZE"></t-select>
      </t-form-item>
      <t-form-item label="主题">
        <t-select v-model="config.theme" :options="EDITOR_OPTIONS.THEME"></t-select>
      </t-form-item>
    </t-form>
  </t-dialog>
</template>
<script setup lang="ts">
import { ref, reactive, watch, onBeforeUnmount } from 'vue';
import type { EditorConfig } from '@/types';
import { cloneDeep } from 'lodash-es';
import { DEFAULT_EDITOR_CONFIG, EDITOR_OPTIONS } from './constants';
import { AdjustmentIcon } from 'tdesign-icons-vue-next';

defineOptions({
  name: 'EditorConfigDialog',
})

const props = withDefaults(defineProps<{
  data: EditorConfig,
}>(), {
  data: () => cloneDeep(DEFAULT_EDITOR_CONFIG),
})

const visible = ref(false);

const emit = defineEmits<{
  (e: 'update', data: EditorConfig): void;
}>();

const config = reactive<EditorConfig>({
  options: {},
  theme: '',
  language: '',
})

const unwatchConfig = watch(() => props.data, (val) => {
  Object.assign(config, cloneDeep(val));
}, {
  immediate: true,
  deep: true,
})

const handleConfirm = () => {
  emit('update', config);
  visible.value = false;
}

onBeforeUnmount(() => {
  unwatchConfig();
})
</script>
<style lang="scss" scoped>
</style>