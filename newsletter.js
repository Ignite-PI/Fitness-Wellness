(async () => {
  const $ = (id) => document.getElementById(id);
  const letters = ["A", "B", "C", "D"];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const parseDate = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d || 1); };
  const monthLabel = (m) => parseDate(m).toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const shortDate = (s) => parseDate(s).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const paragraphs = (text) => String(text || "").split(/\n\s*\n/).filter(Boolean);

  const list = [...(window.NEWSLETTERS || [])].sort((a, b) => a.month.localeCompare(b.month));
  if (!list.length) { $("hero").innerHTML = "<h2>No newsletters yet</h2>"; return; }
  const wanted = new URLSearchParams(location.search).get("month");
  const nl = list.find((n) => n.month === wanted) || list[list.length - 1];

  // Trivia issues released during this month (same release rules as the trivia page)
  const issues = [...(window.ISSUES || [])].sort((a, b) => parseDate(a.publish) - parseDate(b.publish));
  let releasedIds;
  try {
    releasedIds = (await (await fetch("releases.json?t=" + Date.now(), { cache: "no-store" })).json()).released;
  } catch {
    releasedIds = issues.filter((i) => parseDate(i.publish) <= new Date()).map((i) => i.id);
  }
  const released = new Set(releasedIds);
  const isRevealed = (i) => { const next = issues[issues.indexOf(i) + 1]; return !!next && released.has(next.id); };
  const monthIssues = issues.filter((i) => i.publish.startsWith(nl.month) && released.has(i.id));

  const siteBase = window.SITE_URL || location.origin + location.pathname.replace(/[^/]*$/, "");
  const pageLink = new URL(`newsletter.html?month=${nl.month}`, siteBase).toString();
  const issueLink = (i) => `index.html?issue=${encodeURIComponent(i.id)}`;

  // ---------- Page ----------
  document.documentElement.style.setProperty("--theme", nl.theme || "#16a085");
  document.title = `${monthLabel(nl.month)} | Wellness Monthly`;
  $("sampleNote").classList.toggle("hidden", !nl.sample);

  $("months").innerHTML = list.length > 1 ? [...list].reverse().map((n) =>
    `<a href="?month=${n.month}" class="${n === nl ? "active" : ""}">${monthLabel(n.month)}</a>`).join("") : "";

  $("hero").innerHTML = `
    <div class="nl-hero-text">
      <span class="issue-tag">Wellness Monthly &middot; ${monthLabel(nl.month)}</span>
      <h2>${esc(nl.headline)}</h2>
      ${paragraphs(nl.intro).map((p) => `<p>${p}</p>`).join("")}
    </div>
    ${nl.cover ? `<img class="nl-cover" src="${esc(nl.cover)}" alt="" onerror="this.remove()" />` : ""}`;

  const imgFig = (im) => `<figure><img src="${esc(im.src)}" alt="${esc(im.caption)}" loading="lazy" data-zoom />${im.caption ? `<figcaption>${esc(im.caption)}</figcaption>` : ""}</figure>`;
  $("articleList").innerHTML = (nl.articles || []).map((a) => `
    <article class="nl-article">
      ${a.images?.length ? `<div class="nl-imgs n${Math.min(a.images.length, 3)}">${a.images.slice(0, 3).map(imgFig).join("")}</div>` : ""}
      <div class="nl-article-body">
        <h4>${esc(a.title)}</h4>
        ${paragraphs(a.text).map((p) => `<p>${p}</p>`).join("")}
      </div>
    </article>`).join("") || `<p class="nl-empty">No highlights this month.</p>`;
  $("articles").classList.toggle("hidden", !(nl.articles || []).length);

  $("galleryGrid").innerHTML = (nl.gallery || []).map((g, i) =>
    `<button class="nl-thumb" data-i="${i}"><img src="${esc(g.src)}" alt="${esc(g.caption)}" loading="lazy" />${g.caption ? `<span>${esc(g.caption)}</span>` : ""}</button>`).join("");
  $("gallery").classList.toggle("hidden", !(nl.gallery || []).length);

  const winners = (nl.winners || []).slice(0, 3);
  $("winners").innerHTML = winners.length ? `
    <h4>Top Scorers</h4>
    <div class="nl-podium">${winners.map((w, i) => `<div class="p${i + 1}"><span>#${i + 1}</span><b>${esc(w.name)}</b><em>${esc(w.points)} pts</em></div>`).join("")}</div>
    <p class="nl-small">3 points per correct Bonus Trivia answer.</p>` : `<h4>Top Scorers</h4><p class="nl-small">Winners will be announced soon.</p>`;
  $("recap").innerHTML = `<h4>This Month's Issues</h4>` + (monthIssues.length ? monthIssues.map((i) => `
    <a class="nl-issue" href="${issueLink(i)}" style="--c:${i.theme}">
      <small>Issue #${issues.indexOf(i) + 1} &middot; ${shortDate(i.publish)}</small>
      <b>${esc(i.title)}</b>
      <span>${isRevealed(i) ? `Bonus answer: <b>${letters[i.bonus.answer]}. ${esc(i.bonus.options[i.bonus.answer])}</b>` : "Bonus answer revealed next week"}</span>
    </a>`).join("") : `<p class="nl-small">No trivia issues released this month yet.</p>`);

  $("annList").innerHTML = (nl.announcements || []).map((a) => {
    const d = parseDate(a.date);
    return `<div class="nl-ann-item">
      <div class="nl-date"><b>${d.getDate()}</b><span>${d.toLocaleDateString(undefined, { month: "short" })}</span></div>
      <div><h4>${esc(a.title)}</h4><p>${esc(a.text)}</p></div>
    </div>`;
  }).join("");
  $("announcements").classList.toggle("hidden", !(nl.announcements || []).length);

  // Section order and visibility from the editor; sections left out are hidden
  const ALL_SECTIONS = ["articles", "gallery", "trivia", "announcements"];
  const ORDER = Array.isArray(nl.sections) ? nl.sections.filter((k) => ALL_SECTIONS.includes(k)) : ALL_SECTIONS;
  ALL_SECTIONS.forEach((k) => { if (!ORDER.includes(k)) $(k).classList.add("hidden"); });
  ORDER.forEach((k) => $("nl").appendChild($(k)));

  $("tips").innerHTML = (window.TIPS || []).map((t) => `<span>${esc(t)}</span>`).join("");

  // ---------- Lightbox ----------
  const lb = $("lightbox");
  let pics = [], at = 0;
  const show = () => { $("lbImg").src = pics[at].src; $("lbCap").textContent = pics[at].caption || ""; };
  const open = (arr, i) => { pics = arr; at = i; show(); lb.showModal(); };
  $("galleryGrid").addEventListener("click", (e) => { const b = e.target.closest(".nl-thumb"); if (b) open(nl.gallery, +b.dataset.i); });
  $("articleList").addEventListener("click", (e) => {
    const img = e.target.closest("img[data-zoom]");
    if (!img) return;
    const all = (nl.articles || []).flatMap((a) => (a.images || []).slice(0, 3));
    open(all, all.findIndex((p) => img.src.endsWith(p.src.replace(/^\.?\//, ""))));
  });
  $("lbPrev").onclick = () => { at = (at - 1 + pics.length) % pics.length; show(); };
  $("lbNext").onclick = () => { at = (at + 1) % pics.length; show(); };
  $("lbClose").onclick = () => lb.close();
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
  document.addEventListener("keydown", (e) => {
    if (!lb.open) return;
    if (e.key === "ArrowLeft") $("lbPrev").click();
    if (e.key === "ArrowRight") $("lbNext").click();
  });

  // ---------- Email image ----------
  function drawCover(ctx, img, x, y, w, h, r) {
    ctx.save();
    ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.clip();
    if (img) {
      const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const sw = w / s, sh = h / s;
      ctx.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, x, y, w, h);
    } else {
      ctx.fillStyle = "#e3ecf3"; ctx.fillRect(x, y, w, h);
    }
    ctx.restore();
  }

  function draw(ctx, d, H) {
    const K = window.PosterKit;
    const { W, P, INK, MUTED, YELLOW, font, wrap, drawText, pill } = K;
    const theme = nl.theme || "#16a085";
    const inner = W - 2 * P;
    ctx.textBaseline = "top";
    ctx.fillStyle = "#f5faf7";
    ctx.fillRect(0, 0, W, H);
    let y = K.drawLogoStrip(ctx, d.logos, P);

    const section = (title) => {
      ctx.font = font(800, 24, "Baloo 2"); ctx.fillStyle = INK;
      ctx.fillText(title, P, y);
      y += 36;
    };

    // Header
    const hb = wrap(ctx, esc(nl.headline), inner - 40, 34, "Baloo 2", [800, 800]);
    const ib = wrap(ctx, paragraphs(nl.intro).join(" "), inner - 40, 14);
    const headH = 24 + 16 + 10 + hb.lines.length * 38 + 8 + ib.lines.length * 20 + 24;
    const grad = ctx.createLinearGradient(P, y, W - P, y + headH);
    grad.addColorStop(0, theme); grad.addColorStop(1, "#2d6cdf");
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.roundRect(P, y, inner, headH, 22); ctx.fill();
    ctx.textAlign = "center";
    ctx.font = font(800, 12); ctx.fillStyle = "rgba(255,255,255,.9)";
    ctx.fillText(`WELLNESS MONTHLY  ·  ${monthLabel(nl.month).toUpperCase()}`, W / 2, y + 24);
    ctx.textAlign = "left";
    let hy = y + 50;
    hy += drawText(ctx, hb, P + 20, hy, 38, "#fff", "#fff", inner - 40) + 8;
    drawText(ctx, ib, P + 20, hy, 20, "rgba(255,255,255,.95)", YELLOW, inner - 40);
    y += headH + 14;

    if (d.cover) { drawCover(ctx, d.cover, P, y, inner, inner * 0.42, 18); y += inner * 0.42 + 22; } else y += 8;

    // Sections are drawn in the order set in the editor (nl.sections)
    const blocks = {
    articles: () => {
    if ((nl.articles || []).length) {
      section("Highlights");
      (nl.articles || []).forEach((a, ai) => {
        const pad = 18, tw = inner - pad * 2;
        const tb = wrap(ctx, esc(a.title), tw, 20, "Baloo 2", [800, 800]);
        const pbs = paragraphs(a.text).map((p) => wrap(ctx, p, tw, 13));
        const imgs = d.articleImgs[ai];
        const n = imgs.length, gap = 8, iw = n ? (tw - gap * (n - 1)) / n : 0, ih = n === 1 ? tw * 0.5 : iw * 0.75;
        const capH = n && (a.images || []).some((im) => im.caption) ? 18 : 0;
        const cardH = pad + (n ? ih + capH + 12 : 0) + tb.lines.length * 24 + 6 + pbs.reduce((s, b) => s + b.lines.length * 19 + 8, 0) + pad - 8;
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.roundRect(P, y, inner, cardH, 18); ctx.fill();
        let cy = y + pad;
        if (n) {
          imgs.forEach((img, k) => {
            const x = P + pad + k * (iw + gap);
            drawCover(ctx, img, x, cy, iw, ih, 12);
            const cap = a.images[k]?.caption;
            if (cap) { ctx.font = font(700, 11); ctx.fillStyle = MUTED; ctx.fillText(cap, x, cy + ih + 4, iw); }
          });
          cy += ih + capH + 12;
        }
        cy += drawText(ctx, tb, P + pad, cy, 24, INK, INK) + 6;
        pbs.forEach((b) => { cy += drawText(ctx, b, P + pad, cy, 19, INK, theme) + 8; });
        y += cardH + 12;
      });
      y += 10;
    }
    },

    // Gallery (up to 6 photos, 3 per row)
    gallery: () => {
    if (d.gallery.length) {
      section("Photo Gallery");
      const gap = 8, cols = 3, s = (inner - gap * (cols - 1)) / cols;
      d.gallery.forEach((img, i) => drawCover(ctx, img, P + (i % cols) * (s + gap), y + Math.floor(i / cols) * (s + gap), s, s, 12));
      y += Math.ceil(d.gallery.length / cols) * (s + gap) + 14;
    }
    },

    trivia: () => {
    section("Trivia Recap");
    const cardTop = y;
    const recapH = 18 + (winners.length ? 24 + 74 + 16 : 0) + (monthIssues.length ? 24 + monthIssues.length * 46 : 0)
      + (!winners.length && !monthIssues.length ? 24 : 0) + 4;
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.roundRect(P, cardTop, inner, recapH, 18); ctx.fill();
    let ty = y + 18;
    if (winners.length) {
      ctx.font = font(800, 14); ctx.fillStyle = MUTED; ctx.fillText("TOP SCORERS", P + 18, ty); ty += 24;
      const bw = (inner - 36 - 16) / 3;
      const colors = [["#fff6dd", "#ffd23f"], ["#eef1f7", "#c7d2e3"], ["#fff2e5", "#f2b38a"]];
      winners.forEach((w, i) => {
        const x = P + 18 + i * (bw + 8);
        ctx.fillStyle = colors[i][0]; ctx.strokeStyle = colors[i][1]; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect(x, ty, bw, 74, 12); ctx.fill(); ctx.stroke();
        ctx.textAlign = "center";
        ctx.font = font(800, 20, "Baloo 2"); ctx.fillStyle = INK; ctx.fillText(`#${i + 1}`, x + bw / 2, ty + 8);
        ctx.font = font(800, 13); ctx.fillText(String(w.name), x + bw / 2, ty + 34, bw - 12);
        ctx.font = font(800, 12); ctx.fillStyle = MUTED; ctx.fillText(`${w.points} pts`, x + bw / 2, ty + 53);
        ctx.textAlign = "left";
      });
      ty += 74 + 16;
    }
    if (monthIssues.length) {
      ctx.font = font(800, 14); ctx.fillStyle = MUTED; ctx.fillText("THIS MONTH'S ISSUES", P + 18, ty); ty += 24;
      monthIssues.forEach((i) => {
        ctx.fillStyle = i.theme; ctx.beginPath(); ctx.roundRect(P + 18, ty + 2, 6, 34, 3); ctx.fill();
        ctx.font = font(700, 11); ctx.fillStyle = MUTED; ctx.fillText(`Issue #${issues.indexOf(i) + 1} · ${shortDate(i.publish)}`, P + 32, ty);
        ctx.font = font(800, 15); ctx.fillStyle = INK; ctx.fillText(i.title, P + 32, ty + 16);
        ty += 46;
      });
    }
    if (!winners.length && !monthIssues.length) { ctx.font = font(700, 13); ctx.fillStyle = MUTED; ctx.fillText("Trivia results coming soon.", P + 18, ty); }
    y = cardTop + recapH + 22;
    },

    announcements: () => {
    if ((nl.announcements || []).length) {
      section("Announcements");
      (nl.announcements || []).forEach((a) => {
        const tb = wrap(ctx, esc(a.text), inner - 100, 13);
        const h = Math.max(64, 16 + 22 + tb.lines.length * 18 + 14);
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.roundRect(P, y, inner, h, 14); ctx.fill();
        const dt = parseDate(a.date);
        ctx.fillStyle = theme; ctx.beginPath(); ctx.roundRect(P + 14, y + 12, 56, 50, 10); ctx.fill();
        ctx.textAlign = "center"; ctx.fillStyle = "#fff";
        ctx.font = font(800, 20, "Baloo 2"); ctx.fillText(String(dt.getDate()), P + 42, y + 14);
        ctx.font = font(800, 11); ctx.fillText(dt.toLocaleDateString(undefined, { month: "short" }).toUpperCase(), P + 42, y + 42);
        ctx.textAlign = "left";
        ctx.font = font(800, 15); ctx.fillStyle = INK; ctx.fillText(a.title, P + 84, y + 14, inner - 100);
        drawText(ctx, tb, P + 84, y + 36, 18, MUTED, INK);
        y += h + 10;
      });
      y += 12;
    }
    }
    };
    ORDER.forEach((k) => blocks[k]?.());

    // Call to action
    ctx.fillStyle = theme;
    ctx.beginPath(); ctx.roundRect(P, y, inner, 48, 14); ctx.fill();
    ctx.textAlign = "center";
    ctx.font = font(800, 17); ctx.fillStyle = "#fff"; ctx.fillText("Read the full newsletter  →", W / 2, y + 14);
    ctx.font = font(700, 12); ctx.fillStyle = MUTED;
    ctx.fillText(pageLink.replace(/^https?:\/\//, ""), W / 2, y + 58);
    ctx.font = font(700, 11);
    ctx.fillText("Wellness Monthly  ·  A healthier, happier you", W / 2, y + 82);
    ctx.textAlign = "left";
    return y + 100 + P;
  }

  async function render(width) {
    const K = window.PosterKit;
    const load = (arr) => Promise.all(arr.map((p) => K.loadImage(p.src)));
    const data = {
      logos: await K.loadLogos(),
      cover: nl.cover ? await K.loadImage(nl.cover) : null,
      articleImgs: await Promise.all((nl.articles || []).map((a) => load((a.images || []).slice(0, 3)))),
      gallery: (await load((nl.gallery || []).slice(0, 6))).filter(Boolean)
    };
    return K.renderCanvas(width, draw, data);
  }

  window.ExportSource = () => ({
    render,
    link: pageLink,
    file: `wellness-monthly-${nl.month}`,
    alt: `Wellness Monthly - ${monthLabel(nl.month)}: ${nl.headline}. Click to read the full newsletter.`,
    linkText: "Read the full newsletter &rarr;",
    copied: "Copied! Paste into your email (Ctrl+V). The image links to the full newsletter."
  });
})();
