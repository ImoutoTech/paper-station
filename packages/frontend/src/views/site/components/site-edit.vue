<template>
  <UiDialog v-model:open="open" :title="`${actionText}站点`" width-class="max-w-2xl">
    <form class="space-y-5" @submit.prevent="handleConfirm">
      <label class="block space-y-2">
        <span class="text-sm font-medium">站点名</span>
        <UiInput v-model="siteData.name" :disabled="readonly" :class="errors.name ? 'border-destructive' : ''" />
        <span v-if="errors.name" class="text-xs text-destructive">{{ errors.name }}</span>
      </label>

      <label class="block space-y-2">
        <span class="text-sm font-medium">关联配置</span>
        <UiMultiSelect
          v-model="siteData.configs"
          :disabled="readonly"
          :loading="configLoading"
          :options="configOptions"
          placeholder="搜索配置名称或 Slug"
        />
        <span v-if="errors.configs" class="text-xs text-destructive">{{ errors.configs }}</span>
      </label>

      <label class="block space-y-2">
        <span class="text-sm font-medium">域名</span>
        <UiTagsInput v-model="siteData.domains" :disabled="readonly" placeholder="如 example.com，按 Enter 添加" />
        <span v-if="errors.domains" class="text-xs text-destructive">{{ errors.domains }}</span>
      </label>

      <div v-if="!readonly" class="flex justify-end gap-2 pt-2">
        <UiButton variant="outline" type="button" @click="open = false">取消</UiButton>
        <UiButton type="submit" :loading="loading">{{ actionText }}</UiButton>
      </div>
    </form>
  </UiDialog>
</template>

<script setup lang="ts">
import { computed, ref, reactive, watch, onUnmounted } from 'vue'
import { toast } from 'vue-sonner'
import type { SiteItem } from '@/types'
import { UiButton } from '@/components/ui/button'
import { UiDialog } from '@/components/ui/dialog'
import { UiInput } from '@/components/ui/input'
import { UiMultiSelect } from '@/components/ui/multi-select'
import { UiTagsInput } from '@/components/ui/tags-input'
import { useConfigList } from '@/hooks/useConfigList'
import { createSite, updateSite } from '@/api/site'

defineOptions({
  name: 'SiteEdit'
})

const props = withDefaults(defineProps<{
  site?: SiteItem
  readonly?: boolean
  visible: boolean
  isCreate?: boolean
}>(), {
  readonly: false,
  visible: false,
  isCreate: false
})

const emits = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'confirm'): void
}>()

const { configList, configLoading, refreshConfigList } = useConfigList()

const configOptions = computed(() =>
  configList.value.map((c) => ({
    label: c.name,
    value: c.slug
  }))
)

const open = computed({
  get: () => props.visible,
  set: (value: boolean) => emits('update:visible', value)
})

const actionText = computed(() => {
  if (props.readonly) return '查看'
  return props.isCreate ? '创建' : '编辑'
})

const siteData = reactive({
  domains: [] as string[],
  configs: [] as string[],
  name: ''
})

const errors = reactive({
  name: '',
  domains: '',
  configs: ''
})

const loading = ref(false)

const initSiteData = () => {
  if (props.isCreate) {
    siteData.name = ''
    siteData.configs = []
    siteData.domains = []
  } else {
    siteData.name = props.site?.name || ''
    siteData.domains = [...(props.site?.domains || [])]
    siteData.configs = [...(props.site?.configs || [])]
  }
  clearErrors()
}

const clearErrors = () => {
  errors.name = ''
  errors.domains = ''
  errors.configs = ''
}

const validateForm = () => {
  errors.name = siteData.name.trim() ? '' : '请填写站点名'
  errors.domains = siteData.domains.length ? '' : '请至少添加一个域名'
  errors.configs = siteData.configs.length ? '' : '请至少关联一个配置'
  return !errors.name && !errors.domains && !errors.configs
}

const unwatch = watch(
  () => props.visible,
  (val) => {
    if (val) {
      initSiteData()
      refreshConfigList()
    }
  }
)

const handleConfirm = () => {
  if (!validateForm()) {
    return
  }

  loading.value = true
  const result = props.isCreate
    ? createSite({ ...siteData })
    : updateSite((props.site as SiteItem).id, { ...siteData })

  result
    .then((res) => {
      if (res.data.code === 0) {
        toast.success('操作成功')
        emits('confirm')
        emits('update:visible', false)
      } else {
        throw new Error(res.data.msg)
      }
    })
    .catch((e) => {
      toast.error(e.message)
    })
    .finally(() => {
      loading.value = false
    })
}

onUnmounted(unwatch)
</script>
