import { eq, sql } from "drizzle-orm";
import { userChats } from "../../../db/schema/users";
import { HTTPException } from "hono/http-exception";
import db from "../../../db";
import { and } from "drizzle-orm";

export async function getUserChats(userId: number) {
  try {
    const result = await db
      .select()
      .from(userChats)
      .where(eq(userChats.userId, userId));
    console.log(result);
    return result;
  } catch (e: unknown) {
    console.log(`Error retrieving user chats: ${e}`);
    return;
  }
}

export async function getChatUsers(chatId: number) {
  try {
    const chatUsers = await db
      .select()
      .from(userChats)
      .where(eq(userChats.userId, chatId));

    if (!chatUsers) {
      console.log("UserChat not Found");
      // throw new HTTPException(401, { userChat: "UserChat not found" });
    }

    return chatUsers;
  } catch (e: unknown) {
    console.log(`Error retrieving userChat by id: ${e}`);
  }
}

export async function getUserChat(userId: number, chatId: number) {
  try {
    // const result = await db.query.userChats.findMany({
    //   where: eq(userChats.userId, userId),
    // });
    const result = await db
      .select()
      .from(userChats)
      .where(and(eq(userChats.userId, userId), eq(userChats.chatId, chatId)));
    console.log(result);
    return result;
  } catch (e: unknown) {
    console.log(`Error retrieving user chats: ${e}`);
    return;
  }
}

export async function createUserChat(options: {
  userId: number;
  chatId: number;
}) {
  try {
    const { userId, chatId } = options;

    return await db.insert(userChats).values({
      userId,
      chatId,
    });
  } catch (e: unknown) {
    console.log(`Error creating userChat: ${e}`);
  }
}

export async function deleteUserChat(options: {
  userId: number;
  chatId: number;
}) {
  try {
    const { userId, chatId } = options;
    return await db
      .delete(userChats)
      .where(and(eq(userChats.userId, userId), eq(userChats.chatId, chatId)));
  } catch (e: unknown) {
    console.log(`Error deleting userChat: ${e}`);
  }
}
