import "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import chatsTable, { chatMessages } from "./schema/chats";
import messageTable from "./schema/messages";
import usersTable from "./schema/users";
// import { eq } from "drizzle-orm";

const db = drizzle(
  `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@db:${process.env.DB_PORT}/${process.env.DB_NAME}`,
);

async function test() {
  const messages = [
    {
      body: "hello",
      createdBy: 2,
    },
    {
      body: "hello",
      createdBy: 2,
    },
    {
      body: "hello",
      createdBy: 2,
    },
    {
      body: "hello",
      createdBy: 2,
    },
  ];

  let user1 = {
    name: "Vladimir",
    bio: "im very happy to be alive",
    phoneNumber: "88005553535",
  };

  let user2 = {
    name: "Pedro",
    bio: "im very happy to be alive",
    phoneNumber: "88005553536",
  };

  let user3 = {
    name: "Pablo",
    bio: "im very happy to be alive",
    phoneNumber: "88005553537",
  };

  const chats = [
    {
      participant1: 1,
      participant2: 2,
    },
    {
      participant1: 1,
      participant2: 3,
    },
  ];

  const newUsers = await db
    .insert(usersTable)
    .values([user1, user2, user3])
    .returning({ userId: usersTable.id });
  const newChat = await db
    .insert(chatsTable)
    .values(chats)
    .returning({ chatId: chatsTable.id });
  const newMessage = await db
    .insert(messageTable)
    .values(messages)
    .returning({ messageId: messageTable.id });

  // db.insert(userChats)
  //   .values([
  //     {
  //       chatId: newChat[0].chatId,
  //       userId: newUsers[0].userId,
  //     },
  //     {
  //       chatId: newChat[0].chatId,
  //       userId: newUsers[1].userId,
  //     },
  //     {
  //       chatId: newChat[1].chatId,
  //       userId: newUsers[1].userId,
  //     },
  //     {
  //       chatId: newChat[1].chatId,
  //       userId: newUsers[2].userId,
  //     },
  //   ])
  //   .execute();

  db.insert(chatMessages)
    .values([
      {
        chatId: newChat[0].chatId,
        messageId: newMessage[0].messageId,
      },
      {
        chatId: newChat[0].chatId,
        messageId: newMessage[1].messageId,
      },
      {
        chatId: newChat[0].chatId,
        messageId: newMessage[2].messageId,
      },
      {
        chatId: newChat[0].chatId,
        messageId: newMessage[3].messageId,
      },
    ])
    .execute();

  const dbUser = await db.select().from(usersTable);
  // const dbUserChats = await db.select().from(userChats);
  const dbChat = await db.select().from(chatsTable);
  const dbChatMessages = await db.select().from(chatMessages);
  const dbMessage = await db.select().from(messageTable);
  console.log(dbChat);
  console.log(dbUser);
  console.log(dbChatMessages);
  console.log(dbMessage);
}

test();
