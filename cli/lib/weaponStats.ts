import type { ApiWeaponDetail } from "./api.js";
import { decodeAndCleanHtml } from "./html.js";
import { toCharacterKey } from "./naming.js";

const FULL_BASE_LEVELS = [1, 20, 40, 50, 60, 70, 80, 90] as const;
const FULL_ASCENSION_LEVELS = [20, 40, 50, 60, 70, 80] as const;
const LIMITED_BASE_LEVELS = [1, 20, 40, 50, 60, 70] as const;
const LIMITED_ASCENSION_LEVELS = [20, 40, 50, 60] as const;

export interface WeaponBasicData {
  key: string;
  name: string;
  description: string;
  image: string;
  type: string;
  rarity: number;
  passiveName: string;
  passiveValue: string;
  maxLevel?: string;
  weaponLevelOverride?: string[];
}

export interface WeaponLevelStats {
  attack: number;
  modifier: string;
  modifierValue: number;
}

function stripHtmlTags(html: string): string {
  return decodeAndCleanHtml(html).replace(/<[^>]*>/g, "");
}

function getGrowthLevels(detail: ApiWeaponDetail): {
  baseLevels: readonly number[];
  ascensionLevels: readonly number[];
} {
  if (detail.QualityId <= 2) {
    return {
      baseLevels: LIMITED_BASE_LEVELS,
      ascensionLevels: LIMITED_ASCENSION_LEVELS,
    };
  }

  return {
    baseLevels: FULL_BASE_LEVELS,
    ascensionLevels: FULL_ASCENSION_LEVELS,
  };
}

function getGrowthValue(
  growthValues: ApiWeaponDetail["Properties"][number]["GrowthValues"],
  level: number,
): string {
  const entry = growthValues.find((growth) => growth.Level === level);
  if (!entry) {
    throw new Error(`Missing growth value for level ${level}`);
  }
  return entry.Value;
}

function parseAttackValue(value: string): number {
  return Math.floor(Number.parseFloat(value));
}

function parsePercentValue(value: string): number {
  const percent = Number.parseFloat(value.replace("%", ""));
  return Math.round((percent / 100) * 1000) / 1000;
}

function parseGrowthValue(value: string): number {
  if (value.includes("%")) {
    return parsePercentValue(value);
  }
  return parseAttackValue(value);
}

function normalizeModifierName(name: string): string {
  return name.replace(/[.\s]+/g, "");
}

function getAttackProperty(detail: ApiWeaponDetail) {
  const property = detail.Properties[0];
  if (!property) {
    throw new Error("Missing attack property in weapon API response");
  }
  return property;
}

function getModifierProperty(detail: ApiWeaponDetail) {
  const property = detail.Properties[1];
  if (!property) {
    throw new Error("Missing modifier property in weapon API response");
  }
  return property;
}

export function extractWeaponBasicData(
  detail: ApiWeaponDetail,
  displayName: string,
): WeaponBasicData {
  const key = toCharacterKey(displayName);
  const description =
    detail.ObtainedShowDescription?.trim() ||
    detail.BgDescription?.trim() ||
    detail.AttributesDescription?.trim() ||
    "";

  const basic: WeaponBasicData = {
    key,
    name: displayName,
    description,
    image: `https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/${key}.png`,
    type: detail.WeaponTypeName,
    rarity: detail.QualityId,
    passiveName: detail.ResonName,
    passiveValue: stripHtmlTags(detail.Desc ?? ""),
  };

  if (detail.QualityId <= 2) {
    basic.maxLevel = "70";
    basic.weaponLevelOverride = [
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
    ];
  }

  return basic;
}

export function buildWeaponData(
  detail: ApiWeaponDetail,
): Record<string, WeaponLevelStats> {
  const attackProperty = getAttackProperty(detail);
  const modifierProperty = getModifierProperty(detail);
  const modifier = normalizeModifierName(modifierProperty.Name);
  const { baseLevels, ascensionLevels } = getGrowthLevels(detail);
  const stats: Record<string, WeaponLevelStats> = {};

  for (const level of baseLevels) {
    stats[String(level)] = {
      attack: parseAttackValue(getGrowthValue(attackProperty.GrowthValues, level)),
      modifier,
      modifierValue: parseGrowthValue(
        getGrowthValue(modifierProperty.GrowthValues, level),
      ),
    };
  }

  for (const level of ascensionLevels) {
    stats[`${level}+`] = {
      attack: parseAttackValue(
        getGrowthValue(attackProperty.GrowthValues, level + 0.5),
      ),
      modifier,
      modifierValue: parseGrowthValue(
        getGrowthValue(modifierProperty.GrowthValues, level),
      ),
    };
  }

  return stats;
}

function formatWeaponLevelOverride(levels: string[]): string {
  return levels.map((level) => `"${level}"`).join(",\n    ");
}

function formatModifierValue(value: number): string {
  return String(value);
}

export function formatWeaponFileContent(
  basic: WeaponBasicData,
  stats: Record<string, WeaponLevelStats>,
): string {
  const levelKeys = basic.weaponLevelOverride ?? [
    "1",
    "20",
    "40",
    "50",
    "60",
    "70",
    "80",
    "90",
    "20+",
    "40+",
    "50+",
    "60+",
    "70+",
    "80+",
  ];

  const weaponInfoLines = [
    `  name: ${JSON.stringify(basic.name)},`,
    `  image: ${JSON.stringify(basic.image)},`,
    `  description: ${JSON.stringify(basic.description)},`,
    `  type: ${JSON.stringify(basic.type)},`,
    `  rarity: ${basic.rarity},`,
    `  passiveName: ${JSON.stringify(basic.passiveName)},`,
    `  passiveValue: ${JSON.stringify(basic.passiveValue)},`,
    "  passiveData: [],",
  ];

  if (basic.maxLevel) {
    weaponInfoLines.push(`  maxLevel: ${JSON.stringify(basic.maxLevel)},`);
    weaponInfoLines.push(
      `  weaponLevelOverride: [\n    ${formatWeaponLevelOverride(basic.weaponLevelOverride ?? [])}\n  ]`,
    );
  }

  const weaponDataEntries = levelKeys
    .map((levelKey) => {
      const levelStats = stats[levelKey];
      return `  "${levelKey}": {
    attack: ${levelStats.attack},
    modifier: ${JSON.stringify(levelStats.modifier)},
    modifierValue: ${formatModifierValue(levelStats.modifierValue)},
  },`;
    })
    .join("\n");

  return `const weaponInfo: WeaponInfo = {
${weaponInfoLines.join("\n")}
};

const weaponData: WeaponData = {
${weaponDataEntries}
};

export function getWeaponInfo(): WeaponInfo {
  return weaponInfo;
}

export function getWeaponData(): WeaponData {
  return weaponData;
}

export function getWeaponDataByLevel(level: string): WeaponLevelData {
  return weaponData[level];
}

export function getWeapon() {
  return {
    info: weaponInfo,
    data: weaponData,
    getWeaponInfo,
    getWeaponData,
    getWeaponDataByLevel,
  };
}
`;
}

export function getWeaponGenerationNotices(): string[] {
  return ["Review passiveData in the generated weapon file (left empty by default)"];
}
