<template>
  <div class="config-editor">
    <div class="config-editor-container">
      <t-card title="编辑配置" header-bordered class="tw-h-full tw-w-full tw-overflow-hidden">
        <template #actions>
          <t-space>
            <t-select v-model="editorConfig.language" disabled class="tw-w-[100px]" :borderless="true" :options="LANGUAGE_OPTIONS" @change="saveEditorConfig"></t-select>
            <editor-config-dialog :data="editorConfig" @update="handleConfirmEditor"/>
          </t-space>
        </template>
        <vue-monaco-editor
          :value="configStore.content"
          :theme="editorConfig.theme"
          :options="editorConfig.options"
          :language="editorConfig.language"
          @update:value="configStore.updateContent"
          @mount="handleMountedEditor"
        />
      </t-card>
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
import type { editor } from 'monaco-editor';

const configStore = useConfigStore();
const globalStore = useGlobalStore();

const editorRef = shallowRef<editor.IStandaloneCodeEditor>();

const editorConfig = reactive<EditorConfig>(cloneDeep(DEFAULT_EDITOR_CONFIG));

const saveEditorConfig = () => {
  const { editorDB } = globalStore.storageStore;
  editorDB.setItem('config', cloneDeep(editorConfig));
}

const handleConfirmEditor = (data: EditorConfig) => {
  Object.assign(editorConfig, DEFAULT_EDITOR_CONFIG, data);
  saveEditorConfig();
}

const handleMountedEditor = async (instance: editor.IStandaloneCodeEditor) => {
  editorRef.value = instance
}

onMounted(async () => {
  const { editorDB } = globalStore.storageStore;
  const editorOptions = await editorDB.getItem('config');

  if (editorOptions !== null) {
    Object.assign(editorConfig, DEFAULT_EDITOR_CONFIG, editorOptions);
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
    @apply tw-h-full tw-p-2;

    :deep(.t-card__body) {
      @apply tw-p-0 tw-h-[calc(100%-65px)] tw-overflow-hidden;
    }
  }
}
</style>