# Origin UI Vue research

## Sources

- Website: <https://www.originui-vue.com>
- GitHub README: <https://github.com/misbahansori/originui-vue>
- Registry inspected from a shallow clone of `misbahansori/originui-vue` on 2026-09-02.

## Findings

- Origin UI Vue is a Vue/Tailwind copy-and-paste component collection, not a single installed component-library plugin like TDesign.
- The README instructs consumers to copy `.vue` files from the source `components/ui`/registry UI folder and utility files from `lib`, then add CSS variables to the consumer stylesheet.
- Components follow shadcn-style conventions and many primitives wrap Reka UI. Example registry UI files import from `reka-ui` and use `useForwardPropsEmits`.
- Common utility dependencies for selected primitives include:
  - `reka-ui`
  - `class-variance-authority`
  - `clsx`
  - `tailwind-merge`
  - `lucide-vue-next`
  - existing `@vueuse/core` for some primitives such as pagination helpers
- Component classes are written with unprefixed Tailwind utilities and design-token color classes such as `bg-background`, `text-foreground`, `border-input`, and `focus-visible:ring-ring/50`.
- The Paper Station frontend currently configures Tailwind with `prefix: 'tw-'`. Copying Origin UI Vue components without modification therefore implies removing the prefix and refactoring existing `tw-` utilities, or else every copied Origin class would need project-specific rewriting.
- Origin UI Vue has primitives for button, card, dialog, alert-dialog, dropdown-menu, avatar, badge, input, textarea, select, pagination, tooltip, popover, checkbox, label, toast/sonner, and related UI building blocks.
- There is no exact TDesign-style imperative `MessagePlugin`/`DialogPlugin` equivalent. Feedback and confirmation should move to declarative app-level toast/alert-dialog components or small project-owned composables with project-native contracts, not TDesign-compatible plugin APIs.
- No exact TDesign `Transfer`/`TagInput` compatibility component is required by the user decision. Site config association and domain editing can be redesigned as capability-preserving Origin/Tailwind-native interactions.

## Follow-up live documentation attempt

- Retried `agent_browser` after user reconfiguration on 2026-09-02. First retry found the tool on PATH but Pi rejected installed `agent-browser 0.36.0` because this extension requires exact capability baseline `0.34.0`.
- After the user repaired the installation, Pi's `agent_browser` tool successfully opened `https://example.com`, waited for `domcontentloaded`, captured an accessible snapshot containing the `Example Domain` heading and `Learn more` link, then closed the session. Browser automation is therefore available again for migration smoke QA.
- Used the Origin UI Vue site HTML, README, and registry source inspection as fallback evidence for planning refinement before the browser runtime was repaired.

## Follow-up registry findings

- Origin UI Vue includes direct registry primitives that map better to Paper Station than initially captured: `tags-input`, `multi-select`, `combobox`, `native-select`, `input-group`, `button-group`, and `table` in addition to the already noted button/card/dialog/dropdown/input/select/pagination/toast primitives.
- `tags-input` is a direct fit for site domain editing, so the plan no longer needs a fully custom input-plus-chip control for domains.
- `multi-select` or `combobox` can preserve site config association capability without recreating TDesign `Transfer`; the preferred implementation is a searchable multi-select/combobox style selector.
- `table` pulls in `@tanstack/vue-table`; because the current config/site lists do not require table behavior, prefer card/list layouts and avoid adding `@tanstack/vue-table` unless implementation discovers a clear need.
- `native-select` is available and can be used for simple editor/grid-density options to reduce Reka select complexity where a native control is sufficient.
