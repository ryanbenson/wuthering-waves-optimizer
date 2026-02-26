# App documentation

This folder contains references for developers new to the app. Start here for an overview, then use the links below to dive into each area.

## Quick links

| Area | Description | Doc |
|------|-------------|-----|
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

1. Read [architecture.md](./architecture.md) for conventions (Options API, types, performance, no classes, tests, workers, DaisyUI).
2. Read [src-components.md](./src-components.md) to understand how the UI and data flow work, with `Calculator.vue` as the central orchestrator.
3. Use the area-specific docs when touching buffs, calculator, characters, echoes, stores, weapons, or workers.
