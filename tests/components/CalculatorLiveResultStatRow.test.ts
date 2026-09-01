import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import CalculatorLiveResultStatRow from "../../src/components/CalculatorLiveResultStatRow.vue";

function renderRow(overrideProps: Record<string, unknown> = {}) {
  return render(CalculatorLiveResultStatRow, {
    props: {
      statKey: "totalCritDMG",
      icon: "https://ryanbenson.github.io/wuthering-waves-assets/images/critdamage.png",
      label: "Crit DMG",
      value: "213.8%",
      pinned: false,
      ...overrideProps,
    },
    global: {
      directives: { tooltip: () => {} },
    },
  });
}

describe("CalculatorLiveResultStatRow", () => {
  it("renders the icon, label, and formatted value", () => {
    const { container } = renderRow();
    expect(container.textContent).toContain("Crit DMG");
    expect(container.textContent).toContain("213.8%");
    expect(container.querySelector("img")?.getAttribute("src")).toContain("critdamage.png");
  });

  it("shows the pin button as unpressed when not pinned, pressed when pinned", () => {
    const { container: unpinned } = renderRow({ pinned: false });
    expect(
      unpinned.querySelector("[data-test-live-result-stat-row-pin]")?.getAttribute("aria-pressed"),
    ).toBe("false");

    const { container: pinned } = renderRow({ pinned: true });
    expect(
      pinned.querySelector("[data-test-live-result-stat-row-pin]")?.getAttribute("aria-pressed"),
    ).toBe("true");
  });

  it("clicking the pin button emits toggle-pin with the stat key, not stat-selected", async () => {
    const { container, emitted } = renderRow({ statKey: "totalHp" });
    const pinButton = container.querySelector("[data-test-live-result-stat-row-pin]")!;

    await fireEvent.click(pinButton);

    expect(emitted()["toggle-pin"]).toEqual([["totalHp"]]);
    expect(emitted()["stat-selected"]).toBeUndefined();
  });

  it("clicking the row (not the pin button) emits stat-selected with the label", async () => {
    const { container, emitted } = renderRow({ label: "Crit DMG" });
    const row = container.querySelector("[data-test-live-result-stat-row]")!;

    await fireEvent.click(row);

    expect(emitted()["stat-selected"]).toEqual([["Crit DMG"]]);
    expect(emitted()["toggle-pin"]).toBeUndefined();
  });
});
