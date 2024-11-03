import { pgTable, text, timestamp, varchar, serial } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import chatsTable from "./chats";

const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar({ length: 60 }),
  bio: text("bio"),
  phoneNumber: varchar({ length: 15 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userRelations = relations(usersTable, ({ many }) => ({
  chats: many(chatsTable),
}));

export default usersTable;
