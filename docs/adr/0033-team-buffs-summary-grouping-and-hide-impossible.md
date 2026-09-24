---
status: accepted
date: 2026-09-24
tags: [components, buffs, weapons]
supersedes: [0017]
---

# 33. Team Buffs summary: drop contribution totals, group the active tray, add "Hide impossible"

## Context

ADR [0017](./0017-team-buffs-workspace-redesign.md) gave the v3 Team Buffs
workspace's summary column a "Team Contribution" row (ATK / DMG Bonus /
Crit DMG / Buffs Active) above a flat Active Buffs tray. In use:

- The totals were misleading. Team buffs are too nuanced to sum into three
  headline numbers — "DMG Bonus" folded together element bonuses, skill-type
  deepens, resist shred and DEF ignore that don't apply to the same attacks,
  so the figure read as more meaningful than it was.
- With many buffs on, the flat tray became one wall of chips with no hint of
  where each came from.
- The weapon buff list shows every team weapon buff regardless of whether
  either selected teammate can equip that weapon type, which is clutter.

## Decision

1. **The Team Contribution row is removed.** `categorizeBuffModifier()` (its
   only consumer) is deleted from `src/buffs/teamBuffs.ts` along with its
   tests. The per-chip "+20% Crit DMG" readout (`getModifierLabel()`) stays —
   it describes one buff, so it doesn't have the aggregation problem.
2. **The Active Buffs tray is grouped by source**: teammate 1 (name +
   avatar), teammate 2, Echo Buffs, Weapon Buffs, in the same order as the
   config sections on the left. Empty groups are omitted.
3. **"Hide impossible" toggle** next to "Hide unused", persisted as
   `teamBuffs.hideImpossible` (optional boolean, default `false`, same
   additive pattern as `hideUnused` — no migration). When on, weapon team
   buffs whose `weaponType` isn't wielded by either selected teammate are
   hidden (`buffIsPossibleForTeam()` in `src/buffs/buffFilters.ts`).
   - Weapon type comes from a new explicit `weaponType` field on each
     `allWeaponTeamBuffs` entry (singular, matching
     `allCharactersList[].weapon`). A test cross-checks every entry against
     the `src/weapons/weapons.ts` registry, so a mistagged or untagged new
     weapon buff fails CI.
   - With no teammate selected, nothing is ruled out (the toggle is a no-op).
   - A buff that is **enabled** is never hidden by this filter, so an
     impossible-but-enabled buff can't keep silently applying to the
     calculation from a row the user can no longer see.
   - Only weapon buffs are affected; echo buffs can be used by anyone, and
     character buffs already belong to the selected teammate.

Display-only: none of this touches `teamBuffsData` or any calculator path.

## Consequences

- Pros: the summary no longer shows a number that can be misread; the tray
  scales to many active buffs; weapon clutter can be cut to what the team can
  actually bring.
- Cons: new weapon team buffs need a `weaponType` by hand (enforced by test).

## Related

- `src/components/CalculatorTeamBuffsWorkspace.vue`
- `src/buffs/buffFilters.ts` — `buffIsPossibleForTeam` — `tests/buffs/buffFilters.test.ts`
- `src/buffs/index.ts` — `allWeaponTeamBuffs[].weaponType`
- `cypress/e2e/calculator/teamBuffsWorkspaceFlagged.cy.ts`
