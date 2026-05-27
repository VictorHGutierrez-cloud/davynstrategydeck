/**
 * Davyn Sales Execution Platform — client app
 */
(function () {
  const D = window.DAVYN;
  if (!D) return;

  const nav = document.getElementById("main-nav");
  const panels = document.querySelectorAll("[data-panel]");
  const searchInput = document.getElementById("global-search");
  const searchResults = document.getElementById("search-results");
  const cmdPalette = document.getElementById("cmd-palette");
  const mobileToggle = document.getElementById("nav-toggle");
  const sidebar = document.getElementById("sidebar");

  const sections = [
    { id: "home", label: "Command center", icon: "⌂" },
    { id: "stages", label: "Deal stage navigator", icon: "◎" },
    { id: "objections", label: "Objection intelligence", icon: "⚡" },
    { id: "verticals", label: "Vertical playbooks", icon: "▦" },
    { id: "discovery", label: "Discovery frameworks", icon: "◉" },
    { id: "battlecards", label: "Competitive battlecards", icon: "⬡" },
    { id: "messaging", label: "Executive messaging", icon: "✦" },
    { id: "followups", label: "Follow-up templates", icon: "↗" },
    { id: "security", label: "Security & compliance", icon: "⛨" },
    { id: "roi", label: "ROI narratives", icon: "◈" },
    { id: "caribbean", label: "Caribbean insights", icon: "◐" },
    { id: "assets", label: "Related assets", icon: "▤" },
  ];

  let currentSection = "home";
  let selectedObjection = D.objections[0].id;
  let selectedStage = D.dealStages[0].id;
  let selectedVertical = D.verticals[0].id;

  /* ——— Navigation ——— */
  function buildNav() {
    if (!nav) return;
    nav.innerHTML = sections
      .map(
        (s) =>
          `<button type="button" class="nav-link" data-section="${s.id}" aria-current="${s.id === "home" ? "page" : "false"}">
            <span class="nav-icon">${s.icon}</span><span>${s.label}</span>
          </button>`
      )
      .join("");
    nav.querySelectorAll(".nav-link").forEach((btn) => {
      btn.addEventListener("click", () => go(btn.getAttribute("data-section")));
    });
  }

  function go(section, param) {
    currentSection = section;
    panels.forEach((p) => {
      p.hidden = p.getAttribute("data-panel") !== section;
    });
    nav.querySelectorAll(".nav-link").forEach((b) => {
      const active = b.getAttribute("data-section") === section;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-current", active ? "page" : "false");
    });
    if (param) {
      if (section === "objections") selectObjection(param);
      if (section === "stages") selectStage(param);
      if (section === "verticals") selectVertical(param);
    }
    if (section === "objections") renderObjection();
    if (section === "stages") renderStage();
    if (section === "verticals") renderVertical();
    if (section === "messaging") updateMessage();
    closeSidebar();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  window.davynGo = go;

  /* ——— Home triage ——— */
  function buildHome() {
    const stageEl = document.getElementById("triage-stages");
    const problemEl = document.getElementById("triage-problems");
    const customerEl = document.getElementById("triage-customers");
    const recEl = document.getElementById("triage-recommendation");

    if (stageEl) {
      stageEl.innerHTML = D.dealStages
        .map((s) => `<button type="button" class="triage-chip" data-stage="${s.id}">${s.label}</button>`)
        .join("");
      stageEl.querySelectorAll("[data-stage]").forEach((b) => {
        b.addEventListener("click", () => {
          stageEl.querySelectorAll(".triage-chip").forEach((c) => c.classList.remove("is-selected"));
          b.classList.add("is-selected");
          updateRecommendation();
        });
      });
    }

    if (problemEl) {
      problemEl.innerHTML = D.problems
        .map((p) => `<button type="button" class="triage-chip" data-problem="${p.id}" data-route="${p.route}">${p.label}</button>`)
        .join("");
      problemEl.querySelectorAll("[data-problem]").forEach((b) => {
        b.addEventListener("click", () => {
          problemEl.querySelectorAll(".triage-chip").forEach((c) => c.classList.remove("is-selected"));
          b.classList.add("is-selected");
          updateRecommendation();
        });
      });
    }

    if (customerEl) {
      customerEl.innerHTML = D.customerTypes
        .map((c) => `<button type="button" class="triage-chip" data-customer="${c.id}">${c.label}</button>`)
        .join("");
      customerEl.querySelectorAll("[data-customer]").forEach((b) => {
        b.addEventListener("click", () => {
          customerEl.querySelectorAll(".triage-chip").forEach((c) => c.classList.remove("is-selected"));
          b.classList.add("is-selected");
          updateRecommendation();
        });
      });
    }

    function updateRecommendation() {
      if (!recEl) return;
      const stage = stageEl && stageEl.querySelector(".is-selected");
      const problem = problemEl && problemEl.querySelector(".is-selected");
      const customer = customerEl && customerEl.querySelector(".is-selected");

      if (!stage && !problem && !customer) {
        recEl.innerHTML = '<p class="muted">Select at least one filter above to get a recommended next action.</p>';
        return;
      }

      let html = '<div class="rec-card">';
      html += "<h3>Recommended next action</h3><ul>";

      if (problem) {
        const p = D.problems.find((x) => x.id === problem.getAttribute("data-problem"));
        html += `<li><strong>Go to:</strong> ${p.label} — <button type="button" class="link-btn" data-go="${p.route}">Open module →</button></li>`;
      }
      if (stage) {
        const s = D.dealStages.find((x) => x.id === stage.getAttribute("data-stage"));
        html += `<li><strong>Stage focus:</strong> ${s.goal}</li>`;
        html += `<li><strong>Do next:</strong> ${s.next}</li>`;
      }
      if (customer) {
        const c = D.customerTypes.find((x) => x.id === customer.getAttribute("data-customer"));
        html += `<li><strong>Customer lens:</strong> ${c.desc}</li>`;
        if (c.verticals.length) {
          html += `<li><strong>Verticals:</strong> ${c.verticals.map((v) => {
            const vert = D.verticals.find((x) => x.id === v);
            return vert ? vert.name : v;
          }).join(", ")}</li>`;
        }
      }

      html += "</ul></div>";
      recEl.innerHTML = html;
      recEl.querySelectorAll("[data-go]").forEach((btn) => {
        btn.addEventListener("click", () => go(btn.getAttribute("data-go")));
      });
    }
  }

  /* ——— Objections ——— */
  function buildObjectionList() {
    const list = document.getElementById("objection-list");
    if (!list) return;
    list.innerHTML = D.objections
      .map(
        (o) =>
          `<button type="button" class="list-item ${o.id === selectedObjection ? "is-active" : ""}" data-obj="${o.id}">
            <span>${o.title}</span>
            <span class="tags">${o.tags.slice(0, 2).join(" · ")}</span>
          </button>`
      )
      .join("");
    list.querySelectorAll("[data-obj]").forEach((b) => {
      b.addEventListener("click", () => selectObjection(b.getAttribute("data-obj")));
    });
  }

  function selectObjection(id) {
    selectedObjection = id;
    buildObjectionList();
    renderObjection();
  }

  function renderObjection() {
    const el = document.getElementById("objection-detail");
    const o = D.objections.find((x) => x.id === selectedObjection);
    if (!el || !o) return;

    el.innerHTML = `
      <header class="panel-header">
        <h2>${esc(o.title)}</h2>
        <div class="tag-row">${o.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
      </header>
      <div class="action-banner">${esc(o.next)}</div>
      <div class="intel-grid">
        ${block("Short answer (live call)", o.short, "accent")}
        ${block("Executive answer", o.executive)}
        ${block("Technical answer", o.technical)}
        ${block("Discovery questions", listItems(o.discovery))}
        ${block("Suggested follow-up", `<pre class="copy-block">${esc(o.followup)}</pre><button type="button" class="copy-btn" data-copy="${escAttr(o.followup)}">Copy follow-up</button>`)}
        ${block("Business risks", listItems(o.risks))}
        ${block("Related modules", o.assets.map((a) => `<button type="button" class="link-btn" data-go="${a.route}">${esc(a.label)} →</button>`).join(" "))}
      </div>`;

    el.querySelectorAll(".copy-btn").forEach((btn) => {
      btn.addEventListener("click", () => copyText(btn.getAttribute("data-copy"), btn));
    });
    el.querySelectorAll("[data-go]").forEach((btn) => {
      btn.addEventListener("click", () => go(btn.getAttribute("data-go")));
    });
  }

  /* ——— Stages ——— */
  function buildStageList() {
    const list = document.getElementById("stage-list");
    if (!list) return;
    list.innerHTML = D.dealStages
      .map(
        (s) =>
          `<button type="button" class="list-item ${s.id === selectedStage ? "is-active" : ""}" data-stage-id="${s.id}">
            <span>${s.icon} ${s.label}</span>
          </button>`
      )
      .join("");
    list.querySelectorAll("[data-stage-id]").forEach((b) => {
      b.addEventListener("click", () => selectStage(b.getAttribute("data-stage-id")));
    });
  }

  function selectStage(id) {
    selectedStage = id;
    buildStageList();
    renderStage();
  }

  function renderStage() {
    const el = document.getElementById("stage-detail");
    const s = D.dealStages.find((x) => x.id === selectedStage);
    if (!el || !s) return;

    el.innerHTML = `
      <header class="panel-header">
        <h2>${s.icon} ${esc(s.label)}</h2>
        <p class="lead">${esc(s.goal)}</p>
      </header>
      <div class="action-banner">${esc(s.next)}</div>
      <div class="intel-grid">
        ${block("Key actions", listItems(s.actions))}
        ${block("Questions to ask", listItems(s.questions))}
        ${block("Risks at this stage", listItems(s.risks))}
        ${block("Related modules", s.assets.map((a) => `<button type="button" class="link-btn" data-go="${a}">${esc(a)} →</button>`).join(" "))}
      </div>`;
    el.querySelectorAll("[data-go]").forEach((btn) => {
      btn.addEventListener("click", () => go(btn.getAttribute("data-go")));
    });
  }

  /* ——— Verticals ——— */
  function buildVerticalList() {
    const list = document.getElementById("vertical-list");
    if (!list) return;
    list.innerHTML = D.verticals
      .map(
        (v) =>
          `<button type="button" class="list-item ${v.id === selectedVertical ? "is-active" : ""}" data-vert="${v.id}">
            <span>${v.name}</span>
          </button>`
      )
      .join("");
    list.querySelectorAll("[data-vert]").forEach((b) => {
      b.addEventListener("click", () => selectVertical(b.getAttribute("data-vert")));
    });
  }

  function selectVertical(id) {
    selectedVertical = id;
    buildVerticalList();
    renderVertical();
  }

  function renderVertical() {
    const el = document.getElementById("vertical-detail");
    const v = D.verticals.find((x) => x.id === selectedVertical);
    if (!el || !v) return;

    const assetLinks = v.assets.length
      ? v.assets.map((a) => `<a href="${a}" target="_blank" rel="noopener">${a.split("/").pop()} ↗</a>`).join(" · ")
      : "Use discovery + ROI modules for this vertical.";

    el.innerHTML = `
      <header class="panel-header">
        <h2>${esc(v.name)}</h2>
        <p class="lead"><strong>Microsoft stack:</strong> ${esc(v.microsoft)}</p>
      </header>
      <div class="intel-grid">
        ${block("Core pains", listItems(v.pains))}
        ${block("Target outcomes", listItems(v.outcomes))}
        ${block("Discovery prompts", listItems(v.discovery))}
        ${block("Davyn positioning", esc(v.davynAngle))}
        ${block("Downloadable assets", assetLinks)}
      </div>`;
  }

  /* ——— Static panels ——— */
  function buildDiscovery() {
    const el = document.getElementById("discovery-content");
    if (!el) return;
    const f = D.discoveryFramework;
    el.innerHTML = `
      <p class="lead">${esc(f.intro)}</p>
      <div class="action-banner">Call output: ${f.output.join(" · ")}</div>
      <div class="phase-grid">${f.phases
        .map(
          (p) => `
        <div class="phase-card">
          <h3>${esc(p.name)}</h3>
          <ul>${p.prompts.map((q) => `<li>${esc(q)}</li>`).join("")}</ul>
        </div>`
        )
        .join("")}</div>`;
  }

  function buildBattlecards() {
    const el = document.getElementById("battlecards-content");
    if (!el) return;
    el.innerHTML = D.battlecards
      .map(
        (b) => `
      <article class="battle-card">
        <h3>vs. ${esc(b.competitor)}</h3>
        <p><strong>When you hear it:</strong> ${esc(b.when)}</p>
        <p><strong>Win on:</strong> ${esc(b.win)}</p>
        <p class="talk-track"><strong>Talk track:</strong> ${esc(b.talk)}</p>
        <p class="trap"><strong>Trap to avoid:</strong> ${esc(b.trap)}</p>
      </article>`
      )
      .join("");
  }

  function buildFollowups() {
    const el = document.getElementById("followups-content");
    if (!el) return;
    el.innerHTML = D.followups
      .map(
        (f) => `
      <article class="follow-card">
        <h3>${esc(f.name)}</h3>
        <p><strong>Subject:</strong> ${esc(f.subject)}</p>
        <pre class="copy-block">${esc(f.body)}</pre>
        <button type="button" class="copy-btn" data-copy="${escAttr(f.subject + "\n\n" + f.body)}">Copy email</button>
      </article>`
      )
      .join("");
    el.querySelectorAll(".copy-btn").forEach((btn) => {
      btn.addEventListener("click", () => copyText(btn.getAttribute("data-copy"), btn));
    });
  }

  function buildSecurity() {
    const el = document.getElementById("security-content");
    if (!el) return;
    el.innerHTML = D.security
      .map((s) => `<details class="faq"><summary>${esc(s.q)}</summary><p>${esc(s.a)}</p></details>`)
      .join("");
  }

  function buildRoi() {
    const el = document.getElementById("roi-content");
    if (!el) return;
    el.innerHTML = D.roiNarratives
      .map(
        (r) => `
      <article class="roi-card">
        <h3>${esc(r.headline)}</h3>
        <ul>${r.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
        <p class="ask"><strong>Ask:</strong> ${esc(r.ask)}</p>
      </article>`
      )
      .join("");
  }

  function buildCaribbean() {
    const el = document.getElementById("caribbean-content");
    if (!el) return;
    const c = D.caribbean;
    el.innerHTML = `
      <div class="intel-grid">
        ${block("Regional themes", listItems(c.themes))}
        ${block("Buyer signals (read the deal)", listItems(c.buyerSignals))}
        ${block("Davyn proof points", listItems(c.davynProof))}
      </div>`;
  }

  function buildAssets() {
    const el = document.getElementById("assets-content");
    if (!el) return;
    el.innerHTML = `
      <p class="lead">Downloadable files linked to sales motions — not a file dump. Use after discovery aligns.</p>
      <div class="asset-table">${D.assets
        .map(
          (a) => `
        <div class="asset-row">
          <span class="asset-type">${esc(a.type)}</span>
          <a href="${a.path}" target="_blank" rel="noopener">${esc(a.title)}</a>
          <span class="tags">${a.tags.join(", ")}</span>
          <a class="dl-link" href="${a.path}" download>Download</a>
        </div>`
        )
        .join("")}</div>
      <p class="muted" style="margin-top:16px">Full index: <a href="assets/ASSET_INDEX_EN.md">ASSET_INDEX_EN.md</a></p>`;
  }

  /* ——— Messaging generator ——— */
  function buildMessagingForm() {
    const persona = document.getElementById("msg-persona");
    const outcome = document.getElementById("msg-outcome");
    const vertical = document.getElementById("msg-vertical");
    const product = document.getElementById("msg-product");

    if (persona) {
      persona.innerHTML = D.messagingTemplates.personas.map((p) => `<option>${esc(p)}</option>`).join("");
    }
    if (outcome) {
      outcome.innerHTML =
        '<option value="">— Select outcome —</option>' +
        D.messagingTemplates.outcomes.map((o) => `<option>${esc(o)}</option>`).join("");
    }
    if (vertical) {
      vertical.innerHTML =
        '<option value="">— Any vertical —</option>' +
        D.verticals.map((v) => `<option>${esc(v.name)}</option>`).join("");
    }
    [persona, outcome, vertical, product].forEach((el) => {
      if (el) el.addEventListener("change", updateMessage);
      if (el && el.tagName === "INPUT") el.addEventListener("input", updateMessage);
    });
    updateMessage();
  }

  function updateMessage() {
    const out = document.getElementById("msg-output");
    if (!out) return;
    const persona = document.getElementById("msg-persona").value;
    const outcome = document.getElementById("msg-outcome").value;
    const vertical = document.getElementById("msg-vertical").value;
    const product = document.getElementById("msg-product").value.trim() || "Microsoft business solutions";
    const text = D.messagingTemplates.generate(persona, outcome, vertical, product);
    out.textContent = text;
  }

  document.getElementById("msg-copy") &&
    document.getElementById("msg-copy").addEventListener("click", function () {
      copyText(document.getElementById("msg-output").textContent, this);
    });

  /* ——— Global search / command palette ——— */
  function buildSearchIndex() {
    const items = [];
    D.objections.forEach((o) => items.push({ type: "Objection", label: o.title, section: "objections", id: o.id, hay: o.title + " " + o.tags.join(" ") + " " + o.short }));
    D.dealStages.forEach((s) => items.push({ type: "Stage", label: s.label, section: "stages", id: s.id, hay: s.label + " " + s.goal }));
    D.verticals.forEach((v) => items.push({ type: "Vertical", label: v.name, section: "verticals", id: v.id, hay: v.name + " " + v.pains.join(" ") }));
    sections.forEach((s) => items.push({ type: "Module", label: s.label, section: s.id, hay: s.label }));
    return items;
  }

  const searchIndex = buildSearchIndex();

  function runSearch(q) {
    q = (q || "").toLowerCase().trim();
    if (!q) return [];
    return searchIndex.filter((i) => i.hay.toLowerCase().includes(q)).slice(0, 8);
  }

  function showSearchResults(results) {
    if (!searchResults) return;
    if (!results.length) {
      searchResults.hidden = true;
      return;
    }
    searchResults.hidden = false;
    searchResults.innerHTML = results
      .map(
        (r) =>
          `<button type="button" class="search-hit" data-section="${r.section}" data-id="${r.id || ""}">
            <span class="hit-type">${esc(r.type)}</span>${esc(r.label)}
          </button>`
      )
      .join("");
    searchResults.querySelectorAll(".search-hit").forEach((btn) => {
      btn.addEventListener("click", () => {
        go(btn.getAttribute("data-section"), btn.getAttribute("data-id") || undefined);
        searchResults.hidden = true;
        if (searchInput) searchInput.value = "";
        if (cmdPalette) cmdPalette.hidden = true;
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => showSearchResults(runSearch(searchInput.value)));
    searchInput.addEventListener("focus", () => showSearchResults(runSearch(searchInput.value)));
  }

  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }
    if (e.key === "Escape") {
      if (searchResults) searchResults.hidden = true;
    }
  });

  document.addEventListener("click", (e) => {
    if (searchResults && !searchResults.contains(e.target) && e.target !== searchInput) {
      searchResults.hidden = true;
    }
  });

  /* ——— Mobile sidebar ——— */
  function closeSidebar() {
    if (sidebar) sidebar.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  }

  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener("click", () => {
      sidebar.classList.toggle("is-open");
      document.body.classList.toggle("nav-open");
    });
  }

  /* ——— Helpers ——— */
  function esc(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function escAttr(s) {
    return s.replace(/"/g, "&quot;").replace(/\n/g, "&#10;");
  }

  function listItems(arr) {
    return "<ul>" + arr.map((x) => `<li>${esc(x)}</li>`).join("") + "</ul>";
  }

  function block(title, body, mod) {
    return `<section class="intel-block ${mod || ""}"><h3>${esc(title)}</h3><div class="intel-body">${body}</div></section>`;
  }

  function copyText(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
      const prev = btn.textContent;
      btn.textContent = "Copied ✓";
      setTimeout(() => {
        btn.textContent = prev;
      }, 1500);
    });
  }

  /* ——— Init ——— */
  buildNav();
  buildHome();
  buildObjectionList();
  buildStageList();
  buildVerticalList();
  buildDiscovery();
  buildBattlecards();
  buildFollowups();
  buildSecurity();
  buildRoi();
  buildCaribbean();
  buildAssets();
  buildMessagingForm();
  renderObjection();
  renderStage();
  renderVertical();
})();
