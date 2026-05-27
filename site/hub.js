/**
 * Partners Content Hub — client-side search & filters (static site)
 */
(function () {
  const searchInput = document.getElementById("hub-search");
  const grid = document.getElementById("asset-grid");
  const countEl = document.getElementById("asset-count");
  const bannerTitle = document.getElementById("banner-title");
  const bannerDesc = document.getElementById("banner-desc");
  const chipContainer = document.getElementById("active-chips");
  const viewGridBtn = document.getElementById("view-grid");
  const viewListBtn = document.getElementById("view-list");
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const sidebar = document.getElementById("hub-sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  const clearAllBtn = document.getElementById("clear-all-filters");

  if (!grid || !searchInput) return;

  const typeLabels = {
    all: { title: "All assets", desc: "Browse every file available for Davyn partners." },
    "one-pager": {
      title: "One-pager",
      desc: "One-page summaries by industry, product, or use case.",
    },
    presentation: { title: "Presentation / deck", desc: "Introw onboarding and partner slide decks." },
    document: { title: "Document", desc: "Playbooks and indexes (Markdown)." },
    image: { title: "Image", desc: "Competitive landscape visuals." },
    flyer: { title: "Flyer", desc: "HR × IT flyer and similar collateral." },
    data: { title: "Data export", desc: "CSV baselines — validate in live CRM." },
    vertical: { title: "Industry vertical", desc: "Vertical-specific one-pagers." },
  };

  let activeType = "all";

  function normalize(s) {
    return (s || "").toLowerCase().trim();
  }

  function getCards() {
    return Array.from(grid.querySelectorAll(".asset-card"));
  }

  function applyFilters() {
    const q = normalize(searchInput.value);
    let n = 0;
    getCards().forEach((card) => {
      const type = card.getAttribute("data-type") || "";
      const hay = normalize(card.getAttribute("data-search"));
      const typeOk = activeType === "all" || type === activeType;
      const searchOk = !q || hay.includes(q);
      const show = typeOk && searchOk;
      card.hidden = !show;
      if (show) n++;
    });
    if (countEl) countEl.textContent = n;
    renderChips();
    updateClearAllVisibility();
    updateBanner();
  }

  function updateClearAllVisibility() {
    const hasSearch = normalize(searchInput && searchInput.value).length > 0;
    if (!clearAllBtn) return;
    clearAllBtn.hidden = !(activeType !== "all" || hasSearch);
  }

  function updateBanner() {
    const meta = typeLabels[activeType] || typeLabels.all;
    if (bannerTitle) bannerTitle.textContent = meta.title;
    if (bannerDesc) bannerDesc.textContent = meta.desc;
  }

  function renderChips() {
    if (!chipContainer) return;
    chipContainer.innerHTML = "";
    if (activeType === "all") return;
    const chip = document.createElement("span");
    chip.className = "filter-chip";
    chip.appendChild(document.createTextNode((typeLabels[activeType] && typeLabels[activeType].title) || activeType));
    const x = document.createElement("button");
    x.type = "button";
    x.className = "chip-remove";
    x.setAttribute("aria-label", "Clear filter");
    x.textContent = "×";
    x.addEventListener("click", () => {
      activeType = "all";
      document.querySelectorAll(".type-filter").forEach((b) => b.classList.remove("is-active"));
      const allBtn = document.querySelector('.type-filter[data-type="all"]');
      if (allBtn) allBtn.classList.add("is-active");
      applyFilters();
    });
    chip.appendChild(x);
    chipContainer.appendChild(chip);
  }

  document.querySelectorAll(".type-filter").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".type-filter").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      activeType = btn.getAttribute("data-type") || "all";
      applyFilters();
    });
  });

  let searchTimer;
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(applyFilters, 120);
  });

  if (viewGridBtn && viewListBtn) {
    viewGridBtn.addEventListener("click", () => {
      grid.classList.remove("is-list");
      viewGridBtn.classList.add("is-active");
      viewListBtn.classList.remove("is-active");
    });

    viewListBtn.addEventListener("click", () => {
      grid.classList.add("is-list");
      viewListBtn.classList.add("is-active");
      viewGridBtn.classList.remove("is-active");
    });
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove("is-open");
    if (overlay) overlay.classList.remove("is-visible");
    document.body.classList.remove("sidebar-open");
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      if (sidebar) sidebar.classList.toggle("is-open");
      if (overlay) overlay.classList.toggle("is-visible");
      document.body.classList.toggle("sidebar-open");
    });
  }
  if (overlay) {
    overlay.addEventListener("click", closeSidebar);
  }

  if (clearAllBtn) {
    clearAllBtn.addEventListener("click", () => {
      activeType = "all";
      document.querySelectorAll(".type-filter").forEach((b) => b.classList.remove("is-active"));
      const allBtn = document.querySelector('.type-filter[data-type="all"]');
      if (allBtn) allBtn.classList.add("is-active");
      if (searchInput) searchInput.value = "";
      applyFilters();
    });
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) closeSidebar();
  });

  applyFilters();
})();
