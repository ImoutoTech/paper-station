# Design: Origin UI Vue migration

## Architecture and Boundaries

### UI foundation

- Replace TDesign with local Origin UI Vue-derived primitives under `packages/frontend/src/components/ui/`.
- Keep feature UI in the existing feature folders (`views/config`, `views/site`, shared `components/layout`, `components/user`).
- Use explicit imports for local UI primitives and icons instead of a TDesign-style auto-import resolver.
- Keep Monaco Editor, router, Pinia stores, API modules, and DTO types outside the migration boundary except where UI callback signatures currently depend on TDesign types/plugins.

### Tailwind and theme tokens

- Origin UI Vue components are written with unprefixed Tailwind classes. To avoid rewriting copied components and avoid a project-specific compatibility layer, remove `prefix: 'tw-'` from `packages/frontend/tailwind.config.js`.
- Refactor existing `tw-*` utilities in touched frontend source to normal Tailwind utilities.
- Add Origin/shadcn-style CSS variables to `src/assets/base.scss` and expose matching Tailwind theme colors (`background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, etc.).
- Prefer the refreshed Origin visual language over preserving old TDesign spacing, card, menu, and form appearance.

### Dependencies

Remove:

- `tdesign-vue-next`
- `tdesign-icons-vue-next`

Add only dependencies needed by copied/used primitives, expected initial set:

- `reka-ui`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`
- `lucide-vue-next`
- `vue-sonner` for app-level toast feedback

Retain existing dependencies such as Vue, Pinia, Vue Router, Monaco Editor, Axios, copy-to-clipboard, lodash-es, and `@vueuse/core`.
Avoid adding `@tanstack/vue-table` during the first migration unless a copied component actually requires it; current list/card workflows do not need table primitives.

### Browser automation prerequisite

- Pi's installed `pi-agent-browser-native` extension documents an exact `agent-browser 0.34.0` runtime requirement and its own supported install command: `npm install -g --ignore-scripts agent-browser@0.34.0`.
- The incompatible Homebrew formula has been removed and the pinned npm CLI was installed into the existing NVM Node 22 global location (`/Users/reuszeng/.nvm/versions/node/v22.23.2/bin/agent-browser`), which is on the active `PATH`. npm emitted an engine warning because the CLI declares Node >=24, but the Pi-managed browser smoke check succeeded and is the compatibility gate.
- This is an environment-only prerequisite for visual QA. Do not upgrade, patch, or otherwise modify the Pi extension; its current version pin is the compatibility contract.
- Rollback is `brew install agent-browser` to restore the previous formula; reinstalling the npm-pinned CLI restores the repaired state.

## Component Map

### Local UI primitives (`src/components/ui`)

Initial primitives to copy/adapt from Origin UI Vue registry:

- `button` and `button-group` — primary/secondary/ghost/destructive/link/icon actions and compact grouped controls.
- `card` — page panels, home cards, site cards.
- `input`, `input-group`, and `textarea` — search, config/site metadata, compact copy/search controls, and text entry.
- `native-select` first, `select` only when richer behavior is needed — editor settings and site grid density.
- `dialog` and `alert-dialog` — details, edit/create modal, delete confirmation.
- `dropdown-menu`, `popover`, and `combobox` — action menus, user account menu, searchable pickers.
- `avatar` and `badge` — user profile and metadata chips.
- `pagination` — config/site paging.
- `tooltip` — disabled submit explanation.
- `tags-input` — site domain entry/removal using Origin-native tags instead of custom TDesign-like tag input.
- `multi-select` or `combobox` — site config association, replacing TDesign Transfer with a searchable capability-preserving selector.
- `sonner` — success, warning, and error feedback.

Avoid copying `table` initially because it introduces `@tanstack/vue-table` and the current product workflows are card/list oriented rather than table oriented.

These primitives are allowed to be project-local copies with small import-path/style adjustments, but not wrappers that preserve TDesign APIs.

### Shared app components

- `App.vue`: replace TDesign layout with semantic shell (`min-h-screen`, header/main/footer) and app-level toaster/loading overlay.
- `components/layout/header-nav.vue`: replace `t-head-menu`, `t-menu-item`, and `t-popup` with a responsive header/nav using buttons, dropdown/popover, and `MENU_LIST`.
- `components/layout/fullscreen-loading.vue`: replace TDesign icon with Lucide or CSS spinner.
- `components/user/user-login.vue`: replace TDesign button/space with local button/layout.
- `components/user/user-meta.vue`: replace avatar/tag/button layout with local avatar/badge/button.

### Config feature

- `views/config/view-index.vue`: card-based search toolbar, create button, list card, pagination.
- `views/config/components/config-list.vue`: Origin/Tailwind list rows with inline desktop actions and dropdown mobile actions; maintain detail/delete events.
- `views/config/components/config-detail-dialog.vue`: local dialog with readonly field layout and copy link feedback.
- `views/config/components/config-delete-dialog.vue`: local alert-dialog confirmation.
- `views/config/config-edit/view-index.vue`: CSS grid/flex layout replacing TDesign row/col.
- `views/config/config-edit/view-sidebar.vue`: local form-field markup with project-owned validation messages.
- `views/config/config-edit/config-editor.vue`: card shell plus local select/button around Monaco.
- `views/config/config-edit/editor-config-dialog.vue`: local dialog and selects for editor options.

### Site feature

- `views/site/view-index.vue`: card-based search toolbar, create button, responsive grid control where useful, pagination.
- `views/site/components/site-list.vue`: responsive CSS grid/flex skeleton/empty state without TDesign row/col/skeleton.
- `views/site/components/site-item.vue`: local card/dropdown and declarative alert-dialog for delete.
- `views/site/components/site-edit.vue`: local dialog and form fields.
  - Replace TDesign Transfer with Origin `multi-select` or `combobox` for searchable config association.
  - Replace TDesign TagInput with Origin `tags-input` for domain add/remove behavior.

### Login callback/home

- `views/login-callback.vue`: local card/button/icons/toast feedback.
- `views/view-index.vue`: refreshed landing/home workflow cards using local card/button primitives.

## Data Flow and Contracts

- Existing API modules remain the only network boundary.
- Existing hooks keep owning list state and pagination state, but their `onPageChange` signatures should become project-owned, e.g. `{ current: number; pageSize: number }`, not `PageInfo` from TDesign.
- Success/error/warning feedback should use `toast.*` from `vue-sonner` directly, or a tiny project-owned helper named around product feedback needs; do not create `MessagePlugin` lookalikes.
- Dialog visibility continues to use Vue-native `v-model:visible`/`update:visible` contracts where already present, but local dialog primitives may use `v-model:open` internally at feature boundaries as long as feature contracts stay clear and typed.
- Form validation may move from TDesign rules to small component-level validation functions/messages. Validation remains user-visible and blocks invalid submits.

## Migration and Compatibility Notes

- Generated auto-import declarations (`auto-imports.d.ts`, `components.d.ts`) may need regeneration or cleanup after removing TDesign resolver.
- Removing Tailwind `tw-` prefix is an intentional source-wide style migration to align with Origin UI Vue and avoid copied-component rewriting.
- If Tailwind v3 cannot support a specific Origin Tailwind v4-only class, prefer a localized equivalent class/style over upgrading Tailwind as part of the first migration, unless build output proves the v3 gap is broad.
- Existing mobile detection through `useGlobalStore().isMobile` can remain where it drives layout behavior, but CSS responsive utilities should replace JS branching where simpler.

## Risks and Rollback

- Risk: Copying many UI primitives can introduce dependency/type mismatches. Mitigation: add/copy primitives incrementally and run `pnpm --filter @paper-station/frontend run type-check` during implementation.
- Risk: Removing the Tailwind prefix touches many files. Mitigation: scripted search/replace followed by lint/build and focused review of arbitrary class names.
- Risk: Replacing plugin-style messages/dialogs can miss feedback paths in hooks/router. Mitigation: grep for all TDesign imports/plugins and verify each replacement path.
- Rollback: This is a broad visual migration; rollback is the git revert of the task branch/commit rather than a runtime flag.
