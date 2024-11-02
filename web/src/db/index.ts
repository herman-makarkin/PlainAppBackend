import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle(
  `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@127.0.0.1:${process.env.DB_PORT}/${process.env.DB_NAME}`,
);

export default db;
