import { Hono } from "hono";
import userRoutes from "./users";

export const routes = (app: Hono) => {
  app.route("/users", userRoutes);
};
