import { describe, it, expect } from "vitest";
import { allCharactersList } from "../../src/characters/characters";
import { echoSetLabelMap } from "../../src/echoes/stats";

const basics = import.meta.glob<{ getCharacterBasicInfo: () => CharacterBasicInfo }>(
  "../../src/characters/*/basic.ts",
  { eager: true },
);

describe("suggestedEchoSets", () => {
  // Optional and empty-safe like suggestedWeapons, but every listed key must be a real set.
  it.each(allCharactersList.map((c) => c.key))("%s lists only known sets, once each", (key) => {
    const sets = basics[`../../src/characters/${key}/basic.ts`].getCharacterBasicInfo().suggestedEchoSets ?? [];
    for (const set of sets) expect(Object.keys(echoSetLabelMap)).toContain(set);
    expect(new Set(sets).size).toBe(sets.length);
  });
});
