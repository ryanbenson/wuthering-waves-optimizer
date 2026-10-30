---
status: accepted
date: 2026-10-29
tags: [calculator, components, labs]
---

# 48. Frame-data timing in rotation results and charts

## Context

ADR 0047 added a timing engine fed by wuwalab frame data. The rotation editors (character and team) show its length and DPS next to the duration the user typed, behind the `frameTiming` Settings > Labs flag. Everywhere else a rotation's results appear, DPS still divides by the typed duration only, and a rotation with no typed duration shows no DPS at all. The team summary's damage-over-time charts spread actions evenly across the typed duration (`calcRotationTimeline`), which says nothing about when damage really lands.

## Decision

All of this is behind the same `frameTiming` lab. With it off, every view behaves as before.

- **One rule for which DPS to show, in one pure helper.** `rotationDpsReadings(damage, typedDuration, frameLength)` (`src/calculator/teamRotation.ts`) returns every DPS a rotation has: frame data first ("DPS from frame data (13.17s)"), then the typed duration ("DPS (14s)", the label it always had). A missing, zero or non-numeric length gives no reading rather than a division by it.
  - **Views with room show both:** the character breakdown (classic `CalculatorDamages.vue` and 3.0 `CalculatorLiveResultRotations.vue`), the team damages panel and the team summary's DPS card. These carry the "Frame data: wuwalab" credit (`FrameDataNote.vue`) and say how many actions had no frame data.
  - **Views with room for one number use `headlineDps`:** the typed duration when there is one, because the user chose it, otherwise frame data. These are the team editor's sticky header, the "Best DPS" leaderboards and rankings on both rotation lists, and the list rows' "Xs rotation" text, which notes "(frame data)" when it isn't the typed length.
- **Where the frame-data length comes from.** For character rotations, `Calculator.vue` attaches `frameLength` (`RotationLength`: game frames, real frames, missing count) to each rotation's damage result via `characterRotationTiming`. For teams, `calcTeamRotationDamage` returns the whole `timing` (`teamRotationTiming`, which loads each slot's character data and build main echo itself), so the team list, editor and summary page all read one source. Both are computed whether or not the lab is on, because they're cheap. Each view decides what to show, so toggling the lab never needs a recompute.
- **Charts use the frame-data timeline when there is one.** On the team summary, `calcFrameTimeline(actionResults, timing)` places each damage action where its damage lands: midway between its first and last landed hit, or at its start when it has no hits. An action repeated `count` times gets one point per repeat with an equal share of its damage, since that damage already covers every repeat. The x-axis runs to the rotation's game length, or to the last hit if one lands after it. With no frame data the charts keep the even spread over the typed duration.

## Consequences

- Pros:
  - DPS shows for rotations the user never typed a length for.
  - The charts show real pacing: a slow setup and a burst window now look like that, not like evenly spaced bars.
  - One helper owns the "which DPS" rule, so the views can't drift apart.
- Cons:
  - Frame-data DPS still reads 2–6% high (ADR 0047's post-swap waits), and actions without frame data count as 0s. The notes say how many.
  - Off-field actions repeated with `count` (for example a liberation's ticks) land at the same moment, because frame data doesn't record the spacing between repeats. Their total is right; their spread over time isn't.
  - Two parts of one shared ability land at the same time on the chart.
  - `TeamRotations.vue`'s cached per-team stats now keep `frameLength` instead of DPS fields. DPS is worked out at display time.

## Guidance

- **Do** go through `rotationDpsReadings` / `headlineDps` for any new DPS display, and pass `null` for the frame length while the lab is off.
- **Do** show `FrameDataNote` wherever a frame-data number appears with room for it.
- **Don't** let the headline prefer frame data over a typed duration without revisiting this ADR. The typed length is the user's own call.

## Related

- ADR [0047](./0047-frame-data-rotation-timing.md)
- `src/calculator/teamRotation.ts`, `src/calculator/rotationTiming.ts`, `src/components/FrameDataNote.vue`
- `tests/calculator/teamRotation.test.ts`, `tests/calculator/rotationTiming.test.ts`, `cypress/e2e/calculator/rotationFrameTiming.cy.ts`
