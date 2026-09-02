# Implementation Plan: Origin UI Vue migration

## Preconditions

- Do not run `task.py start` until the user approves the final planning summary.
- Before coding, load frontend Trellis context and Vue references via `trellis-before-dev` / Vue best-practices references.
- Work in `packages/frontend` unless updating Trellis specs or root lockfiles.

## Ordered Checklist

### 0. Repair browser-automation prerequisite

- [x] Remove the incompatible Homebrew formula: `brew uninstall agent-browser`. Homebrew also auto-removed its unused Node 26 dependency.
- [x] Install the extension-pinned CLI through existing NVM Node 22: `/Users/reuszeng/.nvm/versions/node/v22.23.2/bin/npm install -g --ignore-scripts agent-browser@0.34.0`. The npm engine warning is expected; use the actual Pi smoke check as the compatibility gate.
- [x] Verify `command -v agent-browser` resolves to `/Users/reuszeng/.nvm/versions/node/v22.23.2/bin/agent-browser` and `agent-browser --version` reports exactly `0.34.0`.
- [x] Use Pi's `agent_browser` tool to open `https://example.com`, inspect its accessible snapshot (`Example Domain` heading and `Learn more` link), and close the managed session; the smoke check completed without a version-mismatch failure.
- [x] The pinned binary launched successfully through Pi, so `agent-browser install` was not required.

### 1. Baseline and dependency setup

- [x] Run validation from repo root or frontend package:
  - `pnpm --filter @paper-station/frontend run type-check`
  - `pnpm --filter @paper-station/frontend run build`
- [x] Add required Origin/shadcn-style dependencies actually needed by selected primitives.
- [x] Remove TDesign dependencies after source references are gone.
- [x] Update lockfile using pnpm.

### 2. Tailwind/theme foundation

- [x] Remove `prefix: 'tw-'` from `packages/frontend/tailwind.config.js`.
- [x] Add Tailwind theme token mappings for Origin CSS variables.
- [x] Add Origin/shadcn CSS variables to `packages/frontend/src/assets/base.scss`.
- [x] Replace existing `tw-` utility class usage with unprefixed utilities in active frontend source.
- [x] Remove TDesign global stylesheet import from `src/main.ts`.

### 3. Copy local UI primitives

- [x] Create `packages/frontend/src/lib/utils.ts` with Origin `cn()` utility.
- [x] Copy minimal required Origin UI Vue primitives into `packages/frontend/src/components/ui/`.
  - Implemented target set includes button, button-group, card, input, input-group, textarea, native-select/select-like controls where needed, dialog, alert-dialog, dropdown-menu, popover/combobox-style selection, avatar, badge, pagination, tooltip, tags-input, multi-select, and sonner/toaster support.
  - Did not copy `table`; avoided `@tanstack/vue-table`.
- [x] Normalize copied import paths from Origin registry aliases to this app's `@/components/ui/*` and `@/lib/utils`.
- [x] Prefer explicit imports from local UI primitives in feature components.
- [x] Add app-level toaster component for `vue-sonner` feedback.

### 4. Replace shared app shell and feedback paths

- [x] Replace `App.vue` TDesign layout with semantic shell and app-level toaster/loading overlay.
- [x] Replace `header-nav.vue` with local button/dropdown/popover navigation and user menu.
- [x] Replace `fullscreen-loading.vue` spinner/icon.
- [x] Replace `user-login.vue` and `user-meta.vue`.
- [x] Replace router/app success/warning/error feedback imports with the new toast mechanism.

### 5. Replace list hooks' TDesign coupling

- [x] Replace `PageInfo` imports with a project-owned pagination-change type.
- [x] Replace `MessagePlugin` usage in `useConfigList.ts` and `useSiteList.ts` with new toast feedback.
- [x] Keep existing list state, search reset, delete refresh, and pagination offset behavior.

### 6. Replace config UI

- [x] Replace `views/config/view-index.vue` toolbar/cards/pagination.
- [x] Replace `config-list.vue` rows/actions/empty/loading state.
- [x] Replace `config-detail-dialog.vue` and copy-link feedback.
- [x] Replace `config-delete-dialog.vue` confirmation.
- [x] Replace `config-edit/view-index.vue` layout.
- [x] Replace `view-sidebar.vue` form fields, validation display, disabled submit tooltip/message.
- [x] Replace `config-editor.vue` card/select/button shell while preserving Monaco editor behavior.
- [x] Replace `editor-config-dialog.vue` dialog/select controls.

### 7. Replace site UI

- [x] Replace `views/site/view-index.vue` toolbar/search/grid-density/pagination.
- [x] Replace `site-list.vue` grid/loading/empty state.
- [x] Replace `site-item.vue` card/actions/delete confirmation.
- [x] Replace `site-edit.vue` dialog and forms.
- [x] Redesign config association with Origin `multi-select` or `combobox` so users can search/select associated configs without recreating TDesign Transfer.
- [x] Redesign domain editing with Origin `tags-input` so users can add/remove domains without custom TDesign-style tag-input compatibility.

