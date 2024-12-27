import { aliasedTable, eq, or, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import db from "../../../db";
import usersTable from "../../../db/schema/users";
import chatsTable, { chatMessages } from "../../../db/schema/chats";
// import { userChats } from "../../../db/schema/users";
import messagesTable from "../../../db/schema/messages"
import { and, ne, max } from "drizzle-orm";

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

export async function getUserByPN(phoneNumber: string) {
  try {
    console.log(phoneNumber)
    const result = await db.select().from(usersTable).where(eq(usersTable.phoneNumber, phoneNumber));
    console.log(await db.select().from(usersTable).where(eq(usersTable.phoneNumber, "88005553535")))
    console.log(result);
    return result;
  } catch (e: unknown) {
    console.log(`Error retrieving user by phone number${e}`);
    return "suck";
  }
}

export async function getChatMessages(id1: number, id2: number) {
  try {
    // const user2 = aliasedTable(chatTable, 'user2');
    const result = await db
      .select({
        'id': messagesTable.id,
        'body': messagesTable.body,
        'notifyDate': messagesTable.notifyDate,
        'updatedAt': messagesTable.updatedAt,
        'createdAt': messagesTable.createdAt,
        'createdBy': messagesTable.createdBy,
      })
      .from(chatsTable)
      .where(or(
        and(
          eq(chatsTable.participant1, id1),
          eq(chatsTable.participant2, id2)),
        and(
          eq(chatsTable.participant1, id2),
          eq(chatsTable.participant2, id1))
      ))
      .innerJoin(chatMessages, eq(chatsTable.id, chatMessages.chatId))
      .innerJoin(messagesTable, eq(chatMessages.messageId, messagesTable.id))

    console.log(result);
    return result;
  } catch (e: unknown) {
    console.log(`Error retrieving chat messages: ${e}`);
    return "suck";
  }
}

export async function getChats(id: number) {
  try {
    const result = await db
      .select({
        'id': chatsTable.id,
        'updatedAt': chatsTable.updatedAt,
        'createdAt': chatsTable.createdAt,
      })
      .from(chatsTable)
      .where(or(eq(chatsTable.participant1, id), eq(chatsTable.participant2, id)))

    console.log(result);
    return result;
  } catch (e: unknown) {
    console.log(`Error retrieving chats: ${e}`);
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
  options: { phoneNumber?: string; name?: string; bio?: string, birthdate?: string },
) {
  try {
    const { phoneNumber, name, bio, birthdate } = options;

    return await db
      .update(usersTable)
      .set({
        ...(name ? { name } : {}),
        ...(bio ? { bio } : {}),
        ...(birthdate ? { birthdate } : {}),
        ...(phoneNumber ? { phoneNumber } : {}),
        updatedAt: sql`NOW()`,
      })
      .where(eq(usersTable.id, id))
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        bio: usersTable.bio,
        phoneNumber: usersTable.phoneNumber,
        birthdate: usersTable.birthdate
      });
  } catch (e: unknown) {
    console.log(`Error updating user: ${e}`);
  }
}

export async function createUser(options: {
  phoneNumber: string;
  name?: string;
  bio?: string;
  birthdate?: string;
}) {
  try {
    const { phoneNumber, name, bio, birthdate } = options;

    const user = await db.insert(usersTable).values({
      name: name,
      bio: bio,
      phoneNumber: phoneNumber,
      birthdate: birthdate,
      createdAt: sql`NOW()`,
      updatedAt: sql`NOW()`,
    }).returning();
    // const id = db.select({ id: max(usersTable.id) }).from(usersTable)
    return user;
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
