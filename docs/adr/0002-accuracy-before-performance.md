---
status: accepted
date: 2026-08-05
tags: [calculator, priorities, performance]
---

# 2. Prioritize calculation accuracy over performance

## Context

Users trust this app to compare builds and guide farming. A fast but wrong DPS number is worse than a slower correct one. At the same time, every UI change can re-run stats and damage for many attacks, and the optimizer evaluates huge combo spaces — so performance still matters.

We needed an explicit priority order so contributors and agents do not “optimize” formulas in ways that change results.

## Decision

**Calculation accuracy is the top priority**, followed by performance, then persisted-data integrity, maintainability, and UI polish.

Performance work must preserve observable calculation results (within intentional rounding already used by the engine). Approximations, early exits that skip buffs, or “close enough” stacking are not acceptable unless they are proven equivalent and covered by tests.

## Consequences

- Pros: Clear conflict resolution; protects the product’s core value; encourages shared pure math + tests.
- Cons: Some hot paths stay more complex; we may invest in workers/data structures rather than simplifying the math model.

## Guidance

- **Do** add or update unit tests under `tests/calculator/` when changing formulas, buff application, or attack processing.
- **Do** optimize with better structures, caching of pure inputs, and workers — not by dropping edge cases.
- **Do** keep main-thread calculator and worker evaluation on the same pure functions so results cannot diverge.
- **Don’t** trade correctness for frame time. If a change alters numbers, treat it as a behavior change and justify it.
- **Don’t** silence TODOs in `src/calculator/` that mark unverified behavior by deleting the branch; verify or leave clearly marked.

## Related

- [docs/context.md](../context.md) — full priority table
- [docs/src-calculator.md](../src-calculator.md)
- [docs/accuracy-verification.md](../accuracy-verification.md) — how to verify a formula/buff is actually correct
- ADR [0003](./0003-pure-calculator-engine.md), [0004](./0004-web-workers-for-heavy-work.md)
