# Aligned News teardown (June 2026)
Reference architecture for our X/social lane (Phase 4), clustering & synthesis (Phase 6),
and productization (Phase 7). Source: alignednews.com/how-it-works, /pricing.
Built by Robert Scoble (curation) + Levangie Labs (infra, "LLABS cognitive architecture").

## Their pipeline (per their own docs)
1. COLLECT: "XPlugin" pulls all new posts from 63 hand-curated X lists (100K+ accounts,
   refined over 19 years). 3,000–7,000 posts per sweep, multiple sweeps daily.
2. INDEX: every post into a Weaviate vector DB with text, author, engagement metrics,
   timestamp. Seen/unseen tracking so only new posts are processed.
3. KEYWORD SIGNALS: 100+ signal keywords ("launching", "acquired", "SOTA", "breaking",
   "accepting"...). Posts hitting multiple keywords get priority scores.
4. SEMANTIC SEARCH: targeted vector searches catch what keywords miss — esp.
   low-engagement posts from high-signal authors.
5. CROSS-LIST AMPLIFIER: signal appearing in 3+ lists simultaneously = highest priority.
   Their core "genuinely spreading" metric.
6. EDITORIAL SYNTHESIS: AI agent "trained on Robert's signal-detection methodology,"
   persistent memory across sessions; connects related stories, explains why
   low-engagement items matter. Every item cites the original post + author handle.
7. PUBLISH: writes to Supabase; site regenerates 25 sections per sweep, live timestamp.

## Their "hidden gems" philosophy (worth copying for canary detection)
- Low-engagement posts from high-signal authors
- Cross-list convergence (robotics + investors + community sharing same finding)
- Context connections (two stories that illuminate each other side by side)
- Stealth signals (single specialized list catches a company leaving stealth)

## Product/pricing model (Phase 7 reference)
- Free: breaking stories, headlines, signal badges, report summaries (marketing tier)
- Pro $20/mo: everything + API access (self-serve keys, /v1/* endpoints, 1,000 req/day)
- Enterprise custom: team access, custom analysis
- Machine-readable by design: RSS feed + JSON API "for AI agents"; sections like
  "For Google NotebookLM", "For Your RSS Reader"

## Mapping to our build
- Phase 4 X lane: replicate with Nick-curated policy lists (AI-policy reporters, Hill
  staffers, think-tankers, lab comms/policy people). Signal keywords become policy verbs:
  "markup", "introduced", "filed", "subpoena", "executive order", "rulemaking", "NPRM".
  Cross-list convergence = our canary-in-coal-mine metric.
  COST NOTE: their approach needs paid X API access (list reads at scale). Evaluate
  X API tiers vs Grok-as-proxy when we get here.
- Phase 6: their vector-DB + semantic clustering = the upgrade path for our dedup and
  story-grouping (embeddings over stored articles; we already archive daily snapshots).
  "Synthesis with citations, never fabricate" matches Nick's house rules.
- Phase 7: free/pro/enterprise + self-serve API keys is the productization template.
  "N stories today" story-cluster framing > raw clip lists.
- Their gap = our moat: single-platform (X only), no outlet tiers, no narrative-migration
  analysis, no newsletters/Slack/think-tank integration, industry- not comms-focused.
