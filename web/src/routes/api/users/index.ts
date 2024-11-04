import { Hono } from "hono";
import {
  getUsers,
  getUser,
  deleteUser,
  createUser,
  updateUser,
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
