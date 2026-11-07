---
status: accepted
date: 2026-11-07
tags: [components, calculator]
---

# 56. Show what one more substat roll is worth

## Context

The Echo Insights panel (ADR [0014](./0014-echo-editor-redesign.md) decision #10, ADR [0030](./0030-echoes-tab-v3-redesign.md)) lists a character's priority substats, ordered by their 0-4 weights, with how many rolls the build has and their total. The weights say Crit DMG matters more than ATK%, but not by how much, or what a roll is worth in damage. Players asked for a real number.

We explored three designs: a value on each row, a ranked "best next roll" chart, and a roll planner. We chose the first, plus the chart's one-line "Roll for" summary.

## Decision

In the v3 UI only:

1. **The unit is one average roll.** A roll's size is the mean of that substat's roll values in `subStatsTable` (Crit Rate 8.4%, Crit DMG 16.8%, ATK% 9%, flat ATK 45). Per 1% was rejected: it has no sensible step for flat stats, and it misleads between stats that roll in different sizes. Per 1%, Crit DMG looks worth less than half of ATK%, yet per roll it is worth more. Rows show the damage; the "Roll for" line and the tooltips add the % of the current number.
2. **It measures the Live Result Bar's number,** using the same target and damage type (`liveResultBarByCharacter`), as the echo-swap estimate does (`echoImpact.ts`). A Stat target, or a number of 0 (a healing or shield target), shows no values, only a hint to pick an attack or rotation.
3. **It reuses the headless pipeline; no new damage math.** `estimateSubstatRollValues` (`src/echoes/substatRollValue.ts`) adds one roll to a copy of the character's Custom Buffs, whose keys are the substat keys, on top of anything the user already set. It then runs `calcCharacterRotationDamage` (ADR [0011](./0011-headless-character-calculation-context.md)) once for the baseline and once per substat. Each value is a real before-and-after, so the Crit Rate cap, the damage type, and stats an attack doesn't use (Energy Regen, HP, another skill type's DMG Bonus) all come out right, usually as +0.
4. **One calculation per screen.** `useSubstatRollValues` recalculates 300 ms after the character's record, its equipped echoes or the Live Result Bar target change, and ignores late results. `CalculatorEchoes.vue` passes the result to both panels (desktop sidebar and phone bar).
5. **"Roll for"** sits under the Build Score: the substat with the biggest gain, then the next two (`pickRollFor`). It ranks all 13 substats, so it also works for characters with no curated weights. It is hidden in the collapsed phone bar and when nothing adds damage.

## Consequences

- Pros: the weights now come with a number players can check, and where the build disagrees with the weights (here Crit Rate beat Crit DMG, both weighted 4), the panel shows it. A unit test checks that a roll added through Custom Buffs moves damage exactly as much as the same roll on an equipped echo.
- Cons: 14 calculations per build change, about 1-6 ms each, off the critical path but on the main thread. Rows are wider, so the Priority and Other lists only sit side by side from 1400px (was 1025px), and the sidebar now takes the room the tiles column leaves instead of sizing to its content. A single-attack target ignores stats that only matter across a rotation; that matches what the Live Result Bar shows.

## Guidance

- Keep the measurement tied to the Live Result Bar's target and damage type; a different target would show numbers players can't check.
- If Custom Buffs ever stops stacking like echo substats, the equivalence test in `tests/calculator/substatRollValue.test.ts` fails. Fix the method, don't loosen the test.
- A roll planner (add or remove several rolls) can reuse `estimateSubstatRollValues`'s approach later.

## Related

- `src/echoes/substatRollValue.ts`, `src/composables/useSubstatRollValues.ts`
- `src/components/CalculatorEchoInsightsPanel.vue`, `src/components/EchoInsightsRollGain.vue`, `src/components/CalculatorEchoes.vue`
- `tests/calculator/substatRollValue.test.ts`, `cypress/e2e/calculator/echoInsights.cy.ts`
- ADR [0011](./0011-headless-character-calculation-context.md), [0014](./0014-echo-editor-redesign.md), [0030](./0030-echoes-tab-v3-redesign.md)
