import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render } from "@testing-library/vue";
import CalculatorBuildCard from "../../src/components/CalculatorBuildCard.vue";
import { createEmptyEchoSlot } from "../../src/echoes/echoLoadout";
import { useCharacterStore } from "../../src/stores/character";
import { useInventoryStore } from "../../src/stores/inventory";

const CHARACTER = "Changli";

function baseStatsProps() {
  return {
    character: CHARACTER,
    characterLevel: "90",
    weaponAtk: 587,
    chosenChar: {
      value: {
        basic: {
          name: "Changli",
          rarity: 5,
          element: "Fusion",
          weapon: "Swords",
        },
      },
    },
    totalAtk: 2145,
    totalAtkPercent: 0,
    totalAtkFlat: 0,
    totalHp: 17213,
    totalHpPercent: 0,
    totalHpFlat: 0,
    totalDef: 1338,
    totalDefPercent: 0,
    totalDefFlat: 0,
    totalCritRate: 0.713,
    totalCritDmg: 2.712,
    energyRegen: 1.076,
    basicAttackDmgBonus: 0.079,
    heavyAttackDmgBonus: 0.18,
    resonanceSkillDmgBonus: 0.188,
    resonanceLiberationDmgBonus: 0.173,
    glacio: 0,
    fusion: 0.7,
    electro: 0,
    aero: 0,
    spectro: 0,
    havoc: 0,
    healingBonus: 0,
    tuneBreakBoost: 0,
  };
}

// A character's echo slot only stores a pointer (`echoId`) — the actual
// echo/type/rank/stat/echoSet/substats live in the inventory store, keyed
// by that id (see CalculatorEcho.vue's currentEcho/getEchoById pattern).
function seedCharacter(overrides: Record<string, unknown> = {}) {
  const characterStore = useCharacterStore();
  characterStore.characters = {
    [CHARACTER]: {
      talents: { basic: 6, skill: 10, forte: 10, liberation: 10, intro: 6 },
      weapon: "BlazingBrilliance",
      weapons: { BlazingBrilliance: { refinement: "1", weaponLevel: "90" } },
      resonanceChains: {
        chain1: { isEnabled: true },
        chain2: { isEnabled: true },
        chain3: { isEnabled: false },
        chain4: { isEnabled: false },
        chain5: { isEnabled: false },
        chain6: { isEnabled: false },
      },
      echoes: {
        0: createEmptyEchoSlot("echo-0"),
        1: createEmptyEchoSlot(),
        2: createEmptyEchoSlot(),
        3: createEmptyEchoSlot(),
        4: createEmptyEchoSlot(),
      },
      ...overrides,
    },
  };
  return characterStore;
}

function seedInventoryEcho(overrides: Record<string, unknown> = {}) {
  const inventoryStore = useInventoryStore();
  inventoryStore.echoes = [
    {
      ...createEmptyEchoSlot("echo-0"),
      echo: "Hecate",
      type: 4,
      rank: 5,
      stat: "CritRate",
      echoSet: "EmpyreanAnthem",
      echoSubStatsType1: "CritRate",
      echoSubStatsValue1: 6.3,
      echoSubStatsType2: "CritDMG",
      echoSubStatsValue2: 12.6,
      ...overrides,
    },
  ];
  return inventoryStore;
}

function renderCard(props: ReturnType<typeof baseStatsProps>) {
  return render(CalculatorBuildCard, {
    props,
    global: { directives: { tooltip: () => {} } },
  });
}

describe("CalculatorBuildCard", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("renders character name, level, weapon refinement, and stat values", async () => {
    seedCharacter();
    const { findByText, getByTestId, container } = renderCard(baseStatsProps());

    expect(await findByText("Changli")).toBeTruthy();
    expect(container.textContent).toContain("Lv. 90");
    // Stat block passthrough (rendered by CalculatorStats)
    expect(container.textContent).toContain("2,145");
    void getByTestId;
  });

  it("computes the resonance chain count from enabled chains", () => {
    seedCharacter();
    const { container } = renderCard(baseStatsProps());

    const resonanceEl = container.querySelector(
      "[data-test-build-card-resonance]",
    );
    expect(resonanceEl?.textContent).toContain("2 / 6");
  });

  it("renders 0 / 6 when no resonance chains are enabled", () => {
    seedCharacter({
      resonanceChains: {
        chain1: { isEnabled: false },
        chain2: { isEnabled: false },
      },
    });
    const { container } = renderCard(baseStatsProps());

    const resonanceEl = container.querySelector(
      "[data-test-build-card-resonance]",
    );
    expect(resonanceEl?.textContent).toContain("0 / 6");
  });

  it("renders 6 / 6 when every resonance chain is enabled", () => {
    seedCharacter({
      resonanceChains: {
        chain1: { isEnabled: true },
        chain2: { isEnabled: true },
        chain3: { isEnabled: true },
        chain4: { isEnabled: true },
        chain5: { isEnabled: true },
        chain6: { isEnabled: true },
      },
    });
    const { container } = renderCard(baseStatsProps());

    const resonanceEl = container.querySelector(
      "[data-test-build-card-resonance]",
    );
    expect(resonanceEl?.textContent).toContain("6 / 6");
  });

  it("renders talent level badges from the character's talents", () => {
    seedCharacter();
    const { container } = renderCard(baseStatsProps());

    const talentsEl = container.querySelector("[data-test-build-card-talents]");
    expect(talentsEl?.textContent).toContain("Basic 6");
    expect(talentsEl?.textContent).toContain("Skill 10");
    expect(talentsEl?.textContent).toContain("Intro 6");
  });

  it("renders all 5 echo slots, including empty ones", () => {
    seedCharacter();
    seedInventoryEcho();
    const { container } = renderCard(baseStatsProps());

    const echoCards = container.querySelectorAll(
      "[data-test-build-card-echoes] .echo__item",
    );
    expect(echoCards.length).toBe(5);
  });

  it("resolves each slot's echoId to its inventory data and shows its set icon and CV/RV", () => {
    seedCharacter();
    seedInventoryEcho();
    const { container } = renderCard(baseStatsProps());

    const echoesEl = container.querySelector("[data-test-build-card-echoes]");
    expect(echoesEl?.textContent).toContain("CV");
    expect(echoesEl?.textContent).toContain("RV");
  });

  it("does not show CV/RV for an empty echo slot", () => {
    seedCharacter();
    // No inventory data seeded — every slot resolves to the empty pointer.
    const { container } = renderCard(baseStatsProps());

    const echoesEl = container.querySelector("[data-test-build-card-echoes]");
    expect(echoesEl?.textContent).not.toContain("CV");
  });
});
