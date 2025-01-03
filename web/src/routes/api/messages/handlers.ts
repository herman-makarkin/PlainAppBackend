import { drizzle } from "drizzle-orm/postgres-js";
import { and, eq, ne, or, sql } from "drizzle-orm";
import messagesTable from "../../../db/schema/messages";
import { HTTPException } from "hono/http-exception";
import db from "../../../db";
import { chatMessages } from "../../../db/schema/chats";
import { groupMessages } from "../../../db/schema/"
import chatsTable from "../../../db/schema/chats"

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

export async function createChatMessage(id: number, options: { body: string, createdBy: number }) {
  try {
    const { body, createdBy } = options;

    const message = await db.insert(messagesTable).values({
      body,
      createdBy,
    }).returning();

    console.log(message, "message~~~~~~~~~~!!!!!!!GAY");
    if (!message[0].id) throw new Error();

    await db.insert(chatMessages).values({ chatId: id, messageId: message[0].id })

    return message[0];
  } catch (e: unknown) {
    console.log(`Error creating message: ${e}`);
  }
}

export async function chatInterlocutor(chatId: number, participantId: number) {
  try {
    const chat = await db.select({ participant1: chatsTable.participant1, participant2: chatsTable.participant2 })
      .from(chatsTable).where(eq(chatsTable.id, chatId))

    let interlocutor;
    if (chat[0].participant1 == participantId) interlocutor = chat[0].participant2;
    else if (chat[0].participant2 == participantId) interlocutor = chat[0].participant1;

    console.log('**', chat);
    console.log('!!!!!!!!!!!!!!', interlocutor);

    return interlocutor;

  } catch (e: unknown) {
    console.log(`Error finding the interlocutor: ${e}`);
  }
}

export async function createGroupMessage(groupId: number, options: { body: string, createdBy: number }) {
  try {
    const { body, createdBy } = options;

    const message = await db.insert(messagesTable).values({
      body,
      createdBy,
    }).returning({ id: messagesTable.id });

    if (!message.id) throw new Error();

    await db.insert(groupMessages).values({ groupId: groupId, messageId: message.id })

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

export async function deleteRemovedChatMessages(chatId: number, userId: number) {
  try {
    const result = await db.execute(sql`DELETE messages FROM chats
                      JOIN chat_messages ON chat_messages.chat_id = chats.id 
                      WHERE (messages.body LIKE "") AND messages.createdBy != ${userId}`);

    return result;
  } catch (e: unknown) {
    console.log(`Error retrieving chat by id: ${e}`);
  }
}

