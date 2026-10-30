import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import TeamRotationLanesChart from "../../src/components/TeamRotationLanesChart.vue";
import type { StripBlock, TimelineStrip } from "../../src/calculator/rotationTimelineStrip";

function block(overrides: Partial<StripBlock> & Pick<StripBlock, "id">): StripBlock {
  return {
    label: overrides.id,
    slot: 0,
    kind: "skill",
    value: 100,
    isDamage: true,
    startFrame: 0,
    frames: 60,
    landingFrame: 30,
    end: "full",
    missing: false,
    ...overrides,
  };
}

// A quick-swap shape: Hsin, Suoming, Hsin again, with an off-field tick from Suoming.
function strip(turns = 3): TimelineStrip {
  const blocks = Array.from({ length: turns }, (_, index) =>
    block({
      id: `t${index}`,
      label: index % 2 ? "Liberation" : "Skill",
      slot: index % 2,
      startFrame: index * 60,
      landingFrame: index * 60 + 30,
      value: 100 * (index + 1),
      end: index === 0 ? "swap" : "full",
    }),
  );
  blocks.push(block({ id: "tick", label: "Tick", slot: 1, startFrame: 0, frames: 0, landingFrame: 150, value: 50 }));
  const landings = blocks.map((b) => ({ frame: b.landingFrame, value: b.value })).sort((a, b) => a.frame - b.frame);
  let running = 0;
  return {
    blocks: blocks.sort((a, b) => a.startFrame - b.startFrame),
    totalFrames: turns * 60,
    cumulative: [{ frame: 0, value: 0 }, ...landings.map((l) => ({ frame: l.frame, value: (running += l.value) }))],
    maxValue: Math.max(...blocks.map((b) => b.value)),
  };
}

describe("TeamRotationLanesChart", () => {
  it("draws one row per character with their share of the damage", () => {
    const { getAllByText, getByText } = render(TeamRotationLanesChart, {
      props: { strip: strip(), slotNames: ["Hsin", "Suoming", null] },
    });
    expect(getAllByText("Hsin").length).toBeGreaterThan(0);
    expect(getAllByText("Suoming").length).toBeGreaterThan(0);
    // Hsin: 100 + 300 of 650.
    expect(getByText("62% of damage")).toBeTruthy();
    expect(getByText("38% of damage")).toBeTruthy();
  });

  it("puts each block in its character's row and an off-field hit as a ring there", () => {
    const { container } = render(TeamRotationLanesChart, {
      props: { strip: strip(), slotNames: ["Hsin", "Suoming", null] },
    });
    const y = (id: string) => container.querySelector(`[data-test-rotation-timeline-block='${id}']`);
    expect(y("t0")?.getAttribute("y")).toBe(y("t2")?.getAttribute("y"));
    expect(y("t0")?.getAttribute("y")).not.toBe(y("t1")?.getAttribute("y"));
    expect(y("tick")?.tagName).toBe("circle");
    // Swap lines mark the two changes of character.
    expect(container.querySelectorAll(".lanes-chart__swap-line")).toHaveLength(2);
  });

  it("names the character in the readout and emits the clicked action", async () => {
    const { container, emitted, getByText } = render(TeamRotationLanesChart, {
      props: { strip: strip(), slotNames: ["Hsin", "Suoming", null] },
    });
    const t1 = container.querySelector("[data-test-rotation-timeline-block='t1']") as Element;
    await fireEvent.focus(t1);
    expect(getByText("Suoming: Liberation")).toBeTruthy();
    await fireEvent.click(t1);
    expect(emitted().select[0]).toEqual(["t1"]);
  });

  it("lists turns on field with the team's damage in each, collapsed after 8", async () => {
    const { container, getByText } = render(TeamRotationLanesChart, {
      props: { strip: strip(10), slotNames: ["Hsin", "Suoming", null] },
    });
    const rows = () => container.querySelectorAll("[data-test-team-rotation-stint]");
    expect(rows()).toHaveLength(8);
    expect(rows()[0].textContent).toContain("Hsin");
    expect(rows()[0].textContent).toContain("0.0–1.0s");
    await fireEvent.click(getByText("Show all 10 turns"));
    expect(rows()).toHaveLength(10);
  });
});
