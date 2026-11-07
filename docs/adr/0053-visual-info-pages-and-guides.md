---
status: accepted
date: 2026-11-06
tags: [components, content]
---

# 53. Visual Info pages and guides as shared data

## Context

The Info pages were paragraphs in a gray card, while the app they describe is full of grades, bars and big numbers. Help was scattered across modals, inline sections and pages, with overlap, and the Optimizer Guide had fallen behind the app (it said echoes had to be typed in). Three overview layouts were mocked up: a product tour, a feature grid and a step-by-step journey.

## Decision

In the v3 UI only (classic keeps its current pages):

1. **The overview is a product tour.** Screenshots with short copy and direct links, because people don't all follow the same path and the journey layout needed more clicks.
2. **Guides are plain data in `src/content/guides/`, not components.** Text fields use a small `**bold**` and `[label](/path)` syntax parsed in `inline.ts`, so there's no `v-html`. `guides/GuideContent.vue` renders them, so the Guides pages and in-app help can share one copy.
3. **Guides live at `/info/guides` and `/info/guides/:slug`,** as a tab inside Info. The hub links to `/scanners`, `/info/formulas` and `/info/cv-echo-rating` for topics those pages already cover, rather than copying them.
4. **Explainers call the real code.** The echo scorer uses `getEchoRatingGrade`, `getEchoCritValue`, `subStatsTable` and the rating bands; the formula walkthrough uses `getDefenseModifier`, `getEnemyResistValue` and `getBonusDamageValue`, with a test pinning its total to `calcHitDamage`.
5. **Screenshots are dark in every theme,** in a neutral frame. They're hosted in the assets repo's `wt-info/` folder and regenerated with `npm run guides:screenshots`. Capturing every shot per theme would be a lot of upkeep for little gain.
6. **The calculator takes `?section=<screen>`** and drops it once applied, and the router scrolls to a link's `#hash`, so links can land on the exact place they describe.
7. **Updates gets a timeline and optional per-bullet `itemDetails` (tag, picture), but no filter.** ADR [0023](./0023-updates-page-search-and-grouping-redesign.md) rejected filters because two years of freeform history has no reliable tags, and tagging only new bullets would make a filter hide most of the history. Tags here only label.
8. **Legal and Privacy lead with a plain summary and keep the full text word for word** in a `<details>`, so it stays in the DOM.

## Consequences

- Pros: one copy of each guide; links and marker lists are checked by tests; the explainers can't drift from the math.
- Cons: screenshots go stale as the UI changes, so they need re-running; a missing file falls back to its description instead of a broken image, which also means a forgotten upload won't look broken in review. The legal summary is a paraphrase that has to stay in step with the full text.

## Guidance

- Add or change guide copy in `src/content/guides/index.ts`; don't write guide text into components.
- A marked image must be followed by a `keyed` block with one item per marker. A test enforces it.
- Adding a guide means adding it to `public/sitemap.xml`. A test enforces that too.
- Never hard-code a grade band, roll value or formula in an explainer. Call the function the app uses.

## Related

- `src/content/guides/`, `src/components/guides/`, `src/components/info/`, `src/utils/echoScoreExplainer.ts`, `src/utils/formulaWalkthrough.ts`
- `cypress/capture/guideScreenshots.cy.ts`, `scripts/guide-images.ts`
- `docs/src-components.md`
- ADR [0023](./0023-updates-page-search-and-grouping-redesign.md), ADR [0024](./0024-info-page-nested-routes-redesign.md), ADR [0045](./0045-v3-side-rail-navigation.md)
