import { Hono } from "hono";
import userRoutes from "./users";
// import userChatsRoutes from "./userChats";
import chatRoutes from "./chats";
import messageRoutes from "./messages";
import chatMessagesRoutes from "./chatMessages";
import groupRoutes from "./groups";
import { test } from "./test";

export const apiRoutes = new Hono();
apiRoutes.get("/", (c) => c.text("welcome to my api"));
apiRoutes.route("/user", userRoutes);
apiRoutes.route("/group", groupRoutes);
apiRoutes.route("/chat", chatRoutes);
apiRoutes.route("/message", messageRoutes);
// apiRoutes.route("/userChats", userChatsRoutes);
apiRoutes.route("/chatMessages", chatMessagesRoutes);
apiRoutes.route("/test", test);

