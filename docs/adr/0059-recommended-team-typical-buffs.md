---
status: accepted
date: 2026-11-18
tags: [buffs, components, labs, persistence]
---

# 59. Recommended teams turn on hand-written typical buffs

## Context

The Team Buffs tab's Recommended teams card (Labs `recommendedTeams`, issue #663) fills both teammate slots in one click. Players also asked it to turn on those teammates' buffs, which depends on each teammate's sequence, whether they have their signature weapon, and the echo set they usually run. A teammate's buff list in `src/buffs/index.ts` can't simply be turned on whole: it mixes alternative versions of one buff (Roccia's S2, Lupa's Pack Hunt and Applause of Victory), buffs for someone else (Shorekeeper's Rover-only Energy Regen), attacks that aren't buffs (Roccia's Magic Box) and stacks that rotations don't always reach. Turning everything on would count some effects twice and inflate damage.

## Decision

1. **Typical buffs are hand-written per support** in `src/buffs/teamBuffDefaults.ts`: keys from the teammate's own buffs, their signature weapon's team buff (marked `signature`) and their usual echo buffs. A teammate with no entry gets nothing turned on. `tests/buffs/teamBuffDefaults.test.ts` checks every key is real and the teammate's to give.
2. **What applies is worked out, not listed per sequence.** `src/buffs/recommendedTeamBuffs.ts` keeps an entry when the chosen sequence reaches its `SequenceNodeN` key, `signature` entries only with Sig, and `fullTeamElement` entries only when all three Resonators share that element. Buffs go to realistic max stacks (or the entry's `stacks`), weapons to refinement 1, and base-stat buffs to `realisticBaseAttrValue`. Of buffs that can't be on together, the first is kept.
3. **It's opt-in and visible.** "Also turn on their buffs" is off by default and isn't saved. Everything it turns on shows in the Active buffs tray. When team buffs are already on, the player chooses Replace (turn off every enabled team buff first) or Add.
4. **Each teammate's sequence and Sig are remembered across characters** in `settings.config.teammateCopies[teammateKey]` (`{ sequence, signature }`). Like ADR 0058's filters, `settings` isn't migrated, so values are read through `parseTeammateCopy` (missing or malformed means S0 without Sig), and each teammate's entry is replaced whole.

## Consequences

- Pros: one click gives a reasonable starting setup that matches the player's copies, without guessing at buffs that would double count.
- Cons: typical buffs are a judgment call (max stacks, usual sets) and won't fit every rotation; players adjust them in the list. Every new support needs an entry before the toggle does anything for them. Buffs that depend on the team beyond "all one element" use the safe version.

## Guidance

- Adding a support: list only what a typical setup actually has up, pick one version of any alternative buffs, and let the tests check the keys. `npm run cli -- edit team-data` (issue #732) walks through this.
- An empty list means "no team buffs on purpose"; a missing entry means not filled in yet. Every teammate named in a recommended team needs an entry, even an empty one.
- Don't derive typical buffs from the buff list automatically, and don't turn buffs on without the player's click.

## Related

- ADR [0058](./0058-per-character-filter-memory.md) (settings read defensively, no migration).
- ADR [0017](./0017-team-buffs-workspace-redesign.md), [0033](./0033-team-buffs-summary-grouping-and-hide-impossible.md) (Team Buffs workspace).
