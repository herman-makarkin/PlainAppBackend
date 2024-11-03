import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import usersTable from "../../../db/schema/users";
import { HTTPException } from "hono/http-exception";
import db from "../../../db";

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

// export async function updateUser(
//   id: number,
//   options: { name?: string; bio?: string },
// ) {
//   try {
//     const { name, bio } = options;

//     return await db.user.update({
//       where: { id },
//       data: {
//         ...(name ? { name } : {}),
//         ...(bio ? { bio } : {}),
//       },
//     });
//   } catch (e: unknown) {
//     console.log(`Error updating user: ${e}`);
//   }
// }

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

export async function deleteUser(id: number) {
  try {
    return await db.delete(usersTable).where(eq(usersTable.id, id));
  } catch (e: unknown) {
    console.log(`Error deleting user: ${e}`);
  }
}

// import "dotenv/config";
// import { drizzle } from "drizzle-orm/postgres-js";
// import { usersTable } from "../../db/schema";
// import { HTTPException } from "hono/http-exception";

// const db = drizzle(process.env.DATABASE_URL!);

// export async function getUsers() {
//   try {
//     return await db.select().from(usersTable);
//   } catch (e: unknown) {
//     console.log(`Error retrieving users: ${e}`);
//   }
// }
