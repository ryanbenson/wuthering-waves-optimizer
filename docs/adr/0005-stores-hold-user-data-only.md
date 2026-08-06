---
status: accepted
date: 2026-08-05
tags: [stores, persistence, pinia]
---

# 5. Pinia stores hold user data only

## Context

User builds persist via Pinia + `pinia-plugin-persistedstate` (localStorage). If game config, formula constants, or character definitions were stored there, every data fix would require migrations or leave users stuck with stale config. We also want code patches to correct defaults without rewriting saved builds.

## Decision

Pinia stores (`src/stores/`) hold **user input and user preferences only**: selected character, per-character loadout fields, inventory echoes, presets, theme, etc.

Game data and app constants live in modules (`src/characters`, `src/echoes`, `src/weapons`, `src/buffs`, `src/calculator`, …). Stores must not be the source of truth for “what characters exist” or “how damage works.”

## Consequences

- Pros: Patch-friendly; clearer separation; fewer forced migrations for content updates.
- Cons: Components must combine store state with module lookups; derived values should be computed in the orchestrator, not persisted unless they are truly user intent.

## Guidance

- **Do** persist what the user chose; recompute stats/damage on load from code.
- **Do** tolerate missing/legacy keys with code defaults when reading.
- **Don’t** put character lists, echo stat tables, or formula constants in store state.
- **Don’t** persist large derived calculation results as the source of truth.
- When the *shape* of stored user data must change, use migrations (ADR 0010).

## Related

- [docs/src-stores.md](../src-stores.md)
- ADR [0010](./0010-persisted-data-migrations.md)
