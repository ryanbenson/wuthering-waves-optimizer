---
status: accepted
date: 2026-08-23
tags: [echoes, characters, stores]
---

# 12. Echo & character substat ratings

## Context

Issue [#451](https://github.com/ryanbenson/wuthering-waves-optimizer/issues/451) asked for a per-echo quality grade (E-SSS, based on how well its substats rolled), a way for users to customize which substats they value, and a second, character-specific "Substat Score" (0-100%) that scores an echo against one particular character's stat priorities.

The codebase already had a closely related, un-surfaced building block: `src/echoes/stats.ts`'s Roll Value (RV) / Crit Value (CV), which sum a per-substat roll-quality lookup table into a single number. This feature extends that pattern (same 8-tier roll lookup, reinterpreted as 1-8 points) rather than inventing a new one.

## Decision

1. **Two distinct scores**, both sharing an 8-letter grade vocabulary (E/D/C/B/A/S/SS/SSS) and color scheme (white/green/blue/purple/purple/gold/gold/red):
   - **Echo Rating** — global, always-visible, computed from raw substat roll tiers (1-8 pts × 5 substats = 5-40 pt range) weighted by one global, user-customizable priority profile. Default weight is uniform (`1` per stat), which reproduces the plain 5-40 point range with no bias.
   - **Substat Score** — per-character, 0-100%, `Σ(rollTier × characterWeight) / Σ(8 × characterWeight)` over the echo's revealed substats, using that character's weight profile.

   Grade bands for Echo Rating are fixed integer point ranges (E 5-12 … SSS 27-40); Substat Score bands are equal-width percentages (E 0-12.5% … SSS 87.5-100%) since a normalized percentage doesn't share the point scale's natural anchors. When a weight profile is non-uniform, the weighted point sum is normalized back onto the 5-40 scale so the same Echo Rating bands stay meaningful.

   Both are "provisional" (asterisked) whenever an echo has fewer than 5 revealed substats — there's no per-roll history stored, so "5 rolls" is read as "all 5 substat slots revealed" (reusing the existing `isEchoIncomplete` signal).

2. **New pure module `src/echoes/rating.ts`**, not folded into the already-large `stats.ts`. Substat weight profiles are plain `Record<string, number>` objects on the same 13-key `subStats` vocabulary `stats.ts` already defines; `resolveSubstatWeights(...sources)` layers a neutral default under curated-then-user-override sources.

3. **Curated per-character defaults sourced from an external reference**, not hand-guessed. [Tacet Lab](https://github.com/DJ12421/Tacet-Lab/blob/main/src/game-data/character-substat-preferences.ts) (GPL-3.0 — same license as this project, so no compatibility issue) publishes a DPR-calc-derived substat priority dataset on the same 0-4/0.5-step scale for ~50 characters. `src/characters/substatPriorities.ts` is a single static `Record<characterFolderKey, SubstatWeights>` lookup transformed from that dataset (their 13 stat keys and character display names remapped onto this repo's `subStats` keys and `src/characters/<Key>` folder names; their single "Rover: `<Element>`" entries applied to both this repo's male/female folders per element). A first hand-guessed draft used "Healing Bonus" as a healer substat weight — a real bug, since Healing Bonus is an echo *main* stat only and can never be a rolled substat; `tests/characters/substatPriorities.test.ts` guards against this class of mistake by asserting every curated key is a real substat.

   This is a single lookup file, not per-character `substatPriorities.ts` files wired into each character's `getData()` — the data is tiny (a handful of numbers per character) and a single synchronous file avoids forcing every lookup through the async `getCharByName` dynamic-import path that the heavier per-character kit data (attacks, buffs) needs for code-splitting.

   Characters the source itself left blank (mostly healers/shielders without a usable DPR-calc graph) and characters added to this repo since the source's last sync (Jingran, Qingxiao) are omitted rather than guessed — they fall back to the neutral default profile, fully user-customizable per character via `EchoRatingWeightsEditor.vue`.

4. **No migration for the new store fields.** `settings.js`'s `config.echoRatingWeights` and `character.js`'s `characters[id].substatWeights` are both optional and absent-safe (missing → falls back to defaults at read time, via `resolveSubstatWeights`/`getCharacterSubstatWeights`). `characters[id].optimizer.minStats` — a directly analogous purely-additive optional field on the same character record — never received its own migration; only `builds` (migration 008) did, because it needed to *synthesize* a "Default build" from existing fields. Since neither new field requires restructuring existing data, they follow `minStats`'s precedent rather than getting a version bump.

   `substatWeights` **was** added to `SHARED_FIELD_KEYS` in `src/characters/buildFields.ts` — it's a character-level preference like `characterLevel`/`talents`, not a per-build field, so it must not be silently reset when switching builds.

5. **UI weight editor uses `Range.vue` (tick slider), not a numeric input.** Since a weight can only be one of 9 discrete values (0, 0.5, 1, …, 4), a tick slider communicates the constraint better than a free numeric field — and `Range.vue` was already used exactly this way for substat *value* entry in `CalculatorEcho.vue`.

6. **The Echo Rating filter range is shared across both echo browsers** (`InventoryEchoesBrowser.vue`, `CalculatorEchoesBrowser.vue`) via a new `EchoRatingRangeFilters.vue`, modeled directly on the existing `EchoCvRvRangeFilters.vue`. Neither browser has a general sort feature (checked during implementation — only CV/RV range filters exist today), so "add Rating to sort" from the original issue language was dropped rather than invented from scratch.

## Consequences

- Pros: reuses the existing RV/CV roll-quality data table instead of a parallel one; curated per-character weights for ~50 of 62 characters are sourced from published DPR-calc math rather than guessed, with the guess-vs-source distinction caught by a real bug during implementation; no schema migration needed; the weight-editor UI matches an existing input pattern instead of introducing a new one.
- Cons: 12 characters (mostly supports) have no curated default and fall back to neutral weights until either the source project publishes one or a user customizes it themselves; the single `substatPriorities.ts` lookup file will need manual updates if new characters are added faster than the upstream source syncs.

## Guidance

- **Do** extend `src/characters/substatPriorities.ts` (not per-character files) if adding more curated defaults — keep it a single synchronous lookup.
- **Do** add a test asserting any new curated weight key is a real member of `subStats` (see `tests/characters/substatPriorities.test.ts`) — "Healing Bonus" is a recurring trap since it's a valid *main* stat but not a substat.
- **Don't** add a migration for future optional, absent-safe fields on `characters[id]` unless existing data needs restructuring — follow the `minStats` precedent, not `builds`.
- **Don't** forget `SHARED_FIELD_KEYS` in `buildFields.ts` when adding another character-level (not build-level) preference field.

## Related

- `src/echoes/rating.ts`, `src/echoes/stats.ts`, `src/characters/substatPriorities.ts`
- `src/stores/settings.js`, `src/stores/character.js`, `src/characters/buildFields.ts`
- `src/composables/useEchoRating.ts`, `src/composables/useTeamSubstatScoreRollup.ts`
- ADR [0005](./0005-stores-hold-user-data-only.md), ADR [0010](./0010-persisted-data-migrations.md)
- [docs/src-echoes.md](../src-echoes.md), [docs/src-stores.md](../src-stores.md)
