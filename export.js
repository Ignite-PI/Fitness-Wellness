// Renders the current issue as an email-friendly poster image (PNG/JPEG) and handles download, copy and print.
(() => {
  const $ = (id) => document.getElementById(id);
  const W = 600, P = 24;
  const PALETTE = ["#fff2e5", "#ffe9ee", "#e6f7ef", "#e7f2ff", "#f1eaff", "#fff6dd", "#eaf8f0", "#eef1f7"];
  const INK = "#1d2b4f", MUTED = "#5d6b8a", RED = "#ef4f5f", YELLOW = "#ffd23f", GREEN = "#22b573";
  const letters = ["A", "B", "C", "D"];
  const font = (weight, size, family = "Nunito", style = "") => `${style} ${weight} ${size}px "${family}", sans-serif`;

  // Link that takes email readers straight to this issue's Bonus Trivia
  function bonusLink(issue) {
    const base = window.SITE_URL || location.origin + location.pathname.replace(/index\.html$/, "");
    const url = new URL(base);
    url.searchParams.set("issue", issue.id);
    url.hash = "bonus";
    return url.toString();
  }
  const displayUrl = (link) => link.replace(/^https?:\/\//, "").replace(/[?#].*$/, "").replace(/\/$/, "");

  const decoder = document.createElement("textarea");
  const decode = (s) => { decoder.innerHTML = s; return decoder.value; };

  // Split simple HTML (only <b> supported) into word tokens and wrap them into lines
  function wrap(ctx, html, maxW, size, family = "Nunito", weights = [400, 800], style = "") {
    const tokens = [];
    let bold = false;
    html.split(/(<\/?b>)/).forEach((part) => {
      if (part === "<b>") bold = true;
      else if (part === "</b>") bold = false;
      else decode(part).split(/(\s+)/).forEach((w) => w && tokens.push({ w, bold }));
    });
    const lines = [[]];
    let x = 0;
    for (const t of tokens) {
      ctx.font = font(t.bold ? weights[1] : weights[0], size, family, style);
      const width = ctx.measureText(t.w).width;
      const space = /^\s+$/.test(t.w);
      if (space && x === 0) continue;
      if (!space && x > 0 && x + width > maxW) {
        const line = lines[lines.length - 1];
        if (line.length && /^\s+$/.test(line[line.length - 1].w)) line.pop();
        lines.push([]);
        x = 0;
      }
      lines[lines.length - 1].push({ ...t, width });
      x += width;
    }
    return { lines, size, family, weights, style };
  }

  function drawText(ctx, block, x, y, lh, color, boldColor, maxW = 0) {
    block.lines.forEach((line, i) => {
      const lw = line.reduce((s, t) => s + t.width, 0);
      let cx = maxW ? x + (maxW - lw) / 2 : x;
      for (const t of line) {
        ctx.font = font(t.bold ? block.weights[1] : block.weights[0], block.size, block.family, block.style);
        ctx.fillStyle = t.bold ? boldColor : color;
        ctx.fillText(t.w, cx, y + i * lh);
        cx += t.width;
      }
    });
    return block.lines.length * lh;
  }

  function pill(ctx, text, x, y, h, size, bg, color, family = "Nunito", pad = 10) {
    ctx.font = font(800, size, family);
    const w = ctx.measureText(text).width + pad * 2;
    ctx.fillStyle = bg;
    ctx.beginPath(); ctx.roundRect(x, y, w, h, h / 2.6); ctx.fill();
    ctx.fillStyle = color;
    ctx.fillText(text, x + pad, y + (h - size) / 2 - 1);
    return w;
  }

  function loadImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  const svgToUrl = (svg) => "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"'));

  const loadLogos = async () => {
    const [fit, ct] = await Promise.all([loadImage("images/fit-logo.png"), loadImage("images/clinical-tower-logo.png")]);
    return { fit, ct };
  };

  // Logo strip (only drawn when the logo files exist in images/). Returns the new y.
  function drawLogoStrip(ctx, logos, y) {
    const { fit, ct } = logos;
    if (!fit && !ct) return y;
    const stripH = 64;
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.roundRect(P, y, W - 2 * P, stripH, 16); ctx.fill();
    const fitDraw = (img, x, h, alignRight) => {
      const w = (img.naturalWidth / img.naturalHeight) * h;
      ctx.drawImage(img, alignRight ? x - w : x, y + (stripH - h) / 2, w, h);
    };
    if (fit) fitDraw(fit, P + 14, 52, false);
    if (ct) fitDraw(ct, W - P - 14, 48, true);
    ctx.font = font(800, 11); ctx.fillStyle = MUTED; ctx.textAlign = "center";
    ctx.fillText("PRESENTS", W / 2, y + stripH / 2 - 6);
    ctx.textAlign = "left";
    return y + stripH + 12;
  }

  // Draws twice: once to measure the height, then for real at the requested pixel width
  async function renderCanvas(width, drawFn, data) {
    await Promise.all([
      document.fonts.load(font(800, 20, "Baloo 2")), document.fonts.load(font(400, 13)),
      document.fonts.load(font(700, 13)), document.fonts.load(font(800, 13))
    ]);
    const H = drawFn(document.createElement("canvas").getContext("2d"), data, 0);
    const scale = width / W;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = Math.ceil(H * scale);
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    drawFn(ctx, data, H);
    return canvas;
  }

  // Shared drawing helpers (used by newsletter.js for its email image)
  window.PosterKit = { W, P, INK, MUTED, RED, YELLOW, GREEN, PALETTE, font, wrap, drawText, pill, loadImage, loadLogos, drawLogoStrip, renderCanvas };

  // Draws the full poster at logical width W and returns its logical height
  function draw(ctx, d, H) {
    const { issue, icons, revealed } = d;
    ctx.textBaseline = "top";
    ctx.fillStyle = "#f5faf7";
    ctx.fillRect(0, 0, W, H);
    let y = drawLogoStrip(ctx, d.logos, P);

    // Header
    const titleBlock = wrap(ctx, issue.title + " Trivia", W - 2 * P - 40, 40, "Baloo 2", [800, 800]);
    const headH = 26 + 16 + 6 + titleBlock.lines.length * 42 + 10 + 30 + 22;
    const grad = ctx.createLinearGradient(P, y, W - P, y + headH);
    grad.addColorStop(0, issue.theme); grad.addColorStop(1, "#2d6cdf");
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.roundRect(P, y, W - 2 * P, headH, 22); ctx.fill();
    ctx.save(); ctx.clip();
    ctx.fillStyle = "rgba(255,255,255,.12)";
    ctx.beginPath(); ctx.arc(W - P - 20, y + headH + 10, 90, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(P + 10, y - 10, 50, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.textAlign = "center";
    ctx.font = font(800, 12); ctx.fillStyle = "rgba(255,255,255,.9)";
    ctx.fillText(`THE WEEKLY TRIVIA  ·  ISSUE #${TriviaApp.issueNumber(issue)}  ·  ${TriviaApp.fmtDate(TriviaApp.parseDate(issue.publish)).toUpperCase()}`, W / 2, y + 26);
    ctx.textAlign = "left";
    let hy = y + 26 + 22;
    hy += drawText(ctx, titleBlock, P + 20, hy, 42, "#fff", "#fff", W - 2 * P - 40) + 10;
    ctx.font = font(800, 14);
    const subW = ctx.measureText(issue.subtitle).width + 28;
    pill(ctx, issue.subtitle, (W - subW) / 2, hy, 30, 14, YELLOW, INK, "Nunito", 14);
    y += headH + 22;

    // Section title
    ctx.font = font(800, 28, "Baloo 2"); ctx.fillStyle = INK;
    ctx.fillText("Did You Know?", P, y);
    const stw = ctx.measureText("Did You Know? ").width;
    ctx.font = font(700, 13); ctx.fillStyle = MUTED;
    ctx.fillText("Fun facts of the week", P + stw + 4, y + 12);
    y += 44;

    // Fact cards (2 columns)
    const gap = 12, colW = (W - 2 * P - gap) / 2, icon = 56, textW = colW - 28 - icon - 10, lh = 18;
    const facts = issue.facts.slice(0, TriviaApp.MAX_FACTS);
    for (let r = 0; r < facts.length; r += 2) {
      const row = facts.slice(r, r + 2).map((f) => ({ f, block: wrap(ctx, f.fact, textW, 13) }));
      const bodyH = Math.max(icon, ...row.map((c) => c.block.lines.length * lh));
      const cardH = 14 + 20 + 10 + bodyH + 14;
      row.forEach((c, k) => {
        const i = r + k, x = P + k * (colW + gap);
        ctx.fillStyle = PALETTE[i % 8];
        ctx.beginPath(); ctx.roundRect(x, y, colW, cardH, 14); ctx.fill();
        pill(ctx, "Did you know?", x + 14, y + 14, 20, 11, RED, "#fff", "Nunito", 9);
        ctx.font = font(800, 10); ctx.fillStyle = issue.theme; ctx.textAlign = "right";
        ctx.fillText(`${String(i + 1).padStart(2, "0")} · ${c.f.tag.toUpperCase()}`, x + colW - 14, y + 19);
        ctx.textAlign = "left";
        const by = y + 44, cx = x + 14 + icon / 2, cy = by + bodyH / 2;
        ctx.fillStyle = "rgba(255,255,255,.85)";
        ctx.beginPath(); ctx.arc(cx, cy, icon / 2, 0, Math.PI * 2); ctx.fill();
        const img = icons[i];
        if (img) {
          ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, icon / 2, 0, Math.PI * 2); ctx.clip();
          const s = c.f.image ? icon : 46;
          ctx.drawImage(img, cx - s / 2, cy - s / 2, s, s);
          ctx.restore();
        }
        drawText(ctx, c.block, x + 14 + icon + 10, by + (bodyH - c.block.lines.length * lh) / 2, lh, INK, issue.theme);
      });
      y += cardH + gap;
    }
    y += 10;

    // Bonus
    const b = issue.bonus, inW = W - 2 * P - 36;
    const qBlock = wrap(ctx, b.q, inW, 19, "Baloo 2", [800, 800]);
    const foot = revealed
      ? `<b>Answer: ${letters[b.answer]}. ${b.options[b.answer]}</b> - ${b.explain}`
      : `<b>Think you know it?</b> The answer will be revealed in next week's issue on <b>${TriviaApp.fmtDate(TriviaApp.revealDate(issue))}</b>.`;
    const fBlock = wrap(ctx, foot, inW, 13);
    const cta = revealed ? "Click to see this week's trivia" : "Click here to answer the Bonus Trivia";
    const ctaH = 44, urlH = 18;
    const optH = 34, bonusH = 18 + 30 + 12 + qBlock.lines.length * 24 + 10 + optH * 2 + 8 + 14 + fBlock.lines.length * 18 + 14 + ctaH + 6 + urlH + 14;
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.roundRect(P, y, W - 2 * P, bonusH, 20); ctx.fill();
    ctx.setLineDash([9, 6]); ctx.lineWidth = 3; ctx.strokeStyle = YELLOW; ctx.stroke(); ctx.setLineDash([]);
    let by = y + 18;
    pill(ctx, "BONUS TRIVIA", P + 18, by, 30, 18, YELLOW, INK, "Baloo 2", 14);
    by += 42;
    by += drawText(ctx, qBlock, P + 18, by, 24, INK, INK) + 10;
    const ow = (inW - 8) / 2;
    b.options.forEach((o, j) => {
      const ox = P + 18 + (j % 2) * (ow + 8), oy = by + Math.floor(j / 2) * (optH + 8);
      const correct = revealed && j === b.answer;
      ctx.fillStyle = correct ? GREEN : "#fff";
      ctx.strokeStyle = correct ? GREEN : "rgba(29,43,79,.15)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(ox, oy, ow, optH, 10); ctx.fill(); ctx.stroke();
      ctx.font = font(800, 14); ctx.fillStyle = correct ? "#fff" : INK;
      ctx.fillText(`${letters[j]}. ${o}`, ox + 12, oy + 9);
    });
    by += optH * 2 + 8 + 14;
    by += drawText(ctx, fBlock, P + 18, by, 18, MUTED, revealed ? GREEN : INK) + 14;
    // Call-to-action button + link (the copied email version makes the whole image clickable)
    ctx.fillStyle = issue.theme;
    ctx.beginPath(); ctx.roundRect(P + 18, by, inW, ctaH, 14); ctx.fill();
    ctx.font = font(800, 16); ctx.fillStyle = "#fff"; ctx.textAlign = "center";
    ctx.fillText(`${cta}  →`, W / 2, by + 13);
    ctx.font = font(700, 12); ctx.fillStyle = MUTED;
    ctx.fillText(displayUrl(d.link), W / 2, by + ctaH + 8);
    ctx.textAlign = "left";
    y += bonusH + 22;

    // Quote
    const qb = wrap(ctx, `"${issue.quote}"`, W - 2 * P - 48, 17, "Nunito", [800, 800], "italic");
    const quoteH = qb.lines.length * 24 + 32;
    ctx.fillStyle = INK;
    ctx.beginPath(); ctx.roundRect(P, y, W - 2 * P, quoteH, 18); ctx.fill();
    drawText(ctx, qb, P + 24, y + 16, 24, "#fff", "#fff", W - 2 * P - 48);
    y += quoteH + 18;

    // Tips
    ctx.font = font(800, 12);
    const tips = window.TIPS.map((t) => ({ t, w: ctx.measureText(t).width + 24 }));
    const rows = [[]];
    let rw = 0;
    tips.forEach((tp) => {
      if (rw + tp.w > W - 2 * P && rows[rows.length - 1].length) { rows.push([]); rw = 0; }
      rows[rows.length - 1].push(tp); rw += tp.w + 8;
    });
    rows.forEach((row) => {
      const total = row.reduce((s, tp) => s + tp.w, 0) + (row.length - 1) * 8;
      let tx = (W - total) / 2;
      row.forEach((tp) => { pill(ctx, tp.t, tx, y, 26, 12, "#e6f7ef", "#16795f", "Nunito", 12); tx += tp.w + 8; });
      y += 34;
    });
    ctx.font = font(700, 11); ctx.fillStyle = MUTED; ctx.textAlign = "center";
    ctx.fillText("The Weekly Trivia  ·  A new issue every Sunday  ·  A healthier, happier you", W / 2, y + 4);
    ctx.textAlign = "left";
    return y + 20 + P;
  }

  async function renderTrivia(width) {
    const issue = TriviaApp.getIssue();
    const icons = await Promise.all(issue.facts.slice(0, TriviaApp.MAX_FACTS).map((f) =>
      loadImage(f.image || svgToUrl(window.iconFor(f)))));
    const data = { issue, icons, revealed: TriviaApp.isRevealed(issue), link: bonusLink(issue), logos: await loadLogos() };
    return renderCanvas(width, draw, data);
  }

  // What gets exported. Pages can provide their own via window.ExportSource (e.g. the newsletter).
  function triviaSource() {
    const issue = TriviaApp.getIssue();
    return {
      render: renderTrivia,
      link: bonusLink(issue),
      file: `weekly-trivia-${issue.id}`,
      alt: `The Weekly Trivia - ${issue.title}. Click to answer the Bonus Trivia!`,
      linkText: "Click here to answer this week's Bonus Trivia &rarr;",
      copied: "Copied! Paste into your email (Ctrl+V). The image links to the Bonus Trivia."
    };
  }
  const getSource = () => (window.ExportSource ? window.ExportSource() : triviaSource());

  // ---- Dialog ----
  const dlg = $("exportDialog");
  let current = null; // { canvas, blob, url, type }

  const opts = () => ({
    type: dlg.querySelector('input[name="fmt"]:checked').value,
    width: Number($("expRes").value)
  });

  let job = 0;
  async function refresh() {
    const { type, width } = opts();
    const id = ++job;
    $("expInfo").textContent = "Generating...";
    $("expActions").querySelectorAll("button").forEach((b) => (b.disabled = true));
    const src = getSource();
    const canvas = await src.render(width);
    const blob = await new Promise((r) => canvas.toBlob(r, type, 0.92));
    if (id !== job) return;
    if (current) URL.revokeObjectURL(current.url);
    current = { canvas, blob, type, width, url: URL.createObjectURL(blob), link: src.link, src };
    current.html = emailHtml(canvas.toDataURL(type, 0.92));
    $("expPreview").src = current.url;
    const kb = blob.size / 1024;
    $("expInfo").textContent = `${canvas.width} × ${canvas.height} px · ${kb > 1024 ? (kb / 1024).toFixed(1) + " MB" : Math.round(kb) + " KB"}` +
      (blob.size > 1024 * 1024 ? " · tip: use JPEG or a smaller size for email" : "");
    $("expLink").textContent = current.link;
    $("expLink").href = current.link;
    $("expLocalWarn").classList.toggle("hidden", !/\/\/(localhost|127\.|\[::1\])/.test(current.link));
    $("expActions").querySelectorAll("button").forEach((b) => (b.disabled = false));
  }

  function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove("show"), 2400);
  }

  $("exportBtn").addEventListener("click", () => { dlg.showModal(); refresh(); });
  $("expClose").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.querySelectorAll('input[name="fmt"], #expRes').forEach((el) => el.addEventListener("change", refresh));

  $("expDownload").addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = current.url;
    a.download = `${current.src.file}-${current.width}px.${current.type === "image/png" ? "png" : "jpg"}`;
    a.click();
  });

  // Email-ready HTML: the whole image links to the page, plus a text link as backup
  function emailHtml(dataUrl) {
    const { link, src } = current;
    const alt = src.alt.replace(/"/g, "&quot;");
    return `<div><a href="${link}" target="_blank"><img src="${dataUrl}" width="600" alt="${alt}" style="display:block;width:100%;max-width:600px;height:auto;border:0"></a>` +
      `<p style="font-family:Arial,sans-serif;font-size:15px;font-weight:bold"><a href="${link}" target="_blank" style="color:#16a085">${src.linkText}</a></p></div>`;
  }

  // Fallback: select real linked content on the page and use the legacy copy command
  function legacyCopy() {
    const holder = document.createElement("div");
    holder.contentEditable = "true";
    holder.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0;";
    holder.innerHTML = current.html;
    document.body.appendChild(holder);
    const range = document.createRange();
    range.selectNodeContents(holder);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    const ok = document.execCommand("copy");
    sel.removeAllRanges();
    holder.remove();
    return ok;
  }

  $("expCopy").addEventListener("click", async () => {
    const ok = () => toast(current.src.copied);
    // Clipboard only accepts PNG images, so JPEG selections are copied as PNG.
    // The blob is passed as a promise so write() is called immediately within the click.
    const png = current.type === "image/png" ? current.blob
      : new Promise((r) => current.canvas.toBlob(r, "image/png"));
    const html = new Blob([current.html], { type: "text/html" });
    try {
      if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") throw new Error("unsupported");
      // text/html carries the clickable link; image/png is for apps that only accept a plain picture
      await navigator.clipboard.write([new ClipboardItem({ "text/html": html, "image/png": png })]);
      return ok();
    } catch (err) {
      console.warn("Clipboard API copy failed:", err);
    }
    if (legacyCopy()) return ok();
    toast(window.self !== window.top
      ? "Copy is blocked in this preview. Open the site in Chrome/Edge, or use Download."
      : "Copy isn't supported in this browser. Use Download instead.");
  });

  $("expPrint").addEventListener("click", () => {
    const frame = document.createElement("iframe");
    frame.style.cssText = "position:fixed;width:0;height:0;border:0;";
    document.body.appendChild(frame);
    const doc = frame.contentDocument;
    doc.open();
    doc.write(`<html><head><title>The Weekly Trivia</title><style>@page{margin:10mm}body{margin:0;text-align:center}img{max-width:100%;max-height:100vh}</style></head><body><img src="${current.url}"></body></html>`);
    doc.close();
    const img = doc.querySelector("img");
    const go = () => {
      frame.contentWindow.focus();
      frame.contentWindow.print();
      setTimeout(() => frame.remove(), 1000);
    };
    if (img.complete) go(); else img.onload = go;
  });
})();
