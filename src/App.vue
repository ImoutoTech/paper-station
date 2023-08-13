<template>
  <t-layout>
    <t-header><header-nav/></t-header>
    <t-content>
      <router-view />
    </t-content>
    <t-footer>Footer</t-footer>
  </t-layout>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderNav from '@/components/layout/header-nav.vue'
</script>
