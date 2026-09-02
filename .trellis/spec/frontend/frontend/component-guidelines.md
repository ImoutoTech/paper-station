# Component Guidelines

> How Vue SFC components are built in this project.

---

## Overview

Components use `<script setup lang="ts">` (Composition API) with explicit
imports for Vue APIs, local UI primitives, icons, and types. The frontend UI
foundation is project-local Origin UI Vue / shadcn-style primitives in
`src/components/ui`; feature components should import these primitives directly.

---

## Component Structure

- One SFC per component, in this order: `<template>` → `<script setup lang="ts">`
  → `<style lang="scss" scoped>` when all three are present.
- Components that need a stable devtools/recursion name declare it via
  `defineOptions({ name: 'Xxx' })`.
- Complex pages compose feature-local components from `./components/`
  (`config-list.vue`, `config-detail-dialog.vue` under `views/config/components/`).
- Route/page components should orchestrate feature pieces; keep reusable UI in
  `src/components/ui` and feature-specific UI in the feature folder.

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
- Feature dialogs may keep `v-model:visible` / `update:visible` contracts.
  Local primitives may use `v-model:open` internally, but do not mimic old
  third-party component APIs.

---

## Emits Conventions

- Emits are type-declared with `defineEmits<{...}>`:
  ```ts
  const emits = defineEmits<{
    (e: 'update:visible', value: boolean): void;
    (e: 'confirm'): void;
  }>();
  ```
- Parent handlers receive primitive values (`@del="handleDelete"` with slug/id).

---

## Styling Patterns

- **Scoped SCSS** in SFCs when component-local styles are needed.
- Use **unprefixed Tailwind utilities** for layout/spacing: `w-full`, `flex`,
  `justify-between`, `text-center`.
- Global shadcn-style theme tokens are defined in `src/assets/base.scss` and
  exposed through Tailwind token classes such as `bg-background`,
  `text-foreground`, `border-border`, `bg-card`, and `text-muted-foreground`.
- **Global SCSS is injected automatically** (`vite.config.ts` injects
  `@/assets/common.scss` into every SFC), so shared mixins like
  `@include content-width` are usable without import.
- `@apply` composes Tailwind utilities inside scoped styles
  (`.config-home { @apply mt-5; }`).
- Root class = kebab-case feature name (`.config-home`, `.config-list`,
  `.config-editor`).

---

## Responsive Behavior

- Mobile detection may come from the global store when behavior, not just style,
  depends on viewport: `const { isMobile } = useGlobalStore()`.
- Prefer CSS responsive utilities for layout changes (`sm:`, `md:`, `lg:`) when
  no behavior change is needed.

---

## Accessibility

- Prefer local primitives that preserve semantic HTML (`button`, `form`,
  `dialog`/overlay structure) and visible focus states.
- Interactive elements must be keyboard-reachable native controls or accessible
  primitive components.

---

## Common Mistakes

- Reintroducing old component-library imports or compatibility props/events.
- Relying on auto-imported UI components instead of explicit imports.
- Mixing obsolete `tw-` prefixed Tailwind classes; the frontend now uses
  unprefixed utilities.
- Defining shared domain/API types inside a component instead of `src/types/`.
- Using `<script>` (Options API) — all existing components use
  `<script setup lang="ts">`.
