/**
 * LedgerFlow case study — full content data.
 *
 * Every fact here is grounded in the verified project scope: 5 document types,
 * 2 brands (Ritera Publishing, Ratix Info Tech) under one GSTIN, GSTR-1/GSTR-3B,
 * a PWA deployment, and the confirmed stack (React, TypeScript, Vite, Supabase,
 * PostgreSQL + RLS, Tailwind CSS v4, Recharts, react-pdf, Vercel).
 * No invented metrics, integrations, or user counts.
 */

export const ledgerflowHero = {
  eyebrow: "01 / Product · Design · Engineering",
  year: "2025",
  title: "LedgerFlow",
  description:
    "A business operating system connecting quotations, payments, invoicing, expenses, cash flow and GST in one workflow.",
  statement: "One source of truth — from the first quotation to the final GST return.",
  meta: [
    { value: "5", label: "Document types" },
    { value: "2", label: "Brands" },
    { value: "GSTR-1 + 3B", label: "GST returns" },
    { value: "PWA", label: "Installable" },
  ],
};

/* ── 02. The problem ──────────────────────────────────────────────────── */
export const problem = {
  eyebrow: "The problem",
  headlineTop: "The business didn't really have a GST problem.",
  headlineBottom: "It had a workflow problem.",
  fragments: [
    { step: "Quotation", tool: "Written up by hand" },
    { step: "Invoice", tool: "Re-typed into another tool" },
    { step: "Payments", tool: "Tracked in a spreadsheet" },
    { step: "Expenses", tool: "Logged somewhere else" },
    { step: "GST", tool: "Reconstructed at month-end" },
  ],
  insight: "Every step duplicated information. Every month required reconciliation.",
  body: "The spreadsheet wasn't really the problem. The disconnected workflow was — the business had data everywhere, and no single source of truth.",
};

/* ── 03. The idea — interactive stage explorer ────────────────────────── */
export interface Stage {
  id: string;
  label: string;
  note: string;
  description: string;
  carries: string;
  /** Optional real-screenshot inset shown in the detail panel. */
  screenshot?: string;
  screenshotCaption?: string;
}

export const ideaIntro = {
  eyebrow: "The idea",
  headlineTop: "One system.",
  headlineBottom: "Every financial stage connected.",
  bodyLead: "The problem wasn't that the business couldn't create invoices. It was that every step after the invoice created another place to copy the same information.",
  bodyFollow: "LedgerFlow treats the quotation as the start of a chain. The record underneath it keeps moving forward — into payments, expenses, cash flow, and GST — instead of being recreated from scratch at every stage.",
};

export const stages: Stage[] = [
  {
    id: "quotation",
    label: "Quotation",
    note: "Deal starts",
    description: "A quote goes out with client details, line items, and terms — the first record in the chain.",
    carries: "Client · line items · terms",
  },
  {
    id: "proforma",
    label: "Proforma Invoice",
    note: "Terms agreed",
    description: "Win the deal and the quotation becomes a proforma — same data, one click, no re-typing.",
    carries: "+ agreed terms",
  },
  {
    id: "payment",
    label: "Payment Receipt",
    note: "Money in",
    description: "Money comes in, a receipt is generated against the proforma — the payment is now on record.",
    carries: "+ amount received",
  },
  {
    id: "tax-invoice",
    label: "Tax Invoice",
    note: "GST-compliant",
    description: "The receipt closes out as a GST-compliant tax invoice — place of supply and tax split decided automatically.",
    carries: "+ GST treatment",
    screenshot: "/work/infinity-gst/invoice-form-detail.png",
    screenshotCaption: "From the actual invoice builder — place of supply decides the split",
  },
  {
    id: "expenses",
    label: "Expenses",
    note: "ITC tracked",
    description: "Business expenses are logged in parallel, each flagged for input tax credit eligibility as it's entered.",
    carries: "+ ITC eligibility",
  },
  {
    id: "cash-flow",
    label: "Cash Flow",
    note: "Live position",
    description: "Every invoice and expense rolls into one live picture of money in, money out, and net position.",
    carries: "+ running balance",
  },
  {
    id: "gst-summary",
    label: "GST Summary",
    note: "Auto-computed",
    description: "Output tax minus input credit, computed continuously — never reconstructed at filing time.",
    carries: "+ net payable",
  },
  {
    id: "gst-filing",
    label: "GST Filing",
    note: "GSTR-1 / 3B",
    description: "The filing assistant assembles GSTR-1 and GSTR-3B data and exports a CSV to hand to a CA.",
    carries: "→ ready to file",
  },
];

