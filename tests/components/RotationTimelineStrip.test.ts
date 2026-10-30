import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import RotationTimelineStrip from "../../src/components/RotationTimelineStrip.vue";
import type { TimelineStrip } from "../../src/calculator/rotationTimelineStrip";

function strip(overrides: Partial<TimelineStrip> = {}): TimelineStrip {
  return {
    blocks: [
      { id: "a", label: "Skill", slot: 0, value: 200, startFrame: 0, frames: 60, landingFrame: 30, end: "cancel", missing: false },
      { id: "b", label: "Tick", slot: 1, value: 50, startFrame: 60, frames: 0, landingFrame: 90, end: "full", missing: false },
      { id: "c", label: "Swap", slot: 1, value: 100, startFrame: 60, frames: 60, landingFrame: 80, end: "swap", missing: false },
    ],
    totalFrames: 120,
    cumulative: [
      { frame: 0, value: 0 },
      { frame: 30, value: 200 },
      { frame: 80, value: 300 },
      { frame: 90, value: 350 },
    ],
    maxValue: 200,
    ...overrides,
  };
}

describe("RotationTimelineStrip", () => {
  it("places blocks on the time axis and sizes them by damage", () => {
    const { container } = render(RotationTimelineStrip, { props: { strip: strip() } });
    const a = container.querySelector("[data-test-rotation-timeline-block='a']") as HTMLElement;
    const c = container.querySelector("[data-test-rotation-timeline-block='c']") as HTMLElement;
    expect(a.style.left).toBe("0%");
    expect(a.style.width).toBe("50%");
    expect(a.style.height).toBe("100%");
    expect(c.style.left).toBe("50%");
    expect(c.style.height).toBe("50%");
    expect(a.getAttribute("title")).toBe("Skill · 0.00s–1.00s · 200 · Cancel");
    expect(c.dataset.end).toBe("swap");
    expect(c.className).toContain("timeline-strip__block--end-swap");
  });

  it("draws off-field actions as a marker where their damage lands", () => {
    const { container } = render(RotationTimelineStrip, { props: { strip: strip() } });
    const b = container.querySelector("[data-test-rotation-timeline-block='b']") as HTMLElement;
    expect(b.style.left).toBe("75%");
    expect(b.className).toContain("timeline-strip__block--instant");
    expect(b.getAttribute("title")).toBe("Tick · at 1.50s · 50");
  });

  it("names each team slot in the legend and emits the clicked action", async () => {
    const { container, emitted, getByText } = render(RotationTimelineStrip, {
      props: { strip: strip(), slotNames: ["Suoming", "Hsin", null] },
    });
    expect(getByText("Suoming")).toBeTruthy();
    expect(getByText("Hsin")).toBeTruthy();
    await fireEvent.click(container.querySelector("[data-test-rotation-timeline-block='c']") as HTMLElement);
    expect(emitted().select[0]).toEqual(["c"]);
  });

  it("draws the running total as a step line and leaves it out when there's no damage", () => {
    const { container, unmount } = render(RotationTimelineStrip, { props: { strip: strip() } });
    expect(container.querySelector(".timeline-strip__total path")?.getAttribute("d")).toBe(
      "M0 100 H250.0 V42.9 H666.7 V14.3 H750.0 V0.0 H1000",
    );
    unmount();
    const empty = render(RotationTimelineStrip, {
      props: { strip: strip({ cumulative: [{ frame: 0, value: 0 }] }) },
    });
    expect(empty.container.querySelector(".timeline-strip__total")).toBeNull();
  });
});
