<template>
  <div class="config-create-sidebar space-y-5">
    <div>
      <h2 class="text-2xl font-semibold">{{ actionText }}配置</h2>
      <p class="mt-1 text-sm text-muted-foreground">填写元数据并确保编辑器内容格式正确。</p>
    </div>

    <form class="space-y-4" @submit.prevent="handleConfirm">
      <label class="block space-y-2">
        <span class="text-sm font-medium">配置名</span>
        <UiInput v-model="cfgStore.meta.name" placeholder="展示名称" :class="errors.name ? 'border-destructive' : ''" />
        <span v-if="errors.name" class="text-xs text-destructive">{{ errors.name }}</span>
      </label>

      <label class="block space-y-2">
        <span class="text-sm font-medium">Slug</span>
        <UiInput v-model="cfgStore.meta.slug" placeholder="唯一访问标识" :disabled="!isCreate" :class="errors.slug ? 'border-destructive' : ''" />
        <span v-if="errors.slug" class="text-xs text-destructive">{{ errors.slug }}</span>
      </label>

      <div class="rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
        可通过以下链接获取配置
        <code class="mt-2 block break-all rounded bg-background px-2 py-1 text-xs text-foreground">
          {{ `${ENV.API}/config/get?slug=${cfgStore.meta.slug || '{slug}'}` }}
        </code>
      </div>

      <UiTooltip content="请检查内容是否符合格式规范" :disabled="cfgStore.validate">
        <UiButton class="w-full" type="submit" :disabled="!cfgStore.validate" :loading="cfgStore.loading">
          {{ actionText }}
        </UiButton>
      </UiTooltip>
      <p v-if="!cfgStore.validate" class="text-xs text-destructive">编辑器内容存在格式错误，请修正后再提交。</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { UiButton } from '@/components/ui/button'
import { UiInput } from '@/components/ui/input'
import { UiTooltip } from '@/components/ui/tooltip'
import { ENV } from '@/utils/env'
import { useConfigStore } from './store'

const cfgStore = useConfigStore()

const emit = defineEmits<{
  (e: 'confirm'): void
}>()

const props = withDefaults(defineProps<{
  isCreate: boolean
}>(), {
  isCreate: true
})

const errors = reactive({
  name: '',
  slug: ''
})

const actionText = computed(() => (props.isCreate ? '创建' : '更新'))

const validateForm = () => {
  errors.name = cfgStore.meta.name.trim() ? '' : '请填写配置名'
  errors.slug = cfgStore.meta.slug.trim() ? '' : '请填写 Slug'
  return !errors.name && !errors.slug
}

const handleConfirm = () => {
  if (validateForm()) {
    emit('confirm')
  }
}
</script>
