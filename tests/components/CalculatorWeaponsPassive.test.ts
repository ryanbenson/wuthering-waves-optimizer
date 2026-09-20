import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render, fireEvent } from "@testing-library/vue";
import CalculatorWeaponsPassive from "../../src/components/CalculatorWeaponsPassive.vue";
import { useCharacterStore } from "../../src/stores/character";

const CHARACTER = "TestChar";

describe("CalculatorWeaponsPassive", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("enabling a passive disables its declared mutually exclusive partner (Rime-Draped Sprouts' two Basic Attack DMG Bonus passives)", async () => {
    const characterStore = useCharacterStore();
    characterStore.characters = {
      [CHARACTER]: {
        weaponPassives: {
          RimeDrapedSproutsBasicAtkBonus2: { isEnabled: true },
        },
      },
    };
    const { container } = render(CalculatorWeaponsPassive, {
      props: {
        character: CHARACTER,
        passiveKey: "RimeDrapedSproutsBasicAtkBonus1",
        mutuallyExclusiveWith: ["RimeDrapedSproutsBasicAtkBonus2"],
      },
    });

    await fireEvent.click(container.querySelector('[data-test-weapon-passive="RimeDrapedSproutsBasicAtkBonus1"] input[type="checkbox"]')!);

    const passives = characterStore.characters[CHARACTER].weaponPassives;
    expect(passives.RimeDrapedSproutsBasicAtkBonus1.isEnabled).toBe(true);
    expect(passives.RimeDrapedSproutsBasicAtkBonus2.isEnabled).toBe(false);
  });

  it("does not disable the partner when there is no conflict declared", async () => {
    const characterStore = useCharacterStore();
    characterStore.characters = {
      [CHARACTER]: { weaponPassives: { OtherPassive: { isEnabled: true } } },
    };
    const { container } = render(CalculatorWeaponsPassive, {
      props: { character: CHARACTER, passiveKey: "SoloPassive" },
    });

    await fireEvent.click(container.querySelector('[data-test-weapon-passive="SoloPassive"] input[type="checkbox"]')!);

    const passives = characterStore.characters[CHARACTER].weaponPassives;
    expect(passives.SoloPassive.isEnabled).toBe(true);
    expect(passives.OtherPassive.isEnabled).toBe(true);
  });
});
