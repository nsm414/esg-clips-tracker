# Productization vision (Nick, June 2026)

## Three deployment scenarios — economics TBD (see task list)
1. Internal tool (ESG team only)
2. Incorporated offering (folded into client retainers)
3. Standalone charged product
Analyze labor + cost per scenario before committing: API costs per instance vs shared,
Netlify hosting, AI inference for analysis layer, human curation/setup/QC labor.
Market refs: NewsWhip ($55-65M exit), Aligned News ($20/mo Pro), Signal AI enterprise.

## Client onboarding concept ("bespoke tool from a survey")
- Client answers survey: topics, specific focuses, outlets they care about, people/orgs
  they follow.
- Hybrid curation: some inputs self-reported; some WE infer and they narrow —
  e.g., analyze who they follow/engage with on X, draft their X lists, have them prune.
- Survey output compiles directly into the system config (topic queries, outlet
  allowlist + tiers, X lists, section taxonomy) → spins up their own instance:
  own site, own feed, full feature set.
- Architectural note: our config is already data (classify.mjs lists, query arrays).
  Templatizing = extracting these into a per-client config file + one-command deploy.
  Keep this separation clean in all future code.

## Honest positioning note
Concept uniqueness should not be oversold — Signal AI/NewsWhip/Feedly serve adjacent
needs at enterprise scale. Our edge is bespoke curation + comms-professional analysis
at boutique price, not unprecedented technology.
