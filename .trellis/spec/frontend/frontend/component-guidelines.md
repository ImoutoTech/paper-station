# Component Guidelines

> How Vue SFC components are built in this project.

---

## Overview

Components use `<script setup lang="ts">` (Composition API) with explicit
`import type` for types. Vue APIs (`ref`, `computed`, `onMounted`) and TDesign
components (`t-button`, `t-card`) are auto-imported and need no import
statements. TDesign components use the `t-` prefix (`t-button`, `t-input`,
`t-dialog`, `t-table`...).

---

## Component Structure

- One SFC per component, in this order: `<template>` → `<script setup lang="ts">`
  → `<style lang="scss" scoped>`.
- Components that need a stable devtools/recursion name declare it via
  `defineOptions({ name: 'Xxx' })` — see `config-list.vue`, `site-edit.vue`.
- Complex pages compose feature-local components from `./components/`
  (`config-list.vue`, `config-detail-dialog.vue` under `views/config/components/`).

---

## Props Conventions

- Props are declared with **type-only props + `withDefaults`**:
  ```ts
  withDefaults(defineProps<{
    data: ConfigItem[];
    loading: boolean;
  }>(), {
    data: () => [],
    loading: false,
  });
  ```
- Optional props get defaults via `withDefaults`; required props have no
  default (`visible: boolean` without default where the parent always passes it).
- `v-model` is implemented as a `visible`-style prop paired with an
  `update:visible` emit (`site-edit.vue`, `config-detail-dialog.vue`).

---

## Emits Conventions

- Emits are type-declared with `defineEmits<{...}>`:
  ```ts
  const emits = defineEmits<{
    (e: 'update:visible', value: boolean): void;
    (e: 'confirm'): void;
  }>();
  ```
- Parent handlers receive primitive values (`@del="handleDelete"` with slug).

---

## Styling Patterns

- **Scoped SCSS** in every SFC (`<style lang="scss" scoped>`).
- **Tailwind utilities with `tw-` prefix** for layout/spacing: `tw-w-full`,
  `tw-flex tw-justify-between`, `tw-text-center`.
- **Global SCSS is injected automatically** (`vite.config.ts` injects
  `@/assets/common.scss` into every SFC), so shared mixins like
  `@include content-width` are usable without import.
- `@apply` composes Tailwind utilities inside scoped styles
  (`.config-home { @apply tw-mt-5; }`).
- Root class = kebab-case feature name (`.config-home`, `.config-list`,
  `.config-editor`).

---

## Responsive Behavior

- Mobile detection comes from the global store: `const { isMobile } = useGlobalStore()`
  (backed by `useMediaQuery('(max-width: 768px)')`).
- Dialogs and menus adapt width/layout on `isMobile` (`site-edit.vue`,
  `config-list.vue` dropdown vs inline buttons).

---

## Accessibility

- The codebase does not apply explicit ARIA attributes; accessibility relies on
  TDesign components' built-in semantics. Keep using TDesign primitives rather
  than hand-rolling interactive elements.

---

## Common Mistakes

- Explicitly importing Vue APIs or TDesign components that are auto-imported —
  harmless but inconsistent with the rest of the codebase.
- Mixing raw Tailwind classes without the `tw-` prefix — the prefix is required
  by `tailwind.config.js`; unprefixed classes are not generated.
- Defining local types inside a component instead of `src/types/`.
- Using `<script>` (Options API) — all existing components use
  `<script setup lang="ts">`.
