# Logging Guidelines

> Logging conventions for the finder — identical style to the backend.

---

## Overview

- **Logger**: `HLogger` injected via `HLOGGER_TOKEN` from `@reus-able/nestjs`
  (global `LoggerModule` registered in `app.module.ts`). Never use `console.*`.
- The service wraps the logger in private helpers with `AppService.name` as
  context (see `app.service.ts`):
  ```ts
  @Inject(HLOGGER_TOKEN)
  private logger: HLogger;

  private log(text: string) {
    this.logger.log(text, AppService.name);
  }
  private warn(text: string) {
    this.logger.warn(text, AppService.name);
  }
  ```

---

## Log Levels

- `log(...)` — successful config delivery: `站点${origin}请求配置${slug}成功`.
- `warn(...)` — every failure path before returning the error object:
  unknown slug, origin not in domain list.

---

## Structured Logging

- Same plain-Chinese, identifier-inlined style as the backend:
  `站点${origin}请求不存在的配置${slug}`. No key/value formatter.
- Always pass the service name as context.

---

## What to Log

- Each request outcome with origin + slug.
- Failures with the reason distinguishable in text (不存在 vs 无权限).

---

## What NOT to Log

- The config `data` payload itself (arbitrary third-party JSON).
- Any credentials or cookies (the finder handles none, keep it that way).

---

## Common Mistakes

- Using Nest's built-in `Logger` instead of `HLogger` via `HLOGGER_TOKEN`.
- Returning a failure without a `warn` line first.
- Logging the full Redis value including `data`.
