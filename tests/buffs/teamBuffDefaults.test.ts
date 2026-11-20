import { describe, it, expect } from "vitest";
import { TEAM_BUFF_DEFAULTS } from "../../src/buffs/teamBuffDefaults";
import { findTeamBuffDef } from "../../src/buffs/recommendedTeamBuffs";
import { allWeaponTeamBuffs } from "../../src/buffs/index";
import { ELEMENT_NAMES } from "../../src/buffs/teamBuffs";

// Issue #663 PR 2 / ADR 0059: the hand-written typical buffs must point at
// real buffs the teammate can actually give.
const basics = import.meta.glob("../../src/characters/*/basic.ts", { eager: true }) as Record<
  string,
  {
    getCharacterBasicInfo: () => {
      signatureWeapon?: string;
      suggestedTeams?: Array<{ members: string[] }>;
    };
  }
>;
function signatureOf(character: string): string | undefined {
  const entry = Object.entries(basics).find(([path]) => path.split("/").at(-2) === character);
  return entry?.[1].getCharacterBasicInfo().signatureWeapon;
}

describe("TEAM_BUFF_DEFAULTS", () => {
  for (const [teammate, entries] of Object.entries(TEAM_BUFF_DEFAULTS)) {
    it(`${teammate}'s typical buffs are real and theirs to give`, () => {
      const keys = entries.map((e) => e.key);
      expect(new Set(keys).size, `${teammate}: repeated key`).toBe(keys.length);
      for (const entry of entries) {
        const found = findTeamBuffDef(teammate, entry.key);
        expect(found, `${teammate}: unknown buff ${entry.key}`).not.toBeNull();
        if (!found) continue;
        if (found.source === "weapon") {
          // Weapon buffs only come from their own signature weapon.
          expect(entry.signature, `${teammate}: ${entry.key} should be marked signature`).toBe(true);
          const weapon = (allWeaponTeamBuffs as Array<{ key: string; imageUrl: string }>).find(
            (w) => w.key === entry.key,
          );
          const weaponKey = weapon?.imageUrl.split("/").pop()?.replace(/\.\w+$/, "");
          expect(weaponKey, `${teammate}: ${entry.key} isn't their signature weapon's`).toBe(signatureOf(teammate));
        } else {
          expect(entry.signature, `${teammate}: ${entry.key} isn't a weapon buff`).toBeFalsy();
        }
        if (entry.stacks != null) {
          expect(found.def.hasStacks).toBe(true);
          expect(entry.stacks).toBeLessThanOrEqual(found.def.maxStacks ?? 0);
        }
        if (found.def.inputBase) {
          expect(found.def.realisticBaseAttrValue, `${teammate}: ${entry.key} needs a realisticBaseAttrValue`).toBeTypeOf(
            "number",
          );
        }
        if (entry.fullTeamElement) {
          expect(ELEMENT_NAMES).toContain(entry.fullTeamElement);
        }
      }
    });
  }
});

// Issue #732: every teammate named in a recommended team needs an entry, even
// an empty one ("no team buffs on purpose"), so a missing support shows up
// here instead of Use team silently turning nothing on for them.
describe("teammates in recommended teams", () => {
  for (const [path, mod] of Object.entries(basics)) {
    const character = path.split("/").at(-2) as string;
    const teams = mod.getCharacterBasicInfo().suggestedTeams ?? [];
    if (!teams.length) continue;
    it(`${character}'s teammates all have typical buffs`, () => {
      for (const member of teams.flatMap((t) => t.members)) {
        expect(
          TEAM_BUFF_DEFAULTS[member],
          `${member} (in ${character}'s teams) has no typical buffs: run npm run cli -- edit team-data`,
        ).toBeDefined();
      }
    });
  }
});
