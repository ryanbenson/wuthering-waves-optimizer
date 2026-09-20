---
status: accepted
date: 2026-09-17
tags: [calculator, characters, weapons, buffs, components]
---

# 31. `mutuallyExclusiveWith` for buffs/passives/resonance-chain nodes that can't be active together

## Context

Some in-game effects are exclusive alternatives, not independent toggles:
Rime-Draped Sprouts' two Basic Attack DMG Bonus passives (one on-field, one
off-field, the second literally consuming the first's stacks on cast), and
several characters' self buffs — Brant's "My"/Theatrical Moment (two tiers of
the same ATK-from-Energy-Regen effect), Jiyan's two Forte Circuit variants,
and Lupa's two inherent-skill buffs versus her Sequence 3 resonance chain
node, which explicitly supersedes them. The app let every one of these be
enabled at once, silently double-counting DMG bonuses that can never both be
active in-game (issue reported against Rime-Draped Sprouts specifically).

Three unconnected, never-enforced attempts at recording this already existed
in buff data — `replacesBuff`/`replacedBy` (Brant, Jiyan) and `replaces`
(Lupa's resonance chain entry) — none read by any code (verified by grep
before this change). This is exactly the "frequently rediscovered" case this
ADR index calls out: the concept keeps getting invented per-character and
never wired up, so the bug recurs.

Two UI surfaces write the same store shape independently: the legacy
Calculator screen (`CalculatorCharacterBuff.vue`, `CalculatorWeaponsPassive.vue`,
`CalculatorResonanceChainsItem.vue`) and the `liveResultBar`-flagged Workspace
redesign (`WorkspaceBuffCard.vue`, `WorkspaceResonanceChain.vue`, and
`WorkspaceWeaponPanel.vue`, which reuses `CalculatorWeaponsPassive.vue`
directly). Any fix has to hold in both, or the flag becomes a backdoor around
it.

## Decision

Added one field, `mutuallyExclusiveWith?: MutuallyExclusiveRef[]`
(`src/characters/mutuallyExclusiveBuffs.ts`), usable on any buff/weapon-passive
/resonance-chain-node definition. A `MutuallyExclusiveRef` is either a plain
string key (shorthand for "same category as the definition declaring it" —
the common case, e.g. two weapon passives) or `{ key, category }` to cross
into a different category (Lupa's resonance-chain node ↔ character buffs).
`BuffCategory` is `"buffs" | "weaponPassives" | "resonanceChains"`, matching
the three store slices under `characters[id]`.

The same module exports the two pure functions that do the enforcement:

- `buildBuffToggleUpdate(ownCategory, ownKey, isEnabled, mutuallyExclusiveWith)`
  — the store update for one toggle, disabling every declared partner in the
  same stroke when enabling. Disabling never cascades — only enabling does,
  mirroring how the in-game effects actually supersede each other.
- `buildBulkEnableUpdate(ownCategory, definitions, isEnabledElsewhere, extraForKey?)`
  — the store update for an "Enable all"/"Max all" pass: walks definitions in
  order, first-in-list wins a same-category conflict, and an already-enabled
  foreign-category key always wins over the pass (so bulk-enabling character
  buffs never silently turns off a resonance chain node the user unlocked
  elsewhere).

Every leaf toggle component in both UI surfaces (the six listed under
Context, plus `CalculatorCharacterBuffs.vue`/`CalculatorResonanceChains.vue`/
`WorkspaceBuffs.vue`'s bulk actions) calls into these instead of writing
`{ isEnabled }` directly. `WorkspaceResonanceChain.vue` layers its existing
sequence-cascade logic (enabling a node pulls in every untouched earlier
level) on top: `withMutualExclusionDisables` merges in cross-category
disables for whichever keys the cascade actually turns on, without
re-deriving the cascade itself.

`RimeDrapedSprouts.ts`'s two passives now declare each other; Brant/Jiyan's
old `replacesBuff`/`replacedBy` and Lupa's `replaces` were migrated to
`mutuallyExclusiveWith` (Lupa's is the cross-category example, declared on
both sides: the resonance chain node lists the two buffs, and each buff
lists the node back).

## Consequences

- Pros: One mechanism, data-only to extend (a new conflicting pair is a
  one-line array on each side, no new component code). Applying it closed
  three previously-silent double-count bugs (Brant, Jiyan, Lupa) in addition
  to the reported one. Bulk actions ("Enable all"/"Max all") can't
  reintroduce the conflict either, which a naive per-toggle-only fix would
  have missed.
- Cons: Authors must remember to declare both sides — nothing currently
  fails loudly if only one direction is set (the undeclared side just stays
  independently toggleable, i.e. silently back to the old behavior for that
  one pair). Cross-category refs are a slightly heavier shape (`{key,
  category}`) than the common same-category string case.

## Guidance

- **Do** declare `mutuallyExclusiveWith` on **both** sides of a conflicting
  pair — one-directional declarations only enforce the fix when the user
  happens to toggle that specific side first.
- **Do** use the plain-string form unless the partner lives in a different
  category; reach for `{ key, category }` only then.
- **Do** route every new toggle write-path (single or bulk) for buffs/weapon
  passives/resonance chains through `buildBuffToggleUpdate`/
  `buildBulkEnableUpdate` rather than writing `{ isEnabled }` to the store
  directly, so this stays enforced as new UI surfaces are added.
- **Don't** add per-character `if (character === "X" && key === "Y")`
  special-casing for this (the pattern `effectiveBuffStacks.ts` uses for
  resonance-chain-adjusted stack caps) — that's exactly the ad-hoc,
  never-reused shape this ADR replaces.

## Related

- `src/characters/mutuallyExclusiveBuffs.ts`
- `src/weapons/Rectifiers/RimeDrapedSprouts.ts`, `src/characters/Brant/buffs.ts`,
  `src/characters/Jiyan/buffs.ts`, `src/characters/Lupa/buffs.ts`,
  `src/characters/Lupa/resonanceChains.ts`
- `tests/characters/mutuallyExclusiveBuffs.test.ts`,
  `tests/components/CalculatorWeaponsPassive.test.ts`,
  `tests/components/WorkspaceBuffCard.test.ts`,
  `tests/components/WorkspaceResonanceChain.test.ts`
