import { drizzle } from "drizzle-orm/postgres-js";
import { eq, sql, and, isNull} from "drizzle-orm";
import chatsTable from "../../../db/schema/chats";
import { HTTPException } from "hono/http-exception";
import { chatMessages } from "../../../db/schema/chats"
import db from "../../../db";
import messagesTable from "../../../db/schema/messages"

export async function getAllChats() {
  try {
    const result = await db.select().from(chatsTable);
    console.log(result);
    return result;
  } catch (e: unknown) {
    console.log(`Error retrieving chats: ${e}`);
    return "suck";
  }
}

export async function getChat(id: number) {
  try {
    const chat = await db
      .select()
      .from(chatsTable)
      .where(eq(chatsTable.id, id));

    if (!chat) {
      console.log("Chat not Found");
      throw new HTTPException(401, { message: "Chat not found" });
    }

    return chat;
  } catch (e: unknown) {
    console.log(`Error retrieving chat by id: ${e}`);
  }
}

export async function updateChat(
  id: number,
) {
  try {
    return await db
      .update(chatsTable)
      .set({
        updatedAt: sql`NOW()`,
      })
      .where(eq(chatsTable.id, id))
      .returning();
  } catch (e: unknown) {
    console.log(`Error updating chat: ${e}`);
  }
}

export async function createChat(options: {
  participant1: number;
  participant2: number;
}) {
  try {
    const { participant1, participant2 } = options;

    return await db.insert(chatsTable).values({
      participant1,
      participant2,
    }).returning();
  } catch (e: unknown) {
    console.log(`Error creating chat: ${e}`);
  }
}

export async function deleteChat(options: { id: number }) {
  try {
    const { id } = options;
    return await db.delete(chatsTable).where(eq(chatsTable.id, id));
  } catch (e: unknown) {
    console.log(`Error deleting chat: ${e}`);
  }
}
