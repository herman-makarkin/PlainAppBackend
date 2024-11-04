import { Hono } from "hono";
import userRoutes from "./users";
import userChatsRoutes from "./userChats";
import chatRoutes from "./chats";
import messageRoutes from "./messages";
import chatMessagesRoutes from "./chatMessages";

export const apiRoutes = new Hono();
apiRoutes.get("/", (c) => c.text("welcome to my api"));
apiRoutes.route("/user", userRoutes);
apiRoutes.route("/chat", chatRoutes);
apiRoutes.route("/message", messageRoutes);
apiRoutes.route("/userChats", userChatsRoutes);
apiRoutes.route("/chatMessages", chatMessagesRoutes);
