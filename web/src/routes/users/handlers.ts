import db from "../../db";
import { HTTPException } from "hono/http-exception";

export async function getUsers() {
  try {
    return await db.user.findMany({ orderBy: { createdAt: "asc" } });
  } catch (e: unknown) {
    console.log(`Error retrieving users: ${e}`);
  }
}

export async function getUser(id: number) {
  try {
    const user = await db.post.findUnique({ where: { id } });

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
  options: { name?: string; bio?: string },
) {
  try {
    const { name, bio } = options;

    return await db.user.update({
      where: { id },
      data: {
        ...(name ? { name } : {}),
        ...(bio ? { bio } : {}),
      },
    });
  } catch (e: unknown) {
    console.log(`Error updating user: ${e}`);
  }
}

export async function createUser(options: { name?: string; bio?: string }) {
  try {
    const { name, bio } = options;

    return await db.user.create({
      data: { name, bio },
    });
  } catch (e: unknown) {
    console.log(`Error creating user: ${e}`);
  }
}

export async function deleteUser(options: { id: number }) {
  try {
    const { id } = options;

    return await db.user.delete({ where: { id } });
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
