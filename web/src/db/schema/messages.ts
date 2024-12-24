import { pgTable, text, timestamp, integer, serial } from "drizzle-orm/pg-core";
import user from "./users";

const message = pgTable("messages", {
  id: serial("id").primaryKey(),
  body: text("body").notNull(),
  timesResent: integer("times").default(0),
  notifyDate: timestamp("notify_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by")
    .notNull()
    .references(() => user.id),
});

export default message;
