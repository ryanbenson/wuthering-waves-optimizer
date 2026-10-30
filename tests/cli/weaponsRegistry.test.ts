import fs from "fs";
import os from "os";
import path from "path";
import { afterEach, describe, expect, it } from "vitest";
import { patchWeaponsRegistry, weaponExistsInRegistry } from "../../cli/lib/weaponsRegistry";

const REGISTRY = `const pistolsList = {
  five: [
    { key: "LuxUmbra", name: "Lux & Umbra", mainStat: "CritDMG" },
    { key: "WoodlandAria", name: "Woodland Aria", mainStat: "CritRate" },
  ],
  four: [
    { key: "Thunderbolt", name: "Thunderbolt", mainStat: "ATK" },
    { key: "RelativisticJet", name: "Relativistic Jet", mainStat: "ATK" },
  ],
  three: [ ],
  two: [ ],
  one: [
    { key: "TrainingPistols", name: "Training Pistols" },
  ],
};
`;

let tmpDir: string | null = null;

function writeRegistry(): string {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "weapons-registry-"));
  const filePath = path.join(tmpDir, "weapons.ts");
  fs.writeFileSync(filePath, REGISTRY);
  return filePath;
}

afterEach(() => {
  if (tmpDir) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    tmpDir = null;
  }
});

describe("patchWeaponsRegistry", () => {
  it("keeps every existing entry (and its mainStat) when adding a weapon", () => {
    const filePath = writeRegistry();

    patchWeaponsRegistry(filePath, {
      key: "Lullaby",
      name: "Lullaby",
      typePlural: "Pistols",
      rarity: 5,
      mainStat: "EnergyRegen",
    });

    expect(fs.readFileSync(filePath, "utf8")).toBe(`const pistolsList = {
  five: [
    { key: "Lullaby", name: "Lullaby", mainStat: "EnergyRegen" },
    { key: "LuxUmbra", name: "Lux & Umbra", mainStat: "CritDMG" },
    { key: "WoodlandAria", name: "Woodland Aria", mainStat: "CritRate" },
  ],
  four: [
    { key: "Thunderbolt", name: "Thunderbolt", mainStat: "ATK" },
    { key: "RelativisticJet", name: "Relativistic Jet", mainStat: "ATK" },
  ],
  three: [ ],
  two: [ ],
  one: [
    { key: "TrainingPistols", name: "Training Pistols" },
  ],
};
`);
  });

  it("replaces an existing entry instead of duplicating it", () => {
    const filePath = writeRegistry();

    patchWeaponsRegistry(filePath, {
      key: "WoodlandAria",
      name: "Woodland Aria",
      typePlural: "Pistols",
      rarity: 5,
      mainStat: "CritRate",
    });

    const content = fs.readFileSync(filePath, "utf8");
    expect(content.match(/WoodlandAria/g)).toHaveLength(1);
    expect(content).toContain(`{ key: "LuxUmbra", name: "Lux & Umbra", mainStat: "CritDMG" }`);
  });
});

describe("weaponExistsInRegistry", () => {
  it("finds entries that carry a mainStat", () => {
    expect(weaponExistsInRegistry(REGISTRY, "Thunderbolt")).toBe(true);
    expect(weaponExistsInRegistry(REGISTRY, "Lullaby")).toBe(false);
  });
});
