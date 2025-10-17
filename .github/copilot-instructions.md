## Quick context

This is a small NestJS API using Prisma as the ORM. Key modules live under `src/` (auth, users, budgets, transactions) and share a single `PrismaService` provider (`src/prisma/prisma.service.ts`). The app mounts all routes under the global prefix `/api` (`src/main.ts`).

## What an AI helper should know (short)

- Architecture: Nest modules -> controllers -> services. Services use `PrismaService` for DB access. Example: `src/budgets/budgets.controller.ts` -> `BudgetsService` -> `PrismaService`.
- Auth: Passport + JWT. Tokens are signed in `src/auth/auth.service.ts`, validated in `src/auth/jwt.strategy.ts` and `src/auth/jwt-refresh.strategy.ts`. Use `JwtAuthGuard` (`src/auth/jwt-auth.guard.ts`) or `@UseGuards(AuthGuard('jwt'))` to protect routes.
- Validation: DTOs use `class-validator` and a global `ValidationPipe` with `whitelist` and `forbidNonWhitelisted` enabled (see `src/main.ts`). Always return/accept DTO shapes that match these validators.
- DB: Prisma schema is at `prisma/schema.prisma`. DB connection string comes from `DATABASE_URL` env. Migrations live in `prisma/migrations/` and are applied with the npm scripts below.

## Common commands (copyable)

- Install: `npm install`
- Start dev: `npm run start:dev` (Nest watch)
- Build & generate Prisma client: `npm run build` (runs `nest build && prisma generate`)
- Migrate (dev): `npm run prisma:dev` (runs `prisma migrate dev`)
- Run seed: `npm run seed` (runs `ts-node prisma/seed.ts`)
- Tests: `npm run test` (unit), `npm run test:e2e` (e2e)

## Conventions & patterns to follow

- Files: module folders under `src/<module>` with `*.module.ts`, `*.controller.ts`, `*.service.ts` and a `dto/` subfolder for DTOs.
- Use DI: Inject `PrismaService` into services instead of instantiating Prisma client directly.
- Return authenticated user id from JWT: The JWT payload uses `{ sub, email }`. Controllers expect `req.user.sub` (see `src/budgets/budgets.controller.ts`). Note: some controllers use `req.user.userId` — prefer `req.user.sub` to match the JwtStrategy.
- Use Nest exceptions (BadRequestException, UnauthorizedException, ConflictException) — existing code relies on them for HTTP error codes.

## Integration points & env

- Prisma: `prisma/schema.prisma`, migrations in `prisma/migrations/`. Use `DATABASE_URL` env var. Default schema uses `provider = "mysql"`.
- JWT: `JWT_SECRET`, `JWT_REFRESH_SECRET`, `JWT_EXPIRES`, `JWT_REFRESH_EXPIRES` via environment or `.env` (ConfigModule is global in `src/app.module.ts`).
- Password hashing: `bcrypt` with salt rounds read from `BCRYPT_SALT_ROUNDS`.
- Docker: Dockerfile and `docker-compose.yml` exist at repo root — CI or local dev may use those; env variables must be provided.

## Small examples to copy from the repo

- Protect a controller route: `@UseGuards(JwtAuthGuard)` above controller or route handler; guard implementation: `src/auth/jwt-auth.guard.ts`.
- Prisma usage pattern (safe queries): inject `PrismaService` into the service and call `this.prisma.<model>.<action>(...)` (see `src/transactions/transactions.service.ts`).

## What not to change without asking

- `PrismaService` lifecycle handlers (`src/prisma/prisma.service.ts`) — they manage connection and graceful shutdown.
- Global `ValidationPipe` settings in `src/main.ts` — changing these alters DTO behavior across app.
- JWT payload shape and secret names — other modules expect `{ sub, email }` and environment keys.

## Where to look when something fails

- DB errors: check `prisma/migrations/*` and `prisma/schema.prisma`, ensure `DATABASE_URL` points to a matching DB.
- Auth issues: `src/auth/auth.service.ts`, `src/auth/jwt.strategy.ts`, env JWT secrets.
- Tests: `test/` (e2e) and `jest` config in `package.json`.

## Short checklist for PRs from AI edits

1. Did I run `npm run build` and `prisma generate`? (build must remain green)
2. Did I preserve `PrismaService` wiring and env names? (DATABASE_URL, JWT_SECRET, etc.)
3. Did I avoid changing global validation or error semantics unless the change is explicit?

---
If you want, I can expand this with examples of common edits (add a route, add a new Prisma model + migration, create auth-protected endpoints) or add CI-specific instructions. Feedback? 
