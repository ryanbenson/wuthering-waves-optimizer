import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render } from "@testing-library/vue";
import { nextTick } from "vue";
import CalculatorEcho from "../../src/components/CalculatorEcho.vue";
import { createEmptyEchoSlot } from "../../src/echoes/echoLoadout";
import { useCharacterStore } from "../../src/stores/character";
import { useInventoryStore } from "../../src/stores/inventory";

const CHARACTER = "Camellya";
const ELITE_ECHO = "AbyssalGladius";
const COMMON_ECHO = "AeroDrake";

function makeInventoryEcho(
  echoId: string,
  echo: string,
  type: number,
  stat: string,
) {
  return {
    ...createEmptyEchoSlot(echoId),
    echo,
    type,
    rank: 5,
    stat,
    echoSet: "MidnightVeil",
  };
}

function renderSlot(index: number) {
  return render(CalculatorEcho, {
    props: { character: CHARACTER, index },
    global: {
      stubs: {
        Range: true,
        EchoLockTrashActions: true,
        EchoFavoriteButton: true,
      },
      directives: {
        tooltip: () => {},
      },
    },
  });
}

describe("CalculatorEcho main stat preservation", () => {
  let characterStore: ReturnType<typeof useCharacterStore>;
  let inventoryStore: ReturnType<typeof useInventoryStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    characterStore = useCharacterStore();
    inventoryStore = useInventoryStore();
    inventoryStore.echoes = [
      makeInventoryEcho("cost3", ELITE_ECHO, 3, "EnergyRegen"),
      makeInventoryEcho("cost1", COMMON_ECHO, 1, "ATK"),
    ];
    characterStore.characters = {
      [CHARACTER]: { echoes: { 0: createEmptyEchoSlot("cost3") } },
    };
  });

  it("keeps the main stat when a loadout swaps in an echo with a different cost", async () => {
    renderSlot(0);
    await nextTick();

    characterStore.applyEchoLoadout(CHARACTER, {
      echoIds: ["cost1"],
      presetId: null,
      fillSlots: 1,
    });
    await nextTick();
    await nextTick();

    expect(inventoryStore.getEchoById("cost1").stat).toBe("ATK");
    expect(inventoryStore.getEchoById("cost3").stat).toBe("EnergyRegen");
  });

  it("clears the main stat when the echo in a slot is swapped for a different cost", async () => {
    characterStore.characters = {
      [CHARACTER]: {
        echoes: {
          0: {
            ...createEmptyEchoSlot(),
            echo: ELITE_ECHO,
            type: 3,
            rank: 5,
            stat: "EnergyRegen",
          },
        },
      },
    };
    renderSlot(0);
    await nextTick();

    characterStore.characters[CHARACTER].echoes[0].echo = COMMON_ECHO;
    await nextTick();
    await nextTick();

    expect(characterStore.characters[CHARACTER].echoes[0].stat).toBe("none");
  });
});
