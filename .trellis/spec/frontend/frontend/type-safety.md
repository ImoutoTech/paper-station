# Type Safety

> TypeScript patterns in the frontend.

---

## Overview

The frontend is written in strict-ish TypeScript (`vue-tsc` type-check runs as
part of `pnpm build`). Types are centralized under `src/types/` and re-exported
through the barrel `src/types/index.ts`; components and hooks import them via
`import type { Xxx } from '@/types'`.

---

## Type Organization

- **Shared domain types** per resource: `src/types/config.ts`, `site.ts`,
  `user.ts`, `editor.ts` — interfaces like `ConfigItem`, `SiteItem`, `UserData`.
- **Request/response param types** colocated with the domain types:
  `ConfigCreateParam`, `SiteCreateParam` (see `src/types/config.ts`).
- **API envelope and shared UI contract types** live in `src/types/index.ts`:
  ```ts
  export interface Restful<T> { code: number; msg: string; data: T }
  export interface PageList<T> { total: number; items: T[] }
  export type RestfulPage<T> = Restful<PageList<T>>
  export interface PaginationChange { current: number; pageSize: number }
  ```
- API modules type every call: `API.get<RestfulPage<ConfigItem>>('/config', ...)`
  (see `src/api/config.ts`).

---

## Validation

- There is **no runtime validation on the frontend** (no Zod/Yup). The backend
  validates payloads with `class-validator` DTOs; the frontend trusts responses
  but unwraps the envelope defensively (`res?.data?.data?.items || []`).
- Form validation is component-owned: validate local reactive form state, show
  typed error messages, and block submit until required fields are present.

---

## Common Patterns

- `import type { ... }` for type-only imports — the codebase consistently uses
  `import type` so Vite can tree-shake cleanly.
- Component props/emits are fully typed via `defineProps<{...}>` +
  `defineEmits<{...}>` (see Component Guidelines).
- Generics are used at API boundaries (`Restful<T>`, `RestfulPage<T>`) and in
  small utility helpers (`array2options<T, F>` in `src/utils/index.ts`).
- Form payload conversions happen at the API module boundary, keeping the types
  honest — `site.ts` joins arrays into comma strings before `qs.stringify`.

---

## Forbidden Patterns

- `any` in new code — prefer the shared types; where a payload is truly dynamic
  (`ConfigItem.data` as JSON string) type it explicitly rather than `any`.
- Casting `res.data.data` with `as` when the generic already types it.
- Defining a component-local interface that duplicates a `src/types/` type.
- `@ts-ignore` / `@ts-expect-error` — none exist in the codebase; if you hit a
  type error, fix the type.

---

## Common Mistakes

- Importing types from a deep path (`@/types/config`) instead of the barrel
  (`@/types`) — the barrel is the convention (see `src/types/index.ts`).
- Forgetting the `Restful` wrapper when typing a new API call, producing
  `res.data.data` type mismatches.
- Defining duplicate `PageList<T>`-like shapes per resource instead of reusing
  the generic.
