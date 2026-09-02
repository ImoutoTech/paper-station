<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, X } from 'lucide-vue-next'
import { UiInput } from '@/components/ui/input'
import { UiBadge } from '@/components/ui/badge'

export interface MultiSelectOption {
  label: string
  value: string
}

const model = defineModel<string[]>({ default: () => [] })

const props = withDefaults(defineProps<{
  options: MultiSelectOption[]
  disabled?: boolean
  loading?: boolean
  placeholder?: string
}>(), {
  disabled: false,
  loading: false,
  placeholder: '搜索配置'
})

const keyword = ref('')

const selectedOptions = computed(() => props.options.filter((option) => model.value.includes(option.value)))
const filteredOptions = computed(() => {
  const normalized = keyword.value.trim().toLowerCase()
  if (!normalized) return props.options
  return props.options.filter((option) =>
    `${option.label} ${option.value}`.toLowerCase().includes(normalized)
  )
})

const toggle = (value: string) => {
  if (props.disabled) return
  model.value = model.value.includes(value)
    ? model.value.filter((item) => item !== value)
    : [...model.value, value]
}
</script>

<template>
  <div class="space-y-3 rounded-md border border-input bg-background p-3">
    <div class="flex flex-wrap gap-2">
      <UiBadge v-for="option in selectedOptions" :key="option.value" variant="secondary" class="gap-1 py-1">
        {{ option.label }}
        <button v-if="!disabled" type="button" class="hover:text-destructive" @click="toggle(option.value)">
          <X class="size-3" />
        </button>
      </UiBadge>
      <span v-if="!selectedOptions.length" class="text-sm text-muted-foreground">暂无关联配置</span>
    </div>
    <UiInput v-if="!disabled" v-model="keyword" :placeholder="placeholder" />
    <div class="max-h-52 overflow-auto rounded-md border border-border">
      <button
        v-for="option in filteredOptions"
        :key="option.value"
        type="button"
        :disabled="disabled || loading"
        class="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-accent disabled:opacity-60"
        @click="toggle(option.value)"
      >
        <span>
          <span class="font-medium text-foreground">{{ option.label }}</span>
          <span class="ml-2 text-xs text-muted-foreground">{{ option.value }}</span>
        </span>
        <Check v-if="model.includes(option.value)" class="size-4 text-primary" />
      </button>
      <div v-if="loading" class="p-3 text-sm text-muted-foreground">配置加载中...</div>
      <div v-else-if="!filteredOptions.length" class="p-3 text-sm text-muted-foreground">没有匹配的配置</div>
    </div>
  </div>
</template>
