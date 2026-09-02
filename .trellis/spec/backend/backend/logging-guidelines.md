# Logging Guidelines

> Logging conventions for the backend.

---

## Overview

- **Logger**: `HLogger` injected via the `HLOGGER_TOKEN` from `@reus-able/nestjs`
  (the global `LoggerModule` is registered in `app.module.ts`). Do not use
  Nest's default `Logger` or `console.*` in services.
- Injection pattern (see every service, e.g. `config.service.ts`):
  ```ts
  @Inject(HLOGGER_TOKEN)
  private logger: HLogger;
  ```
- Each service wraps the logger in private helpers that pass the service name
  as context and keep call sites terse:
  ```ts
  private log(text: string) {
    this.logger.log(text, ConfigService.name);
  }
  private warn(text: string) {
    this.logger.warn(text, ConfigService.name);
  }
  ```

---

## Log Levels

- `log(...)` — successful operations and normal request outcomes.
- `warn(...)` — expected failures: record not found, permission denied, missing
  cache entry. **Always warn before throwing or returning a failure**.
- `error(...)` — unexpected exceptions; the global `AllExceptionsFilter` and
  OIDC failure paths (`user.service.ts#logOidcFailure`) are the places that use
  it. Services generally do not need to call `error` for handled business cases.

---

## Structured Logging

- Messages are plain Chinese sentences that embed business identifiers directly
  in the text — there is no key/value structured formatter in use:
  `用户#${ssoId}创建配置slug=${body.slug}` (see `config.service.ts#create`).
- Follow the existing phrasing style: `动作主体 + 动作 + 关键参数`, e.g.
  `站点${origin}请求配置${slug}成功`.
- The context argument (service name) is always supplied so logs are greppable
  by class.

---

## What to Log

- Every create / update / delete with the acting `ssoId` and the target slug/id.
- Paginated list reads with page/size/search and the result count
  (`config.service.ts#findAll`).
- Public read failures with the requesting origin (`getConfig`).
- OIDC login failures through the dedicated `logOidcFailure` helper.

---

## What NOT to Log

- Passwords, tokens, cookies, or JWT payloads — never log cookie values or
  credentials.
- Full request bodies that may contain arbitrary JSON config content.
- Stack traces for expected business failures (warn + message is enough).

---

## Common Mistakes

- Injecting Nest's built-in `Logger` — use `HLogger` via `HLOGGER_TOKEN` so logs
  stay consistent with the global logger.
- Calling `console.log` inside services.
- Logging the raw entity object (contains relations / internal fields).
- Swallowing errors without `warn`/`error` before throwing.
