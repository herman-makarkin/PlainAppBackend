import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import { stream, streamText } from "hono/streaming";
import {
  getChatMessages,
  getChatMessage,
  deleteChatMessage,
  createChatMessage,
} from "./handlers";

const chatMessagesRoutes = new Hono()
  .get("/users/:messageId", async (c) => {
    console.log(c.req.param());
    const { messageId } = c.req.param();
    return c.json(await getChatUsers(Number(messageId)));
  })
  .get("/chats/:chatId", async (c) => {
    const { chatId } = c.req.param();
    const chatMessages = await getChatMessages(Number(chatId));
    console.log(chatMessages);

    return c.json(chatMessages);
  })
  .get("/params/:chatId/:messageId", async (c) => {
    const { chatId, messageId } = c.req.param();
    const chatMessages = await getChatMessage(
      Number(chatId),
      Number(messageId),
    );
    console.log(chatMessages);

    return c.json(chatMessages);
  })
  .put("/new/:chatId/:messageId", async (c) => {
    const { chatId, messageId } = c.req.param();
    createChatMessage({
      chatId: Number(chatId),
      messageId: Number(messageId),
    });

    return c.text("created successfully");
  })
  .delete("/rm/:chatId/:messageId", async (c) => {
    const { chatId, messageId } = c.req.param();
    await deleteChatMessage({
      chatId: Number(chatId),
      messageId: Number(messageId),
    });

    return c.text("removed successfully");
  });

export default chatMessagesRoutes;
