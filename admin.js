(() => {
  const $ = (id) => document.getElementById(id);
  const letters = ["A", "B", "C", "D"];
  const MAX_FACTS = 8;
  const PW_KEY = "trivia-admin-pw";
  const parseDate = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const fmtDate = (s) => parseDate(s).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const sortIssues = (list) => [...list].sort((a, b) => parseDate(a.publish) - parseDate(b.publish));
  const clone = (o) => JSON.parse(JSON.stringify(o));

  let issues = sortIssues(window.ISSUES);
  let siteUrl = window.SITE_URL || "";
  let tips = window.TIPS || [];
  let released = [];

  function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove("show"), 3200);
  }

  const secret = () => sessionStorage.getItem(PW_KEY) || "";

  // Runs data.js text in isolation and returns what it assigns to window
  function parseDataJs(text) {
    const w = {};
    new Function("window", text)(w);
    return w;
  }

  // Keep in sync with render_data_js() in server.py
  const dataJs = () =>
    `// Weekly Trivia content. Managed from the Admin page (admin.html); you can also edit it by hand.
// - Issues go live when you click "Release" on the Admin page. \`publish\` is the planned date.
// - The bonus answer of an issue is revealed when the NEXT issue is released.
// - Up to 8 fun facts per issue. Use <b>...</b> to highlight words.
// - Each fact's picture comes from \`icon\` (or \`tag\` if no icon is set) in icons.js.
window.ISSUES = ${JSON.stringify(issues, null, 2)};

window.SITE_URL = ${JSON.stringify(siteUrl)};

window.TIPS = ${JSON.stringify(tips)};
`;

  // ---------- Backends ----------
  // Local mode: server.py stores files and checks the admin password
  const localBackend = {
    async call(body) {
      const res = await fetch("api/releases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: secret(), ...body })
      }).catch(() => null);
      if (!res) throw new Error("Can't reach the server. Make sure it's running with: python server.py");
      if (res.status === 404 || res.status === 501) throw new Error("The release server isn't running. Start it with: python server.py");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Request failed");
      return data;
    },
    verify() { return this.call({}); },
    async load() {
      const res = await fetch("releases.json?t=" + Date.now(), { cache: "no-store" });
      return (await res.json()).released || [];
    },
    save(list) { return this.call({ released: list }); },
    async loadData() {
      const res = await fetch("data.js?t=" + Date.now(), { cache: "no-store" });
      return res.text();
    },
    saveData() { return this.call({ data: { issues, siteUrl, tips } }); },
    savedMsg: ""
  };

  // GitHub Pages mode: files are updated in the repo through the GitHub API using the admin's token
  const ghRepo = location.hostname.endsWith(".github.io")
    ? `${location.hostname.split(".")[0]}/${location.pathname.split("/")[1]}` : null;
  const ghSha = {};
  const toB64 = (text) => {
    const bytes = new TextEncoder().encode(text);
    let bin = "";
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  };
  const fromB64 = (b64) => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\n/g, "")), (c) => c.charCodeAt(0)));
  const ghBackend = {
    async req(path, opts = {}) {
      const res = await fetch(`https://api.github.com/repos/${ghRepo}${path}`, {
        ...opts,
        headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${secret()}`, ...opts.headers }
      });
      if (res.status === 401) throw new Error("Invalid GitHub token.");
      return res;
    },
    async verify() {
      const res = await this.req("");
      const repo = await res.json();
      if (!res.ok) throw new Error(`Can't access ${ghRepo} with this token.`);
      if (!repo.permissions?.push) throw new Error("This token can't edit the repo. Give it Contents: Read and write access.");
    },
    async getFile(name) {
      const res = await this.req(`/contents/${name}?t=${Date.now()}`);
      if (res.status === 404) { ghSha[name] = null; return null; }
      const file = await res.json();
      ghSha[name] = file.sha;
      return fromB64(file.content);
    },
    async putFile(name, text, message) {
      const res = await this.req(`/contents/${name}`, {
        method: "PUT",
        body: JSON.stringify({ message, content: toB64(text), ...(ghSha[name] ? { sha: ghSha[name] } : {}) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(res.status === 409 ? `${name} changed elsewhere. Reload the page and try again.` : data.message || "GitHub update failed");
      ghSha[name] = data.content.sha;
    },
    async load() {
      const text = await this.getFile("releases.json");
      return text ? JSON.parse(text).released || [] : issues.filter((i) => parseDate(i.publish) <= new Date()).map((i) => i.id);
    },
    save(list) {
      return this.putFile("releases.json", JSON.stringify({ released: list }, null, 2) + "\n", `Update releases: ${list[list.length - 1] || "none"}`);
    },
    loadData() { return this.getFile("data.js"); },
    saveData(message) { return this.putFile("data.js", dataJs(), message); },
    savedMsg: " Live in about 1 minute while GitHub Pages updates."
  };

  const backend = ghRepo ? ghBackend : localBackend;
  if (ghRepo) {
    $("loginHint").innerHTML = `Enter a GitHub token with <b>Contents: Read and write</b> access to <code>${ghRepo}</code>. It's kept only in this browser tab.`;
    $("pw").placeholder = "GitHub token (github_pat_...)";
  }

  // ---------- Saving ----------
  // Releases always go in order so each new issue reveals the previous bonus answer
  async function setReleased(list, msg) {
    try {
      await backend.save(list);
      released = list;
      render();
      toast(msg + backend.savedMsg);
    } catch (e) {
      toast(e.message);
    }
  }

  async function saveIssues(newIssues, msg) {
    const old = issues;
    issues = sortIssues(newIssues);
    try {
      await backend.saveData(msg);
      render();
      toast(msg + backend.savedMsg);
      return true;
    } catch (e) {
      issues = old;
      toast(e.message);
      return e.message;
    }
  }

  // Swaps the planned dates of two unreleased issues, which swaps their order
  function swapDates(a, b, msg) {
    const list = clone(issues);
    const x = list.find((i) => i.id === a.id), y = list.find((i) => i.id === b.id);
    [x.publish, y.publish] = [y.publish, x.publish];
    saveIssues(list, msg);
  }

  // ---------- Rendering ----------
  function render() {
    const relIssues = issues.filter((i) => released.includes(i.id));
    const live = relIssues[relIssues.length - 1];
    const unreleased = issues.filter((i) => !released.includes(i.id));
    const next = unreleased[0];
    const prevOfNext = next && issues[issues.indexOf(next) - 1];

    $("hero").innerHTML = next ? `
      <div style="flex:1;min-width:260px">
        <small style="opacity:.8;font-weight:800">NEXT TO RELEASE</small>
        <h2>${esc(next.title)}</h2>
        <p>Planned for ${fmtDate(next.publish)}${prevOfNext ? ` · Also reveals the answer to "${esc(prevOfNext.bonus.q)}" (<b>${letters[prevOfNext.bonus.answer]}. ${esc(prevOfNext.bonus.options[prevOfNext.bonus.answer])}</b>)` : ""}</p>
      </div>
      <div class="hero-actions">
        <a class="btn ghost" href="index.html?preview=${next.id}" target="_blank">Preview</a>
        <button class="btn ghost" data-act="edit" data-id="${next.id}">Edit</button>
        ${unreleased[1] ? `<button class="btn ghost" id="skipNext" title="Swap with the following issue">Skip this week</button>` : ""}
        <button class="btn go" id="releaseNext">Release now</button>
      </div>`
      : `<div style="flex:1"><h2>All issues are released</h2><p>Click "+ Add new issue" below to schedule more.</p></div>`;

    let month = "";
    $("list").innerHTML = issues.map((i) => {
      const m = parseDate(i.publish).toLocaleDateString(undefined, { month: "long", year: "numeric" });
      const header = m !== month ? `<div class="month">${(month = m)}</div>` : "";
      const isRel = released.includes(i.id);
      const u = unreleased.indexOf(i);
      const chip = i === live ? '<span class="chip live">LIVE NOW</span>'
        : isRel ? '<span class="chip rel">Released</span>'
        : i === next ? '<span class="chip next">Next up</span>' : '<span class="chip sched">Scheduled</span>';
      const actions = [
        `<a class="btn" href="index.html?preview=${i.id}" target="_blank">Preview</a>`,
        `<button class="btn" data-act="edit" data-id="${i.id}">Edit</button>`,
        !isRel ? `<button class="btn icon" data-act="up" data-id="${i.id}" title="Move earlier" ${u <= 0 ? "disabled" : ""}>&uarr;</button>` : "",
        !isRel ? `<button class="btn icon" data-act="down" data-id="${i.id}" title="Move later" ${u === unreleased.length - 1 ? "disabled" : ""}>&darr;</button>` : "",
        !isRel ? `<button class="btn icon warn" data-act="delete" data-id="${i.id}" title="Delete issue">&times;</button>` : "",
        i === next ? `<button class="btn go" data-act="release">Release</button>` : "",
        i === live && relIssues.length > 1 ? `<button class="btn warn" data-act="undo">Undo release</button>` : ""
      ].join("");
      return `${header}<div class="row" style="--c:${i.theme}">
        <span class="bar"></span>
        <div>
          <small>Issue #${issues.indexOf(i) + 1} · ${fmtDate(i.publish)}</small>
          <h4>${esc(i.title)} ${chip}</h4>
          <div class="bq">${Math.min(i.facts.length, MAX_FACTS)} fun facts · Bonus: ${esc(i.bonus.q)} <b>(${letters[i.bonus.answer]}. ${esc(i.bonus.options[i.bonus.answer])})</b></div>
        </div>
        <div class="actions">${actions}</div>
      </div>`;
    }).join("") + `<button class="btn add-issue" id="addIssue">+ Add new issue</button>`;

    const release = () => {
      if (!confirm(`Release "${next.title}" to all readers now?${prevOfNext ? `\n\nThis also reveals last week's bonus answer: ${letters[prevOfNext.bonus.answer]}. ${prevOfNext.bonus.options[prevOfNext.bonus.answer]}` : ""}`)) return;
      setReleased([...released.filter((id) => id !== next.id), next.id], `"${next.title}" is now live!`);
    };
    $("releaseNext")?.addEventListener("click", release);
    $("skipNext")?.addEventListener("click", () => {
      const after = unreleased[1];
      if (!confirm(`Skip "${next.title}" this week?\n\n"${after.title}" will be released first (${fmtDate(next.publish)}), and "${next.title}" moves to ${fmtDate(after.publish)}.`)) return;
      swapDates(next, after, `Skipped "${next.title}". "${after.title}" is now next.`);
    });
    $("addIssue").addEventListener("click", () => openEditor(null));

    document.querySelectorAll("#panel [data-act]").forEach((btn) => btn.addEventListener("click", () => {
      const issue = issues.find((i) => i.id === btn.dataset.id);
      const u = unreleased.indexOf(issue);
      switch (btn.dataset.act) {
        case "release": return release();
        case "undo":
          if (!confirm(`Undo the release of "${live.title}"? Readers will see the previous issue again.`)) return;
          return setReleased(released.filter((id) => id !== live.id), `"${live.title}" was un-released.`);
        case "edit": return openEditor(issue);
        case "up": return swapDates(issue, unreleased[u - 1], `Moved "${issue.title}" earlier.`);
        case "down": return swapDates(issue, unreleased[u + 1], `Moved "${issue.title}" later.`);
        case "delete":
          if (!confirm(`Delete "${issue.title}"? This can't be undone.`)) return;
          return saveIssues(issues.filter((i) => i !== issue), `Deleted "${issue.title}".`);
      }
    }));
  }

  // ---------- Editor ----------
  const dlg = $("editDlg");
  const iconNames = Object.keys(window.ICONS).filter((k) => k !== "default").sort();
  let editing = null; // issue being edited (null = new)

  function newIssueTemplate() {
    const last = issues[issues.length - 1];
    const date = new Date(parseDate(last.publish).getTime() + 7 * 864e5);
    let id = isoDate(date), n = 2;
    while (issues.some((i) => i.id === id)) id = `${isoDate(date)}-${n++}`;
    return {
      id, publish: isoDate(date), title: "", subtitle: "", theme: "#16a085", quote: "",
      facts: [], bonus: { q: "", options: ["", "", "", ""], answer: 0, explain: "" }
    };
  }

  function factRow(i) {
    return `<div class="fact-row" data-i="${i}">
      <div class="fr-num">${String(i + 1).padStart(2, "0")}</div>
      <div class="fr-icon"></div>
      <div class="fr-fields">
        <div class="fr-top">
          <input class="f-tag" placeholder="Topic (e.g. Heart)" maxlength="30" />
          <select class="f-icon"><option value="">Picture: auto (from topic)</option>${iconNames.map((k) => `<option value="${k}">Picture: ${k}</option>`).join("")}</select>
        </div>
        <textarea class="f-text" rows="2" placeholder="Fun fact... use <b>words</b> to highlight. Leave empty to skip."></textarea>
      </div>
    </div>`;
  }

  function updateIcon(row) {
    const tag = row.querySelector(".f-tag").value.trim() || "default";
    row.querySelector(".fr-icon").innerHTML = window.iconFor({ tag, icon: row.querySelector(".f-icon").value || undefined });
  }

  function openEditor(issue) {
    editing = issue;
    const data = issue ? clone(issue) : newIssueTemplate();
    const isRel = issue && released.includes(issue.id);
    $("edTitleBar").textContent = issue ? `Edit: ${issue.title}` : "Add new issue";
    $("edReleasedNote").classList.toggle("hidden", !isRel);
    const f = $("editForm").elements;
    f.etitle.value = data.title;
    f.esub.value = data.subtitle;
    f.edate.value = data.publish;
    f.edate.disabled = !!isRel;
    f.etheme.value = data.theme;
    f.equote.value = data.quote;
    $("edFacts").innerHTML = Array.from({ length: MAX_FACTS }, (_, i) => factRow(i)).join("");
    $("edFacts").querySelectorAll(".fact-row").forEach((row, i) => {
      const fact = data.facts[i] || {};
      row.querySelector(".f-tag").value = fact.tag || "";
      row.querySelector(".f-icon").value = fact.icon && window.ICONS[fact.icon] ? fact.icon : "";
      row.querySelector(".f-text").value = fact.fact || "";
      row._extra = fact.image ? { image: fact.image } : {};
      updateIcon(row);
      row.querySelectorAll(".f-tag, .f-icon").forEach((el) => el.addEventListener("input", () => updateIcon(row)));
    });
    f.bq.value = data.bonus.q;
    data.bonus.options.forEach((o, j) => { f[`bo${j}`].value = o; });
    f.banswer.value = String(data.bonus.answer);
    f.bexplain.value = data.bonus.explain || "";
    $("editForm")._base = data;
    $("edErr").textContent = "";
    dlg.showModal();
    dlg.querySelector(".ed-body").scrollTop = 0;
  }

  $("editForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target.elements;
    const base = e.target._base;
    const facts = [...$("edFacts").querySelectorAll(".fact-row")].map((row) => {
      const text = row.querySelector(".f-text").value.trim();
      if (!text) return null;
      const icon = row.querySelector(".f-icon").value;
      return { tag: row.querySelector(".f-tag").value.trim() || "Fun Fact", ...(icon ? { icon } : {}), ...row._extra, fact: text };
    }).filter(Boolean);
    const updated = {
      ...base,
      title: f.etitle.value.trim(),
      subtitle: f.esub.value.trim(),
      publish: f.edate.value,
      theme: f.etheme.value,
      quote: f.equote.value.trim(),
      facts,
      bonus: {
        q: f.bq.value.trim(),
        options: [0, 1, 2, 3].map((j) => f[`bo${j}`].value.trim()),
        answer: Number(f.banswer.value),
        explain: f.bexplain.value.trim()
      }
    };

    const others = issues.filter((i) => i !== editing);
    const lastReleased = issues.filter((i) => released.includes(i.id)).pop();
    const err = !updated.title ? "Please enter a title."
      : !updated.publish ? "Please pick a date."
      : !facts.length ? "Add at least one fun fact."
      : !updated.bonus.q || updated.bonus.options.some((o) => !o) ? "Fill in the bonus question and all 4 choices."
      : others.some((i) => i.publish === updated.publish) ? "Another issue already uses that date. Pick a different date."
      : !released.includes(updated.id) && lastReleased && updated.publish <= lastReleased.publish
        ? `The date must be after the live issue (${fmtDate(lastReleased.publish)}).` : "";
    $("edErr").textContent = err;
    if (err) return;

    $("edSave").disabled = true;
    $("edErr").textContent = "Saving...";
    const ok = await saveIssues([...others, updated], editing ? `Saved changes to "${updated.title}".` : `Added "${updated.title}".`);
    $("edSave").disabled = false;
    $("edErr").textContent = ok === true ? "" : ok;
    if (ok === true) dlg.close();
  });

  $("edCancel").addEventListener("click", () => dlg.close());
  $("edClose").addEventListener("click", () => dlg.close());

  // ---------- Login ----------
  async function showPanel() {
    $("login").classList.add("hidden");
    $("panel").classList.remove("hidden");
    $("logout").classList.remove("hidden");
    // Load the latest content straight from the source (GitHub Pages may serve a cached data.js)
    const text = await backend.loadData().catch(() => null);
    if (text) {
      const w = parseDataJs(text);
      if (Array.isArray(w.ISSUES)) issues = sortIssues(w.ISSUES);
      if (typeof w.SITE_URL === "string") siteUrl = w.SITE_URL;
      if (Array.isArray(w.TIPS)) tips = w.TIPS;
    }
    released = await backend.load();
    render();
  }

  $("login").addEventListener("submit", async (e) => {
    e.preventDefault();
    sessionStorage.setItem(PW_KEY, $("pw").value.trim());
    try {
      await backend.verify();
      $("loginErr").textContent = "";
      showPanel();
    } catch (err) {
      sessionStorage.removeItem(PW_KEY);
      $("loginErr").textContent = err.message;
    }
  });

  $("logout").addEventListener("click", () => { sessionStorage.removeItem(PW_KEY); location.reload(); });

  if (sessionStorage.getItem(PW_KEY)) backend.verify().then(showPanel).catch(() => $("login").classList.remove("hidden"));
  else $("login").classList.remove("hidden");
})();
