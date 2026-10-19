# `src/echoes` — Echo definitions, stats, and sets

Echoes (equippable “monsters” with stats and set bonuses) are defined here, along with their stat tables and set effects. Used by the calculator, optimizer, and inventory/equip UI.

## Files

| File | Purpose |
|------|--------|
| **`index.ts`** | Echo metadata and helpers. **`mainEchoesData`**: map of echo key → `Echo` (key, name, class, image, details, modifiers, hasStacks, minStacks, maxStacks, alwaysEnabled, actions, sets). **`getEchoData(echoKey)`**, **`echoCostClassMap`**, **`getCostByClass(class)`**. |
| **`stats.ts`** | Echo stat math and types. **`statsTable`** / **`subStatsTable`**: main stat and substat values by rank/level. **`getEchoStats`**, **`getCombinedEchoStats`**: compute stats for one echo or a full loadout. **`EchoObject`**, **`echoSetLabelMap`**, **`getEchoSetLabelByType`**. Rank colors and sub-stat roll values live here too. |
| **`sets.ts`** | Set bonuses. **`getSetsFromEchoes`**, **`getSetBonusEffects`**: derive which sets are active from a list of echoes and return their bonus effects. **`twoSetBonuses`**, **`threeSetBonuses`**, **`fiveSetBonuses`**: display names for 2/3/5 set effects. Uses types/helpers from `stats.ts` (e.g. `EchoObject`, set labels). |
| **`mainEcho.ts`** | **`resolveMainEchoBuffStats(character, mainEchoConfig)`**: resolves a character's equipped main echo (the echo in slot 0) into its stat contribution. An echo with `alwaysEnabled: true` is force-enabled regardless of `mainEchoConfig.isEnabled`, mirroring `WeaponPassiveDef`/`EchoSetBonusPassive`. **`combineEchoStats`**: merges base echo stats + set bonus tiers + the main-echo buff into one `echoStats` object. |
| **`rating.ts`** | Substat quality grading (issue #451), built on `stats.ts`'s `subStatsTable`. **`getSubstatRollTier(stat, value)`**: 1-8 point tier for a rolled value. **`getEchoRatingGrade(echo, weights?)`**: the global Echo Rating (E-SSS, 5-40 pt scale). **`getSubstatScoreGrade(echo, characterWeights)`**: the per-character Substat Score (0-100%). **`resolveSubstatWeights(...sources)`**: layers curated/user weight overrides onto the neutral `DEFAULT_SUBSTAT_WEIGHTS`. See ADR [0012](./adr/0012-echo-substat-ratings.md). |
| **`levelingCost.ts`** | What leveling and tuning a 5★ echo costs (ADR [0044](./adr/0044-echo-tuning-odds.md)): **`ECHO_LEVEL_EXP`** (cumulative EXP, +0 to +25), **`tuneStepExp`**, **`echoResources`** (EXP + tuners → Shell Credits: 0.1 per EXP, 2,000 per tune), **`FULL_TUNE_RESOURCES`** (142,600 EXP · 50 tuners · 24,260 Shell Credits) and **`resourcesPerSuccess`** / **`fullTuneResourcesPerSuccess`** (expected cost per success, optionally feeding failed echoes back for 75% EXP and 30% tuners). Shown by `EchoResourceCostTable.vue`. |
| **`tuningOdds.ts`** | Exact echo tuning odds (ADR [0044](./adr/0044-echo-tuning-odds.md)). **`goalOdds(tuned, goal)`**: chance, expected tuners and EXP (plus their success-weighted parts) for an echo (revealed substats as `[type, value]` pairs, empty = fresh +0) to end up meeting a goal (`{ stat, min }[]`, `min: null` = any roll). Also **`rollChanceAtLeast`** / **`rollPercentile`**, **`wantedDrawOdds`** (which-substat odds only), **`goalLevers`**, **`goalLineBreakdown`** (per goal line: chance the substat is still drawn, then rolls high enough), **`finalLineGoal`** (the line this echo ends on, for the "N× closer" comparison), **`echoesForConfidence`** / **`chanceWithinEchoes`**, **`getUnfinishedEchoTag`** (Keep / Baseline / Fodder against a fresh echo) and **`TUNING_GOAL_PRESETS`**. Pure TS, used by the Odds dialog, the planner and the inventory's "Finish these first" filter. |
| **`scoreOdds.ts`** | Substat Score odds for a build's Odds dialog (ADR [0044](./adr/0044-echo-tuning-odds.md)), same substat model as `tuningOdds.ts`. **`finalPointsDistribution(tuned, weights)`** (exact distribution of the final weighted points, cached) and **`gradeReachChances`** (chance of finishing at each grade or higher, E to SSS); **`scoreTargetOdds(tuned, weights, target)`**: chance and expected EXP / tuners (plus success-weighted parts, like `goalOdds`) of reaching a grade, or any score above a finished echo's (`{ kind: "beat" }`), stopping as soon as it's reached or out of reach. A DP over (remaining substats grouped by weight and tier weights, points). Also **`defaultScoreTarget`** (the next grade up), **`betterEchoOdds`**, **`freshShareBelow`** and **`echoScorePoints`** / **`scorePercent`** / **`scoreGradeIndex`**, which match `getSubstatScoreGrade` in `rating.ts`. |
| **`substatRollRates.ts`** | Published per-tier roll weights for each substat, lined up with `subStatsTable`. **`getSubStatRollDistribution(stat)`** returns `{ value, chance }[]` normalized to 1. Update this file and `tests/echoes/tuningOdds.test.ts` together if the rates change. |
| **`parsedEchoMapping.ts`** | Shared mapping from OCR'd/parsed echo text to the inventory `EchoObject` shape (**`mapParsedEchoes`**, **`getSubstatType`**, **`getSubstatValue`**). Used by both the Discord-bot image importer (`CalculatorEchoParser.vue`/`CalculatorEchoImporter.vue`) and the screen/video scanner (`src/scanner/`, see [scanner.md](./scanner.md)) — one implementation, not a copy per flow. |

## Type definitions (highlights)

- **`Echo`** (in `index.ts`): key, name, class, image, details, modifiers (array of `EchoModifier`), optional hasStacks/minStacks/maxStacks, `alwaysEnabled` (true when the buff text states an unconditional "equipped in main/their main slot" bonus, e.g. Abyssal Patricius's 12% Glacio DMG Bonus — false/unset for a buff that needs a combat trigger), actions (array of `EchoAction`), sets (array of set keys).
- **`EchoModifier`**: modifier name, modifierValue, optional modifySpecificTalents, specificCharacters.
- **`EchoAction`**: key, label, talents, description, element, type, optional attribute/subType (for damage/utility actions).
- **`StatsTable`** / **`StatLevel`**: main stat values by cost/level and rank (e.g. ATK, HP, DEF, element%, CritRate, EnergyRegen).
- **`SubStatTable`**: substat roll values (CritRate, ATK, HP_FLAT, etc.).
- **`EchoObject`** (in `stats.ts`): shape used for “equipped echo” (echo id, type, rank, main stat, set, sub stats). Used by `getCombinedEchoStats` and set logic.

## How it’s used

- **Calculator**: Gets combined echo stats for the active character’s loadout via `getCombinedEchoStats`; passes them into `calculateAllStats` and damage context. Set bonuses are applied via `getSetBonusEffects` / `getSetsFromEchoes`. Echo set attacks and main-echo actions are used in rotations.
- **Optimizer**: Workers use `getCombinedEchoStats`, `getSetsFromEchoes`, and `getSetBonusEffects` to evaluate each loadout’s stats and damage.
- **Inventory / equip UI**: Echo list and equip state come from the inventory store; echo metadata (name, image, sets, class) from `getEchoData` and related exports.

## Adding or changing echoes

- **New echo**: Add an entry to **`mainEchoesData`** in `index.ts` with the same shape (key, name, class, image, details, modifiers, actions if any, sets). Ensure `sets` use keys that exist in `sets.ts`. If `details` states an unconditional "equipped in main/their main slot" bonus (no combat trigger), set `alwaysEnabled: true` so it's force-enabled everywhere (Results tab, build card) without the player needing to toggle it — see `resolveMainEchoBuffStats`.
- **New stat or set**: Extend **`statsTable`** / **`subStatsTable`** in `stats.ts` and the set bonus lists / logic in `sets.ts` as needed; keep `EchoObject` and calculator/worker usage in sync.
