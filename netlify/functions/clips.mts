// Serves the latest clips JSON to the site at /api/clips.
import type { Config, Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

export default async (req: Request, context: Context) => {
  const store = getStore("clips");
  const data = await store.get("latest", { type: "json" });
  if (!data) {
    return new Response(JSON.stringify({ error: "no-data" }), {
      status: 404,
      headers: { "content-type": "application/json" }
    });
  }
  return new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json",
      "cache-control": "public, max-age=300"
    }
  });
};

export const config: Config = {
  path: "/api/clips"
};
