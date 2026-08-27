---
status: accepted
date: 2026-08-27
tags: [calculator, components, composables, stores]
---

# 15. Rotation Flow (Labs-flagged, shares the `liveResultBar` flag)

## Context

The character rotation builder (`CalculatorRotation.vue`/`CalculatorRotationAction.vue`)
and its Team Rotation counterpart (`TeamRotationTeamEditor.vue`/`TeamRotationActionEditor.vue`)
shared a real usability problem: two separate, differently-shaped systems for
configuring one action's buffs (`action.buffs`'s flat "Configure Stats"
modifier list vs. `action.advancedConfig`'s per-passive "Configure Buffs"
checklist, never shown together), no at-a-glance view of a rotation's size or
damage, and no way to build a rotation faster than one attack at a time via a
searchable dropdown. A design proposal ("Rotation Flow", published as an
Artifact, not checked in) explored a redesign; this ADR is for actually
building it, not the proposal itself.

Ships behind the existing `liveResultBar` Labs flag (`settingsStore.labs.liveResultBar.isEnabled`,
labeled "UI Overhaul 3.0" in `SettingsLabs.vue`) rather than a flag of its
own — the same choice ADR [0014](./0014-echo-editor-redesign.md) made for
the echo editor redesign. `liveResultBar` has become the umbrella flag for
this whole "next-gen UI" initiative rather than naming one specific area, so
`SettingsLabs.vue` doesn't get a new per-feature row for every redesign that
ships behind it — reusing the flag was corrected into this ADR after an
initial pass shipped a separate `rotationFlow` key, which didn't match that
established pattern.

## Decision

