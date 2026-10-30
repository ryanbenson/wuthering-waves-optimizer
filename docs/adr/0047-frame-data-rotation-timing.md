---
status: accepted
date: 2026-10-28
tags: [calculator, characters, cli, data]
---

# 47. Frame data from wuwalab and a timing engine for rotations

## Context

Every rotation asks the player how long it takes. Team rotations sit around 25 seconds, so that guess is easy, but a single character's string varies widely and most people don't know it. DPS and the damage-over-time charts are only as good as that guess: `calcRotationTimeline` spreads actions evenly across the typed duration.

wuwalab (https://wuwalab.com) publishes hand-curated frame data (60 frames per second) for nearly every ability: total length, earliest cancel, NoSwap, time stop, cooldowns, and every hit's landing frame, commit frame, motion value, energy and concerto. wuwalab gave permission to use it and asked for credit. Their API only answers requests from their own site, so the app can't fetch it live.

The research, designs and plan are in a published Artifact ("Frame-Timed Rotations"), which isn't checked in.

## Decision

- **Frame data is game data, imported by the CLI and shipped with the app.** `npm run cli -- import frames` writes a generated `src/characters/<Name>/frames.ts` per character (loaded lazily with the rest of the character) and `src/echoes/frames.ts`. It never edits the hand-written `*Attacks.ts` files, so re-syncing never fights hand edits. Only folders already in our registry are imported, so no unreleased content gets in (wuwalab also keeps unreleased characters behind an opt-in).
- **Abilities are matched to our attacks by motion value, not by name.** wuwalab's `motion_value` is our highest-level talent multiplier ×100. Ties are broken by attack group, then by shared name words. Heals match on base value plus percent, and tune break by genre. An attack covering part of a bigger ability is marked `shared`. Outros and genre-`none` effects are `offField`. Anything else goes to a review list, and `cli/lib/frameOverrides.ts` holds the hand-picked cases, including `OFF_FIELD` for procs.
- **`src/calculator/rotationTiming.ts` is a pure timing engine.** The rules were found and checked frame by frame against five verified wuwalab rotations:
  - An action plays out to its full length unless the action says otherwise. The Cancel column is the earliest possible cancel, which authors rarely use exactly, and a cancel of 0 means unknown, not instant.
  - A cancel happens at a chosen frame. A dash cancel adds 22 frames and a jump 3.
  - A swap happens at a chosen frame (10 by default) but never before NoSwap.
  - Hits committed before the exit still land after it.
  - Outros, off-field effects, echo set procs, negative status ticks and utility actions take no field time.
  - Two consecutive `shared` actions of one ability count its time once.
- **DPS uses the game clock, which skips time stop.** All five reference rotations, and wuwalab's DPS, use it. Their loops are all about 25 seconds, which matches the community's rule of thumb. Real time (with time stop) is kept for the breakdown. Counting it would freeze 37–49% of a run, a different share per team, and reorder teams against the numbers players use.
- **wuwalab's rotations are test material only.** They are never presets, never shipped, never imported by `src/`, and never committed: each one is written by a member of their community. `npm run fixtures:wuwalab` fetches trimmed copies into the gitignored `tests/fixtures/frames/reference/`, and the tests that use them skip when it's empty. What is committed:
  - the ability snapshots (`tests/fixtures/frames/abilities/`), which is the frame data we have permission for;
  - our own expected results (`reference-expectations.ts`), which hold row numbers and reasons, not rotation contents;
  - hand-built rule cases;
  - a snapshot of every preset's length.
- **Credit:** wuwalab is listed on the Credits page. Wherever frame-based numbers appear in the UI (from the next PR on), they carry a "Frame data: wuwalab" note.

## Consequences

- Pros:
  - 1,142 of 1,236 attack entries across the 49 characters wuwalab covers have frames.
  - The engine reproduces 85% of the gaps in the reference rotations to the frame. Every other gap has a recorded reason, mostly waits after a swap that the frame data doesn't record.
  - The data and the engine are additive. Nothing in the UI reads them yet, so this ships with no behavior change.
    **Updated 2026-10-29:** the character and team rotation pages now show the frame-data length and DPS beside the typed duration, and each action can set how it ends, behind the `frameTiming` Settings > Labs flag (see "Frame-data timing" in `docs/src-components.md`). Results views and the team summary's charts followed in ADR [0048](./0048-frame-timing-in-results.md).
- Cons:
  - A frame-data length runs 2–6% shorter than an author's own timeline (19% for a quick-swap team), because of those post-swap waits. DPS from frame data will read slightly high until we decide on a per-swap allowance.
  - Eleven characters have no data on wuwalab yet (Aalto, Calcharo, Chixia, Jianxin, Jiyan, Lumi, Havoc Rover, Xiangli Yao, Yinlin, Youhu, Yuanwu), and echoes only have frames where wuwalab has entered them.
  - The data is a snapshot. Re-syncing is a deliberate CLI run whose diff and review list need a look.

## Guidance

- **Do** re-run `npm run cli -- import frames` after adding a character or when wuwalab updates, and work through its review list. Add `frameOverrides` entries rather than editing a generated `frames.ts`.
- **Do** accept a changed preset-length snapshot (`tests/calculator/rotationTiming.test.ts`) only after checking why it moved.
- **Don't** put a wuwalab rotation (or a link to one) anywhere under `src/`, or commit one. `tests/calculator/frameDataGuardrails.test.ts` enforces this.
- **Don't** compute DPS on the real clock. Show it as a secondary figure only.

## Related

- `src/calculator/frameData.ts`, `src/calculator/rotationTiming.ts`, `src/characters/*/frames.ts`, `src/echoes/frames.ts`
- `cli/commands/importFrames.ts`, `cli/lib/frames.ts`, `cli/lib/frameOverrides.ts`, `cli/lib/wuwalab.ts`, `scripts/fixtures-wuwalab.ts`
- `tests/calculator/rotationTiming.test.ts`, `tests/calculator/rotationTimingReference.test.ts`, `tests/cli/frames.test.ts`, `tests/calculator/frameDataGuardrails.test.ts`, `tests/fixtures/frames/`
- `.claude/skills/import-frames/SKILL.md`
