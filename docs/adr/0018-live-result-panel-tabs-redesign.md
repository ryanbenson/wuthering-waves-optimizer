---
status: accepted
date: 2026-09-01
tags: [calculator, components, stores]
---

# 18. Full breakdown panel — Overview/Attacks/Rotations redesign

## Context

`CalculatorLiveResultDetail.vue` (the "Full breakdown" panel opened from the
Live Result Bar — see ADR 0013) stacked a flat 13-row stat table
(`CalculatorStats.vue`) on top of up to 8 always-expanded attack-phase tables
and a Rotations section (`CalculatorDamages.vue`) inside a fixed 380px panel.
A design review (published as an Artifact, not checked in — the design
canvas linked from the originating conversation) found it narrow, long, and
unconfigurable: every attack phase printed in full regardless of relevance,
Rotations sat at the very bottom after everything else, and there was no way
to widen the panel, collapse a section, or surface the handful of stats a
given build actually cares about. This ADR is for building the recommended
redesign, not the review itself.

Ships behind the existing `liveResultBar` Labs flag — no new flag.

## Decision

1. **Overview / Attacks / Rotations tabs, not one long scroll.**
   `CalculatorLiveResultDetail.vue` gained a local `activeTab` ref (not
   persisted — the panel always opens on Overview) and three new tab-body
   components: `CalculatorLiveResultOverview.vue`, `CalculatorLiveResultAttacks.vue`,
   `CalculatorLiveResultRotations.vue`. **Rotations is always its own tab**,
   even for a character with a single saved rotation — a deliberate choice
   over folding it into Attacks until 2+ rotations exist, so the tab layout
   stays consistent across every character and a single rotation still isn't
   buried at the bottom of a scroll (one of the three original pain points).

2. **Attacks is a collapsible accordion, auto-expanding the current target's
   group.** `CalculatorLiveResultAttackGroup.vue` is a single controlled
   accordion row (expand state lives in the parent `CalculatorLiveResultAttacks.vue`,
   not the row itself, so Expand all/Collapse all can drive it directly); a
   collapsed row shows a "peek" of its top attack's Average damage instead of
   nothing. Which group starts expanded is computed from the user's current
   optimizer target via a new `attackGroupForTarget()` in
   `src/calculator/liveResultBar.ts` — reusing the existing `Attack:group|key`
   parse already inside `resolveLiveResultBarTarget` rather than re-deriving
   it. The watcher on the target only ever *opens* the newly-targeted group;
   it never force-closes a group the user expanded manually. `CalculatorDamages.vue`
   itself is untouched — it has independent legacy callers (`Calculator.vue`'s
   flag-off split-pane path, two of them), so the accordion re-renders the
   same per-phase table markup (`<CalculatorDamage>` rows, reused as-is)
   alongside it rather than refactoring it out from underneath those callers.

3. **Pinned/favorite stats persist per character, as an object map, not an
   array.** `CalculatorLiveResultOverview.vue` groups the panel's 13 stat
   rows into Core / Crit / DMG Bonuses (`STAT_GROUPS`,
   `src/calculator/pinnedStats.ts`) and gives each a pin toggle; pinned ones
   also show in a chip strip above the tabs (`CalculatorLiveResultDetail.vue`),
   sourced from one composable (`usePinnedStats.ts`) so both read/write the
   same resolved set. This extends the existing character-declared
   `liveResultBarStatKeys`/`DEFAULT_LIVE_RESULT_BAR_STATS` mechanism (ADR
   0013) with a user override, rather than a second parallel concept.

   The persisted shape (`settingsStore.config.pinnedStatsByCharacter[character]`)
   is deliberately `{ [statKey]: true }`, not an array: `settingsStore.addToConfig`
   deep-merges via lodash `merge`, which does not truncate an existing array
   when a shorter one is written on top of it — unpinning a stat by writing a
   shorter array would silently leave stale entries behind. An object map
   makes "unpin" a real key delete, and `usePinnedStats.togglePin()` writes
   the whole next config via `setConfig` (full replace) for this branch
   rather than `addToConfig`, sidestepping the merge behavior entirely. A
   character only counts as "customized" once the settings store has an own
   key for it (`hasOwnProperty`, not "the map is non-empty") — otherwise a
   user who unpins every stat would silently fall back to the declared
   defaults again instead of getting a genuinely empty strip.

   One stat key is synthetic: `elementDmgBonus` stands in for whichever
   single element-DMG-bonus row a character actually shows (`CalculatorStats.vue`
   has six separate `glacio`/`fusion`/.../`havoc` props, but only ever
   renders the character's own one), resolved by
   `useLiveResultStatRows.ts` from a `elementFilter` prop rather than needing
   six pinnable keys where five are always irrelevant to any given character.

4. **Panel width is a 3-step preset (`liveResultDetailPanelWidth`:
   compact/standard/wide → 380/420/480px), not a drag handle.** A plain
   scalar under `addToConfig` — no merge hazard, since it's never an array —
   chosen over stepless resize to avoid pointer-drag handling and min/max
   clamping for a decision that's really "pick one of three fixed widths."
   Standard (420px) is now the default width, 40px wider than the old fixed
   380px, addressing "too narrow" directly rather than only through
   restructuring.

5. **Discovered and fixed in passing**: `CalculatorLiveResultDetail.vue`
   never passed `element-filter` to `CalculatorStats`, unlike
   `CalculatorBuildCard.vue` — so the panel was actually rendering all 6
   elemental-DMG-bonus rows, not the character's one. `CalculatorLiveResultOverview.vue`
   (which replaces the direct `CalculatorStats` call in this panel) resolves
   the element correctly via `chosenChar.value?.basic?.element`.

## Not done here

- **Extending pinned stats or the width preset to any other panel** — this
  redesign is scoped to the Full breakdown panel specifically.
- **Removing `CalculatorDamages.vue`'s now-partially-redundant per-phase
  markup** — it still backs the legacy flag-off split-pane view directly and
  was left untouched; deduplicating it against the new accordion rows is a
  follow-up, not part of this change.
- **Persisting expand/collapse state across reloads** — a group's
  expanded/collapsed state resets to "target group open, rest closed" every
  time the panel (re)opens, rather than remembering a user's manual
  expand/collapse choices. Simpler and more predictable than persisting a
  third settings shape on top of the two added here.
