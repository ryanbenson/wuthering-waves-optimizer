---
status: accepted
date: 2026-09-12
tags: [calculator, components, composables, echoes]
---

# 30. Echoes tab v3 redesign (Labs-flagged, shares the `liveResultBar` flag)

## Context

User feedback on the ADR [0014](0014-echo-editor-redesign.md) build-strip
layout, once it had actually shipped in front of real builds: the strip was
`flex: 1`, stretching unconstrained next to the 320px insights column — on a
wide screen every substat row's `justify-between` label/value pair ended up
with a huge blank gap between them, divided by a fully-saturated
`border-l-4` line that read as an oversaturated "blue line" once the tile
had room to breathe. Reset/Save/Browse were hidden behind a `…` overflow
menu — an extra click for something that used to be instant in the classic
UI. There was no indicator that an echo had been saved to inventory, and
clicking Save again when nothing had changed gave no feedback at all.
Locking an echo only ever communicated "protected from deletion," not that
it also freezes the substats from editing. A design review (published as a
Claude Design canvas, not checked in) worked through a replacement; this ADR
is for building that, not the review itself.

## Decision

1. **Fixed-width strip (`flex: 0 0 460px`), not `flex: 1`.** This alone was
   the fix for the label/value-gap complaint — bounding the strip's width
   bounds every substat row's width with it, so `justify-between` no longer
   has room to stretch label and value apart. `.echoes-layout__insights`
   also became `position: sticky; top: 0` so Build Score stays visible
   while a long echo list scrolls past it. **`top: 0`, not an 80px
   nav-offset** — `.echo-edit-panel--inventory`'s `top: 80px` (ADR 0014
   decision #4) is a `position: fixed` element re-clearing a viewport-level
   nav from outside the document flow entirely; `.echoes-layout__insights`
   is nested inside `.calculations__screens`, already below the nav in
   normal flow. The real precedent already in this repo is the four
   existing `position: sticky` blocks in `SettingsImport.vue` /
   `SettingsLab.vue` / `SettingsExport.vue` / `SettingsDelete.vue`, all
   `top: 0`. Using `80px` here would leave a permanent 80px gap at the top
   of an already-clear scroll region.

2. **The roll-quality divider is toned down: `/50` opacity border + a
   gradient wash, not a solid line.** `getSubstatRollQualityClasses()`
   (`useEchoCardStats.ts`) now returns a fourth key, `wash` —
   `bg-gradient-to-r from-{color}-500/10 to-transparent`, Tailwind's own
   gradient utilities — applied alongside the existing `border` (now
   `border-l-{color}-500/50`). Both `CalculatorEchoTile.vue` and
   `EchoCardSubstatList.vue` bind `wash` next to `border`, so the fix
   propagates to every surface that colors a substat by roll quality: the
   build-strip tile, and — via the shared `EchoCardSubstatList.vue` — the
   Inventory grid, Echo Browser, and Optimizer results, all in one change.
   `CalculatorBuildCardEchoCard.vue` doesn't use that shared component (its
   own bespoke `.build-card-echo__substat` rows previously had no
   border/wash at all, only a colored value via the older
   `getSubStatValueColorClass`) — extending the same convention there
   landed as a separate, smaller follow-up change to that one file, value
   coloring left untouched.

