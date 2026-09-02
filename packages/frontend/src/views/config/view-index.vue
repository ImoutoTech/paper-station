<template>
  <div class="config-home">
    <UiCard>
      <template #header>
        <div>
          <h2 class="text-2xl font-semibold">我的配置</h2>
          <p class="mt-1 text-sm text-muted-foreground">搜索、查看并维护动态配置。</p>
        </div>
      </template>
      <template #actions>
        <UiButton @click="router.push({ name: 'config-create' })">新建</UiButton>
      </template>
      <div class="flex gap-2">
        <UiInput
          v-model="configSearchText"
          placeholder="输入关键词，回车查找配置"
          @keydown.enter="handleSearch"
        />
        <UiButton variant="secondary" class="h-10" @click="handleSearch">搜索</UiButton>
      </div>
    </UiCard>

    <UiCard class="mt-5" content-class="p-0">
      <ConfigList :data="configData" :loading="configLoading" @del="handleDelete" />
    </UiCard>

    <UiPagination
      v-model:current="configPagination.current"
      v-model:page-size="configPagination.size"
      class="mt-5"
      :total="configPagination.total"
      @change="onPageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { UiButton } from '@/components/ui/button'
import { UiCard } from '@/components/ui/card'
import { UiInput } from '@/components/ui/input'
import { UiPagination } from '@/components/ui/pagination'
import { useConfigList } from '@/hooks/useConfigList'
import ConfigList from './components/config-list.vue'

const {
  configList: configData,
  refreshConfigList,
  configLoading,
  configPagination,
  onPageChange,
  configSearchText,
  handleSearch,
  handleDelete
} = useConfigList()

const router = useRouter()

onMounted(() => {
  refreshConfigList()
})
</script>

<style lang="scss" scoped>
.config-home {
  @include content-width;
  @apply mt-5 pb-8;
}
</style>
