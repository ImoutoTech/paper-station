<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'UiAvatar'
})

const props = withDefaults(defineProps<{
  image?: string
  alt?: string
  fallback?: string
}>(), {
  image: '',
  alt: 'User',
  fallback: 'U'
})

const fallbackText = computed(() => props.fallback.slice(0, 2).toUpperCase())
</script>

<template>
  <span class="inline-flex size-16 shrink-0 overflow-hidden rounded-full border border-border bg-muted text-muted-foreground">
    <img v-if="image" :src="image" :alt="alt" class="h-full w-full object-cover" />
    <span v-else class="flex h-full w-full items-center justify-center text-lg font-semibold">
      {{ fallbackText }}
    </span>
  </span>
</template>
