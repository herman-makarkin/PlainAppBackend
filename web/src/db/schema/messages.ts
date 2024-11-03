import { pgTable, text, timestamp, boolean, serial } from "drizzle-orm/pg-core";

const message = pgTable("messages", {
  id: serial("id").primaryKey(),
  body: text("body").notNull(),
  notifyDate: timestamp(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});

export default message;
