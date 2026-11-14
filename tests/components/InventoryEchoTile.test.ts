import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render } from "@testing-library/vue";
import InventoryEchoTile from "../../src/components/InventoryEchoTile.vue";

const baseProps = {
  rank: 5,
  type: "1",
  echo: "AeroDrake",
  echoId: "",
  echoSet: "MoltenRift",
  stat: "CritRate",
  echoSubStatsType1: "CritRate",
  echoSubStatsValue1: 7.5,
  echoSubStatsType2: "",
  echoSubStatsValue2: "",
  echoSubStatsType3: "",
  echoSubStatsValue3: "",
  echoSubStatsType4: "",
  echoSubStatsValue4: "",
  echoSubStatsType5: "",
  echoSubStatsValue5: "",
  hideInventoryActions: true,
};

function renderTile(props: Record<string, unknown> = {}) {
  return render(InventoryEchoTile, {
    props: { ...baseProps, ...props },
    global: { directives: { tooltip: () => {} } },
  });
}

describe("InventoryEchoTile echo set (issue #708)", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("shows the set icon before the set name", () => {
    const { container } = renderTile();
    const set = container.querySelector("[data-test-echo-item-set]") as HTMLElement;
    const icon = set.querySelector("[data-test-echo-item-set-icon]") as HTMLImageElement;
    expect(icon.getAttribute("src")).toContain("/sets/MoltenRift.webp");
    expect(icon.getAttribute("alt")).toBe("Molten Rift");
    expect(set.textContent?.trim()).toBe("Molten Rift");
    expect(set.firstElementChild).toBe(icon);
  });

  it("shows no set icon or label when the echo has no set", () => {
    const { container } = renderTile({ echoSet: "" });
    expect(container.querySelector("[data-test-echo-item-set]")).toBeNull();
    expect(container.querySelector("[data-test-echo-item-set-icon]")).toBeNull();
  });
});
