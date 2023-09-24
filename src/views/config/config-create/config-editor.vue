<template>
  <div class="config-editor">
    <vue-monaco-editor
      v-model:value="value"
      theme="vs-dark"
      :options="options"
      language="json"
      @mount="editor = $event"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, shallowRef } from 'vue';

const value = ref('');
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