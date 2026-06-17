/* ============================================================
   CONTENT API  (Netlify Function v2)
   Route: /api/content

   GET   -> returns the live site content stored in Netlify Blobs
            (or { content: null } if nothing has been saved yet).
   POST  -> saves new content. Requires an Authorization header
            matching the EDIT_TOKEN environment variable.

   The content is the SAME object shape as window.SITE_CONTENT.
   ============================================================ */

import { getStore } from "@netlify/blobs";

const STORE_NAME = "site-content";
const KEY = "content";

// Allow the page to call this from the live site AND from localhost
// (so you can edit locally and have it land in the real store).
function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  });
}

export default async (req) => {
  const origin = req.headers.get("origin");

  // Preflight for cross-origin POST from localhost.
  if (req.method === "OPTIONS") {
    return new Response("", { status: 204, headers: corsHeaders(origin) });
  }

  const store = getStore(STORE_NAME);

  // ---- read current content ----
  if (req.method === "GET") {
    const data = await store.get(KEY); // string | null
    if (!data) return json({ content: null }, 200, origin);
    try {
      return json({ content: JSON.parse(data) }, 200, origin);
    } catch {
      // Stored value somehow corrupt; behave as "nothing saved yet".
      return json({ content: null }, 200, origin);
    }
  }

  // ---- save new content ----
  if (req.method === "POST") {
    const expected = process.env.EDIT_TOKEN;
    if (!expected) {
      return json(
        { error: "Server not configured: set the EDIT_TOKEN environment variable in Netlify." },
        500,
        origin
      );
    }

    const auth = req.headers.get("authorization") || "";
    const token = auth.replace(/^Bearer\s+/i, "").trim();
    if (token !== expected) {
      return json({ error: "Unauthorized — wrong edit password." }, 401, origin);
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON body." }, 400, origin);
    }

    if (!body || typeof body !== "object" || !body.content || typeof body.content !== "object") {
      return json({ error: "Body must be { content: {...} }." }, 400, origin);
    }

    await store.set(KEY, JSON.stringify(body.content));
    return json({ ok: true }, 200, origin);
  }

  return json({ error: "Method not allowed." }, 405, origin);
};

export const config = { path: "/api/content" };
