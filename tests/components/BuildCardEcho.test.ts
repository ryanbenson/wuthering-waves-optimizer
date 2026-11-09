import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render } from "@testing-library/vue";
import BuildCardEcho from "../../src/components/buildCard/BuildCardEcho.vue";

function baseProps(overrides: Record<string, unknown> = {}) {
  return {
    rank: 5,
    type: "4",
    echo: "AeroDrake",
    echoId: "echo-1",
    echoSet: "MoltenRift",
    stat: "CritRate",
    echoSubStatsType1: "CritRate",
    echoSubStatsValue1: 7.5,
    echoSubStatsType2: "CritDMG",
    echoSubStatsValue2: 16.2,
    echoSubStatsType3: "ATK",
    echoSubStatsValue3: 9.4,
    echoSubStatsType4: "ATK_FLAT",
    echoSubStatsValue4: 50,
    echoSubStatsType5: "EnergyRegen",
    echoSubStatsValue5: 8,
    ...overrides,
  };
}

describe("BuildCardEcho", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it.each(["card", "column", "row"] as const)("renders as an .echo__item in the %s variant", (variant) => {
    const { container } = render(BuildCardEcho, { props: baseProps({ variant }) });
    expect(container.querySelector(".echo__item")).toBeTruthy();
    expect(container.querySelector("[data-test-build-card-echo-substats]")).toBeTruthy();
  });

  it("shows one substat per filled slot and skips empty ones", () => {
    const { container } = render(BuildCardEcho, {
      props: baseProps({ echoSubStatsType5: "none" }),
    });
    expect(container.querySelectorAll(".build-card-echo__substat").length).toBe(4);
  });

  it("colors each substat by roll quality like the rest of the app", () => {
    const { container } = render(BuildCardEcho, { props: baseProps() });
    // CritRate 7.5 lands in the mid (blue) bucket.
    const value = container.querySelector(".build-card-echo__substat-value");
    expect(value?.className).toContain("text-blue-500");
  });

  it("dims substats the character's Substat Score ignores", () => {
    // Iuno's curated substat weights give DEF% a weight of 0.
    const { container } = render(BuildCardEcho, {
      props: baseProps({ characterId: "Iuno", echoSubStatsType5: "DEF", echoSubStatsValue5: 8.1 }),
    });
    const rows = Array.from(container.querySelectorAll(".build-card-echo__substat"));
    const def = rows.find((row) => row.textContent?.includes("DEF%"));
    const critRate = rows.find((row) => row.textContent?.includes("Crit Rate"));
    expect(def?.classList.contains("is-dim")).toBe(true);
    expect(critRate?.classList.contains("is-dim")).toBe(false);
  });

  it("uses full substat names in the card variant and short ones in the column variant", () => {
    const props = baseProps({ echoSubStatsType5: "ResonanceLiberationDMGBonus", echoSubStatsValue5: 8.6 });
    const card = render(BuildCardEcho, { props: { ...props, variant: "card" } });
    expect(card.container.textContent).toContain("Resonance Liberation DMG Bonus");
    card.unmount();
    const column = render(BuildCardEcho, { props: { ...props, variant: "column" } });
    expect(column.container.textContent).toContain("Liberation DMG");
    expect(column.container.textContent).not.toContain("Resonance Liberation DMG Bonus");
  });

  it("shows no CV or grade for an empty slot", () => {
    const { container } = render(BuildCardEcho, {
      props: { variant: "card", echoId: "empty" },
    });
    expect(container.textContent).not.toContain("CV");
  });
});
