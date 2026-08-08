# `src/components` — Vue components and data flow

All Vue components that power the app live here. The **Calculator** is the main orchestrator: it owns the calculation state, wires stores and character/echo/weapon data, and drives stats and damage updates.

## Calculator.vue — main orchestrator

**Location**: `src/components/Calculator.vue`

### Role

- **Single source of “current calculation” state**: character, weapon, echoes, team buffs, resonance chains, talents, enemy, custom buffs, rotations, optimizer results, and all derived stats and damages.
- **Orchestrates the pipeline**: When the user changes anything (character, level, weapon, echoes, buffs, talents, enemy, rotations), Calculator either:
  - Updates reactive state from the store or child events, then
  - Calls **`computeAllBuffsWithBreakdown()`** (which uses `calculateAllStats` from `calculator/stats.ts`) to get final stats and buff breakdowns, then
  - **`updateStats(finalStats)`** to push stats into refs, then
  - **`calcAllDamages()`** to build the calculation context and run `calcDamages` from `calculator/attacks.ts`, storing result in `allDamages`.
- **Passes data down**: Child components receive props (e.g. `character`, `totalAtk`, `allDamages`, `charBuffsData`, `teamBuffsData`, `rotationsList`) and emit events (e.g. `@update-weapon`, `@updated-team-buffs`, `@updated-rotations`). Calculator handles those events and re-runs the pipeline.

### Data flow (summary)

1. **Stores**  
   `useCharacterStore()` and `useInventoryStore()` (Pinia). Calculator uses `storeToRefs` for `characters`, `activeCharacter`, and reads/writes character data (weapon, echoes, buffs, rotations, optimizer settings, etc.). Inventory store is used for echo inventory and presets.

2. **Character selection**  
   When `character` (ref) changes, a `watch`:
   - Fetches full character data with `getCharByName(charName)`.
   - Sets `chosenChar`, weapon type, base stats, enemy defaults, and character element.
   - Calls `computeAllBuffsWithBreakdown()` → `updateStats()` → `calcAllDamages()`.

3. **Weapon / echoes / buffs / talents / enemy / rotations**  
   Handlers (e.g. `handleWeaponUpdated`, `updateStatsEchoes`, `handleUpdatedTeamBuffs`, `handleCharacterTalentUpdated`, `handleUpdatedEnemy`, `handleUpdatedRotations`) update the relevant refs/reactive objects, then call the same pipeline: `computeAllBuffsWithBreakdown()` → `updateStats()` → `calcAllDamages()` (and for rotations, also rebuild rotation list from store/talent data).

4. **Optimizer**  
   Optimizer runs in a web worker. Calculator passes context (stats, combos, target type, etc.) and receives results via `handleOptimize`; it then updates `optimizerResults` and related refs for the optimizer UI.

5. **Output**  
   **CalculatorStats** and **CalculatorDamages** receive the computed stats and `allDamages` and display them. **CalculatorBreakdown** (teleported to sidebar) shows detailed breakdown for a selected stat or attack.

### Key child components (by screen)

- **Character**: `CalculatorCharacterSelect`, `CalculatorTalents`, `CalculatorCharacterBuffs`
- **Weapon**: `CalculatorWeapons`
- **Echoes**: `CalculatorEchoes`
- **Resonance chains**: `CalculatorResonanceChains`
- **Party**: `CalculatorPartyBuffs`
- **Optimizer**: `CalculatorOptimizer`
- **Rotations**: `CalculatorRotations`
- **Custom buffs**: `CalculatorCustomBuffs`
- **Enemy**: `CalculatorEnemy`
- **Results**: `CalculatorStats`, `CalculatorDamages` (also rendered in a sticky results block)

Navigation between these screens is controlled by `curScreen` and sub-nav components (`CalculatorSubNav`, `CalculatorMobileSubNav`).

## How components are put together

- **Layout**: `Nav` wraps the calculator and provides desktop/mobile sub-nav; screens are toggled with `v-show="curScreen === '...'"`.
- **Data**: Top-down via props from Calculator; bottom-up via `emit` (e.g. `@update-weapon`, `@updated-team-buffs`). No global event bus; state is either in Pinia (persisted user data) or in Calculator’s refs/reactive (derived and ephemeral).
- **Styling**: DaisyUI + Tailwind. Components use semantic classes so themes (light/dark) work everywhere.

## TeamRotations.vue — multi-character team rotation page

**Location**: `src/components/TeamRotations.vue` (routed at `/teams`, wrapped by `src/pages/TeamRotationsView.vue`)

Unlike Calculator.vue, this page does **not** own a single character's reactive calculation state. Each team references up to 3 already-configured characters by id (from the `character` store's `characters` map) and computes each one's stats/damage independently via `buildCharacterCalculationContext` (`src/calculator/buildCharacterContext.ts`) — see ADR [0011](./adr/0011-headless-character-calculation-context.md).

- **`TeamRotations.vue`** — lists teams from the `teamRotations` store, create/delete, selects one to edit.
- **`TeamRotationTeamEditor.vue`** — per-team editor: 3 character-picker slots (restricted to configured characters) with a grid/icon stat snippet (HP/DEF/ATK/Crit Rate/Crit DMG/Energy Regen) and a "Configure Character" button that sets that character active and navigates to `/` (the existing Calculator page — configuring a character's build always happens there, never on this page); a Basic/Advanced mode toggle (`team.mode`); shared enemy config; team name + rotation duration; the actions list; and the results panel with a click-to-breakdown drawer (mirrors `HomeView.vue`'s drawer, rendering `CalculatorBreakdown`'s attack-only branch). Rebuilds each slot's calculation context and the team's damage/DPS fresh on every relevant change (no caching).
- **`TeamRotationActionEditor.vue`** — thin wrapper around the existing single-character `CalculatorRotationAction.vue` (reused as-is, since it's already parameterized by `character`/`character-data` props) that adds a "which of the 3 teammates" slot selector. In Advanced mode, also renders a "Configure Buffs" toggle exposing `TeamRotationAdvancedBuffs.vue` for that action, plus "Copy previous action settings" (copies the immediately-preceding same-slot action's `advancedConfig`).
- **`TeamRotationAdvancedBuffs.vue`** / **`TeamRotationAdvancedBuffRow.vue`** — Advanced mode's per-action buff editor. Lists every self buff/weapon passive/echo set passive/main echo buff/team buff/resonance chain available for that action's character (from `buildCharacterCalculationContext`'s `definitions` catalog) as an independently toggleable (+ stacks where applicable) checkbox row, writing to `action.advancedConfig`.
- **`TeamRotationDamages.vue`** — total damage + DPS summary, modeled on `CalculatorDamages.vue`'s rotation summary card and using the shared `calcRotationDps` helper; forwards `CalculatorDamage`'s `selected-attack` event up to the team editor's breakdown drawer.

## Where to look when changing behavior

- **Stats or damage wrong**: `calculator/stats.ts`, `calculator/calculator.ts`, `calculator/attacks.ts`, and the handlers in `Calculator.vue` that call `computeAllBuffsWithBreakdown` and `calcAllDamages`.
- **UI not updating**: Check that the relevant ref/reactive is updated in a handler and passed as a prop to the child; ensure the child uses that prop (or store) in template/computed.
- **New screen or step**: Add a new screen ref and sub-nav entry, add a handler that updates state and runs the same pipeline if it affects stats/damage, and pass the needed props into the new component.
