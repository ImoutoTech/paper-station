<template>
  <UiButton variant="ghost" size="icon" aria-label="编辑器设置" @click="visible = true">
    <Settings2 class="size-4" />
  </UiButton>

  <UiDialog v-model:open="visible" title="编辑器设置">
    <form class="space-y-4" @submit.prevent="handleConfirm">
      <label class="block space-y-2">
        <span class="text-sm font-medium">字体大小</span>
        <UiNativeSelect v-model="config.options.fontSize" :options="EDITOR_OPTIONS.FONT_SIZE" class="w-full" />
      </label>
      <label class="block space-y-2">
        <span class="text-sm font-medium">Tab 大小</span>
        <UiNativeSelect v-model="config.options.tabSize" :options="EDITOR_OPTIONS.TAB_SIZE" class="w-full" />
      </label>
      <label class="block space-y-2">
        <span class="text-sm font-medium">主题</span>
        <UiNativeSelect v-model="config.theme" :options="EDITOR_OPTIONS.THEME" class="w-full" />
      </label>
      <div class="flex justify-end gap-2 pt-2">
        <UiButton variant="outline" type="button" @click="visible = false">取消</UiButton>
        <UiButton type="submit">保存</UiButton>
      </div>
    </form>
  </UiDialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onBeforeUnmount } from 'vue'
import { Settings2 } from 'lucide-vue-next'
import { cloneDeep } from 'lodash-es'
import { UiButton } from '@/components/ui/button'
import { UiDialog } from '@/components/ui/dialog'
import { UiNativeSelect } from '@/components/ui/native-select'
import type { EditorConfig } from '@/types'
import { DEFAULT_EDITOR_CONFIG, EDITOR_OPTIONS } from './constants'

defineOptions({
  name: 'EditorConfigDialog'
})

const props = withDefaults(defineProps<{
  data: EditorConfig
}>(), {
  data: () => cloneDeep(DEFAULT_EDITOR_CONFIG)
})

const visible = ref(false)

const emit = defineEmits<{
  (e: 'update', data: EditorConfig): void
}>()

const config = reactive<EditorConfig>({
  options: {},
  theme: '',
  language: ''
})

const unwatchConfig = watch(
  () => props.data,
  (val) => {
    Object.assign(config, cloneDeep(val))
  },
  {
    immediate: true,
    deep: true
  }
)

const handleConfirm = () => {
  emit('update', cloneDeep(config))
  visible.value = false
}

onBeforeUnmount(() => {
  unwatchConfig()
})
</script>
