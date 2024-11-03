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
import { userChats } from "./users";
import message from "./messages";

const chat = pgTable("chats", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatRelations = relations(chat, ({ many }) => ({
  messages: many(chatMessages),
  participants: many(userChats),
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
