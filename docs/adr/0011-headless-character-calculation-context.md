---
status: accepted
date: 2026-08-07
tags: [calculator, stores, team-rotations]
---

# 11. Headless character calculation context for non-active-character consumers

## Context

Calculator.vue computes one character's stats and damage reactively: it holds a single `chosenChar`/`character` and dozens of interdependent refs (weapon data, echo stats, buffs, enemy config), wired together through `computed`/`watch` handlers. Several buff calculations — weapon passives, echo set bonuses, the main-echo self-buff, and team buffs — were implemented *inside* their Vue components (`CalculatorWeapons.vue`, `CalculatorEchoesSetBonus*.vue`, `CalculatorEchoes.vue`, `CalculatorPartyBuff*.vue`), not in `src/calculator/`.

The Team Rotations feature needs full, accurate stats/damage for up to 3 characters at once, independent of whichever character is "active" in the Calculator UI. Building that without first extracting the buff math would mean either duplicating formulas (accuracy drift risk, violates ADR 0002/0003) or shipping team damage that silently excludes those buffs.

## Decision

1. Extract the four buff calculations into pure functions, reused by both the existing Vue components and the new feature:
   - `src/weapons/weaponPassives.ts` — `resolveWeaponPassiveInstance`, `aggregateWeaponPassiveStats`, `computeWeaponPassiveStats`.
   - `src/echoes/echoSetPassives.ts` — `resolveEchoSetPassiveInstance`, `aggregateEchoSetPassiveStats`.
   - `src/echoes/mainEcho.ts` — `resolveMainEchoBuffStats`, `combineEchoStats`.
   - `src/buffs/teamBuffs.ts` — `resolveTeamBuffInstance`, `aggregateTeamBuffStats`.

   Each pre-existing quirk (e.g. team buffs always resolving `Talent` modifiers against level "10" because `talentData` is never wired up in `CalculatorPartyBuffs.vue`) was preserved exactly, not fixed, so the port cannot silently change any displayed number. Tests pin these quirks explicitly.

2. Add `buildCharacterCalculationContext(characterId, characters, enemyConfig)` in `src/calculator/buildCharacterContext.ts`. It reconstructs the full calculation context for an arbitrary character id directly from stored build data (`characterStore.characters[id]`), composing the extracted pure functions plus already-pure helpers (`getCombinedEchoStats`, `calculateAllStats`, `getCalculationContext`, `resolveActiveStance`). It takes enemy config as a parameter rather than reading it from the character record, since a team rotation targets one shared enemy.

3. Add `calcTeamRotationDamage`/`calcRotationDps` in `src/calculator/teamRotation.ts`, which build one context per teammate, resolve each teammate's assigned actions via the existing `resolveRotationActionToAttackData`, and sum the per-character damage into a team total + DPS. `CalculatorDamages.vue`'s single-character DPS display was switched to the same `calcRotationDps` helper to remove the one remaining duplicate implementation.

No caching is introduced — every call rebuilds the context fresh, per product requirements (caching would need invalidation rules the feature doesn't need yet, and can be revisited once real usage patterns emerge).

## Consequences

- Pros: One implementation per formula, shared by the Calculator page and Team Rotations; new non-"active character" consumers (e.g. a future multi-character comparison view) can reuse `buildCharacterCalculationContext` directly; existing Cypress specs (`rotations`, `teamBuffs`, `weapons`, `echoes`, `customBuffs`) serve as the regression suite proving the extraction changed no numbers.
- Cons: `Calculator.vue` was *not* refactored to call `buildCharacterCalculationContext` in this change (too large a diff) — it still runs its own reactive pipeline in parallel, calling the same underlying pure functions. A future PR could replace `computeAllBuffsWithBreakdown`/`calcAllDamages`'s manual wiring with a single call, since the inputs/outputs already match 1:1.

## Guidance

- **Do** extend `buildCharacterCalculationContext` (not a new parallel implementation) if Team Rotations or a future feature needs another piece of a character's build reflected in headless calculations.
- **Do** add a unit test pinning any quirk you discover while touching these pure functions, before "fixing" it — a silent behavior change here affects every consumer.
- **Don't** read enemy config from `characters[id].enemyLevel`/`enemyResist` inside headless builders — that's the single-character Calculator page's own persisted field; multi-character features should take enemy config as an explicit parameter.
- **Don't** add caching to `buildCharacterCalculationContext`/`calcTeamRotationDamage` without a stated invalidation strategy — recompute-on-change is intentional for now.

## Related

- `src/calculator/buildCharacterContext.ts`, `src/calculator/teamRotation.ts`
- `src/weapons/weaponPassives.ts`, `src/echoes/echoSetPassives.ts`, `src/echoes/mainEcho.ts`, `src/buffs/teamBuffs.ts`
- ADR [0002](./0002-accuracy-before-performance.md), ADR [0003](./0003-pure-calculator-engine.md), ADR [0005](./0005-stores-hold-user-data-only.md)
- [docs/src-calculator.md](../src-calculator.md), [docs/src-stores.md](../src-stores.md)
