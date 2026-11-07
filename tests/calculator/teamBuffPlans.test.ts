import { describe, expect, it } from "vitest";
import {
  applyProvisionsToTeamBuffs,
  buildTeamBuffOptions,
  characterCanHeal,
  diffTeamBuffs,
  enumerateTeamBuffPlans,
  incomingSlot,
  listTeamBuffOffers,
  pickVariedResults,
  provisionReceivers,
  shortlistPlans,
  teamBuffSetBonus,
  teamBuffSource,
  teamBuffsFromAbsentCharacters,
  teamBuffsSignature,
  type TeamBuffOffer,
  type TeamBuffOption,
} from "../../src/calculator/teamBuffPlans";
import { combineTeamLoadouts, defaultTeamOptimizerGoal } from "../../src/calculator/teamOptimizer";
import { allEchoBuffs } from "../../src/buffs/index";

function echo(echoId: string, name: string, echoSet: string, type = 1) {
  return { echoId, echo: name, echoSet, type, rank: 5, stat: "ATK" };
}

const fullSet = (set: string) => [
  echo(`${set}-4`, `${set}Four`, set, 4),
  echo(`${set}-3a`, `${set}ThreeA`, set, 3),
  echo(`${set}-3b`, `${set}ThreeB`, set, 3),
  echo(`${set}-1a`, `${set}OneA`, set, 1),
  echo(`${set}-1b`, `${set}OneB`, set, 1),
];

function offersFor(echoes: any[], overrides: Partial<Parameters<typeof listTeamBuffOffers>[0]> = {}) {
  return listTeamBuffOffers({ usableEchoes: echoes, teammateBuffConfigs: [], canHeal: false, ...overrides });
}
const keys = (offers: TeamBuffOffer[]) => offers.map((offer) => offer.defKey);
const preselected = (offers: TeamBuffOffer[]) => keys(offers.filter((offer) => offer.isPreselected));

describe("teamBuffSource", () => {
  it("tells main echo buffs from set buffs, including set variants", () => {
    expect(teamBuffSource("FallacyOfNoReturn")).toMatchObject({ kind: "main", echoKey: "FallacyOfNoReturn" });
    expect(teamBuffSource("MoonlitClouds")).toMatchObject({ kind: "set", setKey: "MoonlitClouds" });
    expect(teamBuffSource("FlowerofTingedYearningUnison")).toMatchObject({ kind: "set", setKey: "FlowerofTingedYearning" });
    expect(teamBuffSource("NotAnEchoBuff")).toBeNull();
  });

  it("recognizes every echo team buff, so none can silently stay on when nobody provides it", () => {
    expect((allEchoBuffs as { key: string }[]).filter((def) => !teamBuffSource(def.key))).toEqual([]);
  });

  it("finds the bonus that provides a set's buff", () => {
    expect(teamBuffSetBonus("RejuvenatingGlow")).toEqual({ label: "Rejuvenating Glow 5 Set", pieces: 5 });
    expect(teamBuffSetBonus("LawofHarmony")).toEqual({ label: "Law of Harmony 3 Set", pieces: 3 });
  });
});

