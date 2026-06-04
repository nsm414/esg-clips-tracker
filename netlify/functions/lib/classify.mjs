// Outlet tier classification + section assignment for clips.
// Edit the domain lists below to tune outlet tiers — this is the editorial control panel.

export const TIER_DOMAINS = {
  tier1: [
    "nytimes.com", "washingtonpost.com", "wsj.com", "bloomberg.com",
    "reuters.com", "apnews.com", "ft.com", "economist.com",
    "theatlantic.com", "newyorker.com", "npr.org", "cnn.com",
    "nbcnews.com", "abcnews.go.com", "cbsnews.com", "usatoday.com",
    "latimes.com", "theguardian.com", "bbc.com", "bbc.co.uk", "time.com",
    "deseret.com", "forbes.com", "businessinsider.com", "cnbc.com"
  ],
  political: [
    // thehill.com removed per Nick (June 2026) — too much wire-echo volume;
    // unlisted means Hill stories land in the radar bucket, not the main feed
    "politico.com", "axios.com", "punchbowl.news",
    "semafor.com", "rollcall.com", "washingtonexaminer.com",
    "washingtontimes.com", "nationalreview.com", "thedispatch.com",
    "notus.org", "govexec.com", "federalnewsnetwork.com", "nextgov.com",
    "statescoop.com", "route-fifty.com"
  ],
  trade: [
    "techcrunch.com", "theverge.com", "theinformation.com", "wired.com",
    "arstechnica.com", "venturebeat.com", "zdnet.com", "engadget.com",
    "404media.co", "restofworld.org", "theregister.com", "infoworld.com",
    "computerworld.com", "fastcompany.com", "technologyreview.com",
    "spectrum.ieee.org", "fiercebiotech.com", "axioshq.com",
    "themarkup.org", "calmatters.org", "propublica.org", "fortune.com",
    "motherjones.com"
  ],
  thinktank: [
    "brookings.edu", "cdt.org", "aei.org", "csis.org", "rand.org",
    "carnegieendowment.org", "cfr.org", "newamerica.org", "itif.org",
    "cato.org", "heritage.org", "americanprogress.org", "rstreet.org",
    "datainnovation.org", "ai-frontiers.org", "ifp.org", "fas.org",
    "openai.com", "anthropic.com", "deepmind.google", "eastasiaforum.org",
    "lawfaremedia.org", "techpolicy.press", "knightcolumbia.org"
  ]
};

// Outlets that never appear anywhere: PR wires, market aggregators, content farms.
// They still get counted (wire pickup volume is a Phase 6 signal) but never displayed.
export const BLOCKLIST = [
  "businesswire.com", "prnewswire.com", "globenewswire.com", "newswire.com",
  "accesswire.com", "einnews.com", "openpr.com", "prweb.com",
  "benzinga.com", "moneycontrol.com", "firstpost.com", "business-standard.com",
  "livemint.com", "financialexpress.com", "zeebiz.com", "ndtvprofit.com",
  "streetinsider.com", "marketscreener.com", "investing.com", "tipranks.com",
  "stocktitan.net", "marketbeat.com", "insidermonkey.com", "fool.com",
  "biztoc.com", "menafn.com", "devdiscourse.com", "bignewsnetwork.com",
  "laotiantimes.com", "urdupoint.com"
];

// Wire services whose bylines show up on aggregator rewrites.
const WIRE_CREATORS = ["bloomberg", "reuters", "associated press", "ap ", "afp", "ani", "pti", "ians"];

export function isBlocked(sourceUrl = "") {
  let host = "";
  try { host = new URL(sourceUrl).hostname.replace(/^www\./, ""); } catch { host = sourceUrl; }
  return BLOCKLIST.some(d => host === d || host.endsWith("." + d));
}

// An unlisted outlet running a story bylined to a wire service = rewrite/echo.
// Signal for spread metrics, junk for display.
export function isWireEcho(creators, tier) {
  if (tier !== "other") return false;
  const c = (creators || []).join(" ").toLowerCase();
  return WIRE_CREATORS.some(w => c.includes(w));
}

export const ALLOWLIST = () => Object.values(TIER_DOMAINS).flat();

// Section taxonomy mirrors Nick's clips routine:
// 💰 Industry & Deals / 🏛️ Policy & Regulation / ⚠️ Safety, Harms & Critical Takes /
// 👷 Labor & Society / 🔬 Research & Culture
const SECTION_RULES = [
  {
    name: "Policy & Regulation",
    icon: "🏛️",
    keywords: [
      "congress", "senate", "house ", "bill", "legislation", "regulation",
      "regulatory", "executive order", "white house", "federal", "ndaa",
      "law", "act ", "governance", "policy", "lawmaker", "legislat",
      "ftc", "fcc", "doj", "state bill", "governor", "eu ai act",
      "preemption", "moratorium", "lobby", "election", "rulemaking", "agency"
    ]
  },
  {
    name: "Safety, Harms & Critical Takes",
    icon: "⚠️",
    keywords: [
      "safety", "risk", "harm", "vulnerab", "cyber", "scam", "fraud",
      "deepfake", "misinformation", "disinformation", "bias", "lawsuit",
      "sue", "breach", "exploit", "dark pattern", "manipul", "addict",
      "chatbot harm", "mental health", "child", "minor", "teen", "suicide",
      "incident", "jailbreak", "guardrail"
    ]
  },
  {
    name: "Labor & Society",
    icon: "👷",
    keywords: [
      "job", "worker", "labor", "employment", "layoff", "hiring",
      "workforce", "union", "retraining", "displacement", "school",
      "teacher", "education", "student", "society", "inequality", "wage"
    ]
  },
  {
    name: "Industry & Deals",
    icon: "💰",
    keywords: [
      "openai", "anthropic", "google deepmind", "deepmind", "meta ai",
      "xai", "mistral", "model release", "gpt", "claude", "gemini",
      "frontier", "chip", "nvidia", "data center", "datacenter", "compute",
      "funding", "valuation", "ipo", "earnings", "acquisition", "merger",
      "antitrust", "copyright", "licensing", "partnership", "investment"
    ]
  },
  {
    name: "Research & Culture",
    icon: "🔬",
    keywords: [
      "study", "research", "paper", "report", "survey", "university",
      "benchmark", "scientist", "academic", "culture", "art", "film",
      "book", "music", "creative"
    ]
  }
];

const DEFAULT_SECTION = { name: "Other Coverage", icon: "📰" };

export function classifyTier(sourceUrl = "", sourceId = "") {
  let host = "";
  try { host = new URL(sourceUrl).hostname.replace(/^www\./, ""); } catch { host = sourceUrl; }
  for (const [tier, domains] of Object.entries(TIER_DOMAINS)) {
    if (domains.some(d => host === d || host.endsWith("." + d))) return tier;
  }
  return "other";
}

export function classifySection(article) {
  const text = [
    article.title || "",
    article.description || "",
    (article.keywords || []).join(" ")
  ].join(" ").toLowerCase();

  let best = DEFAULT_SECTION, bestScore = 0;
  for (const rule of SECTION_RULES) {
    const score = rule.keywords.reduce((n, k) => n + (text.includes(k) ? 1 : 0), 0);
    if (score > bestScore) { best = rule; bestScore = score; }
  }
  return { name: best.name, icon: best.icon };
}

export const SECTION_ORDER = [
  "Policy & Regulation",
  "Industry & Deals",
  "Safety, Harms & Critical Takes",
  "Labor & Society",
  "Research & Culture",
  "Other Coverage"
];
