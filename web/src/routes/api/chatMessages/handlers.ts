import { eq } from "drizzle-orm";
import { chatMessages } from "../../../db/schema/chats";
import { HTTPException } from "hono/http-exception";
import db from "../../../db";
import { and } from "drizzle-orm";
import chatsTable from '../../../db/schema/chats';
import messagesTable from '../../../db/schema/messages';

export async function getChatMessages(chatId: number) {
  try {
    const result = await db
      .select({
        id: messagesTable.id,
        body: messagesTable.body,
        notifyDate: messagesTable.notifyDate,
        createdAt: messagesTable.createdAt,
        createdBy: messagesTable.createdBy,
        updatedAt: messagesTable.updatedAt,
        timesResent: messagesTable.timesResent,
      })
      .from(chatsTable)
      .where(eq(chatsTable.id, chatId))
      .innerJoin(chatMessages, eq(chatsTable.id, chatMessages.chatId))
      .innerJoin(messagesTable, eq(chatMessages.messageId, messagesTable.id))
    console.log(result);
    return result;
  } catch (e: unknown) {
    console.log(`Error retrieving chats messages: ${e}`);
    return "suck";
  }
}

export async function removeChatMessage(messageId: number) {
  try {

    return await db
      .update(messagesTable)
      .set({
        body: "",
        notifyDate: null,
      })
      .where(eq(messagesTable.id, messageId))
      .returning({
        id: messagesTable.id,
      });
  } catch (e: unknown) {
    console.log(`Error updating message: ${e}`);
  }
}

export async function getChatMessage(chatId: number, messageId: number) {
  try {
    // const result = await db.query.ChatMessages.findMany({
    //   where: eq(ChatMessages.chatId, chatId),
    // });
    const result = await db
      .select()
      .from(chatMessages)
      .where(
        and(
          eq(chatMessages.chatId, chatId),
          eq(chatMessages.messageId, messageId),
        ),
      );
    console.log(result);
    return result;
  } catch (e: unknown) {
    console.log(`Error retrieving chat message: ${e}`);
    return "suck";
  }
}

export async function createChatMessage(options: {
  chatId: number;
  messageId: number;
}) {
  try {
    const { chatId, messageId } = options;

    return await db.insert(chatMessages).values({
      chatId,
      messageId,
    });
  } catch (e: unknown) {
    console.log(`Error creating ChatMessage: ${e}`);
  }
}

export async function deleteChatMessage(options: {
  chatId: number;
  messageId: number;
}) {
  try {
    const { chatId, messageId } = options;
    return await db
      .delete(chatMessages)
      .where(
        and(
          eq(chatMessages.chatId, chatId),
          eq(chatMessages.messageId, messageId),
        ),
      );
  } catch (e: unknown) {
    console.log(`Error deleting ChatMessage: ${e}`);
  }
}
