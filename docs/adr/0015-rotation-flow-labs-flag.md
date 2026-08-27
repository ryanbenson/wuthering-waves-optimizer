---
status: accepted
date: 2026-08-27
tags: [calculator, components, composables, stores]
---

# 15. Rotation Flow (Labs-flagged rotation builder redesign)

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

Ships behind the existing Labs mechanism (`settingsStore.labs`) — a new
`rotationFlow` key registered in `SettingsLabs.vue`, the second entry ever
added there (after `liveResultBar`, ADR [0013](./0013-live-result-bar-labs-flag.md)).

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

## Related

- `src/components/CalculatorRotationAction.vue`,
  `CalculatorRotationActionEditor.vue`, `CalculatorRotation.vue`,
  `TeamRotationActionEditor.vue`, `TeamRotationTeamEditor.vue`,
  `CalculatorRotationQuickAdd.vue` (new)
- `src/composables/useCharacterActionList.ts` (new)
- `src/utils/actionTextMatch.ts` (new) — `tests/utils/actionTextMatch.test.ts`
- `src/calculator/rotationAdvancedBuffs.ts`, `characterRotation.ts`,
  `teamRotation.ts` (read, unchanged)
- ADR [0013](./0013-live-result-bar-labs-flag.md) — the Labs-flag pattern
  this follows
