# `src/buffs` — Team buffs

This folder defines **team buffs**: modifiers that come from other characters (e.g. outro skills, sequence nodes) and affect the active character’s damage or stats.

## What lives here

- **`index.ts`**: Main export. Contains:
  - **`buffsByCharacter`**: A map of character key → array of buff definitions. Each buff has:
    - `key`, `name`, `details` (description HTML)
    - `hasStacks`, `minStacks`, `maxStacks`
    - `modifiers`: array of `{ modifier, modifierValue }` (e.g. `ATK`, `DMGDeepen:Basic`, `Glacio`)
    - `alwaysEnabled` (optional)
  - **`allEchoBuffs`**: Buffs provided by echoes (used in calculator/orchestrator).
  - **`utilityAttacks`**: Utility attack definitions used in rotations (e.g. placeholder or non-damage actions).

## How it’s used

- **Calculator / stats**: When computing final stats and damage, the app:
  - Reads the **active character’s** chosen team buffs from the store (user selection).
  - Resolves buff definitions from `buffsByCharacter` (and echo/utility from `allEchoBuffs` / `utilityAttacks`).
  - Applies modifier values (ATK%, DMG deepen, element%, etc.) in the calculator’s buff pipeline (`src/calculator/stats.ts`).
- **Components**: `CalculatorPartyBuffs` (and related) use `buffsByCharacter` to show which buffs each teammate can provide and let the user enable/configure them.

## Adding or changing buffs

- Add or edit entries in `buffsByCharacter[characterKey]` with the same shape (key, name, details, modifiers, stacks if needed).
- Modifier names must align with what `src/calculator/stats.ts` expects (e.g. `ATK`, `Glacio`, `DMGDeepen`, `DMGDeepen:Basic`). Check that file when adding new modifier types.
