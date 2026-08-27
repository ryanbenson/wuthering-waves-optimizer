import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render, fireEvent } from "@testing-library/vue";
import AppFilterPanel from "../../src/components/AppFilterPanel.vue";

describe("AppFilterPanel", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("starts open and flips aria-expanded when the toggle is clicked", async () => {
    const { getByRole } = render(AppFilterPanel, {
      props: { panelKey: "test-panel" },
      slots: { default: "<div>Filter body</div>" },
    });
    const toggle = getByRole("button", { name: /filters/i });
    expect(toggle.getAttribute("aria-expanded")).toBe("true");

    await fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");

    await fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
  });

  it("shows the active filter count as a badge", () => {
    const { getByText } = render(AppFilterPanel, {
      props: { panelKey: "test-panel", activeCount: 3 },
    });
    expect(getByText("3")).toBeTruthy();
  });

  it("hides the badge when there are no active filters", () => {
    const { queryByText } = render(AppFilterPanel, {
      props: { panelKey: "test-panel", activeCount: 0 },
    });
    expect(queryByText("0")).toBeNull();
  });

  it("disables Clear all when clearDisabled is true", () => {
    const { getByText } = render(AppFilterPanel, {
      props: { panelKey: "test-panel", clearDisabled: true },
    });
    const clearButton = getByText("Clear all").closest(
      "button",
    ) as HTMLButtonElement;
    expect(clearButton.disabled).toBe(true);
  });

  it("emits clear when Clear all is clicked", async () => {
    const { getByText, emitted } = render(AppFilterPanel, {
      props: { panelKey: "test-panel", clearDisabled: false },
    });
    await fireEvent.click(getByText("Clear all").closest("button")!);
    expect(emitted().clear).toBeTruthy();
  });

  it("renders bar and default slot content", () => {
    const { getByPlaceholderText, getByText } = render(AppFilterPanel, {
      props: { panelKey: "test-panel" },
      slots: {
        bar: "<input placeholder='Search teams…' />",
        default: "<div>Cost filter</div>",
      },
    });
    expect(getByPlaceholderText("Search teams…")).toBeTruthy();
    expect(getByText("Cost filter")).toBeTruthy();
  });

  it("remembers the open/closed state per panelKey across renders", async () => {
    const first = render(AppFilterPanel, {
      props: { panelKey: "remember-me" },
    });
    const firstToggle = first.getByRole("button", { name: /filters/i });
    await fireEvent.click(firstToggle);
    expect(firstToggle.getAttribute("aria-expanded")).toBe("false");
    first.unmount();

    const second = render(AppFilterPanel, {
      props: { panelKey: "remember-me" },
    });
    const secondToggle = second.getByRole("button", { name: /filters/i });
    expect(secondToggle.getAttribute("aria-expanded")).toBe("false");
  });
});
