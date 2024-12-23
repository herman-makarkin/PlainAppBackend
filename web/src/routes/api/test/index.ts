import { Hono } from "hono";

export const test = new Hono()
  .post("/", async (c) => {
    console.log(c.req);
    // if (c.req.raw) console.log(c.req.raw, 'raw');
    // else console.log("no body");

    const req = await c.req.json();

    console.log(req, 'req123');

    return c.json({ message: "ok123", gay: JSON.stringify(req) });
  })


