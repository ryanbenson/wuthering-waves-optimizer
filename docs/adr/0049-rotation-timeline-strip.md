---
status: accepted
date: 2026-10-29
tags: [calculator, components, labs]
supersedes: [15]
---

# 49. Rotation editors' damage strip on a game-time axis

## Context

Both rotation editors (character and team, 3.0 UI) show a small damage strip above the actions: one bar per action, in rotation order, as tall as its damage (ADR 0015, round 3). With no timing data that was the most it could honestly show. With frame data (ADR 0047, 0048) we know when each action starts, how long it takes, how it ends and when its damage lands. An ordered strip hides all of that: a 0.2s swap-out and a 2s liberation look the same width, and a heavy off-field tick looks like an action that took field time.

## Decision

Behind the same `frameTiming` Labs flag, and only when the rotation has frame data, the strip becomes a timeline (`RotationTimelineStrip.vue`, fed by the pure `buildTimelineStrip` in `src/calculator/rotationTimelineStrip.ts`). Otherwise the ordered strip stays as it was.

- **x is game time** (time stop skipped, the same clock as frame-data DPS). Each action is one block from its start, as wide as its field time summed over its repeats. **Height is the action's damage**, relative to the biggest, as before, so "which hits matter most" still reads at a glance.
- **Actions that take no field time** (off-field damage, echo set procs, the second part of a shared ability) are thin markers where their damage lands, not zero-width blocks at a start they share with the next action. Actions without frame data are hatched warning markers.
- **A step line shows the running damage total**, stepping up where each repeat lands (the same landing rule and repeat split as the team summary's frame timeline, ADR 0048). Its slope is the damage pace. Healing and shields are left out of it.
- **How an action ends is drawn on its block**, so you can see where you cancelled or swapped: plays out is plain, cancel/dash/jump cut off the top right corner, and swap out has a bar rising above the block's right edge. On a team, blocks take their character's color, so the color change after a swap shows who took the field. The legend only names what's on the strip.
- Clicking a block still scrolls to its action. Each block's tooltip gives its label, time span, damage and end.
- The team summary page's charts are unchanged: they already place damage on frame-data time (ADR 0048), and end markers would clutter a damage-over-time chart.

## Consequences

- Pros:
  - Pacing is visible in the editor while you build the rotation: slow setup, the burst window, dead time.
  - Cancels and swaps are visible without opening each action.
  - One component serves both editors, and the pure helper is unit-tested.
- Cons:
  - Damage doesn't account for an early exit: hits after a cancel or swap frame drop out of the timing, but the action's damage is unchanged, so the strip shows a shorter block at full height. Fixing that belongs in the damage pipeline, not here.
  - Repeated off-field actions and shared-ability parts still land at one moment (ADR 0048's limits).
  - The ordered strip remains for rotations without frame data, so the editors have two strip styles.

## Guidance

- **Do** feed the strip from `buildTimelineStrip`; keep layout math (percentages, the SVG path) in the component and timing math in the helper.
- **Do** pass `isDamage: false` for healing and shield actions so the running total stays a damage total.
- **Don't** show the timeline when the lab is off or there's no frame data; fall back to the ordered strip.

## Related

- ADR [0015](./0015-rotation-flow-labs-flag.md) (the ordered strip), [0047](./0047-frame-data-rotation-timing.md), [0048](./0048-frame-timing-in-results.md)
- `src/calculator/rotationTimelineStrip.ts`, `src/components/RotationTimelineStrip.vue`
- `tests/calculator/rotationTimelineStrip.test.ts`, `tests/components/RotationTimelineStrip.test.ts`
