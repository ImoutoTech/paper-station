<script setup lang="ts">
import { cn } from '@/lib/utils'

defineOptions({
  name: 'UiCard'
})

withDefaults(defineProps<{
  title?: string
  class?: string
  contentClass?: string
}>(), {
  title: '',
  class: '',
  contentClass: ''
})
</script>

<template>
  <section :class="cn('rounded-xl border border-border bg-card text-card-foreground', $props.class)">
    <header v-if="title || $slots.header || $slots.actions" class="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
      <slot name="header">
        <h3 class="text-base font-semibold leading-none tracking-tight">{{ title }}</h3>
      </slot>
      <div v-if="$slots.actions" class="flex shrink-0 items-center gap-2">
        <slot name="actions" />
      </div>
    </header>
    <div :class="cn('p-5', contentClass)">
      <slot />
    </div>
  </section>
</template>
