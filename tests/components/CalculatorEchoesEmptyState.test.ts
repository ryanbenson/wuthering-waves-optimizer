import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import CalculatorEchoesEmptyState from "../../src/components/CalculatorEchoesEmptyState.vue";

describe("CalculatorEchoesEmptyState", () => {
  it("hides the saved-preset and theorycrafter options when there are none", () => {
    const { container } = render(CalculatorEchoesEmptyState, {
      props: { savedPresetCount: 0, communityPresetCount: 0 },
    });

    expect(container.querySelector("[data-test-echoes-empty-import]")).not.toBeNull();
    expect(container.querySelector("[data-test-echoes-empty-inventory]")).not.toBeNull();
    expect(container.querySelector("[data-test-echoes-empty-saved-presets]")).toBeNull();
    expect(container.querySelector("[data-test-echoes-empty-community]")).toBeNull();
  });

  it("shows counts and emits an event for each action", async () => {
    const { container, emitted } = render(CalculatorEchoesEmptyState, {
      props: { savedPresetCount: 4, communityPresetCount: 2 },
    });

    const saved = container.querySelector("[data-test-echoes-empty-saved-presets]") as HTMLElement;
    const community = container.querySelector("[data-test-echoes-empty-community]") as HTMLElement;
    expect(saved.textContent).toContain("4");
    expect(community.textContent).toContain("Use a theorycrafter build");
    expect(community.textContent).toContain("2");

    await fireEvent.click(container.querySelector("[data-test-echoes-empty-import]") as HTMLElement);
    await fireEvent.click(container.querySelector("[data-test-echoes-empty-inventory]") as HTMLElement);
    await fireEvent.click(saved);
    await fireEvent.click(community);

    expect(Object.keys(emitted())).toEqual(
      expect.arrayContaining(["import", "browse-inventory", "open-saved-presets", "open-community-builds"]),
    );
  });
});
