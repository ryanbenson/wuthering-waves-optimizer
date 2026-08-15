# Verifying calculation accuracy

Calculation accuracy is priority #1 (`CLAUDE.md`, [context.md](./context.md)). This doc is the checklist for actually verifying a formula, buff, or piece of game data is *correct* — not just that it type-checks or that a test passes against the code's own output.

## Why this needs its own doc

A Vitest case that asserts a function returns whatever the function currently computes proves the code is stable, not that it's right. The only tests that catch a wrong formula are ones anchored to a number that came from somewhere other than the code under test — the game itself, an official patch note, or a community-verified reference.

## Where reference numbers come from, in order of trust

1. **In-game observation** — the best source. A known character/weapon/echo build, a specific attack, and the damage number the game actually showed. See `tests/calculator/calculator.test.ts`, `getBaseDamage` "known Calcharo BA1 damage, lvl 70" for the pattern: the expected value is a real computed float, with a comment noting it matches both the in-game display and the more precise internal result.
2. **Official patch notes / in-game tooltips** — for motion values, scaling percentages, level tables. These are ground truth for the *inputs* to a formula even when you can't observe the final damage number yourself.
3. **The Encore API** (via the CLI generators — see the `new-character`, `new-weapon`, and `import-echoes` skills) — good for bulk base stats, MVs, and passive text, but it's a data source, not a formula-correctness check. It can hand you a wrong or ambiguous number as easily as a right one (see the CLI's own "manual review needed" checklists), and it must never be cited in user-facing UI/copy (`CLAUDE.md`).
4. **An existing, already-verified character/weapon/echo with a structurally similar formula** — reasonable for pattern-matching a buff's *shape* (which modifier type to use), not for trusting a *new* numeric constant.

Never invent a shortcut or "close enough" approximation to fill a gap in verified data — flag it and ask, or leave a clearly marked TODO comment per the convention already used in `src/calculator/` (see [context.md](./context.md#accuracy-notes)).

## Checklist for a formula or buff change

- [ ] Identify what's actually new: a new formula, a new modifier on an existing formula, or new input data (MVs, stat tables) into an existing formula. Each has a different verification bar (below).
- [ ] For a **new or changed formula** in `src/calculator/`: find or construct at least one real, known input/output pair and pin it in a Vitest test under `tests/calculator/` — an exact expected value (`toEqual`), not a loose range, following the "known Calcharo BA1 damage" pattern.
- [ ] For a **new buff/modifier** (character self buff, team buff, weapon passive, echo modifier, resonance chain): confirm the modifier type matches what the effect text actually says (base multiplier vs. additive vs. talent override vs. stat-based scaling — see the pattern catalog in `docs/creating-new-character.md`), and that it targets the right specific talents/stats. A buff wired to the wrong modifier type silently produces a plausible-looking but wrong number.
- [ ] For **new input data** (base stats, MV tables, echo stat tables): spot-check at least the level-1, a mid, and the max-level entries against the source rather than trusting the whole table was transcribed/fetched correctly.
- [ ] Run the affected formula through the live Calculator UI with a build you can sanity-check (a known showcase, a reference build someone posted, or your own in-game numbers) — this catches integration bugs (wrong buff stacking order, wrong stat pulled) that an isolated unit test won't.
- [ ] If you can't fully verify something (no reliable reference number available), say so explicitly rather than reporting the change as verified — leave a comment marking the specific unverified assumption.

## What "sufficient test coverage" means here

- Shared logic in `src/calculator/` (formulas used across characters): needs a pinned unit test per new formula/branch, per [architecture.md](./architecture.md#testing).
- Per-character data (`src/characters/<Name>/`) has no dedicated unit-test convention — there's no `tests/characters/` suite. Its accuracy bar is the checklist above (spot-checked source data + a live-UI sanity check), not a Vitest file.
- If a character/weapon/echo change also changes shared calculator logic (a new modifier type, a new special-multiplier path), that shared logic *does* need a `tests/calculator/` case.

## Related

- [context.md](./context.md) — priority order and accuracy notes
- [architecture.md](./architecture.md) — testing conventions
- [src-calculator.md](./src-calculator.md) — engine files and data flow
- `.claude/skills/new-character/`, `.claude/skills/new-weapon/`, `.claude/skills/import-echoes/` — where this checklist plugs into the content-creation workflows
