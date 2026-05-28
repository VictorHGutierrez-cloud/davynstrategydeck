/* Davyn Sales Execution Platform — content layer (English) */
window.DAVYN = {
  meta: {
    partner: "Davyn",
    tagline: "We Help You Run Your Business Better",
    region: "Caribbean",
    credentials: [
      "20+ years as a trusted Microsoft partner in the Caribbean",
      "Microsoft Solution Partner — Business Applications, Security, Data & AI, Infrastructure, Modern Work",
      "Dynamics 365 · Azure · Power Platform · Microsoft Fabric · Copilot",
    ],
  },

  dealStages: [
    {
      id: "qualify",
      label: "Qualify",
      icon: "◎",
      goal: "Confirm fit, urgency, and access to power before investing presales time.",
      actions: [
        "Validate ICP: industry, size, geography, and Microsoft footprint",
        "Identify the business pain — not the feature request",
        "Confirm budget path and decision timeline (even rough)",
        "Map at least one economic buyer and one technical influencer",
      ],
      questions: [
        "What triggered this conversation now?",
        "What happens if you do nothing for 12 months?",
        "Who else must agree before anything moves forward?",
      ],
      risks: ["Chasing a logo with no pain", "Single-threaded contact with no exec access"],
      next: "Book a structured discovery call with HR, Finance, and IT represented.",
      assets: ["discovery", "verticals"],
    },
    {
      id: "discovery",
      label: "Discovery",
      icon: "◉",
      goal: "Build a stakeholder map and quantify operational risk / cost of status quo.",
      actions: [
        "Run regional-first discovery (ops, risk, capacity, finance, stakeholders)",
        "Document current tools, approvals, and audit trail gaps",
        "Capture 3 numbers: rework hours, error rate, manager time lost",
        "Log data residency and continuity concerns early",
      ],
      questions: [
        "Walk me through how you hire, onboard, and offboard today.",
        "Where do approvals break or get delayed?",
        "What would Legal or IT block on day one?",
      ],
      risks: ["Feature demo before business case", "Missing Legal/IT until late stage"],
      next: "Send recap with risks, stakeholders, and a dated mutual next step.",
      assets: ["discovery", "objections", "caribbean"],
    },
    {
      id: "alignment",
      label: "Solution alignment",
      icon: "◈",
      goal: "Connect Microsoft stack capabilities to the buyer's operational outcomes.",
      actions: [
        "Position value narrative — not SKU list (BC, Fabric, Copilot, Azure as relevant)",
        "Show how Davyn's 4-step methodology de-risks delivery",
        "Address sovereignty / IT capacity objections with a workshop plan",
        "Align on pilot scope with exit criteria if deal is complex",
      ],
      questions: [
        "Which outcome would make this a win for your CEO in 90 days?",
        "What does 'good enough' look like vs. perfect?",
        "What would make you confident to recommend this internally?",
      ],
      risks: ["Competing on price before value anchored", "Ignoring GP / legacy migration angle"],
      next: "Draft executive summary + proposed mutual action plan.",
      assets: ["roi", "security", "battlecards", "messaging"],
    },
    {
      id: "stakeholders",
      label: "Stakeholder buy-in",
      icon: "◆",
      goal: "Secure multi-threaded sponsorship across HR, Finance, IT, and Legal.",
      actions: [
        "Tailor message per persona (exec vs. technical vs. finance)",
        "Run objection prep for each blocker role",
        "Get a dated exec commitment on paper (even lightweight MAP)",
        "Involve Davyn delivery lead for credibility on rollout",
      ],
      questions: [
        "Who could still say no after we think we're done?",
        "What proof does Finance need — ROI, references, or audit comfort?",
        "What does IT need to sleep at night?",
      ],
      risks: ["Champion without power", "Legal surprise in week 8"],
      next: "Schedule exec readout with pre-briefed champion.",
      assets: ["messaging", "objections", "followups"],
    },
    {
      id: "proposal",
      label: "Proposal / commercial",
      icon: "▣",
      goal: "Present total value and a clear commercial path — local billing where relevant.",
      actions: [
        "Frame TCO vs. parallel tools + rework + compliance drag",
        "Clarify subscription, implementation, and managed services scope",
        "Address FX / digital services tax / invoicing upfront for Caribbean buyers",
        "Offer phased rollout tied to measurable milestones",
      ],
      questions: [
        "How do you typically approve recurring SaaS spend?",
        "Is local currency invoicing required?",
        "What would make Finance sign this quarter vs. next?",
      ],
      risks: ["Sticker shock without ROI context", "Procurement stall on FX controls"],
      next: "Commercial review call within 5 business days — no open loops.",
      assets: ["roi", "caribbean", "followups"],
    },
    {
      id: "negotiation",
      label: "Negotiation",
      icon: "⬡",
      goal: "Protect value while removing real blockers — not imaginary ones.",
      actions: [
        "Trade concessions for commitments (timeline, case study, prepay)",
        "Never discount without shrinking scope or adding term",
        "Document security / DPA / residency answers in writing",
        "Keep exec sponsor visible — don't go dark to procurement only",
      ],
      questions: [
        "What must be true for you to sign this week?",
        "Is this a budget issue or a priority issue?",
        "What would a pilot need to prove?",
      ],
      risks: ["Death by redlines", "Re-opening technical scope without change order"],
      next: "Issue final proposal + implementation kickoff preview.",
      assets: ["objections", "security", "followups"],
    },
    {
      id: "close",
      label: "Close & launch",
      icon: "✓",
      goal: "Convert signature into measurable adoption — protect the land for expand.",
      actions: [
        "Confirm success metrics at 30 / 60 / 90 days",
        "Assign Davyn Academy or enablement touchpoints",
        "Plan first executive checkpoint post go-live",
        "Capture win story for next Caribbean deal",
      ],
      questions: [
        "Who owns adoption internally day to day?",
        "What does week-one success look like for your team?",
        "Where should we expand next — Fabric, Copilot, Power Platform?",
      ],
      risks: ["Implementation drift", "No expansion plan on Microsoft stack"],
      next: "Kickoff within 10 business days — mutual plan published.",
      assets: ["vertical-playbooks", "roi"],
    },
  ],

  problems: [
    { id: "objection", label: "Live objection", desc: "Buyer pushed back on call", route: "objections" },
    { id: "discovery", label: "Weak discovery", desc: "Need better questions fast", route: "discovery" },
    { id: "followup", label: "Follow-up stuck", desc: "No reply after demo", route: "followups" },
    { id: "security", label: "Security / compliance", desc: "Legal or IT blocker", route: "security" },
    { id: "competitive", label: "Competitor threat", desc: "Alternative on the table", route: "battlecards" },
    { id: "roi", label: "ROI / price pressure", desc: "Finance challenge", route: "roi" },
    { id: "vertical", label: "Industry context", desc: "Need vertical storyline", route: "verticals" },
    { id: "exec", label: "Executive message", desc: "Need C-level wording", route: "messaging" },
    { id: "msft", label: "Microsoft integration", desc: "BC/NAV, Marketplace, MACC", route: "msft-factorial" },
  ],

  customerTypes: [
    { id: "enterprise", label: "Enterprise / multi-site", desc: "50+ employees, committee buying", verticals: ["finance", "manufacturing", "multi-island"] },
    { id: "midmarket", label: "Mid-market", desc: "25–250 employees, owner-led decisions", verticals: ["retail", "hospitality", "professional"] },
    { id: "public", label: "Public sector", desc: "Government, SOE, regulated procurement", verticals: ["public"] },
    { id: "hospitality", label: "Hospitality / retail", desc: "Seasonal ops, high turnover", verticals: ["hospitality", "retail"] },
    { id: "finance-reg", label: "Financial services", desc: "Audit-heavy, data sensitivity", verticals: ["finance"] },
  ],

  objections: [
    {
      id: "data-sovereignty",
      title: "We can't host data outside the region",
      tags: ["security", "legal", "caribbean"],
      short: "Shift from 'cloud yes/no' to governance: controls, roles, records, and a joint workshop with Legal + IT.",
      executive:
        "We're not asking you to ignore sovereignty — we're asking what controls make data defensible for your auditors and board. Davyn designs for Caribbean compliance realities, including residency questions and documented subprocessors.",
      technical:
        "Map data categories (PII, financial, HR). Document storage location, encryption, access controls, backup/restore, and DPA terms. For Microsoft workloads, review region selection, customer lockbox, and audit logs. Consider hybrid or partner-hosted options where policy requires local custody.",
      discovery: [
        "Which data classes are non-negotiable for on-island or in-region processing?",
        "Who signs off on cross-border processing today?",
        "What audit questions failed in your last review?",
      ],
      followup:
        "Thanks for raising residency early — that's exactly how we prefer to work. Attached is a one-page governance checklist. Can we schedule 45 minutes with IT + Legal to map data classes and agree evaluation criteria?",
      risks: ["Deal stalls in Legal for months", "Competitor offers 'local only' without enterprise controls"],
      next: "Book governance workshop — do not send generic security PDFs alone.",
      assets: [
        { label: "Security & compliance hub", route: "security" },
        { label: "Caribbean insights", route: "caribbean" },
      ],
    },
    {
      id: "no-it-staff",
      title: "We don't have IT people to run this",
      tags: ["capacity", "implementation"],
      short: "Offer assisted rollout + weekly cadence; quantify cost of spreadsheets and manual HR chaos.",
      executive:
        "Lack of IT bandwidth is why partners exist. Davyn's model is Understand → Design → Deploy → Manage — you get a regional team that speaks your operating context, not a ticket queue overseas.",
      technical:
        "Scope managed deployment: identity integration (Entra ID), data migration plan, role-based access, training plan via Davyn Academy, and hypercare window. Define what stays internal vs. partner-operated.",
      discovery: [
        "Who maintains HR/payroll systems today — one person or a patchwork?",
        "What breaks when that person is unavailable?",
        "What would 'managed' need to include for you to say yes?",
      ],
      followup:
        "You mentioned limited IT capacity — we've helped similar Caribbean accounts with assisted rollout and weekly checkpoints. Can we walk through a 90-day launch plan with clear Davyn vs. client responsibilities?",
      risks: ["Buyer expects zero change management", "Scope creep without IT owner"],
      next: "Send rollout RACI + sample weekly cadence.",
      assets: [{ label: "Discovery framework", route: "discovery" }],
    },
    {
      id: "too-expensive",
      title: "It's too expensive / cheaper alternative exists",
      tags: ["roi", "finance"],
      short: "Compare total cost: parallel tools, rework, payroll errors, audit pain, manager time — ask for 3 numbers.",
      executive:
        "The comparison isn't subscription vs. subscription — it's operational risk and duplicated systems. We typically find hidden cost in manual approvals, tool sprawl, and compliance exposure that doesn't appear on a price sheet.",
      technical:
        "Build a simple TCO model: legacy licenses + spreadsheets + integration glue + error rework hours. Anchor on Microsoft platform consolidation (BC, M365, Fabric) where relevant.",
      discovery: [
        "What tools overlap today for HR, finance, and ops?",
        "What did the last payroll or compliance mistake cost?",
        "If we cut 30% of admin time, where would it go?",
      ],
      followup:
        "To make sure we're comparing apples to apples, could you share rough counts on tools, admin hours, and any recent rework incidents? We'll send a one-page value summary — no fluff.",
      risks: ["Race to discount", "Buyer compares to lightweight SMB tool"],
      next: "Run ROI narrative builder — bring 3 customer proof points.",
      assets: [{ label: "ROI narratives", route: "roi" }],
    },
    {
      id: "already-microsoft",
      title: "We already pay for Microsoft / Google",
      tags: ["positioning", "microsoft"],
      short: "Separate productivity from business systems: HR workflows, ERP, analytics, and governance aren't the same as email.",
      executive:
        "Microsoft 365 keeps people productive. Business Central, Fabric, and specialized apps run the business — finance, inventory, people operations, and executive reporting. Davyn helps you extend the Microsoft investment you already make.",
      technical:
        "Map M365 footprint vs. gaps: ERP (BC), HR (Factorial or BC HR modules), data platform (Fabric/PBI), security (Defender/Entra). Show integration story — one identity, one data estate.",
      discovery: [
        "What business processes still live outside Microsoft today?",
        "Where do executives lack a single view of operations?",
        "Are you on GP or other legacy ERP with a migration deadline?",
      ],
      followup:
        "Since you're already on Microsoft, the question is usually what still runs outside the stack — and what that costs in reconciliation and risk. Worth 30 minutes to map gaps?",
      risks: ["Treated as duplicate spend", "Missing GP sunset urgency"],
      next: "Pull Microsoft stack expansion map for this vertical.",
      assets: [
        { label: "Microsoft × Factorial (integration)", route: "msft-factorial" },
        { label: "Competitive battlecards", route: "battlecards" },
      ],
    },
    {
      id: "budget-cycle",
      title: "Maybe next budget cycle",
      tags: ["timing", "negotiation"],
      short: "Negotiate a bounded pilot with exit criteria + hard decision date on mutual action plan.",
      executive:
        "Budget cycles are real — but so is the cost of waiting. A phased pilot lets you prove value this quarter with a pre-agreed decision gate, not an open-ended trial.",
      technical:
        "Define pilot scope, users, success metrics, security baseline, and conversion path to enterprise agreement. Keep implementation light — 4–6 weeks.",
      discovery: [
        "What must be true for budget holders to release funds early?",
        "Is timing about cash or about priority?",
        "Who wins if this gets delayed 6 months?",
      ],
      followup:
        "Understood on budget timing. Would a limited pilot with clear success metrics and a decision date in [month] work for your committee?",
      risks: ["Pilot with no exec sponsor", "Free work without decision date"],
      next: "Draft pilot MAP with dated exec checkpoint.",
      assets: [{ label: "Deal stage: Proposal", route: "stages", param: "proposal" }],
    },
    {
      id: "hurricane-continuity",
      title: "Hurricanes / business continuity concerns",
      tags: ["caribbean", "operations"],
      short: "Operational continuity plan: ownership, support SLAs, export/offline responsibilities, not just 'cloud'.",
      executive:
        "Continuity in the Caribbean isn't abstract — it's who answers when infrastructure is stressed. Davyn pairs Microsoft cloud resilience with regional support and runbooks your ops team can actually execute.",
      technical:
        "Document RTO/RPO expectations, backup strategy, offline/export procedures, comms plan, and named support contacts. Align with Azure reliability and M365 continuity features where applicable.",
      discovery: [
        "What failed operationally during your last major disruption?",
        "Who is accountable for systems recovery today?",
        "What does your board expect for RTO on critical systems?",
      ],
      followup:
        "Continuity came up — smart to address early. We can share a Caribbean-oriented runbook template and walk through how Davyn supports you before, during, and after disruption events.",
      risks: ["Buyer conflates vendor SLA with internal readiness", "On-prem nostalgia without cost view"],
      next: "Schedule continuity working session with Ops + IT.",
      assets: [{ label: "Caribbean insights", route: "caribbean" }],
    },
    {
      id: "gp-migration",
      title: "We're not ready to leave Dynamics GP",
      tags: ["microsoft", "erp"],
      short: "GP end-of-life is a business risk — frame migration as finance continuity, not IT vanity.",
      executive:
        "Staying on GP isn't free — it's accumulating risk: unsupported integrations, talent scarcity, and audit exposure. Business Central on Azure is the supported path; Davyn has done this migration across Caribbean manufacturers and distributors.",
      technical:
        "Assess GP modules in use, customizations, reporting dependencies, and integration map. Propose phased BC migration with parallel run period.",
      discovery: [
        "Which GP workflows would hurt most if support disappeared?",
        "What reports does Finance run monthly that must not break?",
        "Have you priced internal cost of maintaining GP hacks?",
      ],
      followup:
        "GP migrations go best when Finance leads the outcome definition. Can we schedule a BC fit session focused on your close process and inventory — not technical jargon?",
      risks: ["Big-bang migration fear", "Undocumented GP customizations"],
      next: "Offer GP → BC assessment workshop.",
      assets: [{ label: "Vertical: Manufacturing", route: "verticals", param: "manufacturing" }],
    },
    {
      id: "cloud-act",
      title: "US CLOUD Act / extraterritorial access fears",
      tags: ["security", "caribbean", "legal"],
      short: "Acknowledge the concern; pivot to contractual, architectural, and regional custody options — don't dismiss.",
      executive:
        "Caribbean leaders are right to ask who can access data under foreign law. We address this with architecture choices, Microsoft compliance tooling, and — where required — deployment models that align with local policy and Davyn's regional expertise.",
      technical:
        "Review Microsoft documentation on law enforcement requests, customer lockbox, encryption, and data residency regions. For public sector, evaluate sovereign cloud partners and hybrid models documented in Caribbean market intel.",
      discovery: [
        "Is this a board-level policy or IT preference?",
        "Which workloads are classified highest sensitivity?",
        "Would a data classification workshop unblock evaluation?",
      ],
      followup:
        "Your CLOUD Act question is valid for Caribbean public and finance buyers. We'd like to walk through controls and deployment options with your security lead — practical, not marketing.",
      risks: ["Hand-wavy answers destroy trust", "Local competitor uses fear without enterprise depth"],
      next: "Route to Security hub + schedule Legal/IT session.",
      assets: [{ label: "Security & compliance", route: "security" }],
    },
  ],

  verticals: [
    {
      id: "hospitality",
      name: "Hospitality & resorts",
      microsoft: "LS Central · Business Central · M365 · Copilot",
      pains: ["Seasonal hiring spikes", "High turnover", "Multi-property reporting", "Payroll complexity across sites"],
      outcomes: ["Faster onboarding", "Unified ops visibility", "Less payroll error", "Executive dashboards via Power BI"],
      discovery: [
        "How do you staff up/down by season?",
        "Where do approvals slow during peak occupancy?",
        "What does HQ need from each property weekly?",
      ],
      davynAngle: "Davyn deploys LS Central for unified retail/hospitality ops plus HR automation — one regional partner for Microsoft stack and rollout.",
      assets: ["assets/downloads/industry-verticals/vertical-hospitality.pdf"],
    },
    {
      id: "retail",
      name: "Retail",
      microsoft: "LS Central · Business Central · Fabric · Power BI",
      pains: ["Inventory drift", "POS + back-office disconnect", "Shrink and margin pressure", "Multi-store staffing"],
      outcomes: ["Single view of stock and sales", "Better replenishment", "Cleaner financial close"],
      discovery: ["How many systems touch a sale end-to-end?", "Where do stockouts hurt most?", "Who owns store P&L reporting?"],
      davynAngle: "Retail runs on LS Central + BC — Davyn is the Caribbean Microsoft partner that implements and supports both.",
      assets: ["assets/downloads/industry-verticals/vertical-retail.pdf"],
    },
    {
      id: "finance",
      name: "Financial services",
      microsoft: "Azure Security · Purview · Business Central · Fabric",
      pains: ["Audit trail gaps", "Data residency scrutiny", "Manual reporting", "Third-party risk"],
      outcomes: ["Defensible controls", "Faster audit cycles", "Executive risk visibility"],
      discovery: ["What failed in your last audit?", "How do you prove who approved what?", "What data can't leave jurisdiction?"],
      davynAngle: "Lead with Security & compliance designations + governance workshops — not feature demos.",
      assets: ["assets/downloads/industry-verticals/vertical-health-pharma.pdf"],
    },
    {
      id: "manufacturing",
      name: "Manufacturing",
      microsoft: "Business Central · Azure · Copilot · Power Platform",
      pains: ["GP technical debt", "Inventory inaccuracy", "Slow month-end close", "Limited analytics"],
      outcomes: ["Modern ERP on Azure", "Real-time ops data", "AI-assisted planning"],
      discovery: ["What's still on GP?", "Where does production data live?", "What reports are built in Excel hell?"],
      davynAngle: "GP → BC migration is a flagship Davyn motion with 20+ years of regional delivery credibility.",
      assets: ["assets/downloads/industry-verticals/vertical-construction.pdf"],
    },
    {
      id: "public",
      name: "Public sector",
      microsoft: "Azure · Security · M365 · Power Platform",
      pains: ["Procurement friction", "Sovereignty mandates", "Legacy systems", "Skills gap"],
      outcomes: ["Modern citizen services", "Documented compliance", "Sustainable support model"],
      discovery: ["What procurement path applies?", "Who owns digital policy?", "What continuity events must you survive?"],
      davynAngle: "Davyn serves Caricom-adjacent accounts with public-sector grade delivery and regional presence (Trinidad, Jamaica, Belize, etc.).",
      assets: [],
    },
    {
      id: "multi-island",
      name: "Multi-island groups",
      microsoft: "Business Central · Fabric · Entra ID · M365",
      pains: ["Tool sprawl per island", "Inconsistent HR policies", "HQ reporting lag", "Identity fragmentation"],
      outcomes: ["One system of record", "Group-wide analytics", "Standardized controls"],
      discovery: ["How many HR/finance tools?", "What does HQ export manually today?", "Where do islands override policy?"],
      davynAngle: "Davyn's regional footprint matches multi-jurisdiction operating reality — not a US-only SI.",
      assets: ["assets/downloads/industry-verticals/vertical-professional-services.pdf"],
    },
    {
      id: "professional",
      name: "Professional services",
      microsoft: "Business Central · Project ops · Power BI",
      pains: ["Utilization blind spots", "Project margin leakage", "Manual time tracking"],
      outcomes: ["Better project economics", "Forecast accuracy", "Partner-ready reporting"],
      discovery: ["How do you track utilization today?", "Where do projects go off-rails?", "What does the partner group need monthly?"],
      davynAngle: "BC + Fabric for firms scaling beyond spreadsheets — implemented by consultants who know Caribbean billing realities.",
      assets: ["assets/downloads/industry-verticals/vertical-professional-services.pdf"],
    },
  ],

  discoveryFramework: {
    intro: "Regional-first discovery for Caribbean Microsoft deals. Every call should produce: stakeholder map + risks + dated next step.",
    phases: [
      {
        name: "1 · Operations context",
        prompts: [
          "How is the workforce / operation managed today — end to end?",
          "Where is fragmentation hurting speed or accuracy?",
          "What breaks during peak season or month-end?",
        ],
      },
      {
        name: "2 · Risk & data",
        prompts: [
          "What audit or residency requirements are non-negotiable?",
          "Who must approve subprocessors or cross-border processing?",
          "What was the last security or compliance scare?",
        ],
      },
      {
        name: "3 · Capacity",
        prompts: [
          "Who runs the system day to day — title and backup?",
          "What happens when they're unavailable?",
          "What would managed services need to include?",
        ],
      },
      {
        name: "4 · Finance & procurement",
        prompts: [
          "How do you pay for international SaaS today?",
          "Any FX or local invoicing constraints?",
          "What ROI proof does Finance require?",
        ],
      },
      {
        name: "5 · Decision process",
        prompts: [
          "Who can say no late in the process?",
          "Realistic timeline — and what accelerates it?",
          "What does a pilot need to prove?",
        ],
      },
      {
        name: "6 · Economic value",
        prompts: [
          "Cost of rework, errors, or manager time — even estimates help.",
          "What KPI would make this a internal win?",
          "What happens if you delay 12 months?",
        ],
      },
    ],
    output: ["Stakeholder map (economic, technical, user, blocker)", "Top 3 risks", "Dated mutual next step", "Draft success metrics"],
  },

  battlecards: [
    {
      id: "generic-smb",
      competitor: "Lightweight SMB HR / ops tool",
      when: "Buyer compares on sticker price for <100 employees",
      win: "Total cost + audit trail + Microsoft stack consolidation + Davyn managed rollout",
      talk: "Those tools win on price until you need multi-entity reporting, audit history, or integration with finance. We design for growth without replatforming in 18 months.",
      trap: "Don't feature-compare time-off modules — compare operational risk.",
    },
    {
      id: "global-si",
      competitor: "Global SI / offshore implementer",
      when: "Buyer wants 'big brand' systems integrator",
      win: "Regional delivery + Microsoft designations + same-timezone exec access + Caribbean compliance fluency",
      talk: "Global SIs sell the deck; Davyn runs the rollout with people who've delivered across Trinidad, Jamaica, Belize, and the wider Caribbean for 20+ years.",
      trap: "Attack delivery risk, not logo size.",
    },
    {
      id: "status-quo",
      competitor: "Spreadsheets + GP / legacy ERP",
      when: "'If it ain't broke' mentality",
      win: "Risk of unsupported software + hidden labor cost + no executive visibility",
      talk: "Legacy feels free until GP support, key-person dependency, or an audit exposes gaps. We quantify that before asking for budget.",
      trap: "Never insult their past decisions — frame as accumulated risk.",
    },
    {
      id: "sovereign-local",
      competitor: "Local sovereign cloud / niche vendor",
      when: "Data must stay in Caribbean jurisdiction",
      win: "Enterprise controls + Microsoft ecosystem + hybrid options + Davyn as long-term partner",
      talk: "Local custody matters — so does enterprise capability. We architect hybrid models and document controls instead of selling fear.",
      trap: "Validate the concern; don't dismiss sovereignty.",
    },
  ],

  messagingTemplates: {
    personas: ["CEO / Owner", "CFO", "CIO / IT Director", "HR Director", "Legal / Compliance"],
    outcomes: [
      "Reduce operational risk",
      "Modernize on Microsoft",
      "Improve visibility for decisions",
      "De-risk GP / legacy migration",
      "Accelerate rollout without hiring IT",
    ],
    generate: function (persona, outcome, vertical, product) {
      const v = vertical ? ` in ${vertical}` : "";
      const p = product || "Microsoft business solutions";
      const map = {
        "CEO / Owner": `We're helping similar${v} organizations run cleaner operations on ${p} — less firefighting, clearer numbers for decisions you can't delegate.`,
        "CFO": `Finance teams we work with want audit-ready processes and a real TCO view — not another silo. ${p} with Davyn reduces reconciliation drag and unsupported legacy risk.`,
        "CIO / IT Director": `You keep the estate secure and integrated. We implement ${p} with clear RACI, identity alignment, and managed options so your team isn't the bottleneck.`,
        "HR Director": `Your team needs speed and accuracy — not another manual workflow. We automate people operations while keeping IT and Legal comfortable on controls.`,
        "Legal / Compliance": `We lead with data classification, documented controls, and workshops — so compliance is designed in, not bolted on after procurement.`,
      };
      let msg = map[persona] || map["CEO / Owner"];
      if (outcome) msg += ` Primary outcome: ${outcome.toLowerCase()}.`;
      return msg;
    },
  },

  followups: [
    {
      id: "post-discovery",
      name: "After discovery call",
      subject: "Next steps — [Company] × Davyn",
      body: "Thanks for the conversation today.\n\nRecap:\n• Pain: [X]\n• Stakeholders: [names/roles]\n• Risks to address: [data / IT capacity / timing]\n\nProposed next step: [workshop / demo / governance session] on [date].\n\nWhat did I miss?",
    },
    {
      id: "post-demo",
      name: "After demo — no reply",
      subject: "Quick checkpoint — [Company]",
      body: "Wanted to check if the demo answered your core question on [outcome].\n\nIf helpful, we can do a 20-min exec summary focused on [risk/ROI/residency] — not another feature tour.\n\nStill worth pursuing this quarter?",
    },
    {
      id: "legal-intro",
      name: "Legal / IT introduction",
      subject: "Governance session — data & controls",
      body: "Following our business discussion, I'd like to introduce our technical lead to walk through data classification, access controls, and deployment options relevant to [jurisdiction].\n\n45 minutes — no sales deck, just answers for your team.",
    },
    {
      id: "proposal-sent",
      name: "Proposal follow-up",
      subject: "Commercial questions — [Company]",
      body: "Proposal sent [date]. Happy to walk Finance through TCO assumptions and phased rollout.\n\nAre there specific commercial or procurement hurdles we should address before [decision date]?",
    },
    {
      id: "stall-nudge",
      name: "Stalled deal — executive nudge",
      subject: "Priority check — [initiative name]",
      body: "We haven't moved since [last step]. Totally understand if timing shifted.\n\nIf still active, what's the one blocker we should solve together this week? If deprioritized, I'll close the loop on our side.",
    },
  ],

  security: [
    {
      q: "Where is data stored?",
      a: "Depends on workload and policy. Microsoft 365 / Azure offer region selection; Davyn maps data classes to appropriate regions and documents subprocessors in the DPA review.",
    },
    {
      q: "How do you handle access control?",
      a: "Entra ID (Azure AD) roles, least privilege, MFA, and audit logs. Implementation includes access review checkpoints.",
    },
    {
      q: "What about Barbados Data Protection Act / Caribbean privacy law?",
      a: "Treat as a governance exercise: lawful basis, transfer mechanisms, records of processing, and DPO/comissioner requirements — workshop with Legal, not a slide.",
    },
    {
      q: "Business continuity & hurricanes?",
      a: "Document RTO/RPO, backup/restore, export procedures, and Davyn support SLAs. Continuity is joint: Microsoft resilience + your runbook + regional partner response.",
    },
    {
      q: "Microsoft compliance certifications?",
      a: "Leverage Microsoft Trust Center artifacts for ISO/SOC etc.; Davyn adds implementation controls and regional support model.",
    },
  ],

  microsoftFactorial: {
    title: "Microsoft × Factorial — executive proof + integration reality",
    whyItMatters: [
      "This is not 'yet another HR tool' — it is a Microsoft-aligned motion with marketplace procurement and ERP connectivity.",
      "For Davyn executives: this supports a consultative sale (CFO/IT comfort) and reduces perceived delivery risk.",
    ],
    proofPoints: [
      { k: "Azure-native", v: "Factorial infrastructure migrated 100% to Azure (reported €300K+/month cloud consumption)." },
      { k: "Co-sell", v: "Co-sell eligible; Azure Marketplace listing active." },
      { k: "MACC", v: "Purchasing via Azure Marketplace counts toward Azure Consumption Commitment (MACC) for 1–3 year commitments." },
      { k: "Partner scale", v: "90+ Dynamics partners active (incl. TD SYNNEX). Factorial notes ~50% of partnership revenue via Microsoft." },
      { k: "AI credibility", v: "Factorial One: AI suite built on Azure + OpenAI; integrated into Teams." },
      { k: "Executive quote", v: "Satya Nadella highlighted Factorial at AI Tour Madrid (Feb 2026) as a standout AI partner story." },
    ],
    quote: {
      text: "Microsoft CEO Satya Nadella highlighted Factorial as one of the most important companies in Spain and an example of a partner building cutting edge AI solutions for SMBs around Europe and the world.",
      source: "AI Tour Madrid · February 2026",
    },
    integration: {
      bc: {
        title: "Dynamics 365 Business Central ↔ Factorial (Cloud only)",
        connector: "Aciactech (Partner/Connector) via Factorial Marketplace",
        notes: ["Cloud only — does not support BC on-premise.", "Sync via API — near real-time or scheduled batches."],
        flows: [
          { dir: "→", name: "Employees → Business Central", fields: ["First name", "Last name", "Bank account", "Phone", "Email"] },
          { dir: "←", name: "Projects ← Business Central", fields: ["Project name", "Dates", "Owner", "Subprojects/Tasks"] },
          { dir: "→", name: "Time tracking → Business Central", fields: ["Day", "Month", "Minutes", "Project/Subproject", "Employee"] },
          { dir: "→", name: "Expenses → Business Central", fields: ["Date", "Category", "VAT", "Vendor", "Payment method", "Amount", "Receipt"] },
        ],
        setup: [
          "Activate the connector in the Factorial Marketplace",
          "Provide Business Central Tenant ID + admin account",
          "Partner configures field mapping",
          "Test sync + validation",
          "Enable production",
        ],
      },
      nav: {
        title: "Dynamics NAV / Navision ↔ Factorial (on‑prem)",
        connector: "Illusion Studio (Partner/Connector)",
        notes: [
          "NAV 2015+ required.",
          "On‑premise integration via SOAP/OData Web Services (published).",
          "Separate integration from Business Central (distinct setup).",
          "Typical implementation: ~3 weeks.",
        ],
        syncs: ["Employees", "Projects and subprojects/tasks", "Time records / clock-ins", "Expenses"],
        setup: ["Configure NAV Web Services (SOAP/OData)", "Field mapping + tests", "Enable production"],
      },
    },
    salesUse: [
      "When CFO asks: justify value using MACC + marketplace procurement + ERP connectivity.",
      "When IT asks: show 'cloud-only BC' constraint early; route on-prem to NAV connector path.",
      "When exec sponsor asks: use Satya quote + Azure-native + Teams-integrated AI story.",
    ],
    enablementAssets: {
      onePagerPdf: {
        title: "Business Central integration — one-pager (EN)",
        path: "assets/downloads/msft-factorial/pdf/ENG_-_BC_one_pager.pdf",
        type: "PDF",
      },
      videos: [
        {
          title: "Employee sync (demo)",
          path: "assets/downloads/msft-factorial/videos/MicrosoftVideoDemo_BCIntegrations_EmployeeSYNC_ENG.mp4",
        },
        {
          title: "New project (demo)",
          path: "assets/downloads/msft-factorial/videos/MicrosoftVideoDemo_BCIntegrations_NewProject_ENG.mp4",
        },
        {
          title: "Time tracking (demo)",
          path: "assets/downloads/msft-factorial/videos/MicrosoftVideoDemo_BCIntegrations_TimeTracking_ENG.mp4",
        },
        {
          title: "Expenses (demo)",
          path: "assets/downloads/msft-factorial/videos/MicrosoftVideoDemo_BCIntegrations_Expenses_ENG.mp4",
        },
      ],
      images: Array.from({ length: 13 }, (_, i) => ({
        title: `Integration screenshot ${i + 1}`,
        path: `assets/downloads/msft-factorial/images/bc-integration-${i + 1}.png`,
      })),
    },
  },

  roiNarratives: [
    {
      id: "tool-sprawl",
      headline: "Stop paying twice for the same process",
      points: ["Parallel HR/finance tools", "Manual exports to Excel", "Audit rework when trails don't match"],
      ask: "How many systems touch one employee lifecycle event?",
    },
    {
      id: "legacy-risk",
      headline: "GP / legacy ERP is a balance-sheet risk",
      points: ["Unsupported integrations", "Key-person dependency", "Slow close → bad decisions"],
      ask: "What breaks if your GP expert leaves?",
    },
    {
      id: "manager-time",
      headline: "Buy back manager hours",
      points: ["Approvals in email", "Onboarding chaos", "No single dashboard for execs"],
      ask: "Hours per week spent chasing status updates?",
    },
    {
      id: "compliance",
      headline: "Compliance failures are expensive quietly",
      points: ["Payroll errors", "Access not revoked", "Audit findings"],
      ask: "Cost of last compliance surprise?",
    },
  ],

  caribbean: {
    themes: [
      "Data sovereignty and CLOUD Act concerns are board-level — not IT trivia",
      "FX controls and digital services tax affect how SaaS is bought and renewed",
      "Hurricane continuity is an operating requirement, not a nice slide",
      "Talent scarcity → buyers need managed rollout, not 'self-serve implementation'",
      "Trust is regional: local presence, references, and exec access win over global SIs",
    ],
    buyerSignals: [
      "Legal invited early → good; Legal appearing late → deal risk",
      "Ask about local invoicing → procurement complexity",
      "Multi-island HQ → need group reporting story",
      "Public sector → sovereignty and procurement path dominate",
    ],
    davynProof: [
      "20+ years Microsoft partner in the Caribbean",
      "Solution Partner designations across Business Apps, Security, Data & AI, Infrastructure, Modern Work",
      "Portfolio: BC, CRM, Azure, Fabric, Copilot, Power Platform, LS Central, Factorial HR",
      "Methodology: Understand → Design → Deploy → Manage",
      "Davyn Academy for certified enablement",
    ],
  },

  assets: [
    { title: "Getting started with Introw", type: "PPTX", path: "assets/downloads/introw/getting-started-with-introw-2026-en.pptx", tags: ["onboarding"] },
    { title: "Partner visual quick guide", type: "PPTX", path: "assets/downloads/introw/partner-quick-guide-visual-en-2026.pptx", tags: ["onboarding"] },
    { title: "Partner playbook (EN)", type: "MD", path: "assets/PARTNER_PLAYBOOK_DAVYN_EN.md", tags: ["strategy"] },
    { title: "Competitive map — light", type: "PNG", path: "assets/downloads/competitive/products-vs-competitor-light-2026-02.png", tags: ["battlecard"] },
    { title: "Competitive map — dark", type: "PNG", path: "assets/downloads/competitive/products-vs-competitor-dark-2026-02.png", tags: ["battlecard"] },
    { title: "Hospitality vertical PDF", type: "PDF", path: "assets/downloads/industry-verticals/vertical-hospitality.pdf", tags: ["vertical"] },
    { title: "Retail vertical PDF", type: "PDF", path: "assets/downloads/industry-verticals/vertical-retail.pdf", tags: ["vertical"] },
  ],
};
