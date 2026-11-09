// Colors and labels for the Build Card. The card is exported as an image
// and always uses its own dark palette, whatever the app theme (ADR 0056),
// so these are fixed values chosen to read on its dark panels rather than
// theme tokens.

import type { RatingColor } from "../echoes/rating";

export const ICON_BASE = "https://ryanbenson.github.io/wuthering-waves-assets/images";

export const ELEMENT_ICONS: Record<string, string> = {
  Glacio: `${ICON_BASE}/glaciodmgbonus.png`,
  Fusion: `${ICON_BASE}/fusiondmgbonus.png`,
  Electro: `${ICON_BASE}/electrodmgbonus.png`,
  Aero: `${ICON_BASE}/aerodmgbonus.png`,
  Spectro: `${ICON_BASE}/spectrodmgbonus.png`,
  Havoc: `${ICON_BASE}/havocdmgbonus.png`,
};

// Highlight color per element, used when the player hasn't picked their own
// primary color. Each is above 7:1 contrast against the card's #0a0e1c.
const ELEMENT_ACCENTS: Record<string, string> = {
  Glacio: "#7cc8ff",
  Fusion: "#ff8a66",
  Electro: "#c39bff",
  Aero: "#5fe3b8",
  Spectro: "#f2d96b",
  Havoc: "#ee6aa8",
};

export const FALLBACK_ACCENT = "#8fb0ff";

export function getElementIcon(element: string | null | undefined): string | null {
  return (element && ELEMENT_ICONS[element]) || null;
}

export function getElementAccent(element: string | null | undefined): string {
  return (element && ELEMENT_ACCENTS[element]) || FALLBACK_ACCENT;
}

// Same hues as the app's grade badges (useEchoRating.ts), at shades that
// stay readable on the dark card. "white" can't use the theme's base
// content color here: in the light theme that is near-black.
const GRADE_COLORS: Record<RatingColor, string> = {
  white: "#e2e8f5",
  green: "#34d399",
  blue: "#60a5fa",
  purple: "#c084fc",
  gold: "#facc15",
  red: "#f87171",
};

export function getGradeColor(color: RatingColor | null | undefined): string {
  return (color && GRADE_COLORS[color]) || GRADE_COLORS.white;
}

// Substat roll quality, same four buckets and thresholds as the rest of the
// app (useEchoCardStats.ts's getSubstatRollTier): green low, blue mid-low,
// purple mid-high, yellow high.
export const ROLL_TIER_COLORS = {
  low: "#34d399",
  mid: "#60a5fa",
  high: "#c084fc",
  top: "#facc15",
} as const;

// Shorter labels for the narrow echo layouts (Hero columns). The Columns
// layout has room for the game's full names and keeps using those.
const SHORT_SUBSTAT_LABELS: Record<string, string> = {
  HP_FLAT: "HP",
  ATK_FLAT: "ATK",
  DEF_FLAT: "DEF",
  ATK: "ATK%",
  HP: "HP%",
  DEF: "DEF%",
  EnergyRegen: "Energy Regen",
  CritRate: "Crit Rate",
  CritDMG: "Crit DMG",
  BasicAttackDMGBonus: "Basic ATK DMG",
  HeavyAttackDMGBonus: "Heavy ATK DMG",
  ResonanceSkillDMGBonus: "Skill DMG",
  ResonanceLiberationDMGBonus: "Liberation DMG",
  Glacio: "Glacio DMG",
  Fusion: "Fusion DMG",
  Electro: "Electro DMG",
  Aero: "Aero DMG",
  Spectro: "Spectro DMG",
  Havoc: "Havoc DMG",
  HealingBonus: "Healing",
};

export function getShortSubstatLabel(key: string, fallback?: string): string {
  return SHORT_SUBSTAT_LABELS[key] ?? fallback ?? key;
}
