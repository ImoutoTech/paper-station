<template>
  <div class="site-home">
    <UiCard>
      <template #header>
        <div>
          <h2 class="text-2xl font-semibold">我的站点</h2>
          <p class="mt-1 text-sm text-muted-foreground">管理域名与配置关联。</p>
        </div>
      </template>
      <template #actions>
        <div class="flex items-center gap-2">
          <label v-if="!isMobile" class="flex items-center gap-2 text-sm text-muted-foreground">
            每行展示
            <UiNativeSelect v-model="displayPreLine" :options="displayOptions" class="w-24" />
          </label>
          <UiButton @click="createVisible = true">新建</UiButton>
        </div>
      </template>
      <div class="flex gap-2">
        <UiInput
          v-model="siteSearchText"
          placeholder="输入关键词，回车查找站点"
          @keydown.enter="siteStore.handleSearch"
        />
        <UiButton variant="secondary" class="h-10" @click="siteStore.handleSearch">搜索</UiButton>
      </div>
    </UiCard>

    <div class="mt-5">
      <SiteList
        :data="siteData"
        :pre-line="displayPreLine"
        :loading="siteLoading"
        @del="siteStore.handleDelete($event)"
        @refresh="siteStore.refreshSiteList"
      />
    </div>

    <UiPagination
      v-model:current="siteStore.sitePagination.current"
      v-model:page-size="siteStore.sitePagination.size"
      class="mt-5"
      :total="siteStore.sitePagination.total"
      @change="siteStore.onPageChange"
    />

    <SiteEdit v-model:visible="createVisible" is-create @confirm="siteStore.refreshSiteList" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SiteList from './components/site-list.vue'
import SiteEdit from './components/site-edit.vue'
import { UiButton } from '@/components/ui/button'
import { UiCard } from '@/components/ui/card'
import { UiInput } from '@/components/ui/input'
import { UiNativeSelect } from '@/components/ui/native-select'
import { UiPagination } from '@/components/ui/pagination'
import { useSiteList } from '@/hooks/useSiteList'
import { useGlobalStore } from '@/stores/store'

const displayOptions = [
  { label: '2 个', value: 2 },
  { label: '3 个', value: 3 },
  { label: '4 个', value: 4 }
]

const siteStore = useSiteList()
const { siteSearchText, siteList: siteData, siteLoading } = siteStore
const { isMobile } = useGlobalStore()

const displayPreLine = ref(isMobile ? 1 : 3)
const createVisible = ref(false)

onMounted(() => {
  siteStore.refreshSiteList()
})
</script>

<style lang="scss" scoped>
.site-home {
  @include content-width;
  @apply mt-5 pb-8;
}
</style>
