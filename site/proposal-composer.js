/**
 * Proposal Pack Composer — reorder cards, pick assets, copy checklist (no auto-PDF).
 */
(function () {
  const STORAGE_PREFIX = "davyn_composer_";

  function storageKey(form) {
    const client = (form.clientName || "draft").replace(/\W+/g, "_").slice(0, 40);
    return STORAGE_PREFIX + client;
  }

  function loadState(form) {
    try {
      const raw = sessionStorage.getItem(storageKey(form));
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function saveState(form, state) {
    try {
      sessionStorage.setItem(storageKey(form), JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }

  function mergeWithSaved(resolved, saved) {
    if (!saved || !saved.cards || !saved.cards.length) {
      return {
        cards: resolved.selected.map((c) => ({ id: c.id, included: true })),
        assets: saved && saved.assets ? saved.assets : {},
      };
    }
    const byId = {};
    resolved.selected.forEach((c) => {
      byId[c.id] = c;
    });
    const cards = [];
    saved.cards.forEach((s) => {
      if (byId[s.id]) {
        cards.push({ id: s.id, included: s.included !== false });
        delete byId[s.id];
      }
    });
    Object.keys(byId).forEach((id) => {
      cards.push({ id, included: true });
    });
    return { cards, assets: saved.assets || {} };
  }

  function orderedComponents(resolved, composerState) {
    const map = {};
    resolved.selected.forEach((c) => {
      map[c.id] = c;
    });
    return composerState.cards
      .filter((s) => map[s.id])
      .map((s) => ({ ...map[s.id], included: s.included !== false }));
  }

  function buildSuggestedAssets(form, D) {
    const items = [];
    const seen = new Set();

    function add(item) {
      const key = item.path || item.label;
      if (!key || seen.has(key)) return;
      seen.add(key);
      items.push(item);
    }

    add({
      category: "Master deck",
      label: "Master split guide (page map)",
      path: "assets/master-files-splitted/README.md",
      type: "MD",
      suggested: true,
      note: "Use page ranges on each card when pulling slides from master_en.pdf",
    });

    add({
      category: "Master deck",
      label: "Component manifest",
      path: "assets/master-files-splitted/manifest.json",
      type: "JSON",
      suggested: true,
    });

    normalizeArray(form.moduleIds).forEach((moduleId) => {
      const deck = D.productPitches && D.productPitches.decks.find((d) => d.id === moduleId);
      if (deck) {
        add({
          category: "Product pitch",
          label: deck.title + " (.pptx)",
          path: deck.path,
          type: "PPTX",
          suggested: true,
          moduleId: deck.id,
        });
      }
    });

    const enh = D.packs && D.packs.objectionEnhancements;
    const catalog = D.packs && D.packs.attachmentCatalog;
    normalizeArray(form.objectionIds).forEach((objId) => {
      const e = enh && enh[objId];
      if (e && e.attachKeys && catalog) {
        e.attachKeys.forEach((key) => {
          const a = catalog[key];
          if (a) {
            add({
              category: "Microsoft / integration",
              label: a.label,
              path: a.path,
              type: pathType(a.path),
              suggested: true,
            });
          }
        });
      }
    });

    if (
      form.erpEnvironment === "bc-cloud" ||
      form.erpEnvironment === "nav-onprem" ||
      form.erpEnvironment === "gp-legacy"
    ) {
      const bc = catalog && catalog["bc-one-pager"];
      if (bc) {
        add({
          category: "Microsoft / integration",
          label: bc.label,
          path: bc.path,
          type: "PDF",
          suggested: true,
        });
      }
    }

    if (D.assets) {
      D.assets.forEach((a) => {
        add({
          category: "Library",
          label: a.title,
          path: a.path,
          type: a.type || pathType(a.path),
          suggested: false,
        });
      });
    }

    return items;
  }

  function pathType(path) {
    const ext = (path || "").split(".").pop().toUpperCase();
    if (ext.length <= 5) return ext;
    return "FILE";
  }

  function normalizeArray(arr) {
    return Array.isArray(arr) ? arr.filter(Boolean) : [];
  }

  function buildChecklistText(form, components, assets, assetChecks) {
    const lines = [];
    const date = new Date().toISOString().slice(0, 10);
    lines.push(`Davyn proposal pack — ${form.clientName || "Client"}`);
    lines.push(`Date: ${date}`);
    if (form.country) lines.push(`Market: ${form.country}`);
    if (form.employeeCount) lines.push(`Headcount: ${form.employeeCount}`);
    lines.push("");
    lines.push("=== MASTER DECK SECTIONS (pull slides from master_en.pdf) ===");
    components
      .filter((c) => c.included)
      .forEach((c) => {
        lines.push(`[${String(c.order).padStart(2, "0")}] ${c.title} — pages ${c.page_range || "?"}`);
        if (c.summary) lines.push(`    ${c.summary}`);
      });
    lines.push("");
    lines.push("=== FILES TO ATTACH / SEND ===");
    assets.forEach((a) => {
      const id = assetId(a);
      if (assetChecks[id] === false) return;
      lines.push(`[ ] ${a.label} (${a.type || "file"})`);
      lines.push(`    ${a.path}`);
    });
    if (form.nextStep) {
      lines.push("");
      lines.push(`Next step: ${form.nextStep}`);
    }
    return lines.join("\n");
  }

  function assetId(a) {
    return (a.path || a.label).replace(/\W+/g, "_");
  }

  window.DavynProposalComposer = {
    loadState,
    saveState,
    mergeWithSaved,
    orderedComponents,
    buildSuggestedAssets,
    buildChecklistText,
    assetId,
  };
})();
