import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render, fireEvent } from "@testing-library/vue";
import CalculatorPartyBuff from "../../src/components/CalculatorPartyBuff.vue";
import { useCharacterStore } from "../../src/stores/character";

const CHARACTER = "TestChar";

describe("CalculatorPartyBuff", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("clicking Max lands on the realistic cap instead of the raw hard cap when one is configured (issue #514)", async () => {
    const characterStore = useCharacterStore();
    characterStore.characters = { [CHARACTER]: {} };
    const { container } = render(CalculatorPartyBuff, {
      props: {
        character: CHARACTER,
        uniqueKey: "SoftCapBuff",
        hasStacks: true,
        maxStacks: 150,
        realisticMaxStacks: 40,
      },
    });

    await fireEvent.click(container.querySelector('[data-test-party-buff-stacks-max="SoftCapBuff"]')!);

    expect(
      characterStore.characters[CHARACTER].teamBuffs.buffs.SoftCapBuff.stacks,
    ).toBe(40);
  });

  it("clicking the Suggested button sets an inputBase buff's value (Shorekeeper-style ER/CritRate buffs)", async () => {
    const characterStore = useCharacterStore();
    characterStore.characters = { [CHARACTER]: {} };
    const { container, getByText } = render(CalculatorPartyBuff, {
      props: {
        character: CHARACTER,
        uniqueKey: "SophisticatedStellarealmCritRate",
        inputBase: true,
        modifierBasedOn: "Energy Regen",
        realisticBaseAttrValue: 250,
      },
    });

    expect(getByText("Suggested (250)")).toBeTruthy();
    await fireEvent.click(
      container.querySelector('[data-test-party-buff-input-base-suggested="SophisticatedStellarealmCritRate"]')!,
    );

    expect(
      characterStore.characters[CHARACTER].teamBuffs.buffs.SophisticatedStellarealmCritRate.baseAttrValue,
    ).toBe(250);
  });

  it("does not render the Suggested button when no realistic value is configured", () => {
    const characterStore = useCharacterStore();
    characterStore.characters = { [CHARACTER]: {} };
    const { container } = render(CalculatorPartyBuff, {
      props: {
        character: CHARACTER,
        uniqueKey: "NoSuggestionBuff",
        inputBase: true,
        modifierBasedOn: "Energy Regen",
      },
    });

    expect(
      container.querySelector('[data-test-party-buff-input-base-suggested="NoSuggestionBuff"]'),
    ).toBeNull();
  });
});