describe("listTeamBuffOffers", () => {
  it("only offers a set with enough different echoes to activate", () => {
    expect(keys(offersFor(fullSet("MoonlitClouds")))).toContain("MoonlitClouds");
    expect(keys(offersFor(fullSet("MoonlitClouds").slice(0, 4)))).not.toContain("MoonlitClouds");
    const duplicates = [...fullSet("MoonlitClouds").slice(0, 4), echo("dup", "MoonlitCloudsFour", "MoonlitClouds", 4)];
    expect(keys(offersFor(duplicates))).not.toContain("MoonlitClouds");
  });

  it("ticks unconditional buffs by default", () => {
    expect(preselected(offersFor(fullSet("MoonlitClouds")))).toContain("MoonlitClouds");
    expect(preselected(offersFor([echo("f", "FallacyOfNoReturn", "RejuvenatingGlow", 4)]))).toContain("FallacyOfNoReturn");
  });

  it("leaves conditional buffs unticked, because the calculator can't check them", () => {
    const offers = offersFor(fullSet("EmpyreanAnthem"));
    expect(keys(offers)).toContain("EmpyreanAnthem");
    expect(preselected(offers)).not.toContain("EmpyreanAnthem");
    expect(offers.find((offer) => offer.defKey === "EmpyreanAnthem")?.condition).toMatch(/Coordinated/);
  });

  it("leaves scaling buffs unticked", () => {
    expect(preselected(offersFor(fullSet("PactofNeonlightLeap")))).not.toContain("PactofNeonlightLeap");
  });

  it("ticks a healing set only for a healer", () => {
    expect(preselected(offersFor(fullSet("RejuvenatingGlow")))).not.toContain("RejuvenatingGlow");
    expect(preselected(offersFor(fullSet("RejuvenatingGlow"), { canHeal: true }))).toContain("RejuvenatingGlow");
  });

  it("trusts a buff the player already enabled on a teammate", () => {
    const offers = offersFor(fullSet("EmpyreanAnthem"), {
      teammateBuffConfigs: [{ EmpyreanAnthem: { isEnabled: true } }],
    });
    expect(preselected(offers)).toContain("EmpyreanAnthem");
  });
});

describe("characterCanHeal", () => {
  it("looks for healing attacks in the kit", () => {
    expect(characterCanHeal({ basicAttacks: [{ type: "Healing" }] })).toBe(true);
    expect(characterCanHeal({ basicAttacks: [{ type: "Basic" }], name: "x" })).toBe(false);
    expect(characterCanHeal(null)).toBe(false);
  });
});

describe("buildTeamBuffOptions", () => {
  const moonlit = fullSet("MoonlitClouds");
  const plain = fullSet("EternalRadiance");

  it("offers the player's own sets, and each buff set worn alone in full", () => {
    const options = buildTeamBuffOptions({
      choiceSets: ["EternalRadiance"],
      choiceMainEchoes: ["EternalRadianceFour"],
      offers: offersFor(moonlit),
      usableEchoes: [...plain, ...moonlit],
    });
    expect(options.map((option) => option.provides)).toEqual([[], ["MoonlitClouds"]]);
    expect(options[0]).toMatchObject({ sets: ["EternalRadiance"], requiredSetBonusLabels: [] });
    expect(options[1]).toMatchObject({
      sets: ["MoonlitClouds"],
      mainEchoes: ["MoonlitCloudsFour"],
      requiredSetBonusLabels: ["Moonlit Clouds 5 Set"],
    });
  });

  it("treats a buff set the player chose as a buff option, never as a plain set", () => {
    const options = buildTeamBuffOptions({
      choiceSets: ["MoonlitClouds"],
      choiceMainEchoes: ["MoonlitCloudsFour"],
      offers: offersFor(moonlit),
      usableEchoes: moonlit,
    });
    expect(options.map((option) => option.provides)).toEqual([["MoonlitClouds"]]);
  });

  it("combines a set with a main echo buff only if a copy is in that set", () => {
    const glow = [...fullSet("RejuvenatingGlow").slice(1), echo("f", "FallacyOfNoReturn", "RejuvenatingGlow", 4)];
    const offers = offersFor([...glow, ...moonlit], { canHeal: true });
    const options = buildTeamBuffOptions({
      choiceSets: [],
      choiceMainEchoes: [],
      offers,
      usableEchoes: [...glow, ...moonlit],
    });
    const provides = options.map((option) => option.provides);
    expect(provides).toContainEqual(["RejuvenatingGlow", "FallacyOfNoReturn"]);
    expect(provides).not.toContainEqual(["MoonlitClouds", "FallacyOfNoReturn"]);
  });

  it("doesn't choose a main echo as if it provided nothing while that buff is on offer", () => {
    const glow = [...fullSet("RejuvenatingGlow"), echo("f", "FallacyOfNoReturn", "RejuvenatingGlow", 4)];
    const options = buildTeamBuffOptions({
      choiceSets: [],
      choiceMainEchoes: [],
      offers: offersFor(glow, { canHeal: true }),
      usableEchoes: glow,
    });
    const setOnly = options.find((option) => option.provides.join() === "RejuvenatingGlow");
    expect(setOnly?.mainEchoes).not.toContain("FallacyOfNoReturn");
  });

  it("has nothing to offer with no sets and no buffs", () => {
    expect(buildTeamBuffOptions({ choiceSets: [], choiceMainEchoes: [], offers: [], usableEchoes: plain })).toEqual([]);
  });
});

