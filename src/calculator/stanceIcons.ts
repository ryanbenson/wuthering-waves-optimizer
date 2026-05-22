/**
 * Shared stance icon assets. Many characters reuse the same resonance mode labels.
 */
export interface StanceIconConfig {
  imageUrl: string;
  /** CSS filter for monochrome skill icons (e.g. Phoebe Absolution / Confession). */
  cssFilter?: string;
}

const NANOKA_ROLE_LABEL_BASE =
  "https://static.nanoka.cc/assets/ww/UIResources/Common/Atlas/RoleLabel";
const NANOKA_SKILL_ICON_FEIBI_BASE =
  "https://static.nanoka.cc/assets/ww/UIResources/Common/Atlas/SkillIcon/SkillIconFeibi";

/** Gold tint for Phoebe Absolution (SP_IconFeibiB1). */
const ABSOLUTION_ICON_FILTER =
  "brightness(0) saturate(100%) invert(78%) sepia(45%) saturate(600%) hue-rotate(5deg) brightness(105%) contrast(95%)";

/** Blue tint for Phoebe Confession (SP_IconFeibiB1). */
const CONFESSION_ICON_FILTER =
  "brightness(0) saturate(100%) invert(58%) sepia(90%) saturate(1200%) hue-rotate(186deg) brightness(100%) contrast(95%)";

export const STANCE_ICONS: Record<string, StanceIconConfig> = {
  "Fusion Burst": {
    imageUrl: `${NANOKA_ROLE_LABEL_BASE}/SP_RoleLabelE5.webp`,
  },
  "Tune Rupture": {
    imageUrl: `${NANOKA_ROLE_LABEL_BASE}/SP_RoleLabelI2.webp`,
  },
  "Tune Strain": {
    imageUrl: `${NANOKA_ROLE_LABEL_BASE}/SP_RoleLabelH1.webp`,
  },
  Absolution: {
    imageUrl: `${NANOKA_SKILL_ICON_FEIBI_BASE}/SP_IconFeibiB1.webp`,
    cssFilter: ABSOLUTION_ICON_FILTER,
  },
  Confession: {
    imageUrl: `${NANOKA_SKILL_ICON_FEIBI_BASE}/SP_IconFeibiB1.webp`,
    cssFilter: CONFESSION_ICON_FILTER,
  },
};

export function getStanceIconConfig(
  stanceName: string,
): StanceIconConfig | undefined {
  return STANCE_ICONS[stanceName];
}
