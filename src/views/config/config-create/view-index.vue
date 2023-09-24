<template>
  <div class="config-create">
    <t-row class="tw-h-full">
      <t-col flex="400px" class="tw-h-full">
        <view-sidebar/>
      </t-col>
      <t-col flex="auto" class="tw-h-full">
        <config-editor />
      </t-col>
    </t-row>
  </div>
</template>
<script setup lang="ts">
import ViewSidebar from './view-sidebar.vue';
import ConfigEditor from './config-editor.vue';

</script>
<style lang="scss" scope>
.config-create {
  @apply tw-h-[calc(100vh-132px)];
}
</style>