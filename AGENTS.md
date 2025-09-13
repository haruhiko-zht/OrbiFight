# Repository Guidelines

> This guide orients contributors and agents working in the OrbiFight monorepo.

## Project Structure & Module Organization

- Root workspaces: `client/` (Vite + React + Phaser), `server/` (Fastify + Prisma), `shared/` (TypeScript utilities, exported from `shared/src`).
- Source lives under each package’s `src/`; build artifacts in `dist/`.
- Infra and docs: `infra/` (Docker Compose, Nginx/MySQL), `docs/` (API, architecture), `misc/` (notes), `.env.example` files (root and `server/`).

## Build, Test, and Development Commands

- Start dev (both): `npm run dev` (parallel server/client).
- Dev (single): `npm run --workspace server dev` | `npm run --workspace client dev`.
- Build: `npm run build` (server then client). Per app: `build:server`, `build:client`.
- Type check: `npm run typecheck`.
- Prisma (server): `npm run --workspace server prisma:generate` | `db:push` | `db:migrate` | `prisma:studio`.

## Coding Style & Naming Conventions

- Language: TypeScript (ES modules). Indent 2 spaces; 120‑col limit.
- Formatting: Prettier configured at repo root. Run `npm run format` or `format:check`.
- Naming: camelCase for variables/functions; PascalCase for types/components; kebab‑case for files (React components may use `PascalCase.tsx`).
- TS config: strict mode enabled; avoid `any`; use `zod` for runtime schemas on server.

## Testing Guidelines

- No test runner is configured yet. If adding tests:
  - Client: Vitest + React Testing Library under `client/src/**/__tests__/*`.
  - Server: Vitest/Jest + supertest under `server/src/**/__tests__/*`.
  - Prefer black‑box tests per route/module; keep fast and deterministic; target >80% critical-path coverage.

## Commit & Pull Request Guidelines

- Commits: imperative, present tense, concise (e.g., `add auth route`, `fix prisma url`). Group related changes; avoid noisy reformat‑only commits.
- Branches: `feature/<topic>` or `fix/<issue#>-<slug>`.
- PRs: clear description, motivation, and scope; link issues; include run steps and screenshots/console output when UI/behavior changes; note any schema or env impacts.

## Security & Configuration Tips

- Never commit real secrets; use `.env` + `.env.example`. After schema changes: `prisma:generate` then `db:push`/`db:migrate`.
- Local DB via Docker: `docker compose up -d db`. Align `APP_PORT` (root) with `PORT` in `server/.env` when using Nginx.

## Agent‑Specific Notes

- Keep changes minimal and workspace‑scoped; follow this file’s rules for any files you modify.
- Touch only relevant packages; update docs when commands or structure change.
