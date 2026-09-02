# Backend Development Guidelines (@paper-station/backend)

> NestJS + Fastify API conventions for the Paper Station backend package
> (`packages/backend`, port 4000).

---

## Overview

The backend is a NestJS 10 application running on the Fastify adapter. It provides
CRUD for configs / sites / users, HttpOnly-Cookie JWT auth via H OIDC, MySQL with
TypeORM, and Redis caching. Every service shares a common set of conventions from
the `@reus-able/nestjs` helper library — do not reimplement global infrastructure
(logging, Redis, exception filters, response transforms) locally.

Key entry points to read before changing backend code:

- `packages/backend/src/main.ts` — bootstrap: Fastify adapter, cookie plugin, URI
  versioning (`VERSION_NEUTRAL` + `1`), CORS for the frontend origin, global
  interceptor/filters.
- `packages/backend/src/app.module.ts` — root module wiring: env config,
  TypeORM (`synchronize: false`), global validation pipe + `CookieAuthGuard`.
- `packages/backend/src/common/auth.guard.ts` — the global auth + CSRF guard.
- `packages/backend/OIDC.md` — read before changing authentication or deployment vars.

---

## Guidelines Index

| Guide | Description |
|-------|-------------|
| [Directory Structure](./directory-structure.md) | Module layout, barrel exports, naming |
| [Database Guidelines](./database-guidelines.md) | TypeORM entities, pagination, relations |
| [Error Handling](./error-handling.md) | `BusinessException`, global filters, response shape |
| [Quality Guidelines](./quality-guidelines.md) | Lint/prettier, forbidden patterns, tests |
| [Logging Guidelines](./logging-guidelines.md) | `HLogger` usage, levels, what to log |

---

## Layer Notes

- All backend work in this package lives under `packages/backend/src/`.
- Path alias `@/*` maps to `src/*` (see `packages/backend/tsconfig.json`).
- API responses are wrapped by the global `TransformInterceptor` from
  `@reus-able/nestjs`; controllers return raw data, never hand-built envelopes.
- Business error codes/text come from `@reus-able/const` (see
  `packages/backend/src/module/config/config.service.ts`).
