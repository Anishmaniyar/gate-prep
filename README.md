# GATE 2027 CS Preparation Planner

Single-user personal app: syllabus â†’ topics â†’ resources â†’ two-month Goal Planner â†’ Planly daily planner â†’ progress + revisions.

## Stack

- Frontend: Next.js + React + TypeScript + Tailwind (`apps/web`)
- Backend: Node.js + Express + TypeScript + Prisma (`apps/api`)
- DB: PostgreSQL via Docker Compose + Prisma (`prisma/`)

## Quick start

1. Copy env: `copy .env.example .env` (Windows) and adjust if needed.
2. Start Postgres: `docker compose up -d db`
3. Install: `pnpm install`
4. Migrate: `pnpm prisma:migrate`
5. Seed the plan: `pnpm prisma:seed` â€” inserts the four subject tracks, chapters, topics, two months, eight weeks, and Planly tasks. Safe to re-run; it updates in place.
6. Run API: `pnpm dev:api` (http://localhost:4000/api/health)
7. Run Web: `pnpm dev:web` (http://localhost:3000)

> Weightage figures are labelled estimates based on past GATE papers/coaching analysis, not official GATE 2027 data.
> Completion always comes from saved `TopicProgress`; planning values are stored separately.
