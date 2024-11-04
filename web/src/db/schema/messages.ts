import { pgTable, text, timestamp, integer, serial } from "drizzle-orm/pg-core";
import user from "./users";
import { relations } from "drizzle-orm";

const message = pgTable("messages", {
  id: serial("id").primaryKey(),
  body: text("body").notNull(),
  notifyDate: timestamp("notify_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by")
    .notNull()
    .references(() => user.id),
});

export default message;
