import db from ".";
import { sql } from "drizzle-orm";
// import { Table } from "drizzle-orm";
// import { getTableName } from "drizzle-orm";

async function resetTable() {
  return db.execute(
    sql.raw(`
      DROP TABLE IF EXISTS "users" CASCADE;
      DROP TABLE IF EXISTS "chats" CASCADE;
      DROP TABLE IF EXISTS "messages" CASCADE;
      DROP TABLE IF EXISTS "chat_messages" CASCADE;
      DROP TABLE IF EXISTS "calls" CASCADE;
      DROP TABLE IF EXISTS "groups" CASCADE;
      DROP TABLE IF EXISTS "group_messages" CASCADE;
      DROP TABLE IF EXISTS "user_chats" CASCADE;`),
  );
}

resetTable();
