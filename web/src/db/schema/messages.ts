import { pgTable, text, timestamp, boolean, serial } from "drizzle-orm/pg-core";

const message = pgTable("messages", {
  id: serial("id").primaryKey(),
  body: text("body").notNull(),
  isChanged: boolean("is_changed").default(false),
  notifyDate: timestamp(),
  createdAt: timestamp().defaultNow(),
});

export default message;
