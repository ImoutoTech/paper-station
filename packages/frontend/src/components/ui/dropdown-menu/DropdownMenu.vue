<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { MoreHorizontal } from 'lucide-vue-next'
import { UiButton } from '@/components/ui/button'

export interface DropdownMenuItem {
  label: string
  destructive?: boolean
  disabled?: boolean
  onClick: () => void
}

const props = withDefaults(defineProps<{
  items: DropdownMenuItem[]
  label?: string
  iconOnly?: boolean
}>(), {
  label: '操作',
  iconOnly: false
})

const isOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

const toggleOpen = () => {
  isOpen.value = !isOpen.value
}

const handleItemClick = (item: DropdownMenuItem) => {
  if (item.disabled) {
    return
  }

  item.onClick()
  isOpen.value = false
}

const closeWhenClickOutside = (event: PointerEvent) => {
  const target = event.target
  if (!(target instanceof Node) || menuRef.value?.contains(target)) {
    return
  }

  isOpen.value = false
}

onMounted(() => {
  document.addEventListener('pointerdown', closeWhenClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', closeWhenClickOutside)
})
</script>

<template>
  <div ref="menuRef" class="relative inline-block text-left">
    <slot name="trigger" :open="isOpen" :toggle="toggleOpen">
      <UiButton
        variant="ghost"
        :size="props.iconOnly ? 'icon' : 'sm'"
        :class="props.iconOnly ? '' : 'gap-2'"
        :aria-label="props.label"
        aria-haspopup="menu"
        :aria-expanded="isOpen"
        @click="toggleOpen"
      >
        <MoreHorizontal class="size-4" />
        <span v-if="!props.iconOnly">{{ props.label }}</span>
      </UiButton>
    </slot>
    <div
      v-if="isOpen"
      class="absolute right-0 z-20 mt-2 min-w-32 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg"
      role="menu"
    >
      <button
        v-for="item in props.items"
        :key="item.label"
        :disabled="item.disabled"
        :class="[
          'block w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-accent disabled:pointer-events-none disabled:opacity-50',
          item.destructive ? 'text-destructive' : 'text-foreground'
        ]"
        type="button"
        role="menuitem"
        @click="handleItemClick(item)"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>
