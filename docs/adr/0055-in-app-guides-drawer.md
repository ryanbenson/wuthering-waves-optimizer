---
status: accepted
date: 2026-11-07
tags: [components, content]
---

# 55. In-app help opens guides in a drawer

## Context

ADR [0054](./0054-visual-info-pages-and-guides.md) made guides plain data so the Guides pages and in-app help could share one copy. In-app help was still a set of modals (Optimizer, Echo Rating, Presets) that covered the screen they explained, plus inline copies of help text (the scanner's "How to scan", the Discord import tips, Convene's method) that had drifted from the pages covering the same topics. Empty screens offered no help at the moment people needed it most.

## Decision

In the v3 UI only (classic keeps its modals until it's retired):

1. **One drawer for the whole app.** `guides/GuideDrawer.vue` is mounted once in `AppLayout.vue`, and any component opens a guide with `useGuideDrawer().openGuide(slug, source)`. It reuses Team Rotations' damages-drawer pattern (daisyUI `drawer-end`, z-index only while open, body scroll locked), so the screen stays visible beside the guide. Escape, the overlay and the close button close it; focus moves in on open and back on close; any navigation closes it. Opening it sends a `guide-drawer-opened` analytics event with the guide and where it was opened from.
2. **The modals' content moved into guide data:** the Optimizer button opens `best-loadout`, Rating Guide opens `echo-ratings`, and the Presets guide opens `echo-presets`.
3. **Inline help renders guide data in place.** The scanner's "How to scan" panel renders the `scan-echoes` guide, and the Discord import tips render the `tips` section of `discord-build-card`. Convene's method is the `convene-odds` guide: the v3 page keeps a one-line summary and opens it in the drawer, while classic keeps its full text.
4. **Empty screens say how to start.** An empty inventory hides search and filters and offers Wavescan, screen sharing, a recording or a Discord build card. A character with no rotations is offered a preset, a blank rotation or the rotations guide.

## Consequences

- Pros: each piece of help has one copy, which the Guides pages, the drawer and the in-place panels all show. Reading a guide no longer hides the screen it describes.
- Cons: classic still has its own copies of the three modal guides until it's retired. Long guides scroll inside a narrow panel, with images shown smaller than on the full page.

## Guidance

- Open guides with `openGuide`; don't add new guide modals or inline help text.
- Show part of a guide in place with `GuideContent` (`compact`, `hide-headings`) rather than copying its text.
- In Cypress, open the calculator with `/?section=` and wait for the query to clear before clicking: the screen re-renders while it settles.

## Related

- `src/composables/useGuideDrawer.ts`, `src/components/guides/GuideDrawer.vue`, `src/components/guides/GuideContent.vue`
- `src/components/EchoScannerGuide.vue`, `src/components/CalculatorEchoParser.vue`, `src/pages/ConveneView.vue`, `src/components/InventoryEchoesBrowser.vue`, `src/components/CalculatorRotations.vue`
- `cypress/e2e/guideDrawer.cy.ts`
- ADR [0054](./0054-visual-info-pages-and-guides.md)
