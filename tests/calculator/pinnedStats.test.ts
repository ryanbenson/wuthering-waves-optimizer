import { describe, it, expect } from "vitest";
import {
  STAT_GROUPS,
  STAT_KEYS,
  resolvePinnedStats,
  withStatPinToggled,
} from "../../src/calculator/pinnedStats";

const DEFAULTS = ["totalAtk", "totalCritRate", "totalCritDMG", "energyRegen"];

describe("STAT_GROUPS / STAT_KEYS", () => {
  it("puts every stat key in exactly one group", () => {
    const seen = new Set<string>();
    for (const group of STAT_GROUPS) {
      for (const key of group.keys) {
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      }
    }
    expect(STAT_KEYS.length).toBe(seen.size);
  });

  it("has 13 stat keys total, matching the panel's full row list", () => {
    expect(STAT_KEYS).toHaveLength(13);
  });
});

describe("resolvePinnedStats", () => {
  it("falls back to declaredDefaults when the character has never been customized", () => {
    expect(resolvePinnedStats(undefined, "Jinhsi", DEFAULTS)).toEqual(DEFAULTS);
    expect(resolvePinnedStats({}, "Jinhsi", DEFAULTS)).toEqual(DEFAULTS);
    expect(
      resolvePinnedStats({ pinnedStatsByCharacter: {} }, "Jinhsi", DEFAULTS),
    ).toEqual(DEFAULTS);
  });

  it("returns the character's customized set, in canonical STAT_KEYS order", () => {
    const config = {
      pinnedStatsByCharacter: {
        Jinhsi: { totalHp: true, totalCritDMG: true },
      },
    };
    // STAT_KEYS order is Core (hp/atk/def) before Crit (rate/DMG/regen).
    expect(resolvePinnedStats(config, "Jinhsi", DEFAULTS)).toEqual([
      "totalHp",
      "totalCritDMG",
    ]);
  });

  it("returns a genuinely empty list once a character has unpinned everything", () => {
    const config = { pinnedStatsByCharacter: { Jinhsi: {} } };
    expect(resolvePinnedStats(config, "Jinhsi", DEFAULTS)).toEqual([]);
  });

  it("keeps two characters' pinned sets independent", () => {
    const config = {
      pinnedStatsByCharacter: {
        Jinhsi: { totalHp: true },
        Changli: { healingBonus: true },
      },
    };
    expect(resolvePinnedStats(config, "Jinhsi", DEFAULTS)).toEqual(["totalHp"]);
    expect(resolvePinnedStats(config, "Changli", DEFAULTS)).toEqual([
      "healingBonus",
    ]);
    // A third, never-customized character still falls back to defaults.
    expect(resolvePinnedStats(config, "Encore", DEFAULTS)).toEqual(DEFAULTS);
  });
});

describe("withStatPinToggled", () => {
  it("starts from declaredDefaults plus the change on a character's first pin", () => {
    const next = withStatPinToggled(undefined, "Jinhsi", "totalHp", DEFAULTS);
    expect(resolvePinnedStats(next, "Jinhsi", DEFAULTS)).toEqual([
      "totalHp",
      "totalAtk",
      "totalCritRate",
      "totalCritDMG",
      "energyRegen",
    ]);
  });

  it("unpins a stat that was already pinned, producing a real delete", () => {
    let config = withStatPinToggled(undefined, "Jinhsi", "totalHp", DEFAULTS);
    config = withStatPinToggled(config, "Jinhsi", "totalAtk", DEFAULTS);
    expect(resolvePinnedStats(config, "Jinhsi", DEFAULTS)).not.toContain(
      "totalAtk",
    );
    expect(config.pinnedStatsByCharacter.Jinhsi).not.toHaveProperty("totalAtk");
  });

  it("can reach a genuinely empty set by unpinning every default", () => {
    let config: Record<string, any> | undefined = undefined;
    for (const key of DEFAULTS) {
      config = withStatPinToggled(config, "Jinhsi", key, DEFAULTS);
    }
    expect(resolvePinnedStats(config, "Jinhsi", DEFAULTS)).toEqual([]);
  });

  it("does not mutate the input config (returns a new object)", () => {
    const input = { pinnedStatsByCharacter: { Jinhsi: { totalHp: true } } };
    const next = withStatPinToggled(input, "Jinhsi", "totalAtk", DEFAULTS);
    expect(input.pinnedStatsByCharacter.Jinhsi).toEqual({ totalHp: true });
    expect(next).not.toBe(input);
  });

  it("keeps two characters independent when toggling one", () => {
    let config = withStatPinToggled(undefined, "Jinhsi", "totalHp", DEFAULTS);
    config = withStatPinToggled(config, "Changli", "healingBonus", DEFAULTS);
    expect(resolvePinnedStats(config, "Changli", DEFAULTS)).not.toContain(
      "totalHp",
    );
  });
});
