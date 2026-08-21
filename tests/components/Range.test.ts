import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, Pinia } from "pinia";
import { render } from "@testing-library/vue";
import Range from "../../src/components/input/Range.vue";

let pinia: Pinia;

beforeEach(() => {
  pinia = createPinia();
});

describe("Range tick marks", () => {
  it("does not render tick marks by default", () => {
    const { container } = render(Range, {
      props: { id: "CritRate", values: [6.3, 6.9, 7.5, 8.1] },
      global: { plugins: [pinia] },
    });
    expect(container.querySelector(".range-slider__ticks")).toBeNull();
  });

  it("renders a tick mark per value showing the stop value when showTicks is true", () => {
    const { container, getByText } = render(Range, {
      props: { id: "CritRate", values: [6.3, 6.9, 7.5, 8.1], showTicks: true },
      global: { plugins: [pinia] },
    });
    const ticks = container.querySelectorAll(".range-slider__tick");
    expect(ticks.length).toBe(4);
    expect(getByText("6.3")).toBeTruthy();
    expect(getByText("8.1")).toBeTruthy();
  });

  it("keeps data-test attributes on the underlying input element", () => {
    const { container } = render(Range, {
      props: { id: "CritRate", values: [6.3, 6.9, 7.5, 8.1], showTicks: true },
      attrs: { "data-test-substat-range": "CritRate" },
      global: { plugins: [pinia] },
    });
    const input = container.querySelector(
      'input[data-test-substat-range="CritRate"]',
    );
    expect(input).toBeTruthy();
    expect(input?.tagName).toBe("INPUT");
  });

  it("insets tick positions by half the thumb width so they line up with the thumb's actual stop positions", () => {
    // Native range inputs travel from thumbWidth/2 to trackWidth-thumbWidth/2,
    // not edge to edge — ticks must be inset the same way or they drift out
    // of alignment with the thumb as the track's rendered width changes.
    const { container } = render(Range, {
      props: {
        id: "CritRate",
        values: [6.3, 6.9, 7.5, 8.1],
        showTicks: true,
        size: "sm",
      },
      global: { plugins: [pinia] },
    });
    const ticks = container.querySelectorAll(
      ".range-slider__tick",
    ) as NodeListOf<HTMLElement>;
    const thumbRem = 1.25; // range-sm thumb width
    const halfThumbRem = thumbRem / 2;

    // Parse out the rem inset and the 0-1 fraction of track width used for
    // each tick's `left`, regardless of how the calc() expression is ordered.
    function parseLeft(style: string) {
      const remMatch = style.match(/([\d.]+)rem/);
      const fractionMatch = style.match(/\*\s*([\d.]+)|([\d.]+)\s*\*/);
      return {
        inset: remMatch ? parseFloat(remMatch[1]) : NaN,
        fraction: fractionMatch
          ? parseFloat(fractionMatch[1] ?? fractionMatch[2])
          : NaN,
      };
    }

    const first = parseLeft(ticks[0].style.left);
    const middle = parseLeft(ticks[1].style.left);
    const last = parseLeft(ticks[3].style.left);

    expect(first.inset).toBeCloseTo(halfThumbRem);
    expect(first.fraction).toBeCloseTo(0);
    expect(last.inset).toBeCloseTo(halfThumbRem);
    expect(last.fraction).toBeCloseTo(1);
    expect(middle.inset).toBeCloseTo(halfThumbRem);
    expect(middle.fraction).toBeCloseTo(1 / 3);
  });
});
