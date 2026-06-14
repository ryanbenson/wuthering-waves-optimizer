import type { ApiDamageListEntry, ApiSkill } from "./api.js";

export interface AttackMetadata {
  type: string;
  subType?: string;
}

export interface SkillAttackMetadataResult {
  byAttributeName: Map<string, AttackMetadata>;
  notices: string[];
}

const DAMAGE_TYPE_MAP: Record<string, string> = {
  "Basic Attack": "Basic",
  "Heavy Attack": "Heavy",
  "Echo Skill": "Echo",
  "Resonance Liberation": "Liberation",
  "Resonance Skill": "Skill",
  "Intro Skill": "Intro",
};

const SUBTYPE_MAP: Record<string, string> = {
  "Spectro Frazzle": "SpectroFrazzle",
  "Aero Erosion": "AeroErosion",
  "Glacio Chafe": "GlacioChafe",
  Hack: "Hack",
  "Electro Flare": "ElectroFlare",
};

const SKIPPED_ATTRIBUTE_PATTERNS = [
  "STA Cost",
  "Concerto Regen",
  "Resonance Cost",
  "Cooldown",
  "Duration",
];

function ratesMatch(apiRate: string | undefined, talentPercent: string): boolean {
  if (apiRate === undefined) {
    return false;
  }

  return (
    Number.parseFloat(apiRate.replace("%", "")).toFixed(2) ===
    Number.parseFloat(talentPercent.replace("%", "")).toFixed(2)
  );
}

export function parseTalentPercents(talent: string): string[] {
  const percents: string[] = [];

  for (const segment of talent.split("+")) {
    const match = segment.match(/(\d+(?:\.\d+)?)%/);
    if (match) {
      percents.push(`${Number.parseFloat(match[1]).toFixed(2)}%`);
    }
  }

  return percents;
}

function mapDamageType(apiType: string): string | undefined {
  return DAMAGE_TYPE_MAP[apiType];
}

function mapSubType(apiSubType: string | undefined): string | undefined {
  if (!apiSubType) {
    return undefined;
  }

  return SUBTYPE_MAP[apiSubType];
}

function deriveAttackMetadata(
  matched: ApiDamageListEntry[],
): { metadata?: AttackMetadata; notice?: string } {
  if (matched.length === 0) {
    return {};
  }

  const apiTypes = [...new Set(matched.map((entry) => entry.Type))];

  if (apiTypes.some((type) => !type)) {
    return {
      notice: "DamageList entry has empty Type",
    };
  }

  const mappedTypes = apiTypes.map((type) => mapDamageType(type));

  if (mappedTypes.some((type) => type === undefined)) {
    return {
      notice: `Unknown DamageList type(s): ${apiTypes.join(", ")}`,
    };
  }

  const uniqueMappedTypes = [...new Set(mappedTypes as string[])];
  if (uniqueMappedTypes.length !== 1) {
    return {
      notice: `Mixed DamageList types: ${apiTypes.join(", ")}`,
    };
  }

  const apiSubTypes = [
    ...new Set(matched.map((entry) => entry.SubType).filter(Boolean)),
  ];
  const mappedSubTypes = apiSubTypes.map((subType) => mapSubType(subType));

  if (mappedSubTypes.some((subType) => subType === undefined)) {
    return {
      notice: `Unknown DamageList subType(s): ${apiSubTypes.join(", ")}`,
    };
  }

  const uniqueMappedSubTypes = [...new Set(mappedSubTypes as string[])];
  if (uniqueMappedSubTypes.length > 1) {
    return {
      notice: `Mixed DamageList subTypes: ${apiSubTypes.join(", ")}`,
    };
  }

  return {
    metadata: {
      type: uniqueMappedTypes[0],
      ...(uniqueMappedSubTypes[0] ? { subType: uniqueMappedSubTypes[0] } : {}),
    },
  };
}

function isSkippedAttribute(attributeName: string): boolean {
  return SKIPPED_ATTRIBUTE_PATTERNS.some((pattern) =>
    attributeName.includes(pattern),
  );
}

export function resolveSkillAttackMetadata(
  skill: ApiSkill,
): SkillAttackMetadataResult {
  const byAttributeName = new Map<string, AttackMetadata>();
  const notices: string[] = [];
  const remaining = [...(skill.DamageList ?? [])];

  for (const attribute of skill.SkillAttributes) {
    if (!attribute.values?.length || isSkippedAttribute(attribute.attributeName)) {
      continue;
    }

    const talent = attribute.values[0];
    const percents = parseTalentPercents(talent);
    if (percents.length === 0) {
      continue;
    }

    const matched: ApiDamageListEntry[] = [];
    for (const percent of percents) {
      const matchIndex = remaining.findIndex((entry) =>
        ratesMatch(entry.RateLv?.[0], percent),
      );

      if (matchIndex === -1) {
        notices.push(
          `Could not match DamageList entry for "${attribute.attributeName}" (${talent}) — missing ${percent}. Review type/subType manually.`,
        );
        break;
      }

      matched.push(remaining[matchIndex]);
      remaining.splice(matchIndex, 1);
    }

    if (matched.length !== percents.length) {
      continue;
    }

    const derived = deriveAttackMetadata(matched);
    if (derived.notice) {
      notices.push(
        `${derived.notice} for "${attribute.attributeName}" (${talent}). Review type/subType manually.`,
      );
      continue;
    }

    if (derived.metadata) {
      byAttributeName.set(attribute.attributeName, derived.metadata);
    }
  }

  return { byAttributeName, notices };
}

export function getDefaultAttackType(skillType: string): string {
  if (skillType === "Outro Skill") {
    return "Outro";
  }

  if (skillType === "Intro Skill") {
    return "Intro";
  }

  if (skillType === "Resonance Skill") {
    return "Skill";
  }

  if (skillType === "Resonance Liberation") {
    return "Liberation";
  }

  return "Basic";
}
