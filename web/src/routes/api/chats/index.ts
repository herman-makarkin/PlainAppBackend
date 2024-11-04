import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import { stream, streamText } from "hono/streaming";
import {
  getChats,
  getChat,
  updateChat,
  createChat,
  deleteChat,
} from "./handlers";

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
  .post("/new/:name/:description", async (c) => {
    const { name, description } = c.req.param();
    return c.json(await createChat({ name, description }));
  })
  .put("/update/:id/:name/:description", async (c) => {
    const { id, name, description } = c.req.param();
    return c.json(await updateChat(Number(id), { name, description }));
  });

export default chatRoutes;
