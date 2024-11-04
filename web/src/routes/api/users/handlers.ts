import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import usersTable from "../../../db/schema/users";
import { HTTPException } from "hono/http-exception";
import db from "../../../db";
import { sql } from "drizzle-orm";

export async function getUsers() {
  try {
    const result = await db.select().from(usersTable);
    console.log(result);
    return result;
  } catch (e: unknown) {
    console.log(`Error retrieving users: ${e}`);
    return "suck";
  }
}

export async function getUser(id: number) {
  try {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));

    if (!user) {
      console.log("User not Found");
      throw new HTTPException(401, { message: "User not found" });
    }

    return user;
  } catch (e: unknown) {
    console.log(`Error retrieving user by id: ${e}`);
  }
}

export async function updateUser(
  id: number,
  options: { phoneNumber?: string; name?: string; bio?: string },
) {
  try {
    const { phoneNumber, name, bio } = options;

    return await db
      .update(usersTable)
      .set({
        ...(name ? { name } : {}),
        ...(bio ? { bio } : {}),
        ...(phoneNumber ? { phoneNumber } : {}),
        updatedAt: sql`NOW()`,
      })
      .where(eq(usersTable.id, id))
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        bio: usersTable.bio,
        phoneNumber: usersTable.phoneNumber,
      });
  } catch (e: unknown) {
    console.log(`Error updating user: ${e}`);
  }
}

export async function createUser(options: {
  phoneNumber: string;
  name?: string;
  bio?: string;
}) {
  try {
    const { name, bio, phoneNumber } = options;

    return await db.insert(usersTable).values({
      name: name,
      bio: bio,
      phoneNumber: phoneNumber,
    });
  } catch (e: unknown) {
    console.log(`Error creating user: ${e}`);
  }
}

export async function deleteUser(options: { id: number }) {
  try {
    const { id } = options;
    return await db.delete(usersTable).where(eq(usersTable.id, id));
  } catch (e: unknown) {
    console.log(`Error deleting user: ${e}`);
  }
}
