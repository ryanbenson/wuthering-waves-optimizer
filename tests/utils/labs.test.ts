import { describe, it, expect } from "vitest";
import { RECOMMENDED_TEAMS_LAB, isLabEnabled, isRecommendedTeamsEnabled } from "../../src/utils/labs";

describe("labs flags", () => {
  it("is on only when the lab is explicitly enabled", () => {
    expect(isRecommendedTeamsEnabled({ labs: { [RECOMMENDED_TEAMS_LAB]: { isEnabled: true } } })).toBe(true);
    expect(isRecommendedTeamsEnabled({ labs: { [RECOMMENDED_TEAMS_LAB]: { isEnabled: false } } })).toBe(false);
    expect(isRecommendedTeamsEnabled({ labs: {} })).toBe(false);
    expect(isRecommendedTeamsEnabled({})).toBe(false);
  });

  it("keeps labs independent of each other", () => {
    expect(isLabEnabled({ labs: { other: { isEnabled: true } } }, RECOMMENDED_TEAMS_LAB)).toBe(false);
  });
});
