import type { ApiCharacterDetail, ApiSkill } from "./api.js";
import { decodeAndCleanHtml } from "./html.js";
import { resolveSkillAttackMetadata } from "./damageListMatching.js";
import {
  buildAttacksFromAttributes,
  formatSkillAttackFileContent,
  type SkillAttackData,
} from "./skillAttacks.js";

const DEFAULT_TUNE_BREAK_DESCRIPTION =
  `<div>When the target's <span class="Highlight">Off-Tune Level</span> is full, the Resonator may cast <span class="Highlight">Tune Break</span> on the target.</div>`;

const TUNE_BREAK_WEAPON_TALENTS: Record<string, string> = {
  Sword: "100.00%*4 + 1200.00%",
  Broadblade: "226.72% + 173.44% + 1200.00%",
  Pistols: "1600.00%",
  Gauntlets: "1600.00%",
  Rectifier: "1600.00%",
};

const SKIPPED_TUNE_BREAK_ATTRIBUTE_PATTERNS = [
  "STA Cost",
  "Concerto Regen",
  "Resonance Cost",
  "Energy Cost",
  "Cooldown",
  "Duration",
  "Damage Reduction",
];

export function getTuneBreakSkill(
  detail: ApiCharacterDetail,
): ApiSkill | undefined {
  return detail.Skills.find((skill) => skill.SkillType === "Tune Break");
}

function isSkippedTuneBreakAttribute(attributeName: string): boolean {
  return SKIPPED_TUNE_BREAK_ATTRIBUTE_PATTERNS.some((pattern) =>
    attributeName.includes(pattern),
  );
}

export function hasCustomTuneBreakAttacks(skill: ApiSkill): boolean {
  return skill.SkillAttributes.some(
    (attribute) =>
      attribute.values?.length &&
      !isSkippedTuneBreakAttribute(attribute.attributeName),
  );
}

function getTuneBreakName(skill: ApiSkill | undefined): string {
  const skillName = skill?.SkillName?.trim();
  if (skillName) {
    return `Tune Break: ${skillName}`;
  }

  return "Tune Break";
}

function formatTuneBreakDescription(description: string): string {
  const decoded = decodeAndCleanHtml(description).trim();
  if (!decoded) {
    return DEFAULT_TUNE_BREAK_DESCRIPTION;
  }

  if (/^<div[\s>]/i.test(decoded)) {
    return decoded;
  }

  return `<div>${decoded}</div>`;
}

function getTuneBreakDescription(skill: ApiSkill | undefined): string {
  return formatTuneBreakDescription(skill?.SkillDescribe ?? "");
}

function getDefaultTuneBreakAttack(weaponTypeName: string): SkillAttackData["attacks"] {
  const talent = TUNE_BREAK_WEAPON_TALENTS[weaponTypeName];
  if (!talent) {
    throw new Error(`Unknown weapon type for Tune Break default: ${weaponTypeName}`);
  }

  return [
    {
      key: "TuneBreakDMG",
      label: "Tune Break DMG",
      talent,
      type: "TuneBreak",
    },
  ];
}

export function buildTuneBreakAttackData(
  detail: ApiCharacterDetail,
): SkillAttackData {
  const skill = getTuneBreakSkill(detail);
  const name = getTuneBreakName(skill);
  const description = getTuneBreakDescription(skill);

  if (skill && hasCustomTuneBreakAttacks(skill)) {
    const { byAttributeName } = resolveSkillAttackMetadata(skill);
    return {
      name,
      description,
      attacks: buildAttacksFromAttributes(skill, byAttributeName),
    };
  }

  return {
    name,
    description,
    attacks: getDefaultTuneBreakAttack(detail.WeaponTypeName),
  };
}

export function formatTuneBreakAttacksFileContent(
  detail: ApiCharacterDetail,
): string {
  return formatSkillAttackFileContent(
    "tuneBreakAttacks",
    buildTuneBreakAttackData(detail),
  );
}

export function getTuneBreakGenerationNotices(
  detail: ApiCharacterDetail,
): string[] {
  const skill = getTuneBreakSkill(detail);
  if (skill) {
    return [];
  }

  return [
    "tuneBreakAttacks.ts: No Tune Break skill found in API — generated weapon-default attacks. Review name and description manually.",
  ];
}
