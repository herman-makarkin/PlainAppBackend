import "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import chatsTable, { chatMessages } from "./schema/chats";
import messageTable from "./schema/messages";
import usersTable, { userChats } from "./schema/users";

const db = drizzle(
  `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@127.0.0.1:${process.env.DB_PORT}/${process.env.DB_NAME}`,
);

async function test() {
  const message = {
    body: "hello",
  };

  let user1 = {
    name: "Vladimir",
    bio: "im very happy to be alive",
    phoneNumber: "88005553535",
  };

  let user2 = {
    name: "Pedro",
    bio: "im very happy to be alive",
    phoneNumber: "88005553535",
  };

  const chat = {
    name: "my chat",
    bio: "my gorgeous chat",
  };

  const newUsers = await db
    .insert(usersTable)
    .values([user1, user2])
    .returning({ userId: usersTable.id });
  const newChat = await db
    .insert(chatsTable)
    .values(chat)
    .returning({ chatId: chatsTable.id });
  const newMessage = await db
    .insert(messageTable)
    .values(message)
    .returning({ messageId: messageTable.id });

  db.insert(userChats)
    .values([
      {
        chatId: newChat[0].chatId,
        userId: newUsers[0].userId,
      },
      {
        chatId: newChat[0].chatId,
        userId: newUsers[1].userId,
      },
    ])
    .execute();

  db.insert(chatMessages)
    .values({
      chatId: newChat[0].chatId,
      messageId: newMessage[0].messageId,
    })
    .execute();

  const dbUser = await db.select().from(usersTable);
  const dbUserChats = await db.select().from(userChats);
  const dbChat = await db.select().from(chatsTable);
  const dbChatMessages = await db.select().from(chatMessages);
  const dbMessage = await db.select().from(messageTable);
  console.log(dbChat);
  console.log(dbUserChats);
  console.log(dbUser);
  console.log(dbChatMessages);
  console.log(dbMessage);
}

test();
