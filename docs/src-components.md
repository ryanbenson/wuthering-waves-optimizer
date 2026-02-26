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

## Where to look when changing behavior

- **Stats or damage wrong**: `calculator/stats.ts`, `calculator/calculator.ts`, `calculator/attacks.ts`, and the handlers in `Calculator.vue` that call `computeAllBuffsWithBreakdown` and `calcAllDamages`.
- **UI not updating**: Check that the relevant ref/reactive is updated in a handler and passed as a prop to the child; ensure the child uses that prop (or store) in template/computed.
- **New screen or step**: Add a new screen ref and sub-nav entry, add a handler that updates state and runs the same pipeline if it affects stats/damage, and pass the needed props into the new component.
