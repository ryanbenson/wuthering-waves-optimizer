import { describe, expect, it } from "vitest";
import { SCANNERS_NEW_UNTIL, isNewUntil } from "../../../src/components/navigation/navSections";

describe("isNewUntil", () => {
  it("is new before the date and not from it on", () => {
    expect(isNewUntil("2026-12-01", new Date("2026-11-30T23:59:59Z"))).toBe(true);
    expect(isNewUntil("2026-12-01", new Date("2026-12-01T00:00:00Z"))).toBe(false);
  });

  it("has a valid date for Scanners", () => {
    expect(Number.isNaN(new Date(SCANNERS_NEW_UNTIL).getTime())).toBe(false);
  });
});
