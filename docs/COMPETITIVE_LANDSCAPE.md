# AI-driven news/intelligence tools — what to learn from each
Criteria: independently covered + something innovative we can borrow.
Researched June 2026. REVISIT at Phase 5 (display), Phase 6 (analysis), Phase 7 (productization).
Companion doc: ALIGNEDNEWS_TEARDOWN.md (the most directly relevant reference).

## Consumer-grade aggregators

### Particle (particle.news) — ex-Twitter product/eng leads, $15M+ raised, TechCrunch coverage
- Innovation: story-first architecture — clusters all coverage of an event into one
  "story" object, then layers views on it: "Contrast" (visualizes how outlets across the
  political spectrum frame the SAME story), "Explain Like I'm 5", "Just the Facts" (5 Ws),
  per-story AI chatbot Q&A.
- Borrow (Phase 5/6): story-cluster as the display unit, not the article. Their
  "Contrast" view is structurally identical to our outlet-tier narrative analysis —
  a clips version would show how Tier 1 vs trade vs political outlets frame one story.
- Also note: publisher-friendly posture (citations, rev-share talks) as PR cover.

### News Minimalist (newsminimalist.com) — solo build, HN/indie coverage
- Innovation: LLM assigns every article (~30k/day) a 0-10 SIGNIFICANCE score; the feed
  only shows 5.5+. "If nothing significant happens, the feed is short by design."
- Borrow (Phase 6): a significance threshold is the cleanest possible quiet-day
  mechanism — maps exactly to Nick's "don't stretch on a quiet day" house rule.
  Per-clip significance scoring also gives us item ordering + edition length control.

### Otherweb — $3.3M raised, Axios/TechBrew coverage, claims 7M MAU
- Innovation: "nutrition label" per article — model outputs displayed as metadata:
  tone, language complexity, source count/diversity, clickbait probability.
- Borrow (Phase 5/6): per-clip metadata badges (opinion vs reporting, tone, source
  diversity) as lightweight credibility UI. Transparent scoring = client trust.

### Ground News — sustained mainstream coverage
- Innovation: every story rated for outlet bias distribution using three independent
  ratings orgs (AllSides, Ad Fontes, MBFC); shows "blindspots" (stories one side ignores).
- Borrow (Phase 6): the BLINDSPOT concept inverted = our narrative-migration signal:
  which stories are trade-only and never cross to Tier 1/political — and which cross fast.

### Artifact (RIP) — Instagram founders; shut down Jan 2024, tech sold to Yahoo
- Cautionary tale, heavily covered: great AI clustering/summarization, died from
  unclear product identity (news app? social? Pinterest?) and mainstream indifference.
- Lesson (Phase 7): stay a TOOL for a defined professional user (comms/policy people),
  not a consumer destination. Niche + workflow integration beats general audience.

## Professional/comms-grade intelligence (our actual category)

### NewsWhip — acquired by Sprout Social 2025 (~$55-65M)
- Innovation: PREDICTIVE engagement — patented algorithms forecast which stories will
  go viral hours ahead from early engagement velocity across news + social. 2025 "AI
  Agent" anticipates momentum and "holds back when things don't need your attention."
- Borrow (Phase 6): engagement-velocity-as-canary validates the X-lists plan; their
  "knows when NOT to alert" framing is a product principle worth stealing.
- Also: this is who clients would otherwise pay $; their acquisition price signals
  market value for predictive comms intelligence.

### Signal AI — enterprise "reputation intelligence"; acquired Memo (2026)
- Innovation: narrative/risk tracking at entity level for boards/C-suite. With Memo:
  ACTUAL article-level readership data direct from publishers (not impressions) —
  the first real "did anyone read this clip" metric.
- Borrow (Phase 6/7): tier-1 placement ≠ readership; if clients ever want impact
  metrics, Memo-style readership is the gold standard (licensed, not replicable —
  but we can cite engagement proxies). Entity-level narrative tracking = our
  client-topic lens.

### Feedly (Market/Threat Intelligence tiers) — Gartner-reviewed, enterprise standard
- Innovation: 1,000+ small AI models each detecting ONE thing (an "innovation" mention,
  an incident, an entity relationship), feeding a queryable knowledge graph with an
  Ask-AI layer on top.
- Borrow (Phase 6): many small classifiers > one big prompt for repeatable tagging
  (our tier/section/opinion tags are step one of this). Graph of entities over time
  = the durable version of narrative tracking.

### AskNews (Emergent Methods) — EU AI Act-grade transparency protocols, LangChain integration
- Innovation: news-as-infrastructure for LLMs — 500k articles/day enriched at ingestion
  by edge-deployed open-source LLMs; entity + relationship graphs; public bias
  reporting; "Context Is King" benchmark #1.
- Borrow (Phase 4 alt-vendor; Phase 6): candidate replacement/supplement for NewsData
  if we want pre-enriched data (entities, contradictions between sources) instead of
  building enrichment ourselves. Transparency-report idea differentiates client product.

## Cross-cutting takeaways for our build
1. The display unit is converging on STORY CLUSTERS, not articles (Particle, Aligned).
2. Editorial judgment encoded as data (Scoble's lists, Nick's allowlist/tiers) is the
   moat; AI is the amplifier. Nobody covered above wins on model quality alone.
3. Significance scoring + "quiet day honesty" (News Minimalist, NewsWhip's hold-back)
   is what separates trusted tools from noisy ones.
4. Professional niche + workflow integration wins; consumer news apps die (Artifact).
5. Predictive velocity metrics (NewsWhip) and cross-list convergence (Aligned) are the
   two proven "canary" mechanisms — both replicable at small scale with X lists + our
   archive of hourly story counts.
6. Transparency about method (AskNews, Otherweb) is itself a feature clients pay for.
