# `src/calculator` — Formulas and processing

This folder holds the **core math and processing**: stats, buffs, damage formulas, attacks, and the optimizer. No Vue or DOM here—pure logic so it can run on the main thread or inside web workers.

## Files

| File | Purpose |
|------|--------|
| **`stats.ts`** | Base stat init, adding buffs (e.g. echo, team), computing self buffs, resonance chain buffs, “additional base” and crit overflow. Exposes `getInitStats`, `addBuffs`, `addEchoBuffs`, `calcCharStats`, `calculateAllStats`, and helpers like `getElementDmgBonusByType`, `getDamageValByAttr`. |
| **`calculator.ts`** | Damage/heal/shield and special formulas: `calcDamage`, `calcHeal`, `calcShield`, `getSpectroFrazzleDamage`, `getAeroErosionDamage`, `calcMidnightVeilDMG`, `calcFixedDamage`, `calcTuneBreak`, etc. |
| **`attacks.ts`** | Attack processing and damage aggregation: `processAttacks`, `calcDamages`, `getCalculationContext`. Builds the context (stats, buffs, enemy, rotations) and runs the damage pipeline. |
| **`optimizer.ts`** | Optimizer context and types. Defines the data and options passed to the optimizer workers (e.g. `OptimizerContext`). Heavy combo generation and evaluation run in workers that use this context. |

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
