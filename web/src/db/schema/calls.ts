import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import user from "./users";

const call = pgTable("calls", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  description: text("description"),
  isEdited: boolean("isEdited"),
  createdAt: timestamp("created_at").defaultNow(),
  finishedAt: timestamp("finished_at"),
  createdBy: integer("created_by"),
});

export const callRelations = relations(call, ({ one }) => ({
  createdBy: one(user, {
    fields: [call.createdBy],
    references: [user.id],
  }),
}));

export default call;
