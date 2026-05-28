/**
 * Proposal Pack Composer — visual slide cards, Microsoft attachments only.
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

    const enh = D.packs && D.packs.objectionEnhancements;
    const catalog = D.packs && D.packs.attachmentCatalog;
    normalizeArray(form.objectionIds).forEach((objId) => {
      const e = enh && enh[objId];
      if (e && e.attachKeys && catalog) {
        e.attachKeys.forEach((key) => {
          const a = catalog[key];
          if (a) {
            add({
              category: "Microsoft",
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
          category: "Microsoft",
          label: bc.label,
          path: bc.path,
          type: "PDF",
          suggested: true,
        });
      }
    }

    return items;
  }

  function pathType(path) {
    const ext = (path || "").split(".").pop().toUpperCase();
    return ext.length <= 5 ? ext : "FILE";
  }

  function normalizeArray(arr) {
    return Array.isArray(arr) ? arr.filter(Boolean) : [];
  }

  function buildSlideListText(form, components, slideIndex) {
    const lines = [];
    lines.push(`Proposal slides — ${form.clientName || "Client"}`);
    lines.push(`Date: ${new Date().toISOString().slice(0, 10)}`);
    lines.push("");
    components
      .filter((c) => c.included)
      .forEach((c) => {
        const comp = slideIndex && slideIndex.components.find((x) => x.id === c.id);
        lines.push(`## ${c.title} (pages ${c.page_range || "?"})`);
        if (comp && comp.pages) {
          comp.pages.forEach((p) => {
            lines.push(`  - Slide ${p.page}: ${p.label}${p.image ? "" : " [add JPG]"}`);
          });
        } else if (c.pages && c.pages.length) {
          c.pages.forEach((p) => lines.push(`  - Slide ${p}`));
        }
        lines.push("");
      });
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
    buildSlideListText,
    assetId,
  };
})();
