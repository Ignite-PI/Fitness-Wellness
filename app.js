(async () => {
  const STORE_KEY = "weekly-trivia-v2";
  const $ = (id) => document.getElementById(id);
  const letters = ["A", "B", "C", "D"];
  const MAX_FACTS = 8;

  const parseDate = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const fmtDate = (d) => d.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });

  const issues = [...window.ISSUES].sort((a, b) => parseDate(a.publish) - parseDate(b.publish));
  const params = new URLSearchParams(location.search);

  // Released issues come from releases.json (managed on admin.html).
  // ?preview=<id> shows the site as if everything up to that issue were released (not visible to readers).
  const previewIdx = issues.findIndex((i) => i.id === params.get("preview"));
  let releasedIds;
  if (previewIdx >= 0) {
    releasedIds = issues.slice(0, previewIdx + 1).map((i) => i.id);
  } else {
    try {
      const res = await fetch("releases.json?t=" + Date.now(), { cache: "no-store" });
      releasedIds = (await res.json()).released;
    } catch {
      // No releases.json available: fall back to the planned publish dates
      releasedIds = issues.filter((i) => parseDate(i.publish) <= new Date()).map((i) => i.id);
    }
  }
  const releasedSet = new Set(releasedIds);
  const published = issues.filter((i) => releasedSet.has(i.id));
  if (!published.length) published.push(issues[0]);
  const upcoming = issues.find((i) => !published.includes(i));
  const current = published[published.length - 1];
  const nextRevealDate = upcoming ? parseDate(upcoming.publish)
    : new Date(parseDate(current.publish).getTime() + 7 * 864e5);

  const isRevealed = (issue) => {
    const next = issues[issues.indexOf(issue) + 1];
    return !!next && published.includes(next);
  };

  if (previewIdx >= 0) {
    document.body.insertAdjacentHTML("afterbegin",
      `<div class="preview-bar">PREVIEW MODE: showing the site as if released up to "${issues[previewIdx].title}". Readers can't see this.</div>`);
  }

  const state = JSON.parse(localStorage.getItem(STORE_KEY) || '{"bonus":{}}');
  const save = () => localStorage.setItem(STORE_KEY, JSON.stringify(state));

  // ?issue=<id> opens a specific published issue (used by links in emailed images)
  const requested = new URLSearchParams(location.search).get("issue");
  let viewing = published.find((i) => i.id === requested) || current;
  let timer;

  function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove("show"), 2200);
  }

  function confetti() {
    const colors = ["#ffd23f", "#22b573", "#ef4f5f", "#2d6cdf", "#7b5cff"];
    for (let i = 0; i < 60; i++) {
      const c = document.createElement("div");
      c.className = "confetti";
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = colors[i % colors.length];
      c.style.animationDuration = 1.5 + Math.random() * 1.5 + "s";
      c.style.animationDelay = Math.random() * 0.4 + "s";
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 3500);
    }
  }

  function totalScore() {
    return published.filter((i) => isRevealed(i) && state.bonus[i.id] === i.bonus.answer).length * 3;
  }

  function renderFacts() {
    if (viewing.facts.length > MAX_FACTS) console.warn(`"${viewing.title}" has ${viewing.facts.length} facts; only the first ${MAX_FACTS} are shown.`);
    $("facts").innerHTML = viewing.facts.slice(0, MAX_FACTS).map((f, i) => `
      <article class="fact-card" style="background:var(--palette-${i % 8})">
        <div class="fact-top">
          <span class="label">Did you know?</span>
          <span class="tag">${String(i + 1).padStart(2, "0")} &middot; ${f.tag}</span>
        </div>
        <div class="fact-body">
          <div class="fact-img">${f.image ? `<img src="${f.image}" alt="${f.tag}">` : window.iconFor(f)}</div>
          <p>${f.fact}</p>
        </div>
      </article>`).join("");
  }

  function countdownHTML() {
    const ms = Math.max(0, nextRevealDate - new Date());
    const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
    return [[d, "days"], [h, "hrs"], [m, "min"], [s, "sec"]].map(([v, l]) => `<div><b>${v}</b><small>${l}</small></div>`).join("");
  }

  function renderBonus() {
    const b = viewing.bonus;
    const picked = state.bonus[viewing.id];
    const revealed = isRevealed(viewing);
    const el = $("bonus");
    clearInterval(timer);

    let side;
    if (revealed) {
      const verdict = picked === undefined ? "You didn't lock in an answer for this one."
        : picked === b.answer ? "You nailed it! +3 bonus points." : `You picked ${letters[picked]}. Better luck this week!`;
      side = `<p><b>Answer revealed:</b> ${letters[b.answer]}. ${b.options[b.answer]}</p><p>${b.explain}</p><p class="lock-note">${verdict}</p>`;
    } else {
      side = picked === undefined
        ? `<p>Pick your answer and lock it in. The answer will be revealed in next week's issue on <b>${fmtDate(nextRevealDate)}</b>.</p>`
        : `<p class="lock-note">Locked in: ${letters[picked]}. ${b.options[picked]}</p><p>Come back for the reveal in:</p>`;
      side += nextRevealDate > new Date()
        ? `<div class="countdown" id="countdown">${countdownHTML()}</div>`
        : `<p class="lock-note">The answer drops very soon. Stay tuned!</p>`;
    }

    el.innerHTML = `
      <div>
        <span class="bonus-head">BONUS TRIVIA</span>
        <h3>${b.q}</h3>
        <p>Worth 3 points &middot; ${revealed ? "Answer revealed" : "Answer revealed next week"}</p>
        <div class="options" style="margin-top:16px">
          ${b.options.map((o, j) => {
            let cls = "";
            if (revealed && j === b.answer) cls = "correct";
            else if (revealed && j === picked) cls = "wrong";
            else if (!revealed && j === picked) cls = "picked";
            return `<button class="opt ${cls}" data-j="${j}" ${revealed || picked !== undefined ? "disabled" : ""}>${letters[j]}. ${o}</button>`;
          }).join("")}
        </div>
      </div>
      <div>${side}</div>`;

    el.querySelectorAll(".opt").forEach((btn) => btn.addEventListener("click", () => {
      const j = Number(btn.dataset.j);
      if (!confirm(`Lock in "${b.options[j]}"? You can't change it until the reveal.`)) return;
      state.bonus[viewing.id] = j;
      save();
      toast("Answer locked in! See you next week for the reveal.");
      renderBonus();
    }));

    if (!revealed) timer = setInterval(() => { const c = $("countdown"); if (c) c.innerHTML = countdownHTML(); }, 1000);
  }

  function renderReveal() {
    const prev = published[published.length - 2];
    const el = $("reveal");
    if (!prev) return el.classList.add("hidden");
    const b = prev.bonus;
    const picked = state.bonus[prev.id];
    const verdict = picked === undefined ? "You didn't play last week's bonus. Lock in this week's below!"
      : picked === b.answer ? "You got it right! +3 bonus points." : `You picked ${letters[picked]}. ${b.options[picked]} - so close!`;
    el.innerHTML = `
      <div class="badge">LAST WEEK'S<br>BONUS<br>REVEALED</div>
      <div>
        <small>From "${prev.title}" &middot; ${fmtDate(parseDate(prev.publish))}</small>
        <h3>${b.q}</h3>
        <span class="answer">${letters[b.answer]}. ${b.options[b.answer]}</span>
        <div>${b.explain}</div>
        <div class="verdict">${verdict}</div>
      </div>`;
    el.classList.remove("hidden");
    if (picked === b.answer && !sessionStorage.getItem("celebrated-" + prev.id)) {
      sessionStorage.setItem("celebrated-" + prev.id, "1");
      setTimeout(confetti, 400);
    }
  }

  function renderNextUp() {
    $("nextUp").innerHTML = `
      <span class="lock">NEXT ISSUE</span>
      <div>
        <h3>${upcoming ? upcoming.title : "A brand-new topic"}</h3>
        <p>Drops ${fmtDate(nextRevealDate)} &middot; plus the answer to "${current.bonus.q}"</p>
      </div>`;
  }

  function renderArchive() {
    $("archiveList").innerHTML = [...published].reverse().map((i) => {
      return `<button class="archive-item ${i === viewing ? "active" : ""}" style="--c:${i.theme}" data-id="${i.id}">
        <small>${i === current ? "THIS WEEK" : fmtDate(parseDate(i.publish))}</small>
        <h4>${i.title}</h4>
        <div class="meta">${Math.min(i.facts.length, MAX_FACTS)} fun facts &middot; Bonus ${isRevealed(i) ? "revealed" : "pending"}</div>
      </button>`;
    }).join("");
    $("archiveList").querySelectorAll(".archive-item").forEach((btn) => btn.addEventListener("click", () => {
      viewing = issues.find((i) => i.id === btn.dataset.id);
      renderIssue();
      $("issue").scrollIntoView({ behavior: "smooth" });
    }));
  }

  function renderIssue() {
    document.documentElement.style.setProperty("--theme", viewing.theme);
    const weekNo = issues.indexOf(viewing) + 1;
    $("issueTag").textContent = `Issue #${weekNo} · ${fmtDate(parseDate(viewing.publish))}${viewing === current ? " · This Week" : ""}`;
    $("issueTitle").textContent = viewing.title + " Trivia";
    $("issueSub").textContent = viewing.subtitle;
    $("quote").textContent = `"${viewing.quote}"`;
    renderFacts();
    renderBonus();
    renderArchive();
    $("totalScore").textContent = totalScore();
  }

  $("tips").innerHTML = window.TIPS.map((t) => `<span>${t}</span>`).join("");
  renderReveal();
  renderNextUp();
  renderIssue();

  if (location.hash === "#bonus") {
    setTimeout(() => {
      $("bonus").scrollIntoView({ behavior: "smooth", block: "center" });
      $("bonus").classList.add("spotlight");
      setTimeout(() => $("bonus").classList.remove("spotlight"), 4000);
    }, 300);
  }

  // Used by export.js to render the issue currently on screen
  window.TriviaApp = {
    getIssue: () => viewing,
    issueNumber: (issue) => issues.indexOf(issue) + 1,
    isRevealed,
    revealDate: (issue) => {
      const next = issues[issues.indexOf(issue) + 1];
      return next ? parseDate(next.publish) : new Date(parseDate(issue.publish).getTime() + 7 * 864e5);
    },
    parseDate, fmtDate, MAX_FACTS
  };
})();
