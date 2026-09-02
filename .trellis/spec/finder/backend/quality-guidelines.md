# Quality Guidelines

> Code standards and verification for the finder.

---

## Overview

The finder shares the backend package's tooling and style: ESLint with
Prettier, no semicolons, single quotes, 2-space indent, 100 char print width
(`packages/finder/.eslintrc.js`, `.prettierrc`).

```bash
cd packages/finder && pnpm lint     # eslint --fix
cd packages/finder && pnpm format   # prettier --write
```

There is no test script in `packages/finder/package.json` — the package is
currently untested; if you add non-trivial logic, add a Vitest spec under
`packages/finder/test/` and a `"test": "vitest run"` script, matching the
backend's test setup.

---

## Required Patterns

- Property injection with `@Inject(HLOGGER_TOKEN)` / `@Inject(RedisService)`.
- `isNil` from lodash for cache-miss checks.
- Business codes from `@reus-able/const`.
- `@/` alias imports only.

---

## Forbidden Patterns

- Adding TypeORM / database code — the finder is Redis-only by design.
- Adding auth guards or DTO validation pipes — the endpoint is public by design.
- Throwing business exceptions instead of returning `{ data: null, code, msg }`.
- `console.log` in services.
- Introducing feature modules without a concrete second feature.

---

## Testing Requirements

- None today; see the Overview note if you add logic worth testing. Mirror the
  backend's Vitest layout (`packages/backend/test/*.test.ts`).

---

## Code Review Checklist

- Redis key format matches the backend writer (`config-${slug}`).
- Origin validation checks `domains.includes(origin)` — exact match, no prefix
  or wildcard logic.
- Failure paths return the error object and warn-log first.
- No credentials, no SQL, no auth added.
- CORS stays open (`app.enableCors()` in `main.ts`) — it is a public service.
