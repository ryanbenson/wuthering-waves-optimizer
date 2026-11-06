import { describe, it, expect } from "vitest";
import { TEAM_OPTIMIZER_LAB, isLabEnabled, isTeamOptimizerEnabled } from "../../src/utils/labs";

describe("labs flags", () => {
  it("is on only when the lab is explicitly enabled", () => {
    expect(isTeamOptimizerEnabled({ labs: { [TEAM_OPTIMIZER_LAB]: { isEnabled: true } } })).toBe(true);
    expect(isTeamOptimizerEnabled({ labs: { [TEAM_OPTIMIZER_LAB]: { isEnabled: false } } })).toBe(false);
    expect(isTeamOptimizerEnabled({ labs: {} })).toBe(false);
    expect(isTeamOptimizerEnabled({})).toBe(false);
  });

  it("keeps labs independent of each other", () => {
    expect(isLabEnabled({ labs: { other: { isEnabled: true } } }, TEAM_OPTIMIZER_LAB)).toBe(false);
  });
});
