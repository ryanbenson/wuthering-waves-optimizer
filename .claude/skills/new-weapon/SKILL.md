---
name: new-weapon
description: Add a new weapon to the Wuthering Waves Optimizer — scaffold via the CLI, then hand-write the passive/modifier logic the CLI leaves empty. Use whenever the user asks to add/create/generate a new weapon.
---

# Adding a new weapon

## 1. Scaffold with the CLI

```bash
npm run cli -- generate weapon
# or: make weapon
```

Fetches the weapon sheet from the Encore API (internal tooling only — don't surface that source in user-facing UI/copy, per `CLAUDE.md`), writes `src/weapons/<TypePlural>/<Key>.ts` with base stats already filled in, and registers it in `src/weapons/weapons.ts`. If the API's name is ambiguous it will prompt you to confirm it.

## 2. Fill in `passiveData` by hand

The command always prints one review item: `passiveData` is left empty by default — base attack and the level table come from the API, but the passive effect's actual modifier logic doesn't. Write it in the same shape as an existing weapon of a similar effect (flat stat buff vs. conditional/stacking buff vs. team buff) — check `docs/src-weapons.md` and a comparable weapon file in the same type folder for the export shape the calculator expects (`attack`, `modifier`, `modifierValue`, `weaponPassiveStats`-style fields).

## 3. Verify and finish

- Cross-check base attack and the passive's numeric scaling at a couple of levels against the source data — see `docs/accuracy-verification.md`.
- `npm run build` (type-checks the new file) and `npm run test`.
- Follow `docs/conventions.md` for branch naming and commit style.
