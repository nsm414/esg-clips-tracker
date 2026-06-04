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
    "thehill.com", "politico.com", "axios.com", "punchbowl.news",
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
    "spectrum.ieee.org", "fiercebiotech.com", "axioshq.com"
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

const SECTION_RULES = [
  {
    name: "Policy & Advocacy",
    icon: "🏛️",
    keywords: [
      "congress", "senate", "house ", "bill", "legislation", "regulation",
      "regulatory", "executive order", "white house", "federal", "ndaa",
      "law", "act ", "governance", "policy", "lawmaker", "legislat",
      "ftc", "fcc", "doj", "antitrust", "state bill", "governor", "eu ai act",
      "preemption", "moratorium", "lobby"
    ]
  },
  {
    name: "Safety, Harms & Critical Takes",
    icon: "⚠️",
    keywords: [
      "safety", "risk", "harm", "vulnerab", "cyber", "scam", "fraud",
      "deepfake", "misinformation", "disinformation", "bias", "lawsuit",
      "sue", "breach", "exploit", "dark pattern", "manipul", "addict",
      "chatbot harm", "mental health", "child", "minor", "suicide"
    ]
  },
  {
    name: "Labor & Society",
    icon: "👷",
    keywords: [
      "job", "worker", "labor", "employment", "layoff", "hiring",
      "workforce", "union", "retraining", "displacement", "school",
      "teacher", "education", "society", "inequality", "wage"
    ]
  },
  {
    name: "Frontier Labs & Industry",
    icon: "🤖",
    keywords: [
      "openai", "anthropic", "google deepmind", "deepmind", "meta ai",
      "xai", "mistral", "model release", "gpt", "claude", "gemini",
      "frontier", "chip", "nvidia", "data center", "datacenter", "compute",
      "funding", "valuation", "ipo", "earnings"
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
  "Policy & Advocacy",
  "Frontier Labs & Industry",
  "Safety, Harms & Critical Takes",
  "Labor & Society",
  "Other Coverage"
];
