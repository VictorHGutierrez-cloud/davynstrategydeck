/**
 * Davyn Proposal Agent — Vercel serverless endpoint.
 * Requires OPENAI_API_KEY in Vercel env. Optional PROPOSAL_ACCESS_KEY for internal auth.
 */

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

function buildSystemPrompt() {
  return `You are Davyn's internal proposal writer for Caribbean SMB and mid-market deals.

Davyn is a Microsoft Solution Partner (20+ years, Caribbean) selling Factorial HR platform integrated with Dynamics 365 Business Central where relevant.

Rules:
- Write in professional English addressed to the client (3rd person: "your organization", "[Client Name]").
- Be consultative, not marketing fluff. Anchor on operational outcomes, audit risk, manager time, and ERP connectivity.
- Use ONLY facts from the provided context snapshot. Do not invent pricing, SLAs, certifications, or legal terms.
- Where pricing or contract terms are unknown, use clear placeholders: [PRICING — confirm with Davyn commercial], [CONTRACT TERM — TBD].
- Include Caribbean-specific sensitivity when relevant (data residency, continuity, FX/procurement) only if context supports it.
- Keep the proposal scannable: short paragraphs, bullet lists, bold section headers in Markdown.
- Do not mention OpenAI, AI, or that this was auto-generated.
- End with a dated mutual next step and named owner placeholders.
- If context includes masterComponents.selected, align section flow to those components and preserve their sequence where practical.

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

module.exports = async function handler(req, res) {
  setCors(req, res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const accessKey = process.env.PROPOSAL_ACCESS_KEY;
  if (accessKey) {
    const provided = req.headers["x-davyn-access-key"];
    if (provided !== accessKey) {
      return res.status(401).json({ error: "Unauthorized. Check your internal access key." });
    }
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: "OpenAI API key not configured. Add OPENAI_API_KEY in Vercel project settings.",
    });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "Invalid JSON body." });
    }
  }

  const { form, context } = body || {};
  if (!form || !form.clientName) {
    return res.status(400).json({ error: "Missing required field: clientName." });
  }
  if (!context) {
    return res.status(400).json({ error: "Missing context snapshot." });
  }

  try {
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
      const msg = data?.error?.message || "OpenAI request failed";
      return res.status(502).json({ error: msg });
    }

    const proposal = data.choices?.[0]?.message?.content?.trim() || "";
    if (!proposal) {
      return res.status(502).json({ error: "Empty response from OpenAI." });
    }

    return res.status(200).json({
      proposal,
      model: OPENAI_MODEL,
      usage: data.usage || null,
    });
  } catch (err) {
    console.error("proposal agent error:", err);
    return res.status(500).json({ error: err.message || "Internal server error." });
  }
};
