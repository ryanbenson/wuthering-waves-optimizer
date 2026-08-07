export type TalentLevels = Record<string, string | number | undefined>;

export interface EchoSetPassiveModifierItem {
  modifier?: string;
  modifierValue?: unknown;
  modifierValueTalentRef?: string;
  modifierTalentKey?: string;
  modifierValueCalculated?: number;
  modifySpecificTalents?: unknown[];
  specificCharacters?: string[];
  [k: string]: unknown;
}

export interface EchoSetPassiveConfigEntry {
  isEnabled?: boolean;
  stacks?: number;
}

export interface EchoSetPassiveResult {
  key: string;
  stats: Record<string, unknown>;
}

function talentModifierValue(
  modifierItem: EchoSetPassiveModifierItem,
  talentRefRaw: string | number | undefined,
): number | undefined {
  const map = modifierItem.modifierValue as Record<string, number> | undefined;
  if (!map) return undefined;
  return map[String(talentRefRaw ?? "10")];
}

/**
 * Resolves a single echo set passive definition + its stored toggle/stack
 * config into a numeric buff stats object. Mirrors CalculatorEchoSetPassive.vue's
 * `buffStats` computed exactly.
 */
export function resolveEchoSetPassiveInstance(
  key: string,
  modifiers: EchoSetPassiveModifierItem[],
  config: EchoSetPassiveConfigEntry | undefined,
  hasStacks: boolean,
  alwaysEnabled: boolean,
  talentData: TalentLevels,
): EchoSetPassiveResult {
  const isEnabled = alwaysEnabled ? true : (config?.isEnabled ?? false);
  const data: Record<string, unknown> = {};
  if (!isEnabled) {
    return { key, stats: data };
  }

  if (!hasStacks) {
    modifiers.forEach((modifierItem) => {
      if (modifierItem?.modifySpecificTalents) {
        if (!data.modifySpecificTalents) {
          data.modifySpecificTalents = [];
        }
        modifierItem.modifierValueCalculated = Number(modifierItem.modifierValue);
        (data.modifySpecificTalents as EchoSetPassiveModifierItem[]).push(modifierItem);
      } else if (modifierItem.modifier === "Talent") {
        const talentRef =
          talentData?.[modifierItem.modifierValueTalentRef ?? ""] ?? "10";
        const talentVal = talentModifierValue(modifierItem, talentRef);
        if (modifierItem.modifierTalentKey != null && talentVal != null) {
          data[modifierItem.modifierTalentKey] = talentVal;
        }
      } else if (modifierItem.modifier === "EnableAttack") {
        data[modifierItem.modifier] = modifierItem.modifierValue;
      } else if (modifierItem.modifier === "talentModifierMultiply") {
        if (!data.talentModifierMultiply) {
          data.talentModifierMultiply = [];
        }
        (data.talentModifierMultiply as EchoSetPassiveModifierItem[]).push(modifierItem);
      } else if (modifierItem.modifier?.includes("AdditionalBase")) {
        return;
      } else if (modifierItem.modifier) {
        data[modifierItem.modifier] = modifierItem.modifierValue;
      }
    });
    return { key, stats: data };
  }

  const stacks = config?.stacks ?? 0;
  if (stacks === 0) {
    return { key, stats: data };
  }
  modifiers.forEach((modifierItem) => {
    if (modifierItem?.modifySpecificTalents) {
      if (!data.modifySpecificTalents) {
        data.modifySpecificTalents = [];
      }
      modifierItem.modifierValueCalculated = Number(modifierItem.modifierValue) * stacks;
      (data.modifySpecificTalents as EchoSetPassiveModifierItem[]).push(modifierItem);
    } else if (modifierItem.modifier === "Talent") {
      const talentRef =
        talentData?.[modifierItem.modifierValueTalentRef ?? ""] ?? "10";
      const talentVal = talentModifierValue(modifierItem, talentRef);
      if (modifierItem.modifierTalentKey != null && talentVal != null) {
        data[modifierItem.modifierTalentKey] = talentVal * stacks;
      }
    } else if (modifierItem.modifier?.includes("AdditionalBase")) {
      return;
    } else if (modifierItem.modifier) {
      const totalValue = Number(modifierItem.modifierValue) * stacks;
      data[modifierItem.modifier] = totalValue;
    }
  });
  return { key, stats: data };
}

/**
 * Aggregates already-resolved echo set passive instances into the final
 * stats object. Mirrors the identical `buffsFormatted` computed shared by
 * CalculatorEchoesSetBonusOnePiece/One/Two.vue exactly (including the
 * pre-existing quirk that any non-numeric stat value, e.g. an array under
 * `modifySpecificTalents`, coerces to 0 here rather than being merged).
 */
export function aggregateEchoSetPassiveStats(
  passiveResults: EchoSetPassiveResult[],
): Record<string, unknown> {
  const finalBuffData: Record<string, unknown> = {};
  for (const { stats } of passiveResults) {
    Object.entries(stats).forEach(([stat, value]) => {
      if (stat === "EnableAttack") {
        finalBuffData[stat] = value;
      } else {
        const prev = finalBuffData[stat];
        const num = typeof value === "number" ? value : Number(value) || 0;
        finalBuffData[stat] = (typeof prev === "number" ? prev : 0) + num;
      }
    });
  }
  return finalBuffData;
}
