import {
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { userGroups } from "./users";
import message from "./messages";

const group = pgTable("groups", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  metadata: jsonb('metadata'),
});

export const groupRelations = relations(group, ({ many }) => ({
  messages: many(groupMessages),
  participants: many(userGroups),
}));

export const groupMessages = pgTable(
  "group_messages",
  {
    groupId: integer("group_id")
      .notNull()
      .references(() => group.id),
    messageId: integer("message_id")
      .notNull()
      .references(() => message.id),
  },
  (t) => ({ pk: primaryKey({ columns: [t.groupId, t.messageId] }) }),
);

export const groupMessagesRelations = relations(groupMessages, ({ one }) => ({
  group: one(group, {
    fields: [groupMessages.groupId],
    references: [group.id],
  }),
  message: one(message, {
    fields: [groupMessages.messageId],
    references: [message.id],
  }),
}));

export default group;
