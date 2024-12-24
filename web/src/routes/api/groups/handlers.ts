import { eq, sql, and } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import groupsTable from "../../../db/schema/groups"
import { userGroups } from "../../../db/schema/users"
import db from "../../../db";

export async function getGroups() {
  try {
    const result = await db.select().from(groupsTable);
    console.log(result);
    return result;
  } catch (e: unknown) {
    console.log(`Error retrieving groups: ${e}`);
    return "suck";
  }
}

export async function getGroup(id: number) {
  try {
    const group = await db
      .select()
      .from(groupsTable)
      .where(eq(groupsTable.id, id));

    if (!group) {
      console.log("Group not Found");
      throw new HTTPException(401, { message: "Group not found" });
    }

    return group;
  } catch (e: unknown) {
    console.log(`Error retrieving group by id: ${e}`);
  }
}

export async function updateGroup(
  id: number,
  options: {
    name?: string,
    description?: string
    metadata?: string
  },
) {
  try {
    const { description, name, metadata } = options;
    if (!name) {
      throw new HTTPException();
    }
    return await db
      .update(groupsTable)
      .set({
        ...(name ? { name } : {}),
        ...(metadata ? { metadata } : {}),
        ...(description ? { description } : {}),
        updatedAt: sql`NOW()`,
      })
      .where(eq(groupsTable.id, id))
      .returning({
        id: groupsTable.id
      });
  } catch (e: unknown) {
    console.log(`Error updating group: ${e}`);
    return {message: 'error'};
  }
}

export async function createGroup(options: {name: string, description: string, metadata: string}) {
  try {
    const { name, description, metadata } = options;

      return await db.insert(groupsTable).values({name, description, metadata}).returning({id: groupsTable.id})
  } catch (e: unknown) {
    console.log(`Error creating group: ${e}`);
  }
}

export async function deleteGroup(options: { id: number }) {
  try {
    const { id } = options;
    return await db.delete(groupsTable).where(eq(groupsTable.id, id));
  } catch (e: unknown) {
    console.log(`Error deleting group: ${e}`);
  }
}

export async function addUser(userId: number, groupId: number) {
  try {
    return await db.insert(userGroups).values({groupId, userId})
  } catch (e: unknown) {
    console.log(`Error adding user to group: ${e}`);
  }
}

export async function removeUser(userId: number, groupId: number) {
  try {
    return await db.delete(userGroups).where(and(eq(userGroups.userId, userId), eq(userGroups.groupId, groupId)));
  } catch (e: unknown) {
    console.log(`Error adding user to group: ${e}`);
  }
}
