# `src/utils` — Generic helpers

Shared utilities used across the app. No business logic (no character/echo/weapon rules); only generic processing and formatting.

## Files

| File | Purpose |
|------|--------|
| **`numbers.ts`** | Number formatting and rounding. **`displayPercentage(number, decimalPlaces?)`**: format as a percentage string (e.g. for stats UI). **`displayInt(number)`**: integer formatting for display. **`displayDamage(number)`**: `Math.ceil` for damage values. Uses `Intl.NumberFormat` with project conventions (e.g. floor rounding for integers). |
| **`strings.ts`** | String helpers (e.g. **`randomString()`** used for generating unique ids for rotations, actions, etc.). Other generic string helpers can live here. |

## Conventions

- **Pure and side-effect free** where possible: same inputs → same outputs; no Vue, no stores, no DOM.
- **Reusable**: If a piece of logic is “just formatting” or “just a string/number helper,” it belongs here instead of inside a component or calculator. This keeps components and calculator code focused and testable.
