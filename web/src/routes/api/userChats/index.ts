import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import { stream, streamText } from "hono/streaming";
//import { getUsers, getUser, updateUser, deleteUser } from "./handlers";

import { getUsers, getUser } from "./handlers";
const userChatsRoutes = new Hono()
  .get("/", async (c) => {
    const users = await getUsers();
    console.log(users);

    return c.json(users);
  })
  .get("/:id", async (c) => {
    console.log(c.req.param());
    const { id } = c.req.param();
    return c.json(await getUser(Number(id)));
  });

export default userChatsRoutes;
