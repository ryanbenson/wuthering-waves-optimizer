import { describe, it, expect } from "vitest";
import { applyBulkActionBuff } from "../../src/calculator/rotationActionBuffs";

type Action = { id: string; buffs?: Array<{ id: string; modifier?: string | null; modifierValue?: unknown }> };

function idFactory() {
  let n = 0;
  return () => `new-${++n}`;
}

describe("applyBulkActionBuff", () => {
  const actions: Action[] = [
    { id: "a", buffs: [{ id: "a1", modifier: "ATK", modifierValue: "20" }] },
    { id: "b" },
    { id: "c", buffs: [{ id: "c1", modifier: "ATK", modifierValue: "5" }, { id: "c2", modifier: "CritRate", modifierValue: "10" }] },
    { id: "d", buffs: [{ id: "d1", modifier: "CritDMG", modifierValue: "30" }] },
  ];

  it("only touches the listed actions", () => {
    const result = applyBulkActionBuff(actions, ["a", "b"], { modifier: "ATK", modifierValue: "20" }, idFactory());
    expect(result[2]).toBe(actions[2]);
    expect(result[3]).toBe(actions[3]);
  });

  it("appends a new row with a fresh id when the action has no row for that modifier", () => {
    const result = applyBulkActionBuff(actions, ["b", "d"], { modifier: "ATK", modifierValue: "20" }, idFactory());
    expect(result[1].buffs).toEqual([{ id: "new-1", modifier: "ATK", modifierValue: "20" }]);
    expect(result[3].buffs).toEqual([
      { id: "d1", modifier: "CritDMG", modifierValue: "30" },
      { id: "new-2", modifier: "ATK", modifierValue: "20" },
    ]);
  });

  it("replaces the value of an existing row for the same modifier in place, keeping its id and other rows", () => {
    const result = applyBulkActionBuff(actions, ["c"], { modifier: "ATK", modifierValue: "20" }, idFactory());
    expect(result[2].buffs).toEqual([
      { id: "c1", modifier: "ATK", modifierValue: "20" },
      { id: "c2", modifier: "CritRate", modifierValue: "10" },
    ]);
  });

  it("leaves the source action's own row unchanged when it's part of the range", () => {
    const result = applyBulkActionBuff(actions, ["a"], { modifier: "ATK", modifierValue: "20" }, idFactory());
    expect(result[0].buffs).toEqual([{ id: "a1", modifier: "ATK", modifierValue: "20" }]);
  });

  it("does not mutate the input actions", () => {
    const snapshot = JSON.parse(JSON.stringify(actions));
    applyBulkActionBuff(actions, ["a", "b", "c", "d"], { modifier: "ATK", modifierValue: "99" }, idFactory());
    expect(actions).toEqual(snapshot);
  });
});
