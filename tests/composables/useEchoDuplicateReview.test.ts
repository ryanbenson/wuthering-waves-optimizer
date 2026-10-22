import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useEchoDuplicateReview } from "../../src/composables/useEchoDuplicateReview";
import { useEchoSlotAssignment } from "../../src/composables/useEchoSlotAssignment";
import { useCharacterStore } from "../../src/stores/character";
import { useInventoryStore } from "../../src/stores/inventory";

const parsedSlot = (echo: string, subStat: string) => ({
  echo,
  set: "HeartofSwornVigil",
  cost: 3,
  mainStatLabel: "ATK",
  substats: [{ subStat, subStatValue: "7.9%" }],
});

describe("useEchoDuplicateReview", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  // Regression for a reported bug: after an image import saved to the
  // inventory, the character slot and the inventory echo were one shared
  // object. Equipping another echo into that slot merges a blank pointer
  // into the slot in place, which overwrote the imported inventory echo —
  // it vanished, and the equipped echo's id existed twice (the blank copy
  // first, so the slot rendered empty).
  it("keeps imported inventory echoes intact when another echo is equipped into their slot", async () => {
    const characterStore = useCharacterStore();
    const inventoryStore = useInventoryStore();
    characterStore.characters = { Suoming: { echoes: {} } } as never;
    inventoryStore.saveEcho({
      echoId: "formrender",
      echo: "Formrender",
      echoSet: "HeartofSwornVigil",
      rank: 5,
      type: 3,
      stat: "Electro",
    });

    const { handleEchoesParsed } = useEchoDuplicateReview({
      inventoryOnly: () => false,
      character: () => "Suoming",
      onFinalized: () => {},
    });
    await handleEchoesParsed(
      [
        parsedSlot("A", "ATK"),
        parsedSlot("B", "HP"),
        parsedSlot("Soulfrayer", "DEF"),
        parsedSlot("D", "ATK"),
        parsedSlot("E", "HP"),
      ],
      true,
    );
    const importedId = characterStore.characters.Suoming.echoes[2].echoId;

    await useEchoSlotAssignment().assignEchoToCharacterSlot("Suoming", 2, "formrender");

    expect(inventoryStore.getEchoById(importedId)).toMatchObject({ echo: "Soulfrayer" });
    const ids = inventoryStore.echoes.map((echo: { echoId: string }) => echo.echoId);
    expect(ids.filter((id: string) => id === "formrender")).toHaveLength(1);
    expect(inventoryStore.getEchoById("formrender")).toMatchObject({ echo: "Formrender" });
  });
});
