import { describe, it, expect } from "vitest";
import {
  buffMinSequence,
  buildRecommendedTeamBuffs,
  getApplicableTeamBuffDefaults,
  getTeammateEchoBuffNames,
  hasSignatureTeamBuff,
  parseTeammateCopy,
} from "../../src/buffs/recommendedTeamBuffs";

// Issue #663 PR 2 / ADR 0059
const s0 = { sequence: 0, signature: false };

describe("buffMinSequence", () => {
  it("reads the sequence from SequenceNodeN keys", () => {
    expect(buffMinSequence("SequenceNode2NightsGiftandRefusal")).toBe(2);
    expect(buffMinSequence("OutroSkillBinaryButterfly")).toBe(0);
  });
});

describe("getApplicableTeamBuffDefaults", () => {
  const keys = (teammate: string, copy = s0, elements = ["Glacio", "Glacio", "Spectro"]) =>
    getApplicableTeamBuffDefaults(teammate, copy, elements).map((d) => d.key);

  it("leaves out sequence buffs above the chosen sequence", () => {
    expect(keys("Shorekeeper")).not.toContain("SequenceNode2NightsGiftandRefusal");
    expect(keys("Shorekeeper", { sequence: 2, signature: false })).toContain("SequenceNode2NightsGiftandRefusal");
  });

  it("includes the signature weapon's buff only with Sig", () => {
    expect(keys("Shorekeeper")).not.toContain("StellarSymphonyATK");
    expect(keys("Shorekeeper", { sequence: 0, signature: true })).toContain("StellarSymphonyATK");
  });

  it("includes full-team element buffs only when all three share it", () => {
    expect(keys("Lupa", s0, ["Fusion", "Fusion", "Glacio"])).not.toContain("PackHuntFusionTeam");
    expect(keys("Lupa", s0, ["Fusion", "Fusion", "Fusion"])).toContain("PackHuntFusionTeam");
  });

  it("is empty for a teammate with no typical buffs", () => {
    expect(keys("NotACharacter")).toEqual([]);
  });
});

describe("buildRecommendedTeamBuffs", () => {
  const base = { teamElements: ["Glacio", "Glacio", "Spectro"], existing: {}, mode: "add" as const };

  it("turns buffs on with base stat values and stacks", () => {
    const buffs = buildRecommendedTeamBuffs({
      ...base,
      teammates: [
        { key: "Shorekeeper", copy: { sequence: 2, signature: true } },
        { key: "Sanhua", copy: { sequence: 6, signature: false } },
      ],
    });
    expect(buffs.SophisticatedStellarealmCritRate).toEqual({ isEnabled: true, baseAttrValue: 250 });
    expect(buffs.SequenceNode2NightsGiftandRefusal).toEqual({ isEnabled: true });
    expect(buffs.StellarSymphonyATK).toEqual({ isEnabled: true, refinement: "1" });
    expect(buffs.RejuvenatingGlow).toEqual({ isEnabled: true });
    expect(buffs.SequenceNode6DaybreakRadiance).toEqual({ isEnabled: true, stacks: 2 });
    expect(buffs.MoonlitClouds).toEqual({ isEnabled: true });
  });

  it("only adds with 'add'", () => {
    const buffs = buildRecommendedTeamBuffs({
      ...base,
      existing: { MidnightVeil: { isEnabled: true } },
      teammates: [{ key: "Verina", copy: s0 }],
    });
    expect(buffs.MidnightVeil).toBeUndefined();
    expect(buffs.OutroSkillBlossom).toEqual({ isEnabled: true });
  });

  it("turns off everything else with 'replace'", () => {
    const buffs = buildRecommendedTeamBuffs({
      ...base,
      mode: "replace",
      existing: {
        MidnightVeil: { isEnabled: true },
        OutroSkillBlossom: { isEnabled: true },
        Silversnow: { isEnabled: false },
      },
      teammates: [{ key: "Verina", copy: s0 }],
    });
    expect(buffs.MidnightVeil).toEqual({ isEnabled: false });
    expect(buffs.OutroSkillBlossom).toEqual({ isEnabled: true });
    expect(buffs.Silversnow).toBeUndefined();
  });

  it("turns on a buff two teammates share only once", () => {
    const buffs = buildRecommendedTeamBuffs({
      ...base,
      teammates: [
        { key: "Shorekeeper", copy: s0 },
        { key: "Verina", copy: s0 },
      ],
    });
    expect(buffs.RejuvenatingGlow).toEqual({ isEnabled: true });
  });
});

describe("card helpers", () => {
  it("knows who has a signature buff and their usual echoes", () => {
    expect(hasSignatureTeamBuff("Shorekeeper")).toBe(true);
    expect(hasSignatureTeamBuff("Verina")).toBe(false);
    expect(getTeammateEchoBuffNames("Sanhua")).toEqual(["Moonlit Clouds"]);
    expect(getTeammateEchoBuffNames("Zhezhi")).toEqual(["Moonlit Clouds", "Impermanence Heron"]);
    expect(getTeammateEchoBuffNames("Iuno")).toEqual([]);
  });
});

describe("parseTeammateCopy", () => {
  it("reads a saved copy and falls back to S0 without Sig", () => {
    expect(parseTeammateCopy({ sequence: 2, signature: true })).toEqual({ sequence: 2, signature: true });
    expect(parseTeammateCopy(undefined)).toEqual({ sequence: 0, signature: false });
    expect(parseTeammateCopy({ sequence: 9, signature: "yes" })).toEqual({ sequence: 0, signature: false });
  });
});
