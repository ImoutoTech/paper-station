<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next'
import { UiButton } from '@/components/ui/button'

const open = defineModel<boolean>('open', { default: false })

withDefaults(defineProps<{
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
}>(), {
  description: '',
  confirmText: '确认',
  cancelText: '取消',
  loading: false
})

const emit = defineEmits<{
  confirm: []
}>()

const close = () => {
  open.value = false
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4" @click.self="close">
      <section class="w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-xl">
        <div class="flex gap-4">
          <div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle class="size-5" />
          </div>
          <div>
            <h2 class="text-lg font-semibold text-foreground">{{ title }}</h2>
            <p v-if="description" class="mt-2 text-sm leading-6 text-muted-foreground">{{ description }}</p>
          </div>
        </div>
        <footer class="mt-6 flex justify-end gap-2">
          <UiButton variant="outline" @click="close">{{ cancelText }}</UiButton>
          <UiButton variant="destructive" :loading="loading" @click="emit('confirm')">{{ confirmText }}</UiButton>
        </footer>
      </section>
    </div>
  </Teleport>
</template>
