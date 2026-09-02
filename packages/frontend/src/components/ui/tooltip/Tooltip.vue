<script setup lang="ts">
defineOptions({
  name: 'UiTooltip'
})

withDefaults(defineProps<{
  content: string
  disabled?: boolean
}>(), {
  disabled: false
})
</script>

<template>
  <span class="inline-block" :title="disabled ? '' : content">
    <slot />
  </span>
</template>
