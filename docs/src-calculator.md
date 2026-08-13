# `src/calculator` — Formulas and processing

This folder holds the **core math and processing**: stats, buffs, damage formulas, attacks, and the optimizer. No Vue or DOM here—pure logic so it can run on the main thread or inside web workers.

## Files

| File | Purpose |
|------|--------|
| **`stats.ts`** | Base stat init, adding buffs (e.g. echo, team), computing self buffs, resonance chain buffs, “additional base” and crit overflow. Exposes `getInitStats`, `addBuffs`, `addEchoBuffs`, `calcCharStats`, `calculateAllStats`, and helpers like `getElementDmgBonusByType`, `getDamageValByAttr`. |
| **`calculator.ts`** | Damage/heal/shield and special formulas: `calcDamage`, `calcHeal`, `calcShield`, `getSpectroFrazzleDamage`, `getAeroErosionDamage`, `calcMidnightVeilDMG`, `calcFixedDamage`, `calcTuneBreak`, etc. |
| **`attacks.ts`** | Attack processing and damage aggregation: `processAttacks`, `calcDamages`, `getCalculationContext`. Builds the context (stats, buffs, enemy, rotations) and runs the damage pipeline. |
| **`optimizer.ts`** | Optimizer context and types. Defines the data and options passed to the optimizer workers (e.g. `OptimizerContext`). Heavy combo generation and evaluation run in workers that use this context. |
| **`resolveRotationAction.ts`** | `resolveRotationActionToAttackData` — maps one persisted `RotationAction` (character + skill key + count + buffs/overrides) to a full attack-ready object for `processAttacks`. Used by both the single-character rotation system and Team Rotations. |
| **`buildCharacterContext.ts`** | `buildCharacterCalculationContext(characterId, characters, enemyConfig, inventoryEchoes?, options?)` — headless (no Vue/"active character" dependency) reconstruction of a character's full calculation context directly from stored build data: weapon (incl. passives), echoes (incl. set bonuses + main echo buff), self buffs, resonance chains, team buffs, and `calculateAllStats`/`getCalculationContext` output. Also returns a `definitions` catalog (raw buff/passive/resonance-chain *definitions*, not just their computed values) consumed by Team Rotations' Advanced-mode per-action buff editor. `options.alwaysEnabledOnly` resolves only permanently-active contributions — base stats plus weapon passives/echo set bonuses/main-echo buff whose definitions carry `alwaysEnabled: true` — dropping character self-buffs, resonance chains, team buffs, and custom buffs entirely regardless of their stored toggle state; used by `CalculatorBuildCard.vue` to represent equipment alone (issue #383). See ADR [0011](./adr/0011-headless-character-calculation-context.md). |
| **`teamRotation.ts`** | `calcTeamRotationDamage` — evaluates a rotation spanning up to 3 characters. In `"basic"` mode (default) each character gets one shared context via `buildCharacterContext.ts`, batched across all their actions. In `"advanced"` mode, each action can carry an `advancedConfig` (per-buff-category overrides); `applyAdvancedOverrides` clones that character's stored build data with the overrides merged in and builds a fresh context per action, then results are summed back into the same per-character/team totals. `buildAdvancedConfigSnapshot(characterData, definitions, "current" \| "blank")` — builds a full `advancedConfig` up front, either mirroring the character's real current buff state (so Advanced mode's checkboxes aren't misleadingly blank while actually still using the real config) or fully disabled; used when a team first switches Basic -> Advanced and for actions added afterward. `applyBulkAdvancedConfigOverride(actions, actionIds, category, key, override)` — stamps one concrete override into every listed action's `advancedConfig`; the mechanism behind the per-buff "Duration" control (apply a buff's current state across a range of actions) — a UI convenience with no persisted span/duration concept, not a new calculation feature. `convertRotationActionsForSlot(sourceActions, slot, startOrder)` — converts a single-character rotation's actions (from `characters[id].rotations` or a character preset) into team actions pinned to one slot, regenerating ids and continuing the order sequence; used when importing a rotation into a team slot. `calcRotationDps` — shared DPS-from-duration math, used by both Team Rotations and `CalculatorDamages.vue`. |

## Data flow (conceptual)

1. **Stats**  
   Base stats (from character + level + weapon) → add echo stats → apply self buffs → resonance chain buffs → additional base/crit overflow → **final stats**.

2. **Damage**  
   Final stats + enemy + rotation/attack list → `getCalculationContext` → `calcDamages` (which uses `calculator.ts` and `processAttacks`).

3. **Optimizer**  
   Main thread builds `OptimizerContext` and sends batches to `processor.worker.ts`; workers use `stats.ts` and damage logic to evaluate loadouts and return results.

## Important conventions

- **No Vue / DOM**: Only TS and data. This keeps the logic worker-safe and testable.
- **Serializable context**: Optimizer and any worker entry points receive plain objects (no functions) so they can be postMessage’d.
- **Performance**: These functions run on every relevant user change; keep hot paths tight and data structures efficient.

## Type definitions

Types are defined in the same files or in `optimizer.ts` for optimizer-specific shapes. As the codebase is typed further, key interfaces (e.g. stat object, calculation context) should live here or in a small shared types module used by both `calculator/` and `workers/`.
