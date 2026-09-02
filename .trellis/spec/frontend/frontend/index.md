# Frontend Development Guidelines (@paper-station/frontend)

> Vue 3 + Vite SPA conventions for the Paper Station frontend package
> (`packages/frontend`).

---

## Overview

The frontend is a Vue 3 Composition API SPA built with Vite. It uses:

- **UI**: project-local Origin UI Vue / shadcn-style primitives under
  `src/components/ui`, imported explicitly by each component. Feedback uses
  `vue-sonner` toasts from the app-level toaster.
- **State**: Pinia stores composed via a single aggregate store (`store.ts`).
- **Styling**: unprefixed Tailwind CSS utilities + scoped SCSS, plus shared
  SCSS mixins injected globally. Theme tokens live as shadcn-style CSS
  variables in `src/assets/base.scss` and Tailwind mappings in
  `tailwind.config.js`.
- **Editor**: Monaco Editor (`@guolao/vue-monaco-editor`) for JSON editing.
- **API**: Axios client with credentialed Cookie requests and in-memory CSRF
  token forwarding (`src/api/base.ts`).

Key entry points:

- `packages/frontend/vite.config.ts` — Vue plugin, `@` alias, SCSS injection.
- `packages/frontend/src/main.ts` — app bootstrap, Monaco workers, plugins.
- `packages/frontend/src/App.vue` — semantic app shell and app-level toaster.
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

- Vue APIs and local UI primitives are imported explicitly. Do not rely on UI
  component auto-imports or resolver-specific globals.
- Local UI primitives should expose project-owned contracts, not compatibility
  props/events from a previous component library.
- Use `toast.success/error/warning` from `vue-sonner` for user feedback. Do not
  introduce plugin lookalikes for old UI-library message APIs.
- The frontend never stores tokens in browser storage: auth is HttpOnly Cookie
  + in-memory CSRF token only.
- API responses are typed against the backend's `Restful<T>` envelope.
