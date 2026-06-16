import type { ApiDamageListEntry, ApiSkill } from "./api.js";

export interface AttackMetadata {
  type: string;
  subType?: string;
  attribute?: string;
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

const PROPERTY_NAME_MAP: Record<string, string | undefined> = {
  ATK: undefined,
  Attack: undefined,
  HP: "hp",
  DEF: "defense",
  Defense: "defense",
  "Energy Regen": "EnergyRegen",
};

const DMG_TYPE_TO_ATTACK_TYPE: Record<string, string> = {
  Heal: "Healing",
  Shield: "Shield",
};

const SKIPPED_ATTRIBUTE_PATTERNS = [
  "STA Cost",
  "Concerto Regen",
  "Resonance Cost",
  "Energy Cost",
  "Cooldown",
  "Duration",
  "Damage Reduction",
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
  const segments = talent.split("+");

  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index];
    const explicitMatch = segment.match(/(\d+(?:\.\d+)?)%/);
    if (explicitMatch) {
      percents.push(`${Number.parseFloat(explicitMatch[1]).toFixed(2)}%`);
      continue;
    }

    if (index === 0) {
      continue;
    }

    const implicitMatch = segment.match(/(\d+(?:\.\d+)?)/);
    if (!implicitMatch) {
      continue;
    }

    const value = Number.parseFloat(implicitMatch[1]);
    if (value <= 200) {
      percents.push(`${value.toFixed(2)}%`);
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

function deriveAttributeMetadata(
  matched: ApiDamageListEntry[],
): { attribute?: string; notice?: string } {
  const propertyNames = [
    ...new Set(matched.map((entry) => entry.PropertyName).filter(Boolean)),
  ] as string[];

  if (propertyNames.length === 0) {
    return {};
  }

  const unknownPropertyNames = propertyNames.filter(
    (propertyName) => !(propertyName in PROPERTY_NAME_MAP),
  );
  if (unknownPropertyNames.length > 0) {
    return {
      notice: `Unknown DamageList PropertyName(s): ${unknownPropertyNames.join(", ")}`,
    };
  }

  const mappedAttributes = propertyNames
    .map((propertyName) => PROPERTY_NAME_MAP[propertyName])
    .filter((attribute): attribute is string => attribute !== undefined);

  const uniqueAttributes = [...new Set(mappedAttributes)];
  if (uniqueAttributes.length > 1) {
    return {
      notice: `Mixed DamageList PropertyNames: ${propertyNames.join(", ")}`,
    };
  }

  return uniqueAttributes[0] ? { attribute: uniqueAttributes[0] } : {};
}

function deriveTypeFromDamageListType(
  matched: ApiDamageListEntry[],
): { type?: string; subType?: string; notice?: string } {
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
    type: uniqueMappedTypes[0],
    ...(uniqueMappedSubTypes[0] ? { subType: uniqueMappedSubTypes[0] } : {}),
  };
}

function deriveAttackMetadata(
  matched: ApiDamageListEntry[],
): { metadata?: AttackMetadata; notice?: string } {
  if (matched.length === 0) {
    return {};
  }

  const dmgTypes = [
    ...new Set(matched.map((entry) => entry.DmgType ?? "Damage")),
  ];

  if (dmgTypes.some((dmgType) => !(dmgType in DMG_TYPE_TO_ATTACK_TYPE) && dmgType !== "Damage")) {
    return {
      notice: `Unknown DamageList DmgType(s): ${dmgTypes.join(", ")}`,
    };
  }

  const overrideTypes = dmgTypes
    .map((dmgType) => DMG_TYPE_TO_ATTACK_TYPE[dmgType])
    .filter(Boolean);
  const uniqueOverrideTypes = [...new Set(overrideTypes)];

  if (uniqueOverrideTypes.length > 1) {
    return {
      notice: `Mixed DamageList DmgTypes: ${dmgTypes.join(", ")}`,
    };
  }

  if (dmgTypes.includes("Damage") && overrideTypes.length > 0) {
    return {
      notice: `Mixed DamageList DmgTypes: ${dmgTypes.join(", ")}`,
    };
  }

  const attributeResult = deriveAttributeMetadata(matched);
  if (attributeResult.notice) {
    return { notice: attributeResult.notice };
  }

  if (uniqueOverrideTypes.length === 1) {
    return {
      metadata: {
        type: uniqueOverrideTypes[0],
        ...(attributeResult.attribute ? { attribute: attributeResult.attribute } : {}),
      },
    };
  }

  const typeResult = deriveTypeFromDamageListType(matched);
  if (typeResult.notice) {
    return { notice: typeResult.notice };
  }

  return {
    metadata: {
      type: typeResult.type!,
      ...(typeResult.subType ? { subType: typeResult.subType } : {}),
      ...(attributeResult.attribute ? { attribute: attributeResult.attribute } : {}),
    },
  };
}

export function inferAttackMetadataFromAttributeName(
  attributeName: string,
): AttackMetadata | undefined {
  if (attributeName.includes("Healing") || attributeName.toLowerCase().includes("hp recovery")) {
    return { type: "Healing" };
  }

  if (
    attributeName.endsWith(" Shield") ||
    attributeName === "Shield" ||
    (attributeName.includes("Shield") &&
      !attributeName.includes("Shield Duration") &&
      !attributeName.includes("Shield Damage Reduction") &&
      !attributeName.includes("Shield Healing"))
  ) {
    return { type: "Shield" };
  }

  return undefined;
}

function attributeFromPropertyNames(
  propertyNames: string[],
): { attribute?: string; notice?: string } {
  if (propertyNames.length === 0) {
    return {};
  }

  const unknownPropertyNames = propertyNames.filter(
    (propertyName) => !(propertyName in PROPERTY_NAME_MAP),
  );
  if (unknownPropertyNames.length > 0) {
    return {};
  }

  const mappedAttributes = propertyNames
    .map((propertyName) => PROPERTY_NAME_MAP[propertyName])
    .filter((attribute): attribute is string => attribute !== undefined);

  const uniqueAttributes = [...new Set(mappedAttributes)];
  return uniqueAttributes.length === 1
    ? { attribute: uniqueAttributes[0] }
    : {};
}

export function inferSkillHealShieldAttribute(
  skill: ApiSkill,
): string | undefined {
  const healPropertyNames = [
    ...new Set(
      (skill.DamageList ?? [])
        .filter((entry) => entry.DmgType === "Heal")
        .map((entry) => entry.PropertyName)
        .filter(Boolean),
    ),
  ] as string[];

  return attributeFromPropertyNames(healPropertyNames).attribute;
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
          `Could not match DamageList entry for "${attribute.attributeName}" (${talent}) — missing ${percent}. Review type/subType/attribute manually.`,
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
        `${derived.notice} for "${attribute.attributeName}" (${talent}). Review type/subType/attribute manually.`,
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

  if (skillType === "Tune Break") {
    return "TuneBreak";
  }

  return "Basic";
}
