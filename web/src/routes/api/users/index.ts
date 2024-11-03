import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import { stream, streamText } from "hono/streaming";
//import { getUsers, getUser, updateUser, deleteUser } from "./handlers";

import { getUsers, getUser, deleteUser, createUser } from "./handlers";
const userRoutes = new Hono()
  .get("/", async (c) => {
    const users = await getUsers();
    return c.json(users);
  })
  .get("/:id", async (c) => {
    const { id } = c.req.param();
    return c.json(await getUser(Number(id)));
  })
  .get("/rm/:id", async (c) => {
    const { id } = c.req.param();
    return c.json(await deleteUser({ id: Number(id) }));
  })
  .post("/new/:phoneNumber/:name/:bio", async (c) => {
    const { phoneNumber, name, bio } = c.req.param();
    return c.json(await createUser({ phoneNumber, name, bio }));
  });

export default userRoutes;
