import { describe, it, expect } from "vitest";
import {
  buffIsPossibleForTeam,
  buffIsUsed,
  buffMatchesSearch,
  stripBuffDetailsHtml,
} from "../../src/buffs/buffFilters";
import { allWeaponTeamBuffs } from "../../src/buffs/index";
import { getWeaponsByType } from "../../src/weapons/weapons";

describe("stripBuffDetailsHtml", () => {
  it("removes tags but keeps the text content", () => {
    expect(stripBuffDetailsHtml("<p>Increases <b>ATK</b> by 10%</p>")).toBe(
      " Increases  ATK  by 10% ",
    );
  });
});

describe("buffMatchesSearch", () => {
  const buff = {
    name: "Concerto Boost",
    details: "<p>Increases <b>Crit Rate</b> by 10% for 20s.</p>",
  };

  it("matches on the buff name, case-insensitively", () => {
    expect(buffMatchesSearch(buff, "concerto")).toBe(true);
    expect(buffMatchesSearch(buff, "CONCERTO")).toBe(true);
  });

  it("matches on the buff description, ignoring HTML tags", () => {
    expect(buffMatchesSearch(buff, "crit rate")).toBe(true);
  });

  it("returns false when neither name nor description matches", () => {
    expect(buffMatchesSearch(buff, "healing")).toBe(false);
  });

  it("treats a blank/whitespace query as matching everything", () => {
    expect(buffMatchesSearch(buff, "")).toBe(true);
    expect(buffMatchesSearch(buff, "   ")).toBe(true);
  });
});

describe("buffIsUsed", () => {
  it("is used when the user has enabled it", () => {
    expect(buffIsUsed({ name: "Foo", details: "" }, true)).toBe(true);
  });

  it("is not used when disabled and not always-enabled", () => {
    expect(buffIsUsed({ name: "Foo", details: "" }, false)).toBe(false);
  });

  it("counts an always-enabled buff as used even if isEnabled is false", () => {
    expect(buffIsUsed({ name: "Foo", details: "", alwaysEnabled: true }, false)).toBe(true);
  });
});

describe("buffIsPossibleForTeam", () => {
  it("keeps weapon buffs a teammate can wield and drops the rest", () => {
    const team = ["Pistol", "Sword"];
    expect(buffIsPossibleForTeam({ weaponType: "Pistol" }, team)).toBe(true);
    expect(buffIsPossibleForTeam({ weaponType: "Sword" }, team)).toBe(true);
    expect(buffIsPossibleForTeam({ weaponType: "Broadblade" }, team)).toBe(false);
  });

  it("always keeps buffs with no weapon type (character/echo buffs)", () => {
    expect(buffIsPossibleForTeam({}, ["Pistol"])).toBe(true);
  });

  it("rules nothing out when no teammate is selected", () => {
    expect(buffIsPossibleForTeam({ weaponType: "Broadblade" }, [])).toBe(true);
  });
});

describe("allWeaponTeamBuffs weaponType", () => {
  // The imageUrl basename is the weapon's registry key for every entry, so
  // this cross-checks the hand-written weaponType against src/weapons.
  it.each(allWeaponTeamBuffs.map((b) => [b.key, b] as const))(
    "%s is tagged with the weapon type it's registered under",
    (_key, buff) => {
      const weaponKey = /\/weapons\/([^./]+)\./.exec(buff.imageUrl ?? "")?.[1];
      const registry = getWeaponsByType(`${buff.weaponType}s`) as Record<string, { key: string }[]>;
      const keys = Object.values(registry).flat().map((w) => w.key);
      expect(weaponKey).toBeTruthy();
      expect(keys).toContain(weaponKey);
    },
  );
});
