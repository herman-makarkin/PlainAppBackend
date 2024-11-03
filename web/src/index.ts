import { Hono } from "hono";
import { apiRoutes } from "./routes/api";

const app = new Hono();

app.get("/", (c) => {
  return c.text("hello!");
});

app.route("/api", apiRoutes);

export default app;