1. **Reuse the shared leaf component instead of forking two builders.**
   `CalculatorRotationAction.vue` is the one component both
   `CalculatorRotationActionEditor.vue` (single-character) and
   `TeamRotationActionEditor.vue` (team) wrap. All the flag-gated UI (the
   unified buff chip row, the duplicate button, the damage badge) was added
   there once; both builders got it for free. Only the parts each wrapper
   already owned separately — `advancedConfig` computation/mutation, and
   summary/damage/quick-add data sourcing — needed parallel (not shared)
   implementations in `CalculatorRotation.vue` vs. `TeamRotationTeamEditor.vue`,
   mirroring the split that already existed before this change (Team's
   `advancedConfig` plumbing was never shared with single-character's).

2. **The unified buff panel composes the existing editors instead of
   replacing them.** `action.buffs` (flat custom modifiers, via
   `CalculatorRotationActionBuff.vue`) and `action.advancedConfig`
   (character-buff toggles, via `TeamRotationAdvancedBuffs.vue`/
   `TeamRotationAdvancedBuffRow.vue`) keep their existing data shapes and
   editor components untouched — both are already shared between
   single-character and team. What's new: one chip row on
   `CalculatorRotationAction.vue` showing both sources at a glance
   (advancedConfig chips are resolved by the wrapper, which already owns
   that data, and passed down via a new `advancedBuffChips` display-only
   prop), and a single "⚙ Manage Buffs" toggle that opens both existing
   editors together instead of two independently-toggled buttons. Removing a
   live-buff chip emits `toggle-advanced-buff` back to the wrapper rather
   than mutating anything locally — the leaf component still has zero
   knowledge of `RotationAdvancedConfig`.

3. **Damage-by-action reuses already-computed damage on both sides — no new
   compute cycle.** Single-character: `calcCharacterRotationDamage`'s result
   was already computed by `Calculator.vue` on every recalc
   (`allDamages.value.rotations`) but never passed into the rotation editor
   itself — now threaded through as a plain prop
   (`CalculatorRotations.vue` → `CalculatorRotation.vue`), matched by
   rotation id then `attack.id === action.id`. Team:
   `TeamRotationTeamEditor.vue` already runs its own live `recompute()` (via
   `calcTeamRotationDamage`, watched on the team ref) for the
   Summary/Damages drawer — the editor's damage strip reads that same
   already-live `result.actionResults`, no second recompute added. Ordered
   by action sequence, never by time — there's no per-action cast-timing
   data in the model to plot honestly, so the strip's own caption says so
   rather than implying a precision that isn't there.

4. **Duplicate is a plain array clone, not a semantic "repeat this
   combo".** The `⧉` button on a row emits `duplicate-action` (single) /
   `duplicate` (team) up to whichever component owns the actions array,
   which deep-clones the action object (new id; same `key`/`buffs`/
   `advancedConfig`/`count`), splices it in immediately after the source,
   and renumbers order — the same insert-and-renumber shape the existing
   drag-reorder handlers already use in both files. Team's version
   additionally preserves `slot`, since a clone should stay with the same
   teammate.

5. **Quick-add/paste-import fuzzy-matches against real attack data, not a
   fabricated shortlist.** `src/utils/actionTextMatch.ts` is a new pure
   module (tiered scoring: exact → prefix → all-query-tokens-present →
   substring → bigram Sørensen–Dice fallback; deliberately no new
   dependency — no fuzzy-search library existed in the repo) that only
   knows about `{key, label, group}` triples; it has no idea where that list
   comes from. `src/composables/useCharacterActionList.ts` builds it from a
   character's real `basicAttacks`/`skillAttacks`/`forteCircuitAttacks`/
   `liberationAttacks`/`introAttacks`/`outroAttacks`/`tuneBreakAttacks`
   groups — the same static game-data groups `CalculatorRotationAction.vue`'s
   own attack picker already reads (that picker's `attackSelectOptions`
   computed wasn't refactored to share code with this new composable — see
   "Not done here"). Team's quick-add is scoped to one teammate at a time
   (a slot selector defaulting to whichever slot was last edited), not a
   merged multi-character list.

6. **Ambiguous paste-import matches block Add, not just flag it.** If two or
   more candidates score within 0.12 of the top match, that line needs an
   explicit pick before "Add N actions" enables — matches the reviewed
   design proposal's own interactive demo exactly, rather than silently
   guessing or letting an unresolved line through.

## Round 2 (post-review refinements)

Real usage of round 1 surfaced five more changes, all still flag-gated,
legacy path untouched:

7. **Live-buff chips only show once an action is actually customized.**
   Round 1's unified chip row showed a character's currently-enabled
   `advancedConfig` entries on every single action — but while an action is
   still "Synced with character," those chips are identical, expected noise
   repeated down the whole rotation. `advancedBuffChips` in both wrapper
   editors now short-circuits to `[]` unless `isCustomized` is true. Custom
   `action.buffs` chips are unaffected — those are always a deliberate
   per-action choice, sync status doesn't apply to them.

8. **Button weight consistency.** "Manage Buffs" was plain `btn btn-xs`
   while "Duplicate" was `btn-neutral` — inconsistent prominence for two
   equally-primary actions on the same row. Both are `btn-neutral` now;
   "Delete" gets `btn-error btn-outline` so it reads as clearly destructive.
   All three changes are flag-gated (`:class` bindings, not a swapped base
   class) so the legacy row is pixel-identical off-flag.

9. **Quick-add/paste-import moved to the top of the action list**, next to
   a duplicate "Add Action" button rendered only when the flag is on — the
   original bottom-of-list placement (round 1) was easy to miss entirely.
   The legacy bottom placement is preserved exactly for the flag-off case.

10. **The open rotation's header compresses to name + echo + overflow.**
    Round 1 left the full description/echo-picker/rank-slider/duration block
    always expanded under an open rotation. Now (flag on) that whole block
    lives behind a "More settings" toggle; the always-visible bar is just a
    clickable echo avatar (opens the existing echo-chooser dialog directly)
    and an `AppOverflowMenu` (Copy to Clipboard / Download JSON / Delete —
    the same handlers as before, just relocated out of three separate
    inline buttons).

11. **The rotations list gained TeamRotations.vue's ranking/summary
    pattern**, scoped to what was asked for (filters explicitly skipped —
    there's no meaningful character-scoped filter axis here the way
    TeamRotations.vue's character/status filters have) — one compact list,
    not TeamRotations.vue's grid/list toggle, since the ask was about
    information density (action count, duration, sort), not a card
    layout choice:
    - `sortMetric` (`normal | avg | crit | name`) reorders the list and
      drives an "All Rotations Summary" panel with three leaderboard cards
      (Strongest Rotation, Best DPS, Strongest Hit) — same shape as
      TeamRotations.vue's five-card leaderboard, trimmed to the three
      metrics actually named in review (healing/shield cards would mostly
      read as zero for non-support characters' rotations, unlike a team
      that usually has a healer).
    - Unlike TeamRotations.vue's async `calcTeamRotationDamage` +
      fingerprint-cache pipeline (needed because a team combines multiple
      characters), `CalculatorRotations.vue` doesn't compute anything new —
      it reads the exact same `allDamages.rotations[i].damageAggregation`/
      `.attacks` that `CalculatorRotation.vue`'s own damage-by-action strip
      already reads, just summed/maxed across every rotation instead of one.
    - Favoriting reuses `FavoriteHeartButton.vue` as-is, but the persisted
      shape differs deliberately from Team's: a plain `favorite?: boolean`
      field directly on each rotation object, not a separate
      `favoriteRotationIds`-style array — a single character's own
      rotations don't need cross-entity favorite lookups the way Team's
      shared `favoriteTeamIds` array does.
    - Fixed a real bug surfaced while wiring this in:
      `CalculatorRotations.vue`'s `handleUpdatedRotation` was a wholesale
      replace, not a merge — `CalculatorRotation.vue`'s own
      `emitRotation()` payload has no idea about list-owned fields like the
      new `favorite`, so any unrelated edit (renaming, duration, etc.)
      would have silently dropped it. Same class of bug the codebase
      already guards against for `advancedConfig` elsewhere; fixed the same
      way (merge, not replace).
    - Manual drag-reorder is disabled when the flag is on — order is now
      sort-metric-driven, same as TeamRotations.vue never supporting manual
      per-team ordering in its list either.

## Round 3 (density and clarity pass)

12. **Damage strip caption reframed positively.** "— ordered, not timed.
    There's no per-action cast timing in the data to plot a real timeline"
    (round 1's honest-about-limitations framing) became "Damage by action,
    in rotation order — bar height shows which hits matter most" — states
    what the strip does rather than what it doesn't.

13. **Duration moved next to the name field**, in the always-visible header
    row (a compact `input-sm w-16`), rather than living only inside the
    settings panel — it's common enough to want to glance at or tweak that
    it earned a spot beside the name, on both flag states equally (though
    only rendered `v-if="isOpen && isLiveResultBarEnabled"`, since the
    legacy header has no equivalent compact field).

14. **"More settings" → "Main Echo Settings", inline collapse → modal.**
    Now that duration lives next to the name, what's left (description +
    echo picker: image, Choose/Use current echo, rank) is genuinely just
    "settings for this rotation's main echo" — the rename reflects that.
    It's a real `<dialog>` now (mirrors the existing echo-chooser dialog:
    rendered as a template-root sibling of `.card`, not nested inside it,
    so it isn't subject to the card's own `@click="toggleOpen"`), opened
    via `showModal()`/closed via `close()` on a second modal id
    (`mainEchoSettingsModalId`) — not the collapsible `showRotationSettings`
    boolean from round 2, which is gone entirely. The legacy (flag-off)
    inline block is untouched, still always-expanded with its own duration
    field intact.

15. **Quick-add and paste-import read as two distinct features, not one
    input + its submit button.** Round 2's layout put "Paste rotation" (a
    solid `btn-neutral`) directly beside the text input at the same height
    — indistinguishable from a submit button for that input. Now: an "Add
    one action" label sits above a full-width input, a `divider` reading
    "or" separates the two paths, and the paste toggle is a low-emphasis
    `btn-ghost` reading "📋 Paste a whole rotation" underneath — visually
    subordinate to, not beside, the primary input.

