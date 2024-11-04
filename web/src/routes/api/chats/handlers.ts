import { drizzle } from "drizzle-orm/postgres-js";
import { eq, sql } from "drizzle-orm";
import chatsTable from "../../../db/schema/chats";
import { HTTPException } from "hono/http-exception";
import db from "../../../db";

export async function getChats() {
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
  options: { name?: string; description?: string },
) {
  try {
    const { name, description } = options;

    return await db
      .update(chatsTable)
      .set({
        ...(name ? { name } : {}),
        ...(description ? { description } : {}),
        updatedAt: sql`NOW()`,
      })
      .where(eq(chatsTable.id, id))
      .returning({
        id: chatsTable.id,
        name: chatsTable.name,
        description: chatsTable.description,
      });
  } catch (e: unknown) {
    console.log(`Error updating chat: ${e}`);
  }
}

export async function createChat(options: {
  name?: string;
  description?: string;
}) {
  try {
    const { name, description } = options;

    return await db.insert(chatsTable).values({
      name: name,
      description: description,
    });
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
