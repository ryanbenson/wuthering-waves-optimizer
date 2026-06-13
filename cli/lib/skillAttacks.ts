import type { ApiCharacterDetail, ApiSkill } from "./api.js";
import { toAttackKey } from "./naming.js";

interface AttackTalents {
  [level: string]: string;
}

interface AttackWithTalents {
  key: string;
  label: string;
  talents: AttackTalents;
  type: string;
}

interface AttackWithTalent {
  key: string;
  label: string;
  talent: string;
  type: string;
}

type GeneratedAttack = AttackWithTalents | AttackWithTalent;

export interface SkillAttackData {
  name: string;
  description: string;
  attacks: GeneratedAttack[];
}

const SKILL_TYPE_TO_EXPORT: Record<string, string> = {
  "Normal Attack": "basicAttacks",
  "Resonance Skill": "skillAttacks",
  "Resonance Liberation": "liberationAttacks",
  "Intro Skill": "introAttacks",
  "Forte Circuit": "forteCircuitAttacks",
  "Outro Skill": "outroAttacks",
};

const SKILL_ATTACK_EXPORTS = Object.values(SKILL_TYPE_TO_EXPORT);

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

function buildTalents(values: string[]): AttackTalents {
  const talents: AttackTalents = {};
  for (let index = 0; index < Math.min(values.length, 10); index += 1) {
    talents[String(index + 1)] = values[index];
  }
  return talents;
}

function looksLikeOutroDamageTalent(talent: string): boolean {
  if (talent.includes("+") || talent.includes("*")) {
    return true;
  }

  const numeric = Number.parseFloat(talent.replace("%", ""));
  return !Number.isNaN(numeric) && numeric >= 100;
}

function getOutroCompoundTalent(
  detailNum: string[],
): string | undefined {
  for (let index = 0; index < detailNum.length; index += 1) {
    const value = detailNum[index];
    const nextValue = detailNum[index + 1];
    if (
      value.includes("%") &&
      nextValue !== undefined &&
      !nextValue.includes("%") &&
      /^\d+(\.\d+)?$/.test(nextValue)
    ) {
      const percentValue = Number.parseFloat(value.replace("%", ""));
      if (
        !Number.isNaN(percentValue) &&
        percentValue <= 30 &&
        Number.parseFloat(nextValue) >= 4 &&
        Number.parseFloat(nextValue) <= 30
      ) {
        const talent = `${value}*${nextValue}`;
        return looksLikeOutroDamageTalent(talent) ? talent : undefined;
      }
    }
  }

  return undefined;
}

function getOutroAttackLabel(
  skillName: string,
  index: number,
  total: number,
): string {
  if (index === 0) {
    return `${skillName} DMG`;
  }

  if (total === 2) {
    return `${skillName} Additional DMG`;
  }

  return `${skillName} Additional DMG ${index + 1}`;
}

function getOutroAttacksFromDetailNum(skill: ApiSkill): AttackWithTalent[] {
  const detailNum = skill.SkillDetailNum;
  if (!detailNum?.length) {
    return [];
  }

  const compoundTalent = getOutroCompoundTalent(detailNum);
  if (compoundTalent !== undefined) {
    const label = `${skill.SkillName} DMG`;
    return [
      {
        key: toAttackKey(label),
        label,
        talent: compoundTalent,
        type: "Basic",
      },
    ];
  }

  const damageTalents = detailNum.filter(
    (value) => value.includes("%") && looksLikeOutroDamageTalent(value),
  );

  return damageTalents.map((talent, index) => {
    const label = getOutroAttackLabel(skill.SkillName, index, damageTalents.length);
    return {
      key: toAttackKey(label),
      label,
      talent,
      type: "Basic",
    };
  });
}

function buildAttacksFromAttributes(
  attributes: ApiSkill["SkillAttributes"],
): AttackWithTalents[] {
  return attributes
    .filter((attribute) => attribute.values?.length)
    .map((attribute) => ({
      key: toAttackKey(attribute.attributeName),
      label: attribute.attributeName,
      talents: buildTalents(attribute.values ?? []),
      type: "Basic",
    }));
}

