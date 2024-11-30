import { Hono } from "hono";
import {
  getUsers,
  getChats,
  getUser,
  deleteUser,
  createUser,
  updateUser,
  getChatMessages
} from "./handlers";

const userRoutes = new Hono()
  .get("/", async (c) => {
    const users = await getUsers();
    return c.json(users);
  })
  .get("/:id", async (c) => {
    const { id } = c.req.param();
    return c.json(await getUser(Number(id)));
  })
  .get("/chatsM/:userId1/:userId2", async (c) => {
    const { userId1, userId2 } = c.req.param();
    return c.json(await getChatMessages(Number(userId1), Number(userId2)));
  })
  .get("/chats/:id", async (c) => {
    const { id } = c.req.param();
    return c.json(await getChats(Number(id)));
  })
  .delete("/rm/:id", async (c) => {
    const { id } = c.req.param();
    return c.json(await deleteUser({ id: Number(id) }));
  })
  .put("/new/:phoneNumber/:name/:bio", async (c) => {
    const { phoneNumber, name, bio } = c.req.param();
    return c.json(await createUser({ phoneNumber, name, bio }));
  })
  .put("/update/:id/:phoneNumber/:name/:bio", async (c) => {
    const { id, phoneNumber, name, bio } = c.req.param();
    return c.json(await updateUser(Number(id), { phoneNumber, name, bio }));
  });

export default userRoutes;
