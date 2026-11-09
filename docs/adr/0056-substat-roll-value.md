---
status: accepted
date: 2026-11-07
tags: [components, calculator]
---

# 56. Show what each substat is worth

## Context

The Echo Insights panel (ADR [0014](./0014-echo-editor-redesign.md) decision #10, ADR [0030](./0030-echoes-tab-v3-redesign.md)) lists a character's priority substats, ordered by their 0-4 weights, with how many rolls the build has and their total. The weights say Crit DMG matters more than ATK%, but not by how much, or what it's worth in damage. Players asked for a real number.

A first version showed "per roll" (one more average roll) on each row, and "if maxed" for a stat already on all five echoes. Player feedback said it was hard to use: they ask "if I got 2-3% more Crit Rate, how much is that?", their echoes already have rolls of mixed quality, and max rolls are rare, so the Tune odds' "rare" labels didn't map to anything on this panel. That version also took the plain average of the roll values, which overstates a typical roll (rolls skew low).

The audience ranges from newcomers to theorycrafters and from early teens to their 40s, so the design favors one idea per block and one number per cell. Mockups compared a plain table with the ranking in a sentence against a ranked bar chart plus a table; we chose the plain table.

## Decision

In the v3 UI only:

1. **A substat value table replaces the Priority and Other lists.** Columns: Substat (with "3/5 · 17.2%", how many echoes have it and the total, under the name), **Per 1%** (per 10 for flat ATK/DEF, per 100 for flat HP), **Typical roll** and **Top roll** (its size and how often it drops, "3 in 100"). No bars. Priority substats come first in their weight order, then any other substat that adds damage, best first, including unrolled ones. Rolled substats that add nothing sit in one "Adds nothing here" line of chips. A priority stat that adds nothing says so in its row ("No direct damage. Your rotation may need it to run." for Energy Regen). Below ~380px of panel width, a container query folds Top roll under Typical roll.
2. **Per 1% leads because it answers the question players ask.** It works whatever rolls the build already has: 2% more is twice the number, whether from a new roll or a better one. This replaces "if maxed".
3. **A typical roll is weighted by the published drop rates** (`typicalSubstatRoll`, from `substatRollRates.ts`, the same data the Tune odds use): Crit Rate 7.53%, Crit DMG 15.06%, ATK% and DMG Bonus 8.77%, flat ATK 43.7. The plain average (8.4% Crit Rate) overstated crit rolls by about 12%.
4. **It measures the Live Result Bar's number,** using the same target and damage type (`liveResultBarByCharacter`), as the echo-swap estimate does (`echoImpact.ts`). A Stat target, or a number of 0 (a healing or shield target), shows no values, only a hint to pick an attack or rotation.
5. **It reuses the headless pipeline; no new damage math.** `createSubstatMeasurer` (`src/echoes/substatRollValue.ts`) adds an amount to a copy of the character's Custom Buffs, whose keys are the substat keys, on top of anything the user already set, and runs `calcCharacterRotationDamage` (ADR [0011](./0011-headless-character-calculation-context.md)). `measureSubstatValues` runs a typical roll of all 13 substats, then Per 1% and Top roll only for those a typical roll moves. Every number is a real before-and-after, so the Crit Rate cap, the damage type and stat-scaled buffs come out right.
6. **One calculation per screen.** `useSubstatRollValues` recalculates 300 ms after the character's record, its equipped echoes or the Live Result Bar target change, and ignores late results. `CalculatorEchoes.vue` passes the result to both panels (desktop sidebar and phone bar).
7. **"Roll for"** sits under the Build Score: the substat whose typical roll adds the most, then the next two (`pickRollFor`). Stats already on all five echoes are left out, since no echo is left to roll one on. It ranks all 13 substats, so it also works for characters with no curated weights. It is hidden in the collapsed phone bar and when nothing adds damage.
8. **"Try a change"**: an amount and a substat, answered with a real recalculation (`measureChange`, 200 ms debounce), not Per 1% times the amount, so it stays right near the Crit Rate cap.

## Consequences

- Pros: players can turn "2-3% more" or "a better roll" into damage themselves, and the Top roll's "3 in 100" ties the best case to how rare it is. Where the build disagrees with the weights, "Roll for" shows it. Unit tests check that a typical roll added through Custom Buffs moves damage exactly as much as the same roll on an equipped echo, and that Per 1% and Top roll match their own recalculations.
- Cons: about 20 calculations per build change (13 typical rolls, plus 2 for each stat that adds damage), about 1-6 ms each, debounced but on the main thread. A single-attack target ignores stats that only matter across a rotation; that matches what the Live Result Bar shows.

## Guidance

- Keep the measurement tied to the Live Result Bar's target and damage type; a different target would show numbers players can't check.
- If Custom Buffs ever stops stacking like echo substats, the equivalence test in `tests/calculator/substatRollValue.test.ts` fails. Fix the method, don't loosen the test.
- Keep one number per cell. Add detail to tooltips or the note under the table, not to the cells.
- A follow-up can show each tuned roll's damage against a typical roll in the Tune odds (ADR [0044](./0044-echo-tuning-odds.md)), reusing `createSubstatMeasurer`.

## Related

- `src/echoes/substatRollValue.ts`, `src/composables/useSubstatRollValues.ts`
- `src/components/CalculatorEchoInsightsPanel.vue`, `src/components/EchoInsightsSubstatTable.vue`, `src/components/EchoInsightsTryChange.vue`, `src/components/CalculatorEchoes.vue`
- `tests/calculator/substatRollValue.test.ts`, `cypress/e2e/calculator/echoInsights.cy.ts`
- ADR [0011](./0011-headless-character-calculation-context.md), [0014](./0014-echo-editor-redesign.md), [0030](./0030-echoes-tab-v3-redesign.md), [0044](./0044-echo-tuning-odds.md)
