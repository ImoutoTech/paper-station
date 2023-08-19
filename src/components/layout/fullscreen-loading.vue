<template>
  <div class="fs-loading">
    <slot>
      <LoadIcon class="tw-text-[32px] tw-text-blue-500 tw-animate-spin" />
    </slot>
  </div>
</template>
<script setup lang="ts">
import { LoadIcon } from 'tdesign-icons-vue-next'
</script>
<style lang="scss" scoped>
.fs-loading {
  @apply tw-w-screen tw-h-screen tw-fixed tw-backdrop-blur-sm;
  @apply tw-bg-white tw-opacity-90 tw-top-0 tw-left-0 tw-flex tw-justify-center tw-items-center;
}
</style>