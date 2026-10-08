---
status: accepted
date: 2026-10-08
tags: [calculator, packages, architecture]
---

# 36. Publish the damage formulas as `@wutheringtools/formulas`

## Context

`src/calculator/calculator.ts` holds the game's core formulas: direct damage, crit/average, healing, shields, Tune Break and every negative status effect. It's the most accuracy-critical code in the app, and it's already self-contained: no imports, no game data, no DOM.

Other tools (bots, spreadsheets, collaborators' apps) want the same numbers. Copying the file would fork it the way the scanner logic nearly forked before [ADR 0034](./0034-scanner-core-package.md).

## Decision

- `src/calculator/calculator.ts` moves to `packages/formulas/src/index.ts` with its history (`git mv`), unchanged.
- The old path is a one-line re-export shim, so `attacks.ts`, `Calculator.vue` and the tests don't change.
- In-repo resolution is a path alias in `vite.config.ts`, `vitest.config.ts` and `tsconfig.json`, the same as scanner-core.
- `.github/workflows/publish-formulas.yml` stages a publish when `packages/formulas/package.json`'s version changes on `master`. It runs the whole `tests/calculator` suite (not just the formula tests, because stats, rotations and the optimizer call these formulas), builds with `tsc`, and smoke-tests the build in plain Node first.
  - Auth is npm Trusted Publishing (OIDC) with staged publishing, exactly as in ADR 0034. 0.1.0 has to be published by hand to create the package.
- The build targets `ES2020` with **no DOM lib**, so the package can't start depending on browser APIs without the build failing.
- The public API is today's positional functions, untouched. Precise return types and a named-options `calcDamage` are left for a later minor version.

## Consequences

- Pros:
  - Anyone can compute the same numbers as Wuthering Tools from npm.
  - Formula fixes reach other consumers through a version bump.
  - The no-DOM build guards the "calculator stays pure" rule mechanically.
- Cons:
  - The positional signatures (up to 25 arguments) are now a public contract. Reordering them is a breaking change.
  - A formula fix needs a version bump to reach npm consumers. The app itself always uses the source.

## Guidance

- **Do** edit formulas in `packages/formulas/src/`, not the shim, and add tests under `tests/calculator/`.
- **Do** bump the package version when a fix should reach npm. Patch for corrected numbers, minor for new functions or trailing parameters.
- **Don't** import app modules (characters, buffs, echoes) into the package. It takes numbers and talent strings only.
- **Don't** reorder or remove parameters without a major version bump.

## Related

- `packages/formulas/`, `src/calculator/calculator.ts` (shim), [docs/src-calculator.md](../src-calculator.md), [ADR 0034](./0034-scanner-core-package.md)
