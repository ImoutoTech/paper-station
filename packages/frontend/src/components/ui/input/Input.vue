<script setup lang="ts">
import { cn } from '@/lib/utils'

defineOptions({
  name: 'UiInput'
})

const model = defineModel<string | number>({ default: '' })

withDefaults(defineProps<{
  type?: string
  placeholder?: string
  disabled?: boolean
  class?: string
}>(), {
  type: 'text',
  placeholder: '',
  disabled: false,
  class: ''
})
</script>

<template>
  <input
    v-model="model"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    :class="cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50', $props.class)"
  />
</template>
