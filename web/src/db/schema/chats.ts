import { pgTable, text, timestamp, varchar, serial } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import message from "./messages";
import user from "./users";

const chat = pgTable("chats", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatRelations = relations(chat, ({ many }) => ({
  messages: many(message),
  participants: many(user),
}));

export default chat;
