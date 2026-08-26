import { Hono } from "hono";
import { serve } from "@hono/node-server";

const app = new Hono();

// CORS middleware (simple version)
app.use("*", async (c, next) => {
  c.header("Access-Control-Allow-Origin", "*");
  c.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type");
  await next();
});

// your first real API
app.get("/api/planets", (c) => {
  return c.json({
    time: Date.now(),
    timeScale: 1.0, 

    planets: [
      { name: "earth", color: 0x1e90ff, orbitRadius: 4, orbitSpeed: 0.01, size: 1 },
      { name: "mars", color: 0xff5533, orbitRadius: 6, orbitSpeed: 0.008, size: 0.8 },
      { name: "venus", color: 0xffcc66, orbitRadius: 3, orbitSpeed: 0.013, size: 0.9 },
    ],
  });
});

serve({
  fetch: app.fetch,
  port: 8787,
});


console.log("API running on http://localhost:8787");