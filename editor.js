/* ============================================================
   ON-PAGE EDITOR
   Adds an "Edit" button so you can change text right on the
   website. You normally never need to touch this file.
   ============================================================ */

(function () {
  // Only show the editor when running locally (localhost, 127.0.0.1, or
  // opening the file directly). On a live host (e.g. Netlify) it stays hidden.
  const host = location.hostname;
  const isLocal =
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "" ||            // opened as a file:// path
    host === "::1";
  if (!isLocal) return;

  const C = window.SITE_CONTENT;
  if (!C) return;

  // Text that is animated and can't be edited live.
  const SKIP = new Set(["heroSubtitle"]);

  let editing = false;

  // ---------- helpers ----------
  function editableEls() {
    return document.querySelectorAll("[data-edit]");
  }

  function setByPath(obj, path, value) {
    const parts = path.split(".");
    let o = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      const key = parts[i];
      if (o[key] == null) o[key] = /^\d+$/.test(parts[i + 1]) ? [] : {};
      o = o[key];
    }
    o[parts[parts.length - 1]] = value;
  }

  function onInput(e) {
    const el = e.currentTarget;
    setByPath(C, el.getAttribute("data-edit"), el.innerHTML.trim());
  }

  // The auto-typing words (heroRoles) are edited as one line separated by "|".
  function onRolesInput(e) {
    C.heroRoles = e.currentTarget.textContent
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function rolesEditStart() {
    window.__editorPaused = true; // tells script.js to pause the animation
    const sub = document.querySelector(".hero-subtitle");
    if (!sub) return;
    sub.textContent = (C.heroRoles || []).join("  |  ");
    sub.setAttribute("contenteditable", "true");
    sub.setAttribute("data-edit", "heroRoles");
    sub.title = "These words auto-type one after another. Separate each with  |";
    sub.addEventListener("input", onRolesInput);
  }

  function rolesEditStop() {
    const sub = document.querySelector(".hero-subtitle");
    if (sub) {
      sub.removeAttribute("contenteditable");
      sub.removeEventListener("input", onRolesInput);
      sub.setAttribute("data-edit", "heroSubtitle"); // restore normal marker
    }
    window.__editorPaused = false; // resume the animation with the new words
  }

  function preventLinkClicks(e) {
    const a = e.target.closest("a");
    if (a) e.preventDefault();
  }

  // ---------- profile photo ----------
  // Shrinks the chosen image so it doesn't bloat content.js, then returns it
  // as a data URL that can be stored directly in the file.
  function compressImage(file, max, quality) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error("Could not read that image."));
        img.onload = () => {
          let { width, height } = img;
          if (width > height && width > max) {
            height = Math.round((height * max) / width);
            width = max;
          } else if (height > max) {
            width = Math.round((width * max) / height);
            height = max;
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          canvas.getContext("2d").drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  async function onImageChosen(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const dataUrl = await compressImage(file, 512, 0.85);
      C.heroImage = dataUrl;
      const img = document.getElementById("profileImg");
      if (img) img.src = dataUrl;
      toast("🖼️ Photo updated — click ✓ Done to save it.");
    } catch (err) {
      toast("⚠️ " + (err && err.message ? err.message : "Could not load image."));
    }
  }

  function pickImage() {
    let input = document.getElementById("siteImgInput");
    if (!input) {
      input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.id = "siteImgInput";
      input.style.display = "none";
      input.addEventListener("change", onImageChosen);
      document.body.appendChild(input);
    }
    input.value = "";
    input.click();
  }

  // ---------- enable / disable ----------
  function enable() {
    editing = true;
    document.body.classList.add("is-editing");
    editableEls().forEach((el) => {
      if (SKIP.has(el.getAttribute("data-edit"))) return;
      el.setAttribute("contenteditable", "true");
      el.addEventListener("input", onInput);
    });
    document.addEventListener("click", preventLinkClicks, true);
    rolesEditStart();
    updateButtons();
  }

  function disable() {
    editing = false;
    document.body.classList.remove("is-editing");
    rolesEditStop();
    editableEls().forEach((el) => {
      el.removeAttribute("contenteditable");
      el.removeEventListener("input", onInput);
    });
    document.removeEventListener("click", preventLinkClicks, true);
    updateButtons();
    // Clicking "Done" pushes your changes to the live site.
    saveToApi();
  }

  // ---------- save to the live site (Netlify Function + Blobs) ----------

  // The live site URL + edit password are remembered in localStorage so you
  // only enter them once. boot.js reads "siteApiBase" to load live content.
  const API_BASE_KEY = "siteApiBase";
  const TOKEN_KEY = "siteEditToken";

  function getApiUrl() {
    // boot.js already worked out where the API lives.
    if (window.__SITE_API && window.__SITE_API.configured) {
      return window.__SITE_API.url;
    }
    // Not configured yet — ask for the live Netlify URL once.
    let base = localStorage.getItem(API_BASE_KEY) || "";
    if (!base || base.includes("YOUR-SITE")) {
      base = window.prompt(
        "Enter your LIVE Netlify site URL (e.g. https://sunny-halva-7c1b2c.netlify.app):",
        "https://"
      );
      if (!base) return null;
      base = base.trim().replace(/\/+$/, "");
      localStorage.setItem(API_BASE_KEY, base);
    }
    // On the live site the API is same-origin; locally it's the live URL.
    const local =
      location.hostname === "localhost" ||
      location.hostname === "127.0.0.1" ||
      location.hostname === "" ||
      location.hostname === "::1";
    return (local ? base : "") + "/api/content";
  }

  function getToken() {
    let token = localStorage.getItem(TOKEN_KEY) || "";
    if (!token) {
      token = window.prompt("Enter your edit password (the EDIT_TOKEN you set in Netlify):", "");
      if (!token) return null;
      token = token.trim();
      localStorage.setItem(TOKEN_KEY, token);
    }
    return token;
  }

  // Sends the whole content object to the live site. After this, refreshing
  // the live URL shows your changes — no redeploy needed.
  async function saveToApi() {
    const url = getApiUrl();
    if (!url) { toast("⚠️ No live site URL set — save cancelled."); return; }
    const token = getToken();
    if (!token) { toast("⚠️ No edit password entered — save cancelled."); return; }

    toast("⏳ Saving to the live site…");
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ content: C }),
      });
      if (res.status === 401) {
        localStorage.removeItem(TOKEN_KEY); // wrong password — ask again next time
        toast("⚠️ Wrong edit password. Click Save to try again.");
        return;
      }
      if (!res.ok) {
        let msg = res.status + "";
        try { msg = (await res.json()).error || msg; } catch (e) {}
        toast("⚠️ Save failed: " + msg);
        return;
      }
      toast("✅ Saved to the live site — refresh your Netlify URL to see it.");
    } catch (e) {
      toast("⚠️ Could not reach the live site: " + (e && e.message ? e.message : e));
    }
  }

  function reset() {
    if (!confirm("Reload and pull the current live content again?")) return;
    location.reload();
  }

  // ---------- toolbar UI ----------
  const bar = document.createElement("div");
  bar.id = "siteEditBar";
  bar.innerHTML = `
    <button type="button" data-act="toggle" class="sb-btn sb-primary">✏️ Edit</button>
    <button type="button" data-act="save" class="sb-btn sb-hide">💾 Save to live site</button>
    <button type="button" data-act="reset" class="sb-btn sb-ghost sb-hide">↺ Reload</button>
    <span class="sb-hint sb-hide">Click any text to edit it</span>
  `;

  const style = document.createElement("style");
  style.textContent = `
    #siteEditBar {
      position: fixed; left: 16px; bottom: 16px; z-index: 100000;
      display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
      max-width: calc(100vw - 32px);
      font-family: Inter, system-ui, sans-serif;
    }
    #siteEditBar .sb-btn {
      cursor: pointer; border: none; border-radius: 999px;
      padding: 10px 16px; font-size: 14px; font-weight: 600;
      box-shadow: 0 6px 16px rgba(0,0,0,.18); color: #fff;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    #siteEditBar .sb-ghost { background: #64748b; }
    #siteEditBar .sb-btn:hover { filter: brightness(1.07); }
    #siteEditBar .sb-hide { display: none; }
    #siteEditBar .sb-hint {
      background: #111827; color: #fff; padding: 6px 12px;
      border-radius: 999px; font-size: 12px; opacity: .85;
    }
    body.is-editing [data-edit] {
      outline: 2px dashed #667eea; outline-offset: 3px;
      border-radius: 4px; cursor: text;
    }
    body.is-editing [data-edit]:hover { background: rgba(102,126,234,.08); }
    #siteEditToast {
      position: fixed; left: 50%; bottom: 80px; transform: translateX(-50%);
      background: #111827; color: #fff; padding: 12px 18px; border-radius: 10px;
      font-family: Inter, system-ui, sans-serif; font-size: 14px; z-index: 100001;
      box-shadow: 0 10px 24px rgba(0,0,0,.25); max-width: 90vw; text-align: center;
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(bar);

  // "Change photo" button over the profile image (CSS shows it only while editing).
  (function addChangePhotoButton() {
    const host = document.querySelector(".image-placeholder");
    if (!host) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "change-photo-btn";
    btn.textContent = "📷 Change photo";
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      pickImage();
    });
    host.appendChild(btn);
  })();

  function updateButtons() {
    const toggleBtn = bar.querySelector('[data-act="toggle"]');
    toggleBtn.textContent = editing ? "✓ Done" : "✏️ Edit";
    bar.querySelectorAll('[data-act="save"], [data-act="reset"], .sb-hint')
      .forEach((el) => { el.style.display = editing ? "" : "none"; });
  }

  bar.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const act = btn.getAttribute("data-act");
    if (act === "toggle") editing ? disable() : enable();
    else if (act === "save") saveToApi();
    else if (act === "reset") reset();
  });

  // ---------- toast ----------
  let toastTimer;
  function toast(msg) {
    let t = document.getElementById("siteEditToast");
    if (!t) {
      t = document.createElement("div");
      t.id = "siteEditToast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.display = "block";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.style.display = "none"; }, 4000);
  }
})();
