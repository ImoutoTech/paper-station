<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { UiButton } from '@/components/ui/button'

defineOptions({
  name: 'UiDialog'
})

const open = defineModel<boolean>('open', { default: false })

withDefaults(defineProps<{
  title?: string
  description?: string
  widthClass?: string
}>(), {
  title: '',
  description: '',
  widthClass: 'max-w-lg'
})

const close = () => {
  open.value = false
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4" @click.self="close">
      <section :class="['max-h-[90vh] w-full overflow-auto rounded-xl border border-border bg-background p-6 shadow-xl', widthClass]">
        <header class="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-foreground">{{ title }}</h2>
            <p v-if="description" class="mt-1 text-sm text-muted-foreground">{{ description }}</p>
          </div>
          <UiButton variant="ghost" size="icon" aria-label="关闭" @click="close">
            <X class="size-4" />
          </UiButton>
        </header>
        <slot />
        <footer v-if="$slots.footer" class="mt-6 flex justify-end gap-2">
          <slot name="footer" />
        </footer>
      </section>
    </div>
  </Teleport>
</template>
