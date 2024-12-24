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
  createdAt: timestamp("created_at").defaultNow(),
  finishedAt: timestamp("finished_at"),
  createdBy: integer("created_by"),
});

export default call;
