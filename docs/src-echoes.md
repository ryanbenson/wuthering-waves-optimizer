# `src/echoes` — Echo definitions, stats, and sets

Echoes (equippable “monsters” with stats and set bonuses) are defined here, along with their stat tables and set effects. Used by the calculator, optimizer, and inventory/equip UI.

## Files

| File | Purpose |
|------|--------|
| **`index.ts`** | Echo metadata and helpers. **`mainEchoesData`**: map of echo key → `Echo` (key, name, class, image, details, modifiers, hasStacks, minStacks, maxStacks, actions, sets). **`getEchoData(echoKey)`**, **`echoCostClassMap`**, **`getCostByClass(class)`**. |
| **`stats.ts`** | Echo stat math and types. **`statsTable`** / **`subStatsTable`**: main stat and substat values by rank/level. **`getEchoStats`**, **`getCombinedEchoStats`**: compute stats for one echo or a full loadout. **`EchoObject`**, **`echoSetLabelMap`**, **`getEchoSetLabelByType`**. Rank colors and sub-stat roll values live here too. |
| **`sets.ts`** | Set bonuses. **`getSetsFromEchoes`**, **`getSetBonusEffects`**: derive which sets are active from a list of echoes and return their bonus effects. **`twoSetBonuses`**, **`threeSetBonuses`**, **`fiveSetBonuses`**: display names for 2/3/5 set effects. Uses types/helpers from `stats.ts` (e.g. `EchoObject`, set labels). |

## Type definitions (highlights)

- **`Echo`** (in `index.ts`): key, name, class, image, details, modifiers (array of `EchoModifier`), optional hasStacks/minStacks/maxStacks, actions (array of `EchoAction`), sets (array of set keys).
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

- **New echo**: Add an entry to **`mainEchoesData`** in `index.ts` with the same shape (key, name, class, image, details, modifiers, actions if any, sets). Ensure `sets` use keys that exist in `sets.ts`.
- **New stat or set**: Extend **`statsTable`** / **`subStatsTable`** in `stats.ts` and the set bonus lists / logic in `sets.ts` as needed; keep `EchoObject` and calculator/worker usage in sync.
