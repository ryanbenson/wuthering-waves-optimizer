---
status: accepted
date: 2026-10-17
tags: [echoes, components, composables]
---

# 44. Echo tuning odds: one exact engine for the Odds dialog, the planner and "Finish these first"

## Context

Players tune echoes substat by substat (+5 … +25) and keep asking two questions: is this half-tuned echo worth finishing, and how many echoes or tuners does a goal like "double crit" cost? Echo Rating and Substat Score (ADR 0012) grade the substats an echo already has. They say nothing about the slots still to come.

A design review (a Claude Design canvas, "Echo Tuning Odds", not checked in) settled three surfaces: a Tune odds tab in the echo panel, a standalone planner, and an inventory view that ranks unfinished echoes against a fresh one.

## Decision

- **One pure engine, `src/echoes/tuningOdds.ts`**, next to `rating.ts`, with no Vue. It solves the chance of meeting a goal exactly, not by simulation. A goal is a list of `{ stat, min }` lines, and `min: null` means any roll.
- **Model:** an echo reveals 5 of the 13 substats, one per tune, never the same one twice. Each unrevealed substat is equally likely on each tune, and its value follows that substat's tier weights. The recursion runs over (tunes done, goal lines met), at most 6 × 32 states, so it runs on the main thread with no worker.
- **Rates live in `src/echoes/substatRollRates.ts`.** They line up index for index with `subStatsTable` in `stats.ts`, which stays the only source of roll values. The published weights are rounded, so each row is normalized by its own total.
- **Tune level comes from the number of filled substat slots.** The inventory stores no level field. An echo whose substats were never typed in looks untuned, so "Finish these first" includes it as a baseline echo.
- **Expected tuners** assume a flat `TUNERS_PER_TUNE = 10` and stopping as soon as the goal can't be met: a goal substat rolled too low, or too few slots are left.
- **Keep or fodder:** an unfinished echo is tagged Keep when its chance is at least a fresh +0 echo's chance for the same goal, Baseline when it has no substats yet, and Fodder otherwise. The inventory ranks by chance (ties: Keep, Baseline, Fodder) and draws a "Fresh echo" divider before the first echo that isn't a Keep.
- **"N× closer" compares the final line, not just the goal.** The Odds dialog's "Keep tuning" note sets this echo's chance against a fresh echo landing the same final line: every revealed roll as a minimum, plus the goal (`finalLineGoal`). That's the design's question ("how much of the work is already done?"). Whether to keep tuning still compares goal chances, this echo against a fresh one.
- **A finished echo gets "better echo" odds instead of a goal.** Once all 5 substats are in, nothing about the echo can change, so the calculator asks: how likely is a fresh +0 echo, tuned to +25, to beat this echo's Substat Score for this character (`betterEchoOdds`)? The inventory has no build, so it scores with the last selected character. Every 5-substat set is equally likely, so a DP over (substats picked, weighted points) is exact and cheap (`freshEchoPointsDistribution`, cached per weight profile). Substats only; main stat and set aren't modelled.
- **A character's goal comes from its substat weights:** its top 3 weighted substats at any roll (`getWeightsGoal`), offered as a goal preset next to the built-in ones. The neutral all-equal profile offers none.
- **The goal is session state, not persisted.** `useTuningGoal` holds one goal module-wide, so the inventory view and the Odds dialog share it. The planner (`/info/tuning-odds`) keeps its goal in the URL (`?goal=CritRate:8.1,CritDMG:any`), decoded defensively by `src/utils/tuningGoalQuery.ts`. No store shape changes, so no migration.
- **Surfaces:** a small "Odds" button opens `EchoOddsDialog.vue`, which shows `EchoTuneOddsTab.vue`. The button sits on each calculator echo tile (collapsed and expanded, `CalculatorEchoTile.vue`), each inventory tile, and the inventory edit panel's header. A full tab in the echo editor was tried first and was too heavy for a secondary readout. The planner lives under Info (`InfoTuningOdds.vue`), and a "Finish these first" diagnostics filter in `InventoryEchoesBrowser.vue` (`useUnfinishedEchoRanking`); clicking an echo's tag there opens its Odds.

## Consequences

- Pros: every number on the three surfaces comes from one tested function. Closed-form checks and a seeded Monte Carlo pin it (`tests/echoes/tuningOdds.test.ts`).
- Cons: the model trusts the published rates and a flat tuner cost. If either changes, the numbers silently go stale. An echo with substats the player hasn't entered yet is indistinguishable from an untuned one.
- The classic (flag-off) echo editor has no Odds button.

## Guidance

- **Do** use `goalOdds` and friends for any tuning probability. Don't re-derive one inline or simulate it in the app.
- **Do** update `substatRollRates.ts` and its tests together if the developer publishes new rates. Cite only the developer's own announcement, never a datamine site.
- **Don't** persist the goal without a settings-store field, a migration and a reason from usage data.
- **Do** add a real per-echo tune level (store field + migration) before building anything that must tell "untuned" from "not entered".

## Related

- `src/echoes/tuningOdds.ts`, `src/echoes/substatRollRates.ts`, `src/utils/tuningGoalQuery.ts`
- `src/composables/useTuningGoal.ts`, `src/composables/useEchoTuneOdds.ts`, `src/composables/useUnfinishedEchoRanking.ts`, `src/composables/useCharacterTuningPreset.ts`
- `src/components/EchoTuneOddsTab.vue`, `src/components/EchoOddsDialog.vue`, `src/components/InventoryEchoTile.vue`, `src/components/EchoEditHeader.vue`, `src/components/TuningGoalEditor.vue`, `src/components/info/InfoTuningOdds.vue`, `src/components/CalculatorEchoTile.vue`, `src/components/CalculatorEchoEditPanel.vue`, `src/components/InventoryEchoesBrowser.vue`
- `tests/echoes/tuningOdds.test.ts`, `tests/utils/tuningGoalQuery.test.ts`, `tests/composables/useUnfinishedEchoRanking.test.ts`, `tests/components/CalculatorEchoTile.test.ts`, `cypress/e2e/calculator/tuningOdds.cy.ts`, `cypress/e2e/inventory/tuningOdds.cy.ts`
- ADR 0012 (substat ratings), ADR 0014 (echo editor panel), ADR 0024 (Info nested routes), ADR 0030 (inline echo editing in the calculator)