### 8. Replace home/login callback UI

- [x] Replace `views/view-index.vue` home cards/actions with refreshed local UI.
- [x] Replace `views/login-callback.vue` card/button/icons/toasts.

### 9. Cleanup and generated files

- [x] Remove `TDesignResolver` from `vite.config.ts`; remove component auto-import resolver if no longer needed.
- [x] Regenerate or clean `auto-imports.d.ts` and `components.d.ts` so TDesign globals disappear.
- [x] Run repository searches to confirm TDesign removal:
  - `rg "tdesign-vue-next|tdesign-icons-vue-next|TDesignResolver|MessagePlugin|DialogPlugin|PageInfo|<t-" packages/frontend`
- [x] Review for leftover `tw-` class usage:
  - `rg "\btw-" packages/frontend/src packages/frontend/tailwind.config.js`

### 10. Documentation/spec update

- [x] Update `.trellis/spec/frontend/frontend/index.md` and related frontend spec files to describe Origin UI Vue/local shadcn-style primitives, explicit imports, unprefixed Tailwind classes, and the new feedback pattern.
- [x] Remove obsolete TDesign-specific guidance from frontend specs.

## Validation Commands

Run after implementation and before reporting completion:

```bash
pnpm --filter @paper-station/frontend run type-check
pnpm --filter @paper-station/frontend run build
pnpm --filter @paper-station/frontend run lint
# If agent_browser version is aligned, run visual smoke checks against the dev server for /, /config, /site, /login.
# If it remains unavailable, capture manual screenshots/check notes for the same routes.
rg "tdesign-vue-next|tdesign-icons-vue-next|TDesignResolver|MessagePlugin|DialogPlugin|PageInfo|<t-" packages/frontend
rg "\btw-" packages/frontend/src packages/frontend/tailwind.config.js
```

Expected grep result for TDesign patterns: no active frontend source/config matches.

Expected grep result for `tw-`: no active frontend source/config matches unless a generated or historical artifact is intentionally excluded.

Visual smoke result should be attached in the final report as either agent_browser QA output or manual route-by-route notes/screenshots.

## Completion Evidence

Verified on 2026-09-02 after implementation:

- `corepack pnpm --filter @paper-station/frontend run type-check` passed.
- `corepack pnpm --filter @paper-station/frontend run build` passed. Build emitted existing Sass legacy/import deprecation warnings and Monaco chunk-size warning only.
- `corepack pnpm --filter @paper-station/frontend run lint` passed.
- `git diff --check` passed.
- `rg "tdesign-vue-next|tdesign-icons-vue-next|TDesignResolver|MessagePlugin|DialogPlugin|PageInfo|<t-" packages/frontend` returned no matches.
- `rg "\btw-" packages/frontend/src packages/frontend/tailwind.config.js` returned no matches.
- `rg "tdesign|@tanstack/vue-table|reka-ui" packages/frontend/package.json packages/frontend/pnpm-lock.yaml pnpm-lock.yaml` returned no matches, confirming TDesign removal and that unused table/Reka dependencies were not introduced.
- `agent_browser` version check returned `agent-browser 0.34.0`.
- Browser visual smoke against `http://127.0.0.1:5175` passed for `/`, `/config`, `/config/create`, `/site`, and `/login`. Home rendered the new shell/navigation and headings. Protected routes redirected unauthenticated users to home and showed `请先登录`, matching the route guard. `/login` rendered without route failure. Artifact: `/Users/reuszeng/.pi/agent/sessions/--Users-reuszeng-Code-Projects-paper-station--/.pi-agent-browser-artifacts/01a0601d-b5f6-7eae-9e0f-a24daade6442/pi-agent-browser-output-02b95d55807f8038.json`.
## Risky Files / Rollback Points

- `packages/frontend/tailwind.config.js` and `src/assets/base.scss`: theme/prefix mistakes can make most UI unstyled.
- `packages/frontend/src/components/ui/**`: copied primitives may need import-path and dependency fixes.
- `packages/frontend/src/hooks/useConfigList.ts` and `src/hooks/useSiteList.ts`: feedback and pagination type changes can break pages.
- `packages/frontend/src/views/site/components/site-edit.vue`: Transfer/TagInput redesign is the largest interaction change.
- `packages/frontend/vite.config.ts`, `auto-imports.d.ts`, `components.d.ts`: auto-import cleanup can break TypeScript if generated declarations are stale.

Rollback is a git revert of the migration commit/branch; no runtime compatibility flag is planned.

## Review Gates

- [ ] No unresolved PRD open questions.
- [ ] `design.md` and `implement.md` are present and aligned with `prd.md`.
- [ ] `implement.jsonl` and `check.jsonl` include real spec/research entries before sub-agent implementation/check dispatch.
- [ ] User explicitly approves the latest planning summary before `task.py start`.
