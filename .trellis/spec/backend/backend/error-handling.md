# Error Handling

> How the backend reports and handles errors.

---

## Overview

Errors flow through three global layers wired in `main.ts` / `app.module.ts`:

1. **Global pipes**: `ValidationPipe` (with `transform: true` and implicit
   conversion) converts DTO validation failures into a `BusinessException`.
2. **Global guards**: `CookieAuthGuard` throws `UnauthorizedException` /
   `ForbiddenException` for auth / CSRF failures.
3. **Global filters**: `AllExceptionsFilter` + `HttpExceptionFilter` from
   `@reus-able/nestjs` turn exceptions into the standard response envelope.

Controllers do not catch business errors — services throw, filters serialize.

---

## Error Types

- **`BusinessException`** (from `@reus-able/nestjs`) — for expected business
  failures ("无效slug", "无效站点id"). Carries a business code.
- **`UnauthorizedException` / `ForbiddenException`** (Nest built-ins) — auth and
  permission failures, thrown by the guard, never by services.
- **Validation errors** — the global `ValidationPipe`'s `exceptionFactory`
  joins the failing DTO properties into a single `BusinessException`
  (`app.module.ts`): `参数校验失败，请检查 ${errorProperties}`.
- **Unexpected errors** — leave uncaught; `AllExceptionsFilter` handles them.

---

## Error Handling Patterns

- In services, the missing-record pattern is:
  `if (isNil(cfg)) throw new BusinessException('无效slug')` — use `isNil` from
  `lodash`, not truthiness checks (see `config.service.ts#findOne`).
- Log the failure with `this.warn(...)` before throwing (see Logging Guidelines).
- Public config reads (`config.service.ts#getConfig`, finder's `AppService`)
  return `{ data: null, code, msg }` instead of throwing, because third-party
  sites consume the payload directly — but this is specific to the public
  `GET /config/get` endpoint, not the pattern for authenticated CRUD.

---

## API Error Responses

- The response envelope shape is produced by the global `TransformInterceptor`:
  `{ code, msg, data }`. On the frontend this is typed as `Restful<T>`
  (`packages/frontend/src/types/index.ts`).
- Business error codes and messages live in `@reus-able/const`
  (`BUSINESS_ERROR_CODE`, `BUSINESS_ERROR_TEXT`) — reference them instead of
  inventing new code numbers.
- Controllers return raw values; `TransformInterceptor` wraps success responses
  and filters wrap failures. Never hand-build `{ code, msg, data }` in a
  controller or service for authenticated endpoints.

---

## Common Mistakes

- Throwing `BusinessException` with a brand-new code instead of reusing
  `@reus-able/const` codes.
- Catching and re-wrapping errors in controllers — the global filters already
  serialize them.
- Returning a raw entity or a hand-built envelope alongside the interceptor,
  which would double-wrap the response.
- Using `== null` / falsy checks instead of `isNil` from lodash.
