import type {
  ApiCharacterDetail,
  ApiSkill,
  ApiSkillTreeNode,
} from "./api.js";
import {
  formatDefaultBuffProperties,
  mergeCharacterEntriesFile,
  type ParsedCharacterFile,
} from "./extractCharacterEntries.js";
import {
  decodeAndCleanHtml,
  formatTemplateString,
  wrapDescriptionHtml,
} from "./html.js";
import { toAttackKey } from "./naming.js";

export interface GeneratedBuffModifier {
  modifier: string;
  modifierValue: number;
}

export interface GeneratedBuff {
  key: string;
  name: string;
  details: string;
  hasStacks: boolean;
  modifiers: GeneratedBuffModifier[];
  minStacks: number;
  maxStacks: number;
  alwaysEnabled: boolean;
}

const NON_COMBAT_INHERENT_SKILL_NAMES = new Set([
  "Skillful Cooking",
  "Life Skill",
]);

const STAT_BONUS_MODIFIER: Record<string, string> = {
  "ATK+": "ATK",
  "Crit. Rate+": "CritRate",
  "Crit. DMG+": "CritDMG",
  "Healing Bonus+": "HealingBonus",
  "DEF+": "DEF",
  "HP+": "HP",
  "Glacio DMG Bonus+": "Glacio",
  "Fusion DMG Bonus+": "Fusion",
  "Aero DMG Bonus+": "Aero",
  "Electro DMG Bonus+": "Electro",
  "Spectro DMG Bonus+": "Spectro",
  "Havoc DMG Bonus+": "Havoc",
  "Energy Regen+": "EnergyRegen",
};

const STAT_BONUS_KEY_SUFFIX: Record<string, string> = {
  "ATK+": "ATK",
  "Crit. Rate+": "CritRate",
  "Crit. DMG+": "CritDMG",
  "Healing Bonus+": "HealingBonus",
  "DEF+": "DEF",
  "HP+": "HP",
  "Glacio DMG Bonus+": "Glacio",
  "Fusion DMG Bonus+": "Fusion",
  "Aero DMG Bonus+": "Aero",
  "Electro DMG Bonus+": "Electro",
  "Spectro DMG Bonus+": "Spectro",
  "Havoc DMG Bonus+": "Havoc",
  "Energy Regen+": "EnergyRegen",
};

function formatBuffDetails(description: string): string {
  return wrapDescriptionHtml(description);
}

function formatStatBonusDetails(description: string): string {
  const decoded = decodeAndCleanHtml(description).trim();
  if (!decoded) {
    return `<div class="skilldescription"></div>`;
  }

  const text = decoded.endsWith(".") ? decoded : `${decoded}.`;
  return `<div class="skilldescription">${text}</div>`;
}

function normalizePropertyNodeTitle(title: string): string {
  return title.replace(/ Up$/, "+").trim();
}

function parseStatBonusPercent(description: string): number | undefined {
  const match = decodeAndCleanHtml(description).match(/(\d+(?:\.\d+)?)%/);
  if (!match) {
    return undefined;
  }

  return Number.parseFloat(
    (Number.parseFloat(match[1]) / 100).toFixed(4),
  );
}

function getStatBonusModifier(title: string): string | undefined {
  return STAT_BONUS_MODIFIER[normalizePropertyNodeTitle(title)];
}

function getStatBonusKeySuffix(title: string): string {
  const normalized = normalizePropertyNodeTitle(title);
  if (normalized in STAT_BONUS_KEY_SUFFIX) {
    return STAT_BONUS_KEY_SUFFIX[normalized];
  }

  return toAttackKey(normalized.replace(/\+$/, ""));
}

function sortStatBonusTitles(titles: string[], firstIndex: Map<string, number>): string[] {
  return [...titles].sort((left, right) => {
    const leftIsAtk = normalizePropertyNodeTitle(left) === "ATK+";
    const rightIsAtk = normalizePropertyNodeTitle(right) === "ATK+";
    if (leftIsAtk !== rightIsAtk) {
      return leftIsAtk ? 1 : -1;
    }

    return (firstIndex.get(left) ?? 0) - (firstIndex.get(right) ?? 0);
  });
}

function toInherentSkillBuffKey(skillName: string): string {
  return `InherentSkill${toAttackKey(skillName)}`;
}

export function isCombatInherentSkill(skill: ApiSkill): boolean {
  if (NON_COMBAT_INHERENT_SKILL_NAMES.has(skill.SkillName)) {
    return false;
  }

  return true;
}

export function getCombatInherentSkills(
  detail: ApiCharacterDetail,
): ApiSkill[] {
  return detail.Skills.filter(
    (skill) =>
      skill.SkillType === "Inherent Skill" &&
      Boolean(skill.SkillName?.trim()) &&
      isCombatInherentSkill(skill),
  );
}

export function buildInherentSkillBuffs(
  detail: ApiCharacterDetail,
): GeneratedBuff[] {
  return getCombatInherentSkills(detail).map((skill) => ({
    key: toInherentSkillBuffKey(skill.SkillName),
    name: `Inherent Skill: ${skill.SkillName}`,
    details: formatBuffDetails(skill.SkillDescribe ?? ""),
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  }));
}

