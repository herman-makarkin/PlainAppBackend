import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import { stream, streamText } from "hono/streaming";

const userRoutes = new Hono();

userRoutes.get("/", () => "hello");
userRoutes.get("/user/:id", () => "find by id");
userRoutes.post("/", () => "this is post");

export default userRoutes;
