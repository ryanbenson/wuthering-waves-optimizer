import { describe, it, expect } from "vitest";
import { describeAspect, describeError, ratioLabel } from "../../src/scanner/analytics";

describe("ratioLabel", () => {
  it.each([
    [1920, 1080, "16:9"],
    [2560, 1600, "16:10"],
    [3440, 1440, "21:9"],
    [2560, 1080, "21:9"],
    [5120, 1440, "32:9"],
    [1600, 1200, "4:3"],
    [1080, 1920, "portrait"],
    [1000, 900, "other"],
  ])("%ix%i → %s", (width, height, label) => {
    expect(ratioLabel({ width, height })).toBe(label);
  });
});

describe("describeAspect", () => {
  it("reports the raw aspect, nearest ratio, and resolution", () => {
    expect(describeAspect({ width: 1920, height: 1080 })).toEqual({
      aspect: "1.78",
      ratio: "16:9",
      resolution: "1920x1080",
    });
  });
});

describe("describeError", () => {
  it("uses name and message for Errors", () => {
    expect(describeError(new Error("Couldn't read this video file. Try exporting it as mp4."))).toEqual({
      error: "Error",
      message: "Couldn't read this video file. Try exporting it as mp4.",
    });
  });

  it("keeps DOMException names", () => {
    const err = new DOMException("Permission denied", "NotAllowedError");
    expect(describeError(err)).toEqual({ error: "NotAllowedError", message: "Permission denied" });
  });

  it("handles non-Error error-like objects", () => {
    expect(describeError({ name: "AbortError", message: "aborted" })).toEqual({
      error: "AbortError",
      message: "aborted",
    });
  });

  it("labels bare Events by type", () => {
    expect(describeError({ type: "error" })).toEqual({ error: "Event:error", message: null });
  });

  it("handles thrown strings and primitives", () => {
    expect(describeError("boom")).toEqual({ error: "string", message: "boom" });
    expect(describeError(undefined)).toEqual({ error: "undefined", message: null });
  });

  it("truncates long messages", () => {
    const { message } = describeError(new Error("x".repeat(500)));
    expect(message).toHaveLength(120);
    expect(message?.endsWith("…")).toBe(true);
  });
});
