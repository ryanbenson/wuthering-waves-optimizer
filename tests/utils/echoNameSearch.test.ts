import { describe, expect, it } from "vitest";
import { echoMatchesNameSearch } from "../../src/utils/echoNameSearch";

describe("echoMatchesNameSearch", () => {
  it("matches everything when the search is blank", () => {
    expect(echoMatchesNameSearch("AeroDrake", "")).toBe(true);
    expect(echoMatchesNameSearch("AeroDrake", "   ")).toBe(true);
    expect(echoMatchesNameSearch(null, "")).toBe(true);
  });

  it("matches a case-insensitive part of the display name", () => {
    expect(echoMatchesNameSearch("AeroDrake", "aero")).toBe(true);
    expect(echoMatchesNameSearch("AeroDrake", " DRAKE ")).toBe(true);
    expect(echoMatchesNameSearch("AeroDrake", "o d")).toBe(true);
  });

  it("does not match a different name", () => {
    expect(echoMatchesNameSearch("AeroDrake", "glacio")).toBe(false);
  });

  it("does not match an echo with no type once there is a search", () => {
    expect(echoMatchesNameSearch(null, "aero")).toBe(false);
    expect(echoMatchesNameSearch(undefined, "aero")).toBe(false);
  });

  it("falls back to the key for an unknown echo", () => {
    expect(echoMatchesNameSearch("SomeRemovedEcho", "removed")).toBe(true);
  });
});
