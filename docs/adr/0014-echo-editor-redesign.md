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
7. **Substats are colored by roll quality, not by stat family — reusing
   the app's existing convention, not a new one.** An earlier version
   colored substats by *family* (crit/dmg/util/flat, via a new
   `src/echoes/substatFamilies.ts`), using amber for the "utility" family.
   That collided with a convention this app already had: amber/gold
   already means "high roll" everywhere else (the CV/RV/rating badges, and
   `CalculatorBuildCardEchoCard.vue`'s `getSubStatValueColorClass`
   emerald→blue→purple→yellow scale, previously unused elsewhere). A
   genuinely low-rolled Energy Regen still showed gold under the family
   scheme and read as a good roll when it wasn't. Replaced with
   `getSubstatRollQualityClasses()` (`useEchoCardStats.ts`) — a
   `{bg, text, border}` variant of that exact same score/thresholds, used
   on `CalculatorEchoTile.vue`'s substat rows and retrofitted onto
   `CalculatorEchoCard.vue`'s compact chips and comfy table rows (a
   colored left-border accent there, deliberately quieter than the tile's
   full-row treatment — a grid of dozens of cards needs a lighter touch
   than a five-row list). `getSubstatFamily()` itself stays and is still
   used, just for grouping the substat type picker's dropdown options in
   `CalculatorEchoEditPanel.vue` — organizing a list of choices isn't a
   coloring concern and doesn't have this collision.
