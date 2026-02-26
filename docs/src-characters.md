# `src/characters` — Character definitions

All playable characters and their data (stats, attacks, buffs, resonance chains, rotations) are defined here. This is the source of truth for character-specific behavior in the calculator and UI.

## Layout

- **`characters.ts`** (root):
  - **`getCharactersAvailable()`**: Returns the list of characters by rarity (e.g. `five`, `four`) for selectors.
  - **`allCharactersList`**: Flat list with `key`, `name`, `element`, `rarity`, `weapon`.
  - **`getCharByName(name)`**: Loads and returns the full character module for a given key (dynamic import of that character’s `index`).
  - **`getAttackData`**, **`getOriginalForteFromAttackKey`**: Helpers used by calculator/attacks.
- **Per-character folder** (e.g. `Verina/`, `Calcharo/`):
  - **`index.ts`**: Exports `getData()` that aggregates all modules below.
  - **`character.ts`**: Base stats by level (`CharacterData` / `LevelData`: hp, attack, defense per level string like `"90"`, `"80+"`). Exposes `getCharacterStatsByLevel(level)`.
  - **`basic.ts`**: Basic info (name, element, weapon, etc.) via `getCharacterBasicInfo()`.
  - **`basicAttacks.ts`**, **`skillAttacks.ts`**, **`liberationAttacks.ts`**, **`forteCircuitAttacks.ts`**, **`introAttacks.ts`**, **`outroAttacks.ts`**, **`tuneBreakAttacks.ts`**: Attack definitions for each category; structure is consistent (e.g. `attacks` array with keys, multipliers, damage type).
  - **`buffs.ts`**: Character’s own buffs (self-buffs, e.g. from skills or passives).
  - **`resonanceChains.ts`**: Resonance chain effects and their modifiers.
  - **`presets.ts`**: Rotation presets (`rotations`) for the character.

## Type definitions (highlights)

- **`CharacterData`** / **`LevelData`** (in `character.ts`):  
  `LevelData`: `{ hp, attack, defense }`. `CharacterData`: map of level string → `LevelData`. Used for base stats at a given level.
- **`CharacterList`** / **`CharacterListItem`** (in `characters.ts`):  
  List of characters by rating; each item has `key` and `name`.
- Attack and buff structures are consistent across characters; exact types are defined in the respective files (e.g. attack objects with `key`, damage type, multipliers). The codebase is gradually adding explicit interfaces for these.

## Adding a new character

1. Create a folder under `src/characters/<Name>/` (key format matches `getCharactersAvailable`).
2. Add `character.ts` (base stats by level), `basic.ts`, and all required `*Attacks.ts` and `buffs.ts`, `resonanceChains.ts`, `presets.ts` as needed.
3. Export everything via `index.ts` using `getData()`.
4. Register the character in `characters.ts`: add to `getCharactersAvailable()` and `allCharactersList` with correct `element` and `weapon`.

## Usage

- **Calculator**: Loads a character with `getCharByName(characterKey)` to get base stats, attacks, buffs, resonance chains, and rotations, then feeds them into stats and damage calculation.
- **Components**: Character selectors use `getCharactersAvailable()`; the rest of the UI gets data from the store and the loaded character object.
