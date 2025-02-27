import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@db:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  },
  verbose: true,
  strict: true,
});
