import { Hono } from "hono";
import userRoutes from "./users";
import userChatsRoutes from "./userChats";

export const apiRoutes = new Hono();
apiRoutes.get("/", (c) => c.text("welcome to my api"));
apiRoutes.route("/users", userRoutes);
apiRoutes.route("/userChats", userChatsRoutes);
