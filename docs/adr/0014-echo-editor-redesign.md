---
status: accepted
date: 2026-08-26
tags: [calculator, components, composables, inventory]
---

# 14. Echo display/edit redesign (Labs-flagged, shares the `liveResultBar` flag)

## Context

Editing an echo — in the Calculator's per-slot build flow (`CalculatorEcho.vue`)
or standalone in the Inventory page (`InventoryEchoEdit.vue`) — opens a
full-screen `<dialog>` modal that hides everything else: the character's
stats, the Live Result Bar's hero number ([ADR 13](0013-live-result-bar-labs-flag.md)),
the rest of the inventory grid. The substat picker inside that modal is a
checklist of all 12–13 possible stat types, where checking a box fills
"the first empty slot" — a UI convenience from when the data model wasn't
yet obviously slot-shaped, but one that throws away the actual in-game roll
order and doesn't match how a player would read their own inventory screen
or a build guide. A design proposal (published as an Artifact, not checked
in, iterated over several review rounds) worked through a replacement; this
ADR is for building that, not the proposal itself.

## Decision

1. **Ships behind the existing `liveResultBar` flag, not a new one.** The
   docked-panel shell this redesign depends on (see #4) only makes sense
   with the full-width Echoes tab and always-visible hero number that flag
   already provides — bundling both under one Labs toggle keeps this a
   single coherent "if you turn this on, this whole area changes" story
   instead of a flag-combination matrix. `SettingsLabs.vue`'s existing
   `liveResultBar` entry gained a second sentence in its `details` copy
   rather than a new `labsFeatures` row. The legacy two-pane layout keeps
   today's modal untouched — see #6.

2. **One shared editor (`CalculatorEchoEditPanel.vue`), not two.** Both
   `CalculatorEcho.vue`'s modal and `InventoryEchoEdit.vue`'s modal were
   near-verbatim duplicates of the same 12-checkbox substat block, each with
   its own copy of `toggleSubStat`/`getSubStatRange`/`getDefaultValue`/
   `subStatUpdated`. The only real difference was *how* a field write
   persists: `CalculatorEcho.vue` already branched per field between
   `inventoryStore.patchEcho` (if the slot holds a real inventory echo) and
   `characterStore.setCharacterData` (if it's inline character-only data);
   `InventoryEchoEdit.vue` always used `patchEcho`. `useEchoEditFields.ts`
   (new composable) generalizes that exact duality behind one `field()`
   factory parameterized by an `EchoEditTarget` (`{context:'build',
   character, index}` or `{context:'inventory', echoId}`) — inventory mode
   naturally always takes the `patchEcho` branch, since `currentEcho` is
   never null there. `CalculatorEchoEditPanel.vue` is the one UI shell built
   on top of it, taking the same `context` discriminant as a prop.

3. **Five roll-ordered slots, not a checklist.** Since the data model was
   already `echoSubStatsType1..5`/`echoSubStatsValue1..5` — five slots, in
   order — the "12 checkboxes" was purely a presentation choice, not
   something the data forced. The composable exposes `slots: EchoSubstatSlot[]`
   as five direct `{type, value}` writable-computed pairs; the panel renders
   five rows, each an `AppRichSelect` (options grouped by family via its
   existing `group` field) plus a slider. Assigning a type targets that
   specific slot index directly — the old "fill the first empty slot"
   heuristic is gone entirely, not just hidden.
4. **Docked panel (desktop) / bottom sheet (mobile), reusing
   `CalculatorLiveResultDetail.vue`'s exact shell CSS** (`flex: 0 0 380px`
   sidebar; `position: fixed` sheet + scrim under a 768px breakpoint) rather
   than re-deriving it. In the Calculator's build context, `Calculator.vue`
   itself hosts the panel as a flex sibling of `.calculations__screens`,
   right next to `CalculatorLiveResultDetail` in the same
   `.calculations__body` row — not inside `CalculatorEchoes.vue`. An
   earlier version mounted it inside that tab's own template instead, which
   worked visually but nested the panel inside `.calculations__screens`'s
   own `overflow-y: auto` — two scrollbars fighting over the same edge of
   the screen once a build had enough echoes/substats to need scrolling.
   `CalculatorLiveResultDetail` never had this problem because it was
   never nested inside that tab content in the first place. Moving the
   panel to the same spot (`CalculatorEchoes.vue` now just emits
   `open-echo-edit-panel` with an index, and exposes
   `openEchoesBrowserForIndex()` so the panel's "Browse" action can still
   reach the `CalculatorEchoesBrowser` instance that stays where it was)
   fixed it the same way `CalculatorLiveResultDetail` avoids it: two
   independent side-by-side scrollable columns instead of one nested
   inside the other. In the Inventory context there's no equivalent flex
   ancestor to dock against — that page is already full-width on its own —
   so `.echo-edit-panel--inventory` is unconditionally `position: fixed`,
   right-docked on desktop and the same bottom sheet on mobile. The scrim
   element is always in the DOM but only visible under the mobile breakpoint
   in both contexts, matching ADR 13's pattern exactly.
5. **Editing an equipped echo drives the real Live Result Bar number
   directly — this needed no new plumbing.** `CalculatorEcho.vue`'s
   `updateTotalStats()` → `emit('update-stats')` chain, driven by watchers
   on every field with `{immediate: true}`, already existed and already fed
   `Calculator.vue`'s recalculation on every keystroke. The new
   `CalculatorEchoTile.vue` (the build-strip tile that replaces
   `CalculatorEcho.vue`'s old template when the flag is on — the *script*
   keeps the same watchers, just reading from `useEchoEditFields()` instead
   of local duplicated computeds) stays mounted regardless of whether the
   shared edit panel is open, so those watchers — and the `isApplyingEchoLoadout`
   guard that suppresses redundant emits during a bulk preset apply — keep
   running unconditionally. The panel itself only writes to the composable's
   fields; it doesn't emit anything toward the damage pipeline itself. Both
   components independently derive from the same Pinia store state, so an
   edit made in the panel is picked up by the tile's own reactive chain
   without any direct coupling between the two.
6. **The legacy path is a separate component, not a branch inside the old
   one.** Following ADR 13's playbook, `CalculatorEcho.vue` and
   `InventoryEchoEdit.vue` are both **completely unmodified**.
   `CalculatorEchoTile.vue` and `InventoryEchoEditPanel.vue` are new
   components carrying the new behavior; `CalculatorEchoes.vue` and
   `InventoryEchoesBrowser.vue` each pick between the legacy component and
   the new one with a `v-if`/`v-else` on `isLiveResultBarEnabled`.
   `InventoryEchoEditPanel.vue` exposes the identical `{setEchoId,
   handleOpenModal}` API `InventoryEchoEdit.vue` already did, so
   `InventoryEchoesBrowser.vue`'s call sites needed zero changes beyond
   which component the same `ref` happens to be bound to. This was a real
   correction mid-implementation — an earlier draft edited
   `CalculatorEcho.vue` in place and had to be reverted via `git checkout`
   once it became clear that broke the "flag off ⇒ byte-identical to today"
   guarantee.
7. **Family-color coding is shared between the editor and the existing echo
   cards.** `src/echoes/substatFamilies.ts` (new, pure) classifies all 13
   substats into four families — `flat` (HP/ATK/DEF, flat and %), `crit`,
   `dmg` (the four attack-type DMG bonuses), `util` (Energy Regen).
   `useEchoCardStats.ts` gained `getSubstatFamilyClasses()`, mirroring
   `useEchoRating.ts`'s existing `getRatingBadgeClasses()` pattern (a
   literal `Record<Family, {bg, text, border}>` — Tailwind only generates
   CSS for class names it can find as literal text while scanning source,
   so these must stay as literal strings, not built via string
   concatenation at runtime). Used in the new panel's slot rows, the new
   tile's substat grid, and retrofitted onto `CalculatorEchoCard.vue`'s
   existing compact chips and comfy table rows (a colored left-border
   accent there, deliberately quieter than the panel/tile treatment — a
   grid of dozens of cards needs a lighter touch than a five-row list).

## Not done here

- **The echo/set picker itself** — still today's dialog (the "Find" button
  opens the same card-grid chooser, just relocated into the shared panel
  instead of living inside the old modal). The redundant inline
  `AppRichSelect` echo dropdown that sat next to it in the old modal was
  dropped as part of relocating, since the card-grid picker already covers
  the same choice.
- **Set Bonuses and Main Echo Buff** (`CalculatorEchoesSetBonusOnePiece`/
  `One`/`Two`, `CalculatorMainEchoBuff`) — unchanged, out of scope for a
  display/edit redesign.
- **Merging the `mainEcho` character field with `echoes[0]`.** They're kept
  in sync today (`CalculatorEchoTile.vue` still emits `main-echo:updated`/
  `main-echo-rank:updated` only for index 0, exactly as `CalculatorEcho.vue`
  always did) but remain two separate fields — collapsing them is a
  data-model refactor, not a display change.
