import {
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import message from "./messages";
import user, { userGroups } from "./users";

const chat = pgTable("chats", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  participant1: integer("participant1").references(() => user.id),
  participant2: integer("participant2").references(() => user.id),
});

export const chatRelations = relations(chat, ({ one, many }) => ({
  messages: many(chatMessages),
}));

export const chatMessages = pgTable(
  "chat_messages",
  {
    chatId: integer("chat_id")
      .notNull()
      .references(() => chat.id),
    messageId: integer("message_id")
      .notNull()
      .references(() => message.id),
  },
  (t) => ({ pk: primaryKey({ columns: [t.chatId, t.messageId] }) }),
);

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  chat: one(chat, {
    fields: [chatMessages.chatId],
    references: [chat.id],
  }),
  message: one(message, {
    fields: [chatMessages.messageId],
    references: [message.id],
  }),
}));

export default chat;
