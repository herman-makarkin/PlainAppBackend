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
  .post("/new/:body", async (c) => {
    const { body } = c.req.param();
    return c.json(await createMessage({ body }));
  })
  .put("/update/:id/:body", async (c) => {
    const { id, body } = c.req.param();
    return c.json(await updateMessage(Number(id), { body }));
  });

export default messageRoutes;
