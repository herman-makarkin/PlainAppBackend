import { Hono } from "hono";
import {
  getGroups,
  getGroup,
  updateGroup,
  createGroup,
  deleteGroup,
} from "./handlers";
// import { v4 as uuidv4 } from "uuid";
// import { stream, streamText } from "hono/streaming";

const chatRoutes = new Hono()
  .get("/", async (c) => {
    const chats = await getGroups();
    console.log(chats);

    return c.json(chats);
  })
  .get("/:id", async (c) => {
    console.log(c.req.param());
    const { id } = c.req.param();
    return c.json(await getGroup(Number(id)));
  })
  .delete("/rm/:id", async (c) => {
    const { id } = c.req.param();
    return c.json(await deleteGroup({ id: Number(id) }));
  })
  // .post("/new/:name/:description", async (c) => {
  //   const { name, description } = c.req.param();
  //   return c.json(await createGroup({ name, description }));
  // })
  .put("/update/:id/:name/:description", async (c) => {
    // const { id, name, description } = c.req.param();
    // return c.json(await updateGroup(Number(id), { name, description }));
    const json = await c.req.json();
    try {
      const { id, name, description } = json;
        return c.json(await updateGroup(Number(id), { name, description}));
    } catch (error) {
      console.log(error);
      return c.json({ error: "Invalid data" });
    }
  })
  .put("/new", async (c) => {
    const json = await c.req.json();
    try {
      const { name, description } = json;
        return c.json(await createGroup({name, description}));
    } catch (error) {
      console.log(error);
      return c.json({ error: "Invalid data" });
    }
  });

export default chatRoutes;