function buildOutroAttacks(skill: ApiSkill): GeneratedAttack[] {
  const attributeAttacks = buildAttacksFromAttributes(skill.SkillAttributes);
  if (attributeAttacks.length > 0) {
    return attributeAttacks;
  }

  return getOutroAttacksFromDetailNum(skill);
}

function buildAttacksForSkill(skill: ApiSkill): GeneratedAttack[] {
  if (skill.SkillType === "Outro Skill") {
    return buildOutroAttacks(skill);
  }

  return buildAttacksFromAttributes(skill.SkillAttributes);
}

function buildSkillAttackData(skill: ApiSkill): SkillAttackData {
  return {
    name: `${skill.SkillType}: ${skill.SkillName}`,
    description: decodeHtml(skill.SkillDescribe ?? ""),
    attacks: buildAttacksForSkill(skill),
  };
}

function formatTalents(talents: AttackTalents): string {
  const lines = Object.entries(talents).map(
    ([level, value]) => `        "${level}": ${JSON.stringify(value)},`,
  );
  return `      talents: {\n${lines.join("\n")}\n      },`;
}

function formatAttack(
  attack: GeneratedAttack,
  index: number,
  total: number,
): string {
  const lines = [
    "    {",
    `      key: ${JSON.stringify(attack.key)},`,
    `      label: ${JSON.stringify(attack.label)},`,
  ];

  if ("talents" in attack) {
    lines.push(formatTalents(attack.talents));
  } else {
    lines.push(`      talent: ${JSON.stringify(attack.talent)},`);
  }

  lines.push(`      type: ${JSON.stringify(attack.type)},`);
  lines.push(`    }${index < total - 1 ? "," : ""}`);
  return lines.join("\n");
}

export function formatSkillAttackFileContent(
  exportName: string,
  data: SkillAttackData,
): string {
  const attackBlocks = data.attacks
    .map((attack, index) => formatAttack(attack, index, data.attacks.length))
    .join("\n");

  const attacksContent =
    data.attacks.length > 0 ? `\n${attackBlocks}\n  ` : "";

  return `export const ${exportName} = {
  name: ${JSON.stringify(data.name)},
  description: ${formatTemplateString(data.description)},
  attacks: [${attacksContent}],
};
`;
}

function getEmptySkillAttackData(): SkillAttackData {
  return {
    name: "",
    description: "",
    attacks: [],
  };
}

export function getSkillGenerationNotices(
  detail: ApiCharacterDetail,
): string[] {
  const outroSkill = detail.Skills.find(
    (skill) => skill.SkillType === "Outro Skill",
  );
  if (outroSkill === undefined) {
    return [];
  }

  const hasAttributeAttacks = outroSkill.SkillAttributes.some(
    (attribute) => attribute.values?.length,
  );
  if (hasAttributeAttacks) {
    return [];
  }

  const outroAttacks = getOutroAttacksFromDetailNum(outroSkill);
  if (outroAttacks.length <= 1) {
    return [];
  }

  const attackSummary = outroAttacks
    .map((attack) => `${attack.label} (${attack.talent})`)
    .join(", ");

  return [
    `Outro skill "${outroSkill.SkillName}" has ${outroAttacks.length} attacks from SkillDetailNum. Review outroAttacks.ts manually — keys and labels may not match your usual "${outroSkill.SkillName}" naming. Generated: ${attackSummary}.`,
  ];
}

export function buildSkillAttackFiles(
  detail: ApiCharacterDetail,
): Record<string, string> {
  const skillDataByExport = Object.fromEntries(
    SKILL_ATTACK_EXPORTS.map((exportName) => [
      exportName,
      getEmptySkillAttackData(),
    ]),
  ) as Record<string, SkillAttackData>;

  for (const skill of detail.Skills) {
    const exportName = SKILL_TYPE_TO_EXPORT[skill.SkillType];
    if (exportName === undefined) {
      continue;
    }

    skillDataByExport[exportName] = buildSkillAttackData(skill);
  }

  return Object.fromEntries(
    SKILL_ATTACK_EXPORTS.map((exportName) => [
      `${exportName}.ts`,
      formatSkillAttackFileContent(exportName, skillDataByExport[exportName]),
    ]),
  );
}
