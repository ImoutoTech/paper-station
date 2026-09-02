# Quality Guidelines

> Code standards and verification for the frontend.

---

## Overview

Commands run from the package directory:

```bash
cd packages/frontend && pnpm lint        # eslint --fix (.vue,.ts,...)
cd packages/frontend && pnpm format      # prettier --write src/
cd packages/frontend && pnpm build       # run-p type-check build-only
cd packages/frontend && pnpm type-check  # vue-tsc --noEmit
```

`build` runs `vue-tsc` type-check before `vite build` — a type error fails the
build, so keep types green.

---

## Required Patterns

- `<script setup lang="ts">` Composition API in every component.
- Unprefixed Tailwind classes; scoped SCSS for component-local styles.
- Vue APIs, local UI primitives, and icons imported explicitly; types imported
  via `import type { ... } from '@/types'`.
- API calls go through `src/api/*` modules, never raw `axios` in components.
- List pages use `src/hooks/*` composables for data + pagination.
- Types centralized in `src/types/` (barrel export).
- Success/failure/warning feedback via `vue-sonner` `toast.*` with an app-level
  toaster mounted in `App.vue`.

---

## Forbidden Patterns

- `<script>` Options API components.
- Direct `axios` usage outside `src/api/`.
- Storing tokens/credentials in `localStorage` / Pinia — auth is HttpOnly
  Cookie + in-memory CSRF (`src/api/base.ts`).
- `any` in new code, `@ts-ignore` comments.
- Duplicating types locally instead of using `src/types/`.
- Obsolete UI-library imports, components, resolver config, or compatibility
  wrapper APIs.
- Obsolete prefixed Tailwind classes (`tw-*`) in active frontend source.

---

## Testing Requirements

- There are **no frontend tests today** (no test script in
  `packages/frontend/package.json`, no vitest/jest config). If you add tests,
  introduce Vitest + Vue Test Utils and add a `test` script; do not claim
  coverage that does not exist.

---

## Code Review Checklist

- `pnpm type-check` passes; no new `any`/`@ts-ignore`.
- `pnpm build` and `pnpm lint` pass.
- Grep confirms no old UI-library imports/components/resolvers remain in active
  frontend source/config.
- Grep confirms no `tw-*` Tailwind classes remain in active frontend source.
- New API module functions are typed with `Restful<T>` / `RestfulPage<T>` and
  use the shared Axios instance from `./base` (CSRF + credentials).
- Component props/emits fully typed; `withDefaults` for optional props.
- Styles: unprefixed Tailwind utilities, SCSS scoped where needed, no inline
  `style=` for layout.
- No secrets in client code; CSRF token handled only in `api/base.ts`.
- State placement follows the categories in State Management (global vs
  feature-local vs component).
- Routes use `meta.title`/`meta.menuKey`/`meta.needAuth` consistently
  (see `src/router/routes.ts`).
