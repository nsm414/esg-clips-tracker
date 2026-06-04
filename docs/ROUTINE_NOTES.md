# Editorial spec from Nick's Claude Code clips routine
Source: Nick's scheduled Slack clips prompt (June 2026). This file is the canonical
reference for later phases — read it before building Phase 4 (sources) and Phase 6 (analysis).

## Applied to API feed (Phase 3) — done
- Outlet allowlist expanded to match routine's Tier 1 + responsible-AI press list
  (added: The Markup, CalMatters, ProPublica, Fortune, Mother Jones).
- Topic queries expanded to the full flag list: policy/reg, safety/harms,
  labor, kids/education, elections/disinfo, deals/IPO/antitrust/copyright, frontier-lab moves.
- Sections renamed to routine taxonomy: 💰 Industry & Deals / 🏛️ Policy & Regulation /
  ⚠️ Safety, Harms & Critical Takes / 👷 Labor & Society / 🔬 Research & Culture.
- Recency: rolling 7-day window (mirrors routine's tiered recency standard).

## For Phase 4 — additional sources
- Gmail newsletters live under label "-Newsletters-". Purpose: catch what majors missed.
  List: Axios AI+, The Neuron, The Rundown AI, Bens Bites, Politico Digital Future Daily,
  Semianalysis, NYT DealBook, Semafor Business, MIT Tech Review The Download,
  The Information briefing, Politico West Wing Playbook, Atlantic Work in Progress.
- Routine gives newsletters EQUAL WEIGHT with Tier 1 outlets.
- Slack #ai channel (C0B5DE0J7C3) holds prior clips posts — dedup source and
  (per Nick) potential input: team analysis/commentary in chat threads around clips.
  Open questions: which channels, attribution/anonymization, internal vs client-visible.

## For Phase 6 — analysis layer (the routine's brain)
- Editions by time slot (ET): Morning 6am (last ~12h, 18-20 items), Midday noon
  (since 6am, 8-10 items, lead "🔥 Big since the morning:" if warranted),
  EOD 6pm (full day, prioritize not-yet-covered, close "🗓 Tomorrow's tea:" —
  hearings, EOs, earnings, conferences, filings scheduled).
- Item format: bold linked headline, (outlet), "↳ Takeaway:" one line of analysis.
- Close with 1-2 sentences of cross-cutting theme ("Reading the room").
- Quiet-day rule: don't stretch; post "Quiet day on the AI beat. Watching for [X] next."
- DOWNWEIGHT pure product launches/feature drops unless policy/safety/manufacturing/
  antitrust/labor implications. (Judgment call — needs AI, not keywords.)
- Dedup semantics: same event from different outlet OK only if takeaway materially
  different (new angle/context/framing). Headline overlap alone ≠ exclusion.
- Verification rules: confirm pub dates; for bills/EOs/rulemaking verify CURRENT status
  independently (never trust prior posts' "in debate" framing); events with only
  2-week-old coverage are historical — don't reframe as current; if still uncertain,
  exclude and escalate (DM Nick, Slack UB38NTVTQ).
- House rules: max one direct quote per source, <15 words, in quotes; always paraphrase;
  original wording for takeaways.

## For Phase 7 — productization template fields implied by routine
- topic, flag categories, outlet tiers, newsletter label, Slack channels,
  edition schedule/timezone, item counts, escalation contact.
