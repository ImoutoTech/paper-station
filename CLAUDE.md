# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Paper Station is a dynamic configuration management system (JSON configs served by domain origin). It is a pnpm monorepo with three packages under `packages/`:

- **@paper-station/backend** — NestJS + Fastify API (port 4000). CRUD for configs/sites/users, JWT auth via SSO OAuth, MySQL with TypeORM, Redis caching.
- **@paper-station/frontend** — Vue 3 + Vite SPA. TDesign UI, Monaco Editor for JSON editing, Pinia state management, Tailwind CSS (prefix `tw-`).
- **@paper-station/finder** — Lightweight NestJS + Fastify read-only service (port 4001). Retrieves configs from Redis by slug + origin validation.

## Commands

```bash
# Install dependencies
pnpm install

# Run all packages in dev mode
pnpm dev

# Run individual packages in dev mode
pnpm fe          # frontend
pnpm be          # backend

# Build
pnpm build       # all packages
pnpm build:fe    # frontend only
pnpm build:be    # backend only
pnpm build:finder

# Lint (run from within each package directory)
cd packages/backend && pnpm lint
cd packages/frontend && pnpm lint

# Commit (commitizen with Chinese-language scopes)
pnpm c
```

There are no tests in this project.

## Architecture

### Backend (`packages/backend`)

NestJS modular architecture with global guards and interceptors provided by `@reus-able/nestjs`:
- **AuthGuard** (global) — JWT validation on all routes; endpoints decorated to skip auth (e.g., login, public config get).
- **TransformInterceptor** (global) — Wraps responses in a standard format.
- **Modules**: `UserModule`, `ConfigModule`, `SiteModule`, `CacheModule` — each with controller/service/DTOs following NestJS conventions.
- **Cache flow**: Config mutations emit events via `EventEmitter2` → `CacheService` listens and updates Redis. The finder service reads directly from Redis.
- **Key endpoints**: `POST /user/login` (SSO OAuth), `GET /config/get?slug=X` (public, validates `origin` header against site domain list), `/config` and `/site` (authenticated CRUD).

### Frontend (`packages/frontend`)

Vue 3 Composition API with file-based organization:
- **`src/api/`** — Axios client (`base.ts` configures interceptors, token from `PS_TOKEN` in localStorage).
- **`src/stores/`** — Pinia stores composed via `store.ts`. `useUserStore` handles auth, `useStorageStore` wraps LocalForage.
- **`src/hooks/`** — `useConfigList`, `useSiteList` composables for list data fetching with pagination.
- **`src/views/config/config-edit/`** — Monaco editor workspace with its own local Pinia store (`store.ts`).
- **Auto-imports**: Vue APIs and TDesign components are auto-imported (configured in `vite.config.ts`).

### Shared Libraries

The project depends on `@reus-able/*` packages:
- `@reus-able/nestjs` — LoggerModule, RedisModule, AuthGuard, ExceptionFilter, TransformInterceptor.
- `@reus-able/const` — Business error codes.
- `@reus-able/types` — Shared type definitions.

### Deployment

Alibaba Cloud Function Compute (FC3) via Serverless Devs (`s.yaml`). Runtime: custom.debian10 + Node.js 20. Region: cn-shenzhen.

## Code Style

- **No semicolons**, single quotes, 2-space indent, 100 char print width (backend/finder).
- Frontend uses default Prettier with single quotes and trailing commas.
- Commit messages follow commitizen with scopes: `frontend`, `backend`, `global`.
