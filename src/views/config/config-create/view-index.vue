<template>
  <div class="config-create">
    <t-row>
      <t-col flex="400px">
        <view-sidebar/>
      </t-col>
      <t-col flex="auto">
        <div>auto</div>
      </t-col>
    </t-row>
  </div>
</template>
<script setup lang="ts">
import ViewSidebar from './view-sidebar.vue';

</script>
<style lang="scss" scope>
.config-create {
  @apply tw-h-[calc(100vh-132px)];
}
</style>