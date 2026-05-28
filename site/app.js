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
    { id: "precall", label: "Pre-call pack", icon: "◷" },
    { id: "postcall", label: "Post-call pack", icon: "✉" },
    { id: "proposal", label: "Proposal agent", icon: "✎" },
    { id: "stages", label: "Deal stage navigator", icon: "◎" },
    { id: "objections", label: "Objection intelligence", icon: "⚡" },
    { id: "msft-factorial", label: "Microsoft × Factorial", icon: "⊞" },
    { id: "product-pitches", label: "Product pitch decks", icon: "▣" },
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
  let selectedPitch = (D.productPitches && D.productPitches.decks[0] && D.productPitches.decks[0].id) || null;
  let pitchCategoryFilter = "all";

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
      if (section === "product-pitches") selectProductPitch(param);
    }
    if (section === "objections") renderObjection();
    if (section === "stages") renderStage();
    if (section === "verticals") renderVertical();
    if (section === "product-pitches") renderProductPitches();
    if (section === "messaging") updateMessage();
    if (section === "precall") initPreCallForm();
    if (section === "postcall") initPostCallForm();
    if (section === "proposal") initProposalForm();
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

  function getObjEnhancement(id) {
    const p = D.packs && D.packs.objectionEnhancements;
    return (p && p[id]) || {};
  }

  function getAttachmentLinks(keys) {
    if (!keys || !keys.length || !D.packs || !D.packs.attachmentCatalog) return "";
    return keys
      .map((k) => {
        const a = D.packs.attachmentCatalog[k];
        if (!a) return "";
        return `<a href="${a.path}" target="_blank" rel="noopener">${esc(a.label)} ↗</a> · <a href="${a.path}" download>Download</a>`;
      })
      .filter(Boolean)
      .join("<br />");
  }

  function renderObjection() {
    const el = document.getElementById("objection-detail");
    const o = D.objections.find((x) => x.id === selectedObjection);
    if (!el || !o) return;
    const enh = getObjEnhancement(o.id);
    const smMid = enh.smMidFast || o.short;
    const exit = enh.exitCriteria || o.next;
    const workshop = enh.workshopAgenda && enh.workshopAgenda.length ? listItems(enh.workshopAgenda) : "<p class='muted'>Use discovery questions + schedule a focused session.</p>";
    const attachHtml = getAttachmentLinks(enh.attachKeys);

    el.innerHTML = `
      <header class="panel-header">
        <h2>${esc(o.title)}</h2>
        <div class="tag-row">${o.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
      </header>
      <div class="action-banner">${esc(o.next)}</div>
      <div class="intel-grid">
        ${block("SMB/Mid — say this on the call", `<p class="talk-track-lg">${esc(smMid)}</p>`, "accent")}
        ${block("Short answer (live call)", o.short, "accent")}
        ${block("Executive answer", o.executive)}
        ${block("Technical answer", o.technical)}
        ${block("Discovery questions", listItems(o.discovery))}
        ${block("Exit criteria (move forward when…)", esc(exit))}
        ${block("Workshop agenda (if Legal/IT involved)", workshop)}
        ${block("Suggested follow-up email", `<pre class="copy-block">${esc(o.followup)}</pre><button type="button" class="copy-btn" data-copy="${escAttr(o.followup)}">Copy follow-up</button>`)}
        ${block("Business risks", listItems(o.risks))}
        ${attachHtml ? block("Attach now", attachHtml) : ""}
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
        ${
          v.v2
            ? block(
                "Execution playbook (SMB/Mid)",
                `<p><strong>Talk track:</strong> ${esc(v.v2.talkTrack)}</p>
                 <p><strong>Typical triggers:</strong></p>${listItems(v.v2.triggers)}
                 <p><strong>Personas:</strong></p><ul>${Object.keys(v.v2.personas)
                   .map((k) => `<li><strong>${esc(k)}:</strong> ${esc(v.v2.personas[k])}</li>`)
                   .join("")}</ul>
                 <p><strong>90-day outcomes:</strong></p>${listItems(v.v2.outcomes90)}
                 <p><strong>Deal risks:</strong></p>${listItems(v.v2.dealRisks)}
                 <p><strong>Evidence to capture on calls:</strong></p>${listItems(v.v2.proofPrompts)}`
              )
            : ""
        }
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
      <p class="muted">For Factorial product decks, use <button type="button" class="link-btn" data-go="product-pitches">Product pitch decks →</button> to view .pptx in browser.</p>
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
    el.querySelectorAll("[data-go]").forEach((btn) => {
      btn.addEventListener("click", () => go(btn.getAttribute("data-go")));
    });
  }

  /* ——— Product pitch decks ——— */
  function getFilteredPitches() {
    if (!D.productPitches) return [];
    const decks = D.productPitches.decks || [];
    if (pitchCategoryFilter === "all") return decks;
    return decks.filter((d) => d.category === pitchCategoryFilter);
  }

  function buildPitchCategoryFilters() {
    const el = document.getElementById("pitch-category-filters");
    if (!el || !D.productPitches) return;
    el.innerHTML = D.productPitches.categories
      .map(
        (c) =>
          `<button type="button" class="triage-chip ${c.id === pitchCategoryFilter ? "is-selected" : ""}" data-pitch-cat="${c.id}">${esc(c.label)}</button>`
      )
      .join("");
    el.querySelectorAll("[data-pitch-cat]").forEach((btn) => {
      btn.addEventListener("click", () => {
        pitchCategoryFilter = btn.getAttribute("data-pitch-cat");
        buildPitchCategoryFilters();
        buildPitchList();
        const filtered = getFilteredPitches();
        if (filtered.length && !filtered.find((d) => d.id === selectedPitch)) {
          selectProductPitch(filtered[0].id);
        } else {
          renderProductPitchDetail();
        }
      });
    });
  }

  function buildPitchList() {
    const list = document.getElementById("pitch-list");
    if (!list) return;
    const decks = getFilteredPitches();
    list.innerHTML = decks
      .map(
        (d) =>
          `<button type="button" class="list-item ${d.id === selectedPitch ? "is-active" : ""}" data-pitch="${d.id}">
            <span>${esc(d.title)}</span>
            <span class="tags">${d.tags.slice(0, 2).join(" · ")}</span>
          </button>`
      )
      .join("");
    list.querySelectorAll("[data-pitch]").forEach((b) => {
      b.addEventListener("click", () => selectProductPitch(b.getAttribute("data-pitch")));
    });
  }

  function selectProductPitch(id) {
    if (!id) return;
    selectedPitch = id;
    buildPitchList();
    renderProductPitchDetail();
  }

  function renderProductPitchDetail() {
    const el = document.getElementById("pitch-detail");
    const deck = D.productPitches && D.productPitches.decks.find((d) => d.id === selectedPitch);
    if (!el || !deck) return;

    const cat = D.productPitches.categories.find((c) => c.id === deck.category);
    el.innerHTML = `
      <header class="panel-header">
        <h2>${esc(deck.title)}</h2>
        <div class="tag-row">
          <span class="tag">${esc(cat ? cat.label : deck.category)}</span>
          ${deck.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}
        </div>
      </header>
      <div class="action-banner">Use when: ${esc(deck.useWhen)}</div>
      <div class="pitch-viewer-shell" id="pitch-viewer-shell">
        <div class="pitch-canvas-wrap" id="pitch-viewer-wrap" tabindex="0" aria-label="Slide viewer — use arrow keys">
          <canvas id="pitch-canvas" width="1280" height="720"></canvas>
        </div>
        <div class="pitch-toolbar">
          <button type="button" class="btn-secondary" id="pitch-prev" aria-label="Previous slide">← Prev</button>
          <button type="button" class="btn-secondary" id="pitch-next" aria-label="Next slide">Next →</button>
          <span class="pitch-slide-counter" id="pitch-slide-counter">Loading…</span>
          <span class="pitch-viewer-status muted" id="pitch-viewer-status"></span>
          <a class="dl-link pitch-dl" href="${deck.path}" download>Download .pptx</a>
        </div>
      </div>
      <p class="muted pitch-tip">Tip: first load downloads the full deck (~5–35 MB). Stay on Wi‑Fi. If rendering fails, use Download.</p>`;

    if (window.DavynPitchViewer) {
      window.DavynPitchViewer.destroy();
      window.DavynPitchViewer.loadPitch(deck);
    }
  }

  function buildProductPitchesShell() {
    const intro = document.getElementById("product-pitches-intro");
    if (intro && D.productPitches) intro.textContent = D.productPitches.intro;
    if (!selectedPitch && D.productPitches && D.productPitches.decks.length) {
      selectedPitch = D.productPitches.decks[0].id;
    }
    buildPitchCategoryFilters();
    buildPitchList();
  }

  function renderProductPitches() {
    buildProductPitchesShell();
    renderProductPitchDetail();
  }

  /* ——— Proposal agent ——— */
  let proposalFormInitialized = false;

  function initProposalForm() {
    const intro = document.getElementById("proposal-intro");
    if (intro && D.proposalAgent) intro.textContent = D.proposalAgent.intro;

    const hint = document.getElementById("proposal-api-hint");
    if (hint && window.DavynProposalAgent) {
      hint.textContent =
        "API: " + DavynProposalAgent.getApiUrl() + " · PDF: " + DavynProposalAgent.getPdfApiUrl();
    }

    const guideEl = document.getElementById("vercel-vars-guide");
    if (guideEl && D.proposalAgent && D.proposalAgent.vercelGuide) {
      guideEl.innerHTML =
        "<table class='vercel-vars-table'><thead><tr><th>Vercel variable</th><th>Where it goes</th><th>Example</th></tr></thead><tbody>" +
        D.proposalAgent.vercelGuide
          .map(
            (r) =>
              `<tr><td><code>${esc(r.name)}</code></td><td>${esc(r.where)}</td><td>${esc(r.example)}</td></tr>`
          )
          .join("") +
        "</tbody></table>";
    }

    const keyInput = document.getElementById("proposal-access-key");
    const saveKeyBtn = document.getElementById("proposal-save-key");
    if (keyInput && window.DavynProposalAgent) {
      keyInput.value = DavynProposalAgent.getAccessKey() || (D.proposalAgent && D.proposalAgent.accessKeyDefault) || "";
      if (saveKeyBtn && !saveKeyBtn.dataset.bound) {
        saveKeyBtn.dataset.bound = "1";
        saveKeyBtn.addEventListener("click", () => {
          DavynProposalAgent.setAccessKey(keyInput.value.trim());
          saveKeyBtn.textContent = "Saved ✓";
          setTimeout(() => {
            saveKeyBtn.textContent = "Save for session";
          }, 1500);
        });
      }
    }

    if (proposalFormInitialized) return;
    proposalFormInitialized = true;

    const vertSel = document.getElementById("proposal-vertical");
    const stageSel = document.getElementById("proposal-stage");
    const personaSel = document.getElementById("proposal-persona");
    const erpSel = document.getElementById("proposal-erp");
    const typeSel = document.getElementById("proposal-type");
    const modEl = document.getElementById("proposal-modules");
    const objEl = document.getElementById("proposal-objections");
    const btn = document.getElementById("proposal-generate");
    const pdfBtn = document.getElementById("proposal-download-pdf");

    if (vertSel) {
      vertSel.innerHTML = D.verticals.map((v) => `<option value="${v.id}">${esc(v.name)}</option>`).join("");
      if (vertSel.querySelector('[value="finance"]')) vertSel.value = "finance";
    }
    if (stageSel) {
      stageSel.innerHTML = D.dealStages.map((s) => `<option value="${s.id}">${esc(s.label)}</option>`).join("");
      if (stageSel.querySelector('[value="alignment"]')) stageSel.value = "alignment";
    }
    if (personaSel) {
      personaSel.innerHTML = (D.packs.personas || ["CFO", "HR Director", "IT Director"]).map(
        (p) => `<option value="${esc(p)}">${esc(p)}</option>`
      ).join("");
    }
    if (erpSel && D.proposalAgent) {
      erpSel.innerHTML = D.proposalAgent.erpOptions.map((o) => `<option value="${o.id}">${esc(o.label)}</option>`).join("");
    }
    if (typeSel && D.proposalAgent) {
      typeSel.innerHTML = D.proposalAgent.proposalTypes.map((t) => `<option value="${t.id}">${esc(t.label)}</option>`).join("");
    }
    if (modEl && D.productPitches) {
      modEl.innerHTML = D.productPitches.decks
        .map(
          (d) =>
            `<label class="check-label check-card check-card-module">
              <input type="checkbox" name="proposal-mod" value="${d.id}" />
              <span class="check-card-body">
                <span class="check-card-title">${esc(d.title)}</span>
                <span class="check-card-meta">${esc(d.tags.slice(0, 3).join(" · "))}</span>
                <span class="check-card-note">${esc(d.useWhen)}</span>
              </span>
            </label>`
        )
        .join("");
      decorateProposalChecks(modEl);
      modEl.querySelectorAll('input[type="checkbox"]').forEach((input) => {
        input.addEventListener("change", refreshProposalComponentPreview);
      });
    }
    if (objEl) {
      objEl.innerHTML = D.objections
        .map(
          (o) =>
            `<label class="check-label check-card check-card-objection">
              <input type="checkbox" name="proposal-obj" value="${o.id}" />
              <span class="check-card-body">
                <span class="check-card-title">${esc(o.title)}</span>
                <span class="check-card-meta">${esc(o.tags.slice(0, 3).join(" · "))}</span>
              </span>
            </label>`
        )
        .join("");
      decorateProposalChecks(objEl);
      objEl.querySelectorAll('input[type="checkbox"]').forEach((input) => {
        input.addEventListener("change", refreshProposalComponentPreview);
      });
    }
    [vertSel, stageSel, personaSel, erpSel, typeSel].forEach((el) => {
      if (el) el.addEventListener("change", refreshProposalComponentPreview);
    });
    if (btn) {
      btn.addEventListener("click", runProposalGeneration);
    }
    if (pdfBtn) {
      pdfBtn.addEventListener("click", runProposalPdfDownload);
    }
    refreshProposalComponentPreview();
  }

  function triggerBlobDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function runProposalPdfDownload() {
    const out = document.getElementById("proposal-output");
    const pdfBtn = document.getElementById("proposal-download-pdf");
    const statusEl = document.getElementById("proposal-pdf-status");
    if (!window.DavynProposalAgent) return;

    const form = collectProposalForm();
    if (!form.clientName) {
      alert("Client name is required.");
      return;
    }
    if (!form.discoveryNotes) {
      alert("Add discovery notes so the PDF is grounded in the call.");
      return;
    }

    const accessKey = DavynProposalAgent.getAccessKey();
    if (!accessKey) {
      alert(
        "Paste the internal password first (PROPOSAL_ACCESS_KEY from Vercel — not your OpenAI key).\n\nDefault: davyn-proposal-2026\n\nClick Save for session, then try again."
      );
      return;
    }

    if (out) out.hidden = false;
    if (statusEl) statusEl.remove();
    const loading = document.createElement("div");
    loading.id = "proposal-pdf-status";
    loading.className = "proposal-loading";
    loading.innerHTML =
      "<p><strong>Building PDF proposal…</strong></p><p class=\"muted\">AI narrative + master split components. This can take 30–60 seconds on first run.</p>";
    if (out) out.prepend(loading);
    else if (pdfBtn && pdfBtn.parentElement) pdfBtn.parentElement.after(loading);

    if (pdfBtn) {
      pdfBtn.disabled = true;
      pdfBtn.textContent = "Building PDF…";
    }

    try {
      const { blob, filename, masterComponents } = await DavynProposalAgent.generateProposalPdf(form, D);
      triggerBlobDownload(blob, filename);
      loading.className = "proposal-pdf-success";
      loading.innerHTML = `<p><strong>PDF downloaded:</strong> ${esc(filename)}</p><p class="muted">${masterComponents.selected_count || 0} master split components included · Sources appendix attached.</p>`;
    } catch (err) {
      let msg = err.message || "Unknown error";
      if (err.status === 401) msg += " — Check your internal access key above.";
      if (err.status === 503) msg += " — Ask admin to set OPENAI_API_KEY on Vercel.";
      loading.className = "proposal-error";
      loading.innerHTML = `<strong>Could not generate PDF</strong><p>${esc(msg)}</p><p class="muted">Try Generate proposal draft first, or retry after a minute if the server was cold-starting.</p>`;
    } finally {
      if (pdfBtn) {
        pdfBtn.disabled = false;
        pdfBtn.textContent = "Download PDF";
      }
    }
  }

  function collectProposalForm() {
    const moduleIds = [];
    document.querySelectorAll('input[name="proposal-mod"]:checked').forEach((el) => moduleIds.push(el.value));
    const objectionIds = [];
    document.querySelectorAll('input[name="proposal-obj"]:checked').forEach((el) => objectionIds.push(el.value));

    return {
      clientName: (document.getElementById("proposal-client").value || "").trim(),
      country: (document.getElementById("proposal-country").value || "").trim(),
      employeeCount: (document.getElementById("proposal-headcount").value || "").trim(),
      vertical: document.getElementById("proposal-vertical").value,
      stage: document.getElementById("proposal-stage").value,
      persona: document.getElementById("proposal-persona").value,
      erpEnvironment: document.getElementById("proposal-erp").value,
      proposalType: document.getElementById("proposal-type").value,
      moduleIds,
      objectionIds,
      discoveryNotes: (document.getElementById("proposal-discovery").value || "").trim(),
      pricingNotes: (document.getElementById("proposal-pricing").value || "").trim(),
      nextStep: (document.getElementById("proposal-next").value || "").trim(),
    };
  }

  async function runProposalGeneration() {
    const out = document.getElementById("proposal-output");
    const btn = document.getElementById("proposal-generate");
    if (!out || !window.DavynProposalAgent) return;

    const form = collectProposalForm();
    if (!form.clientName) {
      alert("Client name is required.");
      return;
    }
    if (!form.discoveryNotes) {
      alert("Add discovery notes so the draft is grounded in the call.");
      return;
    }

    const accessKey = window.DavynProposalAgent && DavynProposalAgent.getAccessKey();
    if (!accessKey) {
      alert(
        "Paste the internal password first (PROPOSAL_ACCESS_KEY from Vercel — not your OpenAI key).\n\nDefault: davyn-proposal-2026\n\nClick Save for session, then Generate again."
      );
      return;
    }

    out.hidden = false;
    out.innerHTML = '<div class="proposal-loading"><p><strong>Generating proposal…</strong></p><p class="muted">This usually takes 20–45 seconds. Do not close this tab.</p></div>';
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Generating…";
    }

    try {
      const data = await DavynProposalAgent.generateProposal(form, D);
      const proposal = data.proposal || "";
      const moduleCount = form.moduleIds.length;
      const objectionCount = form.objectionIds.length;
      const masterAuto = data.automation && data.automation.masterComponents;
      out.innerHTML = `
        <div class="action-banner">Review before sending — AI draft uses your notes + Davyn playbooks. You own accuracy and pricing.</div>
        <div class="proposal-summary-row">
          <span class="proposal-summary-pill">Client: ${esc(form.clientName)}</span>
          <span class="proposal-summary-pill">Type: ${esc(form.proposalType)}</span>
          <span class="proposal-summary-pill">Modules: ${moduleCount}</span>
          <span class="proposal-summary-pill">Objections: ${objectionCount}</span>
        </div>
        ${renderComponentPlanBlock(masterAuto)}
        <div class="proposal-result-header">
          <span class="muted">Model: ${esc(data.model || "OpenAI")}</span>
          <button type="button" class="copy-btn" id="proposal-copy">Copy full proposal</button>
        </div>
        <article class="proposal-document" id="proposal-text">${renderProposalMarkdown(proposal)}</article>
        <details class="proposal-raw-wrap">
          <summary>View raw markdown</summary>
          <pre class="proposal-markdown">${esc(proposal)}</pre>
        </details>`;
      document.getElementById("proposal-copy").addEventListener("click", function () {
        copyText(proposal, this);
      });
    } catch (err) {
      let msg = err.message || "Unknown error";
      if (err.status === 401) msg += " — Check your internal access key above.";
      if (err.status === 503) msg += " — Ask admin to set OPENAI_API_KEY on Vercel.";
      out.innerHTML = `<div class="proposal-error"><strong>Could not generate proposal</strong><p>${esc(msg)}</p><p class="muted">If the site is on GitHub Pages, the API must be deployed on Vercel and reachable.</p></div>`;
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Generate proposal draft";
      }
    }
  }

  async function refreshProposalComponentPreview() {
    const wrap = document.getElementById("proposal-components-preview");
    if (!wrap || !window.DavynProposalAgent) return;
    const form = collectProposalForm();
    wrap.innerHTML = '<p class="muted">Building proposal component plan from master split…</p>';
    const resolved = await DavynProposalAgent.resolveProposalComponents(form, D);
    if (!resolved || !resolved.selected || !resolved.selected.length) {
      wrap.innerHTML = '<p class="muted">No components matched yet. Select at least one module.</p>';
      return;
    }
    wrap.innerHTML = renderComponentPlanInner(resolved);
  }

  /* ——— Pre-call / Post-call packs ——— */
  function initPreCallForm() {
    const stageSel = document.getElementById("precall-stage");
    const vertSel = document.getElementById("precall-vertical");
    const objSel = document.getElementById("precall-objection");
    const personaSel = document.getElementById("precall-persona");
    const btn = document.getElementById("precall-generate");
    if (!stageSel) return;

    if (!stageSel.options.length) {
      stageSel.innerHTML = D.dealStages.map((s) => `<option value="${s.id}">${esc(s.label)}</option>`).join("");
      vertSel.innerHTML = D.verticals.map((v) => `<option value="${v.id}">${esc(v.name)}</option>`).join("");
      objSel.innerHTML =
        '<option value="">— None / general —</option>' +
        D.objections.map((o) => `<option value="${o.id}">${esc(o.title)}</option>`).join("");
      personaSel.innerHTML = (D.packs.personas || []).map((p) => `<option value="${p}">${esc(p)}</option>`).join("");
      if (vertSel.querySelector('[value="finance"]')) vertSel.value = "finance";
      btn.addEventListener("click", renderPreCallPack);
    }
    renderPreCallPack();
  }

  function renderPreCallPack() {
    const out = document.getElementById("precall-output");
    if (!out) return;

    const stageId = document.getElementById("precall-stage").value;
    const vertId = document.getElementById("precall-vertical").value;
    const objId = document.getElementById("precall-objection").value;
    const persona = document.getElementById("precall-persona").value;

    const stage = D.dealStages.find((s) => s.id === stageId);
    const vert = D.verticals.find((v) => v.id === vertId);
    const obj = objId ? D.objections.find((o) => o.id === objId) : null;
    const enh = obj ? getObjEnhancement(obj.id) : {};

    const agenda = (D.packs && D.packs.defaultAgenda) || [];
    let questions = vert && vert.v2 && vert.v2.preCallQuestions ? vert.v2.preCallQuestions.slice(0, 7) : vert ? vert.discovery.slice(0, 7) : [];
    if (questions.length < 7 && stage) questions = questions.concat(stage.questions).slice(0, 7);

    const talkTrack = (vert && vert.v2 && vert.v2.talkTrack) || (obj && (enh.smMidFast || obj.short)) || stage.goal;
    const capture = vert && vert.v2 ? vert.v2.proofPrompts : stage.actions.slice(0, 4);
    const attachHtml = getAttachmentLinks(enh.attachKeys || (vertId === "finance" ? ["bc-one-pager"] : []));

    const packText = [
      "PRE-CALL PACK — " + (vert ? vert.name : "") + " · " + stage.label,
      "",
      "CALL AGENDA (45 min)",
      ...agenda.map((a) => "• " + a),
      "",
      "TALK TRACK (open with)",
      talkTrack,
      "",
      "DISCOVERY QUESTIONS",
      ...questions.map((q, i) => i + 1 + ". " + q),
      "",
      "CAPTURE ON THE CALL",
      ...capture.map((c) => "• " + c),
      "",
      obj ? "LIKELY OBJECTION: " + obj.title : "",
      obj ? "SAY: " + (enh.smMidFast || obj.short) : "",
      "",
      "EXIT THIS CALL WITH",
      "• Stakeholder map · Top risk · Dated next step · Owner",
    ].join("\n");

    out.innerHTML = `
      <div class="action-banner">You must leave with: <strong>stakeholder map + top risk + dated next step</strong> (${persona} lens).</div>
      <div class="intel-grid">
        ${block("Call agenda (45 min)", listItems(agenda))}
        ${block("Talk track — open with", `<p class="talk-track-lg">${esc(talkTrack)}</p>`)}
        ${block("Discovery questions (7)", listItems(questions))}
        ${block("What to capture", listItems(capture))}
        ${obj ? block("Likely objection prep", `<p><strong>${esc(obj.title)}</strong></p><p class="talk-track-lg">${esc(enh.smMidFast || obj.short)}</p><p><strong>Exit criteria:</strong> ${esc(enh.exitCriteria || obj.next)}</p>`) : ""}
        ${attachHtml ? block("Recommended attachments", attachHtml) : ""}
        ${block("Stage focus", `<p>${esc(stage.goal)}</p><p><strong>Do next after call:</strong> ${esc(stage.next)}</p>`)}
      </div>
      <button type="button" class="copy-btn pack-copy-all" data-copy="${escAttr(packText)}" style="margin-top:14px">Copy full pre-call pack</button>`;

    out.querySelector(".pack-copy-all") &&
      out.querySelector(".pack-copy-all").addEventListener("click", function () {
        copyText(packText, this);
      });
  }

  function initPostCallForm() {
    const stageSel = document.getElementById("postcall-stage");
    const objSel = document.getElementById("postcall-objection");
    const nextSel = document.getElementById("postcall-next");
    const btn = document.getElementById("postcall-generate");
    if (!stageSel) return;

    if (!stageSel.options.length) {
      stageSel.innerHTML = D.dealStages.map((s) => `<option value="${s.id}">${esc(s.label)}</option>`).join("");
      objSel.innerHTML =
        '<option value="">— Select if applicable —</option>' +
        D.objections.map((o) => `<option value="${o.id}">${esc(o.title)}</option>`).join("");
      nextSel.innerHTML = (D.packs.nextActions || [])
        .map((n) => `<option value="${n.id}">${esc(n.label)}</option>`)
        .join("");
      btn.addEventListener("click", renderPostCallPack);
    }
    renderPostCallPack();
  }

  function renderPostCallPack() {
    const out = document.getElementById("postcall-output");
    if (!out) return;

    const stageId = document.getElementById("postcall-stage").value;
    const objId = document.getElementById("postcall-objection").value;
    const nextId = document.getElementById("postcall-next").value;

    const stage = D.dealStages.find((s) => s.id === stageId);
    const obj = objId ? D.objections.find((o) => o.id === objId) : null;
    const enh = obj ? getObjEnhancement(obj.id) : {};

    const templateId = (D.packs.postCallTemplateMap && D.packs.postCallTemplateMap[nextId]) || "recap-map";
    let tpl = D.followups.find((f) => f.id === templateId) || D.followups[0];
    if (obj && obj.followup && (nextId === "governance-workshop" || nextId === "bc-validation")) {
      tpl = { ...tpl, body: obj.followup + "\n\n" + tpl.body };
    }

    const emailText = tpl.subject + "\n\n" + tpl.body;
    const execTpl = D.followups.find((f) => f.id === "exec-recap");
    const execText = execTpl ? execTpl.subject + "\n\n" + execTpl.body : "";
    const attachHtml = getAttachmentLinks(
      enh.attachKeys || (nextId === "bc-validation" ? ["bc-one-pager", "video-employee"] : nextId === "governance-workshop" ? ["bc-one-pager"] : [])
    );

    out.innerHTML = `
      <div class="action-banner">${esc(stage.next)}</div>
      <div class="intel-grid">
        ${block("Primary follow-up email", `<p><strong>Subject:</strong> ${esc(tpl.subject)}</p><pre class="copy-block">${esc(tpl.body)}</pre><button type="button" class="copy-btn" data-copy="${escAttr(emailText)}">Copy email</button>`)}
        ${execTpl ? block("Executive recap (optional)", `<pre class="copy-block">${esc(execTpl.body)}</pre><button type="button" class="copy-btn" data-copy="${escAttr(execText)}">Copy exec recap</button>`) : ""}
        ${obj ? block("Objection note for email", `<p class="talk-track-lg">${esc(enh.smMidFast || obj.short)}</p>`) : ""}
        ${attachHtml ? block("Attach to this email", attachHtml) : ""}
      </div>`;

    out.querySelectorAll(".copy-btn").forEach((btn) => {
      btn.addEventListener("click", () => copyText(btn.getAttribute("data-copy"), btn));
    });
  }

  /* ——— Microsoft × Factorial ——— */
  function buildMsftFactorial() {
    const el = document.getElementById("msft-factorial-content");
    if (!el) return;
    const m = D.microsoftFactorial;
    if (!m) {
      el.innerHTML = '<p class="muted">Microsoft × Factorial content not loaded.</p>';
      return;
    }

    const proof = m.proofPoints
      .map((p) => `<div class="kpi"><div class="k">${esc(p.k)}</div><div class="v">${esc(p.v)}</div></div>`)
      .join("");

    const bcFlows = m.integration.bc.flows
      .map(
        (f) =>
          `<div class="flow-row"><span class="flow-dir">${esc(f.dir)}</span><div><strong>${esc(f.name)}</strong><div class="muted">${esc(
            f.fields.join(", ")
          )}</div></div></div>`
      )
      .join("");

    const bcSetup = "<ol>" + m.integration.bc.setup.map((s) => `<li>${esc(s)}</li>`).join("") + "</ol>";

    const navSetup = "<ol>" + m.integration.nav.setup.map((s) => `<li>${esc(s)}</li>`).join("") + "</ol>";

    const enable = m.enablementAssets;
    const onePager =
      enable && enable.onePagerPdf
        ? `<div class="asset-callout">
            <div>
              <div class="muted" style="font-family:var(--mono);font-size:11px">ONE-PAGER</div>
              <div style="font-weight:600">${esc(enable.onePagerPdf.title)}</div>
              <div class="muted">Send to AE/CFO after discovery aligns.</div>
            </div>
            <div class="asset-actions">
              <a class="copy-btn" href="${enable.onePagerPdf.path}" target="_blank" rel="noopener">Open</a>
              <a class="copy-btn" href="${enable.onePagerPdf.path}" download>Download</a>
            </div>
          </div>`
        : "";

    const videos =
      enable && enable.videos && enable.videos.length
        ? `<div class="media-grid">
            ${enable.videos
              .map(
                (v) => `
              <div class="media-card">
                <div class="media-title">${esc(v.title)}</div>
                <video controls preload="metadata" src="${v.path}"></video>
                <div class="media-links">
                  <a href="${v.path}" target="_blank" rel="noopener">Open ↗</a>
                  <a href="${v.path}" download>Download</a>
                </div>
              </div>`
              )
              .join("")}
          </div>`
        : "";

    const images =
      enable && enable.images && enable.images.length
        ? `<div class="img-grid">
            ${enable.images
              .map(
                (img) => `
              <a class="img-tile" href="${img.path}" target="_blank" rel="noopener" title="${esc(img.title)}">
                <img src="${img.path}" alt="${esc(img.title)}" loading="lazy" />
              </a>`
              )
              .join("")}
          </div>`
        : "";

    el.innerHTML = `
      <div class="section-intro">
        <h1>${esc(m.title)}</h1>
        <p class="lead">${esc(m.whyItMatters[0])}</p>
      </div>

      <div class="action-banner">${esc(m.salesUse[0])}</div>

      <div class="intel-grid">
        ${block("Enablement assets (for Davyn AEs)", onePager + videos)}
        ${block("Executive proof points", `<div class="kpi-grid">${proof}</div>`, "accent")}
        ${block(
          "Executive quote (credibility)",
          `<div class="quote"><div class="q">“${esc(m.quote.text)}”</div><div class="muted">— ${esc(m.quote.source)}</div></div>`
        )}
        ${block(
          "Business Central integration (cloud)",
          `<p class="muted"><strong>Connector:</strong> ${esc(m.integration.bc.connector)} · <strong>Constraint:</strong> Cloud only</p>
           <div class="flow-grid">${bcFlows}</div>
           <div class="split-mini">
             <div class="mini-card"><h4>Setup</h4>${bcSetup}</div>
             <div class="mini-card"><h4>Notes</h4><ul>${m.integration.bc.notes.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
           </div>`
        )}
        ${block(
          "NAV / Navision integration (on‑prem)",
          `<p class="muted"><strong>Connector:</strong> ${esc(m.integration.nav.connector)} · <strong>Requirement:</strong> NAV 2015+</p>
           <ul>${m.integration.nav.notes.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
           <p class="muted"><strong>Syncs:</strong> ${esc(m.integration.nav.syncs.join(" · "))}</p>
           <div class="mini-card"><h4>Setup</h4>${navSetup}</div>`
        )}
        ${block("How to use this in a live deal", listItems(m.salesUse))}
        ${block("Integration screenshots (quick visual)", images)}
      </div>
    `;
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
    if (D.microsoftFactorial) {
      const m = D.microsoftFactorial;
      items.push({ type: "Module", label: "Microsoft × Factorial", section: "msft-factorial", hay: m.title + " " + m.proofPoints.map((p) => p.v).join(" ") + " " + m.quote.text });
    }
    if (D.productPitches) {
      D.productPitches.decks.forEach((d) =>
        items.push({
          type: "Pitch deck",
          label: d.title,
          section: "product-pitches",
          id: d.id,
          hay: d.title + " " + d.tags.join(" ") + " " + d.useWhen,
        })
      );
    }
    items.push({ type: "Module", label: "Proposal agent", section: "proposal", hay: "proposal agent AI draft commercial" });
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

  function renderComponentPlanBlock(masterAuto) {
    if (!masterAuto || !masterAuto.selected || !masterAuto.selected.length) return "";
    return `
      <section class="proposal-component-preview proposal-component-preview-result">
        <h3>Auto-selected proposal components (master split)</h3>
        ${renderComponentPlanInner(masterAuto)}
      </section>`;
  }

  function renderComponentPlanInner(masterAuto) {
    const selected = (masterAuto && masterAuto.selected) || [];
    const chips = selected
      .map((c) => `<span class="proposal-summary-pill">#${String(c.order).padStart(2, "0")} ${esc(c.title)}</span>`)
      .join("");

    const cards = selected
      .map((c) => {
        const reason = c.reasons && c.reasons.length ? `<p class="muted">Why included: ${esc(c.reasons[0])}</p>` : "";
        const componentHref = c.component_path || "";
        const pageHref = c.source_page_paths && c.source_page_paths[0] ? c.source_page_paths[0] : "";
        return `
          <article class="proposal-component-card">
            <header>
              <strong>${String(c.order).padStart(2, "0")} · ${esc(c.title)}</strong>
              <span class="muted">Pages ${esc(c.page_range || "")}</span>
            </header>
            <p>${esc(c.summary || "")}</p>
            ${reason}
            <div class="proposal-component-links">
              ${componentHref ? `<a href="${componentHref}" target="_blank" rel="noopener">Open component ↗</a>` : ""}
              ${pageHref ? `<a href="${pageHref}" target="_blank" rel="noopener">Open first source page ↗</a>` : ""}
            </div>
          </article>`;
      })
      .join("");

    return `
      <p class="muted">Plan built from ${selected.length} matched components.</p>
      <div class="proposal-summary-row">${chips}</div>
      <div class="proposal-component-grid">${cards}</div>`;
  }

  function decorateProposalChecks(container) {
    if (!container) return;
    container.querySelectorAll(".check-label").forEach((label) => {
      const input = label.querySelector('input[type="checkbox"]');
      if (!input) return;
      const sync = () => label.classList.toggle("is-selected", input.checked);
      sync();
      input.addEventListener("change", sync);
    });
  }

  function renderProposalMarkdown(markdown) {
    const lines = String(markdown || "")
      .replace(/\r\n?/g, "\n")
      .split("\n");
    let html = "";
    let inUl = false;
    let inOl = false;

    function closeLists() {
      if (inUl) {
        html += "</ul>";
        inUl = false;
      }
      if (inOl) {
        html += "</ol>";
        inOl = false;
      }
    }

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        closeLists();
        return;
      }

      const heading = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (heading) {
        closeLists();
        const level = Math.min(6, Math.max(1, heading[1].length));
        html += `<h${level}>${formatInline(heading[2])}</h${level}>`;
        return;
      }

      const bullet = trimmed.match(/^[-*]\s+(.+)$/);
      if (bullet) {
        if (inOl) {
          html += "</ol>";
          inOl = false;
        }
        if (!inUl) {
          html += "<ul>";
          inUl = true;
        }
        html += `<li>${formatInline(bullet[1])}</li>`;
        return;
      }

      const numbered = trimmed.match(/^\d+\.\s+(.+)$/);
      if (numbered) {
        if (inUl) {
          html += "</ul>";
          inUl = false;
        }
        if (!inOl) {
          html += "<ol>";
          inOl = true;
        }
        html += `<li>${formatInline(numbered[1])}</li>`;
        return;
      }

      closeLists();
      html += `<p>${formatInline(trimmed)}</p>`;
    });

    closeLists();
    return html || "<p class='muted'>No content returned.</p>";
  }

  function formatInline(text) {
    return String(text)
      .split(/(\*\*[^*]+\*\*)/g)
      .filter(Boolean)
      .map((part) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return `<strong>${esc(part.slice(2, -2))}</strong>`;
        }
        return esc(part);
      })
      .join("");
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
  buildProductPitchesShell();
  buildMsftFactorial();
  buildMessagingForm();
  initPreCallForm();
  initPostCallForm();
  renderObjection();
  renderStage();
  renderVertical();
})();
