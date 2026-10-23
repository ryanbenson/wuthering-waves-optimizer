import { describe, it, expect } from "vitest";
import {
  buildCardRegions,
  isEmptySlotText,
  parseBuildCard,
  parseCostText,
  parseSubstatLine,
  type BuildCardAdapters,
  type BuildCardGameData,
  type Region,
} from "@wutheringtools/build-card-scanner";
import { mapParsedEchoes } from "../../src/echoes/parsedEchoMapping";
import fixture from "../fixtures/buildCards/hsin_temp_from_bot_4_of_5.ocr.json";

// A real bot card (tests/fixtures/buildCards/hsin_temp_from_bot_4_of_5.jpeg) with only four
// echoes equipped. Image matching always returns its closest echo, so before empty slots
// were detected the bare fifth slot came back as Nightmare: Tambourinist.
const data: BuildCardGameData = {
  echoes: {
    NightmareTambourinist: { key: "NightmareTambourinist", class: "Calamity", sets: ["Havoc"] },
  },
  echoCostByClass: { Calamity: 4, Overlord: 4, Elite: 3, Common: 1 },
};

/** Replays the fixture's recorded OCR; image matchers always "find" an echo, like the real worker. */
function fixtureAdapters(slots: string[][] = fixture.slots) {
  const at = (r: Region) => `${r.x},${r.y}`;
  const text = new Map<string, string>();
  buildCardRegions().forEach((slot, i) => {
    const [cost, mainStat, ...substats] = slots[i];
    text.set(at(slot.cost), cost);
    text.set(at(slot.mainStatLabel), mainStat);
    slot.substats.forEach((region, j) => text.set(at(region), substats[j]));
  });
  const imageMatchXs: number[] = [];
  const adapters: BuildCardAdapters = {
    readText: async (r) => text.get(at(r)) ?? "",
    matchSet: async (r) => {
      imageMatchXs.push(r.x);
      return null;
    },
    matchEcho: async (r) => {
      imageMatchXs.push(r.x);
      return "NightmareTambourinist";
    },
  };
  return { adapters, imageMatchXs };
}

describe("isEmptySlotText", () => {
  it("is empty only when cost, main stat and every substat value are missing", () => {
    expect(isEmptySlotText(null, "", [])).toBe(true);
    expect(isEmptySlotText(null, " ", [{ subStat: "aT", subStatValue: "" }])).toBe(true);
    expect(isEmptySlotText(1, "", [])).toBe(false);
    expect(isEmptySlotText(null, "ATK", [])).toBe(false);
    expect(isEmptySlotText(null, "", [{ subStat: "HP", subStatValue: "470" }])).toBe(false);
  });

  it("ignores background noise that doesn't look like a stat", () => {
    expect(isEmptySlotText(null, "go", [{ subStat: "j al", subStatValue: "1" }])).toBe(true);
  });

  it("keeps an unleveled echo (no substats) whose cost OCR failed", () => {
    expect(isEmptySlotText(null, "Crit. Rate", [])).toBe(false);
    expect(isEmptySlotText(null, "crit. MG", [])).toBe(false);
  });

  it("treats every recorded reading of the empty slot as empty, and no filled slot", () => {
    const isEmpty = ([cost, mainStat, ...lines]: string[]) =>
      isEmptySlotText(
        parseCostText(cost),
        mainStat.trim(),
        lines.map(parseSubstatLine).filter((s) => s !== null),
      );
    for (const reading of fixture.emptySlotVariants.readings) {
      expect(isEmpty(reading), JSON.stringify(reading)).toBe(true);
    }
    expect(fixture.slots.map(isEmpty)).toEqual([false, false, false, false, true]);
  });
});

describe("build card with an empty slot (4 of 5 echoes)", () => {
  it("leaves the empty fifth slot blank and skips its image matching", async () => {
    const { adapters, imageMatchXs } = fixtureAdapters();
    const slots = await parseBuildCard(adapters, data);

    expect(slots).toHaveLength(5);
    expect(slots[4]).toEqual({ cost: null, mainStatLabel: "", substats: [], echo: null, set: null });
    const fifthSlot = buildCardRegions()[4];
    expect(imageMatchXs).not.toContain(fifthSlot.set.x);
    expect(imageMatchXs).not.toContain(fifthSlot.echoImage.x);
  });

  it("leaves the empty slot blank when OCR reads background noise as a main stat", async () => {
    const [noisy] = fixture.emptySlotVariants.readings;
    const { adapters } = fixtureAdapters([...fixture.slots.slice(0, 4), noisy]);
    const slots = await parseBuildCard(adapters, data);
    expect(slots[4]).toEqual({ cost: null, mainStatLabel: "", substats: [], echo: null, set: null });
  });

  it("still reads the four filled slots", async () => {
    const { adapters } = fixtureAdapters();
    const slots = await parseBuildCard(adapters, data);

    expect(slots.slice(0, 4).map((s) => s.cost)).toEqual([4, 3, 1, 1]);
    expect(slots[2]).toMatchObject({
      mainStatLabel: "ATK",
      substats: [
        { subStat: "Crit. Rate", subStatValue: "6.3%" },
        { subStat: "Energy Regen", subStatValue: "12.4%" },
        { subStat: "Crit. DMG", subStatValue: "13.8%" },
        { subStat: "HP", subStatValue: "470" },
        { subStat: "Heavy Attack DMG Bonus", subStatValue: "7.9%" },
      ],
    });
  });

  it("maps the empty slot to an empty character slot that isn't saved to the inventory", async () => {
    const { adapters } = fixtureAdapters();
    const mapped = mapParsedEchoes(await parseBuildCard(adapters, data), true);

    expect(mapped.slice(0, 4).every((echo) => echo.echoId)).toBe(true);
    expect(mapped[4]).toMatchObject({
      echo: null,
      echoId: null,
      echoSet: null,
      type: null,
      stat: null,
      echoSubStatsType1: null,
      echoSubStatsValue1: null,
    });
  });
});
