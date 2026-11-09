---
status: accepted
date: 2026-11-08
tags: [components, build-card, persistence]
supersedes: [30]
---

# 56. Build card layouts and curated art

## Context

The Build Card had one layout, drawn with the app's theme colors. Uploaded backgrounds looked broken: the shared stats table (`CalculatorStats`) stripes every other row with a solid fill, and the side panels were solid while the middle column was see-through, so a background showed through only some of the card. Players also had no art to choose from without uploading their own.

## Decision

1. **Three layouts, one data shape.** `CalculatorBuildCard.vue` builds one `BuildCardView` (`src/buildCard/view.ts`) from the stores and passes it to the chosen layout: `BuildCardLayoutColumns` (the old three-column arrangement, the default), `BuildCardLayoutHero` (large art, stats panel, five echo columns) or `BuildCardLayoutShowcase` (art fills the card, one data panel). Layouts only arrange shared pieces in `src/components/buildCard/`, so every layout shows the same numbers.
2. **The layout is a player preference.** It is saved once in `config.buildCard.layout` (settings store), like the username and UID. `resolveBuildCardLayout` maps anything unknown to `columns`.
3. **The card keeps its own dark palette.** It is an exported image, so it no longer follows the app theme. Its colors live as CSS variables on `.build-card__canvas`, plus `src/buildCard/theme.ts`. The accent comes from the character's element unless the player picked a primary color.
4. **Panels share one translucent fill.** Every panel uses the same translucent dark fill (`--card-glass`), with hairline dividers instead of striped rows, so a background reads the same behind every panel. The stats are no longer drawn by the shared `CalculatorStats` table. `buildCardStatRows` builds them with the same units and formatters.
5. **The default background is the character art, blurred.** With no background chosen, the card draws the character art (default, curated or uploaded) blurred and darkened behind everything. The blur is a CSS `filter` on that layer, not `backdrop-filter`, which html-to-image does not export reliably.
6. **Curated art in code, choices in user data.** `src/buildCard/arts.ts` lists curated character art (tagged with the characters it's for) and backgrounds (for everyone, or tagged). Each slot saves a source: `"default"`, `"upload"` or a curated id. Character art is saved per character as `buildCardArtSource`, beside `customPortrait`. The background is saved once as `config.buildCard.backgroundSource`. With no source saved, a slot shows the upload if there is one, which matches data from before sources existed, so no migration is needed. An unknown or unavailable id falls back to the default.
7. **In Hero and Showcase, a chosen background replaces the art.** In those layouts the art fills the left side, so a chosen background takes its place unless the player ticks "Show the character art over your background" (`config.buildCard.showArtOverBackground`). Columns always shows the art in its own panel.

## Consequences

- Pros: the card works with any background, and players can switch layouts without losing anything. New curated art is a one-line change.
- Cons: three layouts are three fixed 1920x1080 compositions to keep within bounds. A very long name or label has to be checked in each. The card no longer matches the light theme on screen, by design.
- Curated art has to be hosted with CORS headers (the assets repo is). Otherwise the PNG export silently drops it.

## Guidance

- Add a stat, echo detail or other data to `BuildCardView` and render it in every layout. Don't read stores from a layout.
- Use the `--card-*` variables inside the card, not theme tokens.
- Never rename or reuse a curated art `id`; it's saved in players' data. To retire art, delete its entry.
- Check all three layouts with a real export (`npm run dev`, then Download), not only the on-screen preview: the export can lay text out slightly wider.

## Related

- `src/components/CalculatorBuildCard.vue`, `src/components/buildCard/`
- `src/buildCard/layouts.ts`, `src/buildCard/arts.ts`, `src/buildCard/statRows.ts`, `src/buildCard/theme.ts`, `src/buildCard/view.ts`
- `tests/buildCard/`, `tests/components/CalculatorBuildCard.test.ts`, `tests/components/BuildCardEcho.test.ts`, `cypress/e2e/calculator/buildCard.cy.ts`