function option(id: string, provides: string[] = []): TeamBuffOption {
  return { id, provides, sets: [], mainEchoes: [], requiredSetBonusLabels: [], requiredMainEcho: null };
}

describe("enumerateTeamBuffPlans", () => {
  const slots = [
    { slot: 0, characterId: "A", options: [option("a1"), option("a2")] },
    { slot: 1, characterId: "B", options: [option("b1"), option("b2"), option("b3")] },
  ];

  it("covers every pairing of options", () => {
    const { plans, isCapped } = enumerateTeamBuffPlans(slots);
    expect(plans).toHaveLength(6);
    expect(new Set(plans.map((plan) => plan.id)).size).toBe(6);
    expect(isCapped).toBe(false);
  });

  it("reports when it stops early, because skipped plans rule out a proof", () => {
    const { plans, isCapped } = enumerateTeamBuffPlans(slots, 4);
    expect(plans).toHaveLength(4);
    expect(isCapped).toBe(true);
  });

  it("has no plans if a character has no options", () => {
    expect(enumerateTeamBuffPlans([{ slot: 0, characterId: "A", options: [] }]).plans).toEqual([]);
  });
});

describe("incomingSlot", () => {
  it("is whoever the rotation swaps to most from the provider", () => {
    const actions = [0, 2, 0, 1, 2, 0].map((slot, order) => ({ slot, order }));
    // From 2: to 0 twice. From 0: to 2 once, to 1 once, so the first wins.
    expect(incomingSlot(actions, 2, [0, 1, 2])).toBe(0);
    expect(incomingSlot(actions, 0, [0, 1, 2])).toBe(2);
  });

  it("reads actions in rotation order, and skips disabled ones", () => {
    const actions = [
      { slot: 1, order: 3 },
      { slot: 0, order: 1 },
      { slot: 2, order: 2, isDisabled: true },
    ];
    expect(incomingSlot(actions, 0, [0, 1, 2])).toBe(1);
  });

  it("falls back to a teammate with actions if the provider never swaps out", () => {
    expect(incomingSlot([{ slot: 1, order: 1 }], 2, [0, 1, 2])).toBe(1);
    expect(incomingSlot([], 0, [0])).toBeNull();
  });
});

describe("provisionReceivers", () => {
  const actions = [
    { slot: 2, order: 1 },
    { slot: 0, order: 2 },
    { slot: 1, order: 3 },
  ];

  it("sends a whole-team buff to every teammate, not the provider", () => {
    expect(provisionReceivers({ slot: 2, defKey: "FallacyOfNoReturn" }, actions, [0, 1, 2])).toEqual([0, 1]);
  });

  it("sends an Outro buff only to the incoming Resonator", () => {
    expect(provisionReceivers({ slot: 2, defKey: "MoonlitClouds" }, actions, [0, 1, 2])).toEqual([0]);
  });
});

