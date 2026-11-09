// The one data shape every Build Card layout renders (ADR 0056).
// CalculatorBuildCard.vue builds it once from the stores, so all three
// layouts show exactly the same numbers and only differ in arrangement.

import type { ImageTransform } from "../utils/imageTransform";
import type { TeamSubstatScoreRollup } from "../composables/useTeamSubstatScoreRollup";
import type { BuildCardStatRow } from "./statRows";

export interface BuildCardResonanceNode {
  key: string;
  name?: string;
  icon?: string;
  isEnabled: boolean;
}

export interface BuildCardWeaponView {
  name: string;
  image: string | null;
  rarity: number | string;
  level: string | number;
  refinement: string | number;
  attack: number | null;
  modifierLabel: string | null;
  modifierImage: string | null;
  modifierValue: number | null;
}

export interface BuildCardSetSummary {
  key: string;
  count: number;
  label: string;
  icon: string;
}

export interface BuildCardTalents {
  basic?: number;
  skill?: number;
  forte?: number;
  liberation?: number;
  intro?: number;
}

export interface BuildCardForteIcons {
  basic?: string;
  skill?: string;
  liberation?: string;
  forte?: string;
  intro?: string;
}

export interface BuildCardView {
  characterId: string;
  name: string | null;
  rarity: number;
  level: string;
  element: string | null;
  elementIcon: string | null;
  art: {
    /** The image the art slot shows (default, curated or uploaded). */
    url: string;
    /** The uploaded image, if that is what's showing (enables reset). */
    uploadUrl: string | null;
    transform: Partial<ImageTransform> | null;
    /**
     * Hero and Showcase draw the art over the whole left side. When the
     * player has set a background, that background becomes the hero image
     * instead, unless they ask to show the character art over it.
     */
    show: boolean;
  };
  backdrop: {
    url: string | null;
    /** True for the default look: the character art, blurred and darkened. */
    blurred: boolean;
    transform: Partial<ImageTransform> | null;
  };
  resonance: BuildCardResonanceNode[];
  talents: BuildCardTalents;
  forteIcons: BuildCardForteIcons;
  weapon: BuildCardWeaponView | null;
  statRows: BuildCardStatRow[];
  echoes: Array<Record<string, any>>;
  sets: BuildCardSetSummary[];
  score: TeamSubstatScoreRollup | null;
  /** Summed substat Crit Value of the equipped echoes, null when none. */
  totalCv: number | null;
  username: string;
  uid: string;
  /** Credits for curated art in use, shown in small print. */
  credits: string[];
}
