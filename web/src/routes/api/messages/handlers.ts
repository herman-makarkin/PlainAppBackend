import { drizzle } from "drizzle-orm/postgres-js";
import { eq, sql } from "drizzle-orm";
import messagesTable from "../../../db/schema/messages";
import { HTTPException } from "hono/http-exception";
import db from "../../../db";
import { chatMessages } from "../../../db/schema/chats";
import { groupMessages } from "../../../db/schema/"

export async function getMessages() {
  try {
    const result = await db.select().from(messagesTable);
    console.log(result);
    return result;
  } catch (e: unknown) {
    console.log(`Error retrieving messages: ${e}`);
    return "suck";
  }
}

export async function getMessage(id: number) {
  try {
    const message = await db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.id, id));

    if (!message) {
      console.log("Message not Found");
      throw new HTTPException(401, { message: "Message not found" });
    }

    return message;
  } catch (e: unknown) {
    console.log(`Error retrieving message by id: ${e}`);
  }
}

export async function updateMessage(id: number, options: { body: string }) {
  try {
    const { body } = options;

    return await db
      .update(messagesTable)
      .set({
        ...(body ? { body } : {}),
        updatedAt: sql`NOW()`,
      })
      .where(eq(messagesTable.id, id))
      .returning({
        id: messagesTable.id,
        body: messagesTable.body,
      });
  } catch (e: unknown) {
    console.log(`Error updating message: ${e}`);
  }
}

export async function createChatMessage(id: number, options: { body: string, createdBy: number}) {
  try {
    const { body, createdBy } = options;

    const message = await db.insert(messagesTable).values({
      body ,
      createdBy,
    }).returning({id: messagesTable.id});

    if (!message.id) throw new Error();

    await db.insert(chatMessages).values({chatId: id, messageId: message.id})

    return message;
  } catch (e: unknown) {
    console.log(`Error creating message: ${e}`);
  }
}

export async function createGroupMessage(groupId:number, options: { body: string, createdBy: number }) {
  try {
    const { body, createdBy } = options;

    const message = await db.insert(messagesTable).values({
      body ,
      createdBy,
    }).returning({id: messagesTable.id});

    if (!message.id) throw new Error();

    await db.insert(groupMessages).values({groupId: groupId, messageId: message.id})

    return message;
  } catch (e: unknown) {
    console.log(`Error creating message: ${e}`);
  }
}

export async function deleteMessage(options: { id: number }) {
  try {
    const { id } = options;
    db.delete(groupMessages).where(eq(groupMessages.messageId, id))
    db.delete(chatMessages).where(eq(chatMessages.messageId, id))
    return await db.delete(messagesTable).where(eq(messagesTable.id, id));
  } catch (e: unknown) {
    console.log(`Error deleting message: ${e}`);
  }
}
