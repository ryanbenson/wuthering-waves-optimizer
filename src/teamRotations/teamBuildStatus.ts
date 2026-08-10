import type { CharacterBuildStatus } from "../characters/characterBuildStatus";

/**
 * Reuses the same status vocabulary as character builds
 * (not-started/wanted/in-progress/finished/wont-build) — that enum was
 * already generic enough to fit a team rotation's completion state too.
 */
export type TeamBuildStatus = CharacterBuildStatus;

export const TEAM_BUILD_STATUSES: TeamBuildStatus[] = [
  "not-started",
  "wanted",
  "in-progress",
  "finished",
  "wont-build",
];

type TeamBuildData = {
  buildStatus?: TeamBuildStatus;
};

export function getTeamBuildStatus(
  team: TeamBuildData | null | undefined,
): TeamBuildStatus {
  return team?.buildStatus ?? "not-started";
}

export function getTeamBuildStatusLabel(status: TeamBuildStatus): string {
  switch (status) {
    case "finished":
      return "Finished";
    case "in-progress":
      return "In progress";
    case "wanted":
      return "Wanted";
    case "wont-build":
      return "Won't build";
    default:
      return "Not started";
  }
}

export function getTeamBuildStatusDotClass(status: TeamBuildStatus): string {
  switch (status) {
    case "finished":
      return "bg-success";
    case "in-progress":
      return "bg-info";
    case "wanted":
      return "bg-warning";
    case "wont-build":
      return "bg-error";
    default:
      return "bg-gray-400";
  }
}
