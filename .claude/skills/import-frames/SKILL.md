---
name: import-frames
description: Sync per-attack frame data (rotation timing) from wuwalab into each character's generated frames.ts and src/echoes/frames.ts, then work through the review list (unmatched attacks, ambiguous picks, changed frames). Use whenever the user asks to import, sync or update frame data, rotation timing data, or wuwalab data, or after adding a new character.
---

# Importing frame data

```bash
npm run cli -- import frames                         # every character, then echoes
npm run cli -- import frames --character Suoming     # one or more character folders
npm run cli -- import frames --no-echoes             # skip echoes
npm run cli -- import frames --from <dir>            # read a saved API copy instead of fetching
```

Frame data comes from wuwalab (https://wuwalab.com), used with permission and credited in the app (ADR 0047). Their API only answers requests from their own site, so this is CLI-only. The data ships as generated files.

- Writes `src/characters/<Name>/frames.ts` for every folder wuwalab covers, and adds `frames` to that folder's `index.ts` `getData()` the first time. Writes `src/echoes/frames.ts` for echoes wuwalab has entered.
- Only folders already in our registry are imported, so nothing unreleased gets in.
- Never edits `*Attacks.ts`. Never hand-edit a generated `frames.ts`: re-run the import, or add an entry to `cli/lib/frameOverrides.ts`.
- Requests are spaced 0.5s apart. If their API is down (it returns 503), save a copy when it's back with `npm run fixtures:wuwalab -- --mirror <dir>` and use `--from <dir>`.

## How matching works

wuwalab's `motion_value` is our highest-level talent multiplier ×100, so attacks are matched on that multiset of numbers, not names. In order:

1. An override in `frameOverrides` (`echoFrameOverrides` for echoes, keyed by echo key). A forced ability that contains our hits plus others stays `shared`.
2. Same motion values. Ties go to the matching attack group, then to shared name words (`Stage4` ↔ "… 4", `Hold` ↔ "(Hold)").
3. Healing by base value plus percent.
4. Tune break by genre.
5. Our attack is part of a bigger ability: marked `shared`, so a tap and a hold of one ability count its time once.
6. An outro falls back to the closest-named outro, since outros take no field time anyway.

## Work the review list

- `<Name>: no frames for A, B` — look the attacks up on wuwalab (`https://wuwalab.com/characters/<slug>/abilities`).
  - If it's an ability there, add `<AttackKey>: "<exact wuwalab ability name>"` to `frameOverrides`.
  - If it's a proc that never takes field time of its own (bonus or delayed damage, a status tick, a coordinated attack), use `OFF_FIELD`.
  - Sequence-node extras with no ability of their own can stay unmatched. Rotations just flag them.
- `<Name>: X matched "A" over "B" (same motion values, different frames). Check the pick.` — open both on wuwalab. If the pick is wrong, add an override naming the right one. If it's right, pin it with an override anyway so the notice stops and a wuwalab update can't flip it.
- `<Name>: X changed (total a→b, …)` — wuwalab corrected the frames. Usually fine. It will move preset lengths (below).
- `<Name>: override for X names "…", which wuwalab no longer has` — they renamed an ability. Update the override.

## After importing

- `npm run test`. `tests/calculator/rotationTiming.test.ts` snapshots every preset rotation's length. If it moved, check that the change matches what the import reported, then accept it with `npx vitest run tests/calculator/rotationTiming.test.ts -u`.
- Run `npm run fixtures:wuwalab` once to fetch the reference rotations (gitignored) so `rotationTimingReference.test.ts` runs locally instead of skipping.
- `npm run build`.
- The diff is mostly generated numbers. Review the review list and the snapshot change, not every line.
- Follow `docs/conventions.md` for branch naming and commit style.

## Rules that don't change

- wuwalab's **rotations** are test material only: never presets, never under `src/`, never committed (`tests/calculator/frameDataGuardrails.test.ts`).
- Don't link wuwalab rotations from the app. Credit for the frame data goes on the Credits page and next to frame-based numbers.
