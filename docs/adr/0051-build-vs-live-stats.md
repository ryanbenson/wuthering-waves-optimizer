---
status: accepted
date: 2026-11-02
tags: [calculator, components]
---

# 51. v3 stats show build vs live (buffs)

## Context

The v3 action bar and Full breakdown only showed live stats: the character's own build plus every toggled buff, which is what damage uses. The build card shows the opposite, the build alone (issue #383). Players wanted both at once: "my build gives 2,000 ATK, buffs add 1,500, so I'm at 3,500", without crowding the panel. Three directions were mocked up (an inline "+1,500", a two-tone bar, and a Build/Live/Both toggle); the bar plus a split stat detail was chosen.

## Decision

- **"Build" means exactly the build card's numbers.** Both now go through `computeBuildOnlyStats` (`src/calculator/buildOnlyStats.ts`, `alwaysEnabledOnly`). So "Stat Bonus" self-buffs and `isPermanent` resonance chain nodes count as build; every other self-buff and node, team buffs, custom buffs, and conditional weapon/set/main-echo effects count as buffs.
- **"Buffs" is always live − build.** The header numbers come straight from the two final stat results, so they can never disagree with damage or the build card.
- **Per-source rows are derived, not re-implemented.** `statSplit.ts` runs the engine's own `calcCharStats` once per source and subtracts an empty baseline, rather than copying the classic breakdown's per-source unit handling. Whatever the rows can't explain is shown as an "Other" row, never hidden.
- **Displayed numbers add up.** The bar text and stat detail header compute "+buffs" from the displayed (floored/rounded) build and live values, so "2,000 + 1,500 = 3,500" never reads as "2,000 + 1,499".
- **The display:** a 3px grey/accent bar under each action bar chip and Overview row, "build +buffs" text on buffed rows, and a v3-only stat detail ("Your build + Buffs = Live", "From your build" / "From buffs", formula). The action bar stays on live values, since it sits next to the damage number.
- **v3 only.** Classic, the build card and Team Rotations' breakdown are unchanged; when no split is available the classic stat breakdown renders.

## Consequences

- Pros: one definition of "build" for the card and the calculator; the split can't drift from the real math; no store change, no migration; the optimizer and workers are untouched.
- Cons: one extra build-only context per build change on the main thread (not per buff toggle). The stat detail's rows for HP/ATK/DEF are percent-bucket shares, not shares of the absolute difference, because ATK% multiplies base ATK.
- The classic `CalculatorStatsBreakdown` still has its own per-source extraction; moving it onto `statSplit.ts` is a possible follow-up.

## Guidance

- Change what counts as "build" only in `buildCharacterCalculationContext`'s `alwaysEnabledOnly` path, never in the display.
- When adding a stat-pipeline step outside `calcCharStats` (like `applyCharacterStatEdgeCases`), expect an "Other" row for it; the all-characters sweep in `tests/calculator/statSplit.test.ts` will list it.
- Don't show build values next to damage; damage only ever uses live stats.

## Related

- `src/calculator/statSplit.ts`, `src/calculator/buildOnlyStats.ts`, `src/components/CalculatorStatsBreakdownV3.vue`, `src/components/CalculatorLiveResultStatRow.vue`, `src/components/CalculatorCommandBar.vue`
- `docs/src-calculator.md`, `docs/src-components.md`
- ADR [0011](./0011-headless-character-calculation-context.md) (headless context), ADR [0019](./0019-command-bar-merged-live-result-bar-and-identity.md) (command bar)
