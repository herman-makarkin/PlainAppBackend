import { usersTable } from "./schema";
import { drizzle } from "drizzle-orm/node-postgres";
import "dotenv";

const db = drizzle(
  `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@127.0.0.1:${process.env.DB_PORT}/${process.env.DB_NAME}`,
);

async function test() {
  const user = {
    name: "Michael",
    bio: "im very happy to be alive",
  };

  await db.insert(usersTable).values(user);

  const result = await db.select().from(usersTable);
  console.log(result);
}

test();
