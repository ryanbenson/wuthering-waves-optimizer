import { describe, it, expect } from "vitest";
import { computeSignature, createDedupeSet } from "../../src/scanner/dedupe";
import type { ParsedEchoSlot } from "../../src/scanner/types";

const BASE_SLOT: ParsedEchoSlot = {
  cost: 4,
  mainStatLabel: "Healing Bonus",
  substats: [
    { subStat: "DEF", subStatValue: "40" },
    { subStat: "HP", subStatValue: "8.6%" },
  ],
  echo: "ThousandPuppetPavilion",
  set: "LingeringTunes",
};

describe("computeSignature", () => {
  it("is identical for two echoes with the same identity fields", () => {
    const a = computeSignature({ ...BASE_SLOT });
    const b = computeSignature({ ...BASE_SLOT, substats: [...BASE_SLOT.substats] });
    expect(a).toBe(b);
  });

  it("differs when a substat value differs", () => {
    const a = computeSignature(BASE_SLOT);
    const b = computeSignature({
      ...BASE_SLOT,
      substats: [{ subStat: "DEF", subStatValue: "50" }, BASE_SLOT.substats[1]],
    });
    expect(a).not.toBe(b);
  });

  it("differs when the echo name differs", () => {
    const a = computeSignature(BASE_SLOT);
    const b = computeSignature({ ...BASE_SLOT, echo: "SomeOtherEcho" });
    expect(a).not.toBe(b);
  });
});

describe("createDedupeSet", () => {
  it("reports a signature it hasn't seen as new", () => {
    const dedupe = createDedupeSet();
    expect(dedupe.has("sig-a")).toBe(false);
  });

  it("reports a signature as seen after add()", () => {
    const dedupe = createDedupeSet();
    dedupe.add("sig-a");
    expect(dedupe.has("sig-a")).toBe(true);
    expect(dedupe.has("sig-b")).toBe(false);
  });

  it("can be seeded with existing signatures (e.g. current inventory)", () => {
    const dedupe = createDedupeSet(["sig-a", "sig-b"]);
    expect(dedupe.has("sig-a")).toBe(true);
    expect(dedupe.has("sig-c")).toBe(false);
  });
});