3. **Echo editing is inline-in-place on the tile — the docked panel /
   bottom sheet is gone for the build context.** `CalculatorEchoEditPanel.vue`
   split into three regions: header chrome (avatar/name/badges/Find/Browse/
   set-icon row/close button) stays **per-host**, since the docked panel and
   the inline tile need genuinely different chrome; the field-editing body
   (rank, locked notice, main stat, 5 substat slots) became
   **`EchoEditFields.vue`**; the echo/set picker `<dialog>` plus its filter
   state became **`EchoPickerDialog.vue`** (exposing
   `openPicker`/`closePicker`, matching the existing
   `ref.value?.triggerOpenModal?.()` convention already used elsewhere
   rather than new `v-model:open` plumbing). Both new components take a
   single `target: EchoEditTarget` prop and call
   `useEchoEditFields(() => props.target)` themselves — exactly like
   `CalculatorEchoTile.vue` and `CalculatorEchoEditPanel.vue` already
   independently did before this change. The composable is cheap and
   side-effect-free to call more than once (every return value is a
   `computed()` over the same Pinia state), so this was simpler than
   prop-drilling roughly fifteen writable-computed refs, and it keeps
   `EchoEditFields`/`EchoPickerDialog` self-contained and directly testable
   without a parent harness. `CalculatorEchoEditPanel.vue` itself is
   unchanged in behavior — header chrome stays, body becomes
   `<EchoEditFields :target="target" />`, picker becomes
   `<EchoPickerDialog ref="pickerRef" :target="target" />` — and keeps
   serving the Inventory context exactly as before (see "Not done here").

   `CalculatorEchoTile.vue` then embeds those same two components directly:
   clicking Edit (or the tile itself, while collapsed) expands that tile in
   place to show a header variant plus `<EchoEditFields :scrollable="false" />`;
   the collapsed summary view is unchanged. Only one tile expands at a time
   — an accordion, state owned by `CalculatorEchoes.vue`
   (`expandedEchoIndex: ref<number | null>`) rather than independent
   per-tile state, to avoid all 5 tiles expanding simultaneously with no
   clear focus. This replaces the old `echoEditPanelIndex` state that used
   to live in `Calculator.vue` for the docked build-context panel — that
   mount, its handlers (`handleOpenEchoEditPanel`/`handleEchoEditPanelBrowse`),
   and its `changeScreen()` reset are all removed from `Calculator.vue`. All
   of it was already `liveResultBar`-flag-gated, so the removal cannot
   affect the legacy flag-off path.

   The tile's root element changes from `<button>` to `<div role="button"
   tabindex="0">`. This wasn't a style choice: the expanded state embeds
   `AppRichSelect`, whose own trigger is itself an interactive
   `role="button"` element, and nesting that inside a real `<button>` is a
   genuine accessibility/interaction hazard — duplicate interactive
   semantics, and a native button's built-in Enter/Space handling competing
   with the inner trigger's own keydown handling — not a hypothetical, once
   substat selects render inline. Card-wide click/keyboard activation
   (`handleCardActivate`/`handleCardKeydown`) only applies while collapsed.

4. **Reset/Save/Browse are direct, always-visible icon buttons again — the
   `…` `AppOverflowMenu` is gone from the tile.** A 4th button, Edit,
   shipped in the *same* change as the inline-expand work (decision #3),
   not earlier alongside Reset/Save/Browse — an Edit button with nothing
   to expand into yet would have been dead weight. The tab-header overflow
   menu (Customize Weights / Presets Guide / Rating Guide) is a separate
   `AppOverflowMenu` usage and is untouched.

5. **"Saved" means "promoted to a standalone inventory record," not
   field-level dirty state — this app has no staging-buffer concept to
   build true dirty-tracking on top of.** Traced `useEchoEditFields.ts`'s
   `field()` factory: every writable-computed's `set()` commits immediately
   — `inventoryStore.patchEcho()` once a slot has a real `echoId`, or
   `characterStore.setCharacterData()` for inline-only data — there is no
   staging buffer anywhere. Once a slot has an `echoId`, its live state
   *is* the persisted inventory record, read and written through the same
   computed; there is nothing "unsaved" to detect, and clicking Save again
   is provably a no-op. There's also no dirty-state precedent anywhere else
   in this app (weapon, character, and buff editors all commit the same
   way). Rather than invent a staging layer this app's architecture doesn't
   otherwise have, `CalculatorEchoTile.vue` defines
   `isEchoSaved = computed(() => Boolean(echoId.value) && Boolean(currentEcho.value))`.
   Not yet saved (`echoId` null): Save renders `btn-primary`, emphasized.
   Saved: Save becomes a disabled, ghost checkmark state with a tooltip
   explaining why ("Already saved — further edits save automatically"), and
   a small passive checkmark shows next to the favorite/status icons so the
   saved state reads without clicking anything. `reset()` unequips but
   doesn't delete the underlying inventory record, so `isEchoSaved`
   describes the record's existence, independent of current equip state.
   **This is the app's first saved/dirty-state UI at all — treat it as the
   reference for the next editor that needs one**, not a one-off.

## Consequences

- Pros: items 1 and 2 are pure CSS/class changes with no behavioral risk,
  and item 2 fixes 4 surfaces (tile, Inventory grid, Echo Browser, Optimizer
  results) from one function change. Items 3–5 pay down real test debt as a
  side effect — `CalculatorEchoTile.vue`, `CalculatorEchoEditPanel.vue` (via
  its two extracted children), `EchoCardSubstatList.vue`, and
  `CalculatorBuildCardEchoCard.vue` had zero test files before this change;
  all gained first-time coverage rather than leaving the gap for whichever
  future change happened to touch the file next.
- Cons / real bugs found only by driving the actual page in a browser, not
  by the (all-green) unit test suite alone:
  - Expanded-state controls (Find/Browse/set-icon buttons/the collapse
    button) didn't stop click propagation, relying instead on
    `handleCardActivate`'s `if (props.isExpanded) return` guard to make
    bubbled clicks harmless. That guard checks a *prop*, and a prop doesn't
    reflect a same-tick `emit()`-driven parent state change until Vue's
    next render — reasoning that was sound in isolation but empirically
    failed for a real mouse click in Chromium (confirmed via a synthetic
    `element.click()` succeeding where a real simulated click did not).
    Fixed by wrapping the expanded content in `@click.stop`, matching the
    collapsed action row's already-established pattern, instead of
    depending on handler-ordering/timing at all.
  - `CalculatorEchoTile.vue` is now a multi-root ("fragment") component —
    its root `<div>` plus a sibling `<EchoPickerDialog>` — and Vue only
    forwards a parent's *scoped* CSS onto a child through that child's
    single root element. A fragment has none, so
    `CalculatorEchoes.vue`'s scoped `.echo-selector { margin-bottom: 20px }`
    silently stopped reaching each tile, regardless of whether the `class`
    attribute itself was still being passed through (it wasn't either,
    until an explicit `:class="$attrs.class"` binding was added to the
    tile's root — needed regardless, to stop a genuine "Extraneous
    non-props attributes" Vue warning). Tile spacing moved to `gap: 1.25rem`
    on the `.echoes-layout__strip` flex container instead, which doesn't
    depend on scoped CSS reaching into a child at all. **Any future
    component that becomes multi-root should assume a parent's scoped CSS
    can no longer reach it, full stop** — this is a real Vue behavior, not
    an edge case.
  - Both were caught by actually clicking through the feature in a live
    Chromium session (Playwright) rather than trusting `npm run test`
    alone — jsdom's simulated `fireEvent.click` in the existing component
    tests did not reproduce either bug.

## Not done here

- **`InventoryEchoEditPanel.vue`** (Inventory page, `context="inventory"`)
  **stays a docked panel.** Inline-in-place editing was only
  requested/designed for the build-context tile — don't assume it as an
  automatic follow-up just because the tile got it. It continues to wrap
  `CalculatorEchoEditPanel.vue` exactly as before, unaffected by the
  extraction in decision #3.
- **The echo/set picker's own content** — still the same card-grid
  `<dialog>` chooser as ADR 0014 left it, just relocated into
  `EchoPickerDialog.vue` alongside the panel it came from.
- **Wide-screen empty space is deliberately left alone.** Considered and
  explicitly rejected: wrapping the strip into a 2-column tile grid on very
  wide screens, and pulling Set Bonuses up beside Build Score. The strip +
  score box stay a fixed, comfortable width and the rest is calm negative
  space — matching what users liked about the pre-ADR-0014 layout in the
  first place ("the only space it had was on the left side").

## Related

- `src/components/CalculatorEchoTile.vue`, `CalculatorEchoes.vue`,
  `CalculatorEchoEditPanel.vue`, `EchoEditFields.vue` (new),
  `EchoPickerDialog.vue` (new), `Calculator.vue`
- `src/composables/useEchoCardStats.ts` (`getSubstatRollQualityClasses`),
  `useEchoEditFields.ts`
- `src/components/EchoCardSubstatList.vue`, `CalculatorBuildCardEchoCard.vue`
- ADR [0014](0014-echo-editor-redesign.md) — the redesign this extends
