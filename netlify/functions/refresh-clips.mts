// Scheduled function: pulls fresh AI-policy clips from NewsData.io every hour.
// Two lanes:
//   Lane 1 (precision): direct domain-restricted pulls of allowlisted outlets —
//     a core batch every hour + rotating batches covering the full list every ~3 hrs.
//   Lane 2 (recall): broad keyword sweeps across all sources.
// Display logic: allowlisted outlets are "curated"; unknown-but-real outlets go to
// the radar bucket; blocklisted junk and wire echoes are counted but never shown.
import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import {
  classifyTier, classifySection, SECTION_ORDER,
  TIER_DOMAINS, isBlocked, isWireEcho
} from "./lib/classify.mjs";

// Full topic flag list from the clips routine. 3 sweeps run per hour on rotation,
// so every topic gets swept every ~3 hours; lane-1 outlet pulls cover the gaps hourly.
const SWEEP_QUERIES = [
  '"AI regulation" OR "AI policy" OR "AI executive order" OR "AI Act"',
  '"artificial intelligence" AND (Congress OR Senate OR "White House" OR legislation)',
  '"AI safety" OR "frontier model" OR "AI governance" OR "AI harms"',
  'AI AND (layoffs OR jobs OR workforce OR union OR hiring)',
  'AI AND (children OR teens OR schools OR education OR chatbot)',
  'AI AND (election OR disinformation OR deepfake)',
  'AI AND (antitrust OR copyright OR IPO OR acquisition OR lawsuit)',
  '(OpenAI OR Anthropic OR DeepMind OR xAI) AND (Washington OR policy OR safety OR deal)'
];
// Paid tier (Basic, June 2026): all sweeps every hour, 50 articles/request,
// full outlet list cycled every ~2 hours. ~13k credits/mo against the 20k budget.
const SWEEPS_PER_RUN = SWEEP_QUERIES.length;
const PAGE_SIZE = "50";

// Lane 1: outlets checked by name. Core = every hour; the rest rotate.
const CORE_DOMAINS = ["nytimes.com", "washingtonpost.com", "wsj.com", "politico.com", "axios.com"];
const LANE1_QUERY = 'AI OR "artificial intelligence"';
// NewsData's canonical spellings differ for some outlets; null = skip in queries
// (classification still recognizes them — this only affects lane-1 fetching).
const QUERY_OVERRIDES: Record<string, string | null> = {
  "cnn.com": "edition.cnn.com",
  "bbc.co.uk": null
};
const ROTATING_BATCHES_PER_RUN = 9;   // 9 batches x 5 domains, full list every ~2 hours
const KEEP_DAYS = 7;

