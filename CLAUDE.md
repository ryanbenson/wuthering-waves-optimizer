# CLAUDE.md — Wuthering Waves Optimizer

Client-side Vue 3 app that calculates resonator stats/damage and optimizes echo loadouts for *Wuthering Waves*. Live at the GitHub Pages / Vercel deploy; all game math runs in the browser.

## Priorities (non-negotiable order)

1. **Calculation accuracy** — wrong numbers are worse than a slow UI
2. **Performance** — every user change can trigger many recalcs; keep hot paths tight; use workers for heavy work
3. **Correctness of persisted user data** — never break or silently corrupt localStorage builds
4. **Incremental change** — small PRs, gradual typing/refactors; no big rewrites without need

See [docs/context.md](docs/context.md) for the full mental model and [docs/adr/](docs/adr/) for decisions.

## Commands

```bash
npm i                 # install
npm run dev           # Vite at http://localhost:5173
npm run build         # vue-tsc + vite build
npm run test          # Vitest (unit)
npm run cypress:open  # E2E UI
npm run cypress:run   # E2E headless
npm run cli -- generate character   # or: make generate-character
npm run cli -- generate weapon
npm run cli -- generate echo-preset
npm run cli -- generate enemies         # --mode fill|overwrite to skip the prompt
npm run cli -- import echoes
npm run cli -- backfill icons        # or: backfill icons --character <Key> for one character
```

## Layout (where to look)

| Path | Role |
|------|------|
| `src/calculator/` | Pure TS engine: stats, damage, attacks, optimizer context — **no Vue** |
| `src/workers/` | Optimizer + echo OCR; serializable messages only |
| `src/characters/<Name>/` | Per-character game data (attacks, buffs, RCs, presets) |
| `src/weapons/`, `src/echoes/`, `src/buffs/` | Game data registries |
| `src/components/Calculator.vue` | Main UI orchestrator (stats → damage pipeline) |
| `src/stores/` | **User state only** (Pinia + persistedstate) |
| `src/migrations/` | localStorage / export schema migrations |
| `docs/` | Human + agent reference; start at `docs/README.md` |
| `cli/` | Scaffold generators (character, weapon, echo preset) |
| `tests/` | Vitest unit tests; `cypress/` for E2E |

## Hard rules

- **Accuracy first.** Prefer correct formulas over clever shortcuts. When changing calculator math, add/update unit tests under `tests/calculator/`.
- **Calculator stays pure.** No Vue, DOM, or Pinia inside `src/calculator/` or workers. Workers receive plain objects only.
- **Stores = user input.** Character lists, echo tables, formula constants live in code modules — never in Pinia.
- **No classes** for domain logic. Plain objects, factories, modules.
- **DaisyUI + Tailwind** for UI. Semantic theme tokens (`bg-base-100`, `text-base-content`). Support light and dark.
- **Composition API / `<script setup>`** for new Vue code.
- **Workers** for anything that can freeze the UI (optimizer batches, OCR).
- **No unreleased content in production.** Prep from leaks offline is fine; it must not be reachable in the shipped app. Do not link or cite third-party datamine sites (e.g. encore.moe) in user-facing UI/copy.
- **PRs:** small, focused, tests green. Prefer several small PRs over one large one. See [docs/conventions.md](docs/conventions.md) for branch/commit naming.
- **Docs:** if behavior or architecture changes, update the matching file under `docs/` (and an ADR if it is a lasting decision).

## Calculation pipeline (mental model)

```
user input (stores)
  → Calculator.vue orchestrates
  → calculateAllStats / computeAllBuffsWithBreakdown (stats.ts)
  → calcDamages / processAttacks (attacks.ts + calculator.ts)
  → UI (stats, damages, breakdown)

Optimizer: main thread builds OptimizerContext
  → generator/processor workers evaluate loadouts
  → ranked results back to Calculator
```

## When changing X, also check Y

| Change | Also check |
|--------|------------|
| Damage/stat formula | Unit tests; both main-thread and worker paths if shared |
| Buff/modifier keys | Character buffs, team buffs, resonance chains, weapon passives |
| Echo sets/stats | Optimizer constraints + inventory equip |
| Store shape | `src/migrations/` — bump version + add migration |
| New character | `characters.ts` registry + CLI checklist; see the `new-character` skill and `docs/creating-new-character.md` |

## Skills

- `new-character`, `new-weapon`, `import-echoes` (`.claude/skills/`) — CLI scaffold + manual-review workflow for adding game content.

## Deeper reading

- [docs/context.md](docs/context.md) — priorities, product constraints, how to reason about changes
- [docs/architecture.md](docs/architecture.md) — conventions
- [docs/conventions.md](docs/conventions.md) — branch/commit/PR naming
- [docs/accuracy-verification.md](docs/accuracy-verification.md) — how to verify a formula/buff is actually correct
- [docs/adr/](docs/adr/) — architecture decision records
- Area docs: `docs/src-calculator.md`, `src-components.md`, `src-stores.md`, `src-migrations.md`, `src-workers.md`, etc.
