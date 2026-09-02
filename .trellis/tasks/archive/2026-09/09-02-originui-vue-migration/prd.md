# Migrate frontend component library to Origin UI Vue

## Goal

Replace the frontend's current TDesign-based UI with Origin UI Vue-based local components and a refreshed visual experience, without preserving the existing visual look and without introducing TDesign compatibility/adaptation wrappers.

## Background and Confirmed Facts

- User intent: perform a complete component-library replacement to <https://www.originui-vue.com>; visual experience may be redesigned as part of the migration; avoid glue code that adapts old TDesign APIs to a new library.
- User decision: when a TDesign widget has no direct Origin UI Vue equivalent, preserve the underlying user capability but redesign the interaction with Origin/Tailwind-native UI instead of recreating the exact TDesign interaction model.
- Frontend package: `packages/frontend`, a Vue 3 + Vite SPA using Composition API, Tailwind CSS with the `tw-` prefix, scoped SCSS, Pinia, Vue Router, and Monaco Editor.
- Current documented frontend guideline says UI is TDesign Vue Next with auto-imported components via `unplugin-auto-import` and `unplugin-vue-components`: `.trellis/spec/frontend/frontend/index.md`.
- Current frontend dependencies include `tdesign-vue-next` and `tdesign-icons-vue-next`: `packages/frontend/package.json`.
- Current Vite config uses `TDesignResolver` for component/API auto-imports: `packages/frontend/vite.config.ts`.
- Current app globally imports TDesign CSS: `packages/frontend/src/main.ts`.
- Current TDesign usage appears across the app shell, auth feedback, list pages, edit forms, dialogs, pagination, dropdowns, tags, transfer/tag-input fields, loading states, route guards, and list hooks.
- Current interactive routes are home, config list, config create/edit, site list/create/edit, and login callback: `packages/frontend/src/router/routes.ts`.
- Origin UI Vue describes itself as a copy-and-paste component collection for Vue/Tailwind, compatible with Vue projects, following shadcn conventions; its README says to copy `.vue` files from `components/ui` and utilities from `lib`, add CSS variables, and note that some components require additional libraries.
- Origin UI Vue registry components import utilities such as `@/lib/utils`, use Reka UI for many accessible primitives, and commonly rely on `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-vue-next`, and the existing `@vueuse/core` depending on selected components.
- Follow-up registry inspection found additional Origin UI Vue primitives that reduce custom work while staying non-adaptive: `tags-input` for domain editing, `multi-select`/`combobox` for config association, `native-select` for simple selects, and `input-group`/`button-group` for compact control groups.

## Requirements

- R1. Remove TDesign as the frontend UI foundation.
  - No remaining imports from `tdesign-vue-next` or `tdesign-icons-vue-next`.
  - No remaining `<t-*>` component usage.
  - Remove TDesign resolver and global stylesheet setup.
  - Remove TDesign packages from frontend dependencies once unused.
- R2. Build the replacement around Origin UI Vue's copy-and-paste/shadcn-style model rather than an API compatibility layer.
  - Local UI primitives should expose clean, project-owned Vue contracts.
  - Do not create wrappers that mimic TDesign prop/event/plugin APIs just to reduce template churn.
- R3. Refresh the visual experience while preserving product workflows and capabilities.
  - Home, login callback, navigation/user menu, config list/detail/delete/create/edit, site list/create/edit/delete, search, pagination, validation feedback, loading/empty states, copy feedback, and API error feedback remain usable.
  - Layout and aesthetics may change to fit Origin UI Vue and Tailwind conventions.
  - TDesign-specific widgets without direct Origin UI Vue equivalents may be redesigned as long as users can still complete the same underlying task.
- R4. Keep non-UI behavior stable.
  - Routing, auth/cookie behavior, API DTOs, Pinia store semantics, Monaco editor behavior, and data persistence remain compatible unless explicitly called out in design.
- R5. Keep implementation maintainable.
  - Prefer replacing feature components directly with Origin UI Vue-derived primitives and feature-specific UI, not accumulating transitional adapters.
  - Keep Vue SFCs in Composition API with `<script setup lang="ts">` where touched.
- R6. Update project documentation/specs if the frontend UI foundation changes.
- R7. Restore browser-automation availability for migration smoke QA.
  - The Pi `agent_browser` extension must run with its pinned upstream CLI version, `agent-browser 0.34.0`.
  - Replace the linked Homebrew `agent-browser 0.36.0` executable with the exact npm-installed version recommended by the extension documentation; do not change or upgrade the Pi extension as part of this task.
  - The repaired executable must remain first on `PATH` and pass a non-destructive browser automation smoke check.

## Acceptance Criteria

- [ ] `packages/frontend` builds and type-checks successfully.
- [ ] Frontend lint passes after migration.
- [ ] Repository search finds no `tdesign-vue-next`, `tdesign-icons-vue-next`, `TDesignResolver`, `MessagePlugin`, `DialogPlugin`, `PageInfo`, or `<t-` usage in active frontend source/config, except historical task notes if any.
- [ ] `packages/frontend/package.json` no longer lists TDesign packages and lists only the Origin UI Vue/shadcn-style dependencies actually used by copied components.
- [ ] App shell/navigation and user account popover/menu remain usable.
- [ ] Config workflows remain usable: list/search/page, view detail/copy access URL, delete with confirmation, create/edit metadata, edit JSON/YAML in Monaco, validate before submit, submit success/error feedback.
- [ ] Site workflows remain usable: list/search/page, responsive card/grid display, create/edit with name/domains/config associations, delete with confirmation, submit success/error feedback.
- [ ] Loading, empty, disabled, validation, success, warning, and error states have visible UI after replacement.
- [ ] Visual smoke QA is performed for the main routes after migration (`/`, `/config`, `/config/create` or edit path where feasible, `/site`, `/login`) using browser automation if available, or documented manual screenshots/check notes if browser automation remains blocked.
- [ ] `agent-browser --version` reports exactly `0.34.0` from the executable selected by the active shell `PATH`; no linked Homebrew `0.36.0` executable shadows it.
- [ ] Pi's `agent_browser` tool completes a non-destructive HTTP(S) smoke check (open a public page, inspect it, then close the session) without a version-mismatch failure.
- [ ] TDesign-specific complex widgets are replaced by Origin/Tailwind-native interactions that preserve capability without imitating TDesign APIs.
- [ ] No TDesign-compatibility adapter layer is introduced.
- [ ] Frontend Trellis spec is updated to describe the new UI foundation.

## Out of Scope

- Backend API changes.
- Recreating the current TDesign visual style.
- Keeping TDesign components or icons for isolated leftovers.
- Adding a broad design-system abstraction layer whose primary purpose is future UI-library swapping.
- Rewriting Monaco editor internals beyond fitting it into the refreshed UI shell.
