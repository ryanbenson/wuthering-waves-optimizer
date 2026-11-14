import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useCharacterStore } from "../../src/stores/character";
import { useOptimizerBuffSync } from "../../src/composables/useOptimizerBuffSync";

const CHARACTER = "TestChar";
const loadout = [{ echo: "LampylumenMyriad", echoId: "main" }];

describe("useOptimizerBuffSync (issue #705)", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("flags out-of-sync buffs, applies only those, then reports nothing left to sync", async () => {
    const characterStore = useCharacterStore() as any;
    characterStore.setCharacterData(CHARACTER, {
      echoes: { 0: { echoId: "main" } },
      mainEcho: { echo: "LampylumenMyriad", buffs: { LampylumenMyriad: { isEnabled: false } } },
      echoSetPassives: { FreezingFrost2Set: { isEnabled: true } },
      optimizer: {
        mainEchoBuffs: { LampylumenMyriad: { buffs: { LampylumenMyriad: { isEnabled: true, stacks: 2 } } } },
        echoSetPassives: { FreezingFrost2Set: { isEnabled: true } },
      },
    });

    const { hasBuffChanges, syncBuffs } = useOptimizerBuffSync(CHARACTER, loadout);
    expect(hasBuffChanges.value).toBe(true);

    await syncBuffs();

    const character = characterStore.characters[CHARACTER];
    expect(character.mainEcho.buffs.LampylumenMyriad).toEqual({ isEnabled: true, stacks: 2 });
    expect(character.echoes[0].echoId).toBe("main");
    expect(hasBuffChanges.value).toBe(false);
  });
});
