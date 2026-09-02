# Quality Guidelines

> Code standards and verification for the backend.

---

## Overview

Formatting and linting are enforced by ESLint (with Prettier) per package.
Commands run from the package directory:

```bash
cd packages/backend && pnpm lint     # eslint --fix
cd packages/backend && pnpm format   # prettier --write
cd packages/backend && pnpm test     # vitest run
```

---

## Required Patterns

- **Dependency injection**: services use property injection with `@Inject(...)`
  for cross-package tokens (`HLOGGER_TOKEN`, `RedisService`, `EventEmitter2`)
  and `@InjectRepository(...)` for TypeORM repositories. Constructor injection
  is used in controllers.
- **Barrel exports**: `@/dto`, `@/entities`, `@/module` all have `index.ts`
  files that re-export; import from the barrel, not deep paths.
- **DTO validation**: request bodies are typed DTO classes with `class-validator`
  decorators (`@IsString()`, `@IsNotEmpty()` — see `src/dto/config/`).
- **Ownership checks**: queries against user-owned data always filter by
  `owner: { ssoId }`.
- **Entity → DTO**: return `entity.getData()` from services, never raw entities.
- **Path alias**: always import with `@/...`, never relative paths across
  folders.

---

## Forbidden Patterns

- `any` in new signatures — the ESLint config turns off the `no-explicit-any`
  warning, but prefer typed payloads (`UserJwtPayload`, DTO types) in new code.
- Non-null assertions / unchecked casts where a typed alternative exists.
- `console.log` / Nest default `Logger` in services (see Logging Guidelines).
- Hand-built `{ code, msg, data }` responses in controllers.
- Returning raw entities to controllers.
- Business error messages as bare English where the codebase uses Chinese
  business messages ("无效slug", "无效站点id").

---

## Testing Requirements

- Tests use **Vitest** (`vitest` in devDependencies; `pnpm test` runs
  `vitest run`). There is no Jest config — keep writing Vitest specs.
- Test files live in `packages/backend/test/` (`*.test.ts`):
  - `test/oidc-security.test.ts` — unit tests for the pure OIDC helpers
    (`parseOidcSubject`, `safeReturnTo`, `OidcTransactionCodec`).
  - `test/config-controller.test.ts` — controller-level test.
- New security-sensitive pure logic (crypto, redirect validation, cookie
  handling) should ship with a Vitest spec like `oidc-security.test.ts`.
- `nest-cli.json` sets `"spec": false` — `nest generate` will not create spec
  stubs; add test files manually under `test/`.

---

## Code Review Checklist

- DTO validation covers all request bodies (no unvalidated `body` usage).
- Auth: new endpoints are annotated with `@AuthRoles('user'|'admin')`; public
  endpoints are deliberate and scoped to minimal data.
- CSRF/origin-sensitive mutations go through the global guard (default).
- Queries scope by owner and load only needed relations.
- No raw entities returned; `getData()` used.
- Writes that affect the public cache emit `updateConfigs` / `deleteConfigs`
  events (see `cache.service.ts`).
- Log lines include actor id + target identifiers; no secrets.
- Error codes come from `@reus-able/const`, not new literals.