8. **The build-strip tile lists substats vertically, not as a horizontal
   grid.** The first version packed all 5 into one row (5 columns) to keep
   the tile compact; in practice that read as harder to scan than a
   vertical list — the shape `CalculatorEchoCard.vue`'s own comfy table
   already uses, and closer to how the game's own item screen presents
   substats. Each row: icon + full label on the left (e.g. "Heavy Attack
   DMG Bonus", not an abbreviation — a single column has room for it),
   value on the right, roll-quality-colored left border.
9. **CV/Substat-Score badges are back on the build-strip tile and the
   panel, reusing `useEchoCardStats`/`useEchoRating` rather than
   duplicating their math.** An early version of `CalculatorEchoTile.vue`
   dropped these badges to trim scope; testing surfaced that as a real
   regression — `CalculatorEcho.vue` (the legacy tile) always showed them,
   and losing them made an echo's actual quality invisible until you
   opened the panel. Both `CalculatorEchoTile.vue` and
   `CalculatorEchoEditPanel.vue` now build a small getter-object (`rank`,
   `type`, `echo`, `stat`, the five `echoSubStatsType/Value` pairs,
   `characterId`) that reads straight through to `useEchoEditFields()`'s
   own writable-computed refs, and pass that into `useEchoCardStats()` /
   `useEchoRating()` — the same functions `CalculatorEchoCard.vue` already
   uses, so CV/RV/rating math has exactly one implementation. Plain getters
   are enough here (no `reactive()` wrapper needed): the tracked reads
   happen inside the getter bodies against real refs, not against the
   container object itself, so `computed()`s inside those composables
   still see live edits. The tile always has a `characterId` (`props.character`
   is required in build context), so it always shows the weighted Substat
   Score; the panel falls back to the unweighted Echo Rating grade in
   Inventory context, matching how `InventoryEchoesBrowser.vue`'s own
   `CalculatorEchoCard` usage already behaves (no characterId passed there
   either — an inventory echo doesn't have one owning character).
   Separately: `InventoryEchoesBrowser.vue` and `CalculatorEchoesBrowser.vue`
   already both render `CalculatorEchoCard.vue` consistently — the
   build-strip tile is intentionally a different, denser shape (a slot in
   an active loadout, not a browsable grid card), so this fix aligns the
   *badge language* across all three surfaces without forcing them to
   share one component.

10. **The Echoes tab splits into two columns — build strip left, a new
   "Echo Insights" panel right — instead of a third right-side dock.**
   Listing all 5 equipped echo tiles full-width left a lot of unused
   horizontal space on desktop, and players wanted more visibility into
   how their current rolls add up (echo farming is the most RNG-heavy,
   grindy part of the game). `useEchoInsights.ts` sums CV and, per substat
   type, roll count + total value across the 5 equipped slots, reusing
   `getEchoCritValue`/`getEchoSubStatEntries` (`stats.ts`) and the same
   equipped-slot resolution loop `useTeamSubstatScoreRollup.ts` already
   uses (inventory-first, slot-fallback). Rows are ordered/grouped by the
   character's own resolved substat weights
   (`characterStore.getCharacterSubstatWeights`) — the same weights
   Substat Score already uses — into "Priority substats" (weight > 0,
   including zero-roll ones so a still-missing priority stat is visibly
   flagged, not silently absent) and "Other rolled substats" (weight 0,
   only stats actually present). `getCuratedSubstatWeights()` gates this
   grouping: an uncurated character's weights are all 1 (no signal), so
   `CalculatorEchoInsightsPanel.vue` falls back to one flat list sorted by
   total instead of fabricating a priority ordering that isn't real.
   Deliberately **not** a third occupant of the `CalculatorEchoEditPanel`/
   `CalculatorLiveResultDetail` right-dock system at the `Calculator.vue`
   body level (see #4) — those two are independent, already-unarbitrated
   overlays that can both be open at once. Insights isn't a toggleable
   overlay at all: it's always-visible inline content scoped to the
   Echoes tab, implemented as a flex row inside `CalculatorEchoes.vue`
   itself (`.echoes-layout__strip` + `.echoes-layout__insights`), scrolling
   together with `.calculations__screens` rather than owning its own
   scroll region — repeating that nested-scroll mistake here (see #4) was
   the one thing to avoid. Under the same 768px breakpoint the rest of
   this feature uses, the row becomes a column, so the panel is simply the
   next block below the strip in normal flow on mobile — no
   `position: fixed`, no scrim, no scroll-lock, since it was never an
   overlay to begin with. Flag-off path (`CalculatorEcho.vue`'s
   single-column block) is untouched.

11. **The Insights panel got a Build Score header, a substat-relevance bar,
   and a card boundary after first-look feedback.** Three follow-ups once
   the panel was actually in front of the build strip:
   - **Build Score moved into the panel, styled like `CalculatorBuildCard.vue`'s
     own Build Score block**, not the small badge pill that used to sit
     above the strip. `CalculatorEchoInsightsPanel.vue` now calls
     `useTeamSubstatScoreRollup()` and `getRatingAccentClasses()`
     (`useEchoRating.ts`) directly — the exact same composable + accent
     helper `CalculatorBuildCard.vue` uses for its own big/bold
     `text-4xl font-extrabold` treatment — rather than inventing a second
     styling. The original pill in `CalculatorEchoes.vue` is now
     `v-if="teamSubstatScoreRollup && !isLiveResultBarEnabled"` — still
     there for the legacy path, gone once this panel is showing it instead.
   - **`relevantRollPercent`** (`useEchoInsights.ts`) — the share of
     *rolled* substats (a stat can be rolled on more than one slot, so
     this counts rolls, not distinct stat types) that are one of the
     character's priority stats. Null (and hidden) when nothing's rolled
     yet or the character has no curated profile — an uncurated
     character's weights are all equal, so there'd be nothing genuine to
     call "relevant." Rendered as a percentage plus a daisyUI
     `<progress class="progress progress-primary">`, matching the one
     existing progress-bar usage in the app (`CalculatorOptimizer.vue`).
   - **The panel is wrapped in a compact card** (`card card-bordered
     card-compact bg-base-100 shadow`) — the same card shell
     `CalculatorEchoTile.vue`/`CalculatorEchoCard.vue` already use — so its
     border/shadow reads as a clear boundary against the build strip
     instead of the two columns visually blending together. This was
     offered as an alternative to a literal divider line and preferred;
     no extra divider element was added.

12. **Roll-quality substat coloring on `CalculatorEchoCard.vue` is now
   gated behind the `liveResultBar` flag too.** Decision #7 retrofitted
   `getSubstatRollQualityClasses()` onto this card's compact/comfy
   substat rows, but the card itself is shared, unconditionally, by both
   `InventoryEchoesBrowser.vue` and `CalculatorEchoesBrowser.vue`
   regardless of that flag — so flag-off users started seeing the new
   coloring in the Inventory grid, a real leak out of this Labs-flagged
   feature. `CalculatorEchoCard.vue` now reads
   `settingsStore.labs.liveResultBar.isEnabled` itself and routes every
   color call through a local `substatColorClasses()` wrapper that
   returns `null` when the flag is off, restoring the flag-off Inventory
   grid to exactly how it looked before decision #7 touched this file.

13. **`CalculatorEchoCard.vue`'s comfy layout mirrors
   `CalculatorEchoTile.vue`'s look when the `liveResultBar` flag is on**,
   instead of its own older table-based layout — an echo looks the same
   whether it's equipped (the build-strip tile) or being browsed
   (Inventory grid / Echo Browser, both of which share this one card
   component). Same shape as the tile: circular avatar with the cost
   badge overlaid at its corner, name + CV/Substat-Score-or-Echo-Rating
   badges below it, a plain main-stat/free-stat text line, then a vertical
   5-row substat list (icon + label left, value right, roll-quality-colored
   left border and background tint when filled). Unlike the tile (always
   exactly 5 slots by construction), an Inventory echo can have fewer than
   5 revealed substats; missing ones render as an explicit "Empty" row
   (border-l-base-300, dimmed) instead of being omitted outright, the same
   visual language the tile already used for an in-progress build slot.
   An early version of this change applied the new layout unconditionally
   (flag on or off), reasoning that only the roll-quality *color* was a
   Labs feature (decision #12) — but that changed the flag-off experience
   too, which this whole redesign has otherwise treated as an inviolable
   "byte-identical to today" guarantee (decision #6). Corrected: comfy now
   branches on `isLiveResultBarEnabled` the same way compact vs. comfy
   already branches on the `compact` prop — flag on gets the tile-style
   layout above; flag off gets the exact original
   `<table class="table table-zebra">` markup, unchanged. Compact mode
   (the optimizer-loadout card style) is unaffected either way.
   `hideInventory`/`echoId`-driven "in your inventory" indicator and the
   host-supplied footer slot (Inventory's Edit/Duplicate/Delete, the Echo
   Browser's "Use echo") are unchanged in both branches.

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
