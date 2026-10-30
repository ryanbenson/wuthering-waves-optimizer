import { describe, it, expect } from "vitest";
import {
  actionKind,
  buildStints,
  buildTimelineStrip,
  damageAt,
  sharesBy,
  ACTION_KINDS,
} from "../../src/calculator/rotationTimelineStrip";
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
    expect(strip.blocks.find((block) => block.id === "heal")?.isDamage).toBe(false);
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

describe("actionKind", () => {
  it("groups attack types into the charts' kinds, in either casing", () => {
    expect(["Intro", "outro", "Basic", "heavy", "Skill", "forteCircuit", "liberation", "Echo", "echoSetAttacks", "TuneBreak", undefined].map(actionKind)).toEqual([
      "introOutro",
      "introOutro",
      "basic",
      "basic",
      "skill",
      "forte",
      "liberation",
      "echo",
      "echo",
      "other",
      "other",
    ]);
  });
});

describe("team helpers", () => {
  // Slot 0 skill, slot 1 skill, an off-field tick from slot 0, slot 1 again, then slot 0.
  const strip = buildTimelineStrip(
    timing([
      { id: "a", frames: SKILL },
      { id: "b", frames: SKILL },
      { id: "tick", frames: TICK },
      { id: "c", frames: SKILL, end: { type: "cancel" } },
      { id: "d", frames: SKILL },
    ]),
    [
      { id: "a", value: 100, slot: 0, type: "Skill" },
      { id: "b", value: 200, slot: 1, type: "Liberation" },
      { id: "tick", value: 40, slot: 0, type: "Echo" },
      { id: "c", value: 300, slot: 1, type: "Basic", end: { type: "cancel" } },
      { id: "d", value: 400, slot: 0, type: "Skill" },
    ],
  );

  it("tags each block with its kind", () => {
    expect(strip.blocks.map((block) => block.kind)).toEqual(["skill", "liberation", "echo", "basic", "skill"]);
  });

  it("reads the running total at a frame, counting landings on it", () => {
    expect(damageAt(strip, 0)).toBe(0);
    expect(damageAt(strip, 20)).toBe(100);
    expect(damageAt(strip, 19)).toBe(0);
    expect(damageAt(strip, Number.POSITIVE_INFINITY)).toBe(1040);
  });

  it("splits the field-time blocks into turns, and an off-field hit doesn't end one", () => {
    const stints = buildStints(strip);
    expect(stints.map(({ slot, startFrame, endFrame, blocks }) => ({ slot, startFrame, endFrame, ids: blocks.map((b) => b.id) }))).toEqual([
      { slot: 0, startFrame: 0, endFrame: 60, ids: ["a"] },
      { slot: 1, startFrame: 60, endFrame: 160, ids: ["b", "c"] },
      { slot: 0, startFrame: 160, endFrame: 220, ids: ["d"] },
    ]);
    // Team damage landing during each turn; the tick (lands at 135) counts in the second.
    expect(stints.map((stint) => stint.value)).toEqual([100, 540, 400]);
    expect(stints.reduce((sum, stint) => sum + stint.value, 0)).toBe(damageAt(strip, Number.POSITIVE_INFINITY));
  });

  it("sums field time and damage per group, leaving out empty groups", () => {
    expect(sharesBy(strip, (block) => block.slot ?? 0, [0, 1, 2])).toEqual([
      { key: 0, frames: 120, value: 540 },
      { key: 1, frames: 100, value: 500 },
    ]);
    expect(sharesBy(strip, (block) => block.kind, ACTION_KINDS).map((row) => row.key)).toEqual([
      "basic",
      "skill",
      "liberation",
      "echo",
    ]);
  });
});
