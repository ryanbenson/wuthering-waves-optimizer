import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import RotationTimelineChart from "../../src/components/RotationTimelineChart.vue";
import type { StripBlock, TimelineStrip } from "../../src/calculator/rotationTimelineStrip";

function block(overrides: Partial<StripBlock> & Pick<StripBlock, "id">): StripBlock {
  return {
    label: overrides.id,
    slot: null,
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

// jsdom has no layout, so the chart draws at its 640px fallback width.
function strip(): TimelineStrip {
  return {
    blocks: [
      block({ id: "a", label: "Skill", value: 200, end: "cancel" }),
      block({ id: "b", label: "Basic", kind: "basic", startFrame: 60, landingFrame: 90, value: 100 }),
      block({ id: "c", label: "Outro", kind: "introOutro", startFrame: 120, frames: 0, landingFrame: 120, value: 300 }),
    ],
    totalFrames: 120,
    cumulative: [
      { frame: 0, value: 0 },
      { frame: 30, value: 200 },
      { frame: 90, value: 300 },
      { frame: 120, value: 600 },
    ],
    maxValue: 300,
  };
}

describe("RotationTimelineChart", () => {
  it("opens on the pace view: the running total, a band of what you did, and the biggest hits named", () => {
    const { container, getByText } = render(RotationTimelineChart, { props: { strip: strip() } });
    expect(container.querySelector("[data-test-rotation-pace-chart]")).not.toBeNull();
    expect(container.querySelector(".rotation-chart__line")?.getAttribute("d")).toMatch(/^M40\.0 182\.0 H/);
    // Every action has one mark in the band, and none is narrower than 6px.
    const marks = container.querySelectorAll("[data-test-rotation-timeline-block]");
    expect(marks).toHaveLength(3);
    for (const rect of container.querySelectorAll("rect[data-test-rotation-timeline-block]")) {
      expect(Number(rect.getAttribute("width"))).toBeGreaterThanOrEqual(6);
    }
    // The off-field Outro is a dot where it lands.
    expect(container.querySelector("circle[data-test-rotation-timeline-block='c']")).not.toBeNull();
    expect(getByText("Outro +300")).toBeTruthy();
    expect(getByText("Skill +200")).toBeTruthy();
  });

  // jsdom's pointer events carry no pointerType, so focus stands in for hover.
  it("shows a focused action in the readout and jumps to it on a click", async () => {
    const { container, emitted, getByText } = render(RotationTimelineChart, { props: { strip: strip() } });
    const a = container.querySelector("[data-test-rotation-timeline-block='a']") as Element;
    await fireEvent.focus(a);
    expect(getByText("0.00s–1.00s (1.00s) · 200 damage · Cancel")).toBeTruthy();
    await fireEvent.click(a);
    expect(emitted().select[0]).toEqual(["a"]);
  });

  it("on a tap, shows the details with a link to the action instead of jumping away", async () => {
    const { container, emitted, getByText } = render(RotationTimelineChart, { props: { strip: strip() } });
    const c = container.querySelector("[data-test-rotation-timeline-block='c']") as Element;
    await fireEvent.pointerDown(c, { pointerType: "touch" });
    await fireEvent.click(c);
    expect(emitted().select).toBeUndefined();
    expect(getByText("Lands at 2.00s · no field time · 300 damage")).toBeTruthy();
    await fireEvent.click(container.querySelector("[data-test-rotation-chart-goto]") as Element);
    expect(emitted().select[0]).toEqual(["c"]);
  });

  it("switches to the detailed view: named blocks over damage bars, with no-time actions past the end", async () => {
    const { container, getByText } = render(RotationTimelineChart, { props: { strip: strip() } });
    await fireEvent.click(container.querySelector("[data-test-rotation-chart-view='detailed']") as Element);
    expect(container.querySelector("[data-test-rotation-detailed-chart]")).not.toBeNull();
    expect(getByText("no time")).toBeTruthy();
    expect(container.querySelector("path[data-test-rotation-timeline-block='c']")).not.toBeNull();
    // The cancelled Skill gets a notch; one test id per action, not per mark.
    expect(container.querySelectorAll("[data-test-rotation-chart-notch]")).toHaveLength(1);
    expect(container.querySelectorAll("[data-test-rotation-timeline-block='a']")).toHaveLength(1);
    expect(getByText("Ended early")).toBeTruthy();
  });

  it("summarizes field time against damage by kind, with only the kinds present in the legend", () => {
    const { container } = render(RotationTimelineChart, { props: { strip: strip() } });
    const legend = container.querySelector("[data-test-rotation-timeline-legend]")?.textContent ?? "";
    expect(legend).toContain("Intro & Outro");
    expect(legend).not.toContain("Liberation");
    // The Outro takes no time, so it only has a damage segment: 300 of 600.
    expect(container.querySelector("[data-test-rotation-share-segment='Field time:introOutro']")).toBeNull();
    const outro = container.querySelector("[data-test-rotation-share-segment='Damage:introOutro']") as HTMLElement;
    expect(outro.style.width).toBe("50%");
    expect(outro.getAttribute("title")).toBe("Intro & Outro: 300 · 50% of damage");
  });
});
