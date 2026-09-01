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

  it("shows a peek of the top attack's average damage while collapsed, no table", () => {
    const { container } = renderGroup({ expanded: false });
    expect(container.querySelector("[data-test-live-result-attack-group-peek]")?.textContent).toContain(
      "9,210",
    );
    expect(container.querySelector("table")).toBeNull();
  });

  it("renders the full damage table and hides the peek when expanded", () => {
    const { container } = renderGroup({ expanded: true });
    expect(container.querySelector("[data-test-live-result-attack-group-peek]")).toBeNull();
    expect(container.textContent).toContain("Cut 1");
    expect(container.textContent).toContain("Cut 2");
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