describe("applyProvisionsToTeamBuffs", () => {
  const saved = {
    selectedCharacter1: "Denia",
    buffs: {
      RejuvenatingGlow: { isEnabled: true },
      SomeKitBuff: { isEnabled: true, baseAttrValue: 250 },
      PactofNeonlightLeap: { isEnabled: false, stacks: 20 },
    },
  };

  it("turns off an echo buff nobody provides, and leaves kit buffs alone", () => {
    const next = applyProvisionsToTeamBuffs({ teamBuffs: saved, provided: [], isTeamFull: true });
    expect(next.buffs.RejuvenatingGlow.isEnabled).toBe(false);
    expect(next.buffs.SomeKitBuff).toEqual({ isEnabled: true, baseAttrValue: 250 });
    expect(next.selectedCharacter1).toBe("Denia");
  });

  it("leaves echo buffs on for a team with an empty slot, since they may stand in for that teammate", () => {
    const next = applyProvisionsToTeamBuffs({ teamBuffs: saved, provided: [], isTeamFull: false });
    expect(next.buffs.RejuvenatingGlow.isEnabled).toBe(true);
  });

  it("turns on what's provided, keeping saved stacks or assuming the maximum", () => {
    const next = applyProvisionsToTeamBuffs({
      teamBuffs: saved,
      provided: ["PactofNeonlightLeap", "LawofHarmony"],
      isTeamFull: true,
    });
    expect(next.buffs.PactofNeonlightLeap).toEqual({ isEnabled: true, stacks: 20 });
    expect(next.buffs.LawofHarmony).toEqual({ isEnabled: true, stacks: 4 });
  });

  it("doesn't change the saved settings", () => {
    const before = JSON.stringify(saved);
    applyProvisionsToTeamBuffs({ teamBuffs: saved, provided: ["MoonlitClouds"], isTeamFull: true });
    expect(JSON.stringify(saved)).toBe(before);
  });

  it("works for a character with no team buffs saved", () => {
    const next = applyProvisionsToTeamBuffs({ teamBuffs: undefined, provided: ["MoonlitClouds"], isTeamFull: true });
    expect(next.buffs.MoonlitClouds.isEnabled).toBe(true);
  });
});

describe("teamBuffsSignature and diffTeamBuffs", () => {
  it("treats the same enabled buffs as the same search, whatever else is saved", () => {
    const a = { buffs: { MoonlitClouds: { isEnabled: true }, RejuvenatingGlow: { isEnabled: false } } };
    const b = { buffs: { MoonlitClouds: { isEnabled: true } } };
    expect(teamBuffsSignature(a)).toBe(teamBuffsSignature(b));
    expect(teamBuffsSignature(a)).not.toBe(teamBuffsSignature({ buffs: {} }));
  });

  it("separates different stacks", () => {
    const at = (stacks: number) => ({ buffs: { LawofHarmony: { isEnabled: true, stacks } } });
    expect(teamBuffsSignature(at(2))).not.toBe(teamBuffsSignature(at(4)));
  });

  it("lists what a plan changes", () => {
    const changes = diffTeamBuffs(
      "Aemeath",
      { buffs: { RejuvenatingGlow: { isEnabled: true } } },
      { buffs: { MoonlitClouds: { isEnabled: true } } },
    );
    expect(changes).toContainEqual({ characterId: "Aemeath", defKey: "RejuvenatingGlow", isOn: false });
    expect(changes).toContainEqual({ characterId: "Aemeath", defKey: "MoonlitClouds", isOn: true });
    expect(changes).toHaveLength(2);
  });
});

describe("shortlistPlans", () => {
  const plan = (estimate: number) => ({ estimate });

  it("keeps everything close to the best, however many that is", () => {
    const plans = [100, 99, 98, 97.5, 97.1, 90].map(plan);
    expect(shortlistPlans(plans, 0.03, 3).map((p) => p.estimate)).toEqual([100, 99, 98, 97.5, 97.1]);
  });

  it("keeps a minimum even when the rest are far behind", () => {
    expect(shortlistPlans([100, 50, 40, 30].map(plan), 0.03, 3).map((p) => p.estimate)).toEqual([100, 50, 40]);
  });

  it("handles no plans", () => {
    expect(shortlistPlans([])).toEqual([]);
  });
});

