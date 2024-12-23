import { drizzle } from "drizzle-orm/postgres-js";
import { eq, sql } from "drizzle-orm";
import chatsTable from "../../../db/schema/chats";
import { HTTPException } from "hono/http-exception";
import groupsTable from "../../../db/schema/groups"
import db from "../../../db";

export async function getGroups() {
  try {
    const result = await db.select().from(chatsTable);
    console.log(result);
    return result;
  } catch (e: unknown) {
    console.log(`Error retrieving chats: ${e}`);
    return "suck";
  }
}

export async function getGroup(id: number) {
  try {
    const chat = await db
      .select()
      .from(chatsTable)
      .where(eq(chatsTable.id, id));

    if (!chat) {
      console.log("Group not Found");
      throw new HTTPException(401, { message: "Group not found" });
    }

    return chat;
  } catch (e: unknown) {
    console.log(`Error retrieving chat by id: ${e}`);
  }
}

export async function updateGroup(
  id: number,
  options: {
    name?: string,
    description?: string
  },
) {
  try {
    const { description, name } = options;

    return await db
      .update(chatsTable)
      .set({
        ...(name ? { name } : {}),
        ...(description ? { description } : {}),
        updatedAt: sql`NOW()`,
      })
      .where(eq(chatsTable.id, id))
      .returning({
        id: chatsTable.id
      });
  } catch (e: unknown) {
    console.log(`Error updating chat: ${e}`);
    return {message: 'error'};
  }
}

export async function createGroup(options: {name: string, description: string}) {
  try {
    const { name, description } = options;

      return await db.insert(groupsTable).values({name, description}).returning({id: groupsTable.id})
  } catch (e: unknown) {
    console.log(`Error creating chat: ${e}`);
  }
}

export async function deleteGroup(options: { id: number }) {
  try {
    const { id } = options;
    return await db.delete(chatsTable).where(eq(chatsTable.id, id));
  } catch (e: unknown) {
    console.log(`Error deleting chat: ${e}`);
  }
}
