# Directory Structure

> How backend code is organized in `packages/backend`.

---

## Overview

The backend follows standard NestJS modular layout plus a small set of
convention folders (`dto/`, `entities/`, `common/`, `utils/`). Business logic
lives in services; controllers only bind routes to service methods.

---

## Directory Layout

```
packages/backend/src/
├── main.ts                  # bootstrap: Fastify, cookies, CORS, versioning, filters
├── app.module.ts            # root module: global pipe, global guard, TypeORM wiring
├── app.controller.ts        # health check ("Hello World!")
├── app.service.ts
├── common/
│   └── auth.guard.ts        # global CookieAuthGuard (JWT + origin + CSRF)
├── dto/                     # class-validator DTOs
│   ├── index.ts             # barrel re-export
│   ├── config/
│   │   ├── create-config.dto.ts
│   │   └── update-config.dto.ts
│   ├── site/
│   └── user/
├── entities/                # TypeORM entities + ENTITY_LIST
│   ├── index.ts
│   ├── Config.ts
│   ├── Site.ts
│   └── User.ts
├── module/                  # feature modules (controller + service + module)
│   ├── index.ts             # barrel re-export of all modules
│   ├── cache/               # event-driven Redis cache sync
│   ├── config/
│   ├── site/
│   └── user/
└── utils/
    └── const.ts             # ENV_LIST
```

---

## Module Organization

- One feature per folder under `src/module/<feature>/` containing
  `<feature>.module.ts`, `<feature>.controller.ts`, `<feature>.service.ts`.
- Register the module in `src/module/index.ts` (barrel) and import it in
  `app.module.ts`. Example: `src/module/config/config.module.ts`.
- `CacheModule` has no controller — it only reacts to events via `@OnEvent`.
- Entities needed by a module are imported via `TypeOrmModule.forFeature([...])`
  in that module's `imports` (see `src/module/site/site.module.ts`).

---

## Naming Conventions

- Files: `kebab-case` (`create-config.dto.ts`, `auth.guard.ts`).
- Classes: `PascalCase` with suffix (`CreateConfigDto`, `ConfigEntity`,
  `ConfigService`, `ConfigController`, `ConfigModule`).
- Constants: `SCREAMING_SNAKE_CASE` (`AUTH_COOKIE`, `CSRF_COOKIE` in
  `src/module/user/user.constants.ts`).
- All internal imports use the `@/` alias (`@/dto`, `@/entities`, `@/module`).

---

## Examples

- `src/module/config/` — the most complete feature: controller + service +
  module, DTOs, pagination, events, Redis read path.
- `src/module/site/` — same shape with a many-to-many relation to configs.
- `src/common/auth.guard.ts` — global guard placement pattern.
