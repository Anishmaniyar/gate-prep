import path from "node:path";
import dotenv from "dotenv";

// Load local environment files
dotenv.config();
dotenv.config({
  path: path.resolve(process.cwd(), "../../.env"),
});

export const config = {
  port: Number(process.env.PORT ?? process.env.API_PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL ?? "",
};
