import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import { stream, streamText } from "hono/streaming";
import {
  getMessages,
  getMessage,
  updateMessage,
  createChatMessage,
  createGroupMessage,
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
  .put("/newChatM/:id", async (c) => {
    const json = await c.req.json();
    try {
      const { id } = c.req.param()
      const { body, createdBy } = json;
      return c.json(await createChatMessage(Number(id), { body, createdBy: Number(createdBy) }));
    } catch (error) {
      console.log(error);
      return c.json({ error: "Invalid data" });
    }
  })
  .put("/newGroupM/:id", async (c) => {
    const json = await c.req.json();
    try {
      const { id } = c.req.param()
      const { body, createdBy } = json;
      return c.json(await createGroupMessage(Number(id), { body, createdBy: Number(createdBy) }));
    } catch (error) {
      console.log(error);
      return c.json({ error: "Invalid data" });
    }
  })
  .patch("/update/:id", async (c) => {
    const json = await c.req.json();
    try {
      const { id } = c.req.param()
      const { body } = json;
      return c.json(await updateMessage(Number(id), body));
    } catch (error) {
      console.log(error);
      return c.json({ error: "Invalid data" });
    }
  });

export default messageRoutes;
