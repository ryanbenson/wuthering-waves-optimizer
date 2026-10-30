import { describe, it, expect } from "vitest";
import { buildTimelineStrip } from "../../src/calculator/rotationTimelineStrip";
import { computeRotationTiming, type TimingAction } from "../../src/calculator/rotationTiming";
import type { AttackFrames } from "../../src/calculator/frameData";

const SKILL: AttackFrames = { ability: "Skill", total: 60, cancel: 40, noSwap: 20, hits: [[10, 10, 0, 0], [30, 30, 0, 0]] };
const TICK: AttackFrames = { ability: "Tick", total: 30, offField: true, hits: [[15, 15, 0, 0]] };

function timing(actions: TimingAction[]) {
  return computeRotationTiming(actions);
}

describe("buildTimelineStrip", () => {
  it("places each action at its start, as wide as its field time, with its end", () => {
    const strip = buildTimelineStrip(
      timing([
        { id: "a", frames: SKILL, end: { type: "cancel" } },
        { id: "b", frames: SKILL, count: 2 },
        { id: "c", frames: SKILL, end: { type: "swap" } },
      ]),
      [
        { id: "a", value: 100, label: "A", end: { type: "cancel" } },
        { id: "b", value: 300, end: null },
        { id: "c", value: 50, end: { type: "swap", frame: 25 } },
      ],
    );
    expect(strip.blocks.map(({ id, startFrame, frames, end }) => ({ id, startFrame, frames, end }))).toEqual([
      { id: "a", startFrame: 0, frames: 40, end: "cancel" },
      // Both repeats in one block.
      { id: "b", startFrame: 40, frames: 120, end: "full" },
      // Swaps at the default 10f, held back to NoSwap (20f).
      { id: "c", startFrame: 160, frames: 20, end: "swap" },
    ]);
    expect(strip.blocks[0].label).toBe("A");
    expect(strip.blocks[1].label).toBe("Action");
    expect(strip.totalFrames).toBe(180);
    expect(strip.maxValue).toBe(300);
  });

  it("builds the running total as each repeat lands, splitting repeated damage", () => {
    const strip = buildTimelineStrip(timing([{ id: "a", frames: SKILL }, { id: "b", frames: SKILL, count: 2 }]), [
      { id: "a", value: 100 },
      { id: "b", value: 300 },
    ]);
    // Landings sit midway between the first and last hit: 20, 80, 140.
    expect(strip.cumulative).toEqual([
      { frame: 0, value: 0 },
      { frame: 20, value: 100 },
      { frame: 80, value: 250 },
      { frame: 140, value: 400 },
    ]);
  });

  it("gives off-field actions no width, keeps healing out of the total and skips untimed ids", () => {
    const strip = buildTimelineStrip(
      timing([
        { id: "a", frames: SKILL },
        { id: "tick", frames: TICK },
        { id: "heal", frames: SKILL },
      ]),
      [
        { id: "a", value: 100 },
        { id: "tick", value: 40 },
        { id: "heal", value: 999, isDamage: false },
        { id: "disabled", value: 5 },
      ],
    );
    const tick = strip.blocks.find((block) => block.id === "tick")!;
    expect(tick.frames).toBe(0);
    expect(tick.landingFrame).toBe(75);
    expect(strip.blocks.map((block) => block.id)).not.toContain("disabled");
    expect(strip.cumulative[strip.cumulative.length - 1].value).toBe(140);
  });

  it("marks actions without frame data and runs the axis past the rotation for a late landing", () => {
    const late: AttackFrames = { ability: "Late", total: 220, offField: true, hits: [[200, 200, 0, 0]] };
    const strip = buildTimelineStrip(
      timing([{ id: "a", frames: SKILL }, { id: "b", frames: null }, { id: "late", frames: late }]),
      [
        { id: "a", value: 1 },
        { id: "b", value: 1 },
        { id: "late", value: 1 },
      ],
    );
    expect(strip.blocks.find((block) => block.id === "b")?.missing).toBe(true);
    expect(strip.totalFrames).toBe(260);
  });
});
