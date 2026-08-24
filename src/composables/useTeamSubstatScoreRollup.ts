import { computed, type ComputedRef } from "vue";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import {
  getSubstatScoreGrade,
  getGradeForSubstatScorePercent,
  type RatingColor,
} from "../echoes/rating";

export interface TeamSubstatScoreRollup {
  percent: number;
  provisional: boolean;
  grade: string;
  color: RatingColor;
}

// Averages the Substat Score across a character's 5 equipped echo slots
// (skipping empty ones), using that character's own weight profile.
// Provisional when fewer than 5 slots are equipped, or any equipped echo
// itself has fewer than 5 revealed substats.
export function useTeamSubstatScoreRollup(
  characterId: ComputedRef<string | null | undefined> | (() => string | null | undefined),
) {
  const characterStore = useCharacterStore();
  const inventoryStore = useInventoryStore();

  const resolveId = () =>
    typeof characterId === "function" ? characterId() : characterId.value;

  const rollup = computed<TeamSubstatScoreRollup | null>(() => {
    const id = resolveId();
    if (!id) return null;
    const slots = characterStore.characters?.[id]?.echoes ?? {};
    const weights = characterStore.getCharacterSubstatWeights(id);
    const scores: { percent: number; provisional: boolean }[] = [];
    for (let i = 0; i < 5; i++) {
      const slot = slots[i];
      // A slot counts as equipped if it has either an echoId (data lives
      // in inventory) or an echo type directly on the slot (data was
      // never saved to standalone inventory — see
      // CalculatorEchoImporter.vue's `{ ...echo, echoId: null }` branch).
      if (!slot?.echoId && !slot?.echo) continue;
      // Prefer the standalone inventory copy when one exists (it's the
      // freshest source of truth), but fall back to the character-embedded
      // slot data itself, matching CalculatorBuildCard.vue's echoSlots.
      const echo = (slot.echoId && inventoryStore.getEchoById(slot.echoId)) || slot;
      const score = getSubstatScoreGrade(echo, weights);
      scores.push({ percent: score.percent, provisional: score.provisional });
    }
    if (scores.length === 0) return null;
    const averagePercent =
      scores.reduce((sum, s) => sum + s.percent, 0) / scores.length;
    const provisional = scores.length < 5 || scores.some((s) => s.provisional);
    const { grade, color } = getGradeForSubstatScorePercent(averagePercent);
    return { percent: averagePercent, provisional, grade, color };
  });

  return { rollup };
}
