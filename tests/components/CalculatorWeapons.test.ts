import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { fireEvent, render } from "@testing-library/vue";
import CalculatorWeapons from "../../src/components/CalculatorWeapons.vue";
import { useCharacterStore } from "../../src/stores/character";

const CHARACTER = "Camellya";
const SIGNATURE_WEAPON = "EmeraldSentence";

function renderWeapons(signatureWeapon?: string) {
  return render(CalculatorWeapons, {
    props: {
      character: CHARACTER,
      weaponType: "Swords",
      signatureWeapon,
    },
    global: {
      stubs: {
        AppRichSelect: true,
        CalculatorWeaponsPassive: true,
        CalculatorWeaponBrowser: true,
      },
    },
  });
}

describe("CalculatorWeapons signature quick-equip", () => {
  let characterStore: ReturnType<typeof useCharacterStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    characterStore = useCharacterStore();
    characterStore.characters = { [CHARACTER]: {} };
  });

  it("does not show a quick-equip button when the character has no signature weapon", () => {
    const { container } = renderWeapons(undefined);
    expect(container.querySelector("[data-test-weapons-equip-signature]")).toBeNull();
  });

  it("shows a quick-equip button when a signature weapon is set and not yet equipped", () => {
    const { container } = renderWeapons(SIGNATURE_WEAPON);
    expect(container.querySelector("[data-test-weapons-equip-signature]")).toBeTruthy();
  });

  it("equips the signature weapon on click", async () => {
    const { container } = renderWeapons(SIGNATURE_WEAPON);
    const button = container.querySelector(
      "[data-test-weapons-equip-signature]",
    ) as HTMLElement;
    await fireEvent.click(button);
    expect(characterStore.characters[CHARACTER].weapon).toBe(SIGNATURE_WEAPON);
  });
});
