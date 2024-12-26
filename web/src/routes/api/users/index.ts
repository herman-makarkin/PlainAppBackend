import { Hono } from "hono";
import {
  getUsers,
  getChats,
  getUser,
  deleteUser,
  createUser,
  updateUser,
  getChatMessages,
  getUserByPN
} from "./handlers";
import "dotenv/config";
import clients from '../index'

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
  .get("/byPN/:PN", async (c) => {
    const { PN } = c.req.param();
    console.log(PN, 'hello');
    if (PN)
      return c.json(await getUserByPN(PN.toString()));

  })
  .get("/chats/:id", async (c) => {
    const { id } = c.req.param();
    return c.json(await getChats(Number(id)));
  })
  .delete("/rm/:id", async (c) => {
    const { id } = c.req.param();
    return c.json(await deleteUser({ id: Number(id) }));
  })
  .put("/new", async (c) => {
    const json = await c.req.json();
    try {
      const { phoneNumber, name, bio, birthdate } = json;
      return c.json(await createUser({ phoneNumber, name, bio, birthdate }));
    } catch (error) {
      console.log(error);
      return c.json({ error: "Invalid data" });
    }
  })
  .patch("/update", async (c) => {
    const json = await c.req.json();
    try {
      const { id, phoneNumber, name, bio, birthdate } = json;
      return c.json(await updateUser(Number(id), { phoneNumber, name, bio, birthdate }));
    } catch (error) {
      console.log(error);
      return c.json({ error: "Invalid data" });
    }
  });

// export const userEvents = (s) = {
//   s.on('signin', (id: number) => {
//     console.log('User signedin:', id);
//     clients[id] = s;
//     console.log(s);
//   });
// }

export default userRoutes;
