import { describe, it, expect, vi } from "vitest";

vi.mock("../../src/echoes/index", () => ({
  mainEchoesData: {
    TestMainEcho: {
      hasStacks: false,
      modifiers: [{ modifier: "ATK", modifierValue: 0.1 }],
    },
    StackedMainEcho: {
      hasStacks: true,
      modifiers: [{ modifier: "CritRate", modifierValue: 0.02 }],
    },
    SpecificCharEcho: {
      hasStacks: false,
      modifiers: [
        { modifier: "ATK", modifierValue: 0.1, specificCharacters: ["Jinhsi"] },
      ],
    },
  },
}));

const { resolveMainEchoBuffStats, combineEchoStats } = await import(
  "../../src/echoes/mainEcho"
);

describe("resolveMainEchoBuffStats", () => {
  it("returns empty stats when no echo is chosen", () => {
    expect(resolveMainEchoBuffStats("Jinhsi", undefined)).toEqual({});
  });

  it("returns empty stats when isEnabled is false", () => {
    expect(
      resolveMainEchoBuffStats("Jinhsi", { echo: "TestMainEcho", isEnabled: false }),
    ).toEqual({});
  });

  it("scales the buff value by 100 (percent) when enabled", () => {
    const result = resolveMainEchoBuffStats("Jinhsi", {
      echo: "TestMainEcho",
      isEnabled: true,
    });
    expect(result.ATK).toBeCloseTo(10);
  });

  it("multiplies by stacks for stacked main echoes", () => {
    const result = resolveMainEchoBuffStats("Jinhsi", {
      echo: "StackedMainEcho",
      isEnabled: true,
      stacks: 3,
    });
    expect(result.CritRate).toBeCloseTo(6);
  });

  it("skips modifiers restricted to other characters", () => {
    const result = resolveMainEchoBuffStats("Calcharo", {
      echo: "SpecificCharEcho",
      isEnabled: true,
    });
    expect(result).toEqual({});
  });
});

describe("combineEchoStats", () => {
  it("sums combined echo stats and set bonus stats", () => {
    const result = combineEchoStats(
      { ATK_FLAT: 100 },
      { ATK: 0.1 },
      { CritRate: 0.05 },
      {},
      {},
    );
    expect(result).toEqual({ ATK_FLAT: 100, ATK: 0.1, CritRate: 0.05 });
  });

  it("overwrites (does not sum) EnableAttack only for setBonusTwo", () => {
    const result = combineEchoStats(
      {},
      { EnableAttack: ["fromOnePiece"] },
      {},
      { EnableAttack: ["fromTwoSet"] },
      {},
    );
    expect(result.EnableAttack).toEqual(["fromTwoSet"]);
  });

  it("overwrites specificTalentBuffs from the main echo buff", () => {
    const result = combineEchoStats(
      {},
      {},
      {},
      {},
      { specificTalentBuffs: { skillDMGBonus: 0.2 } },
    );
    expect(result.specificTalentBuffs).toEqual({ skillDMGBonus: 0.2 });
  });
});
