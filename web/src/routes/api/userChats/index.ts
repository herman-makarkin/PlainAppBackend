import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import { stream, streamText } from "hono/streaming";
import {
  getUserChats,
  getChatUsers,
  getUserChat,
  deleteUserChat,
  createUserChat,
} from "./handlers";

const userChatsRoutes = new Hono()
  .get("/users/:chatId", async (c) => {
    console.log(c.req.param());
    const { chatId } = c.req.param();
    return c.json(await getChatUsers(Number(chatId)));
  })
  .get("/chats/:userId", async (c) => {
    const { userId } = c.req.param();
    const userChats = await getUserChats(Number(userId));
    console.log(userChats);

    return c.json(userChats);
  })
  .get("/params/:userId/:chatId", async (c) => {
    const { userId, chatId } = c.req.param();
    const userChats = await getUserChat(Number(userId), Number(chatId));
    console.log(userChats);

    return c.json(userChats);
  })
  .put("/new/:userId/:chatId", async (c) => {
    const { userId, chatId } = c.req.param();
    createUserChat({
      userId: Number(userId),
      chatId: Number(chatId),
    });

    return c.text("created successfully");
  })
  .delete("/rm/:userId/:chatId", async (c) => {
    const { userId, chatId } = c.req.param();
    await deleteUserChat({
      userId: Number(userId),
      chatId: Number(chatId),
    });

    return c.text("removed successfully");
  });

export default userChatsRoutes;
