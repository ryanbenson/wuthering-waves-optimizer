import { describe, it, expect } from "vitest";
import {
  TEAM_BUILD_STATUSES,
  getTeamBuildStatus,
  getTeamBuildStatusLabel,
  getTeamBuildStatusDotClass,
} from "../../src/teamRotations/teamBuildStatus";

describe("getTeamBuildStatus", () => {
  it("defaults to not-started for a team with no buildStatus set", () => {
    expect(getTeamBuildStatus({})).toBe("not-started");
  });

  it("defaults to not-started for null/undefined", () => {
    expect(getTeamBuildStatus(null)).toBe("not-started");
    expect(getTeamBuildStatus(undefined)).toBe("not-started");
  });

  it("returns the team's explicit buildStatus when set", () => {
    expect(getTeamBuildStatus({ buildStatus: "finished" })).toBe("finished");
  });
});

describe("getTeamBuildStatusLabel / getTeamBuildStatusDotClass", () => {
  it("has a label and dot class for every known status", () => {
    for (const status of TEAM_BUILD_STATUSES) {
      expect(getTeamBuildStatusLabel(status)).toBeTruthy();
      expect(getTeamBuildStatusDotClass(status)).toMatch(/^bg-/);
    }
  });

  it("maps finished to a success-colored dot", () => {
    expect(getTeamBuildStatusLabel("finished")).toBe("Finished");
    expect(getTeamBuildStatusDotClass("finished")).toBe("bg-success");
  });

  it("maps not-started to a gray dot", () => {
    expect(getTeamBuildStatusLabel("not-started")).toBe("Not started");
    expect(getTeamBuildStatusDotClass("not-started")).toBe("bg-gray-400");
  });
});
