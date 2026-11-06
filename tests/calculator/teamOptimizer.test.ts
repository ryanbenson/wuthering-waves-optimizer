import { describe, it, expect } from "vitest";
import {
  KEEP_BUILD_DAMAGE_SHARE,
  applyLoadoutToCharacterData,
  buildTeamOptimizerSlotPlan,
  combineTeamLoadouts,
  countChangedEchoes,
  countEchoesSharedByTeam,
  defaultTeamOptimizerChoice,
  defaultTeamOptimizerGoal,
  deriveTeamBuffGuards,
  echoIdsWornOutsideTeam,
  echoesSharedOutsideTeam,
  eligibleTeamOptimizerEchoes,
  mergeMinStats,
  readTeamDamage,
  resolveTeamOptimizerEchoBuffs,
  teamBuffStatFloor,
  verifyTeamCombination,
  type TeamBuffGuardSlot,
  type TeamOptimizerList,
} from "../../src/calculator/teamOptimizer";
import {
  computeLoadoutFinalStats,
  computeOverrideBuffVariants,
  generateLoadouts,
  getOptimizerLoadoutHash,
  hasRequiredSetBonuses,
  normalizeOptimizerLoadout,
  scoreOptimizerRotation,
} from "../../src/calculator/optimizer";
import { computeResonanceChainsBuffs, computeSelfBuffs } from "../../src/calculator/stats";
import {
  buildCharacterCalculationContext,
  type TeamEnemyConfig,
} from "../../src/calculator/buildCharacterContext";
import { buildAdvancedConfigSnapshot } from "../../src/calculator/rotationAdvancedBuffs";
import { calcTeamRotationDamage, convertRotationActionsForSlot } from "../../src/calculator/teamRotation";
import { buffsByCharacter } from "../../src/buffs/index";
import type { TeamBuffDef } from "../../src/buffs/teamBuffs";
import { rotations as suomingRotations } from "../../src/characters/Suoming/presets";
import { rotations as hsinRotations } from "../../src/characters/Hsin/presets";

const enemyConfig: TeamEnemyConfig = { enemyLevel: 90, enemyResist: 0.1, enemyType: "Calamity" };

function list(scores: Array<[number, string[]]>, isTruncated = false): TeamOptimizerList {
  return { rows: scores.map(([score, echoIds]) => ({ score, echoIds })), isTruncated };
}