/* ── 04. The product — interactive screen-by-screen explorer ───────────── */
export interface ProductScreen {
  id: string;
  label: string;
  screenshot: string;
  alt: string;
  title: string;
  description: string;
}

export const productExplorerIntro = {
  eyebrow: "The product",
  headline: "The product, screen by screen.",
  body: "Anyone can build an invoice generator. The harder part was making sure the information created at the start of a deal didn't disappear into another spreadsheet a week later.",
  bodyFollow: "These are the actual screens. Together they show how one record moves through the business instead of being recreated at every step.",
};

export const productScreens: ProductScreen[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    screenshot: "/work/infinity-gst/dashboard.png",
    alt: "LedgerFlow dashboard — revenue, GST collected, expenses, ITC, and business health",
    title: "Dashboard",
    description:
      "Once the records were connected, this stopped being a summary and became the actual reason to open the app — revenue, GST, expenses, and business health, pulled from documents that already existed.",
  },
  {
    id: "clients",
    label: "Clients",
    screenshot: "/work/infinity-gst/clients.png",
    alt: "LedgerFlow clients list — GSTIN, state, and document history per client",
    title: "Clients",
    description:
      "Every quotation, invoice, and receipt needs somewhere to point back to. One client record — GSTIN, state, history — instead of a name re-typed on each new document.",
  },
  {
    id: "quotations",
    label: "Quotations",
    screenshot: "/work/infinity-gst/quotations.png",
    alt: "LedgerFlow quotations list — line items, GST options, status, and totals",
    title: "Quotations",
    description:
      "The deal starts here. Line items, GST options, and place of supply — sent in minutes, and built to be converted forward, not retyped later.",
  },
  {
    id: "tax-invoices",
    label: "Tax Invoices",
    screenshot: "/work/infinity-gst/invoice-form.png",
    alt: "LedgerFlow invoice builder — GST invoice type, client and supply details, line items",
    title: "Tax Invoices",
    description:
      "This is where a mistake actually costs money. Place of supply decides CGST + SGST or IGST automatically, so the tax split isn't a judgment call made under deadline pressure.",
  },
  {
    id: "receipts",
    label: "Payment Receipts",
    screenshot: "/work/infinity-gst/payment-receipt-form.png",
    alt: "LedgerFlow payment receipt form — amount received and payment mode",
    title: "Payment Receipts",
    description:
      "An invoice says money is owed. A receipt says money arrived. Keeping them as separate records is the only way cash flow can be trusted later.",
  },
  {
    id: "expenses",
    label: "Expenses",
    screenshot: "/work/infinity-gst/expenses.png",
    alt: "LedgerFlow expenses — vendor, category, GST, and ITC eligibility",
    title: "Expenses",
    description:
      "Every cost gets flagged for input tax credit the moment it's entered — not reconstructed from a stack of bills the week before filing.",
  },
  {
    id: "cash-flow",
    label: "Cash Flow",
    screenshot: "/work/infinity-gst/cash-flow.png",
    alt: "LedgerFlow cash flow — opening/closing balance, inflow/outflow chart, and transactions",
    title: "Cash Flow",
    description:
      "Invoices, receipts, and expenses all feed one number: what's actually sitting in the account right now, not what's been billed.",
  },
  {
    id: "gst",
    label: "GST",
    screenshot: "/work/infinity-gst/gst-summary.png",
    alt: "LedgerFlow GST summary — output tax, ITC, and net payable",
    title: "GST",
    description:
      "Output tax minus input credit, computed continuously. The number shown here is the same one that goes into the monthly filing — nobody recalculates it by hand.",
  },
];

/* ── 05. System / data flow ───────────────────────────────────────────── */
export const systemFlow = {
  eyebrow: "The system",
  headlineTop: "One data model.",
  headlineBottom: "Every downstream document is generated from it.",
  body: "Client and quotation data doesn't get copied forward — it flows forward. Every node below reads from the same record the one above it created.",
};

