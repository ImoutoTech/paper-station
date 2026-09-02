# Database Guidelines

> The finder has no SQL database — its "database" is Redis.

---

## Overview

The finder is stateless with respect to MySQL: it never connects to TypeORM or
the `users`/`configs`/`sites` tables. All reads go through `RedisService`
(injected from `@reus-able/nestjs`, registered by `RedisModule` in
`app.module.ts`).

---

## Redis Access Patterns

- Use `RedisService.jsonGet<T>(key)` for reading cached configs — the backend's
  `CacheService` writes these values with `jsonSet`.
- Key shape: `config-${slug}` — must stay identical to the backend writer
  (`packages/backend/src/module/cache/cache.service.ts`). Changing the key
  format in one package without the other breaks the read path.
- Value shape (typed locally as `IConfigData` in `app.service.ts`):
  ```ts
  interface IConfigData {
    data: object;
    domains: string[];
  }
  ```
- Treat a cache miss with `isNil(data)` (lodash) — never truthiness checks.

---

## Naming Conventions

- Redis key prefix `config-` + slug, lowercase, matches the backend exactly.
- Domain lists are plain string arrays inside the JSON value.

---

## Common Mistakes

- Renaming the Redis key format in only one of backend / finder.
- Calling TypeORM / repository APIs in the finder — it has no DataSource.
- Assuming `jsonGet` returns `null` vs `undefined` consistently — use `isNil`.
