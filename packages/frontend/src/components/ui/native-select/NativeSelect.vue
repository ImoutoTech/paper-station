<script setup lang="ts">
import { cn } from '@/lib/utils'

type SelectValue = string | number

const model = defineModel<SelectValue>({ default: '' })

withDefaults(defineProps<{
  options: Array<{ label: string; value: SelectValue }>
  disabled?: boolean
  class?: string
}>(), {
  disabled: false,
  class: ''
})
</script>

<template>
  <select
    v-model="model"
    :disabled="disabled"
    :class="cn('h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50', $props.class)"
  >
    <option v-for="option in options" :key="String(option.value)" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>
