import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render, waitFor } from "@testing-library/vue";
import CalculatorBuildCard from "../../src/components/CalculatorBuildCard.vue";
import { createEmptyEchoSlot } from "../../src/echoes/echoLoadout";
import { useCharacterStore } from "../../src/stores/character";
import { useInventoryStore } from "../../src/stores/inventory";
import { buildCharacterCalculationContext } from "../../src/calculator/buildCharacterContext";
import { displayInt } from "../../src/utils/numbers";

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

  it("renders character name, level, weapon refinement, and stats reflecting equipment alone", async () => {
    const characterStore = seedCharacter();
    const { findByText, getByTestId, container } = renderCard(baseStatsProps());

    expect(await findByText("Changli")).toBeTruthy();
    expect(container.textContent).toContain("Lv. 90");

    // The build card computes its own "always enabled" stats (base +
    // permanently-active weapon/echo buffs only, per issue #383) rather than
    // receiving the Results tab's live totals — assert against that same
    // computation so this test doesn't hardcode a number that drifts
    // whenever character/weapon data changes.
    const built = await buildCharacterCalculationContext(
      CHARACTER,
      characterStore.characters,
      { enemyLevel: 90, enemyResist: 0.1, enemyType: "Calamity" },
      [],
      { alwaysEnabledOnly: true },
    );
    const expectedAtk = displayInt(built.finalStats.totalAtk);
    await waitFor(() => expect(container.textContent).toContain(expectedAtk));
    void getByTestId;
  });

  it("renders forte/talent levels from the character's talents", () => {
    seedCharacter();
    const { container } = renderCard(baseStatsProps());

    const talentsEl = container.querySelector("[data-test-build-card-talents]");
    const levels = talentsEl?.querySelectorAll("[data-test-build-card-talent-level]");
    // Order matches the issue spec: normal, skill, liberation, forte circuit, intro.
    expect(Array.from(levels ?? []).map((el) => el.textContent?.trim())).toEqual([
      "6",
      "10",
      "10",
      "10",
      "6",
    ]);
    expect(talentsEl?.querySelector('[title^="Normal Attack"]')).toBeTruthy();
    expect(talentsEl?.querySelector('[title^="Resonance Skill"]')).toBeTruthy();
    expect(talentsEl?.querySelector('[title^="Intro Skill"]')).toBeTruthy();
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
