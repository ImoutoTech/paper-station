<template>
  <div class="config-create">
    <aside class="config-create-sidebar-panel">
      <ViewSidebar :is-create="isCreate" @confirm="confirmRequest" />
    </aside>
    <section class="min-h-[680px] md:min-h-0">
      <ConfigEditor />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import ViewSidebar from './view-sidebar.vue'
import ConfigEditor from './config-editor.vue'
import { createConfig, getConfig, updateConfig } from '@/api/config'
import { useConfigStore } from './store'

const configStore = useConfigStore()
const router = useRouter()
const route = useRoute()

const isCreate = computed(() => route.name === 'config-create')

const addConfig = () => {
  return createConfig(configStore.getConfigData()).then((res) => {
    if (res.data.code === 0) {
      toast.success('创建成功')
      router.push({ name: 'config-index' })
    } else {
      throw new Error(res.data.msg)
    }
  })
}

const editConfig = () => {
  return updateConfig(route.params.slug as string, configStore.getConfigData()).then((res) => {
    if (res.data.code === 0) {
      toast.success('编辑成功')
      router.push({ name: 'config-index' })
    } else {
      throw new Error(res.data.msg)
    }
  })
}

const confirmRequest = () => {
  configStore.setLoading(true)
  const request = isCreate.value ? addConfig() : editConfig()

  request
    .catch((e) => {
      toast.error(e.message)
    })
    .finally(() => {
      configStore.setLoading(false)
    })
}

onMounted(() => {
  if (!isCreate.value) {
    getConfig(route.params.slug as string)
      .then((res) => {
        if (res.data.code !== 0) {
          throw new Error(res.data.msg)
        }
        configStore.updateMeta(res.data.data.name, res.data.data.slug)
        configStore.updateContent(res.data.data.data)
      })
      .catch((e) => {
        toast.error(e.message)
        router.go(-1)
      })
  }
})

onUnmounted(() => {
  configStore.clear()
})
</script>

<style lang="scss" scoped>
.config-create {
  @include content-width;
  @apply grid gap-5 py-5 md:h-[calc(100vh-136px)] md:grid-cols-[240px_minmax(0,1fr)];
}

.config-create-sidebar-panel {
  @apply rounded-xl border border-border bg-card p-4 shadow-sm;
}
</style>
