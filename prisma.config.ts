// prisma.config.ts
import { defineConfig } from "prisma/config";

try {
  // dotenv loads .env in local dev; absent in the slim production image,
  // where DATABASE_URL is injected via the container environment.
  require("dotenv/config");
} catch {}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});