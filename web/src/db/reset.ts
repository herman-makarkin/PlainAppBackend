import { getTableName } from "drizzle-orm";
import db from ".";
import { Table } from "drizzle-orm";
import { sql } from "drizzle-orm";

async function resetTable() {
  return db.execute(
    sql.raw(`
      DROP TABLE IF EXISTS "users" CASCADE;
      DROP TABLE IF EXISTS "chats" CASCADE;
      DROP TABLE IF EXISTS "messages" CASCADE;
      DROP TABLE IF EXISTS "chat_messages" CASCADE;
      DROP TABLE IF EXISTS "user_chats" CASCADE;`),
  );
}

resetTable();
