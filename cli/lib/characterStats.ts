import type { ApiCharacterDetail } from "./api.js";

interface LevelStats {
  hp: number;
  attack: number;
  defense: number;
}

export interface CharacterBasicData {
  name: string;
  key: string;
  rarity: number;
  element: string;
  weaponPlural: string;
  gender: string;
  tuneBreakBoost?: number;
}

/** Ascension tier multipliers applied to truncated base breakpoint stats (same for 4★ and 5★). */
const ASCENSION_TIER_MULTIPLIERS: Record<
  number,
  { hp: number; attack: number; defense: number }
> = {
  20: { hp: 1.256, attack: 1.2857142857142858, defense: 1.2521008403361345 },
  40: { hp: 1.134694684796044, attack: 1.1477272727272727, defense: 1.134694684796044 },
  50: { hp: 1.1032323232323232, attack: 1.1120689655172414, defense: 1.101867572156197 },
  60: { hp: 1.083623693804403, attack: 1.094076655052264, defense: 1.0841379310344827 },
  70: { hp: 1.070359708319857, attack: 1.052478134110787, defense: 1.070766798143852 },
  80: { hp: 1.060724227484681, attack: 1.046153846153846, defense: 1.061061061061061 },
};

const BASE_LEVELS = [1, 20, 40, 50, 60, 70, 80, 90] as const;
const ASCENSION_LEVELS = [20, 40, 50, 60, 70, 80] as const;

function getGrowthValue(
  growthValues: Array<{ level: number; value: number }>,
  level: number,
): number {
  const entry = growthValues.find((growth) => growth.level === level);
  if (!entry) {
    throw new Error(`Missing growth value for level ${level}`);
  }
  return entry.value;
}

function getPropertyByName(detail: ApiCharacterDetail, name: string) {
  const property = detail.Properties.find((entry) => entry.Name === name);
  if (!property) {
    throw new Error(`Missing property: ${name}`);
  }
  return property;
}

export function extractBasicData(
  detail: ApiCharacterDetail,
  key: string,
): CharacterBasicData {
  const tuneBreakProperty = detail.Properties.find(
    (entry) => entry.Name === "Tune Break Boost",
  );
  const tuneBreakBoost =
    tuneBreakProperty !== undefined
      ? tuneBreakProperty.BaseValue / 100
      : undefined;
  const gender = detail.favorRole.Sex.Content.toLowerCase();

  return {
    name: detail.Name.Content,
    key,
    rarity: detail.QualityId,
    element: detail.ElementName,
    weaponPlural: detail.WeaponTypeName,
    gender,
    ...(tuneBreakBoost !== undefined && tuneBreakBoost > 0
      ? { tuneBreakBoost }
      : {}),
  };
}

export function buildCharacterStats(
  detail: ApiCharacterDetail,
): Record<string, LevelStats> {
  const hp = getPropertyByName(detail, "HP");
  const attack = getPropertyByName(detail, "ATK");
  const defense = getPropertyByName(detail, "DEF");
  const stats: Record<string, LevelStats> = {};

  for (const level of BASE_LEVELS) {
    stats[String(level)] = {
      hp: getGrowthValue(hp.GrowthValues, level),
      attack: getGrowthValue(attack.GrowthValues, level),
      defense: getGrowthValue(defense.GrowthValues, level),
    };
  }

  for (const level of ASCENSION_LEVELS) {
    const base = stats[String(level)];
    const multipliers = ASCENSION_TIER_MULTIPLIERS[level];
    stats[`${level}+`] = {
      hp: Math.round(Math.trunc(base.hp) * multipliers.hp),
      attack: Math.round(Math.trunc(base.attack) * multipliers.attack),
      defense: Math.round(Math.trunc(base.defense) * multipliers.defense),
    };
  }

  return stats;
}

function formatStatValue(value: number): string {
  return Number.isInteger(value) ? String(value) : String(value);
}

export function formatCharacterFileContent(
  stats: Record<string, LevelStats>,
): string {
  const levelKeys = [
    "1",
    "20",
    "20+",
    "40",
    "40+",
    "50",
    "50+",
    "60",
    "60+",
    "70",
    "70+",
    "80",
    "80+",
    "90",
  ];

  const entries = levelKeys
    .map((levelKey) => {
      const levelStats = stats[levelKey];
      return `  "${levelKey}": {
    hp: ${formatStatValue(levelStats.hp)},
    attack: ${formatStatValue(levelStats.attack)},
    defense: ${formatStatValue(levelStats.defense)},
  },`;
    })
    .join("\n");

  return `interface CharacterData {
  [level: string]: LevelData;
}

interface LevelData {
  hp: number;
  attack: number;
  defense: number;
}

const characterData: CharacterData = {
${entries}
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
`;
}

export function formatBasicFileContent(basic: CharacterBasicData): string {
  const tuneBreakLine =
    basic.tuneBreakBoost !== undefined
      ? `\n    tuneBreakBoost: ${basic.tuneBreakBoost},`
      : "";

  return `export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "${basic.name}",
    rarity: ${basic.rarity},
    weapon: "${basic.weaponPlural}",
    avatarUrl: "${basic.key}.png",
    gender: "${basic.gender}",
    element: "${basic.element}",${tuneBreakLine}
  };
}
`;
}