/* ── 06. Business health (dashboard deep-dive) ──────────────────────────── */
export const dashboardSection = {
  eyebrow: "Business health",
  headline: "The dashboard didn't get interesting until the data did.",
  body: "A dashboard is only as good as what feeds it. Once quotations, invoices, receipts, and expenses lived in one connected model, the numbers below stopped being a manual report and became a byproduct of just using the app.",
  url: "infinity-finance-cyan.vercel.app",
  callouts: [
    { label: "Total Revenue", left: "18%", top: "26%" },
    { label: "GST Collected", left: "73%", top: "36%" },
    { label: "Total Expenses", left: "73%", top: "45%" },
    { label: "ITC Available", left: "73%", top: "54%" },
    { label: "Pending Invoices", left: "29%", top: "68%" },
    { label: "Business Health", left: "88%", top: "90%" },
  ],
};

/* ── 07. Cash flow ─────────────────────────────────────────────────────── */
export const cashFlowSection = {
  eyebrow: "Cash flow",
  headlineTop: "Money in. Money out.",
  headlineBottom: "One running picture.",
  leadLine: "An invoice tells you what should come in. Cash flow tells you what actually did.",
  body: "A business doesn't care about three separate spreadsheets. It cares about one question: where did the money actually go? LedgerFlow keeps invoices, receipts, and expenses as separate records, then nets them into one running position, so the answer is current instead of reconstructed at month-end.",
  formula: ["Opening balance", "+ Inflows", "− Outflows", "= Closing balance"],
  url: "infinity-finance-cyan.vercel.app/cash-flow",
};

/* ── 08. GST — carousel ───────────────────────────────────────────────── */
export interface GstSlide {
  id: string;
  label: string;
  screenshot: string;
  alt: string;
  url: string;
  caption: string;
}

export const gstSection = {
  eyebrow: "GST",
  headline: "GST usually means reconstructing a month you've already lived through.",
  body: "Sales and eligible expenses already carry their GST treatment the moment they're entered. So the GST workflow isn't a calculation exercise at month-end — it's a total of numbers that were already correct.",
  chain: ["Business transactions", "GST Summary", "GSTR-1", "GSTR-3B"],
  caution: "This is a GST preparation and filing workflow — it assembles return-ready data and exports it for filing, not a direct connection to the government GST portal.",
  slides: [
    {
      id: "summary",
      label: "GST Summary",
      screenshot: "/work/infinity-gst/gst-summary.png",
      alt: "LedgerFlow GST summary — output/input tax, CGST, SGST, IGST breakdown",
      url: "infinity-finance-cyan.vercel.app/gst-summary",
      caption: "Output tax, input credit, and net payable — computed from the invoices and expenses already in the system.",
    },
    {
      id: "filing",
      label: "GST Filing · GSTR-3B",
      screenshot: "/work/infinity-gst/gst-filing.png",
      alt: "LedgerFlow GST filing helper — GSTR-3B tables, ITC, and pre-filing checklist",
      url: "infinity-finance-cyan.vercel.app/gst-filing",
      caption: "The same numbers, assembled into the shape a CA actually needs, plus a pre-filing checklist.",
    },
  ] satisfies GstSlide[],
};

/* ── 09. Mobile / PWA — carousel ─────────────────────────────────────── */
export interface MobileScreen {
  id: string;
  src: string;
  alt: string;
  label: string;
}

export const mobileSection = {
  eyebrow: "Mobile · PWA",
  headline: "I didn't want mobile to mean desktop, but smaller.",
  body: "The business doesn't stop when someone leaves their desk. Checking revenue, logging a payment, glancing at GST status, adding an expense — these needed to actually work from a phone, not just load on one. Mobile got its own bottom navigation, its own touch-sized cards, and screens built around single tasks instead of the full desktop layout squeezed down.",
  logo: "/work/infinity-gst/pwa-logo.png",
  screens: [
    {
      id: "dashboard",
      src: "/work/infinity-gst/mobile-dashboard.png",
      label: "Dashboard",
      alt: "LedgerFlow mobile dashboard — collected total, chart, and stat cards",
    },
    {
      id: "cashflow",
      src: "/work/infinity-gst/mobile-cashflow.png",
      label: "Cash Flow",
      alt: "LedgerFlow mobile cash flow — closing balance, money in/out, and chart",
    },
    {
      id: "transactions",
      src: "/work/infinity-gst/mobile-transactions.png",
      label: "Transactions",
      alt: "LedgerFlow mobile recent transactions list with bottom navigation",
    },
    {
      id: "receipts",
      src: "/work/infinity-gst/mobile-receipts.png",
      label: "Receipts",
      alt: "LedgerFlow mobile payment receipts — total collected and recent receipts",
    },
  ] satisfies MobileScreen[],
};

