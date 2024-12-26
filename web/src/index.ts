import { Hono } from "hono";
import { apiRoutes } from "./routes/api";
import { createBunWebSocket } from "hono/bun";
import type { ServerWebSocket } from 'bun';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { onConnection } from "./routes/api";

// const app = new Hono();
// const httpServer = createServer(app.fetch);
const io = new Server(3000, {});

// console.log(httpServer);

io.on('connection', onConnection);

// app.get("/", (c) => {
//   return c.text("hello!");
// });

// app.route("/api", apiRoutes);

// export default app;
export {io};
