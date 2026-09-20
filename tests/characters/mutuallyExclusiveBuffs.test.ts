import { describe, it, expect } from "vitest";
import {
  buildBuffToggleUpdate,
  buildBulkEnableUpdate,
  type MutuallyExclusiveDef,
} from "../../src/characters/mutuallyExclusiveBuffs";

describe("buildBuffToggleUpdate", () => {
  it("just toggles the key when it has no mutually exclusive partners", () => {
    expect(buildBuffToggleUpdate("weaponPassives", "Solo", true)).toEqual({
      weaponPassives: { Solo: { isEnabled: true } },
    });
  });

  it("disables a same-category partner when enabling (Rime-Draped Sprouts)", () => {
    expect(
      buildBuffToggleUpdate("weaponPassives", "RimeDrapedSproutsBasicAtkBonus1", true, [
        "RimeDrapedSproutsBasicAtkBonus2",
      ]),
    ).toEqual({
      weaponPassives: {
        RimeDrapedSproutsBasicAtkBonus1: { isEnabled: true },
        RimeDrapedSproutsBasicAtkBonus2: { isEnabled: false },
      },
    });
  });

  it("disables a cross-category partner when enabling (Lupa's resonance chain node vs. her self buff)", () => {
    expect(
      buildBuffToggleUpdate("resonanceChains", "SequenceNode3WolflameHowlsinHerWakeIgnoreFusion", true, [
        { key: "InherentSkillApplauseofVictory", category: "buffs" },
      ]),
    ).toEqual({
      resonanceChains: { SequenceNode3WolflameHowlsinHerWakeIgnoreFusion: { isEnabled: true } },
      buffs: { InherentSkillApplauseofVictory: { isEnabled: false } },
    });
  });

  it("does not disable partners when turning the key off", () => {
    expect(buildBuffToggleUpdate("buffs", "MyMoment", false, ["TheatricalMoment"])).toEqual({
      buffs: { MyMoment: { isEnabled: false } },
    });
  });
});

describe("buildBulkEnableUpdate", () => {
  const brantMoments: MutuallyExclusiveDef[] = [
    { key: "MyMoment", mutuallyExclusiveWith: ["TheatricalMoment"] },
    { key: "TheatricalMoment", mutuallyExclusiveWith: ["MyMoment"] },
    { key: "InherentSkillVoyagersBlaze" },
  ];

  it("enables the first of two same-category conflicting keys and disables the other", () => {
    const updates = buildBulkEnableUpdate("buffs", brantMoments, () => false);
    expect(updates.buffs).toEqual({
      MyMoment: { isEnabled: true },
      TheatricalMoment: { isEnabled: false },
      InherentSkillVoyagersBlaze: { isEnabled: true },
    });
  });

  it("skips a key that already loses to something enabled in another category", () => {
    const lupaInherentBuffs: MutuallyExclusiveDef[] = [
      {
        key: "InherentSkillApplauseofVictory",
        mutuallyExclusiveWith: [
          { key: "SequenceNode3WolflameHowlsinHerWakeIgnoreFusion", category: "resonanceChains" },
        ],
      },
    ];

    const updates = buildBulkEnableUpdate(
      "buffs",
      lupaInherentBuffs,
      (category, key) =>
        category === "resonanceChains" && key === "SequenceNode3WolflameHowlsinHerWakeIgnoreFusion",
    );

    expect(updates.buffs ?? {}).toEqual({});
  });

  it("carries per-key extras (e.g. max stacks) onto the winning entry only", () => {
    const updates = buildBulkEnableUpdate("buffs", brantMoments, () => false, (key) =>
      key === "MyMoment" ? { stacks: 5 } : {},
    );
    expect(updates.buffs?.MyMoment).toEqual({ isEnabled: true, stacks: 5 });
    expect(updates.buffs?.TheatricalMoment).toEqual({ isEnabled: false });
  });
});
