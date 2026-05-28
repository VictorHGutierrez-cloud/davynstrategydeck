const {
  setCors,
  checkAuth,
  parseBody,
  generateProposalMarkdown,
  sanitizeFilename,
} = require("./_lib/proposal-shared");
const { enrichComponentWithSources } = require("./_lib/master-loader");
const { buildProposalHtml, htmlToPdfBuffer } = require("./_lib/pdf-render");

module.exports = async function handler(req, res) {
  setCors(req, res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!checkAuth(req, res)) return;

  const body = parseBody(req);
  if (!body || typeof body !== "object") {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  const form = body.form || {};
  const context = body.context || {};

  if (!form.clientName || !String(form.clientName).trim()) {
    return res.status(400).json({ error: "Client name is required" });
  }

  try {
    const selected = context?.masterComponents?.selected || [];
    const enrichedComponents = selected.map(enrichComponentWithSources);

    const { proposal } = await generateProposalMarkdown(form, {
      ...context,
      masterComponents: {
        ...(context.masterComponents || {}),
        selected: enrichedComponents,
      },
    });

    const html = buildProposalHtml({
      form,
      proposalMarkdown: proposal,
      components: enrichedComponents,
    });

    const pdfBuffer = await htmlToPdfBuffer(html);
    const date = new Date().toISOString().slice(0, 10);
    const filename = `Davyn_Proposal_${sanitizeFilename(form.clientName)}_${date}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(Buffer.from(pdfBuffer));
  } catch (err) {
    console.error("proposal-pdf error:", err);
    return res.status(500).json({
      error: err.message || "Failed to generate PDF proposal",
    });
  }
};
