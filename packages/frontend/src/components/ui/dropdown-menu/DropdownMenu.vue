<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next'
import { UiButton } from '@/components/ui/button'

export interface DropdownMenuItem {
  label: string
  destructive?: boolean
  disabled?: boolean
  onClick: () => void
}

withDefaults(defineProps<{
  items: DropdownMenuItem[]
  label?: string
}>(), {
  label: '操作'
})
</script>

<template>
  <details class="dropdown-menu relative inline-block text-left">
    <summary class="list-none">
      <slot name="trigger">
        <UiButton variant="ghost" size="sm" class="gap-2">
          <MoreHorizontal class="size-4" />{{ label }}
        </UiButton>
      </slot>
    </summary>
    <div class="absolute right-0 z-20 mt-2 min-w-32 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg">
      <button
        v-for="item in items"
        :key="item.label"
        :disabled="item.disabled"
        :class="[
          'block w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-accent disabled:pointer-events-none disabled:opacity-50',
          item.destructive ? 'text-destructive' : 'text-foreground'
        ]"
        type="button"
        @click="item.onClick"
      >
        {{ item.label }}
      </button>
    </div>
  </details>
</template>

<style scoped>
.dropdown-menu > summary::-webkit-details-marker {
  display: none;
}
</style>