describe("pickVariedResults", () => {
  const row = (planId: string, total: number) => ({ planId, total });

  it("shows each plan's best before a plan's near-duplicates, sorted by total", () => {
    const rows = [row("a", 100), row("a", 99.9), row("a", 99.8), row("b", 95), row("c", 90)];
    expect(pickVariedResults(rows, 3)).toEqual([row("a", 100), row("b", 95), row("c", 90)]);
  });

  it("fills up from the best remaining rows", () => {
    const rows = [row("a", 100), row("a", 99.9), row("a", 99.8), row("b", 95)];
    expect(pickVariedResults(rows, 3)).toEqual([row("a", 100), row("a", 99.9), row("b", 95)]);
  });

  it("always leads with the best total", () => {
    const rows = [row("b", 90), row("a", 100)];
    expect(pickVariedResults(rows, 5)[0]).toEqual(row("a", 100));
  });
});

describe("teamBuffsFromAbsentCharacters", () => {
  const data = {
    teamBuffs: {
      selectedCharacter1: "Shorekeeper",
      selectedCharacter2: "Denia",
      buffs: { OutroSkillBinaryButterfly: { isEnabled: true } },
    },
  };

  it("names an off-team character whose buffs are on", () => {
    expect(teamBuffsFromAbsentCharacters(data, ["Aemeath", "Lynae", "Mornye"])).toEqual(["Shorekeeper"]);
  });

  it("is quiet when they're on the team, or nothing of theirs is on", () => {
    expect(teamBuffsFromAbsentCharacters(data, ["Aemeath", "Shorekeeper", "Denia"])).toEqual([]);
    expect(teamBuffsFromAbsentCharacters({ teamBuffs: { selectedCharacter1: "Shorekeeper", buffs: {} } }, ["Aemeath"])).toEqual([]);
    expect(teamBuffsFromAbsentCharacters(undefined, ["Aemeath"])).toEqual([]);
  });
});

describe("combineTeamLoadouts unseenBound", () => {
  const row = (id: string, score: number) => ({ echoIds: [id], score });

  it("is the best a row below a truncated list could reach", () => {
    const result = combineTeamLoadouts([
      { rows: [row("a1", 100), row("a2", 90)], isTruncated: true },
      { rows: [row("b1", 50)], isTruncated: false },
    ]);
    expect(result.unseenBound).toBe(140);
  });

  it("can prove the winner even when the top N can't be", () => {
    const result = combineTeamLoadouts(
      [{ rows: [row("a1", 100), row("a2", 90)], isTruncated: true }],
      5,
    );
    expect(result.isProven).toBe(false);
    expect(result.combinations[0].total).toBeGreaterThanOrEqual(result.unseenBound!);
  });

  it("has nothing unseen when no list was truncated", () => {
    expect(combineTeamLoadouts([{ rows: [row("a1", 100)], isTruncated: false }]).unseenBound).toBe(-Infinity);
  });
});

describe("defaultTeamOptimizerGoal with team buffs", () => {
  const lowDamage = { hasActions: true, damageShare: 0.01, hasEligibleEchoes: true };

  it("searches a low-damage support who could provide a buff", () => {
    expect(defaultTeamOptimizerGoal({ ...lowDamage, canProvideTeamBuffs: true })).toBe("damage");
    expect(defaultTeamOptimizerGoal({ ...lowDamage, hasEligibleEchoes: false, canProvideTeamBuffs: true })).toBe("damage");
  });

  it("still keeps a low-damage character with nothing to provide", () => {
    expect(defaultTeamOptimizerGoal(lowDamage)).toBe("keep");
  });

  it("keeps a character with no actions to score", () => {
    expect(defaultTeamOptimizerGoal({ ...lowDamage, hasActions: false, canProvideTeamBuffs: true })).toBe("keep");
  });
});
