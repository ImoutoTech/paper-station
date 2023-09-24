<template>
  <div class="config-editor">
    <vue-monaco-editor
      :value="content"
      theme="vs-dark"
      :options="options"
      language="json"
      @update:value="updateContent"
      @mount="editor = $event"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import { useConfigStore } from './store';

const { content, updateContent } = useConfigStore();

const editor = shallowRef();

const options = ref({
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
});
</script>
<style lang="scss" scope>
.config-editor {
  @apply tw-w-full tw-h-full;
}
</style>