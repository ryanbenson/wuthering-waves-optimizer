---
status: accepted
date: 2026-08-05
tags: [style, typescript]
---

# 6. Prefer modules over classes for domain logic

## Context

Domain data (characters, buffs, attacks) is naturally declarative. Class hierarchies add ceremony, complicate serialization to workers, and fight the “plain object context” model used by the calculator and Pinia.

## Decision

**Avoid classes** for domain logic and game data. Prefer plain objects, factory functions, and ES modules. TypeScript `interface` / `type` describe shapes; functions implement behavior.

## Consequences

- Pros: Easy to serialize; simple to test; consistent with existing character/weapon/echo files.
- Cons: Some patterns (shared mutable entity behavior) need explicit functions instead of methods; contributors from OOP-heavy backgrounds need the convention spelled out.

## Guidance

- **Do** export functions and data from modules (`getData()`, `calcDamage()`, …).
- **Do** use interfaces for public shapes as typing improves.
- **Don’t** introduce class-based domain models without an ADR superseding this one.
- **Don’t** wrap every DTO in a class just to attach helpers — use standalone functions.

## Related

- [docs/architecture.md](../architecture.md)
