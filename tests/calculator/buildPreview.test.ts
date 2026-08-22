import { describe, it, expect } from "vitest";
import { computeBuildPreview, characterImageUrl } from "../../src/calculator/buildPreview";

const inventoryEchoes = [
  { echoId: "e1", echoSet: "MoltenRift" },
  { echoId: "e2", echoSet: "MoltenRift" },
  { echoId: "e3", echoSet: "MoltenRift" },
  { echoId: "e4", echoSet: "FreezingFrost" },
  { echoId: "e5", echoSet: "FreezingFrost" },
];

describe("computeBuildPreview", () => {
  it("resolves weapon name/icon for the active build", async () => {
    const characters = {
      Calcharo: { weapon: "AgesOfHarvest", activeBuildId: "b1", builds: [{ id: "b1", name: "Default" }] },
    };

    const preview = await computeBuildPreview("Calcharo", "b1", characters, []);

    expect(preview.weaponName).toBe("Ages of Harvest");
    expect(preview.weaponIcon).toBe("https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/AgesOfHarvest.png");
  });

  it("returns null weapon name/icon when no weapon is equipped", async () => {
    const characters = { Calcharo: { activeBuildId: "b1", builds: [{ id: "b1", name: "Default" }] } };

    const preview = await computeBuildPreview("Calcharo", "b1", characters, []);

    expect(preview.weaponName).toBeNull();
    expect(preview.weaponIcon).toBeNull();
  });

  it("summarizes equipped echo sets with 2+ pieces, sorted by count descending", async () => {
    const characters = {
      Calcharo: {
        activeBuildId: "b1",
        builds: [{ id: "b1", name: "Default" }],
        echoes: {
          0: { echoId: "e1" },
          1: { echoId: "e2" },
          2: { echoId: "e3" },
          3: { echoId: "e4" },
          4: { echoId: "e5" },
        },
      },
    };

    const preview = await computeBuildPreview("Calcharo", "b1", characters, inventoryEchoes);

    expect(preview.echoSets).toEqual([
      { key: "MoltenRift", count: 3, label: "Molten Rift", icon: expect.stringContaining("MoltenRift") },
      { key: "FreezingFrost", count: 2, label: "Freezing Frost", icon: expect.stringContaining("FreezingFrost") },
    ]);
  });

  it("resolves the two assumed teammates from teamBuffs", async () => {
    const characters = {
      Calcharo: {
        activeBuildId: "b1",
        builds: [{ id: "b1", name: "Default" }],
        teamBuffs: { selectedCharacter1: "Verina", selectedCharacter2: "Mortefi" },
      },
    };

    const preview = await computeBuildPreview("Calcharo", "b1", characters, []);

    expect(preview.teammates).toEqual([
      { key: "Verina", name: "Verina", icon: characterImageUrl("Verina") },
      { key: "Mortefi", name: "Mortefi", icon: characterImageUrl("Mortefi") },
    ]);
  });

  it("omits unselected teammate slots rather than returning nulls", async () => {
    const characters = {
      Calcharo: {
        activeBuildId: "b1",
        builds: [{ id: "b1", name: "Default" }],
        teamBuffs: { selectedCharacter1: "Verina" },
      },
    };

    const preview = await computeBuildPreview("Calcharo", "b1", characters, []);

    expect(preview.teammates).toEqual([{ key: "Verina", name: "Verina", icon: characterImageUrl("Verina") }]);
  });

  it("computes headline stats (base + equipment)", async () => {
    const characters = {
      Calcharo: { activeBuildId: "b1", builds: [{ id: "b1", name: "Default" }], weapon: "AgesOfHarvest" },
    };

    const preview = await computeBuildPreview("Calcharo", "b1", characters, []);

    expect(preview.stats).not.toBeNull();
    expect(preview.stats!.totalHp).toBeGreaterThan(0);
    expect(preview.stats!.totalAtk).toBeGreaterThan(0);
    expect(preview.stats!.totalDef).toBeGreaterThan(0);
    // energyRegen is scaled to percentage points (base 100), not the raw 1.0 ratio
    expect(preview.stats!.energyRegen).toBeGreaterThanOrEqual(100);
  });

  it("includes custom buffs (only excluded in alwaysEnabledOnly mode) in the computed stats", async () => {
    const baseline = {
      Calcharo: { activeBuildId: "b1", builds: [{ id: "b1", name: "Default" }], weapon: "AgesOfHarvest" },
    };
    const withCustomBuff = {
      Calcharo: {
        activeBuildId: "b1",
        builds: [{ id: "b1", name: "Default" }],
        weapon: "AgesOfHarvest",
        customBuffs: { ATK_FLAT: 500 },
      },
    };

    const baselinePreview = await computeBuildPreview("Calcharo", "b1", baseline, []);
    const buffedPreview = await computeBuildPreview("Calcharo", "b1", withCustomBuff, []);

    expect(buffedPreview.stats).not.toBeNull();
    expect(buffedPreview.stats!.totalAtk).toBeGreaterThan(baselinePreview.stats!.totalAtk);
  });

  it("scales a percent-type custom buff correctly (not 100x)", async () => {
    const baseline = {
      Calcharo: { activeBuildId: "b1", builds: [{ id: "b1", name: "Default" }], weapon: "AgesOfHarvest" },
    };
    const withCustomBuff = {
      Calcharo: {
        activeBuildId: "b1",
        builds: [{ id: "b1", name: "Default" }],
        weapon: "AgesOfHarvest",
        customBuffs: { ATK: 5 }, // "+5%", stored as a whole number like the UI displays it
      },
    };

    const baselinePreview = await computeBuildPreview("Calcharo", "b1", baseline, []);
    const buffedPreview = await computeBuildPreview("Calcharo", "b1", withCustomBuff, []);

    expect(buffedPreview.stats!.totalAtk).toBeCloseTo(baselinePreview.stats!.totalAtk * 1.05, 0);
  });

  it("reads a non-active build's own data, not the live/active character record", async () => {
    const characters = {
      Calcharo: {
        weapon: "AgesOfHarvest", // active build's live weapon
        activeBuildId: "active-build",
        builds: [
          { id: "active-build", name: "Active", weapon: "AgesOfHarvest" },
          { id: "other-build", name: "Other" }, // no weapon
        ],
      },
    };

    const activePreview = await computeBuildPreview("Calcharo", "active-build", characters, []);
    const otherPreview = await computeBuildPreview("Calcharo", "other-build", characters, []);

    expect(activePreview.weaponName).toBe("Ages of Harvest");
    expect(otherPreview.weaponName).toBeNull();
  });

  it("computes distinct stats per build from each build's own stored buff toggle state", async () => {
    const characters = {
      Calcharo: {
        // Active build reads live top-level data, not its builds[] snapshot.
        weapon: "AgesOfHarvest",
        customBuffs: { ATK_FLAT: 500 },
        activeBuildId: "active-build",
        builds: [
          { id: "active-build", name: "Active", weapon: "AgesOfHarvest", customBuffs: { ATK_FLAT: 500 } },
          { id: "other-build", name: "Other", weapon: "AgesOfHarvest" },
        ],
      },
    };

    const activePreview = await computeBuildPreview("Calcharo", "active-build", characters, []);
    const otherPreview = await computeBuildPreview("Calcharo", "other-build", characters, []);

    expect(activePreview.stats).not.toBeNull();
    expect(otherPreview.stats).not.toBeNull();
    expect(activePreview.stats!.totalAtk).toBeGreaterThan(otherPreview.stats!.totalAtk);
  });
});
