# Directory Structure

> How frontend code is organized in `packages/frontend`.

---

## Overview

The frontend is organized by **concern folder at the top level** (`api/`,
`stores/`, `hooks/`, `types/`, `views/`, `components/`) and **by feature inside
`views/`**. Routes, stores, and views for one domain live close together.

---

## Directory Layout

```
packages/frontend/src/
├── api/                    # Axios request modules, one file per resource
│   ├── base.ts             # shared Axios instance + CSRF forwarding
│   ├── config.ts           # /config endpoints
│   ├── site.ts             # /site endpoints
│   └── user.ts             # /user endpoints
├── assets/                 # base.scss, common.scss (global SCSS + mixins)
├── components/             # cross-cutting components
│   ├── layout/             # header-nav, fullscreen-loading
│   └── user/               # user-login, user-meta
├── hooks/                  # useXxx composables for list data + pagination
│   ├── useConfigList.ts
│   └── useSiteList.ts
├── router/
│   ├── index.ts            # router instance + navigation side effects
│   └── routes.ts           # route table with meta (title/menuKey/needAuth)
├── stores/                 # Pinia stores
│   ├── pinia.ts            # createPinia() instance
│   ├── store.ts            # useGlobalStore (aggregate)
│   ├── useMenu.ts
│   ├── useUser.ts
│   └── useStorage.ts
├── types/                  # shared TS types, barrel via index.ts
│   ├── index.ts
│   ├── config.ts / site.ts / user.ts / editor.ts
├── utils/
│   ├── env.ts              # ENV from import.meta.env
│   ├── index.ts            # array2options helper
│   └── constants.ts
└── views/                  # pages, one folder per route domain
    ├── view-index.vue      # home
    ├── config/
    │   ├── view-index.vue          # list page
    │   ├── components/             # page-local components
    │   └── config-edit/            # feature folder (create/edit)
    │       ├── view-index.vue
    │       ├── store.ts            # page-local Pinia store
    │       ├── config-editor.vue
    │       └── ...
    ├── site/
    └── login-callback.vue
```

---

## Module Organization

- **One folder per feature**: `views/<domain>/view-index.vue` is the routed
  page; reusable pieces for that page go in `views/<domain>/components/`.
- **Complex features get their own folder + local store**: `views/config/config-edit/`
  contains its own `store.ts` (`useConfigStore`) used only by that feature.
- **API modules mirror backend resources** (`api/config.ts` ↔ `/config`).
- **Types are centralized** under `src/types/`, exported via barrel
  (`src/types/index.ts`), never defined ad hoc in components.
- Global components (used across routes) live in `src/components/` grouped by
  purpose (`layout/`, `user/`).

---

## Naming Conventions

- Files: `kebab-case.vue` for components, `camelCase.ts` for scripts
  (`useConfigList.ts`, `config-edit`, `view-index.vue`).
- Components: `PascalCase` file-declared via `defineOptions({ name: 'Xxx' })`
  (see `config-list.vue`).
- Composables: `useXxx` (`useConfigList`, `useSiteList`, `useGlobalStore`).
- Stores: `useXxxStore` (`useUserStore`, `useStorageStore`, `useConfigStore`).
- Types: `PascalCase` (`ConfigItem`, `Restful<T>`, `SiteCreateParam`).
- Views are named `view-index.vue` / `view-sidebar.vue` inside a feature
  folder.

---

## Examples

- `src/views/config/` — full page stack: routed page → local components → hooks.
- `src/views/config/config-edit/` — feature folder with its own local Pinia store.
- `src/api/config.ts` + `src/hooks/useConfigList.ts` — the standard
  fetch-hook-consumes-api-module flow.
