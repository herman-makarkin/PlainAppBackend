import { eq, sql } from "drizzle-orm";
import { chatMessages } from "../../../db/schema/chats";
import { HTTPException } from "hono/http-exception";
import db from "../../../db";
import { and } from "drizzle-orm";

export async function getChatMessages(chatId: number) {
  try {
    const result = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.chatId, chatId));
    console.log(result);
    return result;
  } catch (e: unknown) {
    console.log(`Error retrieving chats messages: ${e}`);
    return "suck";
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
