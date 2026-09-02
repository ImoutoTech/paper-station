<script setup lang="ts">
import { cn } from '@/lib/utils'

defineOptions({
  name: 'UiTextarea'
})

const model = defineModel<string>({ default: '' })

withDefaults(defineProps<{
  placeholder?: string
  disabled?: boolean
  rows?: number
  class?: string
}>(), {
  placeholder: '',
  disabled: false,
  rows: 3,
  class: ''
})
</script>

<template>
  <textarea
    v-model="model"
    :placeholder="placeholder"
    :disabled="disabled"
    :rows="rows"
    :class="cn('flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50', $props.class)"
  />
</template>
