---
name: new-version
description: Add a game version's new content (resonators plus their signature weapons, often from the beta server) to the Wuthering Waves Optimizer in one branch — runs the new-character and new-weapon skills in order, fixes any calculator gaps the kits expose, and opens a PR held until the version is live. Use whenever the user asks to add a version/patch (e.g. "add 3.8", "the 4.0 beta characters"), or a character together with their signature weapon, or to refresh that content after a beta update.
---

# Adding a version's content

This skill only sets the order. The detail lives in the `new-character` and `new-weapon` skills: load each one when you reach its step and follow it fully.

## 0. Branch

Use `feat/version-X.Y`, branched off `master`. If the branch already exists, this is a beta refresh: check it out and go to step 6.

Unreleased content must never reach `master` before the version is live (`CLAUDE.md`). The branch and its private Vercel preview are fine.

## 1. Find the IDs

List what's new with the CLI (`npm run cli -- generate character --beta` and `generate weapon` show the API's list). Confirm with the user which resonators and weapons are in scope if they didn't say. Note each ID so the imports run non-interactively with `--id`.

## 2. Characters

For each resonator, follow the `new-character` skill: `npm run cli -- generate character --beta --id <id>`, then its checklist, the kit-text read (2b), self buffs, team buffs (3a) and chains.

## 3. Signature weapons

For each weapon, follow the `new-weapon` skill: `npm run cli -- generate weapon --id <id>`, then `passiveData` and its team buffs in `allWeaponTeamBuffs`.

## 4. Calculator gaps

Kits often add a buff shape the engine doesn't read yet. Fix each one in the engine with a unit test, as `new-character` describes under "Check the calculator can represent it", before relying on it in data.

Ask the user about every ambiguous reading in one go, after you've drafted everything, rather than one question at a time.

## 5. Verify

- `npx vue-tsc --noEmit` and `npm run test`. If a test times out under full-suite load, rerun it alone before calling it a failure.
- Revert changes that are line-endings only (snapshots and CRLF files in particular): `git diff --stat` against `git diff --ignore-all-space --stat`.
- If the CLI also had to change, add a test under `tests/cli/`.

## 6. Commit, push, PR

Commits, in this order and kept separate: CLI fixes, calculator fixes, then one `feat: add <names> (X.Y)` content commit. Push the branch.

`gh` may not be installed. If it isn't, give the user the compare URL (`https://github.com/ryanbenson/wuthering-waves-optimizer/compare/master...feat/version-X.Y`) and write the PR description to a file in the scratchpad. The description starts with **Do not merge before X.Y is live.**, then lists per character and weapon what was hand-corrected and what's still not done (presets, substat weights, frame data). The user opens and merges the PR.

**Beta refresh:** rerun each import with `--merge-modifiers` (characters) or regenerate the weapon, diff against the branch, recheck the changed text with `new-character` 2b–3a, and add a `fix: update <names> to the latest X.Y beta` commit. Update the PR description's lists.

## 7. After the version is live

Frame data (`import-frames` skill) usually exists only once the version is out. Presets and substat weights follow once there's a credible source.
