# Error Handling

> How the finder reports failures — deliberately different from the backend.

---

## Overview

The finder has no auth guard, no validation pipe, and no business modules. Its
only endpoint (`GET /`) is consumed by third-party site scripts, so failures are
**returned as a plain object, not thrown** — a thrown exception would surface as
an HTTP error the site script cannot interpret.

Global filters (`AllExceptionsFilter` + `HttpExceptionFilter` from
`@reus-able/nestjs`) are still installed in `main.ts` as a safety net for
unexpected exceptions.

---

## Error Handling Patterns

- **Cache miss / unknown slug**: return
  `{ data: null, code: BUSINESS_ERROR_CODE.COMMON, msg: 'no such config' }`.
- **Origin not allowed**: return
  `{ data: null, code: BUSINESS_ERROR_CODE.ACCESS_FORBIDDEN, msg: BUSINESS_ERROR_TEXT[ACCESS_FORBIDDEN] }`.
- Both branches `this.warn(...)` before returning (see `app.service.ts#getConfig`).
- Codes/text come from `@reus-able/const`, same source as the backend.

---

## API Error Responses

- Success returns the config `data` object directly (no envelope).
- Failure returns `{ data: null, code, msg }` where `code`/`msg` are the
  business error constants. `data: null` is the frontend/consumer's signal to
  treat the response as an error even on HTTP 200.

---

## Common Mistakes

- Throwing `BusinessException` in `AppService` — the consumer expects the
  `{ data: null, code, msg }` shape on HTTP 200, not an HTTP error status.
- Inventing new error codes instead of reusing `BUSINESS_ERROR_CODE` from
  `@reus-able/const`.
- Skipping the `warn` log before returning a failure.
