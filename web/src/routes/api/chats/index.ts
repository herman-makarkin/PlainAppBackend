import { Hono } from "hono";
import {
  getChats,
  getChat,
  updateChat,
  createChat,
  deleteChat,
} from "./handlers";
// import { v4 as uuidv4 } from "uuid";
// import { stream, streamText } from "hono/streaming";

const chatRoutes = new Hono()
  .get("/", async (c) => {
    const chats = await getChats();
    console.log(chats);

    return c.json(chats);
  })
  .get("/:id", async (c) => {
    console.log(c.req.param());
    const { id } = c.req.param();
    return c.json(await getChat(Number(id)));
  })
  .delete("/rm/:id", async (c) => {
    const { id } = c.req.param();
    return c.json(await deleteChat({ id: Number(id) }));
  })
  // .post("/new/:name/:description", async (c) => {
  //   const { name, description } = c.req.param();
  //   return c.json(await createChat({ name, description }));
  // })
  .patch("/update/:id", async (c) => {
    const { id } = c.req.param();
    return c.json(await updateChat(Number(id)));
  })
  .put("/new", async (c) => {
    const json = await c.req.json();
    try {
      const { participant1, participant2 } = json;
      return c.json(await createChat({ participant1, participant2 }));
    } catch (error) {
      console.log(error);
      return c.json({ error: "Invalid data" });
    }
  });

export default chatRoutes;
