---
status: accepted
date: 2026-09-03
tags: [components, content]
---

# 23. Updates page search and grouping redesign (Labs-flagged, shares the `liveResultBar` flag)

## Context

`UpdatesView.vue` was a single flat `<article>` of ~406 hand-written
`<h3>Month Day, Year</h3>` + `<ul><li>` entries going back to mid-2024, with
no search, no grouping beyond the per-day heading, and no way to jump to
recent changes without scrolling past everything. A design review covering
this page alongside the utility nav, Settings, and Info (mockups published
as an Artifact, not checked in) proposed search and month-based grouping.

Two things were explicitly proposed and then **rejected** during that
review, based on this page's traffic (~1% of sessions):

- **Per-entry category tags** (Feature/Fix/Content). Two years of changelog
  history has no reliable metadata to back this — the source text is
  freeform and inconsistent (typos, mixed granularity, a single bullet
  sometimes describing both a fix and a feature), and even automatic
  keyword-based tagging ("Fixes…" → Fix) would misfire often enough to make
  a filter untrustworthy.
- **"New since your last visit" tracking** (a stored last-seen timestamp
  driving a hero callout and an unread badge in the global nav — see ADR
  [0021](./0021-utility-nav-dropdown-redesign.md)). Judged not worth the
  state/maintenance cost, and specifically not worth an indicator in global
  nav chrome for a page this rarely visited.

A prerequisite refactor (this session, same PR) turned the legacy markup
into structured data — `src/content/updates.ts`, generated once via
`scripts/coverters/updatesToData.js` — so legacy and v3 share one source of
truth instead of the redesign forking a second copy of the content.

Ships behind the existing `liveResultBar` Labs flag rather than a flag of
its own, the same choice ADRs
[0013](./0013-live-result-bar-labs-flag.md)–[0022](./0022-settings-page-redesign.md)
made for this whole redesign wave.

## Decision

1. **Full-text search, client-side, no backend.** `UpdatesWorkspace.vue`
   filters `updateEntries` by substring match (case-insensitive) against
   each entry's date label and joined bullet text. A day either fully
   matches (all its bullets show) or is excluded entirely — no per-bullet
   filtering, which keeps the "why did this day show up" answer legible.

2. **Two most recent calendar months always visible; everything older
   collapses into one "Earlier" bucket.** Grouping is derived from each
   entry's `date` field (`YYYY-MM` slice), not the display label. This is a
   two-tier design, not a graduated per-month collapse — there's no
   in-between state of "several individually-collapsed older months."
   While actively searching, grouping still applies but every matching
   month renders open (search results shouldn't hide behind a closed
   accordion).

3. **Collapsed content stays in the DOM via native `<details>`/`<summary>`,
   not `v-if`.** This was an explicit requirement from design review:
   visibility-only toggling (not lazy-rendering on open) keeps the content
   crawlable regardless of whether a crawler executes the disclosure
   interaction. A page-level "Expand all" control (`querySelectorAll`
   sweep setting `.open = true`, not a Vue-reactive `:open` binding — this
   sidesteps the controlled/uncontrolled-`<details>` fight of keeping a
   reactive binding in sync with native user toggles) opens it for anyone
   who wants the old full-scroll experience back.

## Consequences

- Pros: search and grouping need zero new state or metadata — both are
  pure functions of data already in `updates.ts`, so there's nothing to
  keep in sync or get wrong going forward. Sharing `updates.ts` with legacy
  (from the prerequisite refactor) means new changelog entries are written
  once, not duplicated across a legacy-markup copy and a v3-data copy.
- Cons: the Cypress spec for this page asserts on the `<details>` `open`
  attribute directly rather than rendered visibility — the headless
  Electron build used by this repo's Cypress runner doesn't reliably apply
  the native collapsed-`<details>` rendering that real browsers do (a
  bare, classless `<details>` element with no `open` attribute measured
  non-zero rendered height in that environment), so a `.should("not.be.visible")`
  assertion is not a trustworthy signal here even though the actual
  browser behavior is correct. Worth knowing if `<details>` is reused
  elsewhere in future e2e coverage.

## Related

- `src/components/UpdatesWorkspace.vue` (new)
- `src/content/updates.ts`, `scripts/coverters/updatesToData.js` — the
  shared data source this is built on
- `src/pages/UpdatesView.vue` — the flag swap
- `tests/components/UpdatesWorkspace.test.ts`,
  `cypress/e2e/updatesWorkspaceFlagged.cy.ts` (new)
- ADRs [0013](./0013-live-result-bar-labs-flag.md)–[0022](./0022-settings-page-redesign.md)
  — the shared-flag pattern this follows; [0021](./0021-utility-nav-dropdown-redesign.md)
  — where the "new since last visit" rejection was first written down
