# Hook Guidelines

> How composables (`useXxx`) are used in this project.

---

## Overview

Custom composables live in `src/hooks/` and encapsulate **list data fetching
with pagination, search, and loading state** for a page. They are the bridge
between `src/api/*` modules (raw requests) and view components (UI state).

The two existing hooks are the canonical templates:

- `src/hooks/useConfigList.ts`
- `src/hooks/useSiteList.ts`

---

## Custom Hook Patterns

- File/function name: `useXxx` (`useConfigList`).
- The hook owns reactive state created with `ref` / `reactive`:
  - `xxxList` (`ref<T[]>`) — the loaded rows
  - `xxxLoading` (`ref<boolean>`) — in-flight flag
  - `xxxSearchText` (`ref<string>`) — current search keyword
  - `xxxPagination` (`reactive<{ total, current, size }>`) — pagination state
- It returns **all state plus the action functions** (`refreshXxxList`,
  `onPageChange`, `handleSearch`, `handleDelete`...).
- Components destructure what they need:
  `const { configList: configData, refreshConfigList, ... } = useConfigList();`

---

## Data Fetching

- Fetch functions call the matching API module and **unwrap the `Restful`
  envelope defensively**:
  ```ts
  configList.value = res?.data?.data?.items || []
  configPagination.total = res?.data?.data?.total ?? 0
  ```
- Offset math for the backend's pagination:
  `(configPagination.current - 1) * configPagination.size`.
- `refreshXxxList` sets `loading = true`, awaits the request, fills state, then
  clears `loading` — no try/finally, mirror the existing code.
- Mutations (`delConfig`) live in the hook too, and on success they call
  `refreshXxxList()` again; TDesign `MessagePlugin.success/error` reports
  outcomes to the user.
- There is **no caching layer** (no React Query / SWR equivalent) — every call
  hits the API.

---

## Naming Conventions

- `useXxx` for the composable (`useConfigList`, `useSiteList`).
- State: `xxxList`, `xxxLoading`, `xxxSearchText`, `xxxPagination`.
- Actions: `refreshXxxList`, `onPageChange`, `handleSearch`, `handleDelete`.

---

## Common Mistakes

- Returning a plain object literal of computed getters instead of the reactive
  refs/objects the hooks return.
- Doing the fetch inline in a component instead of a shared hook when two pages
  need the same list.
- Forgetting to reset `current = 1` on search.
- Importing an API module directly in a view when a hook already wraps it.
