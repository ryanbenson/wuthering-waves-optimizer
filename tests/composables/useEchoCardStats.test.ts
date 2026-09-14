import { describe, it, expect } from "vitest";
import { useEchoCardStats, getSubstatRollQualityClasses } from "../../src/composables/useEchoCardStats";

function makeProps(overrides: Partial<Parameters<typeof useEchoCardStats>[0]> = {}) {
  return {
    rank: 5,
    type: "4",
    echo: "AeroDrake",
    echoSet: "MoltenRift",
    stat: "CritRate",
    echoSubStatsType1: "CritRate",
    echoSubStatsValue1: 7.5,
    echoSubStatsType2: "CritDMG",
    echoSubStatsValue2: 16.2,
    echoSubStatsType3: "ATK",
    echoSubStatsValue3: 9.4,
    echoSubStatsType4: "ATK_FLAT",
    echoSubStatsValue4: 50,
    echoSubStatsType5: "EnergyRegen",
    echoSubStatsValue5: 8,
    ...overrides,
  };
}

describe("useEchoCardStats isEchoIncomplete", () => {
  it("is false when the echo has a chosen echo, set, main stat, and all 5 substats", () => {
    const { isEchoIncomplete } = useEchoCardStats(makeProps());
    expect(isEchoIncomplete.value).toBe(false);
  });

  it("is true when no echo is chosen yet", () => {
    const { isEchoIncomplete } = useEchoCardStats(
      makeProps({
        echo: "",
        echoSet: "",
        stat: "none",
        echoSubStatsType1: "none",
        echoSubStatsType2: "none",
        echoSubStatsType3: "none",
        echoSubStatsType4: "none",
        echoSubStatsType5: "none",
      }),
    );
    expect(isEchoIncomplete.value).toBe(true);
  });

  it("is true when no echo set is chosen", () => {
    const { isEchoIncomplete } = useEchoCardStats(makeProps({ echoSet: "" }));
    expect(isEchoIncomplete.value).toBe(true);
  });

  it("is true when the main stat is not set", () => {
    const { isEchoIncomplete } = useEchoCardStats(makeProps({ stat: "none" }));
    expect(isEchoIncomplete.value).toBe(true);
  });

  it("is true when the main stat is null", () => {
    const { isEchoIncomplete } = useEchoCardStats(
      makeProps({ stat: null as unknown as string }),
    );
    expect(isEchoIncomplete.value).toBe(true);
  });

  it("is true when fewer than 5 substats are configured", () => {
    const { isEchoIncomplete } = useEchoCardStats(
      makeProps({ echoSubStatsType5: "none" }),
    );
    expect(isEchoIncomplete.value).toBe(true);
  });
});

describe("getSubstatRollQualityClasses", () => {
  it("returns null for an empty/unfilled slot", () => {
    expect(getSubstatRollQualityClasses("none", 6.3)).toBeNull();
    expect(getSubstatRollQualityClasses(null, 6.3)).toBeNull();
    expect(getSubstatRollQualityClasses("CritRate", 0)).toBeNull();
  });

  it("buckets a low roll (score 40) as emerald, with a toned-down border and a gradient wash", () => {
    const classes = getSubstatRollQualityClasses("CritRate", "6.9");
    expect(classes?.border).toBe("border-l-emerald-500/50");
    expect(classes?.wash).toBe("bg-gradient-to-r from-emerald-500/10 to-transparent");
  });

  it("buckets a mid-low roll (score 50) as blue", () => {
    const classes = getSubstatRollQualityClasses("CritRate", "7.5");
    expect(classes?.border).toBe("border-l-blue-500/50");
    expect(classes?.wash).toBe("bg-gradient-to-r from-blue-500/10 to-transparent");
  });

  it("buckets a mid-high roll (score 80) as purple", () => {
    const classes = getSubstatRollQualityClasses("CritRate", "9.3");
    expect(classes?.border).toBe("border-l-purple-500/50");
    expect(classes?.wash).toBe("bg-gradient-to-r from-purple-500/10 to-transparent");
  });

  it("buckets a high roll (score 90) as yellow", () => {
    const classes = getSubstatRollQualityClasses("CritRate", "9.9");
    expect(classes?.border).toBe("border-l-yellow-500/50");
    expect(classes?.wash).toBe("bg-gradient-to-r from-yellow-500/10 to-transparent");
  });
});
