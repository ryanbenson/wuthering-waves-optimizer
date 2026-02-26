# `src/stores` — Pinia stores (user data only)

Pinia stores hold **user input and user state only**. They are the only place that should persist the user’s choices (character, weapon, echoes, buffs, rotations, etc.). Config, feature flags, and constants belong in code, not in stores.

## Principles

1. **User data only**  
   Stores hold what the user selected or entered: active character, per-character weapon/echoes/buffs/rotations/optimizer settings, inventory echoes, presets, and app-level preferences that are clearly “user settings” (e.g. theme). No app config or env.

2. **Auto-sync to storage**  
   Stores are persisted (e.g. to localStorage) so the user’s setup survives reloads. The persistence layer is configured at app init (e.g. via a Pinia plugin). Do not put non-user data in the same persisted state.

3. **Patch-friendly**  
   If a bug or misconfiguration is in code (e.g. wrong default or validation), we want to fix it with a code patch without migrating or editing the user’s saved data. Therefore:
   - Avoid storing derived or redundant config that could go stale.
   - When reading, tolerate missing or legacy keys (default in code) rather than assuming a specific stored shape forever.

## Stores

| Store | File | Purpose |
|-------|------|--------|
| **character** | `character.js` | **`characters`**: object keyed by character id; each value holds that character’s stored data (weapon, echoes, buffs, resonance chains, rotations, talents, characterLevel, enemy settings, optimizer min stats, etc.). **`activeCharacter`**: current character id. Actions: `setActiveCharacter`, `setCharacterData`, `setCharacterEchoes`, `setCharacterRotations`, `setCharacterOptimizerMinStats`, `hardSetState`, etc. |
| **inventory** | `inventory.js` | **`echoes`**: user’s echo inventory. **`equipped`**: which echoes are equipped to which character/slot. **`echoPresets`**, **`equippedPresets`**: preset loadouts and which character uses which preset. Getters: `duplicateEchoIds`, `getEquippedEchoData`, `echoById`, etc. |
| **settings** | `settings.js` | App-level user preferences (e.g. theme, UI toggles). Only user-facing settings; no internal config. |

## Usage from components

- **Calculator** and others use `useCharacterStore()` and `useInventoryStore()` with `storeToRefs()` so the UI reacts to store changes. They call actions to update after user actions (e.g. `setCharacterData`, `setCharacterEchoes`).
- **No config in store**: Things like “list of characters,” “echo stat tables,” or “damage formula constants” are read from `src/characters`, `src/echoes`, `src/calculator`, etc., not from store state. The store only remembers the user’s choices so they can be restored after reload.
