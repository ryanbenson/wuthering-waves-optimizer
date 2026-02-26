# `src/weapons` — Weapon definitions

All weapons are defined here, grouped by weapon type. Each weapon has static data (name, rarity, base stats, passives) used by the calculator and weapon-selector UI.

## Layout

- **`weapons.ts`** (root): Aggregates lists by type and rarity (e.g. **`swordsList`**, **`broadbladesList`**, **`rectifiersList`**, **`pistolsList`**, **`gauntletsList`**). Each list is an object with keys like `five`, `four`, `three`, `two`, `one` (rarity), and values are arrays of `{ key, name }`. Also exports or references the full weapon data so the app can resolve a weapon by `key`.
- **Per-type folders** (e.g. **`Swords/`**, **`Broadblades/`**, **`Rectifiers/`**, **`Pistols/`**, **`Gauntlets/`**): One file per weapon, e.g. **`UnflickeringValor.ts`**, **`TrainingSword.ts`**. Each file exports that weapon’s data: name, rarity, base attack (often by level), and passive effects (stats or modifiers). The exact shape is consistent within the codebase so the calculator can read `attack`, `modifier`, `modifierValue`, and any `weaponPassiveStats`-style fields.

## How it’s used

- **Calculator**: When the user selects a weapon, the component loads the weapon module (by key) and passes weapon data (e.g. base attack, passive stats) into the character store and into the stats pipeline. **`weaponData`** in Calculator holds the current weapon’s resolved data; **`weaponAtk`** is the base attack used in stat and damage formulas.
- **Components**: Weapon selector uses the lists from `weapons.ts` to show options by type; selected weapon key is stored in the character store and resolved to full data when building the calculation context.

## Adding a new weapon

1. Add a new file under the correct type folder (e.g. `Swords/NewWeapon.ts`) with the same export shape as existing weapons (name, attack, passives, etc.).
2. Register it in **`weapons.ts`** in the appropriate rarity list for that type (e.g. `swordsList.five.push({ key: "NewWeapon", name: "New Weapon" })` or the equivalent structure used in the file).
