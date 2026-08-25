import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import AppFilterPanel from "../../src/components/AppFilterPanel.vue";

describe("AppFilterPanel", () => {
  it("starts closed and flips aria-expanded when the toggle is clicked", async () => {
    const { getByRole } = render(AppFilterPanel, {
      slots: { default: "<div>Filter body</div>" },
    });
    const toggle = getByRole("button", { name: /filters/i });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");

    await fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");

    await fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("shows the active filter count as a badge", () => {
    const { getByText } = render(AppFilterPanel, {
      props: { activeCount: 3 },
    });
    expect(getByText("3")).toBeTruthy();
  });

  it("hides the badge when there are no active filters", () => {
    const { queryByText } = render(AppFilterPanel, {
      props: { activeCount: 0 },
    });
    expect(queryByText("0")).toBeNull();
  });

  it("disables Clear all when clearDisabled is true", () => {
    const { getByText } = render(AppFilterPanel, {
      props: { clearDisabled: true },
    });
    const clearButton = getByText("Clear all").closest(
      "button",
    ) as HTMLButtonElement;
    expect(clearButton.disabled).toBe(true);
  });

  it("emits clear when Clear all is clicked", async () => {
    const { getByText, emitted } = render(AppFilterPanel, {
      props: { clearDisabled: false },
    });
    await fireEvent.click(getByText("Clear all").closest("button")!);
    expect(emitted().clear).toBeTruthy();
  });

  it("renders bar and default slot content", () => {
    const { getByPlaceholderText, getByText } = render(AppFilterPanel, {
      slots: {
        bar: "<input placeholder='Search teams…' />",
        default: "<div>Cost filter</div>",
      },
    });
    expect(getByPlaceholderText("Search teams…")).toBeTruthy();
    expect(getByText("Cost filter")).toBeTruthy();
  });
});
