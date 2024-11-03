import usersTable from "./schema/users";
import { drizzle } from "drizzle-orm/node-postgres";
import "dotenv";
import chatsTable from "./schema/chats";
import messageTable from "./schema/messages";

const db = drizzle(
  `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@127.0.0.1:${process.env.DB_PORT}/${process.env.DB_NAME}`,
);

async function test() {
  const message = {
    body: "hello",
  };
  const user1 = {
    name: "Sony",
    bio: "im very happy to be alive",
    phoneNumber: "88005553535",
  };

  const user2 = {
    name: "Vito",
    bio: "im very happy to be alive",
    phoneNumber: "88005553535",
  };

  const chat = {
    name: "my chat",
    bio: "my gorgeous chat",
    participants: [user1, user2],
  };

  await db.insert(usersTable).values(user1);
  await db.insert(usersTable).values(user2);

  await db.insert(messageTable).values(message);
  await db.insert(chatsTable).values(chat);
  const dbUser = await db.select().from(usersTable);
  console.log(dbUser);
  const dbChat = await db.select().from(chatsTable);
  console.log(dbChat);
  const dbMessage = await db.select().from(messageTable);
  console.log(dbMessage);
}

test();
