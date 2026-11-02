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

describe("CalculatorLiveResultStatRow — build-vs-live bar (ADR 0051)", () => {
  const buffedShare = { build: 0.57, buffs: 0.43, hasBuffs: true, buildText: "2,000", buffsText: "+1,500" };

  it("renders no bar or split text without a share", () => {
    const { container } = renderRow();
    expect(container.querySelector("[data-test-live-result-stat-row-bar]")).toBeNull();
    expect(container.querySelector("[data-test-live-result-stat-row-split]")).toBeNull();
  });

  it("renders the two-tone bar and the build + buffs text when buffed", () => {
    const { container } = renderRow({ statKey: "totalAtk", label: "ATK", value: "3,500", share: buffedShare });
    const bar = container.querySelector("[data-test-live-result-stat-row-bar]")!;
    expect(bar).not.toBeNull();
    expect(bar.getAttribute("aria-hidden")).toBe("true");
    expect(
      (container.querySelector("[data-test-live-result-stat-row-bar-buffs]") as HTMLElement).style.width,
    ).toBe("43%");
    expect(container.querySelector("[data-test-live-result-stat-row-split]")?.textContent).toBe("2,000 +1,500");
  });

  it("shows the bar but no split text when buffs add nothing", () => {
    const { container } = renderRow({
      share: { build: 1, buffs: 0, hasBuffs: false, buildText: "213.8%", buffsText: "" },
    });
    expect(container.querySelector("[data-test-live-result-stat-row-bar]")).not.toBeNull();
    expect(container.querySelector("[data-test-live-result-stat-row-split]")).toBeNull();
  });

  it("clicking the bar row also opens the stat", async () => {
    const { container, emitted } = renderRow({ label: "ATK", share: buffedShare });
    await fireEvent.click(container.querySelector("[data-test-live-result-stat-row-bar]")!);
    expect(emitted()["stat-selected"]).toEqual([["ATK"]]);
  });
});
