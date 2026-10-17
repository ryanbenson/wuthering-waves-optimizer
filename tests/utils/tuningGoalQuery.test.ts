import { describe, it, expect } from "vitest";
import {
  decodeTuningGoalQuery,
  encodeTuningGoalQuery,
} from "../../src/utils/tuningGoalQuery";

describe("tuningGoalQuery", () => {
  it("round-trips a goal", () => {
    const goal = [
      { stat: "CritRate", min: 8.1 },
      { stat: "CritDMG", min: null },
    ];
    const query = encodeTuningGoalQuery(goal);
    expect(query).toEqual({ goal: "CritRate:8.1,CritDMG:any" });
    expect(decodeTuningGoalQuery(query.goal)).toEqual(goal);
  });

  it("encodes an empty goal as no query", () => {
    expect(encodeTuningGoalQuery([])).toEqual({});
  });

  it("drops unknown substats, off-table values and duplicates", () => {
    expect(
      decodeTuningGoalQuery("__proto__:1,CritRate:8.2,Glacio:any,CritDMG:15,CritDMG:21"),
    ).toEqual([{ stat: "CritDMG", min: 15 }]);
  });

  it("caps the goal at five lines", () => {
    const raw = "CritRate,CritDMG,ATK,HP,DEF,EnergyRegen";
    expect(decodeTuningGoalQuery(raw)).toHaveLength(5);
  });

  it("ignores non-string input", () => {
    expect(decodeTuningGoalQuery(undefined)).toEqual([]);
    expect(decodeTuningGoalQuery(42)).toEqual([]);
    expect(decodeTuningGoalQuery(["CritRate:any"])).toEqual([{ stat: "CritRate", min: null }]);
  });
});
