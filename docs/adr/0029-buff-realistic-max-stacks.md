---
status: accepted
date: 2026-09-09
tags: [calculator, characters, buffs]
---

# 29. `realisticMaxStacks`/`realisticBaseAttrValue` are manually-authored fields, not a computed soft cap

## Context

Issue #514 asked for a "soft max" on stacking buffs: some buffs have a large,
technically-real `maxStacks` (e.g. 150) that a normal rotation/team can never
actually reach, so the existing "Max" button (team buffs, and now self buffs
and resonance chains) jams stacks to an unrealistic number. The issue's own
ask was to determine whether that "soft cap" could be *computed* rather than
configured per buff.

We looked at what it would take to compute it: every currently-shipped
`maxStacks`/`maximumValue` in `src/buffs/index.ts`, `src/characters/*/buffs.ts`
and `src/characters/*/resonanceChains.ts` is already a verified, finite,
real in-game number — there is no existing notion of an "uncapped" stack.
The one true diminishing-returns mechanic in the engine (CritRate clamped at
100% in `calcAvgDamage`) is a formula property the echo/substat optimizer
already gets for free, because it brute-forces full builds. Buff stack
counts are different: they are fixed, exogenous user/rotation input never
searched by the optimizer (`OptimizerContext` takes them as given), and a
single stacking buff's realistic ceiling depends on team composition, enemy
count, and rotation length/uptime — none of which is a property of the buff
definition itself. Computing it for real would mean re-running the full
`calcCharStats`/damage pipeline across candidate stack counts inside a
concrete team+rotation context — not a closed-form formula, and undefined
outside that context.

ADR [0002](0002-accuracy-before-performance.md) rules out "close enough"
stacking approximations unless proven equivalent and tested. A generic
heuristic (e.g. "stop increasing stacks once marginal team DPS/stack drops
below X%") would not clear that bar without exactly the kind of contextual
simulation above, and would silently produce a *wrong-looking* number for
any buff whose real-world achievable stacks doesn't correlate with in-app
"marginal value."

## Decision

Add an optional `realisticMaxStacks?: number` field next to `maxStacks` on
buff/passive definitions (self buffs, team buffs, resonance chain nodes).
`maxStacks` keeps meaning "the real in-game cap" (slider bound, store data
limit); `realisticMaxStacks`, when set, is what every "Max" / "Max All"
button in the app targets instead. It is looked up through
`getRealisticMaxStacks(effectiveMaxStacks, realisticMaxStacks)` in
`src/characters/effectiveBuffStacks.ts`, which clamps it so it can never
exceed the (possibly resonance-chain-adjusted) hard cap.

Like `maxStacks` itself, `realisticMaxStacks` is authored and verified by
whoever adds/reviews the buff (see `docs/creating-new-character.md`) — it is
deliberately **not** derived automatically. We are not pursuing automatic
soft-cap derivation as part of this change.

A second, narrower case came up during review: some team buffs (Shorekeeper's
`SophisticatedStellarealmCritRate`/`ReleasedStellarealmCritDMG`, and 7 other
`inputBase: true` buffs keyed on a teammate's own Energy Regen/CritRate) don't
use stacks at all — the user manually types the relevant stat's value,
because the app can't compute a teammate's own build from inside the
optimized character's context. There's no `maxStacks` here to fall back to
and no existing "Max" button, and "realistic" means something softer for
these — "a typical value for that stat," not a verified rotation fact. We
extended the same pattern with a sibling field, `realisticBaseAttrValue`,
rather than overloading `realisticMaxStacks` for a different input shape.

## Consequences

- Pros: Small, testable, reuses the exact pattern `getEffectiveMaxStacks`
  already established for resonance-chain-gated cap overrides. Zero
  behavior change for any buff that doesn't set it (`undefined` falls back
  to the hard cap everywhere, or hides the "Suggested" button entirely for
  `realisticBaseAttrValue`). No new architecture, no worker/optimizer
  changes.
- Cons: Someone has to author and periodically re-verify a number per
  buff — the same maintenance cost `maxStacks` already carries. Buffs are
  shipped with both fields unset until verified numbers are added; this ADR
  does not populate any values (aside from the two Shorekeeper
  `realisticBaseAttrValue: 250` entries used to validate the wiring).
  `realisticBaseAttrValue` in particular is inherently softer/more opinion-based
  than `realisticMaxStacks` (a teammate's real ER/CritRate varies by their own
  build), so it should be read as "a reasonable assumption," not a verified
  game fact.

## Guidance

- **Do** set `realisticMaxStacks` only from a verified rotation/team
  scenario — treat it with the same rigor as `maxStacks` itself.
- **Do** set `realisticBaseAttrValue` only on buffs with `inputBase: true`;
  it does nothing on stacking buffs (they use `realisticMaxStacks` instead).
- **Do** leave either field unset when unsure; the UI silently falls back to
  the existing hard-cap behavior for stacks, or simply omits the "Suggested"
  button for `inputBase` fields.
- **Don't** compute or guess a value from the buff's own `modifierValue`/
  `maxStacks` shape — there is no reliable in-isolation signal for it.

## Related

- Issue #514 ("Add soft max for stacks")
- ADR [0002](0002-accuracy-before-performance.md)
- [docs/creating-new-character.md](../creating-new-character.md)
