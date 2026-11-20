import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render, fireEvent } from "@testing-library/vue";
import CalculatorLiveResultAttacks from "../../src/components/CalculatorLiveResultAttacks.vue";
import { useSettingsStore } from "../../src/stores/settings";

const ALL_DAMAGES = {
  value: {
    basicAttacks: [
      { key: "cut1", type: "Basic", label: "Cut 1", damage: { totalDamage: 100, avgDamage: 200, critDamage: 250 } },
    ],
    skillAttacks: [
      { key: "spin", type: "Skill", label: "Spin", damage: { totalDamage: 300, avgDamage: 600, critDamage: 750 } },
      { key: "slam", type: "Skill", label: "Slam", damage: { totalDamage: 400, avgDamage: 800, critDamage: 1000 } },
    ],
  },
};

function renderAttacks(props: Record<string, unknown> = {}) {
  return render(CalculatorLiveResultAttacks, {
    props: { character: "Camellya", allDamages: ALL_DAMAGES, target: "Attack:skillAttacks|slam", ...props },
    global: { directives: { tooltip: () => {} } },
  });
}

const toggleOf = (container: Element, group: string) =>
  container.querySelector(
    `[data-test-live-result-attack-group-key="${group}"] [data-test-live-result-attack-group-toggle]`,
  )!;

describe("CalculatorLiveResultAttacks", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("opens the Pinned section and the target group by default, and tags the target attack", () => {
    const { container } = renderAttacks();
    expect(toggleOf(container, "pinnedAttacks").getAttribute("aria-expanded")).toBe("true");
    expect(toggleOf(container, "skillAttacks").getAttribute("aria-expanded")).toBe("true");
    expect(toggleOf(container, "basicAttacks").getAttribute("aria-expanded")).toBe("false");
    expect(
      container.querySelector('[data-test-live-result-attack-row="skillAttacks|slam"]')?.textContent,
    ).toContain("Target");
  });

  it("saves open/closed per character, and a closed target group stays closed", async () => {
    const { container, unmount } = renderAttacks();
    await fireEvent.click(toggleOf(container, "skillAttacks"));
    await fireEvent.click(toggleOf(container, "basicAttacks"));

    const settings = useSettingsStore();
    expect(settings.config.attackGroupsOpenByCharacter.Camellya).toEqual({
      skillAttacks: false,
      basicAttacks: true,
    });
    unmount();

    // Re-mounted (as happens on every recalc) — the saved choice wins.
    const { container: again } = renderAttacks();
    expect(toggleOf(again, "skillAttacks").getAttribute("aria-expanded")).toBe("false");
    expect(toggleOf(again, "basicAttacks").getAttribute("aria-expanded")).toBe("true");
  });

  it("pinning an attack adds it to the Pinned section; unpinning removes it", async () => {
    const { container } = renderAttacks();
    const pinned = () => container.querySelector('[data-test-live-result-attack-group-key="pinnedAttacks"]')!;
    expect(pinned().querySelector("[data-test-live-result-pinned-attacks-hint]")).not.toBeNull();

    const spinRow = container.querySelector(
      '[data-test-live-result-attack-group-key="skillAttacks"] [data-test-live-result-attack-row="skillAttacks|spin"]',
    )!;
    await fireEvent.click(spinRow.querySelector("[data-test-live-result-attack-pin]")!);

    expect(pinned().textContent).toContain("Spin");
    expect(pinned().textContent).toContain("Skill");
    expect(useSettingsStore().config.pinnedAttacksByCharacter.Camellya).toEqual({ "skillAttacks|spin": true });

    await fireEvent.click(pinned().querySelector("[data-test-live-result-attack-pin]")!);
    expect(pinned().textContent).not.toContain("Spin");
  });

  it("ignores saved pins for attacks that no longer exist", () => {
    useSettingsStore().setConfig({
      pinnedAttacksByCharacter: { Camellya: { "skillAttacks|gone": true, "basicAttacks|cut1": true } },
    });
    const { container } = renderAttacks();
    const rows = container.querySelectorAll(
      '[data-test-live-result-attack-group-key="pinnedAttacks"] [data-test-live-result-attack-row]',
    );
    expect([...rows].map((r) => r.getAttribute("data-test-live-result-attack-row"))).toEqual(["basicAttacks|cut1"]);
  });

  it("Collapse all closes and saves every group", async () => {
    const { container, getByText } = renderAttacks();
    await fireEvent.click(getByText("Collapse all"));
    expect(toggleOf(container, "skillAttacks").getAttribute("aria-expanded")).toBe("false");
    expect(toggleOf(container, "pinnedAttacks").getAttribute("aria-expanded")).toBe("false");
    expect(useSettingsStore().config.attackGroupsOpenByCharacter.Camellya).toEqual({
      pinnedAttacks: false,
      basicAttacks: false,
      skillAttacks: false,
    });
  });

  it("collapsing the Pinned section is saved and survives a re-mount", async () => {
    const { container, unmount } = renderAttacks();
    await fireEvent.click(toggleOf(container, "pinnedAttacks"));
    expect(toggleOf(container, "pinnedAttacks").getAttribute("aria-expanded")).toBe("false");
    unmount();

    const { container: again } = renderAttacks();
    expect(toggleOf(again, "pinnedAttacks").getAttribute("aria-expanded")).toBe("false");
    // Other characters keep the default.
    const { container: other } = renderAttacks({ character: "Jinhsi" });
    expect(toggleOf(other, "pinnedAttacks").getAttribute("aria-expanded")).toBe("true");
  });

  it("the Pins Left/Right choice is global and moves every pin", async () => {
    const { container, unmount } = renderAttacks();
    const leftBtn = container.querySelector('[data-test-live-result-attacks-pin-side="left"]')!;
    expect(leftBtn.getAttribute("aria-pressed")).toBe("true");

    await fireEvent.click(container.querySelector('[data-test-live-result-attacks-pin-side="right"]')!);
    expect(useSettingsStore().config.attackPinSide).toBe("right");
    expect(container.querySelector('[data-test-live-result-attack-row="skillAttacks|slam"] td.row-end')).not.toBeNull();
    unmount();

    const { container: other } = renderAttacks({ character: "Jinhsi" });
    expect(
      other.querySelector('[data-test-live-result-attacks-pin-side="right"]')!.getAttribute("aria-pressed"),
    ).toBe("true");
  });
});
