/**
 * Davyn Proposal Agent — client-side API caller + context builder.
 */
(function () {
  const STORAGE_KEY = "davyn_proposal_access_key";
  const MASTER_MANIFEST_PATH = "assets/master-files-splitted/manifest.json";
  let masterManifestPromise = null;

  const MODULE_COMPONENT_MAP = {
    recruitment: ["talent-acquisition-and-recruitment"],
    performance: ["performance-training-and-learning"],
    "compensation-en": ["compensation-payroll-and-compliance-sync"],
    compensation: ["compensation-payroll-and-compliance-sync"],
    engagement: ["engagement-and-employee-retention"],
    "time-planning": ["time-attendance-absence-and-shifts"],
    "automatic-shifts": ["time-attendance-absence-and-shifts"],
    "expense-management": ["expenses-projects-and-invoicing"],
    procurement: ["procurement-it-and-device-lifecycle"],
    projects: ["expenses-projects-and-invoicing"],
    lms: ["performance-training-and-learning"],
    training: ["performance-training-and-learning"],
    spaces: ["workspace-and-hybrid-operations"],
    "it-inventory": ["procurement-it-and-device-lifecycle"],
    "trust-channel": ["security-compliance-and-demo-cta", "compensation-payroll-and-compliance-sync"],
  };

  const OBJECTION_COMPONENT_MAP = {
    "data-sovereignty": ["security-compliance-and-demo-cta"],
    "hurricane-continuity": ["security-compliance-and-demo-cta", "customer-proof-integrations-and-support"],
    "audit-trail": ["security-compliance-and-demo-cta", "compensation-payroll-and-compliance-sync"],
    "bc-integration-proof": ["customer-proof-integrations-and-support", "expenses-projects-and-invoicing"],
    "no-it-staff": ["customer-proof-integrations-and-support", "procurement-it-and-device-lifecycle"],
    "already-microsoft": ["customer-proof-integrations-and-support", "expenses-projects-and-invoicing"],
    "too-expensive": ["commercial-packages-and-plan-fit", "quote-templates-and-commercial-examples"],
    "budget-cycle": ["commercial-packages-and-plan-fit", "quote-templates-and-commercial-examples"],
  };

  function getApiUrl() {
    const D = window.DAVYN;
    if (!D || !D.meta) return "/api/proposal";
    if (D.meta.proposalApiUrl) return D.meta.proposalApiUrl;
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1" || host.includes("vercel.app")) {
      return "/api/proposal";
    }
    return D.meta.proposalApiFallback || "/api/proposal";
  }

  function getPdfApiUrl() {
    const D = window.DAVYN;
    if (D && D.meta && D.meta.proposalPdfApiUrl) return D.meta.proposalPdfApiUrl;
    const base = getApiUrl();
    if (base.endsWith("/api/proposal")) return base.replace(/\/api\/proposal$/, "/api/proposal-pdf");
    return "/api/proposal-pdf";
  }

  function getAccessKey() {
    try {
      return sessionStorage.getItem(STORAGE_KEY) || "";
    } catch {
      return "";
    }
  }

  function setAccessKey(key) {
    try {
      if (key) sessionStorage.setItem(STORAGE_KEY, key);
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  async function loadMasterManifest() {
    if (!masterManifestPromise) {
      masterManifestPromise = fetch(MASTER_MANIFEST_PATH)
        .then((res) => {
          if (!res.ok) throw new Error("Could not load master split manifest.");
          return res.json();
        })
        .catch((err) => {
          masterManifestPromise = null;
          throw err;
        });
    }
    return masterManifestPromise;
  }

  function normalizeArray(arr) {
    return Array.isArray(arr) ? arr.filter(Boolean) : [];
  }

  function uniquePush(targetArr, value) {
    if (!targetArr.includes(value)) targetArr.push(value);
  }

  function buildComponentPath(component) {
    const order = String(component.order || 0).padStart(2, "0");
    return `assets/master-files-splitted/components/${order}-${component.id}.md`;
  }

  function buildSourcePagePaths(component) {
    return normalizeArray(component.source_files).map((p) => {
      const cleaned = String(p || "").replace(/^pages\//, "");
      return `assets/master-files-splitted/pages/${cleaned}`;
    });
  }

  function getComponentIdsForForm(form) {
    const ids = [];
    // Base narrative for all proposals.
    uniquePush(ids, "company-overview");
    uniquePush(ids, "value-pillars-overview");

    if (form.proposalType === "full" || form.proposalType === "scope") {
      uniquePush(ids, "commercial-packages-and-plan-fit");
    }

    normalizeArray(form.moduleIds).forEach((moduleId) => {
      normalizeArray(MODULE_COMPONENT_MAP[moduleId]).forEach((cid) => uniquePush(ids, cid));
    });

    normalizeArray(form.objectionIds).forEach((objId) => {
      normalizeArray(OBJECTION_COMPONENT_MAP[objId]).forEach((cid) => uniquePush(ids, cid));
    });

    // Contextual reinforcement by ERP footprint.
    if (form.erpEnvironment === "bc-cloud" || form.erpEnvironment === "nav-onprem" || form.erpEnvironment === "gp-legacy") {
      uniquePush(ids, "customer-proof-integrations-and-support");
    }

    // Recommended close sections.
    uniquePush(ids, "security-compliance-and-demo-cta");
    uniquePush(ids, "customer-proof-integrations-and-support");
    return ids;
  }

  function enrichSelectedComponents(selected, reasonMap) {
    return selected.map((c) => ({
      order: c.order,
      id: c.id,
      title: c.title,
      page_range: c.page_range,
      pages: normalizeArray(c.pages),
      tags: normalizeArray(c.tags),
      summary: c.summary || "",
      ae_actions: normalizeArray(c.ae_actions),
      source_files: normalizeArray(c.source_files),
      component_path: buildComponentPath(c),
      source_page_paths: buildSourcePagePaths(c),
      reasons: normalizeArray(reasonMap[c.id]),
    }));
  }

  async function resolveProposalComponents(form) {
    try {
      const manifest = await loadMasterManifest();
      const componentMap = {};
      normalizeArray(manifest.components).forEach((c) => {
        componentMap[c.id] = c;
      });

      const ids = getComponentIdsForForm(form);
      const reasonMap = {};
      ids.forEach((id) => {
        reasonMap[id] = reasonMap[id] || [];
      });

      normalizeArray(form.moduleIds).forEach((moduleId) => {
        normalizeArray(MODULE_COMPONENT_MAP[moduleId]).forEach((id) => {
          if (!reasonMap[id]) reasonMap[id] = [];
          reasonMap[id].push(`Module selected: ${moduleId}`);
        });
      });
      normalizeArray(form.objectionIds).forEach((objId) => {
        normalizeArray(OBJECTION_COMPONENT_MAP[objId]).forEach((id) => {
          if (!reasonMap[id]) reasonMap[id] = [];
          reasonMap[id].push(`Objection coverage: ${objId}`);
        });
      });

      const selectedRaw = ids.map((id) => componentMap[id]).filter(Boolean).sort((a, b) => (a.order || 0) - (b.order || 0));
      const selected = enrichSelectedComponents(selectedRaw, reasonMap);

      return {
        manifest_version: manifest.manifest_version || "1.0.0",
        total_pages: manifest.total_pages || null,
        selected_count: selected.length,
        selected,
      };
    } catch {
      return {
        manifest_version: null,
        total_pages: null,
        selected_count: 0,
        selected: [],
      };
    }
  }

  function buildContext(form, D) {
    const vertical = D.verticals.find((v) => v.id === form.vertical);
    const stage = D.dealStages.find((s) => s.id === form.stage);
    const objections = (form.objectionIds || [])
      .map((id) => D.objections.find((o) => o.id === id))
      .filter(Boolean);
    const modules = (form.moduleIds || [])
      .map((id) => D.productPitches && D.productPitches.decks.find((d) => d.id === id))
      .filter(Boolean);
    const enh = D.packs && D.packs.objectionEnhancements;

    const mf = D.microsoftFactorial;
    const msft = mf
      ? {
          title: mf.title,
          proofPoints: mf.proofPoints,
          quote: mf.quote,
          integration: mf.integration,
          salesUse: mf.salesUse,
        }
      : null;

    return {
      partner: D.meta,
      vertical: vertical
        ? {
            name: vertical.name,
            microsoft: vertical.microsoft,
            pains: vertical.pains,
            outcomes: vertical.outcomes,
            davynAngle: vertical.davynAngle,
            v2: vertical.v2 || null,
          }
        : null,
      stage: stage ? { label: stage.label, goal: stage.goal, next: stage.next, risks: stage.risks } : null,
      objections: objections.map((o) => ({
        title: o.title,
        short: o.short,
        executive: o.executive,
        technical: o.technical,
        smMidFast: (enh && enh[o.id] && enh[o.id].smMidFast) || o.short,
        exitCriteria: (enh && enh[o.id] && enh[o.id].exitCriteria) || o.next,
      })),
      modules: modules.map((m) => ({ title: m.title, useWhen: m.useWhen, tags: m.tags })),
      microsoftFactorial: msft,
      caribbean: D.caribbean
        ? { themes: D.caribbean.themes, buyerSignals: D.caribbean.buyerSignals, davynProof: D.caribbean.davynProof }
        : null,
      roiNarratives: (D.roiNarratives || []).slice(0, 4).map((r) => ({ headline: r.headline, points: r.points, ask: r.ask })),
      recommendedAttachments: buildAttachmentHints(form, D, enh),
      masterComponents: form.masterComponents || null,
    };
  }

  function buildAttachmentHints(form, D, enh) {
    const keys = new Set();
    (form.objectionIds || []).forEach((id) => {
      const e = enh && enh[id];
      if (e && e.attachKeys) e.attachKeys.forEach((k) => keys.add(k));
    });
    if (form.erpEnvironment === "bc-cloud" || (form.moduleIds || []).some((id) => ["expense-management", "time-planning", "projects"].includes(id))) {
      keys.add("bc-one-pager");
    }
    const catalog = D.packs && D.packs.attachmentCatalog;
    if (!catalog) return [];
    return [...keys]
      .map((k) => catalog[k])
      .filter(Boolean)
      .map((a) => ({ label: a.label, path: a.path }));
  }

  async function buildProposalPayload(form, D) {
    const vertical = D.verticals.find((v) => v.id === form.vertical);
    const stage = D.dealStages.find((s) => s.id === form.stage);
    const type = (D.proposalAgent.proposalTypes || []).find((t) => t.id === form.proposalType);
    const masterComponents = await resolveProposalComponents(form);

    return {
      payload: {
        form: {
          ...form,
          verticalLabel: vertical ? vertical.name : form.vertical,
          stageLabel: stage ? stage.label : form.stage,
          modules: (form.moduleIds || [])
            .map((id) => {
              const m = D.productPitches && D.productPitches.decks.find((d) => d.id === id);
              return m ? m.title : id;
            })
            .filter(Boolean),
          proposalType: type ? type.label : form.proposalType,
          selectedComponentIds: normalizeArray(masterComponents.selected).map((c) => c.id),
        },
        context: buildContext({ ...form, masterComponents }, D),
      },
      masterComponents,
    };
  }

  async function generateProposal(form, D) {
    const { payload, masterComponents } = await buildProposalPayload(form, D);

    const headers = { "Content-Type": "application/json" };
    const accessKey = getAccessKey();
    if (accessKey) headers["X-Davyn-Access-Key"] = accessKey;

    const res = await fetch(getApiUrl(), {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error || "Proposal generation failed.");
      err.status = res.status;
      throw err;
    }
    return {
      ...data,
      automation: {
        masterComponents,
      },
    };
  }

  async function convertHtmlToPdfBlob(html, filename) {
    if (typeof html2pdf === "undefined") {
      throw new Error("PDF library failed to load. Hard refresh the page and try again.");
    }

    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    wrapper.style.cssText =
      "position:fixed;left:0;top:0;width:210mm;min-height:297mm;background:#fff;z-index:-1;opacity:0;pointer-events:none;";
    document.body.appendChild(wrapper);

    try {
      const blob = await html2pdf()
        .set({
          margin: [12, 12, 14, 12],
          filename,
          image: { type: "jpeg", quality: 0.92 },
          html2canvas: { scale: 2, useCORS: true, logging: false, letterRendering: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["css", "legacy"] },
        })
        .from(wrapper)
        .outputPdf("blob");
      return blob;
    } finally {
      wrapper.remove();
    }
  }

  async function generateProposalPdf(form, D) {
    const { payload, masterComponents } = await buildProposalPayload(form, D);

    const headers = { "Content-Type": "application/json" };
    const accessKey = getAccessKey();
    if (accessKey) headers["X-Davyn-Access-Key"] = accessKey;

    const res = await fetch(getPdfApiUrl(), {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error || "PDF generation failed.");
      err.status = res.status;
      throw err;
    }

    if (!data.html) {
      throw new Error("Server did not return proposal HTML.");
    }

    const filename =
      data.filename || `Davyn_Proposal_${(form.clientName || "Client").replace(/\s+/g, "_")}.pdf`;
    const blob = await convertHtmlToPdfBlob(data.html, filename);

    return { blob, filename, masterComponents };
  }

  window.DavynProposalAgent = {
    getApiUrl,
    getPdfApiUrl,
    getAccessKey,
    setAccessKey,
    buildContext,
    resolveProposalComponents,
    buildProposalPayload,
    generateProposal,
    generateProposalPdf,
    convertHtmlToPdfBlob,
  };
})();
