<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
    <slot>
      <LoaderCircle class="size-10 animate-spin text-primary" />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { LoaderCircle } from 'lucide-vue-next'
</script>
