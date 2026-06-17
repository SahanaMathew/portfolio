/* ============================================================
   BOOT — loads the LIVE content before rendering the page.

   Flow:
   1. content.js has already run and set a DEFAULT window.SITE_CONTENT.
   2. We fetch the live content from /api/content and, if present,
      replace the defaults with it.
   3. Only then do we load render.js, script.js and editor.js.

   - On the live Netlify site the API is same-origin (/api/content).
   - On localhost we talk to the DEPLOYED site, so the content you see
     (and edit) is the real, live content. The live site URL is stored
     in localStorage under "siteApiBase" (the editor sets it the first
     time you save).
   ============================================================ */

(function () {
  const host = location.hostname;
  const isLocal =
    host === "localhost" || host === "127.0.0.1" || host === "" || host === "::1";

  // Fill this in with your Netlify URL, OR leave it — the editor will ask
  // for it on your first save and remember it in localStorage.
  const DEFAULT_PROD_BASE = "https://jolly-cajeta-526c66.netlify.app";

  const prodBase = (localStorage.getItem("siteApiBase") || DEFAULT_PROD_BASE).replace(/\/+$/, "");
  const configured = prodBase && !prodBase.includes("YOUR-SITE");

  // Same-origin on the live site; the live site's API when running locally.
  const apiBase = isLocal ? prodBase : "";
  const apiUrl = apiBase + "/api/content";

  // Expose for editor.js so it posts to the same place.
  window.__SITE_API = { url: apiUrl, base: apiBase, isLocal, configured };

  function loadScript(src) {
    return new Promise((resolve) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = resolve; // never block the page on a missing optional script
      document.body.appendChild(s);
    });
  }

  async function fetchLiveContent() {
    // Locally we can only fetch if we know the live URL.
    if (isLocal && !configured) return;
    try {
      const res = await fetch(apiUrl, { method: "GET", cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      if (json && json.content && typeof json.content === "object") {
        window.SITE_CONTENT = json.content;
      }
    } catch (e) {
      /* Offline, not deployed, or CORS — fall back to bundled defaults. */
    }
  }

  async function boot() {
    await fetchLiveContent();
    await loadScript("render.js");
    await loadScript("script.js");
    await loadScript("editor.js");
  }

  boot();
})();
