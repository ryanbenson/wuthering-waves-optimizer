export interface WeaponPassiveDef {
  key: string;
  hasStacks?: boolean;
  modifier?: string;
  modifierByRefinement?: Record<string, number>;
  minStacks?: number;
  maxStacks?: number;
  alwaysEnabled?: boolean;
  details?: string;
  [k: string]: unknown;
}

export interface WeaponPassiveConfigEntry {
  isEnabled?: boolean;
  stacks?: number;
}

export interface WeaponPassiveInstanceResult {
  key?: string;
  stat?: string;
  value: number;
  stacks: number;
  valueBeforeStacks: number;
  modifier?: string;
  modifySpecificTalents?: string[];
  modifierValueCalculated?: number;
}

/**
 * Resolves a single weapon passive definition + its stored toggle/stack config
 * into a numeric buff instance. Mirrors CalculatorWeaponsPassive.vue's
 * `weaponPassiveStats` computed exactly.
 */
export function resolveWeaponPassiveInstance(
  passive: WeaponPassiveDef,
  config: WeaponPassiveConfigEntry | undefined,
  refinement: string,
): WeaponPassiveInstanceResult {
  const isEnabled = passive.alwaysEnabled ? true : (config?.isEnabled ?? false);
  const data: WeaponPassiveInstanceResult = {
    stat: passive.modifier,
    value: 0,
    key: passive.key,
    stacks: 0,
    valueBeforeStacks: 0,
  };
  if (!isEnabled) {
    return data;
  }
  const refKey = refinement ?? "1";
  const byRef = passive.modifierByRefinement ?? {};
  if (!passive.hasStacks) {
    data.value = byRef[refKey] ?? 0;
    return data;
  }
  const stacks = config?.stacks ?? 0;
  if (stacks === 0) {
    return data;
  }
  data.stacks = stacks;
  data.valueBeforeStacks = byRef[refKey] ?? 0;
  data.value = (byRef[refKey] ?? 0) * stacks;
  return data;
}

/**
 * Aggregates already-resolved weapon passive instances into the final
 * `weaponPassiveStats` object consumed by calculateAllStats. Mirrors
 * CalculatorWeapons.vue's `buffsFormatted` computed exactly, including the
 * Stringmaster special case.
 */
export function aggregateWeaponPassiveStats(
  weaponKey: string | null | undefined,
  resolvedPassives: WeaponPassiveInstanceResult[],
): Record<string, unknown> {
  const finalBuffData: Record<string, unknown> = {};
  let modifySpecificTalents: WeaponPassiveInstanceResult[] = [];
  const allBuffs = [...resolvedPassives];

  if (weaponKey === "Stringmaster") {
    const allElementPassive = allBuffs.find(
      (passive) => passive.key === "StringmasterAllElementAttributeBonus",
    );
    const stringmasterBuffs: Record<string, unknown> = {};
    if (allElementPassive?.stat !== undefined) {
      stringmasterBuffs[allElementPassive.stat as string] = allElementPassive.value;
    }
    const firstStringmasterPassive = resolvedPassives.find(
      (passive) => passive.key === "StringmasterATK1",
    );
    const secondStringmasterPassive = resolvedPassives.find(
      (passive) => passive.key === "StringmasterATK2",
    );
    if (!firstStringmasterPassive) {
      return stringmasterBuffs;
    }
    const firstPassiveValuePreStacks = firstStringmasterPassive.valueBeforeStacks ?? 0;
    const firstPassiveStacks = firstStringmasterPassive.stacks ?? 0;
    const secondPassiveValue = secondStringmasterPassive?.value ?? 0;
    const finalStringmasterPassiveValue =
      (firstPassiveValuePreStacks + secondPassiveValue) * firstPassiveStacks;
    const atkStat = firstStringmasterPassive.stat as string;
    stringmasterBuffs[atkStat] = finalStringmasterPassiveValue;
    return stringmasterBuffs;
  }

  allBuffs.forEach((buffInstance) => {
    const stat = buffInstance.stat;
    const value = buffInstance.value;
    if (stat === "modifySpecificTalents") {
      modifySpecificTalents = modifySpecificTalents.concat(
        value as unknown as WeaponPassiveInstanceResult[],
      );
    } else if (stat) {
      finalBuffData[stat] = ((finalBuffData[stat] as number) || 0) + (value as number);
    }
  });

  if (modifySpecificTalents.length > 0) {
    const specificTalentBuffs: Record<string, number> = {};
    modifySpecificTalents.forEach((buffInstance) => {
      const talentKeys = buffInstance?.modifySpecificTalents ?? [];
      talentKeys.forEach((talent) => {
        let talentName = talent;
        if (buffInstance?.modifier) {
          talentName = `${talentName}:${buffInstance.modifier}`;
        }
        specificTalentBuffs[talentName] =
          (specificTalentBuffs[talentName] || 0) + (buffInstance.modifierValueCalculated ?? 0);
      });
    });
    finalBuffData.specificTalentBuffs = specificTalentBuffs;
  }

  return finalBuffData;
}

/**
 * Convenience wrapper for headless (non-UI) callers: resolves every passive
 * definition against its stored config, then aggregates the result.
 */
export function computeWeaponPassiveStats(
  weaponKey: string | null | undefined,
  passives: WeaponPassiveDef[],
  config: Record<string, WeaponPassiveConfigEntry> | undefined,
  refinement: string,
): Record<string, unknown> {
  const resolved = passives.map((passive) =>
    resolveWeaponPassiveInstance(passive, config?.[passive.key], refinement),
  );
  return aggregateWeaponPassiveStats(weaponKey, resolved);
}
