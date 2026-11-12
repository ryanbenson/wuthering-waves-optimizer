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

Fetches the weapon sheet from the Encore API (internal tooling only — don't surface that source in user-facing UI/copy, per `CLAUDE.md`), writes `src/weapons/<TypePlural>/<Key>.ts` with base stats already filled in, and registers it in `src/weapons/weapons.ts`. If the API's name is ambiguous it will prompt you to confirm it. The weapon API always reads the beta dataset, so unreleased weapons are listed. `--id <weaponId>` skips the search prompt. The registry entry gets `mainStat` from the weapon's secondary stat.

## 2. Fill in `passiveData` by hand

The command always prints one review item: `passiveData` is left empty by default — base attack and the level table come from the API, but the passive effect's actual modifier logic doesn't. Write it in the same shape as an existing weapon of a similar effect (flat stat buff vs. conditional/stacking buff vs. team buff) — check `docs/src-weapons.md` and a comparable weapon file in the same type folder for the export shape the calculator expects (`attack`, `modifier`, `modifierValue`, `weaponPassiveStats`-style fields).

Split the passive into one `passiveData` entry per separate effect, each with its own key: always-on parts (e.g. Max HP) get `alwaysEnabled: true`; conditional parts get `alwaysEnabled: false`. Fix leftover placeholders (`{7}s`) and typos in `passiveValue` and `details` while you're there.

## 2b. Team buffs

Any part of the passive that reaches teammates ("all Resonators in the team gain…", "the active Resonator gains…" when the wielder triggers it) also needs an entry in `allWeaponTeamBuffs` in `src/buffs/index.ts`: same key as the matching `passiveData` entry, `weaponType` (singular, e.g. `"Pistol"`), `imageUrl`, and `modifierByRefinement`. `tests/buffs/buffFilters.test.ts` checks `weaponType` against the registry. See `docs/src-buffs.md`.

## 3. Verify and finish

- Cross-check base attack and the passive's numeric scaling at a couple of levels against the source data — see `docs/accuracy-verification.md`.
- `npm run build` (type-checks the new file) and `npm run test`.
- Check `git diff src/weapons/weapons.ts` only adds the new entry; the registry patcher once wiped every weapon of the same type.
- Follow `docs/conventions.md` for branch naming and commit style. An unreleased weapon follows the same "do not merge before X.Y is live" rule as an unreleased character (see the `new-character` skill, step 6).