describe("combineTeamLoadouts", () => {
  it("takes each character's best when nothing conflicts", () => {
    const { combinations, isProven } = combineTeamLoadouts(
      [list([[100, ["a"]], [90, ["b"]]]), list([[50, ["c"]], [40, ["d"]]])],
      2,
    );
    expect(combinations[0].total).toBe(150);
    expect(combinations[0].picks.map((pick) => pick.echoIds[0])).toEqual(["a", "c"]);
    expect(combinations[1].total).toBe(140);
    expect(isProven).toBe(true);
  });

  it("never uses an echo twice, and beats taking characters greedily in either order", () => {
    // Taking A's best (100) forces B down to 10, and B's best (60) forces A down
    // to 50. The real best gives each character their second choice.
    const a = list([[100, ["x"]], [90, ["y"]], [50, ["z"]]]);
    const b = list([[60, ["x", "y"]], [55, ["z"]], [10, ["w"]]]);
    const { combinations } = combineTeamLoadouts([a, b], 1);
    expect(combinations[0].total).toBe(155);
    const ids = combinations[0].picks.flatMap((pick) => pick.echoIds);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("returns the top N in order", () => {
    const { combinations } = combineTeamLoadouts(
      [list([[10, ["a"]], [8, ["b"]], [5, ["c"]]]), list([[3, ["d"]], [1, ["e"]]])],
      3,
    );
    expect(combinations.map((c) => c.total)).toEqual([13, 11, 11]);
  });

  it("returns nothing when every combination would share an echo", () => {
    const { combinations } = combineTeamLoadouts([list([[10, ["a"]]]), list([[5, ["a"]]])]);
    expect(combinations).toEqual([]);
  });

  it("returns nothing when a character has no loadouts", () => {
    expect(combineTeamLoadouts([list([[10, ["a"]]]), list([])]).combinations).toEqual([]);
  });

  it("treats a kept build as one fixed row with no echoes to conflict", () => {
    const { combinations, isProven } = combineTeamLoadouts(
      [list([[10, ["a"]], [5, ["b"]]]), { rows: [{ score: 7, echoIds: [] }], isTruncated: false }],
      2,
    );
    expect(combinations.map((c) => c.total)).toEqual([17, 12]);
    expect(isProven).toBe(true);
  });

  describe("proof of optimal", () => {
    it("is proven when the Nth best beats anything using a row below a truncated list", () => {
      // Unseen rows for A score at most 90, so at most 90 + 50 = 140 against a 1st of 150.
      const { isProven } = combineTeamLoadouts([list([[100, ["a"]], [90, ["b"]]], true), list([[50, ["c"]]])], 1);
      expect(isProven).toBe(true);
    });

    it("isn't proven when a conflict pushes the result below what unseen rows could reach", () => {
      // B's best conflicts with all of A's kept rows, so the result is 100 + 1. An
      // unseen A row could score up to 95 and pair with B's best for 145.
      const { combinations, isProven } = combineTeamLoadouts(
        [list([[100, ["x"]], [95, ["y"]]], true), list([[50, ["x", "y"]], [1, ["z"]]])],
        1,
      );
      expect(combinations[0].total).toBe(101);
      expect(isProven).toBe(false);
    });

    it("isn't proven when a truncated list couldn't fill the top N", () => {
      const { combinations, isProven } = combineTeamLoadouts([list([[100, ["a"]]], true), list([[50, ["c"]]])], 5);
      expect(combinations).toHaveLength(1);
      expect(isProven).toBe(false);
    });
  });
});

describe("teamBuffStatFloor", () => {
  const shorekeeperCrit = (buffsByCharacter as Record<string, TeamBuffDef[]>).Shorekeeper.find(
    (def) => def.key === "SophisticatedStellarealmCritRate",
  )!;

  it("uses the entered value below the buff's cap", () => {
    expect(teamBuffStatFloor(shorekeeperCrit, 200)).toBe(200);
  });

  it("stops at the value that already reaches the cap", () => {
    // 12.5% cap at 0.01% per 0.2% Energy Regen is reached at 250%.
    expect(teamBuffStatFloor(shorekeeperCrit, 300)).toBe(250);
  });

  it("is null when the entered value doesn't clear a threshold", () => {
    const def = {
      key: "Test",
      modifiers: [{ modifier: "ATK", modifierValue: 0.001, modifierStep: 0.01, minStatValue: 190, maximumValue: 0.07 }],
    } as unknown as TeamBuffDef;
    expect(teamBuffStatFloor(def, 150)).toBeNull();
  });
});

describe("deriveTeamBuffGuards", () => {
  function slot(overrides: Partial<TeamBuffGuardSlot> & { characterId: string }): TeamBuffGuardSlot {
    return { characterData: {}, goal: "damage", finalStats: null, inventoryEchoes: [], ...overrides };
  }
  const receiverWithCritBuff = slot({
    characterId: "Iuno",
    characterData: {
      teamBuffs: {
        selectedCharacter1: "Shorekeeper",
        buffs: { SophisticatedStellarealmCritRate: { isEnabled: true, baseAttrValue: 250 } },
      },
    },
  });

  it("gives a searched support a floor from a teammate's entered value", () => {
    const [, guard] = deriveTeamBuffGuards([receiverWithCritBuff, slot({ characterId: "Shorekeeper" }), null]);
    expect(guard?.floors).toEqual([{ stat: "energyRegen", minValue: 250, label: "Energy Regen" }]);
  });

  it("ignores disabled buffs", () => {
    const receiver = slot({
      characterId: "Iuno",
      characterData: {
        teamBuffs: {
          selectedCharacter1: "Shorekeeper",
          buffs: { SophisticatedStellarealmCritRate: { isEnabled: false, baseAttrValue: 250 } },
        },
      },
    });
    expect(deriveTeamBuffGuards([receiver, slot({ characterId: "Shorekeeper" })])[1]?.floors).toEqual([]);
  });

  it("ignores buffs from someone the teammate hasn't selected", () => {
    const receiver = slot({
      characterId: "Iuno",
      characterData: {
        teamBuffs: { buffs: { SophisticatedStellarealmCritRate: { isEnabled: true, baseAttrValue: 250 } } },
      },
    });
    expect(deriveTeamBuffGuards([receiver, slot({ characterId: "Shorekeeper" })])[1]?.floors).toEqual([]);
  });

  it("reports drift instead of a floor when the provider keeps their build", () => {
    const [, guard] = deriveTeamBuffGuards([
      receiverWithCritBuff,
      slot({ characterId: "Shorekeeper", goal: "keep", finalStats: { energyRegen: 2.36 } }),
    ]);
    expect(guard?.floors).toEqual([]);
    expect(guard?.drifts).toEqual([
      { label: "Energy Regen", teammateId: "Iuno", expected: 250, actual: expect.closeTo(236, 5) },
    ]);
  });

  it("reports no drift when a kept build meets the entered value", () => {
    const [, guard] = deriveTeamBuffGuards([
      receiverWithCritBuff,
      slot({ characterId: "Shorekeeper", goal: "keep", finalStats: { energyRegen: 2.5 } }),
    ]);
    expect(guard?.drifts).toEqual([]);
  });

  const fiveRejuvenating = Array.from({ length: 5 }, (_, index) => ({
    echoId: `r${index}`,
    echo: `Echo${index}`,
    echoSet: "RejuvenatingGlow",
  }));
  const receiverWithSetBuff = slot({
    characterId: "Augusta",
    characterData: { teamBuffs: { buffs: { RejuvenatingGlow: { isEnabled: true } } } },
  });
  const wearing = {
    characterData: { echoes: Object.fromEntries(fiveRejuvenating.map((echo, index) => [index, { echoId: echo.echoId }])) },
    inventoryEchoes: fiveRejuvenating,
  };

  it("requires the teammate wearing a set to keep it when others count on its team buff", () => {
    const [, guard] = deriveTeamBuffGuards([receiverWithSetBuff, slot({ characterId: "Shorekeeper", ...wearing })]);
    expect(guard?.requiredSetBonusLabels).toEqual(["Rejuvenating Glow 5 Set"]);
    expect(guard?.requiredSetKeys).toEqual(["RejuvenatingGlow"]);
  });

  it("requires nothing when a kept build already provides that set", () => {
    const guards = deriveTeamBuffGuards([
      receiverWithSetBuff,
      slot({ characterId: "Shorekeeper", goal: "keep", ...wearing }),
      slot({ characterId: "Iuno", ...wearing }),
    ]);
    expect(guards[1]?.requiredSetBonusLabels).toEqual([]);
    expect(guards[2]?.requiredSetBonusLabels).toEqual([]);
  });

  it("requires nothing when no teammate wears the set", () => {
    const [, guard] = deriveTeamBuffGuards([receiverWithSetBuff, slot({ characterId: "Shorekeeper" })]);
    expect(guard?.requiredSetBonusLabels).toEqual([]);
  });

  it("requires the main echo behind an enabled echo team buff", () => {
    const receiver = slot({
      characterId: "Augusta",
      characterData: { teamBuffs: { buffs: { FallacyOfNoReturn: { isEnabled: true } } } },
    });
    const provider = slot({ characterId: "Shorekeeper", characterData: { mainEcho: { echo: "FallacyOfNoReturn" } } });
    expect(deriveTeamBuffGuards([receiver, provider])[1]?.requiredMainEcho).toBe("FallacyOfNoReturn");
  });
});

describe("hasRequiredSetBonuses", () => {
  const stats = { setBonusOnePiece: null, setBonusOne: "Void Thunder 2 Set", setBonusTwo: "Void Thunder 5 Set" };
  it("allows anything when nothing is required", () => {
    expect(hasRequiredSetBonuses(stats, [])).toBe(true);
  });
  it("needs every required label active", () => {
    expect(hasRequiredSetBonuses(stats, ["Void Thunder 5 Set"])).toBe(true);
    expect(hasRequiredSetBonuses(stats, ["Rejuvenating Glow 5 Set"])).toBe(false);
  });
});

describe("mergeMinStats", () => {
  it("keeps the higher value for a stat and adds new ones", () => {
    expect(
      mergeMinStats(
        [{ stat: "energyRegen", minValue: 200 }, { stat: "totalAtk", minValue: 1000 }],
        [{ stat: "energyRegen", minValue: 250 }, { stat: "totalCritRate", minValue: 50 }],
      ),
    ).toEqual([
      { stat: "energyRegen", minValue: 250 },
      { stat: "totalAtk", minValue: 1000 },
      { stat: "totalCritRate", minValue: 50 },
    ]);
  });
});

describe("defaults", () => {
  const inventory = [
    { echoId: "a", echo: "MainA", echoSet: "VoidThunder" },
    { echoId: "b", echo: "B", echoSet: "VoidThunder" },
    { echoId: "c", echo: "C", echoSet: "MoltenRift" },
  ];

  it("combines saved optimizer settings with what's worn, so the current build stays in the search", () => {
    const choice = defaultTeamOptimizerChoice(
      {
        echoes: { 0: { echoId: "a" }, 1: { echoId: "b" } },
        mainEcho: { echo: "MainA" },
        optimizer: { echoSets: ["MidnightVeil"], mainEchoes: ["Saved"], minStats: [{ stat: "energyRegen", minValue: 120 }] },
      },
      inventory,
    );
    expect(choice.sets).toEqual(["MidnightVeil", "VoidThunder"]);
    expect(choice.mainEchoes).toEqual(["Saved", "MainA"]);
    expect(choice.minStats).toEqual([{ stat: "energyRegen", minValue: 120 }]);
  });

  it("falls back to what's worn, ignoring a lone echo from another set", () => {
    const choice = defaultTeamOptimizerChoice(
      { echoes: { 0: { echoId: "a" }, 1: { echoId: "b" }, 2: { echoId: "c" } }, mainEcho: { echo: "MainA" } },
      inventory,
    );
    expect(choice.sets).toEqual(["VoidThunder"]);
    expect(choice.mainEchoes).toEqual(["MainA"]);
  });

  it("keeps the main echo's set even when only that one echo is worn", () => {
    const choice = defaultTeamOptimizerChoice(
      { echoes: { 0: { echoId: "c" }, 1: { echoId: "a" }, 2: { echoId: "b" } }, mainEcho: { echo: "C" } },
      inventory,
    );
    expect(choice.sets).toEqual(["VoidThunder", "MoltenRift"]);
  });

  it("keeps builds with no actions, no echoes to use, or a tiny damage share", () => {
    const base = { hasActions: true, damageShare: 0.5, hasEligibleEchoes: true };
    expect(defaultTeamOptimizerGoal(base)).toBe("damage");
    expect(defaultTeamOptimizerGoal({ ...base, hasActions: false })).toBe("keep");
    expect(defaultTeamOptimizerGoal({ ...base, hasEligibleEchoes: false })).toBe("keep");
    expect(defaultTeamOptimizerGoal({ ...base, damageShare: KEEP_BUILD_DAMAGE_SHARE - 0.01 })).toBe("keep");
  });
});

describe("echo helpers", () => {
  it("filters eligibility by set, exclusions and a required main echo", () => {
    const inventory = [
      { echoId: "a", echo: "A", echoSet: "VoidThunder", rank: 5, stat: "ATK", type: 1 },
      { echoId: "b", echo: "B", echoSet: "VoidThunder", rank: 5, stat: "ATK", type: 1 },
      { echoId: "c", echo: "C", echoSet: "MoltenRift", rank: 5, stat: "ATK", type: 1 },
    ];
    const ids = (echoes: any[]) => echoes.map((echo) => echo.echoId);
    expect(ids(eligibleTeamOptimizerEchoes({ inventoryEchoes: inventory, sets: ["VoidThunder"] }))).toEqual(["a", "b"]);
    expect(
      ids(eligibleTeamOptimizerEchoes({ inventoryEchoes: inventory, sets: ["VoidThunder"], excludedEchoIds: new Set(["a"]) })),
    ).toEqual(["b"]);
    expect(
      ids(eligibleTeamOptimizerEchoes({ inventoryEchoes: inventory, sets: ["VoidThunder"], requiredMainEcho: "C" })),
    ).toEqual(["a", "b", "c"]);
    expect(
      ids(eligibleTeamOptimizerEchoes({ inventoryEchoes: inventory, sets: ["VoidThunder"], requiredMainEcho: "A" })),
    ).toEqual(["a", "b"]);
    // Blank inventory entries (no echo chosen yet) must never match a missing main echo.
    const blank = { echoId: "blank", echo: null, echoSet: null, rank: 5, stat: null, type: null };
    expect(ids(eligibleTeamOptimizerEchoes({ inventoryEchoes: [...inventory, blank], sets: ["VoidThunder"] }))).toEqual(["a", "b"]);
  });

  it("finds echoes only worn outside the team, leaving ones a team member also wears", () => {
    const equipped = { a: { Hsin: 0 }, b: { Lupa: 1 }, c: { Hsin: 2, Lupa: 0 }, d: {} };
    expect(echoIdsWornOutsideTeam(equipped, ["Hsin", "Suoming", null])).toEqual(new Set(["b"]));
    expect(echoesSharedOutsideTeam(["a", "c"], equipped, ["Hsin", null, null])).toEqual(["Lupa"]);
  });

  it("counts changed and shared echoes", () => {
    expect(countChangedEchoes(["a", "b", "c"], ["a", "x", "y"])).toBe(2);
    expect(countEchoesSharedByTeam([["a", "b"], ["b", "c"], []])).toBe(1);
  });
});

// The whole pipeline minus the worker threads, against the Team page's own
// calculation. If scoring ever drifts from it, the numbers players see would
// stop matching what they get after saving.
describe("search, combine and verify", () => {
  // Enough to force a choice: two characters competing for one set's echoes.
  const pool = [
    ["suo-main", "ReminiscenceSuhsintheInevitable", 4, "CritDMG", 44, "ATK", 80],
    ["hsin-main", "ReminiscenceSuhsintheInevitable", 4, "CritDMG", 44, "CritRate", 6],
    ["four-a", "Four A", 4, "CritRate", 22, "CritDMG", 15],
    ["three-a", "Three A", 3, "Electro", 30, "ATK", 60],
    ["three-b", "Three B", 3, "Electro", 30, "CritRate", 9],
    ["three-c", "Three C", 3, "ATK", 30, "CritDMG", 12],
    ["three-d", "Three D", 3, "Electro", 30, "CritRate", 6],
    ["one-a", "One A", 1, "ATK", 18, "CritRate", 10],
    ["one-b", "One B", 1, "ATK", 18, "CritDMG", 20],
    ["one-c", "One C", 1, "ATK", 18, "CritRate", 7],
    ["one-d", "One D", 1, "HP", 18, "ATK", 40],
  ].map(([echoId, echo, type, stat, , subType, subValue]) => ({
    echoId,
    echo,
    type,
    rank: 5,
    stat,
    echoSet: "HeartofSwornVigil",
    echoSubStatsType1: subType,
    echoSubStatsValue1: subValue,
  }));

  async function makeTeam() {
    const baseCharacters: Record<string, any> = {
      Suoming: {
        weapon: "EmeraldOfGenesis",
        echoSetPassives: { HeartofSwornVigil2SetElectro: { isEnabled: true }, HeartofSwornVigilElectro: { isEnabled: true } },
        mainEcho: { echo: "ReminiscenceSuhsintheInevitable", rank: 5, buffs: {} },
      },
      Hsin: {
        weapon: "BloomingJadehaven",
        echoSetPassives: { HeartofSwornVigil2SetElectro: { isEnabled: true } },
        mainEcho: { echo: "ReminiscenceSuhsintheInevitable", rank: 5, buffs: {} },
      },
    };
    // Every weapon passive on, then overridden on one action, so the override
    // path has to re-resolve them. That needs `weaponPassiveDefs` in the context.
    const built = await buildCharacterCalculationContext("Suoming", baseCharacters, enemyConfig, []);
    const passives = built.definitions.weaponPassives;
    expect(passives.length).toBeGreaterThan(0);
    baseCharacters.Suoming.weaponPassives = Object.fromEntries(
      passives.map((passive: any) => [passive.key, { isEnabled: true, stacks: passive.maxStacks ?? 0 }]),
    );
    const snapshot = buildAdvancedConfigSnapshot(baseCharacters.Suoming, built.definitions, "current");

    const suomingActions = convertRotationActionsForSlot((suomingRotations[0] as any).data.actions, 0, 1);
    suomingActions[0] = { ...suomingActions[0], advancedConfig: snapshot };
    const hsinActions = convertRotationActionsForSlot((hsinRotations[0] as any).data.actions, 1, suomingActions.length + 1);
    return {
      characters: baseCharacters,
      team: {
        name: "Test team",
        characterIds: ["Suoming", "Hsin", null],
        buildIds: [null, null, null],
        actions: [...suomingActions, ...hsinActions],
        duration: 25,
      },
    };
  }

  async function search(team: any, characters: Record<string, any>, slot: number, characterId: string) {
    const mains = ["ReminiscenceSuhsintheInevitable"];
    const plan = await buildTeamOptimizerSlotPlan({
      team,
      slot,
      characterId,
      characterData: characters[characterId],
      enemyConfig,
      inventoryEchoes: pool,
      mainEchoKeys: mains,
    });
    const { context, rotationData, echoBuffs } = plan;
    const self = computeSelfBuffs(
      context.activeCharacterBuffs,
      context.chosenChar?.buffs ?? [],
      context.activeCharacterResonanceChains,
      context.talentData,
      characterId,
      context.activeStance ?? null,
      { havocBaneStacks: context.havocBaneStacks },
    );
    const chains = computeResonanceChainsBuffs(
      context.activeCharacterResonanceChains,
      context.chosenChar?.resonanceChains ?? [],
      context.talentData,
      context.activeStance ?? null,
    );
    const variants = rotationData.overrideActions.length
      ? computeOverrideBuffVariants(rotationData.overrideActions, context)
      : new Map();
    const seen = new Set<number>();
    const rows: Array<{ score: number; echoIds: string[]; loadout: any[] }> = [];
    for (const raw of generateLoadouts(pool, mains, 0, [], 0, new Set(), new Set(), "Any")) {
      const loadout = normalizeOptimizerLoadout(raw as any[]);
      const hash = getOptimizerLoadoutHash(loadout);
      if (seen.has(hash)) continue;
      seen.add(hash);
      const stats = computeLoadoutFinalStats(
        loadout,
        context,
        self,
        chains,
        echoBuffs.echoSetPassiveBuffs,
        echoBuffs.mainEchoStats,
      );
      const { damageAggregation } = scoreOptimizerRotation(rotationData, loadout, stats, context, variants);
      rows.push({ score: damageAggregation.avgDamage ?? 0, echoIds: loadout.map((echo) => echo.echoId), loadout });
    }
    rows.sort((a, b) => b.score - a.score);
    return { rows, echoBuffs, rotationData };
  }

  it("scores every top combination exactly as the Team page calculates it", async () => {
    const { team, characters } = await makeTeam();
    const suoming = await search(team, characters, 0, "Suoming");
    const hsin = await search(team, characters, 1, "Hsin");
    expect(suoming.rotationData.overrideActions.length).toBe(1);

    const { combinations, isProven } = combineTeamLoadouts(
      [
        { rows: suoming.rows, isTruncated: false },
        { rows: hsin.rows, isTruncated: false },
      ],
      5,
    );
    expect(combinations).toHaveLength(5);
    expect(isProven).toBe(true);

    for (const combination of combinations) {
      const ids = combination.picks.flatMap((pick) => pick.echoIds);
      expect(new Set(ids).size).toBe(ids.length);
      const verification = await verifyTeamCombination({
        team,
        characters,
        loadoutBySlot: [(combination.picks[0] as any).loadout, (combination.picks[1] as any).loadout, null],
        echoBuffsBySlot: [suoming.echoBuffs, hsin.echoBuffs, null],
        enemyConfig,
        inventoryEchoes: pool,
        damageType: "Average",
        expectedTotal: combination.total,
      });
      expect(verification.matches).toBe(true);
      expect(verification.total).toBeCloseTo(combination.total, 3);
    }
  });

  it("uses a teammate's echoes only when that beats the alternatives, never both at once", async () => {
    const { team, characters } = await makeTeam();
    const suoming = await search(team, characters, 0, "Suoming");
    const hsin = await search(team, characters, 1, "Hsin");
    const independentBest = suoming.rows[0].score + hsin.rows[0].score;
    const shareEchoes = suoming.rows[0].echoIds.some((id) => hsin.rows[0].echoIds.includes(id));
    expect(shareEchoes).toBe(true);

    const { combinations } = combineTeamLoadouts([
      { rows: suoming.rows, isTruncated: false },
      { rows: hsin.rows, isTruncated: false },
    ]);
    expect(combinations[0].total).toBeLessThan(independentBest);
    expect(combinations[0].total).toBeGreaterThan(0);
  });

  it("flags a total that disagrees with the Team page", async () => {
    const { team, characters } = await makeTeam();
    const suoming = await search(team, characters, 0, "Suoming");
    const hsin = await search(team, characters, 1, "Hsin");
    const combination = combineTeamLoadouts([
      { rows: suoming.rows, isTruncated: false },
      { rows: hsin.rows, isTruncated: false },
    ]).combinations[0];
    const verification = await verifyTeamCombination({
      team,
      characters,
      loadoutBySlot: [(combination.picks[0] as any).loadout, (combination.picks[1] as any).loadout, null],
      echoBuffsBySlot: [suoming.echoBuffs, hsin.echoBuffs, null],
      enemyConfig,
      inventoryEchoes: pool,
      damageType: "Average",
      expectedTotal: combination.total * 1.01,
    });
    expect(verification.matches).toBe(false);
  });

  it("reads the requested damage type", async () => {
    const { team, characters } = await makeTeam();
    const result = await calcTeamRotationDamage(team as any, characters, enemyConfig, pool);
    expect(readTeamDamage(result.total, "Crit")).toBe(result.total.critDamage);
    expect(readTeamDamage(result.total, "Normal")).toBe(result.total.normalDamage);
    expect(readTeamDamage(result.total, "Average")).toBe(result.total.avgDamage);
  });

  it("only writes the settings of sets the loadout actually activates", () => {
    const data = { echoSetPassives: { SomeOtherSetPassive: { isEnabled: true } }, mainEcho: { echo: "Old", rank: 4 } };
    const echoBuffs = resolveTeamOptimizerEchoBuffs("Suoming", {}, ["ReminiscenceSuhsintheInevitable"], {});
    const applied = applyLoadoutToCharacterData(data, pool.slice(0, 2), echoBuffs);
    expect(applied.echoSetPassives.SomeOtherSetPassive).toEqual({ isEnabled: true });
    expect(applied.echoes[0]).toEqual({ echoId: "suo-main" });
    expect(applied.echoes[4]).toEqual({ echoId: null });
    expect(applied.mainEcho.echo).toBe("ReminiscenceSuhsintheInevitable");
    expect(applied.mainEcho.rank).toBe(5);
  });
});
