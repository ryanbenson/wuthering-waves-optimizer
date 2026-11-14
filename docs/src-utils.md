# `src/utils` — Generic helpers

Shared utilities used across the app. No business logic (no character/echo/weapon rules); only generic processing and formatting.

## Files

| File | Purpose |
|------|--------|
| **`numbers.ts`** | Number formatting and rounding. **`displayPercentage(number, decimalPlaces?)`**: format as a percentage string (e.g. for stats UI). **`displayInt(number)`**: integer formatting for display. **`displayDamage(number)`**: `Math.ceil` for damage values. Uses `Intl.NumberFormat` with project conventions (e.g. floor rounding for integers). |
| **`signedDelta.ts`** | Signed differences ("+1.2%", "−340", "0.0%") whose sign and color come from the value **rounded to what's shown**, never the raw one, so a change that rounds to zero shows no sign and is neutral, never a green "+0.0%" or red "-0.0%" (issue #703). Rounds half away from zero with a tiny floating-point nudge (0.05 → 0.1). **`signedPercent(value, { decimals, minus })`** and **`signedInt(value, { minus })`** return `{ text, tone }` (`positive` / `negative` / `neutral`); **`signedImpact(delta, fraction)`** is the echo/weapon impact badge's "+1,234 · +2.1%". **`deltaToneTextClass`** (`text-success` / `text-error` / `opacity-60`) and **`deltaToneBadgeClass`** (`badge-success` / `badge-error` / `badge-ghost`) map tones to classes. Use these for any new signed number. `minus` keeps each screen's existing minus character ("-" in the optimizer, "−" in the newer v3 stat displays). In templates, `components/AppDeltaPercent.vue` renders a colored percent delta (`parens` for the classic "(+1.2%)"). |
| **`tuningGoalQuery.ts`** | The tuning planner's URL goal (`?goal=CritRate:8.1,CritDMG:any`). **`encodeTuningGoalQuery(goal)`** / **`decodeTuningGoalQuery(raw)`**; decoding drops unknown substats, values that aren't real roll tiers and duplicates, and caps the goal at 5 lines. |
| **`strings.ts`** | String helpers (e.g. **`randomString()`** used for generating unique ids for rotations, actions, etc.). Other generic string helpers can live here. |
| **`rotationDurationRange.ts`** | Pure range logic behind every rotation "Duration" control (`RotationDurationPanel.vue`): **`getDurationPool(rangeActions, actionId)`** (this action plus every later one, with "This action"/"+N" labels) and **`resolveDurationTargetIds(pool, mode, count, untilActionId)`** ("# actions" clamps to the pool; "until action" is inclusive). Also owns the `DurationRangeAction` type. |

## Conventions

- **Pure and side-effect free** where possible: same inputs → same outputs; no Vue, no stores, no DOM.
- **Reusable**: If a piece of logic is “just formatting” or “just a string/number helper,” it belongs here instead of inside a component or calculator. This keeps components and calculator code focused and testable.
