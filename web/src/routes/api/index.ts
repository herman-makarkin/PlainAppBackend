import { Hono } from "hono";
import userRoutes from "./users";
import userChatsRoutes from "./userChats";
import chatRoutes from "./userChats";

export const apiRoutes = new Hono();
apiRoutes.get("/", (c) => c.text("welcome to my api"));
apiRoutes.route("/user", userRoutes);
apiRoutes.route("/chat", chatRoutes);
apiRoutes.route("/userChats", userChatsRoutes);
apiRoutes.route("/u/:id", userChatsRoutes);
