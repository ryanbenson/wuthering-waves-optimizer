---
status: accepted
date: 2026-08-05
tags: [calculator, workers, testing]
---

# 3. Keep calculator logic pure TypeScript

## Context

Stats and damage must run in the Vue UI *and* inside web workers (optimizer). Workers cannot use Vue, Pinia, or the DOM. Mixing UI concerns into formula code also makes unit testing harder and invites accidental divergence between “live” and “optimize” paths.

## Decision

All core math and processing lives under `src/calculator/` as **pure TypeScript**: no Vue components, no DOM APIs, no Pinia. Inputs and outputs are plain data. `Calculator.vue` orchestrates; it does not own formulas.

Workers import the same calculator/echo/character modules and receive serializable context objects (for example `OptimizerContext`).

## Consequences

- Pros: Worker-safe; Vitest-friendly; one implementation for UI and optimizer; clearer ownership.
- Cons: Orchestration in `Calculator.vue` can grow large; context objects must be carefully assembled and kept serializable for workers.

## Guidance

- **Do** put new formulas, buff application, and attack aggregation in `src/calculator/` (or small pure helpers nearby).
- **Do** pass plain objects into workers — strip proxies/functions before `postMessage`.
- **Don’t** import Vue, router, or stores from calculator or worker entrypoints.
- **Don’t** duplicate damage logic inside a Vue component “just for the UI.”

## Related

- `src/calculator/` — `stats.ts`, `calculator.ts`, `attacks.ts`, `optimizer.ts`
- [docs/src-calculator.md](../src-calculator.md)
- [docs/src-components.md](../src-components.md)
- ADR [0004](./0004-web-workers-for-heavy-work.md)
