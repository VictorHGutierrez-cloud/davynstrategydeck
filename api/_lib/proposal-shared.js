const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/victorhgutierrez-cloud\.github\.io$/,
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
  /^https:\/\/davynstrategydeck.*\.vercel\.app$/,
  /^https:\/\/.*-victorhgutierrez-cloud\.vercel\.app$/,
];

function isAllowedOrigin(origin) {
  if (!origin) return true;
  return ALLOWED_ORIGIN_PATTERNS.some((re) => re.test(origin));
}

function setCors(req, res) {
  const origin = req.headers.origin;
  if (origin && isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Davyn-Access-Key");
  res.setHeader("Vary", "Origin");
}

function checkAuth(req, res) {
  const accessKey = process.env.PROPOSAL_ACCESS_KEY;
  if (accessKey) {
    const provided = req.headers["x-davyn-access-key"];
    if (provided !== accessKey) {
      res.status(401).json({ error: "Unauthorized. Check your internal access key." });
      return false;
    }
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(503).json({
      error: "OpenAI API key not configured. Add OPENAI_API_KEY in Vercel project settings.",
    });
    return false;
  }
  return true;
}

function parseBody(req) {
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return null;
    }
  }
  return body;
}

function buildSystemPrompt() {
  return `You are Davyn's internal proposal writer for Caribbean SMB and mid-market deals.

Davyn is a Microsoft Solution Partner (20+ years, Caribbean) selling Factorial HR platform integrated with Dynamics 365 Business Central where relevant.

Rules:
- Write in professional English addressed to the client (3rd person: "your organization", "[Client Name]").
- Be consultative, not marketing fluff. Anchor on operational outcomes, audit risk, manager time, and ERP connectivity.
- Use ONLY facts from the provided context snapshot. Do not invent pricing, SLAs, certifications, or legal terms.
- Where pricing or contract terms are unknown, use clear placeholders: [PRICING — confirm with Davyn commercial], [CONTRACT TERM — TBD].
- Include Caribbean-specific sensitivity when relevant only if context supports it.
- Keep the proposal scannable: short paragraphs, bullet lists, bold section headers in Markdown.
- Do not mention OpenAI, AI, or that this was auto-generated.
- End with a dated mutual next step and named owner placeholders.
- If context includes masterComponents.selected, align section flow to those components and preserve their sequence where practical.
- Do NOT include a "Sources used" section — that is appended separately in the PDF.

Output format (Markdown):
# Proposal: [Client Name] — Factorial + Microsoft stack
## Executive summary
## Understanding your situation
## Proposed solution
## Microsoft × Factorial integration (if ERP in scope)
## Davyn delivery approach
## Implementation timeline (90-day view)
## Expected outcomes
## Commercial overview
## How we address your concerns
## Recommended attachments
## Next steps & mutual action plan`;
}

function buildUserPrompt(form, context) {
  const lines = [
    "Generate a client-ready proposal draft from this deal intake.",
    "",
    "## Deal intake",
    `- Client: ${form.clientName || "[Client Name]"}`,
    `- Country / market: ${form.country || "[Country]"}`,
    `- Employees: ${form.employeeCount || "[Headcount TBD]"}`,
    `- Vertical: ${form.verticalLabel || form.vertical || "General"}`,
    `- Deal stage: ${form.stageLabel || form.stage || "Proposal"}`,
    `- Primary persona: ${form.persona || "Mixed stakeholders"}`,
    `- ERP / Microsoft footprint: ${form.erpEnvironment || "Not specified"}`,
    `- Factorial modules in scope: ${(form.modules || []).join(", ") || "To be confirmed on discovery"}`,
    `- Proposal type: ${form.proposalType || "full"}`,
    `- Agreed / proposed next step: ${form.nextStep || "Schedule commercial review"}`,
    "",
    "## Discovery notes (from AE)",
    form.discoveryNotes || "(No notes provided — infer cautiously from vertical and modules only.)",
    "",
    "## Pricing / commercial notes (internal — use placeholders if empty)",
    form.pricingNotes || "[PRICING — confirm with Davyn commercial team]",
    "",
    "## Context snapshot (authoritative — do not contradict)",
    JSON.stringify(context, null, 2),
  ];
  return lines.join("\n");
}

async function generateProposalMarkdown(form, context) {
  const apiKey = process.env.OPENAI_API_KEY;
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: buildUserPrompt(form, context) },
      ],
      temperature: 0.35,
      max_tokens: 4500,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "OpenAI request failed");
  }

  const proposal = data.choices?.[0]?.message?.content?.trim() || "";
  if (!proposal) throw new Error("Empty response from OpenAI.");
  return { proposal, model: OPENAI_MODEL, usage: data.usage || null };
}

function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function markdownToHtml(markdown) {
  const lines = String(markdown || "").replace(/\r\n?/g, "\n").split("\n");
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
      html += `<h${level}>${inlineFormat(heading[2])}</h${level}>`;
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
      html += `<li>${inlineFormat(bullet[1])}</li>`;
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
      html += `<li>${inlineFormat(numbered[1])}</li>`;
      return;
    }

    closeLists();
    html += `<p>${inlineFormat(trimmed)}</p>`;
  });

  closeLists();
  return html;
}

function inlineFormat(text) {
  return escapeHtml(text).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function sanitizeFilename(name) {
  return String(name || "Client")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 60);
}

module.exports = {
  OPENAI_MODEL,
  setCors,
  checkAuth,
  parseBody,
  generateProposalMarkdown,
  markdownToHtml,
  escapeHtml,
  sanitizeFilename,
};
