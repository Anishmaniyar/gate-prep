# GATE 2027 CS Preparation Planner

Single-user personal app: syllabus → topics → resources → PYQs/practice → Planly daily planner → progress + revisions.

## Stack

- Frontend: Next.js + React + TypeScript + Tailwind (`apps/web`)
- Backend: Node.js + Express + TypeScript + Prisma (`apps/api`)
- DB: PostgreSQL via Docker Compose + Prisma (`prisma/`)

## Quick start

1. Copy env: `copy .env.example .env` (Windows) and adjust if needed.
2. Start Postgres: `docker compose up -d db`
3. Install: `pnpm install`
4. Migrate: `pnpm prisma:migrate`
5. (Optional sample data): `pnpm prisma:seed` — inserts clearly-labeled SAMPLE syllabus rows only.
6. Run API: `pnpm dev:api` (http://localhost:4000/api/health)
7. Run Web: `pnpm dev:web` (http://localhost:3000)

> Do not fabricate official syllabus content or real PYQs. Sample rows are prefixed `SAMPLE` and `isSample`.
> Real GATE 2027 syllabus + verified PYQs land in Phase 4.
