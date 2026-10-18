import { computed } from "vue";
import { getCharacterRosterDisplayName } from "../characters/characters";
import { useCharacterStore } from "../stores/character";
import { getWeightsGoal, type TuningGoalPresetOption } from "../echoes/tuningOdds";

// The "<Character>'s top 3" goal preset, from that character's resolved
// substat weights (curated profile + user edits). Empty when there's no
// character or its weights are the neutral all-equal profile, which would
// make every substat "top".
export function useCharacterTuningPreset(getCharacterId: () => string | null | undefined) {
  const characterStore = useCharacterStore();

  return computed<TuningGoalPresetOption[]>(() => {
    const characterId = getCharacterId();
    if (!characterId) return [];
    const goal = getWeightsGoal(characterStore.getCharacterSubstatWeights(characterId));
    if (!goal?.length) return [];
    return [
      {
        key: "character-weights",
        label: `${getCharacterRosterDisplayName(characterId)}'s top ${goal.length}`,
        goal,
      },
    ];
  });
}
