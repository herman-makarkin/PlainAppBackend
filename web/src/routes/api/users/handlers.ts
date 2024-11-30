import { aliasedTable, eq, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import db from "../../../db";
import usersTable from "../../../db/schema/users";
import chatsTable, { chatMessages } from "../../../db/schema/chats";
import { userChats } from "../../../db/schema/users";
import messagesTable from "../../../db/schema/messages"
import { and, ne } from "drizzle-orm";

export async function getUsers() {
  try {
    const result = await db.select().from(usersTable);
    console.log(result);
    return result;
  } catch (e: unknown) {
    console.log(`Error retrieving users: ${e}`);
    return "suck";
  }
}

export async function getChatMessages(id1: number, id2: number) {
  try {
    const user2 = aliasedTable(userChats, 'user2');
    const result = await db
      .select({
        'id': messagesTable.id,
        'body': messagesTable.body,
        'notifyDate': messagesTable.notifyDate,
        'updatedAt': messagesTable.updatedAt,
        'createdAt': messagesTable.createdAt,
        'createdBy': messagesTable.createdBy,
      })
      .from(userChats)
      .where(eq(userChats.userId, id1))
      .innerJoin(user2, and(eq(userChats.chatId, user2.chatId), ne(userChats.userId, user2.userId)))
      .innerJoin(chatMessages, eq(userChats.chatId, chatMessages.chatId))
      .innerJoin(messagesTable, eq(chatMessages.messageId, messagesTable.id))

    console.log(result);
    return result;
  } catch (e: unknown) {
    console.log(`Error retrieving users: ${e}`);
    return "suck";
  }
}

export async function getChats(id: number) {
  try {
    const result = await db
      .select({
        'id': chatsTable.id,
        'name': chatsTable.name,
        'desc': chatsTable.description,
        'updatedAt': chatsTable.updatedAt,
        'createdAt': chatsTable.createdAt,
      })
      .from(userChats)
      .where(eq(userChats.userId, id))
      .innerJoin(chatsTable, eq(userChats.chatId, chatsTable.id))

    console.log(result);
    return result;
  } catch (e: unknown) {
    console.log(`Error retrieving users: ${e}`);
    return "suck";
  }
}

export async function getUser(id: number) {
  try {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));

    if (!user) {
      console.log("User not Found");
      throw new HTTPException(401, { message: "User not found" });
    }

    return user;
  } catch (e: unknown) {
    console.log(`Error retrieving user by id: ${e}`);
  }
}

export async function updateUser(
  id: number,
  options: { phoneNumber?: string; name?: string; bio?: string },
) {
  try {
    const { phoneNumber, name, bio } = options;

    return await db
      .update(usersTable)
      .set({
        ...(name ? { name } : {}),
        ...(bio ? { bio } : {}),
        ...(phoneNumber ? { phoneNumber } : {}),
        updatedAt: sql`NOW()`,
      })
      .where(eq(usersTable.id, id))
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        bio: usersTable.bio,
        phoneNumber: usersTable.phoneNumber,
      });
  } catch (e: unknown) {
    console.log(`Error updating user: ${e}`);
  }
}

export async function createUser(options: {
  phoneNumber: string;
  name?: string;
  bio?: string;
}) {
  try {
    const { phoneNumber, name, bio } = options;

    await db.insert(usersTable).values({
      name: name,
      bio: bio,
      phoneNumber: phoneNumber,
    });
    return { message: "success" };
  } catch (e: unknown) {
    console.log(`Error creating user: ${e}`);
  }
}

export async function deleteUser(options: { id: number }) {
  try {
    const { id } = options;
    await db.delete(usersTable).where(eq(usersTable.id, id));
    return { message: "success" };
  } catch (e: unknown) {
    console.log(`Error deleting user: ${e}`);
  }
}
