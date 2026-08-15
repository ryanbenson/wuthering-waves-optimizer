import { describe, it, expect } from "vitest";
import { useEchoCardStats } from "../../src/composables/useEchoCardStats";

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