export function buildStatBonusBuffs(
  detail: ApiCharacterDetail,
): GeneratedBuff[] {
  const nodes = detail.SkillTree ?? [];
  if (nodes.length === 0) {
    return [];
  }

  const grouped = new Map<string, ApiSkillTreeNode[]>();
  const firstIndex = new Map<string, number>();

  for (const [index, node] of nodes.entries()) {
    const title = node.PropertyNodeTitle;
    if (!grouped.has(title)) {
      grouped.set(title, []);
      firstIndex.set(title, index);
    }
    grouped.get(title)!.push(node);
  }

  const buffs: GeneratedBuff[] = [];

  for (const title of sortStatBonusTitles([...grouped.keys()], firstIndex)) {
    const statNodes = [...(grouped.get(title) ?? [])].sort((left, right) => {
      const leftValue = parseStatBonusPercent(left.PropertyNodeDescribe) ?? 0;
      const rightValue = parseStatBonusPercent(right.PropertyNodeDescribe) ?? 0;
      return leftValue - rightValue;
    });

    const normalizedTitle = normalizePropertyNodeTitle(title);
    const keySuffix = getStatBonusKeySuffix(title);
    const modifier = getStatBonusModifier(title);

    statNodes.forEach((node, index) => {
      const modifierValue = parseStatBonusPercent(node.PropertyNodeDescribe);
      buffs.push({
        key: `StatBonus${keySuffix}${index + 1}`,
        name: `Stat Bonus: ${normalizedTitle}`,
        details: formatStatBonusDetails(node.PropertyNodeDescribe),
        hasStacks: false,
        modifiers:
          modifier !== undefined && modifierValue !== undefined
            ? [{ modifier, modifierValue }]
            : [],
        minStacks: 0,
        maxStacks: 0,
        alwaysEnabled: false,
      });
    });
  }

  return buffs;
}

export function buildBuffs(detail: ApiCharacterDetail): GeneratedBuff[] {
  return [...buildInherentSkillBuffs(detail), ...buildStatBonusBuffs(detail)];
}

function formatModifiers(modifiers: GeneratedBuffModifier[]): string {
  if (modifiers.length === 0) {
    return "    modifiers: [],";
  }

  const modifierBlocks = modifiers
    .map(
      (entry) => `      {
        modifier: ${JSON.stringify(entry.modifier)},
        modifierValue: ${entry.modifierValue},
      },`,
    )
    .join("\n");

  return `    modifiers: [\n${modifierBlocks}\n    ],`;
}

function formatBuffEntry(
  buff: GeneratedBuff,
  preservedProperties?: string,
): string {
  const lines = [
    "  {",
    `    key: \`${buff.key}\`,`,
    `    name: \`${buff.name}\`,`,
    `    details: ${formatTemplateString(buff.details)},`,
    preservedProperties ??
      formatDefaultBuffProperties(formatModifiers(buff.modifiers)),
    "  }",
  ];

  return lines.join("\n");
}

export function formatBuffsFileContent(
  detail: ApiCharacterDetail,
  existing?: ParsedCharacterFile,
): string {
  const buffs = buildBuffs(detail);
  const buffsByKey = new Map(buffs.map((buff) => [buff.key, buff]));

  return mergeCharacterEntriesFile({
    exportName: "buffs",
    generatedBlocks: buffs.map((buff) => formatBuffEntry(buff)),
    generatedKeys: buffs.map((buff) => buff.key),
    existing,
    formatFreshEntry: (key) => formatBuffEntry(buffsByKey.get(key)!),
    formatMergedEntry: (key, preservedProperties) =>
      formatBuffEntry(buffsByKey.get(key)!, preservedProperties),
  });
}

export function getInherentSkillBuffNotices(
  detail: ApiCharacterDetail,
): string[] {
  const combatSkills = getCombatInherentSkills(detail);
  if (combatSkills.length === 2) {
    return [];
  }

  const skillNames = combatSkills.map((skill) => skill.SkillName).join(", ");
  return [
    `buffs.ts: Expected 2 combat inherent skills but found ${combatSkills.length}${skillNames ? ` (${skillNames})` : ""}. Review inherent skill buffs manually.`,
  ];
}

export function getStatBonusBuffNotices(
  detail: ApiCharacterDetail,
): string[] {
  const nodes = detail.SkillTree ?? [];
  const notices: string[] = [];

  if (nodes.length !== 8) {
    notices.push(
      `buffs.ts: Expected 8 stat bonus nodes in SkillTree but found ${nodes.length}. Review stat bonus buffs manually.`,
    );
  }

  const titles = [...new Set(nodes.map((node) => node.PropertyNodeTitle))];
  if (nodes.length === 8 && titles.length !== 2) {
    notices.push(
      `buffs.ts: Expected 2 stat types in SkillTree but found ${titles.length} (${titles.join(", ")}). Review stat bonus buffs manually.`,
    );
  }

  for (const node of nodes) {
    const modifier = getStatBonusModifier(node.PropertyNodeTitle);
    if (!modifier) {
      notices.push(
        `buffs.ts: Unknown SkillTree stat "${node.PropertyNodeTitle}" — add modifier mapping manually.`,
      );
      continue;
    }

    if (parseStatBonusPercent(node.PropertyNodeDescribe) === undefined) {
      notices.push(
        `buffs.ts: Could not parse stat bonus value for "${node.PropertyNodeTitle}" (${node.PropertyNodeDescribe}). Review modifiers manually.`,
      );
    }
  }

  return [...new Set(notices)];
}

export function getBuffGenerationNotices(
  detail: ApiCharacterDetail,
): string[] {
  return [
    ...getInherentSkillBuffNotices(detail),
    ...getStatBonusBuffNotices(detail),
  ];
}
