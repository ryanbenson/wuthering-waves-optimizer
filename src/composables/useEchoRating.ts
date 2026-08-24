import { computed } from "vue";
import { useSettingsStore } from "../stores/settings";
import { useCharacterStore } from "../stores/character";
import {
  getEchoRatingGrade,
  getSubstatScoreGrade,
  type RatingColor,
} from "../echoes/rating";
import type { EchoSubStatsSource } from "../echoes/stats";

export interface EchoRatingProps extends EchoSubStatsSource {
  // When provided, also computes the per-character weighted Substat Score.
  characterId?: string | null;
}

// [bgColor, textColor, borderColor, boxShadow] — mirrors the tuple shape
// useEchoCardStats.ts's getBadgeClass returns for CV/RV badges, so all three
// badges can be bound the same way (`:class="someBadgeClass"`).
const RATING_BADGE_CLASSES: Record<RatingColor, string[]> = {
  white: ["bg-base-300", "text-base-content", "border-base-300", ""],
  green: ["bg-emerald-800", "text-white", "border-emerald-500", ""],
  blue: ["bg-blue-600", "text-black", "border-blue-600", ""],
  purple: ["bg-purple-600", "text-black", "border-purple-600", ""],
  gold: [
    "bg-yellow-500",
    "text-black",
    "border-yellow-500",
    "shadow-md shadow-yellow-500/50",
  ],
  red: [
    "bg-red-600",
    "text-white",
    "border-red-600",
    "shadow-md shadow-red-500/50",
  ],
};

export function getRatingBadgeClasses(color: RatingColor): string[] {
  return RATING_BADGE_CLASSES[color];
}

// A standalone { text, border } pairing — for contexts that show a grade on
// top of their own neutral background box (e.g. the Build Card's Build
// Score panel) rather than as a solid-fill badge pill, so the text needs to
// stay legible on its own instead of relying on a matching background.
export interface RatingAccentClasses {
  text: string;
  border: string;
}

const RATING_ACCENT_CLASSES: Record<RatingColor, RatingAccentClasses> = {
  white: { text: "text-base-content", border: "border-base-300" },
  green: { text: "text-emerald-500", border: "border-emerald-500" },
  blue: { text: "text-blue-500", border: "border-blue-500" },
  purple: { text: "text-purple-500", border: "border-purple-500" },
  gold: { text: "text-yellow-500", border: "border-yellow-500" },
  red: { text: "text-red-500", border: "border-red-500" },
};

export function getRatingAccentClasses(color: RatingColor): RatingAccentClasses {
  return RATING_ACCENT_CLASSES[color];
}

export function useEchoRating(props: EchoRatingProps) {
  const settingsStore = useSettingsStore();
  const characterStore = useCharacterStore();

  const echoRating = computed(() =>
    getEchoRatingGrade(props, settingsStore.echoRatingWeights),
  );
  const echoRatingBadgeClass = computed(() =>
    getRatingBadgeClasses(echoRating.value.color),
  );

  const substatScore = computed(() => {
    if (!props.characterId) return null;
    const weights = characterStore.getCharacterSubstatWeights(props.characterId);
    return getSubstatScoreGrade(props, weights);
  });
  const substatScoreBadgeClass = computed(() =>
    substatScore.value ? getRatingBadgeClasses(substatScore.value.color) : null,
  );

  return {
    echoRating,
    echoRatingBadgeClass,
    substatScore,
    substatScoreBadgeClass,
  };
}
