/**
 * Recommended teams for the Team Buffs tab (issue #663, Labs
 * "recommendedTeams"). A character's `suggestedTeams` in `basic.ts` is
 * hand-written; this turns it into what the card shows, dropping anything
 * that couldn't be used: teammates who aren't in the released roster (so no
 * unreleased characters), the main character themself, a doubled teammate, a
 * repeated team, and unknown tags.
 */
import { characterPickerRoster } from "./characters";
import { TEAM_TAGS, isTeamTag, type TeamTag } from "./teamTags";

export type SuggestedTeam = { members: string[]; tags?: string[] };

export type RecommendedTeamMember = { key: string; name: string; rarity: 4 | 5 };

export type RecommendedTeam = {
  id: string;
  members: [RecommendedTeamMember, RecommendedTeamMember];
  tags: TeamTag[];
};

function rosterMember(key: string): RecommendedTeamMember | null {
  const five = characterPickerRoster.five.find((c) => c.key === key);
  if (five) return { key, name: five.name, rarity: 5 };
  const four = characterPickerRoster.four.find((c) => c.key === key);
  if (four) return { key, name: four.name, rarity: 4 };
  return null;
}

export function getRecommendedTeams(
  mainCharacter: string,
  suggestedTeams: SuggestedTeam[] | null | undefined,
): RecommendedTeam[] {
  const teams: RecommendedTeam[] = [];
  const seen = new Set<string>();
  for (const suggestion of suggestedTeams ?? []) {
    const keys = suggestion?.members ?? [];
    if (keys.length !== 2) continue;
    const [a, b] = keys;
    if (a === b || a === mainCharacter || b === mainCharacter) continue;
    const first = rosterMember(a);
    const second = rosterMember(b);
    if (!first || !second) continue;
    const id = [a, b].sort().join("+");
    if (seen.has(id)) continue;
    seen.add(id);
    const tags = TEAM_TAGS.filter((tag) => (suggestion.tags ?? []).some((t) => isTeamTag(t) && t === tag));
    teams.push({ id, members: [first, second], tags });
  }
  return teams;
}

/** True when the two teammate slots hold this team's members, in either order. */
export function isCurrentTeam(
  team: RecommendedTeam,
  slot1: string | null | undefined,
  slot2: string | null | undefined,
): boolean {
  const [a, b] = team.members.map((m) => m.key);
  return (slot1 === a && slot2 === b) || (slot1 === b && slot2 === a);
}

/** The tags used by these teams, in TEAM_TAGS order (for the filter pills). */
export function getRecommendedTeamTags(teams: RecommendedTeam[]): TeamTag[] {
  return TEAM_TAGS.filter((tag) => teams.some((t) => t.tags.includes(tag)));
}
