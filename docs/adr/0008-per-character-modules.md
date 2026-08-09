---
status: accepted
date: 2026-08-05
tags: [characters, data, cli]
---

# 8. One folder module per character

## Context

Each resonator has substantial unique data: base stats by level, many attack tables, self buffs, resonance chains, presets/rotations, and sometimes stances. A single mega-file or remote CMS would slow editing, complicate reviews, and make CLI scaffolding harder.

## Decision

Represent each character as a **folder under `src/characters/<CharacterKey>/`** with a consistent file set (`character.ts`, `basic.ts`, `*Attacks.ts`, `buffs.ts`, `resonanceChains.ts`, `presets.ts`, `index.ts` exporting `getData()`).

Register characters in `src/characters/characters.ts` (`getCharactersAvailable`, `allCharactersList`, `getCharByName`). Prefer the CLI (`make generate-character` / `npm run cli -- generate character`) to scaffold, then hand-finish modifiers and edge cases.

## Consequences

- Pros: Isolated diffs per character; predictable layout; generator-friendly; lazy `getCharByName` loading.
- Cons: Cross-cutting buff/engine changes still touch many folders; consistency relies on conventions and review.

## Guidance

- **Do** follow the existing folder layout and register the character in `characters.ts`.
- **Do** use the CLI when adding characters; complete the printed checklist.
- **Do** put shared team buffs in `src/buffs/`, not duplicated per character, when they are party-wide.
- **Don’t** invent a parallel character format for “just one” unit.
- See [creating-new-character.md](../creating-new-character.md) and [src-characters.md](../src-characters.md).

## Related

- ADR [0009](./0009-released-content-only.md)
- `cli/` character generator
