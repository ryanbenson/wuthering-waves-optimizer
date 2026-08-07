import { describe, it, expect } from "vitest";
import {
  generateLoadouts,
  normalizeLoadoutFormat,
  getOptimizerLoadoutKey,
  getOptimizerLoadoutHash,
  hashOptimizerLoadoutKey,
  normalizeOptimizerLoadout,
  resolveOptimizerEmptyReason,
  OPTIMIZER_EMPTY_REASON_MESSAGES,
} from "../../src/calculator/optimizer";

function makeEcho(echo: string, type: number, echoId: string) {
  return { echo, type, echoId, echoSet: "TestSet", rank: 5, stat: "ATK" };
}

function costSignature(loadout: { type: number }[]): string {
  return loadout
    .map((e) => Number(e.type))
    .sort((a, b) => b - a)
    .join("");
}

describe("normalizeLoadoutFormat", () => {
  it("returns Any for missing or invalid values", () => {
    expect(normalizeLoadoutFormat(undefined)).toBe("Any");
    expect(normalizeLoadoutFormat(null)).toBe("Any");
    expect(normalizeLoadoutFormat("999")).toBe("Any");
  });

  it("accepts valid formats", () => {
    expect(normalizeLoadoutFormat("Any")).toBe("Any");
    expect(normalizeLoadoutFormat("43311")).toBe("43311");
    expect(normalizeLoadoutFormat("44111")).toBe("44111");
  });
});

function collectLoadouts(
  echoes: ReturnType<typeof makeEcho>[],
  mainEchoKeys: string[],
  format: "Any" | "43311" | "44111",
) {
  const loadouts: ReturnType<typeof makeEcho>[][] = [];
  for (const loadout of generateLoadouts(
    echoes,
    mainEchoKeys,
    0,
    [],
    0,
    new Set(),
    new Set(),
    format,
  )) {
    // generateLoadouts mutates the combo array; clone each yield
    loadouts.push(JSON.parse(JSON.stringify(loadout)));
  }
  return loadouts;
}

describe("generateLoadouts loadout formats", () => {
  const echoes = [
    makeEcho("Main4", 4, "m4"),
    makeEcho("Main3", 3, "m3"),
    makeEcho("FourA", 4, "f4a"),
    makeEcho("ThreeA", 3, "t3a"),
    makeEcho("ThreeB", 3, "t3b"),
    makeEcho("OneA", 1, "o1a"),
    makeEcho("OneB", 1, "o1b"),
    makeEcho("OneC", 1, "o1c"),
  ];

  it("Any still yields partial and full loadouts", () => {
    const loadouts = collectLoadouts(echoes, ["Main4"], "Any");
    expect(loadouts.length).toBeGreaterThan(0);
    expect(loadouts.some((l) => l.length < 5)).toBe(true);
    expect(loadouts.some((l) => l.length === 5)).toBe(true);
    expect(loadouts.every((l) => l[0].echo === "Main4")).toBe(true);
  });

  it("43311 only yields five-echo loadouts with costs 4,3,3,1,1", () => {
    const loadouts = collectLoadouts(echoes, ["Main4"], "43311");
    expect(loadouts.length).toBeGreaterThan(0);
    for (const loadout of loadouts) {
      expect(loadout).toHaveLength(5);
      expect(loadout[0].echo).toBe("Main4");
      expect(costSignature(loadout)).toBe("43311");
    }
  });

  it("44111 only yields five-echo loadouts with costs 4,4,1,1,1", () => {
    const loadouts = collectLoadouts(echoes, ["Main4"], "44111");
    expect(loadouts.length).toBeGreaterThan(0);
    for (const loadout of loadouts) {
      expect(loadout).toHaveLength(5);
      expect(loadout[0].echo).toBe("Main4");
      expect(costSignature(loadout)).toBe("44111");
    }
  });

  it("allows a 3-cost main echo with 44111 but yields no loadouts", () => {
    const loadouts = collectLoadouts(echoes, ["Main3"], "44111");
    expect(loadouts).toHaveLength(0);
  });

  it("allows a 3-cost main echo with 43311 and yields matching loadouts", () => {
    const loadouts = collectLoadouts(echoes, ["Main3"], "43311");
    expect(loadouts.length).toBeGreaterThan(0);
    for (const loadout of loadouts) {
      expect(loadout[0].echo).toBe("Main3");
      expect(costSignature(loadout)).toBe("43311");
    }
  });
});