export default async (req: Request) => {
  const apiKey = Netlify.env.get("NEWSDATA_API_KEY");
  if (!apiKey) { console.error("NEWSDATA_API_KEY not set"); return; }

  const store = getStore("clips");
  const existing = (await store.get("latest", { type: "json" })) || { articles: [] };
  const seen = new Set(existing.articles.map((a: any) => a.id));
  const seenLinks = new Set(existing.articles.map((a: any) => a.url));
  const seenTitles = new Set(existing.articles.map((a: any) => normTitle(a.headline)));

  // build this run's request list
  const allDomains: string[] = Object.values(TIER_DOMAINS).flat() as string[];
  const rotating = allDomains.filter(d => !CORE_DOMAINS.includes(d));
  const batches = chunk(rotating, 5);
  const hour = new Date().getUTCHours();
  const start = (hour * ROTATING_BATCHES_PER_RUN) % Math.max(batches.length, 1);
  const todaysBatches = [CORE_DOMAINS];
  for (let i = 0; i < ROTATING_BATCHES_PER_RUN && batches.length > 0; i++) {
    todaysBatches.push(batches[(start + i) % batches.length]);
  }

  // rotate which sweep queries run this hour (3 of 8, full coverage every ~3 hrs)
  const sweepStart = (hour * SWEEPS_PER_RUN) % SWEEP_QUERIES.length;
  const sweeps: string[] = [];
  for (let i = 0; i < SWEEPS_PER_RUN; i++) {
    sweeps.push(SWEEP_QUERIES[(sweepStart + i) % SWEEP_QUERIES.length]);
  }

  const requests: { q: string; domainurl?: string }[] = [
    ...todaysBatches.map(b => ({ q: LANE1_QUERY, domainurl: b.join(",") })),
    ...sweeps.map(q => ({ q }))
  ];

  const fresh: any[] = [];
  let junkSkipped = 0, echoSkipped = 0;

  for (const reqSpec of requests) {
    try {
      const results = await fetchNewsData(apiKey, reqSpec.q, reqSpec.domainurl);

      for (const r of results) {
        if (r.duplicate) continue;
        if (seen.has(r.article_id) || seenLinks.has(r.link)) continue;
        const nt = normTitle(r.title);
        if (seenTitles.has(nt)) continue;

        const tier = classifyTier(r.source_url || r.link, r.source_id);
        if (isBlocked(r.source_url || r.link)) { junkSkipped++; continue; }
        if (isWireEcho(r.creator, tier)) { echoSkipped++; continue; }

        seen.add(r.article_id); seenLinks.add(r.link); seenTitles.add(nt);
        const section = classifySection(r);
        fresh.push({
          id: r.article_id,
          headline: r.title,
          url: r.link,
          outlet: r.source_name || r.source_id,
          sourceUrl: r.source_url || "",
          date: (r.pubDate || "").slice(0, 10),
          pubDate: r.pubDate,
          description: r.description || "",
          tier,
          curated: tier !== "other",
          type: r.datatype === "opinion" ? "opinion" : "news",
          section: section.name,
          sectionIcon: section.icon,
          keywords: (r.keywords || []).slice(0, 8)
        });
      }
    } catch (e) { console.error("query failed", JSON.stringify(reqSpec).slice(0, 120), e); }
  }

  // migrate previously stored articles: drop blocklisted, and re-derive tier,
  // curated flag, and section from the CURRENT rules so allowlist/taxonomy
  // changes apply retroactively to stored clips
  const migrated = existing.articles
    .filter((a: any) => !isBlocked(a.sourceUrl || a.url))
    .map((a: any) => {
      const tier = classifyTier(a.sourceUrl || a.url, "");
      const section = classifySection({ title: a.headline, description: a.description, keywords: a.keywords });
      return { ...a, tier, curated: tier !== "other", section: section.name, sectionIcon: section.icon };
    });

  const cutoff = Date.now() - KEEP_DAYS * 86400_000;
  const all = [...fresh, ...migrated]
    .filter((a: any) => new Date(a.pubDate || a.date).getTime() > cutoff)
    .sort((a: any, b: any) => (b.pubDate || "").localeCompare(a.pubDate || ""));

  await store.setJSON("latest", {
    topic: "AI Policy & Regulation",
    generated: new Date().toISOString(),
    sectionOrder: SECTION_ORDER,
    newThisRun: fresh.length,
    junkSkipped,
    echoSkipped,
    articles: all
  });

  const day = new Date().toISOString().slice(0, 10);
  await store.setJSON(`archive/${day}`, { day, count: all.length, junkSkipped, echoSkipped, articles: all });

  console.log(`refresh-clips: ${fresh.length} new (${fresh.filter(a => a.curated).length} curated), ${junkSkipped} junk, ${echoSkipped} echoes, ${all.length} total`);
};

// Fetch with self-healing domain handling: if NewsData rejects a domain (422),
// drop just that domain and retry the batch rather than losing all of it.
async function fetchNewsData(apiKey: string, q: string, domainurl?: string): Promise<any[]> {
  let domains = domainurl
    ? domainurl.split(",")
        .map(d => QUERY_OVERRIDES[d] === undefined ? d : QUERY_OVERRIDES[d])
        .filter((d): d is string => !!d)
    : null;

  for (let attempt = 0; attempt < 6; attempt++) {
    if (domains && domains.length === 0) return [];
    const url = new URL("https://newsdata.io/api/1/latest");
    url.searchParams.set("apikey", apiKey);
    url.searchParams.set("q", q);
    url.searchParams.set("language", "en");
    url.searchParams.set("size", PAGE_SIZE);
    if (domains) url.searchParams.set("domainurl", domains.join(","));

    const res = await fetch(url.toString());
    if (res.ok) return (await res.json()).results || [];

    const txt = await res.text();
    let removedAny = false;
    if (res.status === 422 && domains) {
      try {
        const err = JSON.parse(txt);
        const bad = (Array.isArray(err.results) ? err.results : [])
          .map((r: any) => r.invalid_domain).filter(Boolean);
        if (bad.length) {
          console.warn("dropping invalid domains:", bad.join(","));
          domains = domains.filter(d => !bad.includes(d));
          removedAny = true;
        }
      } catch {}
    }
    if (!removedAny) {
      console.error("NewsData error", res.status, txt.slice(0, 200));
      return [];
    }
  }
  return [];
}

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

function normTitle(t = "") {
  return t.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim().slice(0, 80);
}

export const config: Config = {
  schedule: "@hourly"
};
