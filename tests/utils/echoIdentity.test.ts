import { describe, it, expect } from "vitest";
import { buildIdentityKeySet, getEchoIdentityKey } from "../../src/utils/echoIdentity";

describe("buildIdentityKeySet", () => {
  const a = { echo: "Jué", echoSet: "Set", type: 4, rank: 5, stat: "CritDMG", echoSubStatsType1: "ATK", echoSubStatsValue1: 7.9 };
  const b = { ...a, echoSubStatsValue1: 8.6 };

  it("contains every echo's identity key, so an exact match is a Set lookup", () => {
    const keys = buildIdentityKeySet([a]);
    expect(keys.has(getEchoIdentityKey({ ...a }))).toBe(true);
    expect(keys.has(getEchoIdentityKey(b))).toBe(false);
  });

  it("collapses identical echoes", () => {
    expect(buildIdentityKeySet([a, { ...a }, b]).size).toBe(2);
  });
});