## Not done here

- Team paste-import's `Name:`-per-line prefix convention for assigning a
  slot inline (from the original design proposal) — the per-teammate slot
  selector is the interim single-slot-at-a-time path.
- `useCharacterActionList.ts` intentionally omits `echoSetAttacks`/
  `utilityAttacks`/`echoAttacks`/negative-status entries that
  `CalculatorRotationAction.vue`'s own dropdown includes — v1 scope is the
  seven core attack groups only.
- Unifying `CalculatorRotationAction.vue`'s own `attackSelectOptions` with
  `useCharacterActionList.ts` into one shared source — similar lists, kept
  separate to avoid touching the already-working picker.
- Rotation health-check hints, a snippet library, and user-submittable team
  presets — adjacent ideas from the same design proposal, not built here.
- A grid/list view toggle and character/status-style filters for the
  rotations list (TeamRotations.vue has both) — explicitly out of scope per
  review; there's one compact list and no meaningful filter axis for a
  single character's own rotations.
- Applying the same rotations-list ranking/summary/favorite treatment to
  Team Rotations' own list — TeamRotations.vue already has an equivalent
  (older, team-shaped) version of this; round 2 only ported the pattern
  toward `CalculatorRotations.vue`, not the reverse.

## Related

- `src/components/CalculatorRotationAction.vue`,
  `CalculatorRotationActionEditor.vue`, `CalculatorRotation.vue`,
  `CalculatorRotations.vue`, `TeamRotationActionEditor.vue`,
  `TeamRotationTeamEditor.vue`, `CalculatorRotationQuickAdd.vue` (new),
  `AppOverflowMenu.vue`, `FavoriteHeartButton.vue` (both reused, unchanged)
- `src/composables/useCharacterActionList.ts` (new)
- `src/utils/actionTextMatch.ts` (new) — `tests/utils/actionTextMatch.test.ts`
- `src/calculator/rotationAdvancedBuffs.ts`, `characterRotation.ts`,
  `teamRotation.ts` (read, unchanged)
- `tests/components/CalculatorRotationActionEditor.test.ts` (new) — covers
  the synced/customized chip-visibility split
- `src/components/TeamRotations.vue` — the source pattern for the rotations
  list's sort/leaderboard/favorite treatment
- ADR [0013](./0013-live-result-bar-labs-flag.md) — the Labs-flag pattern
  this follows
