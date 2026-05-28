/**
 * Local smoke test for proposal HTML pipeline (no OpenAI required).
 * Run: node scripts/smoke-test-pdf.js
 */
const path = require("path");
const fs = require("fs");
const { buildProposalHtml } = require("../api/_lib/pdf-render");
const { enrichComponentWithSources } = require("../api/_lib/master-loader");

const sampleForm = {
  clientName: "Acme Holdings Ltd",
  country: "Trinidad",
  employeeCount: "85",
  verticalLabel: "Finance & Insurance",
  proposalType: "Full proposal",
};

const manifestPath = path.join(process.cwd(), "site/assets/master-files-splitted/manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const components = manifest.components.slice(0, 3).map(enrichComponentWithSources);

const sampleMarkdown = `# Proposal: Acme Holdings Ltd — Factorial + Microsoft stack
## Executive summary
Acme needs a unified HR platform connected to Business Central.
## Next steps & mutual action plan
Schedule commercial review with CFO and IT.`;

const html = buildProposalHtml({
  form: sampleForm,
  proposalMarkdown: sampleMarkdown,
  components,
});

if (!html.includes("Sources used")) throw new Error("Missing Sources used section");
if (!html.includes("Acme Holdings Ltd")) throw new Error("Missing client name on cover");

const outPath = path.join(process.cwd(), "scripts/.smoke-test-output.html");
fs.writeFileSync(outPath, html);
console.log("Smoke test passed — HTML written to", outPath);
