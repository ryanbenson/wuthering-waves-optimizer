import { describe, it, expect } from "vitest";
import { buildCharacterCalculationContext } from "../../src/calculator/buildCharacterContext";
import type { TeamEnemyConfig } from "../../src/calculator/buildCharacterContext";
import { resolveRotationActionToAttackData } from "../../src/calculator/resolveRotationAction";
import { calcDamages } from "../../src/calculator/attacks";
import { setBonusEffectsTwo } from "../../src/echoes/sets";

// Issue #699: Sound of True Name's 5-piece raises Echo Skill Crit. Rate by
// 20%, not every attack's. It used the global `CritRate` modifier, so with the
// passive on, Basic/Skill/Liberation hits got +20% Crit Rate too.
const enemyConfig: TeamEnemyConfig = { enemyLevel: 90, enemyResist: 0.1, enemyType: "Calamity" };
const PASSIVE = "SoundofTrueName2Set"; // the 5-piece's saved toggle key

async function sigrika(passiveOn: boolean) {
  return buildCharacterCalculationContext(
    "Sigrika",
    {
      Sigrika: {
        echoSetBonus: { setBonusTwo: "Sound of True Name 5 Set" },
        echoSetPassives: { [PASSIVE]: { isEnabled: passiveOn } },
      },
    },
    enemyConfig,
  );
}

async function critRateFor(passiveOn: boolean, action: Record<string, unknown>) {
  const built = await sigrika(passiveOn);
  const attack = resolveRotationActionToAttackData(
    { id: "a1", order: 0, count: 1, ...action },
    built.chosenChar,
    built.characterLevel,
  );
  built.context.rotationsList = [{ id: "r1", name: "r1", duration: 10, order: 0, attacks: [attack] }];
  return calcDamages(built.context).rotations[0].attacks[0].damage.totalDamageContext.critRate as number;
}

const basicAttack = { type: "basic", key: "BasicAttackStage1DMG" };
const echoAttack = { type: "echoAttacks", key: "NamelessExplorerAttacksDMG", mainEcho: "NamelessExplorer", mainEchoRank: 5 };

describe("Sound of True Name 5-piece Echo Skill Crit. Rate (#699)", () => {
  it("is scoped to Echo attacks in the set data", () => {
    const modifiers = setBonusEffectsTwo["Sound of True Name 5 Set"].passives?.flatMap((p) => p.modifiers ?? []) ?? [];
    expect(modifiers).toContainEqual({ modifier: "CritRate:Echo", modifierValue: 20 });
    expect(modifiers.some((m) => m.modifier === "CritRate")).toBe(false);
  });

  it("leaves overall Crit Rate alone and stores the bonus as Echo Crit Rate", async () => {
    const off = await sigrika(false);
    const on = await sigrika(true);
    expect(on.finalStats.critRate).toBe(off.finalStats.critRate);
    expect((on.echoStats as Record<string, number>)["CritRate:Echo"]).toBe(20);
    expect((on.echoStats as Record<string, number>).Aero).toBe(15);
  });

  it("adds 20% Crit Rate to an Echo attack only", async () => {
    expect(await critRateFor(true, basicAttack)).toBeCloseTo(await critRateFor(false, basicAttack), 10);
    expect((await critRateFor(true, echoAttack)) - (await critRateFor(false, echoAttack))).toBeCloseTo(0.2, 10);
  });
});
