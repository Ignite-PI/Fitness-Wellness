// Newsletter tab of the Admin page: list of monthly newsletters + a full editor
// (re-order sections, add/remove/re-order articles, photos, gallery and announcements, upload photos).
(() => {
  const $ = (id) => document.getElementById(id);
  const SECTIONS = { articles: "Highlights (articles)", gallery: "Photo Gallery", trivia: "Trivia Recap", announcements: "Announcements" };
  const DEFAULT_ORDER = Object.keys(SECTIONS);
  const MAX_PX = 1600; // photos are resized to this many pixels on the longest side before upload

  let C;              // AdminCore from admin.js
  let list = [];      // all newsletters
  let draft = null;   // newsletter being edited
  let editingMonth = null;
  const pending = new Map(); // new photo path -> { dataUrl, b64 } (uploaded when you click Save)

  const esc = (s) => C.esc(s ?? "");
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const monthLabel = (m) => { const [y, mo] = m.split("-").map(Number); return new Date(y, mo - 1, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" }); };
  const src = (p) => pending.get(p)?.dataUrl || p;
  const nextMonth = () => {
    const last = list.map((n) => n.month).sort().pop();
    const d = last ? new Date(+last.slice(0, 4), +last.slice(5, 7), 1) : new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  };

  // Path helpers: "articles.0.images" -> draft.articles[0].images
  const getAt = (path) => path.split(".").reduce((o, k) => o?.[k], draft);
  const setAt = (path, v) => {
    const keys = path.split("."), last = keys.pop();
    keys.reduce((o, k) => o[k], draft)[last] = v;
  };

  // ---------- List ----------
  async function init() {
    C = window.AdminCore;
    const text = await C.backend.loadNewsletters().catch(() => null);
    const w = text ? C.parseScript(text) : {};
    list = Array.isArray(w.NEWSLETTERS) ? w.NEWSLETTERS : clone(window.NEWSLETTERS || []);
    renderList();
  }
  document.addEventListener("admin:ready", init);

  function renderList() {
    const sorted = [...list].sort((a, b) => b.month.localeCompare(a.month));
    $("nlList").innerHTML = sorted.map((n) => {
      const photos = (n.gallery || []).length + (n.articles || []).reduce((s, a) => s + (a.images || []).length, 0) + (n.cover ? 1 : 0);
      return `<div class="row" style="--c:${esc(n.theme || "#16a085")}">
        <span class="bar"></span>
        <div>
          <small>${monthLabel(n.month)}</small>
          <h4>${esc(n.headline || "(no headline)")} ${n.sample ? '<span class="chip sched">Sample</span>' : ""}</h4>
          <div class="bq">${(n.articles || []).length} articles · ${photos} photos · ${(n.announcements || []).length} announcements</div>
        </div>
        <div class="actions">
          <a class="btn" href="newsletter.html?month=${n.month}" target="_blank">Preview</a>
          <button class="btn" data-nl-edit="${n.month}">Edit</button>
          <button class="btn icon warn" data-nl-del="${n.month}" title="Delete newsletter">&times;</button>
        </div>
      </div>`;
    }).join("") || `<p class="ed-hint">No newsletters yet. Click "+ New newsletter" to create one.</p>`;
    $("nlList").querySelectorAll("[data-nl-edit]").forEach((b) => b.onclick = () => openEditor(list.find((n) => n.month === b.dataset.nlEdit)));
    $("nlList").querySelectorAll("[data-nl-del]").forEach((b) => b.onclick = async () => {
      const n = list.find((x) => x.month === b.dataset.nlDel);
      if (!confirm(`Delete the ${monthLabel(n.month)} newsletter? This can't be undone.`)) return;
      const old = list;
      list = list.filter((x) => x !== n);
      try { await saveAll(`Delete ${n.month} newsletter`); C.toast(`Deleted the ${monthLabel(n.month)} newsletter.${C.backend.savedMsg}`); }
      catch (e) { list = old; C.toast(e.message); }
      renderList();
    });
  }
  $("nlNew").onclick = () => openEditor(null);

  document.querySelectorAll(".tab").forEach((t) => t.onclick = () => {
    document.querySelectorAll(".tab").forEach((x) => x.classList.toggle("active", x === t));
    ["triviaTab", "nlTab"].forEach((id) => $(id).classList.toggle("hidden", id !== t.dataset.tab));
  });

  // Uploads new photos that are still used, then saves newsletters.js
  async function saveAll(message) {
    const used = new Set(list.flatMap((n) => [n.cover, ...(n.gallery || []).map((g) => g.src), ...(n.articles || []).flatMap((a) => (a.images || []).map((i) => i.src))]));
    for (const [path, p] of pending) {
      if (!used.has(path)) continue;
      $("nlErr").textContent = `Uploading ${path.split("/").pop()}...`;
      await C.backend.uploadImage(path, p.b64);
      pending.delete(path);
    }
    await C.backend.saveNewsletters(list, message);
  }

  // ---------- Photos ----------
  async function preparePhoto(file) {
    const bmp = await createImageBitmap(file).catch(() => null);
    if (!bmp) throw new Error(`${file.name} isn't a supported picture (use JPG or PNG).`);
    const s = Math.min(1, MAX_PX / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s);
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(bmp, 0, 0, c.width, c.height);
    const dataUrl = c.toDataURL("image/jpeg", 0.85);
    const slug = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "photo";
    const path = `images/newsletter/${draft.month}/${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}-${slug}.jpg`;
    pending.set(path, { dataUrl, b64: dataUrl.split(",")[1] });
    return path;
  }

  async function addPhotos(files, target) {
    if (!/^\d{4}-\d{2}$/.test(draft.month || "")) return err("Pick the month first.");
    err("Preparing photos...");
    try {
      for (const f of files) {
        const path = await preparePhoto(f);
        if (target === "cover") draft.cover = path;
        else getAt(target).push({ src: path, caption: "" });
      }
      err("");
    } catch (e) { err(e.message); }
    renderEditor();
  }

  const err = (msg) => { $("nlErr").textContent = msg; };

  // ---------- Editor ----------
  function openEditor(n) {
    editingMonth = n ? n.month : null;
    draft = n ? clone(n) : { month: nextMonth(), headline: "", intro: "", theme: "#16a085", cover: "", articles: [], gallery: [], winners: [], announcements: [] };
    draft.sections ||= [...DEFAULT_ORDER];
    for (const k of ["articles", "gallery", "winners", "announcements"]) draft[k] ||= [];
    $("nlEdTitle").textContent = n ? `Edit newsletter: ${monthLabel(n.month)}` : "New newsletter";
    err("");
    renderEditor();
    $("nlDlg").showModal();
    $("nlEdBody").scrollTop = 0;
  }

  const moveBtns = (arr, i, len, horiz) => `
    <button type="button" class="btn icon" data-move="${arr}" data-i="${i}" data-d="-1" title="Move ${horiz ? "left" : "up"}" ${i === 0 ? "disabled" : ""}>${horiz ? "&larr;" : "&uarr;"}</button>
    <button type="button" class="btn icon" data-move="${arr}" data-i="${i}" data-d="1" title="Move ${horiz ? "right" : "down"}" ${i === len - 1 ? "disabled" : ""}>${horiz ? "&rarr;" : "&darr;"}</button>
    <button type="button" class="btn icon warn" data-del="${arr}" data-i="${i}" title="Remove">&times;</button>`;

  const photoTiles = (arr) => {
    const items = getAt(arr);
    return `<div class="nle-photos">${items.map((p, i) => `
      <div class="nle-photo">
        <img src="${esc(src(p.src))}" alt="" />
        <input data-bind="${arr}.${i}.caption" value="${esc(p.caption)}" placeholder="Caption (optional)" maxlength="80" />
        <div class="nle-tools">${moveBtns(arr, i, items.length, true)}</div>
      </div>`).join("")}
      <label class="nle-add-photo">+ Add photos<input type="file" accept="image/*" multiple data-add-photos="${arr}" hidden /></label>
    </div>`;
  };

  function renderEditor() {
    const d = draft;
    const order = d.sections;
    const all = [...order, ...DEFAULT_ORDER.filter((k) => !order.includes(k))];
    $("nlEdBody").innerHTML = `
      <h4>Basics</h4>
      <div class="ed-grid">
        <label>Month<input type="month" data-bind="month" value="${esc(d.month)}" required /></label>
        <label>Theme color<input type="color" data-bind="theme" value="${esc(d.theme || "#16a085")}" /></label>
        <label class="full">Headline<input data-bind="headline" value="${esc(d.headline)}" maxlength="80" placeholder="e.g. Fall Into Wellness" /></label>
        <label class="full">Intro<textarea data-bind="intro" rows="3" placeholder="A short welcome message. Leave a blank line to start a new paragraph.">${esc(d.intro)}</textarea></label>
        <label class="nle-check full"><input type="checkbox" data-bind="sample" ${d.sample ? "checked" : ""} /> Show the "sample content" banner</label>
      </div>

      <h4>Cover photo</h4>
      <div class="nle-cover">
        ${d.cover ? `<img src="${esc(src(d.cover))}" alt="" /><button type="button" class="btn warn" data-act="del-cover">Remove cover</button>` : ""}
        <label class="btn">${d.cover ? "Replace" : "+ Add cover photo"}<input type="file" accept="image/*" data-add-photos="cover" hidden /></label>
      </div>

      <h4>Section order</h4>
      <p class="ed-hint">Use the arrows to change the order on the page and in the email image. Uncheck a section to hide it.</p>
      <div class="nle-sections">${all.map((k, i) => `
        <div class="nle-sec">
          <label class="nle-check"><input type="checkbox" data-sec="${k}" ${order.includes(k) ? "checked" : ""} /> ${SECTIONS[k]}</label>
          <span>
            <button type="button" class="btn icon" data-sec-move="${i}" data-d="-1" ${i === 0 ? "disabled" : ""}>&uarr;</button>
            <button type="button" class="btn icon" data-sec-move="${i}" data-d="1" ${i === all.length - 1 ? "disabled" : ""}>&darr;</button>
          </span>
        </div>`).join("")}
      </div>

      <h4>Highlights (articles)</h4>
      <p class="ed-hint">Each article can have up to 3 photos on the page. Wrap words in <code>&lt;b&gt;...&lt;/b&gt;</code> to highlight them.</p>
      ${d.articles.map((a, i) => `
        <div class="nle-card">
          <div class="nle-card-head"><b>Article ${i + 1}</b><span>${moveBtns("articles", i, d.articles.length)}</span></div>
          <label>Title<input data-bind="articles.${i}.title" value="${esc(a.title)}" maxlength="100" /></label>
          <label>Text<textarea data-bind="articles.${i}.text" rows="4">${esc(a.text)}</textarea></label>
          <label>Photos</label>
          ${photoTiles(`articles.${i}.images`)}
        </div>`).join("")}
      <button type="button" class="btn nle-add" data-act="add-article">+ Add article</button>

      <h4>Photo gallery</h4>
      <p class="ed-hint">All photos show on the page; the first 6 appear in the email image.</p>
      ${photoTiles("gallery")}

      <h4>Top scorers</h4>
      <div class="nle-winners">${[0, 1, 2].map((i) => `
        <div><b>#${i + 1}</b>
          <input data-win="${i}" data-field="name" value="${esc(d.winners[i]?.name)}" placeholder="Name" maxlength="60" />
          <input data-win="${i}" data-field="points" type="number" min="0" value="${esc(d.winners[i]?.points)}" placeholder="Points" />
        </div>`).join("")}
      </div>
      <button type="button" class="btn res" data-act="fill-winners">Fill from Leaderboard (this month)</button>

      <h4>Announcements</h4>
      ${d.announcements.map((a, i) => `
        <div class="nle-card nle-ann">
          <div class="nle-card-head"><b>Announcement ${i + 1}</b><span>${moveBtns("announcements", i, d.announcements.length)}</span></div>
          <div class="ed-grid">
            <label>Date<input type="date" data-bind="announcements.${i}.date" value="${esc(a.date)}" /></label>
            <label>Title<input data-bind="announcements.${i}.title" value="${esc(a.title)}" maxlength="80" /></label>
            <label class="full">Details<input data-bind="announcements.${i}.text" value="${esc(a.text)}" maxlength="200" /></label>
          </div>
        </div>`).join("")}
      <button type="button" class="btn nle-add" data-act="add-ann">+ Add announcement</button>`;
  }

  // One set of listeners for everything inside the editor
  $("nlEdBody").addEventListener("input", (e) => {
    const t = e.target;
    if (t.dataset.bind) setAt(t.dataset.bind, t.type === "checkbox" ? t.checked : t.value);
    if (t.dataset.win !== undefined) {
      const w = (draft.winners[+t.dataset.win] ||= { name: "", points: 0 });
      w[t.dataset.field] = t.dataset.field === "points" ? Number(t.value) || 0 : t.value;
    }
  });

  $("nlEdBody").addEventListener("change", (e) => {
    const t = e.target;
    if (t.dataset.addPhotos && t.files.length) addPhotos([...t.files], t.dataset.addPhotos);
    if (t.dataset.sec) {
      const all = [...draft.sections, ...DEFAULT_ORDER.filter((k) => !draft.sections.includes(k))];
      const on = new Set(draft.sections);
      t.checked ? on.add(t.dataset.sec) : on.delete(t.dataset.sec);
      draft.sections = all.filter((k) => on.has(k));
      renderEditor();
    }
  });

  $("nlEdBody").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    const d = draft;
    if (b.dataset.move) {
      const arr = getAt(b.dataset.move), i = +b.dataset.i, j = i + +b.dataset.d;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    } else if (b.dataset.del) {
      getAt(b.dataset.del).splice(+b.dataset.i, 1);
    } else if (b.dataset.secMove !== undefined) {
      const all = [...d.sections, ...DEFAULT_ORDER.filter((k) => !d.sections.includes(k))];
      const i = +b.dataset.secMove, j = i + +b.dataset.d;
      [all[i], all[j]] = [all[j], all[i]];
      d.sections = all.filter((k) => d.sections.includes(k));
    } else if (b.dataset.act === "add-article") {
      d.articles.push({ title: "", text: "", images: [] });
    } else if (b.dataset.act === "add-ann") {
      d.announcements.push({ date: `${d.month}-01`, title: "", text: "" });
    } else if (b.dataset.act === "del-cover") {
      d.cover = "";
    } else if (b.dataset.act === "fill-winners") {
      const rows = C.leaderboardFor(d.month);
      if (!rows) return err("Import the Forms results on the Trivia tab first.");
      if (!rows.length) return err(`No revealed trivia answers for ${monthLabel(d.month)} yet.`);
      d.winners = rows.slice(0, 3).map((r) => ({ name: r.name, points: r.points }));
      err("");
    } else return;
    renderEditor();
  });

  // Drops empty articles, announcements and winners before saving
  function cleanDraft() {
    const d = clone(draft);
    d.headline = d.headline.trim();
    d.articles = d.articles.filter((a) => a.title.trim() || a.text.trim() || a.images.length);
    d.announcements = d.announcements.filter((a) => a.title.trim() || a.text.trim());
    d.winners = d.winners.filter((w) => w && String(w.name || "").trim());
    if (!d.cover) delete d.cover;
    if (!d.sample) delete d.sample;
    return d;
  }

  $("nlForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const d = cleanDraft();
    if (!/^\d{4}-\d{2}$/.test(d.month)) return err("Please pick a month.");
    if (!d.headline) return err("Please enter a headline.");
    if (list.some((n) => n.month === d.month && n.month !== editingMonth)) return err(`There's already a newsletter for ${monthLabel(d.month)}.`);
    const old = list;
    list = [...list.filter((n) => n.month !== editingMonth), d].sort((a, b) => a.month.localeCompare(b.month));
    $("nlSave").disabled = true;
    try {
      await saveAll(`${editingMonth ? "Update" : "Add"} ${d.month} newsletter`);
      err("");
      $("nlDlg").close();
      renderList();
      C.toast(`Saved the ${monthLabel(d.month)} newsletter.${C.backend.savedMsg}`);
    } catch (ex) {
      list = old;
      err(ex.message);
    }
    $("nlSave").disabled = false;
  });

  $("nlCancel").onclick = () => $("nlDlg").close();
  $("nlClose").onclick = () => $("nlDlg").close();
})();
