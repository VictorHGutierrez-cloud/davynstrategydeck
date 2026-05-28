/**
 * Davyn Proposal Agent — client-side API caller + context builder.
 */
(function () {
  const STORAGE_KEY = "davyn_proposal_access_key";

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

  async function generateProposal(form, D) {
    const vertical = D.verticals.find((v) => v.id === form.vertical);
    const stage = D.dealStages.find((s) => s.id === form.stage);
    const type = (D.proposalAgent.proposalTypes || []).find((t) => t.id === form.proposalType);

    const payload = {
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
      },
      context: buildContext(form, D),
    };

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
    return data;
  }

  window.DavynProposalAgent = {
    getApiUrl,
    getAccessKey,
    setAccessKey,
    buildContext,
    generateProposal,
  };
})();
