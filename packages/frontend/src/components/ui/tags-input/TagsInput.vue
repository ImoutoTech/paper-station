<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import { UiInput } from '@/components/ui/input'
import { UiBadge } from '@/components/ui/badge'

const model = defineModel<string[]>({ default: () => [] })

withDefaults(defineProps<{
  disabled?: boolean
  placeholder?: string
}>(), {
  disabled: false,
  placeholder: '输入后按 Enter 添加'
})

const draft = ref('')

const addTag = () => {
  const value = draft.value.trim()
  if (!value || model.value.includes(value)) return
  model.value = [...model.value, value]
  draft.value = ''
}

const removeTag = (tag: string) => {
  model.value = model.value.filter((item) => item !== tag)
}
</script>

<template>
  <div class="rounded-md border border-input bg-background p-2">
    <div class="mb-2 flex flex-wrap gap-2">
      <UiBadge v-for="tag in model" :key="tag" variant="secondary" class="gap-1 py-1">
        {{ tag }}
        <button v-if="!disabled" type="button" class="rounded-full hover:text-destructive" @click="removeTag(tag)">
          <X class="size-3" />
        </button>
      </UiBadge>
      <span v-if="!model.length" class="text-sm text-muted-foreground">暂无域名</span>
    </div>
    <UiInput
      v-if="!disabled"
      v-model="draft"
      :placeholder="placeholder"
      @keydown.enter.prevent="addTag"
      @blur="addTag"
    />
  </div>
</template>
