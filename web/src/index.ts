import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import { stream, streamText } from "hono/streaming";
import { createBunWebSocket } from "hono/bun";
import { routes } from "./routes";
// import { drizzle } from "drizzle-orm/postgres-js";
// import postgres from "postgres";

// async function main() {
//   const client = postgres(
//     `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@127.0.0.1:${process.env.DB_PORT}/${process.env.DB_NAME}`,
//   );
//   const db = drizzle({ client });
// }

// main();

const users: any = [];

const app = new Hono();

app.get("/", (c) => {
  return c.text("hello111");
});

app.post("/user", async (c) => {
  const { userName, userBio } = await c.req.json();
  const newUser = {
    id: uuidv4(),
    userName,
    userBio,
  };
  users.push(newUser);
  return c.json(newUser);
});

routes(app);
//app.get("/users", async (c) => {
//  return streamText(c, async (stream) => {
//    for (const user of users) {
//      await stream.writeln(JSON.stringify(user));
//      await stream.sleep(1000);
//    }
//  });
//});

// app.get("/user/:id", (c) => {
//   const { id } = c.req.param();
//   const user: any = users.find((user: any) => user.id === id);
//   if (!user) return c.json({ message: "User not found" }, 404);

//   return c.json(user);
// });

// app.put("/user/:id", async (c) => {
//   const { id } = c.req.param();
//   const index = users.findIndex((user) => user.id === id);

//   if (index === -1) {
//     return c.json({ message: "User not found" }, 404);
//   }

//   const { userName, userBio } = await c.req.json();

//   users[index] = { ...users[index], userName, userBio };
//   return c.json(users[index]);
// });

// app.delete("/user/:id", (c) => {
//   const { id } = c.req.param();
//   const users = users.filter((user) => user.id !== id);

//   return c.json({ message: "User deleted" });
// });

export default app;