/* ── 10. The build ─────────────────────────────────────────────────────── */
export interface BuildGroup {
  label: string;
  items: string[];
  description: string;
}

export const buildGroups: BuildGroup[] = [
  {
    label: "Frontend",
    items: ["React", "TypeScript", "Vite", "Tailwind CSS v4"],
    description: "Component-driven UI shared across dashboards, forms, and documents — the same patterns whether you're filling a quotation or reading the GST summary.",
  },
  {
    label: "Data",
    items: ["Supabase", "PostgreSQL", "Row-level security"],
    description: "Clients, documents, payments, expenses, and GST data live as relational records that reference each other — not five disconnected tables pretending to be one system.",
  },
  {
    label: "Documents",
    items: ["react-pdf", "PDF generation pipeline"],
    description: "Every PDF is generated from the same data that's on screen. There's no separate document to keep in sync by hand.",
  },
  {
    label: "Analytics",
    items: ["Recharts"],
    description: "Charts read from the same transactional records as everything else — a view of the data, not a separate export.",
  },
  {
    label: "Infrastructure",
    items: ["Vercel", "Installable PWA"],
    description: "Fast to ship, and installs like a native app on both desktop and phone.",
  },
];

/* ── 10b. Engineering thinking ───────────────────────────────────────── */
export interface Principle {
  title: string;
  body: string;
}

export const engineeringPrinciples: Principle[] = [
  {
    title: "One source of truth",
    body: "Client and document data flows forward instead of being copied by hand between screens.",
  },
  {
    title: "Derived financial state",
    body: "Revenue, GST, expenses, and cash flow are computed from transactional records — not maintained as separate numbers that can quietly drift apart.",
  },
  {
    title: "Document chain",
    body: "Quotation → Proforma → Invoice → Payment → GST behaves like one workflow, not five unrelated screens that happen to share a sidebar.",
  },
  {
    title: "Data isolation",
    body: "PostgreSQL with row-level security keeps each business's records where they belong, by default — not by convention.",
  },
  {
    title: "Mobile as a product",
    body: "The PWA isn't just a deployment format. It changed how screens were structured for a smaller, touch-first surface.",
  },
];

export const engineeringIntro = {
  eyebrow: "Engineering",
  headline: "What it's built with — and why it's built that way.",
};

/* ── 11. Product decisions ────────────────────────────────────────────── */
export interface Decision {
  index: string;
  title: string;
  body: string;
}

export const decisions: Decision[] = [
  {
    index: "01",
    title: "Connect the workflow",
    body: "Anyone can generate an invoice. Connecting what happens before and after it was the harder problem — making the quotation created today become tomorrow's invoice, payment record, and GST data without re-entering anything.",
  },
  {
    index: "02",
    title: "Separate billed money from actual cash",
    body: "An invoice isn't cash. A payment needed its own record, so the cash-flow picture reflected what actually happened in the bank — not what was billed.",
  },
  {
    index: "03",
    title: "Design mobile as a real product",
    body: "Responsive wasn't enough. Mobile needed its own navigation and information hierarchy, or it would still feel like desktop, just smaller.",
  },
  {
    index: "04",
    title: "One GSTIN, two brands",
    body: "Ritera Publishing and Ratix Info Tech share one GSTIN but need separate identities on every document. Sub-brand became a property of the document itself, not a second company file to maintain.",
  },
];

export const decisionsIntro = {
  eyebrow: "Product decisions",
  headline: "The interesting part wasn't the invoice.",
};

/* ── 12. Closing ───────────────────────────────────────────────────────── */
export const closing = {
  eyebrow: "Closing",
  reflection:
    "LedgerFlow started as an attempt to stop typing the same numbers into three different places for a business I could see struggling with exactly that. It turned into the project that taught me the most about what “connected data” actually means in practice: once a quotation, a tax invoice, and a GST return are views of the same record instead of three separate guesses, most of what makes accounting software painful quietly disappears.",
  headline: "From fragmented workflows to one operating system.",
  stats: [
    { value: "5", label: "Document types" },
    { value: "2", label: "Brands" },
    { value: "GSTR-1/3B", label: "Return-ready" },
    { value: "1", label: "Source of truth" },
  ],
  body: "Quotation to payment to compliance — one connected workflow instead of five disconnected tasks.",
  ctaHeadline: "See the system in action.",
  liveUrl: "https://infinity-finance-cyan.vercel.app",
  liveLabel: "View Live Product",
};
