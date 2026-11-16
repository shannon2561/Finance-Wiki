/* Finance Wiki — 全站邏輯。
 * 資料來源：data/pages.json（metadata）、data/categories.json（分類）、content/concepts/<slug>.md（內文）。
 * 新增內容時不需要修改這個檔案（見 AGENTS.md 第 2 節）。 */
(function () {
  "use strict";

  const state = { pages: [], cats: [], catById: {}, bySlug: {} };

  async function loadData() {
    const [pages, cats] = await Promise.all([
      fetch("data/pages.json").then(r => r.json()),
      fetch("data/categories.json").then(r => r.json())
    ]);
    state.cats = cats;
    cats.forEach(c => (state.catById[c.id] = c));
    state.pages = pages.filter(p => p.status === "published");
    state.pages.forEach(p => (state.bySlug[p.slug] = p));
  }

  const esc = s => String(s).replace(/[&<>"']/g, ch =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const color = p => (state.catById[p.category] || {}).color || "#5B6472";
  const catName = p => (state.catById[p.category] || {}).name || p.category;
  const href = slug => "concept.html#" + encodeURIComponent(slug);

  function cardHTML(p) {
    return `<a class="card" href="${href(p.slug)}" style="--c:${color(p)}">
      <div class="meta"><span class="cat">${esc(catName(p))}</span><span class="level">${esc(p.level)}</span></div>
      <h3>${esc(p.title)}</h3>
      <div class="en">${esc(p.title_en)}</div>
      <p>${esc(p.summary)}</p>
      <div class="tags">${p.tags.map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>
    </a>`;
  }

  /* ---------------- 首頁 ---------------- */
  function renderHome() {
    const $ = id => document.getElementById(id);
    $("stat-pages").textContent = state.pages.length;
    $("stat-cats").textContent = state.cats.filter(c => state.pages.some(p => p.category === c.id)).length;
    const latest = state.pages.map(p => p.updated).sort().pop() || "—";
    $("stat-updated").textContent = latest;

    let activeCat = "all";
    const chips = $("chips");
    const chipData = [{ id: "all", name: "全部", color: "#1F2A37" }].concat(state.cats);
    chips.innerHTML = chipData.map(c => {
      const n = c.id === "all" ? state.pages.length : state.pages.filter(p => p.category === c.id).length;
      return `<button class="chip${c.id === "all" ? " on" : ""}" data-cat="${c.id}" style="--c:${c.color}">
        ${c.id === "all" ? "" : '<span class="dot"></span>'}${esc(c.name)} <small>${n}</small></button>`;
    }).join("");

    const search = $("search");
    const grid = $("grid");
    function draw() {
      const q = search.value.trim().toLowerCase();
      const list = state.pages.filter(p => {
        if (activeCat !== "all" && p.category !== activeCat) return false;
        if (!q) return true;
        return [p.title, p.title_en, p.summary, p.slug, catName(p)].concat(p.tags)
          .join(" ").toLowerCase().includes(q);
      });
      grid.innerHTML = list.length ? list.map(cardHTML).join("")
        : `<div class="empty">找不到符合「${esc(search.value)}」的概念。</div>`;
    }
    chips.addEventListener("click", e => {
      const b = e.target.closest(".chip");
      if (!b) return;
      activeCat = b.dataset.cat;
      chips.querySelectorAll(".chip").forEach(x => x.classList.toggle("on", x === b));
      draw();
    });
    search.addEventListener("input", draw);
    draw();

    $("map").innerHTML = state.cats.map(c => {
      const items = state.pages.filter(p => p.category === c.id);
      if (!items.length) return "";
      return `<div class="map-col" style="--c:${c.color}">
        <h4>${esc(c.name)}</h4><div class="desc">${esc(c.desc)}</div>
        <ol>${items.map(p => `<li><a href="${href(p.slug)}">${esc(p.title)}</a><small>${esc(p.level)}</small></li>`).join("")}</ol>
      </div>`;
    }).join("");
  }

  /* ---------------- Markdown + 數學式 ---------------- */
  function renderMarkdown(md) {
    const maths = [];
    // 1. 先把數學式抽出來，避免 Markdown 把底線、星號吃掉
    md = md.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => {
      maths.push({ tex, display: true });
      return `\n\nMATHBLOCK${maths.length - 1}END\n\n`;
    });
    md = md.replace(/\$([^\$\n]+?)\$/g, (_, tex) => {
      maths.push({ tex, display: false });
      return `MATHINLINE${maths.length - 1}END`;
    });
    // 2. [[slug]] / [[slug|文字]] → 連結
    md = md.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, slug, text) => {
      slug = slug.trim();
      const p = state.bySlug[slug];
      const label = text || (p ? p.title : slug);
      return p ? `<a class="wikilink" href="${href(slug)}">${esc(label)}</a>`
               : `<span class="missing">${esc(label)}</span>`;
    });
    // 3. Markdown → HTML
    let html = window.marked.parse(md, { gfm: true, breaks: false });
    // 4. 放回數學式
    const tex = (m) => {
      try { return window.katex.renderToString(m.tex, { displayMode: m.display, throwOnError: false }); }
      catch (e) { return esc(m.tex); }
    };
    html = html.replace(/<p>\s*MATHBLOCK(\d+)END\s*<\/p>/g, (_, i) => `<div class="math-display">${tex(maths[i])}</div>`);
    html = html.replace(/MATHBLOCK(\d+)END/g, (_, i) => `<div class="math-display">${tex(maths[i])}</div>`);
    html = html.replace(/MATHINLINE(\d+)END/g, (_, i) => tex(maths[i]));
    return html;
  }

  // 把每個 h2 與其後的內容包成 <section>，方便套樣式
  function sectionize(container) {
    const nodes = Array.from(container.childNodes);
    container.innerHTML = "";
    let sec = null;
    nodes.forEach(n => {
      if (n.nodeName === "H2") {
        sec = document.createElement("section");
        const t = n.textContent.trim();
        if (t === "一句話") sec.className = "lede";
        if (t === "延伸閱讀") sec.className = "refs";
        container.appendChild(sec);
      }
      (sec || container).appendChild(n);
    });
  }

  /* ---------------- 概念頁 ---------------- */
  async function renderConcept() {
    const slug = decodeURIComponent(location.hash.slice(1)) || new URLSearchParams(location.search).get("id");
    window.scrollTo(0, 0);
    const p = state.bySlug[slug];
    const root = document.getElementById("concept");
    if (!p) {
      root.innerHTML = `<div class="notfound"><h1>找不到這個概念</h1>
        <p>可能還沒上架，或網址打錯了。</p><p><a href="index.html">回到首頁</a></p></div>`;
      return;
    }
    document.title = `${p.title}｜Finance Wiki`;
    root.style.setProperty("--c", color(p));

    let md = "";
    try {
      const r = await fetch(`content/concepts/${encodeURIComponent(slug)}.md`);
      if (!r.ok) throw new Error(r.status);
      md = await r.text();
    } catch (e) {
      md = "> 內文載入失敗。如果你是直接雙擊打開 HTML 檔，請改用本機伺服器預覽（見 AGENTS.md 7.1）。";
    }

    const siblings = state.pages.filter(x => x.category === p.category);
    const idx = siblings.indexOf(p);
    const prev = siblings[idx - 1], next = siblings[idx + 1];
    const related = p.related.map(s => state.bySlug[s]).filter(Boolean);

    root.innerHTML = `
      <article>
        <div class="crumbs"><a href="index.html">首頁</a> / <a href="index.html#map">${esc(catName(p))}</a></div>
        <header class="concept-head">
          <span class="cat" style="--c:${color(p)}">${esc(catName(p))}</span>
          <h1>${esc(p.title)}</h1>
          <div class="en">${esc(p.title_en)}</div>
          <p class="summary">${esc(p.summary)}</p>
        </header>
        <div class="article" id="article"></div>
        <nav class="pager">
          <span>${prev ? `<a href="${href(prev.slug)}"><small>← 上一篇（${esc(catName(p))}）</small>${esc(prev.title)}</a>` : ""}</span>
          <span style="text-align:right">${next ? `<a href="${href(next.slug)}"><small>下一篇（${esc(catName(p))}）→</small>${esc(next.title)}</a>` : ""}</span>
        </nav>
      </article>
      <aside class="side">
        <div class="panel">
          <h5>概念資訊</h5>
          <dl class="facts">
            <dt>分類</dt><dd>${esc(catName(p))}</dd>
            <dt>程度</dt><dd>${esc(p.level)}</dd>
            <dt>更新</dt><dd>${esc(p.updated)}</dd>
          </dl>
          <div class="tags" style="margin-top:12px">${p.tags.map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>
        </div>
        <div class="panel">
          <h5>相關概念</h5>
          <div class="rel">${related.map(r =>
            `<a href="${href(r.slug)}">${esc(r.title)}<small>${esc(catName(r))}・${esc(r.level)}</small></a>`).join("")}</div>
        </div>
      </aside>`;

    const art = document.getElementById("article");
    art.innerHTML = renderMarkdown(md);
    sectionize(art);
  }

  /* ---------------- 啟動 ---------------- */
  document.addEventListener("DOMContentLoaded", async () => {
    try {
      await loadData();
    } catch (e) {
      const m = document.querySelector("main");
      if (m) m.insertAdjacentHTML("afterbegin",
        `<div class="wrap empty">資料載入失敗。若是直接雙擊打開檔案，請改用 <code>python -m http.server</code> 預覽。</div>`);
      return;
    }
    const page = document.body.dataset.page;
    if (page === "home") renderHome();
    if (page === "concept") {
      renderConcept();
      window.addEventListener("hashchange", renderConcept);
    }
    const n = document.getElementById("footer-count");
    if (n) n.textContent = state.pages.length;
  });
})();
