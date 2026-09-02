# Backend Development Guidelines (@paper-station/finder)

> NestJS + Fastify read-only service conventions for the Paper Station finder
> package (`packages/finder`, port 4001).

---

## Overview

The finder is a deliberately minimal NestJS 10 service on the Fastify adapter.
It serves one public endpoint that reads published configs from **Redis by slug**
and validates the requesting origin against the site's allowed domains. It has:

- No database (no TypeORM, no entities).
- No authentication / guards (public endpoint).
- No controllers beyond the single `AppController`.
- No caching layer beyond reading Redis directly.

Shared infrastructure still comes from `@reus-able/nestjs` (`LoggerModule`,
`RedisModule`, `AllExceptionsFilter`, `HttpExceptionFilter`) exactly as the
backend package does.

Key entry points:

- `packages/finder/src/main.ts` — bootstrap: Fastify, URI versioning, CORS, filters.
- `packages/finder/src/app.module.ts` — root module: env config, LoggerModule, RedisModule.
- `packages/finder/src/app.service.ts` — the Redis read + origin validation logic.

---

## Guidelines Index

| Guide | Description |
|-------|-------------|
| [Directory Structure](./directory-structure.md) | Minimal app layout, naming |
| [Database Guidelines](./database-guidelines.md) | Redis key/value patterns (no SQL) |
| [Error Handling](./error-handling.md) | `{ data: null, code, msg }` responses |
| [Quality Guidelines](./quality-guidelines.md) | Lint/prettier, forbidden patterns |
| [Logging Guidelines](./logging-guidelines.md) | `HLogger` usage, levels |

---

## Layer Notes

- All code lives under `packages/finder/src/`; alias `@/*` → `src/*`.
- Response envelope on failure is hand-built here (see Error Handling), unlike
  the authenticated backend — because finder's consumer is a raw site script.
- Keep this package minimal: do not add auth, ORM, or business modules unless a
  new requirement explicitly needs them.
