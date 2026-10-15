import path from "node:path";
import dotenv from "dotenv";

// Load apps/api/.env first, then fall back to the repo-root .env
// (pnpm --filter runs with cwd=apps/api, while canonical env lives at root).
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

export const config = {
  port: Number(process.env.API_PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL ?? "",
};
