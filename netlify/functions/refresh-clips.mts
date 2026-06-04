// Scheduled function: pulls fresh AI-policy clips from NewsData.io every hour,
// normalizes + classifies them, merges into the rolling 7-day store.
import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { classifyTier, classifySection, SECTION_ORDER } from "./lib/classify.mjs";

const QUERIES = [
  // NewsData.io q supports AND/OR; max 100 chars each. Tune freely.
  '"AI regulation" OR "AI policy" OR "AI executive order" OR "AI Act"',
  '"artificial intelligence" AND (Congress OR Senate OR "White House" OR legislation)',
  '"AI safety" OR "frontier model" OR "AI governance"'
];

const KEEP_DAYS = 7;

export default async (req: Request) => {
  const apiKey = Netlify.env.get("NEWSDATA_API_KEY");
  if (!apiKey) { console.error("NEWSDATA_API_KEY not set"); return; }

  const store = getStore("clips");
  const existing = (await store.get("latest", { type: "json" })) || { articles: [] };
  const seen = new Set(existing.articles.map((a: any) => a.id));
  const seenLinks = new Set(existing.articles.map((a: any) => a.url));
  const seenTitles = new Set(existing.articles.map((a: any) => normTitle(a.headline)));

  const fresh: any[] = [];
  for (const q of QUERIES) {
    try {
      const url = new URL("https://newsdata.io/api/1/latest");
      url.searchParams.set("apikey", apiKey);
      url.searchParams.set("q", q);
      url.searchParams.set("language", "en");
      url.searchParams.set("size", "10");
      const res = await fetch(url.toString());
      if (!res.ok) { console.error("NewsData error", res.status, await res.text()); continue; }
      const data = await res.json();
      for (const r of data.results || []) {
        if (r.duplicate) continue;                      // NewsData's own dedup flag
        if (seen.has(r.article_id)) continue;           // already stored
        if (seenLinks.has(r.link)) continue;
        const nt = normTitle(r.title);
        if (seenTitles.has(nt)) continue;               // near-dupe headline
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
          tier: classifyTier(r.source_url || r.link, r.source_id),
          type: r.datatype === "opinion" ? "opinion" : "news",
          section: section.name,
          sectionIcon: section.icon,
          keywords: (r.keywords || []).slice(0, 8)
        });
      }
    } catch (e) { console.error("query failed", q, e); }
  }

  // merge, prune to KEEP_DAYS, sort newest first
  const cutoff = Date.now() - KEEP_DAYS * 86400_000;
  const all = [...fresh, ...existing.articles]
    .filter((a: any) => new Date(a.pubDate || a.date).getTime() > cutoff)
    .sort((a: any, b: any) => (b.pubDate || "").localeCompare(a.pubDate || ""));

  await store.setJSON("latest", {
    topic: "AI Policy & Regulation",
    generated: new Date().toISOString(),
    sectionOrder: SECTION_ORDER,
    newThisRun: fresh.length,
    articles: all
  });

  // archive a daily snapshot for Phase 6 trend analysis
  const day = new Date().toISOString().slice(0, 10);
  await store.setJSON(`archive/${day}`, { day, count: all.length, articles: all });

  console.log(`refresh-clips: ${fresh.length} new, ${all.length} total`);
};

function normTitle(t = "") {
  return t.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim().slice(0, 80);
}

export const config: Config = {
  schedule: "@hourly"
};
