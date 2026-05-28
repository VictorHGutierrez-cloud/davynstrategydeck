const { markdownToHtml, escapeHtml } = require("./proposal-shared");

const PDF_STYLES = `
  @page { size: A4; margin: 18mm 16mm 20mm 16mm; }
  * { box-sizing: border-box; }
  body {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.5;
    color: #0f172a;
    margin: 0;
    padding: 0;
  }
  .cover {
    page-break-after: always;
    min-height: 90vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 24px 0;
  }
  .cover-badge {
    font-size: 10pt;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #2563eb;
    font-weight: 700;
    margin-bottom: 12px;
  }
  .cover h1 {
    font-size: 28pt;
    line-height: 1.15;
    margin: 0 0 16px;
    color: #0f172a;
  }
  .cover-meta {
    font-size: 12pt;
    color: #475569;
    margin: 4px 0;
  }
  .cover-foot {
    margin-top: 48px;
    font-size: 10pt;
    color: #64748b;
    border-top: 1px solid #e2e8f0;
    padding-top: 16px;
  }
  h1 { font-size: 18pt; color: #1e40af; margin: 24px 0 10px; }
  h2 { font-size: 14pt; color: #1e40af; margin: 20px 0 8px; padding-top: 8px; border-top: 1px solid #e2e8f0; }
  h3 { font-size: 12pt; color: #334155; margin: 14px 0 6px; }
  p { margin: 0 0 10px; color: #334155; }
  ul, ol { margin: 0 0 12px; padding-left: 20px; color: #334155; }
  li { margin-bottom: 4px; }
  .component-section {
    page-break-inside: avoid;
    margin: 16px 0 20px;
    padding: 14px 16px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background: #f8fafc;
  }
  .component-section h3 {
    margin-top: 0;
    color: #1e40af;
  }
  .component-meta {
    font-size: 9pt;
    color: #64748b;
    margin-bottom: 8px;
  }
  .component-excerpt {
    font-size: 10pt;
    color: #475569;
    font-style: italic;
    margin: 8px 0;
    padding-left: 10px;
    border-left: 3px solid #2563eb;
  }
  .sources {
    page-break-before: always;
  }
  .sources h2 { border-top: none; }
  .sources-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9pt;
  }
  .sources-table th,
  .sources-table td {
    border: 1px solid #e2e8f0;
    padding: 8px 10px;
    text-align: left;
    vertical-align: top;
  }
  .sources-table th {
    background: #f1f5f9;
    font-weight: 600;
  }
  .proposal-body { margin-top: 8px; }
`;

function buildComponentSectionsHtml(components) {
  if (!components || !components.length) return "";
  return components
    .map((c) => {
      const actions = (c.ae_actions || [])
        .map((a) => `<li>${escapeHtml(a)}</li>`)
        .join("");
      const excerpt = c.page_excerpt || c.component_excerpt || c.summary || "";
      return `
        <section class="component-section">
          <h3>${String(c.order || "").padStart(2, "0")} · ${escapeHtml(c.title)}</h3>
          <div class="component-meta">Pages ${escapeHtml(c.page_range || "")} · Component ID: ${escapeHtml(c.id || "")}</div>
          <p>${escapeHtml(c.summary || "")}</p>
          ${excerpt ? `<div class="component-excerpt">${escapeHtml(excerpt)}</div>` : ""}
          ${actions ? `<ul>${actions}</ul>` : ""}
        </section>`;
    })
    .join("");
}

function buildSourcesHtml(components) {
  if (!components || !components.length) {
    return "<p>No master split components were selected.</p>";
  }
  const rows = components
    .map(
      (c) => `
      <tr>
        <td>${String(c.order || "").padStart(2, "0")}</td>
        <td>${escapeHtml(c.title)}</td>
        <td>${escapeHtml(c.id || "")}</td>
        <td>${escapeHtml(c.page_range || "")}</td>
        <td>${escapeHtml((c.component_path || "").replace(/^assets\/master-files-splitted\//, ""))}</td>
      </tr>`
    )
    .join("");
  return `
    <table class="sources-table">
      <thead>
        <tr><th>#</th><th>Component</th><th>ID</th><th>Pages</th><th>Source file</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function buildProposalHtml({ form, proposalMarkdown, components }) {
  const today = new Date().toISOString().slice(0, 10);
  const proposalHtml = markdownToHtml(proposalMarkdown);
  const componentHtml = buildComponentSectionsHtml(components);
  const sourcesHtml = buildSourcesHtml(components);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Proposal — ${escapeHtml(form.clientName)}</title>
  <style>${PDF_STYLES}</style>
</head>
<body>
  <section class="cover">
    <div class="cover-badge">Davyn · Sales Proposal</div>
    <h1>${escapeHtml(form.clientName)}</h1>
    <p class="cover-meta"><strong>Factorial + Microsoft stack</strong></p>
    <p class="cover-meta">${escapeHtml(form.country || "Caribbean market")} · ${escapeHtml(form.employeeCount || "Headcount TBD")} employees</p>
    <p class="cover-meta">Vertical: ${escapeHtml(form.verticalLabel || form.vertical || "General")}</p>
    <p class="cover-meta">Prepared: ${today}</p>
    <div class="cover-foot">
      Davyn — We Help You Run Your Business Better<br />
      Microsoft Solution Partner · Caribbean
    </div>
  </section>

  <div class="proposal-body">
    ${proposalHtml}
  </div>

  <section>
    <h2>Scoped solution components (master split source)</h2>
    <p>The following sections map directly to Factorial master deck components selected for this proposal.</p>
    ${componentHtml}
  </section>

  <section class="sources">
    <h2>Sources used</h2>
    <p>Audit trail — master split components included in this proposal.</p>
    ${sourcesHtml}
  </section>
</body>
</html>`;
}

module.exports = {
  buildProposalHtml,
};
