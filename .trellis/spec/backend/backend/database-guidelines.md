# Database Guidelines

> TypeORM + MySQL conventions for the backend.

---

## Overview

- **ORM**: TypeORM 0.3 (`typeorm`) with the `mysql2` driver, connected in
  `app.module.ts` via `TypeOrmModule.forRootAsync` reading `MYSQL_*` env vars.
- **Migrations**: there are **no migration files**. `synchronize: false` is set,
  so schema changes must be applied manually to the MySQL instance (out of band).
  Do not flip `synchronize` to `true`.
- **Entities**: one file per entity under `src/entities/`, all exported through
  `src/entities/index.ts` via `ENTITY_LIST`, which `app.module.ts` registers.

---

## Query Patterns

- Services inject repositories with `@InjectRepository(Entity)` and use the
  TypeORM Repository API — never raw SQL.
- **Pagination** uses `nestjs-typeorm-paginate`'s `paginate()` helper:
  `src/module/config/config.service.ts#findAll` and `site.service.ts#findAll`.
  Page math: `const page = offset / limit || 1;` then options `{ page, limit }`,
  `where`, `relations`, `order` passed as the second/third argument.
- **Search** uses TypeORM `Like(\`%${search}%\`)` on the relevant column.
- **Relations** are loaded with the `relations` option (e.g. `{ owner: true }`,
  `{ owner: true, configs: true }`), not lazy-loading getters.
- Ownership scoping: every query that touches user data filters by
  `owner: { ssoId }` — see `config.service.ts#findAll`.

---

## Entity Conventions

- Table names are plural snake_case via the `@Entity({ name: 'configs' })`
  decorator: `users`, `configs`, `sites`.
- Columns use `snake_case` (`created_at`, `updated_at` via `@CreateDateColumn` /
  `@UpdateDateColumn`), while JS properties are camelCase (TypeORM maps them).
- Every entity exposes a `getData()` method returning a plain export object with
  `ssoId` as `id` (see `UserEntity.getData`, `ConfigEntity.getData`). Services
  call `cfg.getData()` before returning to controllers — never return the raw
  entity, because relations like `owner` would leak.
- JSON payloads are stored as `@Column({ type: 'json' })` objects
  (`ConfigEntity.data`).

---

## Relations

- `User 1—N Config` (`@OneToMany` / `@ManyToOne` with `owner` field).
- `Config N—M Site` (`@ManyToMany` with `sites` / `configs` fields).
- When writing join rows (e.g. site→configs), fetch the related entities first
  with `In(...)` and assign them — see `site.service.ts#create`.

---

## Transactions

- The codebase currently performs single `save`/`remove` calls without explicit
  `DataSource.transaction()` usage. Multi-step writes in one service method are
  accepted as-is (e.g. `site.service.ts#create` saves the site, then emits an
  event). Do not introduce distributed transactions unless a concrete
  consistency bug requires them.

---

## Common Mistakes

- Returning a raw entity with `owner` loaded — serializes the whole owner row.
  Always use `getData()`.
- Forgetting `relations` and hitting lazy-load N+1.
- Editing `synchronize` to auto-migrate schema in dev — schema is managed
  out-of-band; keep `synchronize: false`.
- Missing the `owner: { ssoId }` filter, letting one user read another's data.
