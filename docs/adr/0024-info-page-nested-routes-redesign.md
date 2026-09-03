---
status: accepted
date: 2026-09-03
tags: [components, routing, content]
---

# 24. Info page nested routes redesign (Labs-flagged, shares the `liveResultBar` flag)

## Context

`InfoView.vue` was one flat `<article>` mixing an app overview, CV/RV
definitions, damage formulas (in code blocks), Discord/developer/shoutout
credits, and a link to the Privacy page — no internal navigation, so
reaching "the formula for X" meant scrolling past everything else. A design
review covering this page alongside the utility nav, Settings, and Updates
(mockups published as an Artifact, not checked in) proposed splitting it
into distinct sections. This raised a real question worth writing down: are
those sections anchors on one page, or real routes?

Two facts about this app settled it toward real routes:

- It is **100% client-rendered** — Vercel rewrites every path to `/`
  (`vercel.json`), `main.ts` uses plain `createWebHistory()`, and there is
  no SSR or prerendering anywhere in the build.
- The app **already treats `/info`, `/updates`, `/privacy`, and `/legal` as
  real, independently indexed pages** — `public/sitemap.xml` lists all
  four today.

Given that, anchors on one URL would mean every section shares one
`<title>`/description and can't be linked to independently — a real
regression from what these pages already have. Confirmed via
`grep -rn "document.title" src/` = zero matches anywhere in the app: there
was no existing per-route title/meta mechanism to extend either, so this
needed new infrastructure, not a variation on an existing pattern.

Ships behind the existing `liveResultBar` Labs flag rather than a flag of
its own, the same choice ADRs
[0013](./0013-live-result-bar-labs-flag.md)–[0023](./0023-updates-page-search-and-grouping-redesign.md)
made for this whole redesign wave.

## Decision

1. **Real nested routes, the first `children:` array in this router.**
   `/info`'s route in `main.ts` gained `children: [{ path: "" }, { path:
   "cv-echo-rating" }, { path: "formulas" }, { path: "credits" }]`, each pointing at
   a new component under `src/components/info/`. This is a first for the
   codebase (grepped — no route anywhere else uses `children`), so it's
   called out explicitly here rather than assumed obvious.

2. **`useDocumentTitle` composable, new infrastructure with no unmount-reset.**
   `src/composables/useDocumentTitle.ts` sets `document.title` and upserts
   `<meta name="description">` via a `watchEffect`, called once per Info
   child component. Deliberately does not restore a previous title on
   unmount — the next page's own call overwrites it, the standard SPA
   title-composable shape. This is scoped to Info's four routes only for
   now; the same gap exists on Settings/Updates/Privacy/Legal but wasn't
   in scope for this pass.

3. **Flag-off renders the complete legacy article on every `/info/*` path —
   no redirect, no guard.** Since legacy `InfoView.vue` already contains
   every section in one place, `v-else` on `isLiveResultBarEnabled` just
   renders that same untouched article regardless of which child route
   matched. This works because nothing links to `/info/cv-echo-rating` etc. unless
   the flag-on mini-nav produced the link in the first place — a stray
   bookmark or an old link just shows the full page, not a blank child
   outlet or a 404. Locked in by an explicit Cypress case (visit
   `/info/formulas` with the flag off, assert the full legacy content
   renders).

4. **`public/sitemap.xml` intentionally not updated yet.** The flag
   defaults off and is a client-side `localStorage` toggle, so a crawler —
   which never carries that state — would see the flag-off fallback on any
   `/info/*` sub-path today, making those URLs indistinguishable from
   `/info` itself from a crawler's perspective. Submitting them now would
   suggest distinct pages that don't yet resolve to distinct crawled
   content. Revisit once the flag is default-on.

5. **The mini-nav became `WorkspaceSideNav.vue`, a real shared component**
   (post-review revision — the first draft was InfoView-local markup with
   no icons and a raw path caption under each label). Design feedback
   asked for the URL captions removed and for Settings' and Info's side
   navs to look identical rather than two hand-rolled approximations of
   each other; the cleanest way to guarantee that was one component both
   mount, not two kept in sync by hand. See ADR
   [0022](./0022-settings-page-redesign.md)'s Decision 1 for the
   component's shape (route-driven vs. click-driven items).

6. **CV & RV became CV & Echo Rating.** RV (Roll Value) is deprecated
   in-app in favor of two more precise scores already shipped elsewhere —
   Echo Rating (E–SSS letter grade) and Substat Score (0–100%, per
   character) — so `InfoCvRv.vue` was rewritten to explain those instead,
   reusing the real `ECHO_RATING_GRADES` data and `getRatingBadgeClasses`
   from `src/echoes/rating.ts`/`src/composables/useEchoRating.ts` (the same
   source `CalculatorEchoRatingGuide.vue`'s in-app guide modal uses) rather
   than hand-copied values that could drift from the real grade bands.

## Consequences

- Pros: `/info/formulas` (and the other three) are now real, linkable,
  bookmarkable URLs with their own title and description the moment the
  flag is on for a given visitor — the actual SEO upside this was built
  for, once the flag itself defaults on.
- Cons: the SEO benefit doesn't land immediately — it's gated behind both
  the flag being on for a given session AND (separately) the flag
  eventually becoming default-on before search engines see any of it. This
  is a known, accepted limitation, not a bug to chase down.

## Related

- `src/composables/useDocumentTitle.ts` (new)
- `src/components/info/InfoOverview.vue`, `InfoCvRv.vue`, `InfoFormulas.vue`,
  `InfoCredits.vue` (new)
- `src/pages/InfoView.vue` — the flag swap, mounts `WorkspaceSideNav.vue`
- `src/components/WorkspaceSideNav.vue` (new) — shared with
  `SettingsWorkspace.vue`, ADR [0022](./0022-settings-page-redesign.md)
- `src/echoes/rating.ts`, `src/composables/useEchoRating.ts` — the real
  Echo Rating/Substat Score data `InfoCvRv.vue` renders from
- `src/main.ts` — the `/info` route's `children:` array
- `tests/pages/InfoView.test.ts`, `cypress/e2e/infoWorkspaceFlagged.cy.ts`
- ADRs [0013](./0013-live-result-bar-labs-flag.md)–[0023](./0023-updates-page-search-and-grouping-redesign.md)
  — the shared-flag pattern this follows
