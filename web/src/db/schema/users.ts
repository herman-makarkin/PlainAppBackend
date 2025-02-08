import {
  pgTable,
  timestamp,
  varchar,
  serial,
  integer,
  primaryKey,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import group from "./groups";

const user = pgTable("users", {
  id: serial("id").primaryKey(),
  nickname: varchar({ length: 60 }).notNull().unique(),
  name: varchar({ length: 60 }).notNull(),
  bio: varchar({ length: 80 }),
  birthdate: date("birthdate"),
  phoneNumber: varchar("phone_number", { length: 15 }).notNull().unique(),
  lastConnected: timestamp("last_connected").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userRelations = relations(user, ({ many }) => ({
  groups: many(userGroups),
}));

export const userGroups = pgTable(
  "user_groups",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => user.id),
    groupId: integer("group_id")
      .notNull()
      .references(() => group.id),
  },
  (t) => ({ pk: primaryKey({ columns: [t.userId, t.groupId] }) }),
);

export const userGroupsRelations = relations(userGroups, ({ one }) => ({
  user: one(user, {
    fields: [userGroups.userId],
    references: [user.id],
  }),
  group: one(group, {
    fields: [userGroups.groupId],
    references: [group.id],
  }),
}));


export default user;
