<template>
  <div class="config-editor">
    <div class="config-editor-header">
      <t-space>
        <t-select v-model="editorConfig.language" class="tw-w-[100px]" :borderless="true" :options="LANGUAGE_OPTIONS" @change="saveEditorConfig"></t-select>
        <editor-config-dialog :data="editorConfig" @update="handleConfirmEditor"/>
      </t-space>
    </div>
    <div class="config-editor-container">
      <vue-monaco-editor
        :value="content"
        :theme="editorConfig.theme"
        :options="editorConfig.options"
        :language="editorConfig.language"
        @update:value="updateContent"
        @mount="editor = $event"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, shallowRef, onMounted } from 'vue';
import { useConfigStore } from './store';
import { useGlobalStore } from '@/stores/store';
import type { EditorConfig } from '@/types';
import EditorConfigDialog from './editor-config-dialog.vue';
import { cloneDeep } from 'lodash-es';

import { LANGUAGE_OPTIONS, DEFAULT_EDITOR_CONFIG } from './constants';

const { content, updateContent } = useConfigStore();
const globalStore = useGlobalStore();

const editor = shallowRef();

const editorConfig = reactive<EditorConfig>(cloneDeep(DEFAULT_EDITOR_CONFIG));

const saveEditorConfig = () => {
  const { editorDB } = globalStore.storageStore;
  editorDB.setItem('config', cloneDeep(editorConfig));
}

const handleConfirmEditor = (data: EditorConfig) => {
  Object.assign(editorConfig, DEFAULT_EDITOR_CONFIG, data);
  saveEditorConfig();
}

onMounted(async () => {
  const { editorDB } = globalStore.storageStore;
  const editorOptions = await editorDB.getItem('config');

  if (editorOptions !== null) {
    Object.assign(editorConfig, DEFAULT_EDITOR_CONFIG, editorOptions);
    console.log('读取成功')
  }
})
</script>
<style lang="scss" scoped>
.config-editor {
  @apply tw-w-full tw-h-full;

  &-header {
    @apply tw-h-10 tw-flex tw-justify-end tw-items-center;
    @apply tw-px-1;
  }

  &-container {
    @apply tw-h-[calc(100%-40px)];
  }
}
</style>