import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
    "/api/*",
    cors({
        origin: "http://localhost:5173"
    })
);

app.get("/api/earth", async (c) => {

    try {

        const url = new URL(
            "https://ssd.jpl.nasa.gov/api/horizons.api"
        );

        url.searchParams.set("format", "json");
        url.searchParams.set("COMMAND", "'399'");
        url.searchParams.set("OBJ_DATA", "NO");
        url.searchParams.set("MAKE_EPHEM", "YES");
        url.searchParams.set("EPHEM_TYPE", "VECTORS");
        url.searchParams.set("CENTER", "500@10");
        url.searchParams.set("START_TIME", "'2026-08-26'");
        url.searchParams.set("STOP_TIME", "'2026-08-27'");
        url.searchParams.set("STEP_SIZE", "'1 d'");
        url.searchParams.set("CSV_FORMAT", "YES");
        url.searchParams.set("OUT_UNITS", "AU-D");

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                `NASA returned ${response.status}`
            );
        }

        const data = await response.json();

        const resultText = data.result;
        const soeIndex = resultText.indexOf("$SOE");
        const eoeIndex = resultText.indexOf("$EOE");
        if (soeIndex === -1 || eoeIndex === -1) {
            throw new Error("Could not find NASA data");
        }

        const tableText = resultText
            .substring(soeIndex + 4, eoeIndex)
            .trim();

        const line = tableText.split("\n");
        if (line.length > 0) {
            const parts = line[0].split(',').map((s: string) => s.trim());
            if (parts.length >= 8) {
            const x = parseFloat(parts[2]);
            const y = parseFloat(parts[3]);
            const z = parseFloat(parts[4]);
            const vx = parseFloat(parts[5]);
            const vy = parseFloat(parts[6]);
            const vz = parseFloat(parts[7]);
            if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
                return c.json({ x, y, z, vx, vy, vz, source: "nasa-horizons-api" });
            }
            }
        }

    } catch (error) {

        console.error(error);

        return c.json(
            { error: "Failed to fetch NASA data" },
            500
        );
    }
});

serve({
    fetch: app.fetch,
    port: 3001
});

console.log("Hono running on http://localhost:3001");