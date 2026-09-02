# Directory Structure

> How finder code is organized in `packages/finder`.

---

## Overview

The finder is a single-purpose service: its whole source tree is four files.
Do not grow module folders unless a second feature actually lands.

---

## Directory Layout

```
packages/finder/src/
├── main.ts              # bootstrap: Fastify, versioning, CORS, global filters
├── app.module.ts        # root module: ConfigModule + LoggerModule + RedisModule
├── app.controller.ts    # single public GET / endpoint
├── app.service.ts       # Redis read + origin validation logic
└── utils/
    └── const.ts         # ENV_LIST (shared shape with backend)
```

---

## Module Organization

- No feature modules, no `@Module` decomposition — one root `AppModule`
  (`app.module.ts`) with `AppController` + `AppService` as providers.
- New shared helpers (if any) go under `src/utils/`, mirroring the backend's
  `utils/` convention.

---

## Naming Conventions

- Same conventions as `@paper-station/backend`: `kebab-case` files,
  `PascalCase` classes (`AppController`, `AppService`), `SCREAMING_SNAKE_CASE`
  constants (`ENV_LIST`).
- Imports use the `@/` alias (`@/utils/const`).

---

## Examples

- `src/app.service.ts` — the single place business logic may live; keep the
  pattern of a tiny injectable service with `HLogger` + `RedisService`.
