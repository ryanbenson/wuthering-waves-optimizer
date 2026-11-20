import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render, fireEvent } from "@testing-library/vue";
import CalculatorLiveResultAttackGroup from "../../src/components/CalculatorLiveResultAttackGroup.vue";

const ATTACKS = [
  {
    key: "cut1",
    type: "Basic",
    label: "Cut 1",
    damage: { totalDamage: 4820, avgDamage: 9210, critDamage: 14760 },
  },
  {
    key: "cut2",
    type: "Basic",
    label: "Cut 2",
    damage: { totalDamage: 5140, avgDamage: 9830, critDamage: 15910 },
  },
];

function renderGroup(overrideProps: Record<string, unknown> = {}) {
  return render(CalculatorLiveResultAttackGroup, {
    props: {
      groupKey: "basicAttacks",
      label: "Basic Attacks",
      character: "Jinhsi",
      attacks: ATTACKS,
      isTarget: false,
      expanded: false,
      ...overrideProps,
    },
    global: {
      directives: { tooltip: () => {} },
    },
  });
}

describe("CalculatorLiveResultAttackGroup", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("shows no average number while collapsed, and no table", () => {
    const { container } = renderGroup({ expanded: false });
    expect(container.textContent).not.toContain("9,210");
    expect(container.textContent).not.toContain("avg");
    expect(container.querySelector("table")).toBeNull();
  });

  it("renders the full damage table when expanded", () => {
    const { container } = renderGroup({ expanded: true });
    expect(container.textContent).toContain("Cut 1");
    expect(container.textContent).toContain("Cut 2");
  });

  it("clicking a row's pin emits toggle-pin with the group|key id, not selected-attack", async () => {
    const { container, emitted } = renderGroup({ expanded: true });
    const pins = container.querySelectorAll("[data-test-live-result-attack-pin]");
    expect(pins).toHaveLength(2);

    await fireEvent.click(pins[1]);

    expect(emitted()["toggle-pin"]).toEqual([["basicAttacks|cut2"]]);
    expect(emitted()["selected-attack"]).toBeUndefined();
  });

  it("puts the pin before the name by default, and in a last cell when pinSide is right", () => {
    const { container: left } = renderGroup({ expanded: true });
    const leftRow = left.querySelector('[data-test-live-result-attack-row="basicAttacks|cut1"]')!;
    expect(leftRow.querySelector("td:first-child [data-test-live-result-attack-pin]")).not.toBeNull();
    expect(leftRow.querySelector("td.row-end")).toBeNull();
    expect(left.querySelectorAll("thead th")).toHaveLength(4);

    const { container: right } = renderGroup({ expanded: true, pinSide: "right" });
    const rightRow = right.querySelector('[data-test-live-result-attack-row="basicAttacks|cut1"]')!;
    expect(rightRow.querySelector("td:first-child [data-test-live-result-attack-pin]")).toBeNull();
    expect(rightRow.querySelector("td.row-end:last-child [data-test-live-result-attack-pin]")).not.toBeNull();
    expect(right.querySelectorAll("thead th")).toHaveLength(5);
  });

  it("marks pinned rows as pressed", () => {
    const { container } = renderGroup({ expanded: true, pinnedIds: new Set(["basicAttacks|cut1"]) });
    const pins = container.querySelectorAll("[data-test-live-result-attack-pin]");
    expect(pins[0].getAttribute("aria-pressed")).toBe("true");
    expect(pins[1].getAttribute("aria-pressed")).toBe("false");
  });

  it("tags only the optimizer's target attack row with Target", () => {
    const { container } = renderGroup({ expanded: true, targetAttackId: "basicAttacks|cut2" });
    const tags = container.querySelectorAll("[data-test-live-result-attack-target]");
    expect(tags).toHaveLength(1);
    expect(
      container.querySelector('[data-test-live-result-attack-row="basicAttacks|cut2"]')?.textContent,
    ).toContain("Target");
  });

  it("the pinned variant uses each row's own group for its id and shows its category", async () => {
    const { container, emitted } = renderGroup({
      groupKey: "pinnedAttacks",
      label: "Pinned",
      variant: "pinned",
      expanded: true,
      attacks: [{ ...ATTACKS[0], pinGroupKey: "basicAttacks", sourceLabel: "Basic" }],
      pinnedIds: new Set(["basicAttacks|cut1"]),
    });
    expect(container.textContent).toContain("Cut 1");
    expect(container.textContent).toContain("Basic");

    await fireEvent.click(container.querySelector("[data-test-live-result-attack-pin]")!);
    expect(emitted()["toggle-pin"]).toEqual([["basicAttacks|cut1"]]);
  });

  it("the pinned variant collapses like any group, keeping its count in the header", async () => {
    const { container, emitted } = renderGroup({
      groupKey: "pinnedAttacks",
      label: "Pinned",
      variant: "pinned",
      expanded: false,
      attacks: [{ ...ATTACKS[0], pinGroupKey: "basicAttacks", sourceLabel: "Basic" }],
    });
    expect(container.querySelector("table")).toBeNull();
    expect(container.textContent).toContain("(1)");

    await fireEvent.click(container.querySelector("[data-test-live-result-attack-group-toggle]")!);
    expect(emitted().toggle).toEqual([["pinnedAttacks"]]);
  });

  it("the pinned variant shows a hint when nothing is pinned", () => {
    const { container } = renderGroup({
      groupKey: "pinnedAttacks",
      label: "Pinned",
      variant: "pinned",
      expanded: true,
      attacks: [],
    });
    expect(container.querySelector("[data-test-live-result-pinned-attacks-hint]")).not.toBeNull();
    expect(container.querySelector("table")).toBeNull();
  });

  it("shows the attack count next to the title", () => {
    const { container } = renderGroup();
    expect(container.textContent).toContain("(2)");
  });

  it("shows a Target badge only when isTarget is true", () => {
    const { container: withTarget } = renderGroup({ isTarget: true });
    expect(withTarget.textContent).toContain("Target");

    const { container: withoutTarget } = renderGroup({ isTarget: false });
    expect(withoutTarget.textContent).not.toContain("Target");
  });

  it("clicking the header emits toggle with the group key, and does not toggle its own expanded state", async () => {
    const { container, emitted } = renderGroup({ expanded: false });
    const header = container.querySelector("[data-test-live-result-attack-group-toggle]")!;

    await fireEvent.click(header);

    expect(emitted().toggle).toEqual([["basicAttacks"]]);
    // Controlled component — still collapsed until the parent passes expanded=true.
    expect(container.querySelector("table")).toBeNull();
  });
});
