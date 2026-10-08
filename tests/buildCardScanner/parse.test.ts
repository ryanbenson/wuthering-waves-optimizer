import { describe, it, expect } from "vitest";
import {
  correctKnownSubstatMisreads,
  parseCostText,
  parseSubstatLine,
} from "@wutheringtools/build-card-scanner";

describe("parseCostText", () => {
  it("reads the cost-4 glyph OCR returns as <B>", () => {
    expect(parseCostText("<B>")).toBe(4);
  });

  it("reads plain and leading digits", () => {
    expect(parseCostText("3")).toBe(3);
    expect(parseCostText("1x")).toBe(1);
  });

  it("finds a digit after leading noise", () => {
    expect(parseCostText("~4")).toBe(4);
  });

  it("returns null for empty or digit-free text", () => {
    expect(parseCostText("")).toBeNull();
    expect(parseCostText("ab")).toBeNull();
  });
});

describe("parseSubstatLine", () => {
  it("splits a label and a percentage value", () => {
    expect(parseSubstatLine("Crit. DMG 17.4%")).toEqual({ subStat: "Crit. DMG", subStatValue: "17.4%" });
  });

  it("splits a label and a flat value", () => {
    expect(parseSubstatLine("ATK 50")).toEqual({ subStat: "ATK", subStatValue: "50" });
  });

  it("drops characters outside the OCR whitelist and joins wrapped lines", () => {
    expect(parseSubstatLine("Resonance Skill\nDMG Bonus | 9.4%")).toEqual({
      subStat: "Resonance Skill DMG Bonus",
      subStatValue: "9.4%",
    });
  });

  it("keeps a label with no value", () => {
    expect(parseSubstatLine("Energy Regen")).toEqual({ subStat: "Energy Regen", subStatValue: "" });
  });

  it("returns null for a blank line", () => {
    expect(parseSubstatLine("  \n ")).toBeNull();
  });

  it("corrects known misreads on the way out", () => {
    expect(parseSubstatLine("Crit. Rate 17.5%")?.subStatValue).toBe("7.5%");
  });
});

describe("correctKnownSubstatMisreads", () => {
  it.each([
    ["Crit. Rate", "17.5%", "7.5%"],
    ["Crit. Rate", "1.5%", "7.5%"],
    ["DEF", "11.9%", "11.8%"],
    ["DEF Y", "11.9%", "11.8%"],
  ])("%s %s → %s", (label, value, expected) => {
    expect(correctKnownSubstatMisreads(label, value)).toBe(expected);
  });

  it("leaves legal values alone", () => {
    expect(correctKnownSubstatMisreads("Crit. Rate", "8.1%")).toBe("8.1%");
    expect(correctKnownSubstatMisreads("ATK", "11.9%")).toBe("11.9%");
  });
});
