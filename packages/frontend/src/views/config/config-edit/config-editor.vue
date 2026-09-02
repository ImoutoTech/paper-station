<template>
  <div class="config-editor">
    <UiCard title="编辑配置" class="h-full overflow-hidden" content-class="h-[calc(100%-73px)] p-0">
      <template #actions>
        <div class="flex items-center gap-2">
          <UiNativeSelect
            v-model="editorConfig.language"
            :options="LANGUAGE_OPTIONS"
            disabled
            class="w-28"
            @change="saveEditorConfig"
          />
          <EditorConfigDialog :data="editorConfig" @update="handleConfirmEditor" />
        </div>
      </template>
      <vue-monaco-editor
        :value="configStore.content"
        :theme="editorConfig.theme"
        :options="editorConfig.options"
        :language="editorConfig.language"
        @update:value="configStore.updateContent"
        @mount="handleMountedEditor"
        @validate="handleValidate"
      />
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import { reactive, shallowRef, onMounted } from 'vue'
import { cloneDeep } from 'lodash-es'
import type { editor } from 'monaco-editor'
import { UiCard } from '@/components/ui/card'
import { UiNativeSelect } from '@/components/ui/native-select'
import { useConfigStore } from './store'
import { useGlobalStore } from '@/stores/store'
import type { EditorConfig } from '@/types'
import EditorConfigDialog from './editor-config-dialog.vue'
import { LANGUAGE_OPTIONS, DEFAULT_EDITOR_CONFIG } from './constants'

const configStore = useConfigStore()
const globalStore = useGlobalStore()

const editorRef = shallowRef<editor.IStandaloneCodeEditor>()
const editorConfig = reactive<EditorConfig>(cloneDeep(DEFAULT_EDITOR_CONFIG))

const saveEditorConfig = () => {
  const { editorDB } = globalStore.storageStore
  editorDB.setItem('config', cloneDeep(editorConfig))
}

const handleConfirmEditor = (data: EditorConfig) => {
  Object.assign(editorConfig, DEFAULT_EDITOR_CONFIG, data)
  saveEditorConfig()
}

const handleMountedEditor = async (instance: editor.IStandaloneCodeEditor) => {
  editorRef.value = instance
}

const handleValidate = (e: editor.IMarker[]) => {
  configStore.setValidate(!e.length)
}

onMounted(async () => {
  const { editorDB } = globalStore.storageStore
  const editorOptions = await editorDB.getItem('config')

  if (editorOptions !== null) {
    Object.assign(editorConfig, DEFAULT_EDITOR_CONFIG, editorOptions)
  }
})
</script>

<style lang="scss" scoped>
.config-editor {
  @apply h-full w-full;
}
</style>
