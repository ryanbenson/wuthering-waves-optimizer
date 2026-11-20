/**
 * The fixed set of team-type tags for a character's `suggestedTeams`
 * (`basic.ts`, issue #663). Tags render as labels and filter pills on the
 * Team Buffs tab's Recommended teams card, in this order. Add a tag here
 * before using it in a character's data; tests reject unknown tags.
 * `npm run cli -- edit team-data` can add one for you (issue #732): team
 * types first, then play styles (e.g. Tune Break), then Budget / No healer.
 */
export const TEAM_TAGS = [
  "Mono Fusion",
  "Hypercarry",
  "Tune Break",
  "Fusion Burst",
  "Quickswap",
  "Dual DPS",
  "Budget",
  "No healer",
] as const;

export type TeamTag = (typeof TEAM_TAGS)[number];

export function isTeamTag(value: unknown): value is TeamTag {
  return typeof value === "string" && (TEAM_TAGS as readonly string[]).includes(value);
}
