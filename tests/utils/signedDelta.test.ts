import { describe, it, expect } from "vitest";
import {
  deltaTone,
  deltaToneBadgeClass,
  deltaToneTextClass,
  roundDelta,
  signedImpact,
  signedInt,
  signedPercent,
} from "../../src/utils/signedDelta";

describe("signedPercent (issue #703)", () => {
  it("shows zero with no sign and a neutral tone", () => {
    for (const value of [0, -0, Number.NaN, 0.005, -0.004, 0.0049]) {
      expect(signedPercent(value)).toEqual({ text: "0.0%", tone: "neutral" });
    }
  });

  it("rounds half away from zero, so 0.05 shows as 0.1", () => {
    expect(signedPercent(0.05)).toEqual({ text: "+0.1%", tone: "positive" });
    expect(signedPercent(-0.05)).toEqual({ text: "-0.1%", tone: "negative" });
  });

  it("treats a floating-point near-miss of the halfway point as halfway", () => {
    expect(signedPercent(0.04999999999999).text).toBe("+0.1%");
  });

  it("formats ordinary values with a sign and separators", () => {
    expect(signedPercent(12.345).text).toBe("+12.3%");
    expect(signedPercent(-3.26).text).toBe("-3.3%");
    expect(signedPercent(1234.5).text).toBe("+1,234.5%");
  });

  it("honours the decimals shown", () => {
    expect(signedPercent(0.004, { decimals: 2 })).toEqual({ text: "0.00%", tone: "neutral" });
    expect(signedPercent(0.005, { decimals: 2 })).toEqual({ text: "+0.01%", tone: "positive" });
  });

  it("can use a true minus sign", () => {
    expect(signedPercent(-2, { minus: "−" }).text).toBe("−2.0%");
  });
});

describe("signedInt", () => {
  it("rounds to the nearest whole number and drops the sign at zero", () => {
    expect(signedInt(0.4)).toEqual({ text: "0", tone: "neutral" });
    expect(signedInt(-0.4)).toEqual({ text: "0", tone: "neutral" });
    expect(signedInt(0.5)).toEqual({ text: "+1", tone: "positive" });
    expect(signedInt(-1234.6, { minus: "−" })).toEqual({ text: "−1,235", tone: "negative" });
  });
});

describe("signedImpact", () => {
  it("shows no change as a neutral 0 · 0.0%", () => {
    expect(signedImpact(0, 0)).toEqual({ text: "0 · 0.0%", tone: "neutral" });
    expect(signedImpact(-0.2, -0.00001)).toEqual({ text: "0 · 0.0%", tone: "neutral" });
  });

  it("signs each part from its own rounded value and takes the tone from the percent", () => {
    expect(signedImpact(1234, 0.021)).toEqual({ text: "+1,234 · +2.1%", tone: "positive" });
    expect(signedImpact(-56, -0.003)).toEqual({ text: "-56 · -0.3%", tone: "negative" });
    expect(signedImpact(12, 0.0002)).toEqual({ text: "+12 · 0.0%", tone: "neutral" });
  });
});

describe("tone helpers", () => {
  it("decides tone from the rounded value", () => {
    expect(deltaTone(0.04)).toBe("neutral");
    expect(deltaTone(0.06)).toBe("positive");
    expect(deltaTone(-0.06)).toBe("negative");
    expect(roundDelta(-0.04)).toBe(0);
    expect(Object.is(roundDelta(-0.04), -0)).toBe(false);
  });

  it("maps tones to text and badge classes", () => {
    expect(deltaToneTextClass("positive")).toBe("text-success");
    expect(deltaToneTextClass("negative")).toBe("text-error");
    expect(deltaToneTextClass("neutral")).toBe("opacity-60");
    expect(deltaToneBadgeClass("neutral")).toBe("badge-ghost");
  });
});
