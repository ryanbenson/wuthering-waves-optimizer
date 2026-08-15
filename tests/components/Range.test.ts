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
});
