export type CharacterBuildStatus = "not-started" | "in-progress" | "finished";

export const CHARACTER_BUILD_STATUSES: CharacterBuildStatus[] = [
  "not-started",
  "in-progress",
  "finished",
];

type CharacterBuildData = {
  buildStatus?: CharacterBuildStatus;
  buildComplete?: boolean;
};

export function getCharacterBuildStatus(
  characterKey: string,
  characters: Record<string, CharacterBuildData | undefined>,
): CharacterBuildStatus {
  const data = characters[characterKey];
  if (!data) {
    return "not-started";
  }
  if (data.buildStatus) {
    return data.buildStatus;
  }
  if (data.buildComplete) {
    return "finished";
  }
  return "not-started";
}

export function getCharacterBuildStatusLabel(
  status: CharacterBuildStatus,
): string {
  switch (status) {
    case "finished":
      return "Finished";
    case "in-progress":
      return "In progress";
    default:
      return "Not started";
  }
}

export function getCharacterBuildStatusDotClass(
  status: CharacterBuildStatus,
): string {
  switch (status) {
    case "finished":
      return "bg-success";
    case "in-progress":
      return "bg-info";
    default:
      return "bg-gray-400";
  }
}
