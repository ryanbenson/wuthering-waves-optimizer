export type CharacterBuildStatus = "not-started" | "in-progress" | "finished";

export function getCharacterBuildStatus(
  characterKey: string,
  characters: Record<string, { buildComplete?: boolean } | undefined>,
): CharacterBuildStatus {
  const data = characters[characterKey];
  if (!data) {
    return "not-started";
  }
  if (data.buildComplete) {
    return "finished";
  }
  return "in-progress";
}
