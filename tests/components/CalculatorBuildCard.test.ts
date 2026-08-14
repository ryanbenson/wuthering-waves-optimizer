import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { fireEvent, render, waitFor } from "@testing-library/vue";
import CalculatorBuildCard from "../../src/components/CalculatorBuildCard.vue";
import { createEmptyEchoSlot } from "../../src/echoes/echoLoadout";
import { useCharacterStore } from "../../src/stores/character";
import { useInventoryStore } from "../../src/stores/inventory";
import { useSettingsStore } from "../../src/stores/settings";
import { buildCharacterCalculationContext } from "../../src/calculator/buildCharacterContext";
import { displayInt } from "../../src/utils/numbers";
import { contrastOklchTriple, hexToOklchTriple } from "../../src/utils/color";

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

  it("shows a 1pc set (e.g. Lucy's exclusive Shadow of Shattered Dreams) alongside 2pc sets, sorted with 2pc sets first", () => {
    // Mirrors Lucy's real preset: a 1pc-threshold exclusive set plus two
    // ordinary 2pc sets filling the other 4 slots (see
    // src/characters/Lucy/presets.ts) — the case that exposed the build
    // card's old hardcoded `count >= 2` filter dropping the 1pc set.
    seedCharacter({
      echoes: {
        0: createEmptyEchoSlot("echo-0"),
        1: createEmptyEchoSlot("echo-1"),
        2: createEmptyEchoSlot("echo-2"),
        3: createEmptyEchoSlot("echo-3"),
        4: createEmptyEchoSlot("echo-4"),
      },
    });
    const inventoryStore = useInventoryStore();
    inventoryStore.echoes = [
      { ...createEmptyEchoSlot("echo-0"), echoSet: "ShadowofShatteredDreams" },
      { ...createEmptyEchoSlot("echo-1"), echoSet: "CelestialLight" },
      { ...createEmptyEchoSlot("echo-2"), echoSet: "CelestialLight" },
      { ...createEmptyEchoSlot("echo-3"), echoSet: "EternalRadiance" },
      { ...createEmptyEchoSlot("echo-4"), echoSet: "EternalRadiance" },
    ];
    const { container } = renderCard(baseStatsProps());

    const chips = container.querySelectorAll(
      "[data-test-build-card-echo-sets] > div",
    );
    expect(Array.from(chips).map((el) => el.textContent?.trim())).toEqual([
      "2pc Celestial Light",
      "2pc Eternal Radiance",
      "1pc Shadow of Shattered Dreams",
    ]);
  });

  it("dedupes multiple resonance chain entries for the same sequence node into one icon, active if any variant for the current stance is enabled", () => {
    // Some characters (e.g. stance-swappers) define several resonance chain
    // entries per in-game node — stance-bound variants, or independently
    // toggleable effects of one node. The build card should show exactly
    // one icon per node, restricted to whichever entries apply for the
    // character's current stance, lit up if any of them is enabled.
    seedCharacter({
      activeStance: "Fusion Burst",
      resonanceChains: {
        SequenceNode2Base: { isEnabled: false },
        SequenceNode2FusionBurst: { isEnabled: true },
        SequenceNode2TuneStrain: { isEnabled: false },
      },
    });
    const props = baseStatsProps();
    props.chosenChar.value.basic.stances = ["Fusion Burst", "Tune Strain"];
    props.chosenChar.value.resonanceChains = [
      { key: "SequenceNode2Base", name: "Sequence Node 2: Test Node", icon: "icon.png" },
      {
        key: "SequenceNode2FusionBurst",
        name: "Sequence Node 2: Test Node",
        icon: "icon.png",
        stance: "Fusion Burst",
      },
      {
        key: "SequenceNode2TuneStrain",
        name: "Sequence Node 2: Test Node",
        icon: "icon.png",
        stance: "Tune Strain",
      },
    ];
    const { container } = renderCard(props);

    const resonanceEl = container.querySelector("[data-test-build-card-resonance]");
    const nodes = resonanceEl?.querySelectorAll(".build-card__resonance-node");
    expect(nodes?.length).toBe(1);
    expect(nodes?.[0].classList.contains("build-card__resonance-node--active")).toBe(true);
  });

  it("shows a node's icon as inactive when none of its entries for the current stance are enabled", () => {
    seedCharacter({
      activeStance: "Tune Strain",
      resonanceChains: {
        SequenceNode2Base: { isEnabled: false },
        SequenceNode2FusionBurst: { isEnabled: true },
        SequenceNode2TuneStrain: { isEnabled: false },
      },
    });
    const props = baseStatsProps();
    props.chosenChar.value.basic.stances = ["Fusion Burst", "Tune Strain"];
    props.chosenChar.value.resonanceChains = [
      { key: "SequenceNode2Base", name: "Sequence Node 2: Test Node", icon: "icon.png" },
      {
        key: "SequenceNode2FusionBurst",
        name: "Sequence Node 2: Test Node",
        icon: "icon.png",
        stance: "Fusion Burst",
      },
      {
        key: "SequenceNode2TuneStrain",
        name: "Sequence Node 2: Test Node",
        icon: "icon.png",
        stance: "Tune Strain",
      },
    ];
    const { container } = renderCard(props);

    // The Fusion-Burst-only variant (currently enabled) shouldn't be
    // considered while Tune Strain is the active stance.
    const resonanceEl = container.querySelector("[data-test-build-card-resonance]");
    const nodes = resonanceEl?.querySelectorAll(".build-card__resonance-node");
    expect(nodes?.length).toBe(1);
    expect(nodes?.[0].classList.contains("build-card__resonance-node--inactive")).toBe(true);
  });

  it("leaves the DaisyUI primary color variables untouched until a custom color is picked, then applies it as --p/--pc on the card canvas", async () => {
    seedCharacter();
    const { container } = renderCard(baseStatsProps());

    const canvas = container.querySelector(".build-card__canvas") as HTMLElement;
    expect(canvas.style.getPropertyValue("--p")).toBe("");
    expect(
      container.querySelector("[data-test-build-card-primary-color-reset]"),
    ).toBeFalsy();

    const colorInput = container.querySelector(
      "[data-test-build-card-primary-color-input]",
    ) as HTMLInputElement;
    await fireEvent.update(colorInput, "#ff0000");

    await waitFor(() => {
      expect(canvas.style.getPropertyValue("--p")).toBe(hexToOklchTriple("#ff0000"));
    });
    expect(canvas.style.getPropertyValue("--pc")).toBe(contrastOklchTriple("#ff0000"));
    expect(useSettingsStore().config.buildCard.primaryColor).toBe("#ff0000");
  });
});
