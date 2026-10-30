---
status: accepted
date: 2026-10-29
tags: [calculator, components, labs]
supersedes: [15]
superseded_by: [50]
---

# 49. Rotation editors' charts on a game-time axis

## Context

Both rotation editors (character and team, 3.0 UI) show a small damage strip above the actions: one bar per action, in rotation order, as tall as its damage (ADR 0015, round 3). With no timing data that was the most it could honestly show. With frame data (ADR 0047, 0048) we know when each action starts, how long it takes, how it ends and when its damage lands. An ordered strip hides all of that: a 0.2s swap-out and a 2s liberation look the same width, and a heavy off-field tick looks like an action that took field time.

A first version put every action on one time axis as a block (width = field time, height = damage) under a running-total line. It was accurate but hard to read: short actions and off-field hits became slivers, the marks were too small to tap on a phone, and one chart tried to answer every question at once. We compared six designs and picked the ones below. The audience runs from players who just want "where does my damage come from" to players tuning frames.

## Decision

Behind the same `frameTiming` Labs flag, and only when the rotation has frame data, the editors show these charts. Otherwise the ordered strip stays as it was. The pure helper `src/calculator/rotationTimelineStrip.ts` turns the timing and per-action damage into blocks, a running total, turns on field and shares. The components only do layout.

- **Single character (`RotationTimelineChart.vue`):**
  - **Pace** (default): the running damage total on game time (time stop skipped, the same clock as frame-data DPS). It steps up where each repeat lands, using the same landing rule and repeat split as ADR 0048. The three biggest hits are named where they land. A thin "Doing" band under it shows what you were doing, colored by kind of action. Anyone can read "steep here is the burst".
  - **Detailed** (toggle): named blocks on game time over a damage bar per action. Actions with no field time (off-field damage, echo set procs) sit past the end as diamonds instead of stacking on the last block. Cancel, dash and jump ends get a notch; swap outs get a bar.
  - Kinds come from the persisted action's ability group (intro, outro, basic, skill, forteCircuit, liberation, echo), not the attack's damage type: an Outro can deal Basic Attack DMG and should still read as an Outro.
- **Team (`TeamRotationLanesChart.vue`):** swim lanes, one row per character. A swap is the active block moving to another row, so this works for block rotations and quick back-and-forth swaps alike.
  - Off-field hits are rings in that character's row, sized by damage. Dashed lines mark each swap. Each turn on field gets one label (its biggest action plus "+N"), since single actions are usually too short to name. Each row ends with that character's share of the damage, and the team's running total runs under the rows.
  - Rows use the team summary page's per-slot palette, so a character keeps its color across pages.
- **Summaries under both:** field time vs damage as two 100% bars (by kind, or by character), with a table behind "Show as a table". The team chart adds a list of turns on field, with the team's damage and DPS during each, collapsed after 8.
- **Readable everywhere:**
  - The SVG is drawn at the container's real width, not a scaled viewBox, so text stays 11px on a phone. Under 480px the layouts switch to a compact form (row names above the rows, the share beside the name).
  - No mark is narrower than 6px. Labels wear ink, never the series color.
- **Every number on hover or tap:** one readout line under the chart (not a floating tooltip, which runs off small screens).
  - A mouse click or Enter on a mark still scrolls to its action. A tap shows the details first, with a "Go to action" link, so a tap doesn't scroll the details away.
  - Hovering or tapping the running total gives the time, the damage so far and what was on field.
- The team summary page's charts are unchanged (ADR 0048).

## Consequences

- Pros:
  - Pacing is visible while you build the rotation (slow setup, the burst window, dead time), and both audiences get a default they can read at a glance with the detail one step away.
  - Swaps, quick or not, read as changes of row; cancels show as notches.
  - The helper is pure and unit-tested; the components share the readout, share bars and width handling.
- Cons:
  - Damage doesn't account for an early exit: hits after a cancel or swap frame drop out of the timing, but the action's damage is unchanged. Fixing that belongs in the damage pipeline, not here.

    **Superseded 2026-10-30:** swaps no longer drop hits (ADR [0050](./0050-swapped-out-hits-still-land.md)). Cancels still can, but almost never at the earliest cancel frame.

  - Repeated off-field actions and shared-ability parts still land at one moment (ADR 0048's limits). Actions landing at the same moment share a point on the Pace chart.
  - The ordered strip remains for rotations without frame data, so the editors have two chart styles.
  - Label fitting uses an estimated text width, so a label can be a little shorter than the room allows.

## Guidance

- **Do** feed the charts from `buildTimelineStrip`; keep layout math in the components and timing math in the helper.
- **Do** pass `isDamage: false` for healing and shield actions so the running total stays a damage total, and the action's ability group as `type`.
- **Do** keep new marks at least 6px wide and give them a readout entry.
- **Don't** show these charts when the lab is off or there's no frame data; fall back to the ordered strip.

## Related

- ADR [0015](./0015-rotation-flow-labs-flag.md) (the ordered strip), [0047](./0047-frame-data-rotation-timing.md), [0048](./0048-frame-timing-in-results.md)
- `src/calculator/rotationTimelineStrip.ts`, `src/components/RotationTimelineChart.vue`, `src/components/TeamRotationLanesChart.vue`, `src/components/RotationShareBars.vue`, `src/components/RotationChartReadout.vue`, `src/composables/useRotationChartReadout.ts`, `src/composables/useElementWidth.ts`, `src/utils/rotationChart.ts`
- `tests/calculator/rotationTimelineStrip.test.ts`, `tests/components/RotationTimelineChart.test.ts`, `tests/components/TeamRotationLanesChart.test.ts`
