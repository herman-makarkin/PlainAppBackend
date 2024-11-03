import {
  pgTable,
  text,
  timestamp,
  varchar,
  serial,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import chat from "./chats";

const user = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar({ length: 60 }),
  bio: text("bio"),
  phoneNumber: varchar({ length: 15 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userRelations = relations(user, ({ many }) => ({
  chats: many(userChats),
}));

export const userChats = pgTable(
  "user_chats",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => user.id),
    chatId: integer("chat_id")
      .notNull()
      .references(() => chat.id),
  },
  (t) => ({ pk: primaryKey({ columns: [t.userId, t.chatId] }) }),
);

export const userChatsRelations = relations(userChats, ({ one }) => ({
  user: one(user, {
    fields: [userChats.userId],
    references: [user.id],
  }),
  chat: one(chat, {
    fields: [userChats.chatId],
    references: [chat.id],
  }),
}));

export default user;
