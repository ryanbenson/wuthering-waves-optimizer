import { useCharacterStore } from "../stores/character";
import { getCuratedSubstatWeights } from "../characters/substatPriorities";

// Same "is this a priority stat" rule useEchoInsights.ts uses for its
// priority/other row split: only curated characters have a real priority
// signal (an uncurated character's weights are the neutral fallback
// profile, where nothing is actually a stated priority).
export function usePrioritySubstats() {
  const characterStore = useCharacterStore();

  function isPrioritySubstat(
    characterId: string | null | undefined,
    type: string | null | undefined,
  ): boolean {
    if (!characterId || !type) return false;
    if (!getCuratedSubstatWeights(characterId)) return false;
    const weights = characterStore.getCharacterSubstatWeights(characterId);
    return (weights?.[type] ?? 0) > 0;
  }

  return { isPrioritySubstat };
}
