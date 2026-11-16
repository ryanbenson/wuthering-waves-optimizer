import { describe, it, expect } from "vitest";
import {
  buildBuffToggleUpdate,
  buildBulkEnableUpdate,
  type MutuallyExclusiveDef,
} from "../../src/characters/mutuallyExclusiveBuffs";
import { buffs as sigrikaBuffs } from "../../src/characters/Sigrika/buffs";

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

// Issue #700: each Rune consumption takes one Soliskin Vitality path, so
// Sigrika's Schemata of Runes (>= 30) and Soliskin Vitality (< 30) can't both apply.
describe("Sigrika's Schemata of Runes vs. Soliskin Vitality", () => {
  const byKey = (key: string) => sigrikaBuffs.find((buff) => buff.key === key) as MutuallyExclusiveDef;
  const schemata = byKey("SchemataofRunes");
  const vitality = byKey("SoliskinVitality");

  it("declares each buff exclusive with the other", () => {
    expect(schemata.mutuallyExclusiveWith).toEqual(["SoliskinVitality"]);
    expect(vitality.mutuallyExclusiveWith).toEqual(["SchemataofRunes"]);
  });

  it("turns the other off when either is turned on", () => {
    expect(buildBuffToggleUpdate("buffs", schemata.key, true, schemata.mutuallyExclusiveWith)).toEqual({
      buffs: { SchemataofRunes: { isEnabled: true }, SoliskinVitality: { isEnabled: false } },
    });
    expect(buildBuffToggleUpdate("buffs", vitality.key, true, vitality.mutuallyExclusiveWith)).toEqual({
      buffs: { SoliskinVitality: { isEnabled: true }, SchemataofRunes: { isEnabled: false } },
    });
  });

  it("keeps Schemata of Runes on an enable-all pass", () => {
    const updates = buildBulkEnableUpdate("buffs", sigrikaBuffs as MutuallyExclusiveDef[], () => false);
    expect(updates.buffs?.SchemataofRunes).toEqual({ isEnabled: true });
    expect(updates.buffs?.SoliskinVitality).toEqual({ isEnabled: false });
  });
});
