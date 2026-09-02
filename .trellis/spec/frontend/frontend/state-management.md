# State Management

> How state is managed with Pinia in this project.

---

## Overview

State uses **Pinia with setup-style stores** (`defineStore('name', () => {...})`)
defined as `useXxxStore`. The Pinia instance is created once in
`src/stores/pinia.ts` and passed to the app in `main.ts`.

---

## State Categories

- **Global UI state** — `src/stores/store.ts` (`useGlobalStore`) aggregates the
  other stores plus shared UI flags:
  ```ts
  export const useGlobalStore = defineStore('global', () => {
    const menuStore = useMenuStore()
    const userStore = useUserStore()
    const storageStore = useStorageStore()
    const isLoading = ref(false)
    const isMobile = useMediaQuery('(max-width: 768px)')
    return { menuStore, userStore, storageStore, isLoading, isMobile, setLoading }
  })
  ```
  Components and the router import from `useGlobalStore` (via
  `stores/store.ts`), not the individual stores directly.
- **Auth state** — `src/stores/useUser.ts` (`useUserStore`): `isLogin`,
  `loginLoading`, `userInfo`; actions `login` / `logout` / `setLoading`.
- **UI/nav state** — `src/stores/useMenu.ts`: current menu value.
- **Persistent client storage** — `src/stores/useStorage.ts`: wraps LocalForage
  in a `shallowRef` instance (no reactive subscription).
- **Feature-local state** — `src/views/config/config-edit/store.ts`
  (`useConfigStore`): editor content, meta, validate/loading flags; scoped to
  that feature folder and cleared on unmount (`configStore.clear()` in
  `view-index.vue`'s `onUnmounted`).

---

## When to Use Global State

- State shared across routes/components (auth, menu, storage, mobile flag) →
  `src/stores/`, aggregated into `useGlobalStore`.
- State used only by one feature (editor content) → local store in the feature
  folder (`views/<feature>/store.ts`). Do not put it in `src/stores/` until a
  second consumer exists.
- Component-internal UI state → plain `ref`/`reactive` inside the component
  (`siteData` in `site-edit.vue`).

---

## Server State

- There is **no server-state cache**: list data lives in `ref`s inside hooks
  (`useConfigList`) and is refetched on demand. Auth status is the exception —
  it is a real global flag (`isLogin`) set once by the login flow.
- Do not introduce a server-state library (TanStack Query etc.) without
  discussion; the existing hooks + stores cover current needs.

---

## Common Mistakes

- Importing `useMenuStore` / `useUserStore` directly in components instead of
  `useGlobalStore` from `stores/store.ts`.
- Creating a new Pinia instance in a component — always reuse `stores/pinia.ts`.
- Adding feature-only state to a global store.
- Storing tokens/credentials in Pinia or browser storage — auth is HttpOnly
  Cookie based; only UI metadata (`isLogin`, `userInfo`) lives in the store.
