# Frontend Development Guidelines (@paper-station/frontend)

> Vue 3 + Vite SPA conventions for the Paper Station frontend package
> (`packages/frontend`).

---

## Overview

The frontend is a Vue 3 Composition API SPA built with Vite. It uses:

- **UI**: TDesign Vue Next (`tdesign-vue-next`) with auto-imported components
  and Vue APIs (`unplugin-auto-import` + `unplugin-vue-components`).
- **State**: Pinia stores composed via a single aggregate store (`store.ts`).
- **Styling**: Tailwind CSS with the `tw-` prefix + scoped SCSS, plus shared
  SCSS mixins injected globally.
- **Editor**: Monaco Editor (`@guolao/vue-monaco-editor`) for JSON editing.
- **API**: Axios client with credentialed Cookie requests and in-memory CSRF
  token forwarding (`src/api/base.ts`).

Key entry points:

- `packages/frontend/vite.config.ts` — auto-imports, `@` alias, SCSS injection.
- `packages/frontend/src/main.ts` — app bootstrap, Monaco workers, plugins.
- `packages/frontend/src/router/index.ts` — router + auth/menu side effects.
- `packages/frontend/src/api/base.ts` — the shared Axios instance (CSRF logic).

---

## Guidelines Index

| Guide | Description |
|-------|-------------|
| [Directory Structure](./directory-structure.md) | File layout: api/stores/hooks/views |
| [Component Guidelines](./component-guidelines.md) | SFC structure, props/emits, styling |
| [Hook Guidelines](./hook-guidelines.md) | `useXxx` composables, data fetching |
| [State Management](./state-management.md) | Pinia stores, aggregate store, local stores |
| [Type Safety](./type-safety.md) | Shared types, `Restful<T>`, DTO typing |
| [Quality Guidelines](./quality-guidelines.md) | Lint/type-check, forbidden patterns |

---

## Layer Notes

- Vue APIs and TDesign components are **auto-imported** — no explicit import
  needed for `ref`/`computed`/`t-button` (see `vite.config.ts`). TypeScript
  still imports types explicitly (`import type { ConfigItem } from '@/types'`).
- The frontend never stores tokens in browser storage: auth is HttpOnly Cookie
  + in-memory CSRF token only.
- API responses are typed against the backend's `Restful<T>` envelope.
