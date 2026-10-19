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
- **Costs are EXP, tuners and Shell Credits, priced from the game's 5★ numbers** (`src/echoes/levelingCost.ts`): the cumulative EXP table to +25 (142,600), 10 tuners per tune whatever the rarity, 0.1 Shell Credit per EXP and 2,000 per tune. A goal's cost assumes stopping as soon as it's met or can't be: a goal substat rolled too low, or too few slots are left. `goalOdds` also returns the success-weighted cost, so "per success" can credit feeding each failed echo into the next: 75% of its EXP and 30% of its tuners come back, Shell Credits don't. Refund rounding (whole tubes) is ignored. A build's grade target is costed the same way (`scoreTargetOdds`): each echo stops once it reaches the grade or can't.
- **Keep or fodder:** an unfinished echo is tagged Keep when its chance is at least a fresh +0 echo's chance for the same goal, Baseline when it has no substats yet, and Fodder otherwise. The inventory ranks by chance (ties: Keep, Baseline, Fodder) and draws a "Fresh echo" divider before the first echo that isn't a Keep.
- **"N× closer" compares the final line, not just the goal.** The Odds dialog's "Keep tuning" note sets this echo's chance against a fresh echo landing the same final line: every revealed roll as a minimum, plus the goal (`finalLineGoal`). That's the design's question ("how much of the work is already done?"). Whether to keep tuning still compares goal chances, this echo against a fresh one.
- **In a build, the character's Substat Score is the only yardstick; goals are for the inventory and the planner.** The build's substat weights already say what a good echo is for that character, so the build's Odds has no goal to pick (`src/echoes/scoreOdds.ts`, `EchoScoreOdds.vue`). An earlier version asked about a goal (double crit, custom, or "<Character>'s top 3") on unfinished echoes and about the Substat Score on finished ones. The two could disagree about the same echo, and a goal on top of the weights was redundant.
- **"Better" is a grade, by default the next one up.** "A 7.8% chance of a better echo" left players asking: better how, and by how much? So the build's Odds reads in the Substat Score's grades (E to SSS, the badge already on each tile). A finished echo shows the share of fresh echoes it beats, and "better" defaults to the next grade up from its own; beating it by a single point isn't worth the resources. "Any higher score" stays as a choice, and is the default at SSS. An unfinished echo shows, per grade, its chance of finishing there or higher against a fresh echo's, with the next grade up from where it most likely lands (the lowest it reaches less than half the time) as the default target, and keep / fresh-better advice for that target. The copy says what the score is: a weighted total against the character's ideal echo, so better means a higher total, not every stat higher. Substats only; main stat and set aren't modelled.
- **Grade odds are exact.** The final points distribution is a DP over (substats picked, weighted points), using the same argument that every 5-substat set is equally likely (`finalPointsDistribution`). The cost needs the order, since an echo stops once the grade is reached or out of reach, so `scoreTargetOdds` runs a second DP over (remaining substats, points). Substats with the same weight and tier weights, and all weight-0 substats, are grouped, which keeps a fresh echo's solve to tens of milliseconds. Grades use `getSubstatScoreGrade`'s own percent and bands, so the dialog and the tile badge never disagree.
- **No character in the inventory.** A Substat Score belongs to a build, not an echo (the same echo suits different characters differently), so the inventory offers Odds on unfinished echoes only, goal-based, and leaves finished echoes to the calculator. An earlier version scored inventory echoes with the last selected character, but that was hidden context, which is the reason the inventory doesn't show Substat Scores either.
- **The goal is session state, not persisted.** `useTuningGoal` holds one goal module-wide, so the inventory view and the Odds dialog share it. The planner (`/info/tuning-odds`) keeps its goal in the URL (`?goal=CritRate:8.1,CritDMG:any`), decoded defensively by `src/utils/tuningGoalQuery.ts`. No store shape changes, so no migration.
- **Surfaces:** a small "Odds" button opens `EchoOddsDialog.vue`, which shows `EchoTuneOddsTab.vue` (and, in a build, `EchoScoreOdds.vue`). The button sits on each calculator echo tile (collapsed and expanded, `CalculatorEchoTile.vue`), each inventory tile, and the inventory edit panel's header. A full tab in the echo editor was tried first and was too heavy for a secondary readout. The planner lives under Info (`InfoTuningOdds.vue`), and a "Finish these first" diagnostics filter in `InventoryEchoesBrowser.vue` (`useUnfinishedEchoRanking`); clicking an echo's tag there opens its Odds.

## Consequences

- Pros: every goal number on the three surfaces comes from one tested function, and every grade number from another. Closed-form checks and seeded Monte Carlo runs pin both (`tests/echoes/tuningOdds.test.ts`, `tests/echoes/scoreOdds.test.ts`).
- Cons: grade odds depend on the character's weights; editing them moves every number. Grades are coarse (12.5% bands against the ideal echo), and for most weight profiles a fresh echo rarely finishes above B, so the top grades read as fractions of a percent.
- Cons: the model trusts the published rates and a flat tuner cost. If either changes, the numbers silently go stale. An echo with substats the player hasn't entered yet is indistinguishable from an untuned one.
- The classic (flag-off) echo editor has no Odds button.

## Guidance

- **Do** use `goalOdds` (goals) or `scoreOdds.ts` (Substat Score grades) for any tuning probability. Don't re-derive one inline or simulate it in the app.
- **Don't** add goals back to a build's Odds, or character weights to the inventory's; see the yardstick decision above.
- **Do** update `substatRollRates.ts` and its tests together if the developer publishes new rates. Cite only the developer's own announcement, never a datamine site.
- **Don't** persist the goal without a settings-store field, a migration and a reason from usage data.
- **Do** add a real per-echo tune level (store field + migration) before building anything that must tell "untuned" from "not entered".

## Related

- `src/echoes/tuningOdds.ts`, `src/echoes/scoreOdds.ts`, `src/echoes/levelingCost.ts`, `src/echoes/substatRollRates.ts`, `src/utils/tuningGoalQuery.ts`
- `src/composables/useTuningGoal.ts`, `src/composables/useEchoTuneOdds.ts`, `src/composables/useEchoScoreOdds.ts`, `src/composables/useUnfinishedEchoRanking.ts`
- `src/components/EchoTuneOddsTab.vue`, `src/components/EchoScoreOdds.vue`, `src/components/EchoOddsDialog.vue`, `src/components/InventoryEchoTile.vue`, `src/components/EchoEditHeader.vue`, `src/components/TuningGoalEditor.vue`, `src/components/info/InfoTuningOdds.vue`, `src/components/CalculatorEchoTile.vue`, `src/components/CalculatorEchoEditPanel.vue`, `src/components/InventoryEchoesBrowser.vue`
- `tests/echoes/tuningOdds.test.ts`, `tests/echoes/scoreOdds.test.ts`, `tests/echoes/levelingCost.test.ts`, `tests/utils/tuningGoalQuery.test.ts`, `tests/composables/useUnfinishedEchoRanking.test.ts`, `tests/components/CalculatorEchoTile.test.ts`, `cypress/e2e/calculator/tuningOdds.cy.ts`, `cypress/e2e/inventory/tuningOdds.cy.ts`
- ADR 0012 (substat ratings), ADR 0014 (echo editor panel), ADR 0024 (Info nested routes), ADR 0030 (inline echo editing in the calculator)
