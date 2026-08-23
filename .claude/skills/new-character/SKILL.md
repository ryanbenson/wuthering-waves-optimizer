---
name: new-character
description: Add a new resonator (character) to the Wuthering Waves Optimizer — scaffold via the CLI, work through its manual-review checklist, hand-write any custom buff modifiers, and verify accuracy before opening a PR. Use whenever the user asks to add/create/generate a new character, sequence/resonance chain, or import a resonator's kit.
---

# Adding a new character

Calculation accuracy is priority #1 in this repo (`CLAUDE.md`). A new character touches base stats, talent motion values, self/team buffs, and resonance chains — all high blast-radius for wrong numbers — so don't skip the manual-review step even though the CLI automates most of the scaffold.

## 1. Scaffold with the CLI

```bash
npm run cli -- generate character
# or: make character
```

This fetches the character sheet from the Encore API (internal tooling only — never surface that source in user-facing UI/copy, per `CLAUDE.md`), scaffolds `src/characters/<Key>/`, and registers the character in `src/characters/characters.ts`. If the API's name is ambiguous it will prompt you to confirm it.

Regenerating an existing character to pick up API changes while keeping your hand-written entries: `make generate-character ARGS="--merge-modifiers"` (updates key/name/details from the API, keeps other properties on existing buff/RC entries).

## 2. Work the printed checklist — do not skip

The command ends by printing a `Manual review needed (N items):` checklist. Each line names the file and what's uncertain — treat it as required work, not FYI:

- **Gender missing** (`basic.ts`) — API doesn't expose it; set by hand.
- **Inherent skill buff count off** (expected 2 combat inherent skills) — API shape didn't match; write/verify `buffs.ts` manually.
- **Stat bonus node issues** (expected 8 SkillTree nodes / 2 stat types, unparsed percentage, unknown stat name) — verify or add the modifier mapping in `buffs.ts`.
- **Resonance chain count != 6** — verify `resonanceChains.ts` by hand.
- **Skill attribute / tune break notices** — verify the flagged talent's attack type or tune-break wiring in the forte files.

Work through every item before moving on. If the checklist was empty, still skim `buffs.ts` and `resonanceChains.ts` — an empty checklist means the *shape* matched expectations, not that every value was hand-verified.

**Optional:** a curated default substat-priority weight profile for the new character in `src/characters/substatPriorities.ts` (issue #451's Substat Score feature) — not required, the new character falls back to a neutral weight profile until curated. Only add one if you have a credible source (e.g. matching the existing entries' Tacet Lab provenance); never guess. If you do, only use keys from `subStats` in `src/echoes/stats.ts` — "Healing Bonus" in particular is an echo *main* stat, not a valid substat weight key.

## 3. Hand-write custom modifiers using the pattern catalog

Buffs the CLI can't infer (multiplier overrides, talent replacements, stacking conditions, stat-based scaling) need to be written by hand. `docs/creating-new-character.md` has a catalog of the common modifier shapes with real examples — base talent multiplier, additive multiplier, talent override, base talent addition, specific-skill multiplier, stat-based additional buffs, etc. Find the closest existing pattern there or in a similar character's `buffs.ts`/`resonanceChains.ts` before inventing a new modifier key.

Note: that doc's *top* numbered workflow (manually visiting encore.moe, stripping HTML, running `.prompts/*.txt` through ChatGPT) predates the CLI automation in step 1 and is stale — use this skill's steps instead. The buff-pattern catalog further down the doc is still the reference.

## 4. Verify accuracy

Follow `docs/accuracy-verification.md`. At minimum: cross-check base stats and a couple of talent MVs at max level against the source data, and sanity-check one full damage calculation in the live Calculator UI against known numbers if you have any (e.g. a showcase or reference build).

## 5. Test and build

```bash
npm run build   # vue-tsc + vite build — catches type errors across the new files
npm run test    # vitest
```

There's no per-character unit-test convention (unit tests target the shared calculator engine in `tests/calculator/`), so a clean build plus the manual verification in step 4 is the bar — add a Vitest case only if you added/changed shared calculator logic, not just character data.

## 6. Commit and PR

Follow `docs/conventions.md` for branch naming and commit style.
