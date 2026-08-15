# Project context

How to think about this codebase — for humans and AI assistants. Read this before making non-trivial changes. Lasting *decisions* live in [adr/](./adr/); day-to-day *conventions* live in [architecture.md](./architecture.md).

## What this product is

A browser-only optimizer for *Wuthering Waves*: pick a resonator, weapon, echoes, buffs, and rotations; get accurate stats and damage; optionally search inventory for better echo loadouts.

There is no game server. Game data is checked into `src/characters`, `src/weapons`, `src/echoes`, and `src/buffs`. User builds live in Pinia → localStorage (and optional import/export).

## Priority order

When goals conflict, resolve in this order:

| Rank | Priority | Meaning in practice |
|------|----------|---------------------|
| 1 | **Calculation accuracy** | Formulas, buff stacking, talent MVs, set bonuses, and enemy defense must match game behavior as closely as we can verify. Do not “approximate away” edge cases for speed. |
| 2 | **Performance** | Recalculation runs often. Prefer O(1) lookups, avoid redundant work, and move long jobs off the main thread. Never sacrifice (1) for (2). |
| 3 | **User-data integrity** | Builds, inventory, and exports must survive upgrades. Schema changes go through `src/migrations/`. |
| 4 | **Maintainability** | Incremental typing, small PRs, clear module boundaries. Prefer boring, local fixes over framework rewrites. |
| 5 | **UI polish** | Themes, DaisyUI consistency, responsive layout — important, but not above correct math. |

### Accuracy notes

- The calculator is the product. UI bugs annoy; wrong damage misleads builds.
- Prefer shared pure functions used by both the live calculator and optimizer workers so both paths cannot drift.
- When unsure about a formula, verify against in-game numbers or existing character tests — do not invent shortcuts. See [accuracy-verification.md](./accuracy-verification.md) for the checklist.
- Comments and TODOs in `src/calculator/` often mark unverified edge cases; treat those as hazards, not free simplification targets.

### Performance notes

- Hot path: store/UI change → `Calculator.vue` → stats pipeline → damage pipeline.
- Optimizer and OCR belong in `src/workers/`.
- Prefer maps/records over scanning arrays in tight loops.
- Pass serializable plain objects into workers (no functions, no Vue proxies).

## Architectural mental model

```
┌─────────────────────────────────────────────────────────┐
│  Vue UI (components/, pages/)                           │
│  Calculator.vue = orchestrator                          │
└───────────────┬─────────────────────────┬───────────────┘
                │                         │
                ▼                         ▼
┌───────────────────────┐   ┌─────────────────────────────┐
│  Pinia stores         │   │  Game data modules          │
│  user choices only    │   │  characters / weapons /      │
│  persisted            │   │  echoes / buffs             │
└───────────┬───────────┘   └──────────────┬──────────────┘
            │                              │
            └──────────┬───────────────────┘
                       ▼
            ┌────────────────────┐
            │  src/calculator/   │  pure TS
            │  stats → damage    │
            └─────────┬──────────┘
                      │
         ┌────────────┴────────────┐
         ▼                         ▼
   Main-thread UI            Web workers
   live preview              optimizer / OCR
```

**Rule of thumb:** game truth lives in data modules + calculator; user intent lives in stores; presentation lives in components; heavy search lives in workers.

## Product / content constraints

- **Released content only in production.** Unreleased characters, weapons, echoes, or sets must not be selectable or reachable in the shipped app. Offline prep before a patch is allowed if gated completely.
- **Do not cite datamine sites** in user-facing UI or copy (including encore.moe). Internal tooling/CLI may fetch data; user-visible text should not advertise those sources.
- Deploy: pushes to `master` ship via Vercel. Feature work goes through PRs.

## How to make a change safely

1. Identify whether you are touching **math**, **game data**, **persistence**, **UI**, or **tooling**.
2. For math: add/adjust Vitest coverage under `tests/calculator/`; run both relevant unit paths.
3. For persistence shape: add a migration in `src/migrations/versions/` and bump `CURRENT_DATA_VERSION` — see [src-migrations.md](./src-migrations.md).
4. For new characters/weapons: prefer the CLI generators (`make generate-character`, etc.), then finish modifiers/presets by hand.
5. Keep PRs small; update `docs/` when behavior or conventions change; add an ADR when the *decision* is lasting. See [conventions.md](./conventions.md) for branch/commit/PR naming.

## Glossary (short)

| Term | Meaning here |
|------|----------------|
| Resonator / character | Playable unit; folder under `src/characters/` |
| Forte / talent | Skill category (basic, skill, liberation, etc.) with MVs |
| Resonance chain (RC / sequence) | Constellation-like unlocks |
| Echo | Equipable piece with cost, main/sub stats, set |
| Rotation | Ordered list of attacks used for DPS totals |
| Outro / intro | Swap skills; outro often applies team buffs |
| Tune break | Special damage path handled in calculator |
| Optimizer | Combinatorial search over echo loadouts in workers |

## Related docs

- [architecture.md](./architecture.md) — coding conventions
- [adr/](./adr/) — why we chose what we chose
- [src-calculator.md](./src-calculator.md) — engine files
- [src-components.md](./src-components.md) — UI / Calculator.vue
- [src-stores.md](./src-stores.md) — persistence boundaries
- [src-migrations.md](./src-migrations.md) — schema versioning for persisted data
- [accuracy-verification.md](./accuracy-verification.md) — verifying formulas/buffs against real numbers
- [src-workers.md](./src-workers.md) — worker contracts
- [creating-new-character.md](./creating-new-character.md) — content authoring