describe("optimizer loadout hash dedupe", () => {
  it("hashes the same signature to the same bigint", () => {
    const key = "Foo:Set:4:5:ATK:Crit Rate:10.5||||";
    expect(hashOptimizerLoadoutKey(key)).toBe(hashOptimizerLoadoutKey(key));
  });

  it("collapses identical-stat copies and order variants to one hash", () => {
    const main = makeEcho("Main4", 4, "m4");
    const a1 = {
      ...makeEcho("OneA", 1, "o1a"),
      echoSubStatsType1: "Crit Rate",
      echoSubStatsValue1: 10.5,
    };
    const a2 = {
      ...makeEcho("OneA", 1, "o1a-copy"),
      echoSubStatsType1: "Crit Rate",
      echoSubStatsValue1: 10.5,
    };
    const b = makeEcho("OneB", 1, "o1b");

    const loadout1 = normalizeOptimizerLoadout([main, a1, b]);
    const loadout2 = normalizeOptimizerLoadout([main, b, a2]);

    expect(getOptimizerLoadoutKey(loadout1)).toBe(getOptimizerLoadoutKey(loadout2));
    expect(getOptimizerLoadoutHash(loadout1)).toBe(getOptimizerLoadoutHash(loadout2));
  });

  it("keeps distinct rolls as distinct hashes", () => {
    const main = makeEcho("Main4", 4, "m4");
    const low = {
      ...makeEcho("OneA", 1, "o1a"),
      echoSubStatsType1: "Crit Rate",
      echoSubStatsValue1: 6.3,
    };
    const high = {
      ...makeEcho("OneA", 1, "o1a-copy"),
      echoSubStatsType1: "Crit Rate",
      echoSubStatsValue1: 10.5,
    };
    const b = makeEcho("OneB", 1, "o1b");

    expect(getOptimizerLoadoutHash([main, low, b])).not.toBe(
      getOptimizerLoadoutHash([main, high, b]),
    );
  });
});

describe("resolveOptimizerEmptyReason", () => {
  it("reports empty inventory first", () => {
    expect(
      resolveOptimizerEmptyReason({
        inventoryCount: 0,
        setFilteredCount: 0,
        generatedCount: 0,
      }),
    ).toBe("no-inventory");
  });

  it("reports missing set echoes when inventory has items", () => {
    expect(
      resolveOptimizerEmptyReason({
        inventoryCount: 12,
        setFilteredCount: 0,
        generatedCount: 0,
      }),
    ).toBe("no-set-echoes");
  });

  it("reports filtering when loadouts were generated but none ranked", () => {
    expect(
      resolveOptimizerEmptyReason({
        inventoryCount: 12,
        setFilteredCount: 8,
        generatedCount: 100,
      }),
    ).toBe("filtered");
  });

  it("falls back when echoes exist but no loadouts were generated", () => {
    expect(
      resolveOptimizerEmptyReason({
        inventoryCount: 12,
        setFilteredCount: 8,
        generatedCount: 0,
      }),
    ).toBe("none-found");
  });

  it("has a message for every reason", () => {
    for (const reason of [
      "no-inventory",
      "no-set-echoes",
      "filtered",
      "none-found",
    ] as const) {
      expect(OPTIMIZER_EMPTY_REASON_MESSAGES[reason].length).toBeGreaterThan(0);
    }
  });
});
