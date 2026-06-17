# Live editing (edit locally → see it on the live URL after a refresh)

Content is no longer baked into the deployed files. It lives in **Netlify Blobs**
and is served by a serverless function at **`/api/content`**:

- Every page load (live site **and** localhost) fetches the content from that API.
- The on-page editor (localhost only) **POSTs** your edits back to that API.
- Refresh the live Netlify URL → it re-fetches → your change appears. **No redeploy.**

`content.js` is now only the **fallback/default** content (used before anything has
been saved, or if the API is unreachable). You never have to edit it by hand.

---

## One-time setup

### 1. Deploy the new files
Commit and push these new/changed files, and let Netlify deploy:

```
netlify.toml
package.json
netlify/functions/content.mjs
boot.js
index.html        (updated script tags)
render.js         (updated)
editor.js         (updated)
```

Netlify will install `@netlify/blobs` (from `package.json`) automatically.
Netlify Blobs needs no setup — it's enabled by default for the site.

### 2. Set your edit password
In the Netlify dashboard: **Site configuration → Environment variables → Add a variable**

- Key: `EDIT_TOKEN`
- Value: a long secret of your choice (this is the password the editor will ask for)

Then **redeploy once** (Deploys → Trigger deploy) so the function picks up the variable.

### 3. (Optional) Bake your live URL into boot.js
Open `boot.js` and replace `https://jolly-cajeta-526c66.netlify.app` with your real URL.
If you skip this, the editor will ask for the URL the first time you save and remember it.

---

## Editing day-to-day

1. Run the site locally from this folder, e.g.:
   - `python -m http.server 8000`  → open http://localhost:8000
   - or the VS Code **Live Server** extension
   (Use a local server, not `file://`, so the page can call the API.)
2. Click **✏️ Edit** (the button only appears on localhost), change any text, swap the photo.
3. Click **✓ Done** (or **💾 Save to live site**).
   - First time only: enter your **live Netlify URL** and your **EDIT_TOKEN**.
   - They're remembered in your browser after that.
4. Open (or refresh) your live Netlify URL → the changes are there.

## Notes
- The editor is hidden on the live site, so visitors can't edit. Writes also require
  the `EDIT_TOKEN`, so even someone hitting the API directly can't change your content.
- The password/URL are stored in your browser's localStorage on your machine only.
- To verify the API quickly: open `https://jolly-cajeta-526c66.netlify.app/api/content` in a
  browser — it returns the stored content as JSON (or `{"content":null}` before the
  first save).
