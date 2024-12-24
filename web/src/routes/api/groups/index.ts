import { Hono } from "hono";
import {
  getGroups,
  getGroup,
  updateGroup,
  createGroup,
  deleteGroup,
  addUser,
  removeUser,
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
  .patch("/update/:id", async (c) => {
    const json = await c.req.json();
    try {
      const { id } = c.req.param();
      const { name, description, metadata } = json;
        return c.json(await updateGroup(Number(id), { name, description, metadata }));
    } catch (error) {
      console.log(error);
      return c.json({ error: "Invalid data" });
    }
  })
  .delete("/rmUser/:groupId/:userId", async (c) => {
    const { groupId, userId } = c.req.param();
    return c.json(removeUser(Number(userId), Number(groupId)));
  })
  .post("/addUser/:groupId/:userId", async (c) => {
    const { groupId, userId } = c.req.param();
    return c.json(addUser(Number(userId), Number(groupId)));
  })
  .put("/new", async (c) => {
    const json = await c.req.json();
    try {
      const { name, description, metadata } = json;
        return c.json(await createGroup({name, description}));
    } catch (error) {
      console.log(error);
      return c.json({ error: "Invalid data" });
    }
  });

export default chatRoutes;
