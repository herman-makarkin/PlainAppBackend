import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import { stream, streamText } from "hono/streaming";
import {
  getMessages,
  getMessage,
  updateMessage,
  createMessage,
  deleteMessage,
} from "./handlers";

const messageRoutes = new Hono()
  .get("/", async (c) => {
    const messages = await getMessages();
    console.log(messages);

    return c.json(messages);
  })
  .get("/:id", async (c) => {
    console.log(c.req.param());
    const { id } = c.req.param();
    return c.json(await getMessage(Number(id)));
  })
  .delete("/rm/:id", async (c) => {
    const { id } = c.req.param();
    return c.json(await deleteMessage({ id: Number(id) }));
  })
  .put("/new/:id", async (c) => {
    const json = await c.req.json();
    try {
      const { id } = c.req.param()
      const { body, createdBy } = json;
      return c.json(await createMessage(Number(id), { body, createdBy: Number(createdBy) }));
    } catch (error) {
      console.log(error);
      return c.json({ error: "Invalid data" });
    }
  })
  .put("/update", async (c) => {
    const json = await c.req.json();
    try {
      const { id, body } = json;
      return c.json(await updateMessage(Number(id), body));
    } catch (error) {
      console.log(error);
      return c.json({ error: "Invalid data" });
    }
  });

export default messageRoutes;
