import type { ApiCharacterDetail, ApiSkill } from "./api.js";
import { toAttackKey } from "./naming.js";

export interface GeneratedBuff {
  key: string;
  name: string;
  details: string;
  hasStacks: boolean;
  modifiers: [];
  minStacks: number;
  maxStacks: number;
  alwaysEnabled: boolean;
}

const NON_COMBAT_INHERENT_SKILL_NAMES = new Set([
  "Skillful Cooking",
  "Life Skill",
]);

function decodeHtml(text: string): string {
  return text
    .replace(/\\u003C/gi, "<")
    .replace(/\\u003E/gi, ">")
    .replace(/\\u0026/gi, "&")
    .replace(/\\u0022/gi, '"')
    .replace(/\\u0027/gi, "'")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t");
}

function formatTemplateString(value: string): string {
  const escaped = value
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");
  return `\`${escaped}\``;
}

function formatBuffDetails(description: string): string {
  const decoded = decodeHtml(description).trim();
  if (!decoded) {
    return "<div></div>";
  }

  if (/^<div[\s>]/i.test(decoded)) {
    return decoded;
  }

  return `<div>${decoded}</div>`;
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

function formatBuff(buff: GeneratedBuff, index: number, total: number): string {
  const lines = [
    "  {",
    `    key: \`${buff.key}\`,`,
    `    name: \`${buff.name}\`,`,
    `    details: ${formatTemplateString(buff.details)},`,
    "    hasStacks: false,",
    "    modifiers: [],",
    "    minStacks: 0,",
    "    maxStacks: 0,",
    "    alwaysEnabled: false,",
    `  }${index < total - 1 ? "," : ""}`,
  ];

  return lines.join("\n");
}

export function formatBuffsFileContent(buffs: GeneratedBuff[]): string {
  if (buffs.length === 0) {
    return "export const buffs = [];\n";
  }

  const buffBlocks = buffs
    .map((buff, index) => formatBuff(buff, index, buffs.length))
    .join("\n");

  return `export const buffs = [\n${buffBlocks}\n];\n`;
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
