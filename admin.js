(() => {
  const $ = (id) => document.getElementById(id);
  const letters = ["A", "B", "C", "D"];
  const PW_KEY = "trivia-admin-pw";
  const parseDate = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const fmtDate = (s) => parseDate(s).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  const issues = [...window.ISSUES].sort((a, b) => parseDate(a.publish) - parseDate(b.publish));
  let released = [];

  function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove("show"), 2800);
  }

  const secret = () => sessionStorage.getItem(PW_KEY) || "";

  // Local mode: server.py stores releases.json and checks the admin password
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
    savedMsg: ""
  };

  // GitHub Pages mode: releases.json is updated in the repo through the GitHub API using the admin's token
  const ghRepo = location.hostname.endsWith(".github.io")
    ? `${location.hostname.split(".")[0]}/${location.pathname.split("/")[1]}` : null;
  let ghSha = null;
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
    async load() {
      const res = await this.req("/contents/releases.json?t=" + Date.now());
      if (res.status === 404) { ghSha = null; return issues.filter((i) => parseDate(i.publish) <= new Date()).map((i) => i.id); }
      const file = await res.json();
      ghSha = file.sha;
      return JSON.parse(atob(file.content.replace(/\n/g, ""))).released || [];
    },
    async save(list) {
      const res = await this.req("/contents/releases.json", {
        method: "PUT",
        body: JSON.stringify({
          message: `Update releases: ${list[list.length - 1] || "none"}`,
          content: btoa(JSON.stringify({ released: list }, null, 2) + "\n"),
          ...(ghSha ? { sha: ghSha } : {})
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(res.status === 409 ? "releases.json changed elsewhere. Reload the page and try again." : data.message || "GitHub update failed");
      ghSha = data.content.sha;
    },
    savedMsg: " Live in about 1 minute while GitHub Pages updates."
  };

  const backend = ghRepo ? ghBackend : localBackend;
  if (ghRepo) {
    $("loginHint").innerHTML = `Enter a GitHub token with <b>Contents: Read and write</b> access to <code>${ghRepo}</code>. It's kept only in this browser tab.`;
    $("pw").placeholder = "GitHub token (github_pat_...)";
  }

  async function loadReleases() {
    released = await backend.load();
  }

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

  function render() {
    const relIssues = issues.filter((i) => released.includes(i.id));
    const live = relIssues[relIssues.length - 1];
    const next = issues.find((i) => !released.includes(i.id));
    const prevOfNext = next && issues[issues.indexOf(next) - 1];

    $("hero").innerHTML = next ? `
      <div>
        <small style="opacity:.8;font-weight:800">NEXT TO RELEASE</small>
        <h2>${next.title}</h2>
        <p>Planned for ${fmtDate(next.publish)}${prevOfNext ? ` · Also reveals the answer to "${prevOfNext.bonus.q}" (<b>${letters[prevOfNext.bonus.answer]}. ${prevOfNext.bonus.options[prevOfNext.bonus.answer]}</b>)` : ""}</p>
      </div>
      <a class="btn" style="background:transparent;color:#fff;border-color:#fff" href="index.html?preview=${next.id}" target="_blank">Preview</a>
      <button class="btn go" id="releaseNext">Release now</button>`
      : `<div><h2>All issues are released</h2><p>Add new issues to data.js to schedule more.</p></div>`;

    let month = "";
    $("list").innerHTML = issues.map((i) => {
      const m = parseDate(i.publish).toLocaleDateString(undefined, { month: "long", year: "numeric" });
      const header = m !== month ? `<div class="month">${(month = m)}</div>` : "";
      const isRel = released.includes(i.id);
      const chip = i === live ? '<span class="chip live">LIVE NOW</span>'
        : isRel ? '<span class="chip rel">Released</span>'
        : i === next ? '<span class="chip next">Next up</span>' : '<span class="chip sched">Scheduled</span>';
      const actions = [
        `<a class="btn" href="index.html?preview=${i.id}" target="_blank">Preview</a>`,
        i === next ? `<button class="btn go" data-act="release">Release</button>` : "",
        i === live && relIssues.length > 1 ? `<button class="btn warn" data-act="undo">Undo release</button>` : ""
      ].join("");
      return `${header}<div class="row" style="--c:${i.theme}" data-id="${i.id}">
        <span class="bar"></span>
        <div>
          <small>Issue #${issues.indexOf(i) + 1} · ${fmtDate(i.publish)}</small>
          <h4>${i.title} ${chip}</h4>
          <div class="bq">${Math.min(i.facts.length, 8)} fun facts · Bonus: ${i.bonus.q} <b>(${letters[i.bonus.answer]}. ${i.bonus.options[i.bonus.answer]})</b></div>
        </div>
        <div class="actions">${actions}</div>
      </div>`;
    }).join("");

    const release = () => {
      if (!confirm(`Release "${next.title}" to all readers now?${prevOfNext ? `\n\nThis also reveals last week's bonus answer: ${letters[prevOfNext.bonus.answer]}. ${prevOfNext.bonus.options[prevOfNext.bonus.answer]}` : ""}`)) return;
      setReleased([...released.filter((id) => id !== next.id), next.id], `"${next.title}" is now live!`);
    };
    $("releaseNext")?.addEventListener("click", release);
    $("list").querySelector('[data-act="release"]')?.addEventListener("click", release);
    $("list").querySelector('[data-act="undo"]')?.addEventListener("click", () => {
      if (!confirm(`Undo the release of "${live.title}"? Readers will see the previous issue again.`)) return;
      setReleased(released.filter((id) => id !== live.id), `"${live.title}" was un-released.`);
    });
  }

  async function showPanel() {
    $("login").classList.add("hidden");
    $("panel").classList.remove("hidden");
    $("logout").classList.remove("hidden");
    await loadReleases();
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
