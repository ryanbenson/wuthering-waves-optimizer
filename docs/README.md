# App documentation

This folder contains references for developers and coding agents. Start with **context** (priorities and mental model), then **architecture** (conventions), then area docs. Lasting “why” decisions live in **ADRs**.

Root agent briefing: [CLAUDE.md](../CLAUDE.md).

## Quick links

| Area | Description | Doc |
|------|-------------|-----|
| **Context** | Priorities (accuracy → performance → …), mental model, glossary | [context.md](./context.md) |
| **ADRs** | Architecture decision records | [adr/](./adr/) |
| **Architecture** | Vue 3, types, performance, testing, UI, workers | [architecture.md](./architecture.md) |
| **Buffs** | Team buffs and modifiers | [src-buffs.md](./src-buffs.md) |
| **Calculator** | Formulas, stats, attacks, deep math | [src-calculator.md](./src-calculator.md) |
| **Characters** | Character definitions and type definitions | [src-characters.md](./src-characters.md) |
| **Components** | Vue components, data flow, Calculator as orchestrator | [src-components.md](./src-components.md) |
| **Echoes** | Echo definitions, stats, sets | [src-echoes.md](./src-echoes.md) |
| **Stores** | Pinia stores, user data only, auto-sync | [src-stores.md](./src-stores.md) |
| **Utils** | Generic helpers | [src-utils.md](./src-utils.md) |
| **Weapons** | Weapon definitions | [src-weapons.md](./src-weapons.md) |
| **Workers** | Web workers (optimizer, echo parser/OCR) | [src-workers.md](./src-workers.md) |
| **New character** | Authoring guide | [creating-new-character.md](./creating-new-character.md) |

## High-level `src/` map

```
src/
├── buffs/          # Team buffs (outro, party, modifiers)
├── calculator/     # Stats, attacks, damage formulas, optimizer
├── characters/     # All characters + per-character data (attacks, buffs, etc.)
├── components/     # Vue components; Calculator.vue is the main orchestrator
├── echoes/         # Echo definitions, stats tables, set bonuses
├── stores/         # Pinia stores (user input only, auto-synced to storage)
├── utils/          # Generic helpers (numbers, strings)
├── weapons/        # All weapons by type
├── workers/        # Web workers (optimizer, echo parser/OCR)
├── pages/          # Route views
├── layouts/        # App layout
└── main.ts         # App entry
```

## For new contributors

1. Read [context.md](./context.md) for priorities (accuracy first) and the system mental model.
2. Read [architecture.md](./architecture.md) for conventions (Composition API, types, performance, no classes, tests, workers, DaisyUI).
3. Skim [adr/](./adr/) for decisions that affect your area.
4. Read [src-components.md](./src-components.md) to understand UI data flow (`Calculator.vue` as orchestrator).
5. Use the area-specific docs when touching buffs, calculator, characters, echoes, stores, weapons, or workers.
